// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title HelpHiveEscrow
 * @dev Smart contract for escrow payments in the HelpHive marketplace
 * Handles secure payments between task posters and helpers
 */
contract HelpHiveEscrow is ReentrancyGuard, Ownable, Pausable {
    
    enum EscrowState {
        CREATED,
        FUNDED,
        COMPLETED,
        DISPUTED,
        REFUNDED,
        RELEASED
    }
    
    struct Escrow {
        uint256 taskId;
        address poster;        // Task poster (payer)
        address helper;        // Task helper (payee)
        uint256 amount;        // Escrow amount
        uint256 platformFee;   // Platform fee
        EscrowState state;
        uint256 createdAt;
        uint256 completedAt;
        bool posterConfirmed;  // Poster confirmed completion
        bool helperConfirmed;  // Helper confirmed completion
    }
    
    // State variables
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => bool) public taskHasEscrow;
    uint256 public nextEscrowId = 1;
    uint256 public platformFeePercentage = 300; // 3% (in basis points)
    address public feeRecipient;
    
    // Dispute resolution
    mapping(uint256 => address) public disputeResolver;
    uint256 public disputeTimeoutDuration = 7 days;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed taskId,
        address indexed poster,
        address helper,
        uint256 amount,
        uint256 platformFee
    );
    
    event EscrowFunded(uint256 indexed escrowId, uint256 amount);
    event EscrowCompleted(uint256 indexed escrowId, address confirmedBy);
    event EscrowReleased(uint256 indexed escrowId, uint256 amount);
    event EscrowRefunded(uint256 indexed escrowId, uint256 amount);
    event EscrowDisputed(uint256 indexed escrowId, address disputedBy);
    event DisputeResolved(uint256 indexed escrowId, bool releasedToHelper);
    
    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }
    
    modifier onlyPosterOrHelper(uint256 escrowId) {
        Escrow storage escrow = escrows[escrowId];
        require(
            msg.sender == escrow.poster || msg.sender == escrow.helper,
            "Only poster or helper can call this function"
        );
        _;
    }
    
    modifier validEscrow(uint256 escrowId) {
        require(escrowId > 0 && escrowId < nextEscrowId, "Invalid escrow ID");
        _;
    }
    
    /**
     * @dev Create and fund an escrow for a task
     * @param taskId The ID of the task
     * @param helper The address of the helper
     */
    function createAndFundEscrow(
        uint256 taskId,
        address helper
    ) external payable nonReentrant whenNotPaused {
        require(helper != address(0), "Invalid helper address");
        require(helper != msg.sender, "Helper cannot be the poster");
        require(msg.value > 0, "Amount must be greater than 0");
        require(!taskHasEscrow[taskId], "Task already has an escrow");
        
        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 escrowAmount = msg.value - platformFee;
        
        uint256 escrowId = nextEscrowId++;
        
        escrows[escrowId] = Escrow({
            taskId: taskId,
            poster: msg.sender,
            helper: helper,
            amount: escrowAmount,
            platformFee: platformFee,
            state: EscrowState.FUNDED,
            createdAt: block.timestamp,
            completedAt: 0,
            posterConfirmed: false,
            helperConfirmed: false
        });
        
        taskHasEscrow[taskId] = true;
        
        // Transfer platform fee immediately
        payable(feeRecipient).transfer(platformFee);
        
        emit EscrowCreated(escrowId, taskId, msg.sender, helper, escrowAmount, platformFee);
        emit EscrowFunded(escrowId, escrowAmount);
    }
    
    /**
     * @dev Mark task as completed by either poster or helper
     * @param escrowId The escrow ID
     */
    function markCompleted(uint256 escrowId) 
        external 
        validEscrow(escrowId) 
        onlyPosterOrHelper(escrowId) 
        whenNotPaused 
    {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.state == EscrowState.FUNDED, "Escrow must be funded");
        
        if (msg.sender == escrow.poster) {
            escrow.posterConfirmed = true;
        } else {
            escrow.helperConfirmed = true;
        }
        
        emit EscrowCompleted(escrowId, msg.sender);
        
        // If both parties confirmed, auto-release
        if (escrow.posterConfirmed && escrow.helperConfirmed) {
            _releaseEscrow(escrowId);
        } else {
            escrow.state = EscrowState.COMPLETED;
            escrow.completedAt = block.timestamp;
        }
    }
    
    /**
     * @dev Release escrow funds to helper
     * @param escrowId The escrow ID
     */
    function releaseEscrow(uint256 escrowId) 
        external 
        validEscrow(escrowId) 
        whenNotPaused 
    {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.poster, "Only poster can release escrow");
        require(
            escrow.state == EscrowState.FUNDED || escrow.state == EscrowState.COMPLETED,
            "Invalid escrow state"
        );
        
        _releaseEscrow(escrowId);
    }
    
    /**
     * @dev Internal function to release escrow
     * @param escrowId The escrow ID
     */
    function _releaseEscrow(uint256 escrowId) internal {
        Escrow storage escrow = escrows[escrowId];
        escrow.state = EscrowState.RELEASED;
        
        uint256 amount = escrow.amount;
        payable(escrow.helper).transfer(amount);
        
        emit EscrowReleased(escrowId, amount);
    }
    
    /**
     * @dev Initiate a dispute
     * @param escrowId The escrow ID
     */
    function initiateDispute(uint256 escrowId) 
        external 
        validEscrow(escrowId) 
        onlyPosterOrHelper(escrowId) 
        whenNotPaused 
    {
        Escrow storage escrow = escrows[escrowId];
        require(
            escrow.state == EscrowState.FUNDED || escrow.state == EscrowState.COMPLETED,
            "Invalid state for dispute"
        );
        
        escrow.state = EscrowState.DISPUTED;
        disputeResolver[escrowId] = owner(); // Platform owner resolves disputes
        
        emit EscrowDisputed(escrowId, msg.sender);
    }
    
    /**
     * @dev Resolve a dispute (only dispute resolver)
     * @param escrowId The escrow ID
     * @param releaseToHelper True to release to helper, false to refund to poster
     */
    function resolveDispute(uint256 escrowId, bool releaseToHelper) 
        external 
        validEscrow(escrowId) 
        whenNotPaused 
    {
        require(msg.sender == disputeResolver[escrowId], "Only dispute resolver can resolve");
        Escrow storage escrow = escrows[escrowId];
        require(escrow.state == EscrowState.DISPUTED, "Not in disputed state");
        
        if (releaseToHelper) {
            _releaseEscrow(escrowId);
        } else {
            _refundEscrow(escrowId);
        }
        
        emit DisputeResolved(escrowId, releaseToHelper);
    }
    
    /**
     * @dev Refund escrow to poster (emergency function)
     * @param escrowId The escrow ID
     */
    function refundEscrow(uint256 escrowId) 
        external 
        validEscrow(escrowId) 
        onlyOwner 
        whenNotPaused 
    {
        _refundEscrow(escrowId);
    }
    
    /**
     * @dev Internal function to refund escrow
     * @param escrowId The escrow ID
     */
    function _refundEscrow(uint256 escrowId) internal {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.state != EscrowState.RELEASED && escrow.state != EscrowState.REFUNDED, "Already finalized");
        
        escrow.state = EscrowState.REFUNDED;
        uint256 amount = escrow.amount;
        payable(escrow.poster).transfer(amount);
        
        emit EscrowRefunded(escrowId, amount);
    }
    
    /**
     * @dev Auto-release escrow after timeout if only helper confirmed
     * @param escrowId The escrow ID
     */
    function autoReleaseAfterTimeout(uint256 escrowId) 
        external 
        validEscrow(escrowId) 
        whenNotPaused 
    {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.state == EscrowState.COMPLETED, "Not in completed state");
        require(escrow.helperConfirmed && !escrow.posterConfirmed, "Invalid confirmation state");
        require(
            block.timestamp >= escrow.completedAt + disputeTimeoutDuration,
            "Timeout period not passed"
        );
        
        _releaseEscrow(escrowId);
    }
    
    // Admin functions
    function setPlatformFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeePercentage = _feePercentage;
    }
    
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid address");
        feeRecipient = _feeRecipient;
    }
    
    function setDisputeTimeoutDuration(uint256 _duration) external onlyOwner {
        disputeTimeoutDuration = _duration;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency withdrawal function
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // View functions
    function getEscrow(uint256 escrowId) 
        external 
        view 
        validEscrow(escrowId) 
        returns (Escrow memory) 
    {
        return escrows[escrowId];
    }
    
    function getEscrowState(uint256 escrowId) 
        external 
        view 
        validEscrow(escrowId) 
        returns (EscrowState) 
    {
        return escrows[escrowId].state;
    }
    
    function canAutoRelease(uint256 escrowId) 
        external 
        view 
        validEscrow(escrowId) 
        returns (bool) 
    {
        Escrow storage escrow = escrows[escrowId];
        return escrow.state == EscrowState.COMPLETED &&
               escrow.helperConfirmed && 
               !escrow.posterConfirmed &&
               block.timestamp >= escrow.completedAt + disputeTimeoutDuration;
    }
}

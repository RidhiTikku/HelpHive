# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

HelpHive is a decentralized marketplace that connects people who need help with verified helpers in their local area. It's a monorepo with three main components:

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Web3 integration (wagmi/viem)  
- **Backend**: Node.js/Express API with TypeScript, MongoDB, and blockchain integration
- **Contracts**: Solidity smart contracts using Hardhat for escrow payments and dispute resolution

## Development Commands

### Initial Setup
```bash
# Install all dependencies
npm run setup

# Alternative manual setup
npm install
npm install --workspaces
npm run contracts:compile
```

### Running Development Servers
```bash
# Start both frontend and backend concurrently
npm run dev

# Start individual services
npm run backend:dev     # Backend on port 3001
npm run frontend:dev    # Frontend on port 3000

# Start local blockchain
cd contracts
npx hardhat node       # Local Hardhat network on port 8545
```

### Building and Testing
```bash
# Build all workspaces
npm run build

# Test all workspaces
npm run test

# Workspace-specific commands
npm run backend:build
npm run frontend:build
npm run contracts:compile
npm run contracts:test
npm run contracts:deploy
```

### Contract Development
```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contracts
npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost
npx hardhat ignition deploy ignition/modules/HelpHiveEscrow.js --network localhost

# Verify contracts (mainnet/testnet)
npm run verify
```

### Running Single Tests
```bash
# Backend tests (when implemented)
cd backend && npm test

# Contract tests
cd contracts && npx hardhat test

# Frontend tests (when implemented) 
cd frontend && npm test
```

## Architecture Overview

### Monorepo Structure
The project uses npm workspaces with three main packages:
- `frontend/` - Next.js application
- `backend/` - Express.js API server
- `contracts/` - Hardhat smart contract development

### Backend Architecture (`/backend/src/`)
- **Models** (`models/`): MongoDB schemas for User, Task, Bid, Payment, Rating
- **Routes** (`routes/`): Express route handlers for auth, tasks, bids, payments, ratings, users
- **Middleware** (`middleware/`): Error handling and authentication
- **Config** (`config/`): Database connection setup
- **Utils** (`utils/`): Web3 utilities for blockchain interaction

Key data flow:
1. Tasks are posted with location, budget, and requirements
2. Helpers submit bids on tasks
3. Task posters accept bids and create escrow contracts
4. Smart contracts handle secure payments
5. Ratings/reviews are stored both in MongoDB and on blockchain

### Frontend Architecture (`/frontend/src/`)
- **App Router** (`app/`): Next.js 15 app directory structure
- **Components** (`components/`): Reusable UI components organized by feature
- **Web3 Integration**: Uses wagmi/viem for Ethereum wallet connections

The frontend is currently minimal but designed to be expanded with:
- Task posting and browsing interfaces  
- Bidding and chat systems
- Wallet integration for payments
- User profiles and ratings

### Smart Contract Architecture (`/contracts/`)
- **HelpHiveEscrow.sol**: Main escrow contract handling secure payments
- **Escrow States**: CREATED → FUNDED → COMPLETED/DISPUTED → RELEASED/REFUNDED
- **Features**: Multi-party confirmation, dispute resolution, auto-release timeouts
- **Security**: ReentrancyGuard, Ownable, Pausable from OpenZeppelin

Contract workflow:
1. Task poster creates and funds escrow with helper address
2. Both parties can mark task as completed
3. Auto-release when both confirm, or poster can manually release
4. Dispute resolution by contract owner
5. Platform fees automatically collected

## Key Environment Variables

### Backend (`.env`)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/helphive
JWT_SECRET=your_jwt_secret_here
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
PRIVATE_KEY=your_private_key_for_contract_interaction
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Contracts (`.env`)
```
PRIVATE_KEY=your_deployment_private_key
ALCHEMY_API_KEY=your_alchemy_api_key  
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Database Schema

### User Model
- Basic profile: email, username, fullName, avatar, bio
- Location with geospatial coordinates for local matching
- Skills array for helper matching
- Wallet address for Web3 integration
- Rating system with average and count
- Verification status and documents

### Task Model  
- Task details: title, description, category, urgency
- Budget range with multi-currency support (USD, ETH, USDC)
- Location with geospatial indexing for proximity queries
- Status tracking: OPEN → ASSIGNED → IN_PROGRESS → COMPLETED
- Blockchain integration: txHash, escrow contract address

### Payment/Escrow Integration
- Tasks link to smart contract escrows
- MongoDB tracks payment status and blockchain transaction hashes
- Dispute resolution tracked both on-chain and in database

## Web3 Integration

### Blockchain Networks
- Development: Hardhat local network (chain ID 31337)
- Testnet: Sepolia (chain ID 11155111) 
- Production: Ethereum Mainnet, Polygon, Arbitrum

### Smart Contract Integration
- Backend uses ethers.js for contract interactions
- Frontend uses wagmi/viem for wallet connections
- Escrow contracts handle all payment logic
- Platform fee collection (3% default, configurable)

## Development Notes

### Current Implementation Status
- ✅ Basic project structure and configuration
- ✅ Smart contract escrow system complete
- ✅ Database models and schemas defined
- ✅ Frontend basic layout and routing
- 🔄 Backend API routes (placeholder implementations)
- ⏳ Frontend Web3 integration
- ⏳ Real-time chat system
- ⏳ File upload for task images

### Adding New Features
When adding new API endpoints:
1. Create route handler in `backend/src/routes/`
2. Add authentication middleware if needed
3. Update corresponding frontend components
4. Consider blockchain integration if payment-related

When modifying smart contracts:
1. Update contract in `contracts/contracts/`
2. Create new deployment module in `ignition/modules/`
3. Update backend Web3 utilities
4. Test thoroughly on testnet before mainnet

### Testing Blockchain Integration
- Use Hardhat local network for development
- Deploy contracts: `npx hardhat ignition deploy ignition/modules/HelpHiveEscrow.js --network localhost`  
- Backend connects to local node at http://localhost:8545
- Frontend connects via wagmi configuration

### Database Indexing
The MongoDB schema includes optimized indexes for:
- Geospatial queries (location-based helper matching)
- Task filtering (category, status, creation date)
- User lookups (poster, assigned helper)

# 🐝 HelpHive

> **Connect with verified helpers in your area for everything from plumbing to laptop repairs. Fair prices, secure payments, and blockchain-powered trust.**

HelpHive is a decentralized marketplace platform that connects people who need help with verified helpers in their local area. Built with modern web technologies and blockchain integration for transparent, secure transactions.

## ✨ Features

### 🔧 **Problem Solving Made Easy**
- **Post Tasks**: Describe your problem, set your budget, and let helpers know what you need
- **Get Bids**: Receive competitive bids from verified helpers in your area
- **Secure Chat**: Communicate directly with helpers to discuss details
- **Fair Pricing**: Transparent pricing with no hidden fees

### 🛡️ **Trust & Security**
- **Verified Helpers**: All helpers go through identity verification and background checks
- **Escrow Payments**: Smart contract-powered escrow ensures secure payments
- **Blockchain Records**: All transactions, ratings, and reviews stored on blockchain
- **Dispute Resolution**: Built-in dispute resolution system

### 💰 **Multiple Payment Options**
- **Cryptocurrency**: ETH, USDC support
- **Traditional**: Credit cards, PayPal, bank transfers
- **Escrow Protection**: Funds held securely until work is completed

### 📊 **Transparent Ratings**
- **Immutable Reviews**: Blockchain-stored ratings prevent manipulation
- **Detailed Categories**: Communication, quality, timeliness, professionalism
- **Helper Profiles**: Complete service history and ratings

## 🏗️ Architecture

### Frontend (Next.js + TypeScript + Tailwind CSS)
- **Modern UI**: Responsive design with sleek components
- **Web3 Integration**: Wallet connection with wagmi and viem
- **Real-time Updates**: Dynamic task updates and notifications
- **Mobile Responsive**: Optimized for all devices

### Backend (Node.js + Express + TypeScript)
- **RESTful APIs**: Comprehensive API for all platform features
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with Web3 wallet support
- **Real-time Features**: Socket.io for live chat and updates

### Smart Contracts (Solidity + Hardhat)
- **Escrow System**: Secure payment handling
- **Dispute Resolution**: Automated and manual dispute resolution
- **Fee Management**: Transparent platform fee collection
- **Access Control**: Role-based permissions and security

### Blockchain Integration
- **Ethereum Compatible**: Works with Ethereum mainnet and testnets
- **Layer 2 Ready**: Optimized for Polygon, Arbitrum, and other L2s
- **Gas Optimization**: Efficient smart contracts to minimize costs

## 🚀 Quick Start

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- MetaMask or other Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/helphive.git
   cd helphive
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install

   # Install contracts dependencies
   cd ../contracts
   npm install
   ```

3. **Environment Setup**
   
   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_CHAIN_ID=1
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/helphive
   JWT_SECRET=your_jwt_secret_here
   RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
   PRIVATE_KEY=your_private_key_for_contract_interaction
   ```

   **Contracts** (`contracts/.env`):
   ```env
   PRIVATE_KEY=your_deployment_private_key
   ALCHEMY_API_KEY=your_alchemy_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

   **Contracts** (Terminal 3):
   ```bash
   cd contracts
   npx hardhat node
   ```

5. **Deploy Smart Contracts** (Optional for local development):
   ```bash
   cd contracts
   npx hardhat ignition deploy ignition/modules/HelpHiveEscrow.js --network localhost
   ```

## 📚 API Documentation

### Base URL: `http://localhost:3001/api`

### Authentication
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login user
- **POST** `/auth/wallet-connect` - Connect Web3 wallet

### Tasks
- **GET** `/tasks` - List all tasks (with filters)
- **POST** `/tasks` - Create new task
- **GET** `/tasks/:id` - Get specific task
- **PUT** `/tasks/:id` - Update task
- **DELETE** `/tasks/:id` - Delete task

### Bids
- **POST** `/bids` - Submit bid on task
- **GET** `/bids/task/:taskId` - Get bids for task
- **PUT** `/bids/:id/accept` - Accept a bid
- **PUT** `/bids/:id/withdraw` - Withdraw bid

### Payments
- **POST** `/payments/escrow` - Create escrow payment
- **POST** `/payments/:id/release` - Release payment
- **GET** `/payments/user` - Get user payments
- **GET** `/payments/:id` - Get payment details

### Users
- **GET** `/users/profile` - Get user profile
- **PUT** `/users/profile` - Update user profile
- **GET** `/users/:id` - Get public user profile

### Ratings
- **POST** `/ratings` - Submit rating/review
- **GET** `/ratings/user/:userId` - Get user ratings
- **GET** `/ratings/task/:taskId` - Get task ratings

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run test         # Run tests
```

### Contracts
```bash
npm run compile      # Compile smart contracts
npm run test         # Run contract tests
npm run deploy       # Deploy to network
npm run verify       # Verify contracts on Etherscan
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test
```

### Contract Testing
```bash
cd contracts
npx hardhat test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Set up environment variables
2. Connect database (MongoDB Atlas recommended)
3. Deploy using platform-specific instructions

### Smart Contracts
```bash
cd contracts
npx hardhat ignition deploy ignition/modules/HelpHiveEscrow.js --network mainnet
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi, viem, @tanstack/react-query
- **State Management**: React hooks + Context API
- **UI Components**: Custom components with Tailwind

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Web3**: ethers.js
- **Real-time**: Socket.io
- **Security**: helmet, cors, rate limiting

### Smart Contracts
- **Language**: Solidity ^0.8.19
- **Framework**: Hardhat
- **Testing**: Hardhat + Chai
- **Libraries**: OpenZeppelin Contracts
- **Tools**: TypeChain for type generation

### Infrastructure
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **Monitoring**: Custom logging + error tracking
- **Database**: MongoDB Atlas

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commits
- Update documentation for new features
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.helphive.com](https://docs.helphive.com)
- **Discord**: [Join our community](https://discord.gg/helphive)
- **Email**: support@helphive.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/helphive/issues)

## 🎯 Roadmap

### Phase 1: MVP (Current)
- ✅ Basic task posting and bidding
- ✅ User authentication and profiles
- ✅ Escrow payments
- ✅ Rating system

### Phase 2: Enhanced Features
- 🔄 Real-time chat system
- 🔄 Advanced search and filtering
- 🔄 Mobile app (React Native)
- 🔄 Multi-language support

### Phase 3: Scale & Optimize
- ⏳ Advanced dispute resolution
- ⏳ AI-powered helper matching
- ⏳ Integration with traditional payment processors
- ⏳ Global expansion

### Phase 4: Advanced Features
- ⏳ DAO governance
- ⏳ Helper training and certification
- ⏳ Insurance partnerships
- ⏳ Corporate accounts

## 🌟 Show Your Support

If you find HelpHive useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with your network

---

**Built with ❤️ by the HelpHive team**

*Making help accessible, fair, and trustworthy for everyone.*

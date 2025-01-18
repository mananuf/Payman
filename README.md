# Payman

### Effortless Payments, Globally Accessible
Empowering social vendors and individuals with seamless crypto-to-fiat payment solutions, bridging borders and breaking barriers for a truly global marketplace.

---

## Overview
Payman is a decentralized payment platform designed to solve the challenges of cross-border payments, particularly for social commerce vendors and individuals in regions with limited access to global payment gateways. By leveraging blockchain technology, Payman enables users to create, send, and receive invoices with crypto-to-fiat conversion seamlessly.

## Key Features
- **User-Friendly Onboarding**: Register a unique username mapped to a wallet address.
- **Wallet Creation**: Generate new Ethereum wallets for users without existing wallets.
- **Invoice Generation**: Create customizable invoices as a vendor or individual.
- **Crypto-to-Fiat Conversion**: Automatically calculate fiat equivalence for seamless transactions.
- **Secure Payments**: Transactions are processed on the Ethereum blockchain with verifiable transaction URLs.
- **Shareable Links**: Generate URLs and QR codes for easy invoice sharing.

---

## User Stories

### 1. **As a New User:**
- I want to register a unique username so that it can map to my wallet address.
- If I don’t have a wallet, I want the system to create one for me and link it to my username.

### 2. **As a Vendor:**
- I want to create an invoice for my products, listing item names, quantities, and prices.
- I want to share the invoice with my customers via a link or QR code.

### 3. **As a Payer:**
- I want to view invoice details and securely pay using cryptocurrency.
- I want to verify the transaction on the blockchain.

### 4. **As an Individual User:**
- I want to request payments by creating an invoice with an amount and description.
- I want to share my payment link with anyone, globally.

---

## Project Structure
- **Frontend**: Built using [Next.js](https://nextjs.org/) for a seamless, intuitive user experience.
- **Smart Contract**: Written in Cairo to handle wallet creation, username registration, invoice management and payments.
- **Blockchain**: Ethereum network for decentralized and secure transactions.

---

### Clone the Repository
```bash
git clone https://github.com/mananuf/Payman
cd payman/packages/nextjs
```

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm run dev
```

---

## How It Works

1. **Register a Username**:
   - Choose a unique username that maps to your wallet address.
   - If no wallet exists, the system generates one for you.

2. **Create an Invoice**:
   - Vendors: Add item names, quantities, and prices (crypto and fiat).
   - Individuals: Input amount and description for a payment request.

3. **Share Invoice**:
   - Generate a shareable link and QR code for the invoice.

4. **Receive Payments**:
   - Payers can securely pay via the provided link.
   - Payments are logged on-chain, with a verification URL for transparency.

5. **Dashboard**:
   - View all invoices, statuses, and payment history.

---

## Technologies Used
- **Frontend**: Next.js, TailwindCSS
- **Blockchain**: Ethereum, Starknet  Cairo 
- **Wallet Management**: ethers.js
- **QR Code Generation**: `qrcode` library

---

## Future Enhancements
- Multi-chain support for greater accessibility.
- Fiat payout integration for direct withdrawals to local bank accounts.
- Analytics dashboard for vendors to track sales and payments.
- Support for stablecoins to mitigate volatility.

---

## License
Payman is open-source and licensed under the [MIT License](LICENSE).

---

## Contributing
We welcome contributions from the community! Feel free to fork this repository, make your changes and submit a pull request.


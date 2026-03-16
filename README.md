# Poll Soroban Smart Contract

## Project Description
A decentralized polling application built using **Rust** and the **Soroban Smart Contract** platform on Stellar. It provides a transparent, tamper-proof way to pose a question and allow any network participant to cast a permanent on-chain vote.

A full **Next.js frontend** is included, allowing users to connect their **Freighter wallet**, vote in one click, and watch live results update in real time directly from the blockchain.

## What it does
The `PollContract` records votes permanently on the Stellar blockchain. It enforces a strict **one-vote-per-address** rule. Users authenticate via their Stellar wallet (Freighter), and the contract keeps an updated tally of all "Yes" and "No" counts, readable by anyone.

## Features
- **Binary Voting System:** Cast a Yes or No vote, recorded permanently on the blockchain.
- **Sybil Resistance:** Enforces one-vote-per-address — no double voting possible.
- **Secure Authentication:** Soroban's native `require_auth()` ensures only the wallet owner can submit a vote.
- **`has_voted` Check:** Frontend queries the contract to pre-check if an address has already voted — no scary transaction errors shown to users.
- **Persistent Storage:** Vote tallies are safely persisted on-chain via Soroban persistent storage.
- **Live Frontend:** Beautiful Next.js UI with Freighter wallet integration, animated progress bars, and real-time vote updates.

## Deployed Links
- **Vercel App (Frontend):** [poll-smoky-theta.vercel.app](https://poll-smoky-theta.vercel.app/)
- **Smart Contract:** `CBEZVCSQHDVJPJM5H2RE465PN32INYZG7MBPDXIQA6ZVLV7UXWGBV5SJ`
- **Network:** Stellar Testnet
- **Explorer:** [View on Stellar Lab](https://lab.stellar.org/r/testnet/contract/CBEZVCSQHDVJPJM5H2RE465PN32INYZG7MBPDXIQA6ZVLV7UXWGBV5SJ)
![alt text](<Screenshot 2026-03-16 124455.png>)

---

## Project Structure
```
poll/
├── contracts/hello-world/     # Soroban smart contract (Rust)
│   └── src/
│       ├── lib.rs             # Contract logic
│       └── test.rs            # Unit tests
└── poll-frontend/             # Next.js frontend
    ├── src/app/
    │   ├── page.tsx           # Main UI
    │   └── globals.css        # Styling
    └── packages/poll-client/  # Auto-generated TypeScript bindings
```

---

## Getting Started

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)
- [Node.js](https://nodejs.org/) (v18+)
- [Freighter Wallet](https://www.freighter.app/) browser extension (set to Testnet)
- Add WASM target: `rustup target add wasm32-unknown-unknown`

---

### Build the Smart Contract
```bash
cargo build --target wasm32-unknown-unknown --release
```

### Test the Smart Contract
```bash
cargo test
```

### Deploy the Smart Contract
```powershell
stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/poll.wasm `
  --source-account alice `
  --network testnet `
  --alias poll
```

---

### Run the Frontend Locally
```bash
cd poll-frontend
npm install
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

> Make sure the **Freighter** extension is installed and configured to the **Stellar Testnet**.

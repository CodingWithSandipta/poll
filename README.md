# Poll Soroban Smart Contract

## Project Description
This is a decentralized basic polling application built using Rust and the Soroban Smart Contract platform on the Stellar network. It provides a simple and transparent way to pose a question and allow network participants to vote either "Yes" or "No". 

## What it does
The `PollContract` records votes permanently on the Stellar blockchain. It ensures that each participant can only cast their vote once. Users authenticate their vote via their Stellar account (Address), and the contract keeps an updated tally of all "Yes" and "No" counts, which can be retrieved and queried by anyone.

## Features
- **Binary Voting System:** Users can cast a boolean vote (Yes = True, No = False).
- **Sybil Resistance (Basic):** Enforces a one-vote-per-address rule to prevent users from voting multiple times.
- **Secure Authentication:** Utilizes Soroban's native `require_auth()` capability to guarantee that only the owner of the address is submitting the vote.
- **Persistent Storage:** Vote tallies are safely persisted on the Stellar blockchain via Soroban's persistent storage.

## Deployed Smart Contract Link
poll

---

## Getting Started

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)
- Add target: `rustup target add wasm32-unknown-unknown`

### Build
Make sure you are in the project root directory (`poll`):
```bash
cd poll
```

To build the contract, run:
```bash
cargo build --target wasm32-unknown-unknown --release
```

### Deploy
Ensure you are in the `poll` directory. To deploy the contract to the testnet (assuming an account alias `alice` has been created and funded):
```powershell
stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/poll.wasm `
  --source-account alice `
  --network testnet `
  --alias poll
```

### Test
To run the automated tests for the contract, make sure you are in the `poll` directory:
```bash
cargo test
```

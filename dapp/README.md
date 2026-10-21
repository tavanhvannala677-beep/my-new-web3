# Simple Storage DApp (Workshop Lab 5)

React + TypeScript + Ethers.js front end for the `SimpleStorage` contract on **LAB Chain** (chain ID 5222).

- Reads go straight to the public RPC (`https://rpc.labchain.la`) — no wallet needed.
- Writes are signed with MetaMask; the app adds/switches MetaMask to LAB Chain for you.
- Load an existing contract address, or deploy a new one from the page.
- `?network=ganache` targets a local Ganache at `http://127.0.0.1:7545` (chain ID 1337).

## Run

Requires Node.js 20+ and MetaMask.

```bash
npm install
npm run dev
```

Open http://localhost:5173. MetaMask does not work on `file://` pages.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm test` | Unit tests (Vitest) |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run compile:contract` | Recompile `../contracts/SimpleStorage.sol` into `src/contracts/simpleStorage.generated.ts` (EVM `paris`, runs on LAB Chain, Ganache and Remix VM) |

## Structure

```
src/
  config/networks.ts         LAB Chain + Ganache settings
  contracts/                 ABI, bytecode (generated) and helpers
  hooks/useNetworkStatus.ts  live block number and gas price
  hooks/useWallet.ts         MetaMask account, network, balance
  hooks/useSimpleStorage.ts  load / read / write / deploy / events
  components/                one card per workshop step
  lib/                       error messages and formatting (+ tests)
```

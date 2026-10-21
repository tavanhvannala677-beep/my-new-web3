import type { Eip1193Provider } from "ethers";

/** The provider MetaMask injects as window.ethereum (EIP-1193 + events). */
export interface InjectedProvider extends Eip1193Provider {
  isMetaMask?: boolean;
  on?(event: "accountsChanged", listener: (accounts: string[]) => void): void;
  on?(event: "chainChanged", listener: (chainId: string) => void): void;
  removeListener?(event: string, listener: (...args: never[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: InjectedProvider;
  }
}

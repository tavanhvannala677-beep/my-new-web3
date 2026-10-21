import { Contract, ContractFactory, type ContractRunner } from "ethers";
import { SIMPLE_STORAGE_ABI, SIMPLE_STORAGE_BYTECODE } from "./simpleStorage.generated";

export { SIMPLE_STORAGE_ABI, SIMPLE_STORAGE_BYTECODE };

/** A SimpleStorage contract bound to a provider (read-only) or a signer (can write). */
export const simpleStorageAt = (address: string, runner: ContractRunner) =>
  new Contract(address, SIMPLE_STORAGE_ABI, runner);

export const simpleStorageFactory = (runner: ContractRunner) =>
  new ContractFactory(SIMPLE_STORAGE_ABI, SIMPLE_STORAGE_BYTECODE, runner);

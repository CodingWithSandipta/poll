import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBDAEVT4A64Q47UIOJVFUFZFWFWSCJNBESC7SW4D6N7IC34CTROOUZVAT",
  }
} as const

export type DataKey = {tag: "YesCount", values: void} | {tag: "NoCount", values: void} | {tag: "Voted", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Vote in the poll.
   * `vote_yes` indicates if the vote is Yes (true) or No (false).
   */
  vote: ({voter, vote_yes}: {voter: string, vote_yes: boolean}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_votes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieve the current vote tallies for (Yes, No)
   */
  get_votes: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [u32, u32]>>

  /**
   * Construct and simulate a has_voted transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if a specific address has already voted
   */
  has_voted: ({voter}: {voter: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAACFllc0NvdW50AAAAAAAAAAAAAAAHTm9Db3VudAAAAAABAAAAAAAAAAVWb3RlZAAAAAAAAAEAAAAT",
        "AAAAAAAAAE9Wb3RlIGluIHRoZSBwb2xsLgpgdm90ZV95ZXNgIGluZGljYXRlcyBpZiB0aGUgdm90ZSBpcyBZZXMgKHRydWUpIG9yIE5vIChmYWxzZSkuAAAAAAR2b3RlAAAAAgAAAAAAAAAFdm90ZXIAAAAAAAATAAAAAAAAAAh2b3RlX3llcwAAAAEAAAAA",
        "AAAAAAAAAC9SZXRyaWV2ZSB0aGUgY3VycmVudCB2b3RlIHRhbGxpZXMgZm9yIChZZXMsIE5vKQAAAAAJZ2V0X3ZvdGVzAAAAAAAAAAAAAAEAAAPtAAAAAgAAAAQAAAAE",
        "AAAAAAAAACdDaGVjayBpZiBhIHNwZWNpZmljIGFkZHJlc3MgaGFzIGFscmVhZHkgdm90ZWQAAAAACWhhc192b3RlZAAAAAAAAAEAAAAAAAAABXZvdGVyAAAAAAAATAAAAAEAAAAb" ]),
      options
    )
  }
  public readonly fromJSON = {
    vote: this.txFromJSON<null>,
        get_votes: this.txFromJSON<readonly [u32, u32]>,
        has_voted: this.txFromJSON<boolean>
  }
}
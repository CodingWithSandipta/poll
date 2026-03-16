import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CBDAEVT4A64Q47UIOJVFUFZFWFWSCJNBESC7SW4D6N7IC34CTROOUZVAT";
    };
};
export type DataKey = {
    tag: "YesCount";
    values: void;
} | {
    tag: "NoCount";
    values: void;
} | {
    tag: "Voted";
    values: readonly [string];
};
export interface Client {
    /**
     * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Vote in the poll.
     * `vote_yes` indicates if the vote is Yes (true) or No (false).
     */
    vote: ({ voter, vote_yes }: {
        voter: string;
        vote_yes: boolean;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_votes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Retrieve the current vote tallies for (Yes, No)
     */
    get_votes: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [u32, u32]>>;
    /**
     * Construct and simulate a has_voted transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Check if a specific address has already voted
     */
    has_voted: ({ voter }: {
        voter: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        vote: (json: string) => AssembledTransaction<null>;
        get_votes: (json: string) => AssembledTransaction<readonly [number, number]>;
        has_voted: (json: string) => AssembledTransaction<boolean>;
    };
}

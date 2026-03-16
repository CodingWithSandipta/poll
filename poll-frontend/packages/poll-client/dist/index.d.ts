import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CBEZVCSQHDVJPJM5H2RE465PN32INYZG7MBPDXIQA6ZVLV7UXWGBV5SJ";
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
     * Vote in the poll.
     * `vote_yes` indicates if the vote is Yes (true) or No (false).
     */
    vote: ({ voter, vote_yes }: {
        voter: string;
        vote_yes: boolean;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Retrieve the current vote tallies for (Yes, No)
     */
    get_votes: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [u32, u32]>>;
    /**
     * Check if a specific address has already voted
     */
    has_voted: ({ voter }: {
        voter: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        wasmHash: Buffer | string;
        salt?: Buffer | Uint8Array;
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        vote: (json: string) => AssembledTransaction<null>;
        get_votes: (json: string) => AssembledTransaction<readonly [number, number]>;
        has_voted: (json: string) => AssembledTransaction<boolean>;
    };
}

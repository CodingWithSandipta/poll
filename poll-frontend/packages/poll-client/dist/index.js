import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
        contractId: "CAOFYO6ECVH6RTUU3G4QRYRRT7JN7L2DQIFMQFIIXQRJJ42DBJAA66NJR",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec([
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAACFllc0NvdW50AAAAAAAAAAAAAAAHTm9Db3VudAAAAAABAAAAAAAAAAVWb3RlZAAAAAAAAAEAAAAT",
            "AAAAAAAAAE9Wb3RlIGluIHRoZSBwb2xsLgpgdm90ZV95ZXNgIGluZGljYXRlcyBpZiB0aGUgdm90ZSBpcyBZZXMgKHRydWUpIG9yIE5vIChmYWxzZSkuAAAAAAR2b3RlAAAAAgAAAAAAAAAFdm90ZXIAAAAAAAATAAAAAAAAAAh2b3RlX3llcwAAAAEAAAAA",
            "AAAAAAAAAC9SZXRyaWV2ZSB0aGUgY3VycmVudCB2b3RlIHRhbGxpZXMgZm9yIChZZXMsIE5vKQAAAAAJZ2V0X3ZvdGVzAAAAAAAAAAAAAAEAAAPtAAAAAgAAAAQAAAAE",
            "AAAAAAAAAC1DaGVjayBpZiBhIHNwZWNpZmljIGFkZHJlc3MgaGFzIGFscmVhZHkgdm90ZWQAAAAAAAAJaGFzX3ZvdGVkAAAAAAAAAQAAAAAAAAAFdm90ZXIAAAAAAAATAAAAAQAAAAE="
        ]), options);
        this.options = options;
    }
    fromJSON = {
        vote: (this.txFromJSON),
        get_votes: (this.txFromJSON),
        has_voted: (this.txFromJSON)
    };
}

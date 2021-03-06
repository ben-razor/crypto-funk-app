"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeRPCHandler = void 0;
const ethers_1 = require("ethers");
const json_rpc_2_0_1 = require("json-rpc-2.0");
class BridgeRPCHandler {
    client;
    constructor(forceBridgeUrl) {
        this.client = new json_rpc_2_0_1.JSONRPCClient((jsonRPCRequest) => fetch(forceBridgeUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(jsonRPCRequest),
        }).then((response) => {
            if (response.status === 200) {
                // Use client.receive when you received a JSON-RPC response.
                return response
                    .json()
                    .then((jsonRPCResponse) => this.client.receive(jsonRPCResponse));
            }
            else if (jsonRPCRequest.id !== undefined) {
                return Promise.reject(new Error(response.statusText));
            }
            else {
                return Promise.reject(new Error("request id undefined"));
            }
        }));
    }
    getBridgeInNervosBridgeFee(payload) {
        return Promise.resolve(this.client.request("getBridgeInNervosBridgeFee", payload));
    }
    getBridgeOutNervosBridgeFee(payload) {
        return Promise.resolve(Promise.resolve(this.client.request("getBridgeOutNervosBridgeFee", payload)));
    }
    async generateBridgeInNervosTransaction(payload) {
        const result = await this.client.request("generateBridgeInNervosTransaction", payload);
        switch (result.network) {
            case "Ethereum":
                {
                    const rawTx = result.rawTransaction;
                    rawTx.value = ethers_1.ethers.BigNumber.from(rawTx.value?.hex ?? 0);
                    result.rawTransaction = rawTx;
                }
                break;
            default:
                //TODO add other chains
                Promise.reject(new Error("not yet"));
        }
        return result;
    }
    async generateBridgeOutNervosTransaction(payload) {
        return this.client.request("generateBridgeOutNervosTransaction", payload);
    }
    async sendSignedTransaction(payload) {
        return this.client.request("sendSignedTransaction", payload);
    }
    async getBridgeTransactionStatus(payload) {
        return this.client.request("getBridgeTransactionStatus", payload);
    }
    async getBridgeTransactionSummaries(payload) {
        return await this.client.request("getBridgeTransactionSummaries", payload);
    }
    async getAssetList(name) {
        let param = { asset: name };
        if (name == undefined) {
            param = { asset: "all" };
        }
        return this.client.request("getAssetList", param);
    }
    async getBalance(payload) {
        return this.client.request("getBalance", payload);
    }
    async getBridgeConfig() {
        return this.client.request("getBridgeConfig");
    }
}
exports.BridgeRPCHandler = BridgeRPCHandler;

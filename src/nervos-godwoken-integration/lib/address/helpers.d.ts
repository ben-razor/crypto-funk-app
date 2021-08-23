import { Script, HexString } from "@ckb-lumos/base";
import { DeploymentConfig } from "../config/types";
import { DepositionLockArgs } from "./types";
export declare function getRollupTypeHash(rollup_type_script: Script): HexString;
export declare function generateDepositionLock(config: DeploymentConfig, args: HexString): Script;
export declare function serializeArgs(args: DepositionLockArgs, rollup_type_script: Script): HexString;
export declare function serializeTable(buffers: any[]): ArrayBuffer;
export declare function SerializeByte32(value: any): ArrayBuffer;
export declare function SerializeBytes(value: any): ArrayBufferLike;
export declare function SerializeUint64(value: any): ArrayBuffer;
export declare function SerializeScript(value: any): ArrayBuffer;
export declare function SerializeDepositionLockArgs(value: any): ArrayBuffer;
export declare const generateDeployConfig: (depositLockHash: string, ethAccountLockHash: string) => DeploymentConfig;

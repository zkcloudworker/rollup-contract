import { PrivateKey, PublicKey } from "o1js";
import {
  BLOCK_PRODUCER_PRIVATE_KEY,
  VALIDATOR_PRIVATE_KEY,
  CONTRACT_PRIVATE_KEY,
  FIRST_BLOCK_PRIVATE_KEY,
} from "../env.json";

interface ContractConfig {
  contractPrivateKey: PrivateKey;
  contractAddress: string;
  firstBlockPrivateKey?: PrivateKey;
  firstBlockPublicKey?: PublicKey;
}
import packageJson from "../package.json";
import { getNamespace } from "./celestia/celestia";
const { name: repo, author: developer, version } = packageJson;
export const namespace = {
  block: getNamespace({
    version: 0,
    id: JSON.stringify({ repo, developer, data: "block" }),
  }),
  validator: getNamespace({
    version: 0,
    id: JSON.stringify({ repo, developer, data: "validator" }),
  }),
  proof: getNamespace({
    version: 0,
    id: JSON.stringify({ repo, developer, data: "proof" }),
  }),
  state: getNamespace({
    version: 0,
    id: JSON.stringify({ repo, developer, data: "state" }),
  }),
};

export const nameContract: ContractConfig = {
  contractPrivateKey: PrivateKey.fromBase58(CONTRACT_PRIVATE_KEY),
  contractAddress: "B62qn6Jk2tkiTwDbWE5fTiu8un18kbeos4xMWXgpmrV9WdH6kmfmDNS",

  firstBlockPrivateKey: PrivateKey.fromBase58(FIRST_BLOCK_PRIVATE_KEY),
  firstBlockPublicKey: PublicKey.fromBase58(
    "B62qio6DQCbqzvaPCxNbqE64nifFWacXLEQ9Cw7DUvx42Pe6D71NAME"
  ),
};

export const blockProducer = {
  publicKey: PublicKey.fromBase58(
    "B62qkReUvvezH7R9Gj9Nzw19f6DzKKvSrGC1YTNmis6hZMt9PRbDFST"
  ),
  privateKey: PrivateKey.fromBase58(BLOCK_PRODUCER_PRIVATE_KEY),
};

export const sender = "B62qnKiZ8inNusQvStK9auY7rJnHDMWSZkykPQmiH63SbekLVp4DFST";

export const validatorsPrivateKeys: PrivateKey[] = [
  PrivateKey.fromBase58(VALIDATOR_PRIVATE_KEY),
];

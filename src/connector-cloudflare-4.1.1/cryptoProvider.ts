import * as crypto from "js-sha256";
import { ICryptoProvider } from "@queue-it/connector-javascript";

export class CloudflareCryptoProvider implements ICryptoProvider {
  public constructor() { }

  getSha256Hash(secretKey: string, stringToHash: string): any {
    return crypto.sha256.hmac(secretKey, stringToHash);
  }
}

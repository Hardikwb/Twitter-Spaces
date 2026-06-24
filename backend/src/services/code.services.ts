import crypto from "node:crypto";
import hashServices from "./hash.services.js";

class CodeService {
  generateCode() {
    return crypto.randomInt(1000, 9999);
  }

  verifyCode(code: string, hashedCode: string) {
    return hashServices.hashData(code) === hashedCode;
  }
}
const codeService = new CodeService();
export default codeService;

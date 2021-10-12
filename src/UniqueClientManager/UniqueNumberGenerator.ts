import { v4 as uuidv4 } from "uuid";

export default class UniqueNumberGenerator {
  static generateUUIDv4(): String {
    return uuidv4();
  }
}

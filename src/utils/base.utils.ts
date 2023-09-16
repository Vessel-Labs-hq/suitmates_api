import * as isemail from "isemail";
import { ErrorHelper } from "./error.utils";

interface MyObject {
  [key: string]: any;
}

export class Utils {
  static isEmailOrFail(email: string) {
    const valid = isemail.validate(email);

    if (!valid) {
      ErrorHelper.BadRequestException("Invalid email");
    }

    return email;
  }

  static isEmail(email: string) {
    return isemail.validate(email);
  }

  static removeKeysFromObject(obj: MyObject, keysToRemove: string[]): MyObject {
    const newObject = { ...obj };
    keysToRemove.forEach((key) => delete newObject[key]);
    return newObject;
  }

  static deleteEmptyFields(obj: any) {
    for (let key in obj) {
      if (obj && obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          this.deleteEmptyFields(obj[key]); // Recursively delete empty fields in nested objects
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key]; // Delete the field if the nested object is empty after deleting its empty fields
          }
        } else if (
          obj[key] === "" ||
          obj[key] === null ||
          obj[key] === undefined
        ) {
          delete obj[key]; // Delete the field if it is empty, null, or undefined
        }
      }
    }
    return obj;
  }

  static waitForTime = (milliseconds: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  };
}

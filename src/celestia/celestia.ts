import { describe, expect, it } from "@jest/globals";
import axios from "axios";
import { CELESTIA_AUTH_TOKEN, CELESTIA_ENDPOINT } from "../../env.json";
import { Field } from "o1js";
import crypto from "crypto";

export function getNamespace(params: { version: number; id: string }) {
  const { version, id } = params;
  const versionString = version.toString(16).padStart(2, "0");
  const idString = crypto
    .createHash("sha256")
    .update(id)
    .digest("hex")
    .slice(0, 20)
    .padStart(56, "0");
  const buffer = Buffer.from(versionString + idString, "hex");
  const base64String = buffer.toString("base64");
  return base64String;
}

function fieldsToBase64(fields: Field[]) {
  const data = fields
    .map((field) => field.toBigInt().toString(16).padStart(64, "0"))
    .join("");

  const buffer = Buffer.from(data, "hex");
  const base64String = buffer.toString("base64");
  return base64String;
}

function fieldsFromBase64(data: string) {
  const buffer = Buffer.from(data, "base64");
  const hexString = buffer.toString("hex");
  const fields = [];
  for (let i = 0; i < hexString.length; i += 64) {
    const field = Field(BigInt("0x" + hexString.slice(i, i + 64)));
    fields.push(field);
  }
  return fields;
}

export async function getBlob(params: {
  namespace: string;
  height: number;
}): Promise<Field[] | undefined> {
  const { namespace, height } = params;
  const data = {
    id: 1,
    jsonrpc: "2.0",
    method: "blob.GetAll",
    params: [height, [namespace]],
  };
  try {
    const response = await axios.post(CELESTIA_ENDPOINT, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CELESTIA_AUTH_TOKEN}`,
      },
    });

    if (response?.data?.result[0]?.data === undefined) {
      console.error("Blob not found", {
        data: response?.data,
        value: response?.data?.result[0]?.data,
      });
      return undefined;
    }
    const fields = fieldsFromBase64(response.data.result[0].data);
    return fields;
  } catch (error) {
    console.log(error);
  }
}

export async function saveBlob(params: {
  namespace: string;
  fields: Field[];
}): Promise<number | undefined> {
  const { namespace, fields } = params;
  const data = {
    id: 1,
    jsonrpc: "2.0",
    method: "blob.Submit",
    params: [
      [
        {
          namespace,
          data: fieldsToBase64(fields),
          share_version: 0,
        },
      ],
      0.1,
    ],
  };
  try {
    const response = await axios.post(CELESTIA_ENDPOINT, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CELESTIA_AUTH_TOKEN}`,
      },
    });
    //console.log(response?.data);
    //console.log(response?.data?.result);
    if (response?.data?.result === undefined) {
      console.error("Blob not saved", {
        message: response?.data?.error?.message,
        data: response?.data,
      });
      return undefined;
    }

    if (typeof response?.data?.result !== "number") {
      console.error("Wrong format of the answer", {
        result: response?.data?.result,
        data: response?.data,
      });
      return undefined;
    }
    console.log(`Saved blob at height ${response?.data?.result}`);
    return response?.data?.result;
  } catch (error) {
    console.log(error);
  }
}

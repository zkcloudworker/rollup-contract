import { describe, expect, it } from "@jest/globals";
import { saveBlob, getBlob, getNamespace } from "../src/celestia/celestia";
import { Field } from "o1js";

const namespace = getNamespace({ version: 0, id: "test" });
let height: number | undefined = undefined;
const fields: Field[] = [];

describe("Celestia", () => {
  it(`should save blob`, async () => {
    for (let i = 0; i < 10; i++) {
      const field = Field.random();
      fields.push(field);
    }
    height = await saveBlob({ namespace, fields });
    expect(height).toBeDefined();
  });
  it(`should get blob`, async () => {
    expect(height).toBeDefined();
    if (height === undefined) return;

    const fields2 = await getBlob({ namespace, height });
    expect(fields2).toBeDefined();
    if (fields2 === undefined) return;
    fields2.forEach((field, i) => {
      expect(field.toBigInt()).toBe(fields[i].toBigInt());
    });
  });
});

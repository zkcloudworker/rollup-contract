import { describe, expect, it } from "@jest/globals";
import { ValidatorsVoting } from "../src/rollup/validators";

describe("Compile", () => {
  it(`compile`, async () => {
    await ValidatorsVoting.compile();
  });
});

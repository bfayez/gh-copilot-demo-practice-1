import { describe, expect, it } from "vitest";
import { validateDate, validateGUID, validateIPV6 } from "./validators";

describe("validateDate", () => {
  it("should return true for valid date strings", () => {
    expect(validateDate("2023-01-01")).toBe(true);
    expect(validateDate("1999-12-31")).toBe(true);
  });

  it("should return false for invalid date strings", () => {
    expect(validateDate("2023-13-01")).toBe(false); // Invalid month
    expect(validateDate("2023-00-10")).toBe(false); // Invalid month
    expect(validateDate("2023-02-30")).toBe(false); // Invalid day
    expect(validateDate("2023-02-29")).toBe(false); // Invalid leap day
    expect(validateDate("not-a-date")).toBe(false); // Not a date
  });
});

describe("validateGUID", () => {
  it("accepts a GUID and rejects malformed input", () => {
    expect(validateGUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(validateGUID("123e4567-e89b-12d3-a456")).toBe(false);
  });
});

describe("validateIPV6", () => {
  it("accepts full and compressed IPv6 addresses", () => {
    expect(validateIPV6("2001:0db8:0000:0000:0000:ff00:0042:8329")).toBe(true);
    expect(validateIPV6("2001:db8::ff00:42:8329")).toBe(true);
    expect(validateIPV6("::1")).toBe(true);
  });

  it("rejects malformed and IPv4 addresses", () => {
    expect(validateIPV6("2001:db8::ff00::8329")).toBe(false);
    expect(validateIPV6("2001:db8:zzzz::1")).toBe(false);
    expect(validateIPV6("127.0.0.1")).toBe(false);
  });
});


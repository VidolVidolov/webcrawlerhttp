import { sortPages } from "./report";

describe("report", () => {
  test("sortPages 2 pages desc", () => {
    const input = {
      "https://blog.boot.dev": 3,
      "https://blog.boot.dev/path": 1,
    };
    const actual = sortPages(input);
    const expected = [
      ["https://blog.boot.dev", 3],
      ["https://blog.boot.dev/path", 1],
    ];
    expect(actual).toEqual(expected);
  });

  test("sortPages 5 pages desc", () => {
    const input = {
      "https://blog.boot.dev": 3,
      "https://blog.boot.dev/path": 1,
      "https://blog.boot.dev/path123": 90,
      "https://blog.boot.dev/path7": 7,
      "https://blog.boot.dev/path15": 15,
    };
    const actual = sortPages(input);
    const expected = [
      ["https://blog.boot.dev/path123", 90],
      ["https://blog.boot.dev/path15", 15],
      ["https://blog.boot.dev/path7", 7],
      ["https://blog.boot.dev", 3],
      ["https://blog.boot.dev/path", 1],
    ];
    expect(actual).toEqual(expected);
  });
});

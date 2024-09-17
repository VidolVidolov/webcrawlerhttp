const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

describe("normailizeUrl", () => {
  test("strip protocol", () => {
    const input = "https://blog.boot.dev/path";
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path";
    expect(actual).toEqual(expected);
  });

  test("trim trailing slashes", () => {
    const input = "https://blog.boot.dev/path/";
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path";
    expect(actual).toEqual(expected);
  });

  test("capitals", () => {
    const input = "https://BLOG.boot.dev/path";
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path";
    expect(actual).toEqual(expected);
  });

  test("http stripped correctly", () => {
    const input = "http://BLOG.boot.dev/path";
    const actual = normalizeURL(input);
    const expected = "blog.boot.dev/path";
    expect(actual).toEqual(expected);
  });
});

describe("getURLsFromHTML", () => {
  test("getting absolute urls", () => {
    const htmlBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/">
                Boot.dev Blog
            </a>
        </body>
    </html>`;

    const inputBaseUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(htmlBody, inputBaseUrl);
    const expected = ["https://blog.boot.dev/"];
    expect(actual).toEqual(expected);
  });

  test("getting relative urls", () => {
    const htmlBody = `
    <html>
        <body>
            <a href="/path">
                Boot.dev Blog
            </a>
        </body>
    </html>`;

    const inputBaseUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(htmlBody, inputBaseUrl);
    const expected = ["https://blog.boot.dev/path"];
    expect(actual).toEqual(expected);
  });

  test("getting multiple urls", () => {
    const htmlBody = `
    <html>
        <body>
            <a href="https://BLOG.boot.dev/path1">
                Boot.dev Blog
            </a>
            <a href="/path2">
                Boot.dev Blog
            </a>
        </body>
    </html>`;

    const inputBaseUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(htmlBody, inputBaseUrl);
    const expected = [
      "https://blog.boot.dev/path1",
      "https://blog.boot.dev/path2",
    ];
    expect(actual).toEqual(expected);
  });

  test("gextract invalid url", () => {
    const htmlBody = `
    <html>
        <body>
            <a href="invalid">
                Invalid
            </a>
        </body>
    </html>`;

    const inputBaseUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(htmlBody, inputBaseUrl);
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

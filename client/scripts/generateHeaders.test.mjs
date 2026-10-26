import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

test("authorizes the exact inline import map and preserves other CSP directives", async () => {
  const importMap = '\n{"imports":{"bundle":"/bundle.12345678.js"}}\n';
  vi.mocked(readFile).mockResolvedValue(
    `<script type=importmap>${importMap}</script><script src=/client.js type=module></script>`,
  );

  await import("./generateHeaders.mjs");

  const headers = vi.mocked(writeFile).mock.calls[0][1];
  const hash = createHash("sha256").update(importMap).digest("base64");
  expect(headers).toContain(`script-src 'self' 'sha256-${hash}'`);
  expect(headers.match(/'sha256-/g)).toHaveLength(1);
  expect(headers).toMatch(
    /^\/\*\n {2}Content-Security-Policy: default-src 'self';/,
  );
  expect(headers).toContain("connect-src 'self' https://cognito-identity.");
  expect(headers).toContain(";frame-ancestors 'none';report-uri https://");
  expect(headers).not.toContain("unsafe-inline");
});

test("updates the allowed hash when the import map changes", async () => {
  const hashes = [];
  for (const bundle of ["first.js", "second.js"]) {
    vi.resetModules();
    vi.mocked(readFile).mockResolvedValue(
      `<script type="importmap">{"imports":{"bundle":"/${bundle}"}}</script>`,
    );
    await import("./generateHeaders.mjs");
    hashes.push(
      vi.mocked(writeFile).mock.lastCall[1].match(/'sha256-[^']+'/)[0],
    );
  }
  expect(hashes[0]).not.toBe(hashes[1]);
});

test("does not authorize external scripts as inline scripts", async () => {
  vi.mocked(readFile).mockResolvedValue(
    '<script src="/client.js" type="module"></script>',
  );

  await import("./generateHeaders.mjs");

  expect(vi.mocked(writeFile).mock.lastCall[1]).toContain("script-src 'self';");
  expect(vi.mocked(writeFile).mock.lastCall[1]).not.toContain("sha256-");
});

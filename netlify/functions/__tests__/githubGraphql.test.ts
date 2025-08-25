import { vi, describe, it, expect, beforeEach } from "vitest";
import { handler } from "../githubGraphql";
import type { HandlerResponse } from "@netlify/functions";

const mockContext = {} as any;

globalThis.fetch = vi.fn();

describe("GitHub GraphQL Netlify Function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GITHUB_TOKEN = "fake-token";
  });

  it("returns 405 for non-POST requests", async () => {
    const res = (await handler({ httpMethod: "GET" } as any, mockContext)) as HandlerResponse;
    expect(res.statusCode).toBe(405);
  });

  it("returns 500 if GITHUB_TOKEN missing", async () => {
    delete process.env.GITHUB_TOKEN;
    const res = (await handler({ httpMethod: "POST", body: "{}" } as any, mockContext)) as HandlerResponse;
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Missing GITHUB_TOKEN");
  });

  it("calls fetch with correct headers and body", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      status: 200,
      text: async () => JSON.stringify({ data: "ok" }),
    });

    const res = (await handler(
      {
        httpMethod: "POST",
        body: JSON.stringify({ query: "{test}", variables: {} }),
      } as any,
      mockContext
    )) as HandlerResponse;

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.github.com/graphql",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `bearer fake-token`,
        }),
      })
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("ok");
  });
});

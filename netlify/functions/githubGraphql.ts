// netlify/functions/githubGraphql.ts
import type { Handler } from "@netlify/functions";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Prevent get, put, delete requests
const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Check for GITHUB_TOKEN in environment variables
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, body: "Missing GITHUB_TOKEN" };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { query, variables } = body;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await res.text(); // passt Errors durch
    return { statusCode: res.status, body: data };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message ?? "Unknown error" };
  }
};

export { handler };

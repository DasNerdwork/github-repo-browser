// imports for netlify and .env key
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
    // Flexible query and variables
    const { query, variables } = body;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    // Get response as text for potential error messages in body
    const data = await res.text();
    return { statusCode: res.status, body: data };
  } catch (e: any) { // Catch in case of any internal errors
    return { statusCode: 500, body: e?.message ?? "Unknown error" };
  }
};

// Make sure netlify sees the function
export { handler };

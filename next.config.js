/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: "nodejs",
  },
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AGENT_NAME: process.env.AGENT_NAME,
    AGENT_MODEL: process.env.AGENT_MODEL,
    REQUIRE_APPROVAL: process.env.REQUIRE_APPROVAL,
  },
};

module.exports = nextConfig;

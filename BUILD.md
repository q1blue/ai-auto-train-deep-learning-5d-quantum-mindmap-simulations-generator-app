# Build Instructions & Setup Guide

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Redis**: 6.0+ (for state management)
- **OS**: Linux, macOS, or Windows with WSL2

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/q1blue/ai-auto-train-deep-learning-5d-quantum-mindmap-simulations-generator-app.git
cd ai-auto-train-deep-learning-5d-quantum-mindmap-simulations-generator-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- **AI SDK**: `ai@^3.2.0` - Vercel AI SDK for streaming and tool use
- **Chat SDK**: `chat@^1.0.0` - Multi-platform chat adapter framework
- **Platform Adapters**: Slack, Teams, Google Chat, Discord, Telegram
- **AI Providers**: Anthropic, OpenAI integrations
- **Database**: Redis for state management
- **Dev Tools**: TypeScript, Next.js, ESLint, ts-node

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

#### Required API Keys

**Anthropic (Claude)**
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get from: https://console.anthropic.com/account/keys

**OpenAI (GPT models)**
```
OPENAI_API_KEY=sk-...
```
Get from: https://platform.openai.com/account/api-keys

#### Chat Platform Configuration

**Slack**
```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...
```
Setup: https://api.slack.com/apps

**Microsoft Teams**
```
MICROSOFT_APP_ID=...
MICROSOFT_APP_PASSWORD=...
```
Setup: https://dev.teams.microsoft.com/

**Google Chat**
```
GOOGLE_CHAT_WEBHOOK_URL=https://chat.googleapis.com/v1/spaces/...
```
Setup: https://developers.google.com/chat

**Discord**
```
DISCORD_BOT_TOKEN=...
DISCORD_CLIENT_ID=...
```
Setup: https://discord.com/developers/applications

**Telegram**
```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_URL=https://your-domain.com/telegram
```
Get token from: @BotFather on Telegram

#### Database & Application

**Redis (Local or Cloud)**
```
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=optional
```

**Application Settings**
```
NODE_ENV=development
DEBUG=true
LOG_LEVEL=info
PORT=3000
```

### 4. Start Redis (if running locally)

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or using Homebrew (macOS)
brew install redis
brew services start redis

# Or using apt (Linux)
sudo apt-get install redis-server
sudo systemctl start redis-server
```

Verify Redis is running:
```bash
redis-cli ping
# Expected output: PONG
```

### 5. Type Check (Optional but Recommended)

```bash
npm run type-check
```

This validates TypeScript without building.

### 6. Build for Production

```bash
npm run build
```

Output files will be in `dist/` and `.next/` directories.

### 7. Start the Application

**Development Mode**
```bash
npm run dev
```
Server runs at `http://localhost:3000`

**Production Mode**
```bash
npm run build
npm start
```

**Run Agent Standalone**
```bash
npm run agent

# Or with auto-reload
npm run agent:dev
```

## Troubleshooting

### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
sudo systemctl start redis-server  # Linux
brew services start redis           # macOS
docker run -d -p 6379:6379 redis   # Docker
```

### API Key Errors

```
Error: ANTHROPIC_API_KEY is not set
```

**Solution:**
1. Verify `.env.local` exists and contains the key
2. Restart the dev server after adding keys
3. Check API key format and expiration

### TypeScript Compilation Errors

```bash
npm run type-check
```

Fix any errors before building.

### Port Already in Use

```bash
# Change port in .env.local
PORT=3001
```

## Dependency Management

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update to latest versions
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Add New Dependencies

```bash
# Add a production dependency
npm install package-name

# Add a dev dependency
npm install --save-dev package-name
```

## Project Structure

```
.
├── src/
│   ├── agent.ts              # Main agent implementation
│   ├── tools.ts              # Agent tools definition
│   ├── adapters.ts           # Chat platform adapters
│   └── utils/
│       ├── logger.ts         # Logging configuration
│       └── types.ts          # TypeScript type definitions
├── pages/                     # Next.js pages (optional)
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .env.local                # Local environment variables (gitignored)
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration
└── BUILD.md                  # This file
```

## Development Workflow

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Make changes** to source files in `src/`

3. **Type check** before committing
   ```bash
   npm run type-check
   ```

4. **Run linting**
   ```bash
   npm run lint
   ```

5. **Test agent locally**
   ```bash
   npm run agent:dev
   ```

## Deployment

### Vercel (Recommended for Next.js)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t agent-app .
docker run -p 3000:3000 --env-file .env.local agent-app
```

## Next Steps

1. Read [QUICKSTART.md](./QUICKSTART.md) for agent usage examples
2. Check [src/agent.ts](./src/agent.ts) for implementation details
3. Review [src/tools.ts](./src/tools.ts) for available tools
4. Explore Chat SDK documentation: https://chat-sdk.example.com
5. Learn Vercel AI SDK: https://sdk.vercel.ai

## Support & Resources

- **Chat SDK Docs**: https://chat-sdk.example.com
- **Vercel AI SDK**: https://sdk.vercel.ai
- **Anthropic Claude**: https://www.anthropic.com
- **OpenAI API**: https://platform.openai.com
- **Redis Docs**: https://redis.io/docs

---

**Last Updated**: 2026-05-21

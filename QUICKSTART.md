# Agent Quickstart Guide

## 5-Minute Setup

### 1. Install & Configure

```bash
# Clone and install
git clone <repo-url>
cd <repo-dir>
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 2. Start the Agent

```bash
# Development mode
npm run agent:dev

# Or just run once
npm run agent
```

## Basic Agent Example

Here's a complete working example with Slack:

```typescript
// src/agent.ts
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { ToolLoopAgent } from "ai";
import { createChatTools } from "chat/ai";

// 1. Initialize Chat with Slack adapter
const chat = new Chat({
  userName: "omni-333-agent",
  adapters: {
    slack: createSlackAdapter(),
  },
  state: createRedisState(),
  onLockConflict: "drop",
});

// 2. Create AI Agent
const agent = new ToolLoopAgent({
  model: "anthropic/claude-4.5-sonnet",
  instructions: "You are a helpful AI assistant integrated with Slack.",
  tools: createChatTools(chat, {
    requireApproval: false,
    preset: "messenger",
  }),
});

// 3. Handle incoming mentions
chat.onNewMention(async (thread, message) => {
  console.log(`New mention from ${message.author.name}: ${message.text}`);

  // Fetch conversation history
  const result = await thread.adapter.fetchMessages(thread.id, { limit: 10 });

  // Convert to AI format
  const { toAiMessages } = await import("chat/ai");
  const history = await toAiMessages(result.messages, {
    includeNames: true,
  });

  // Add current message
  history.push({
    role: "user",
    content: message.text,
  });

  // Get AI response
  const response = await agent.stream({ prompt: history });

  // Post response
  await thread.post(response.fullStream);
});

chat.listen();
console.log("Agent listening for Slack messages...");
```

## Multi-Platform Example

Connect to Slack, Teams, and Discord simultaneously:

```typescript
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createTeamsAdapter } from "@chat-adapter/teams";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createRedisState } from "@chat-adapter/state-redis";

const chat = new Chat({
  userName: "omni-333-agent",
  adapters: {
    slack: createSlackAdapter(),
    teams: createTeamsAdapter(),
    discord: createDiscordAdapter(),
  },
  state: createRedisState(),
});

// Same agent works across all platforms
chat.onNewMention(async (thread, message) => {
  // Handler runs for all adapters
  console.log(`Platform: ${thread.adapter.name}`);
  // ... handle message
});
```

## Streaming Responses

Stream AI responses in real-time:

```typescript
import { StreamingPlan } from "chat";

chat.onNewMention(async (thread, message) => {
  const response = await agent.stream({ prompt: message.text });

  // Basic streaming
  await thread.post(response.fullStream);

  // Or structured streaming with progress
  const planned = new StreamingPlan(response.fullStream, {
    groupTasks: "plan",
    updateIntervalMs: 750,
  });
  await thread.post(planned);
});
```

## Step-by-Step Task Tracking

Show progress with the `Plan` class:

```typescript
import { Plan } from "chat";

chat.onNewMention(async (thread, message) => {
  const plan = new Plan({
    initialMessage: "Processing your request...",
  });
  await thread.post(plan);

  // Step 1
  const step1 = await plan.addTask({ title: "Fetch data" });
  // ... do work
  await plan.updateTask("Data fetched successfully");

  // Step 2
  const step2 = await plan.addTask({ title: "Analyze results" });
  // ... do work
  await plan.updateTask("Analysis complete");

  // Done
  await plan.complete({ completeMessage: "✅ All done!" });
});
```

## Custom Chat Adapters

Create custom logic for specific platforms:

```typescript
import { TelegramAdapter } from "@chat-adapter/telegram";

class CustomTelegramAdapter extends TelegramAdapter {
  protected override processUpdate(update, options) {
    // Handle custom events
    if ("custom_event" in update) {
      this.logger.info("Custom event received", { update });
      return;
    }
    super.processUpdate(update, options);
  }
}

const chat = new Chat({
  adapters: {
    telegram: new CustomTelegramAdapter(),
  },
});
```

## Message Conversion for AI

Convert platform messages to AI format:

```typescript
const { toAiMessages } = await import("chat/ai");

const messages = await toAiMessages(platformMessages, {
  // Include author names in context
  includeNames: true,

  // Transform messages before AI sees them
  transformMessage: (aiMessage) => {
    if (typeof aiMessage.content === "string") {
      return {
        ...aiMessage,
        content: aiMessage.content.replace(/\[/@U123/g, "@bot-name"),
      };
    }
    return aiMessage;
  },

  // Handle attachments gracefully
  onUnsupportedAttachment: (attachment, message) => {
    console.warn(`Skipped ${attachment.type} attachment`);
  },
});
```

## Approval Gates

Require human approval for critical actions:

```typescript
const chatTools = createChatTools(chat, {
  // Require approval for all write operations
  requireApproval: true,

  // Or granular per-tool approval
  requireApproval: {
    postMessage: false,      // Thoth can post (advisory)
    postChannelMessage: true, // Requires approval
    sendDirectMessage: true,  // Requires approval
    deleteMessage: true,      // Always requires approval
    editMessage: true,
    addReaction: false,
  },
});
```

## Error Handling

Properly handle errors in your agent:

```typescript
import pino from "pino";

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

chat.onNewMention(async (thread, message) => {
  try {
    // Handle message
    logger.info("Processing message", { userId: message.author.id });
    // ...
  } catch (error) {
    logger.error("Error processing message", { error });
    await thread.post("Sorry, I encountered an error. Please try again.");
  }
});

chat.onError((error) => {
  logger.error("Chat error", { error });
});
```

## Advanced: Custom Tools

Add custom tools to your agent:

```typescript
const customTools = [
  {
    name: "search_knowledge_base",
    description: "Search the internal knowledge base",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
      required: ["query"],
    },
    execute: async (input) => {
      // Custom implementation
      return `Found results for: ${input.query}`;
    },
  },
];

const agent = new ToolLoopAgent({
  model: "anthropic/claude-4.5-sonnet",
  tools: [...chatTools.tools, ...customTools],
});
```

## Testing the Agent

### Local Testing

```bash
# Test agent with mock messages
npm run agent:dev

# In another terminal, send test messages
node scripts/test-agent.js
```

### Slack Testing

1. Add bot to your Slack workspace
2. Mention the bot in any channel: `@omni-333-agent hello`
3. Check the response

### Using ngrok for Local Webhooks

```bash
# Install ngrok
npm install -g ngrok

# Expose local port to internet
ngrok http 3000

# Use ngrok URL in platform webhook settings
# https://xxxxx-xx-xx-xxx-xx.ngrok.io/slack/events
```

## Environment Variables Reference

```bash
# AI Models
ANTHROPIC_API_KEY=       # Claude API key
OPENAI_API_KEY=          # GPT API key

# Chat Platforms
SLACK_BOT_TOKEN=         # Slack bot token
DISCORD_BOT_TOKEN=       # Discord bot token
TELEGRAM_BOT_TOKEN=      # Telegram bot token

# Database
REDIS_URL=               # Redis connection URL

# Agent
AGENT_MODEL=             # Default AI model to use
REQUIRE_APPROVAL=        # Enable approval gates
```

## Common Issues & Solutions

### Agent Not Responding

```bash
# Check Redis connection
redis-cli ping

# Check API keys
echo $ANTHROPIC_API_KEY

# Review logs
npm run agent:dev # enables debug output
```

### Platform Connection Failed

```bash
# Verify credentials
# For Slack: https://api.slack.com/apps
# For Discord: https://discord.com/developers/applications
# For Telegram: @BotFather

# Test webhook URL if applicable
curl -X POST https://your-webhook-url -d 'test'
```

### Rate Limiting

Add delays between API calls:

```typescript
import { delay } from "./utils";

await delay(1000); // Wait 1 second
await agent.stream({ prompt });
```

## Next Steps

1. ✅ Read [BUILD.md](./BUILD.md) for detailed setup
2. ✅ Review [src/agent.ts](./src/agent.ts) for full implementation
3. ✅ Check [src/tools.ts](./src/tools.ts) for available tools
4. ✅ Explore Chat SDK documentation
5. ✅ Deploy to production

## Get Help

- 📖 [Chat SDK Docs](https://chat-sdk.example.com)
- 🤖 [Vercel AI SDK](https://sdk.vercel.ai)
- 💬 [Discord Community](https://discord.gg/example)
- 🐛 [GitHub Issues](https://github.com/q1blue/ai-auto-train-deep-learning-5d-quantum-mindmap-simulations-generator-app/issues)

---

**Happy building! 🚀**

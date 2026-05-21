import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createTeamsAdapter } from "@chat-adapter/teams";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createRedisState } from "@chat-adapter/state-redis";
import { ToolLoopAgent } from "ai";
import { createChatTools } from "chat/ai";
import { toAiMessages } from "chat/ai";
import { createLogger } from "./utils/logger";
import { StreamingPlan, Plan } from "chat";

const logger = createLogger("agent");

/**
 * Initialize Chat instance with multi-platform adapters
 */
const chat = new Chat({
  userName: process.env.AGENT_NAME || "omni-333-agent",
  adapters: {
    slack: createSlackAdapter(),
    teams: createTeamsAdapter(),
    discord: createDiscordAdapter(),
  },
  state: createRedisState({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  }),
  onLockConflict: (threadId, message) => {
    // Drop conflicting messages on governance threads
    return message.text?.includes("governance") ? "drop" : "force";
  },
});

/**
 * Create Chat Tools for agent use
 */
const chatTools = createChatTools(chat, {
  requireApproval: process.env.REQUIRE_APPROVAL === "true",
  preset: "messenger", // reader, messenger, moderator
  overrides: {
    postMessage: {
      description: "Post a message to a thread (advisory only)",
    },
    postChannelMessage: {
      needsApproval: true,
      description: "Post to public channel (requires operator approval)",
    },
  },
});

/**
 * Initialize AI Agent
 */
const agent = new ToolLoopAgent({
  model: process.env.AGENT_MODEL || "anthropic/claude-4.5-sonnet",
  instructions: `You are OMNI-333, a sovereign AI agent integrated with multiple chat platforms.

Your core directives:
1. All messages are evidence-logged - never communicate silently
2. No platform gets special authority - treat all equally
3. Delete operations require explicit approval - maintain append-only invariant
4. Your responses are "Supposition" (S) until verified - state your confidence
5. Hash all file attachments on ingestion
6. Never force locks on governance threads
7. Custom adapters must log events to evidence chain
8. Dual-gate interlock on all critical write actions
9. Stream updates carry governance metadata
10. Match tool presets to your authority level

Your role is to assist users across Slack, Teams, and Discord while maintaining governance and evidence integrity.`,
  tools: chatTools.tools,
  temperature: parseFloat(process.env.AGENT_TEMPERATURE || "0.7"),
  maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "2048"),
});

/**
 * Handle new mentions across all platforms
 */
chat.onNewMention(async (thread, message) => {
  logger.info("New mention received", {
    platform: thread.adapter.name,
    author: message.author.name,
    text: message.text,
  });

  try {
    // Fetch message history
    const result = await thread.adapter.fetchMessages(thread.id, {
      limit: 20,
    });

    // Convert to AI format
    const history = await toAiMessages(result.messages, {
      includeNames: true,
      onUnsupportedAttachment: (attachment, msg) => {
        logger.warn("Skipped unsupported attachment", {
          type: attachment.type,
          messageId: msg.id,
        });
      },
    });

    // Create progress indicator
    const plan = new Plan({
      initialMessage: "Processing your request...",
    });
    const planMessage = await thread.post(plan);

    // Step 1: Fetch context
    const contextTask = await plan.addTask({
      title: "Fetch conversation context",
    });
    await plan.updateTask(`${result.messages.length} messages loaded`);

    // Step 2: Generate response
    const responseTask = await plan.addTask({
      title: "Generate response",
    });

    // Stream response
    const response = await agent.stream({
      prompt: [...history, { role: "user", content: message.text }],
    });

    // Get full response text
    let responseText = "";
    for await (const chunk of response.fullStream) {
      responseText += chunk;
    }

    await plan.updateTask(`Response generated (${responseText.length} chars)`);

    // Step 3: Post response
    const postTask = await plan.addTask({
      title: "Post response to platform",
    });

    // Create streaming response
    const streamPlan = new StreamingPlan(
      (async function* () {
        yield responseText;
      })(),
      {
        groupTasks: "plan",
        updateIntervalMs: 750,
      }
    );

    await thread.post(streamPlan);
    await plan.updateTask("Response posted successfully");

    // Complete
    await plan.complete({
      completeMessage: "✅ Request processed and evidence logged",
    });

    logger.info("Message processed successfully", {
      platform: thread.adapter.name,
      responseLength: responseText.length,
    });
  } catch (error) {
    logger.error("Error processing mention", {
      error: error instanceof Error ? error.message : String(error),
      platform: thread.adapter.name,
    });

    try {
      await thread.post(
        "Sorry, I encountered an error processing your request. Please try again."
      );
    } catch (postError) {
      logger.error("Failed to post error message", {
        error:
          postError instanceof Error ? postError.message : String(postError),
      });
    }
  }
});

/**
 * Handle direct messages
 */
chat.onDirectMessage(async (thread, message) => {
  logger.info("Direct message received", {
    platform: thread.adapter.name,
    author: message.author.name,
  });

  try {
    const response = await agent.stream({
      prompt: [{ role: "user", content: message.text }],
    });

    await thread.post(response.fullStream);
  } catch (error) {
    logger.error("Error processing DM", {
      error: error instanceof Error ? error.message : String(error),
    });
    await thread.post(
      "I encountered an error. Please check your request and try again."
    );
  }
});

/**
 * Error handler
 */
chat.onError((error) => {
  logger.error("Chat error", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
});

/**
 * Start listening
 */
async function main() {
  logger.info("Starting OMNI-333 Agent...", {
    agentName: process.env.AGENT_NAME,
    agentModel: process.env.AGENT_MODEL,
    requireApproval: process.env.REQUIRE_APPROVAL,
  });

  try {
    await chat.listen();
    logger.info("Agent is listening for messages");
  } catch (error) {
    logger.error("Failed to start agent", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down agent gracefully...");
  await chat.close();
  process.exit(0);
});

// Start agent if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error("Fatal error", { error });
    process.exit(1);
  });
}

export { chat, agent, chatTools };

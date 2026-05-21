/**
 * Core type definitions for OMNI-333 Agent
 */

export interface AgentConfig {
  name: string;
  model: string;
  temperature: number;
  maxTokens: number;
  requireApproval: boolean;
}

export interface ChatAdapterConfig {
  slack?: {
    botToken: string;
    signingSecret: string;
    appToken: string;
  };
  teams?: {
    appId: string;
    appPassword: string;
  };
  discord?: {
    botToken: string;
    clientId: string;
  };
  telegram?: {
    botToken: string;
    webhookUrl: string;
  };
}

export interface Message {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
  };
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  type: "image" | "file" | "video" | "audio" | "unknown";
  url: string;
  name?: string;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (input: any) => Promise<string>;
}

export interface DATA_QUBIT_State {
  type: "T" | "S" | "D" | "N"; // Truth, Supposition, Data, Null
  value: any;
  hash?: string;
  timestamp: Date;
}

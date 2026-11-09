import OpenAI from "openai";
import { config } from "../config.js"
import { BOARD_SYSTEM_PROMPT } from "./persona.js";

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

const client = config.aiApiKey ? new OpenAI({ apiKey: config.aiApiKey }) : null;

export async function askModel(history: Turn[]): Promise<string> {
  if (!client) return "The Board has registered your transmission.";

  const response = await client.responses.create({
    model: config.aiModel,
    store: true,
    max_output_tokens : 150,
    instructions: BOARD_SYSTEM_PROMPT,
    input: history
  });

  const block = response.output[0];
  const output_text = block?.type === "message" ? block.content[0]?.type === "output_text" ? block.content[0].text : "" : "";
  return output_text;
}
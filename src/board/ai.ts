export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export async function askModel(history: Turn[]): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800)); //simulate latency
  return `The Board has registered your transmission. (${history.length} turns on file)`;
}
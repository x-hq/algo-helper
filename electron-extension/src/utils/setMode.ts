import { broadcast } from "../server/utils/broadcast";
import { logger } from "./logger";

export type AssistantMode = "algorithms" | "system-design" | "free-form";
export type ConversationMode = "question" | "follow-up" | "correction";

type Mode = {
  assistant: AssistantMode;
  conversation: ConversationMode;
};

export const mode: Mode = {
  assistant: "algorithms",
  conversation: "question",
};

export const setMode = (newMode: Partial<Mode>) => {
  logger.log('SET MODE', newMode);
  broadcast(`SET MODE: ${JSON.stringify(newMode)}`);
  Object.assign(mode, newMode);
};

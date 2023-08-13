
import { ChatCompletionRequestMessage } from "openai";

import { mode } from "../../utils/setMode";
import { promptConfig as csPromptConfig } from "../prompts/cs";
import { promptConfig as dsPromptConfig } from "../prompts/ds";
import { promptConfig as freeFormPromptConfig } from "../prompts/free";
import { PromptModeConfig } from "../utils/promptMode";
import { openai } from "./openAi";
import { broadcast } from "./broadcast";


export let messagesMemo: ChatCompletionRequestMessage[] = [];

export async function getCompletion(prompt: string) {
  let content = "";
  // const messages: ChatCompletionRequestMessage[] = [];

  let systemPrompt = "";
  let userPrompt = prompt;

  let keepHistory = false;
  let promptMode: PromptModeConfig;

  // Assistant mode
  if (mode.assistant === "algorithms") {
    promptMode = csPromptConfig;
  }
  if (mode.assistant === "system-design") {
    promptMode = dsPromptConfig;
  }
  if (mode.assistant === "free-form") {
    promptMode = freeFormPromptConfig;
  }

  systemPrompt = promptMode.assistantPrompt; 

  // Question format
  if (mode.conversation === "question") {
    userPrompt = promptMode.getQuestionPrompt(prompt);
  }
  if (mode.conversation === "follow-up") {
    userPrompt = promptMode.getFollowUpPrompt(prompt);
    keepHistory = true;
  }
  if (mode.conversation === "correction") {
    userPrompt = promptMode.getCorrectionPrompt(prompt);
    keepHistory = true;
  }

  if (keepHistory) {
    messagesMemo = [
      ...messagesMemo,
      {
        role: "user",
        content: userPrompt,
      },
    ];
  } else {
    messagesMemo = [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: userPrompt },
    ];
  }

  broadcast(userPrompt.substring(0, 150) + '...')

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesMemo,
    temperature: 0.5
  });
  content = completion.data.choices[0].message?.content ?? "";

  return content;
}
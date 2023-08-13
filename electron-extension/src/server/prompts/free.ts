import { PromptModeConfig } from "../utils/promptMode";

export const freeFormAssistantPrompt = `You are an AI assistant oriented at providing concise and direct answers in the context of computer science, coding, and system design. Respond briefly and to the point.`;
export const getQuestionPrompt = (prompt: string) => `Question: ${prompt}`
export const getFFFollowUp = (prompt: string) => `Follow-up: ${prompt}`
export const getFFCorrection = (prompt: string) => `Correction: ${prompt}`

export const promptConfig: PromptModeConfig = {
    assistantPrompt: freeFormAssistantPrompt,
    getQuestionPrompt: getQuestionPrompt,
    getCorrectionPrompt: getFFCorrection,
    getFollowUpPrompt: getFFFollowUp
}
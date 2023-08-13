
export type PromptModeConfig = {
    assistantPrompt: string,
    getQuestionPrompt: (prompt: string) => string,
    getCorrectionPrompt: (prompt: string) => string,
    getFollowUpPrompt: (prompt: string) => string
}
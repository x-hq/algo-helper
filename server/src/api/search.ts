import express from "express";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { exec } from "child_process";
var { tidy } = require("htmltidy2");
var sanitizeHtml = require('sanitize-html');

// Function to execute a shell command and return it as a Promise
function execShellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        reject(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

// Function to delay the execution for a specified time
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeClipboardContent() {
  try {
    // Get clipboard content
    const clipboardContent = await execShellCommand("pbpaste");
    const trimmedContent = clipboardContent.substring(0, 2000); // limit to 500 chars

    // Split the text into characters
    const characters: string[] = trimmedContent.split("");

    // Paste each character individually
    for (const char of characters) {
      // Convert char to hexadecimal
      const hexChar = Buffer.from(char, "utf8").toString("hex");

      // Use printf to set the clipboard to the character (printf doesn't add a newline by default)
      const pbcopyCommand = `printf "\\x${hexChar}" | pbcopy`;
      await execShellCommand(pbcopyCommand);

      // Use AppleScript to paste the character
      const osaCommand = `osascript -e 'tell application "System Events" to keystroke "v" using {command down}'`;
      await execShellCommand(osaCommand);

      // If the character is a space, pause for a random amount of time up to 2 seconds
      if (char === " ") {
        const pauseTime = Math.random() * 300;
        await delay(pauseTime);
      }
    }

    // Restore the original clipboard content
    const pbcopyCommandRestore = `printf "%s" "${clipboardContent}" | pbcopy`;
    await execShellCommand(pbcopyCommandRestore);

    console.log("Success!");
  } catch (error) {
    console.error("Failed to type clipboard content", error);
  }
}

function pbcopy(data: any) {
  var proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
}

console.log("INIT HERE", {
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const router = express.Router();

type SearchResponse = {
  success: boolean;
  content: string;
};

const prompt2 = `
  IMPORTANT: You are an AI assistant that interprets advanced computer science problems and generates solutions. You parse various formats like HTML, plain text, and JSON objects correctly. Your output is TypeScript code with comments but you include Structured English Pseudocode and Python demonstrations as a part of the documentation. The only executable code is TypeScript. Python code goes inside comments. Every piece of information, explanation, and analysis is delivered in the form of code comments. THE FORMAT MUST STRICTLY FOLLOW THIS STRUCTURE:

  /*
  === Problem Statement ===
  (Interpretation of the problem goes here)
  
  === Problem Inputs, Outputs and Constraints ===
  (Formal mathematical definitions of inputs, outputs and constrains go here)  

  === Algorithm Chosen ===
  (The algorithmic technique that is chosen to resolve this problem with a short definition goes here.)

  === Solution Explanation ===
  (FORMAT: ONE SHORT PARAGRAPH. Intuitive explanation of the solution that is meant for someone that doesn't understand the concepts goes here.)
  
  === Steps to Resolve ===
  (FORMAT: CONCISE BULLET POINTS. Steps to resolve the problem in clear and simple English language USING 100 WORDS OR LESS goes here.)

  === Pseudocode ===
  (FORMAT: STRUCTURED ENGLISH PSEUDOCODE. Pseudocode of the algorithm goes here.)
  
  === TypeScript Solution ===
  */
  
  (FORMAT: TYPESCRIPT CODE. IMPORTANT: DO NOT SKIP THIS SECTION. The actual TypeScript code solution with explanatory line comments goes here.)
  
  /*
  === Complexity Analysis ===
  (FORMAT: BULLET POINTS. IMPORTANT: DO NOT SKIP THIS SECTION. Time and space complexity analysis goes here.)
  
  === Unit tests ===
  (FORMAT: TYPESCRIPT+JEST CODE. Unit tests to validate the solution, in the form of a comment block go here.)
  */
`;

function correctionPrompt(prompt: string) {
  const correctPrompt = `IMPORTANT: The solution provided earlier has failed the following test cases. Please analyse these failed test cases, diagnose the issue, and update the existing solution accordingly. Ensure that the updated solution is delivered in TypeScript code with all explanations, analyses, and failed test cases included as code comments in the previously defined structure.

=== Failed Test Cases ===
${prompt}

After carefully analysing these cases, please provide an updated solution in the same format as before.`;
  return correctPrompt;
}

let messagesMemo: ChatCompletionRequestMessage[] = [];

async function getCompletion(prompt: string, isCorrection: boolean = false) {
  let content = "";
  let messages: ChatCompletionRequestMessage[] = [];

  if (isCorrection) {
    messages = [
      ...messagesMemo,
      {
        role: "user",
        content: correctionPrompt(prompt),
      },
    ];
  } else {
    messages = [
      {
        role: "system",
        content: prompt2,
      },
      { role: "user", content: prompt },
    ];
  }

  console.log("SENDING MESSAGES", messages);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });
  content = completion.data.choices[0].message?.content ?? "";

  return content;
}
router.post<{}, SearchResponse>("/", async (req, res) => {
  console.log(
    "CONFIG",
    {
      organization: process.env.OPENAI_ORG,
      apiKey: process.env.OPENAI_API_KEY,
    },
    configuration,
    openai
  );
  console.log("RECEIVED DATA", req.body);

  let content = "";
  try {
    let text = "";

    if (req.body.html) {
      text = `<div>${req.body.html}</div>`;
      text = sanitizeHtml(text);
      text = await new Promise((res) =>
        tidy(
          text,
          {
            clean: true,
            
            showBodyOnly: true,
            'merge-divs': true,

            mergeDivs: true,
            mergeEmphasis: true,

            mergeSpans: true,
            'merge-spans': true,
          },
          (err: any, html: any) =>
            err ? console.error("TIDY ERROR", err) : res(html)
        )
      );
      text = text.replace(/(\r\n|\n|\r)/gm, "");
    } else {
      text = req.body.text;
    }

    content = await getCompletion(text);
    console.log("COMPLETION DONE", content);
  } catch (e) {
    console.error(e);
    return {
      success: false,
      content: content,
    };
  }

  // Memoize the messages so that we can use them in the next request
  messagesMemo = [
    ...messagesMemo,
    {
      role: "assistant",
      content: content,
    },
  ];

  content = content.replace(/^```typescript/g, "");
  content = content.replace(/```$/g, "");

  pbcopy(content);

  console.log("RESPONSE", {
    success: true,
    content: content,
  });

  res.json({
    success: true,
    content: content,
  });
});

router.post<{}, SearchResponse>("/paste", async (req, res) => {
  await typeClipboardContent();
  res.json({
    success: true,
    content: "",
  });
});

router.post<{}, SearchResponse>("/add", async (req, res) => {
  console.log("ATTEMPTING ADD-DATA", req.body);

  let content = "";
  try {
    content = await getCompletion(req.body.text ?? "", true);

    console.log("COMPLETION DONE", content);
  } catch (e) {
    console.error(e);
    return {
      success: false,
      content: content,
    };
  }

  // Memoize the messages so that we can use them in the next request
  messagesMemo = [
    ...messagesMemo,
    {
      role: "assistant",
      content: content,
    },
  ];

  res.json({
    success: true,
    content: "",
  });
});

export default router;

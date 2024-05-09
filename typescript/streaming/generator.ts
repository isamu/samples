// install openai and dotenv packages and set .env OPENAI_API_KEY=sk-xxx
import "dotenv/config";
import OpenAI from "openai";

export async function *streamFunciton() {
  const openai = new OpenAI();

  const chatStream = await openai.beta.chat.completions.stream({
    messages: [{ role: "user", content: "日本の歴史について200文字でまとめてください" }],
    model: "gpt-3.5-turbo",
    stream: true,
  });

  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (token) {
      yield token
    }
  }

  const chatCompletion = await chatStream.finalChatCompletion();
  return chatCompletion;
}

export async function streamCallbackFunciton(callback: (token: string) => void) {
  const openai = new OpenAI();

  const chatStream = await openai.beta.chat.completions.stream({
    messages: [{ role: "user", content: "日本の歴史について200文字でまとめてください" }],
    model: "gpt-3.5-turbo",
    stream: true,
  });

  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (token) {
      callback(token);
    }
  }

  const chatCompletion = await chatStream.finalChatCompletion();
  return chatCompletion;
}

const main = async () => {
  
  for await (const token of streamFunciton()) {
    console.log(token);
  }
  
  
  const generator = streamFunciton()
  let result = await generator.next();
  while (!result.done) {
    const value = await result.value;
    console.log(value)
    result = await generator.next();
  }
  console.log(JSON.stringify(result.value));

  const callbackResult = await streamCallbackFunciton((token) => {
    console.log(token);
  });
  console.log(callbackResult);
  
};

main();

import { Groq } from 'groq-sdk';

const groq = new Groq();

const chatCompletion = await groq.chat.completions.create({
  "messages": [
    {
      "role": "user",
      "content": "Quién dice la frase 'El conocimiento es poder'?"
    }
  ],
  "model": "moonshotai/kimi-k2-instruct-0905",
  "temperature": 0.6,
  "max_completion_tokens": 4096,
  "top_p": 1,
  "stream": true,
  "stop": null
});

for await (const chunk of chatCompletion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}



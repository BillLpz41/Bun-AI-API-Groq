import 'dotenv/config';
import { AIService } from '../types.js';
import { Groq } from 'groq-sdk';
import { ChatMessage } from '../types.js';
import { Chat } from 'groq-sdk/resources.mjs';

const groq = new Groq();

export const groqService: AIService = {
    name: 'Groq',
    async chat(messages: ChatMessage[]) {
        const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "moonshotai/kimi-k2-instruct-0905",
        temperature: 0.6,
        max_completion_tokens: 2048, //antes 4096
        top_p: 1,
        stream: true,
        stop: null
        });

        //Retorna una función asincrona generadora (el asterisco) que produce fragmentos de texto
        return (async function* () {//Gracias a que es generadora, puede ir obteniendo cada parte de la respuesta conforme se recibe
        for await (const chunk of chatCompletion) {
            yield chunk.choices[0]?.delta?.content || '' //Yield devuelve una respuseta conforme se obtiene una parte de la respuesta
            }
        })()
    }
}



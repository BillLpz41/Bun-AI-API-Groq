import Cerebras from '@cerebras/cerebras_cloud_sdk';
import 'dotenv/config';
import type { ChatMessage, CerebrasChunk } from '../types.js';

const cerebras = new Cerebras();

export const cerebrasService = {
    name: 'Cerebras',
    async chat(messages: ChatMessage[]) {
        const chatCompletion = await cerebras.chat.completions.create({
        //messages: messages.map(m => ({ role: m.role, content: m.content })),
        messages: messages as any,
        model: "gpt-oss-120b",
        temperature: 1,
        max_completion_tokens: 2048, //antes 32768
        top_p: 1,
        stream: true,
        }) as AsyncIterable<CerebrasChunk>;

        //Retorna una función asincrona generadora (el asterisco) que produce fragmentos de texto
        return (async function* () {//Gracias a que es generadora, puede ir obteniendo cada parte de la respuesta conforme se recibe
        for await (const chunk of chatCompletion) {
            yield chunk.choices[0]?.delta?.content || '' //Yield devuelve una respuseta conforme se obtiene una parte de la respuesta
            }
        })()
    }
}

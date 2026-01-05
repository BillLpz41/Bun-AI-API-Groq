import http from "http";
import { groqService } from "./services/groq.js";
import type { AIService, ChatMessage } from "./types.js";
import { cerebrasService } from "./services/cerebras.js";

const services: AIService[]= [
    groqService,
    cerebrasService
];
let currentServiceIndex= 0;

function getNextService(): AIService{
    if(services.length===0) throw new Error("No AI services available");
    const service= services[currentServiceIndex];
    currentServiceIndex= (currentServiceIndex + 1) % services.length;
    return service!;
}

const port= process.env.PORT ?? 3000;

const server= http.createServer(async (req, res)=>{
    // Parsear la URL para obtener el pathname limpio
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const pathname = url.pathname;

    //Si la ruta es /chat y el método es POST, entonces se responde con un mensaje de texto
    if (pathname === "/chat" && req.method === "POST") {
        //Obtener los mensajes de la solicitud
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const body = Buffer.concat(buffers).toString();
        const { messages } = JSON.parse(body) as { messages: ChatMessage[] };
        //Obtener el servicio siguiente
        const service= getNextService();
        //Log del servicio usado
        console.log(`Servicio en uso: ${service.name}`);

        //Obtener los mensajes
        const stream= await service?.chat(messages);

        res.writeHead(200, { "Content-Type": "text/plain" });
        for await (const chunk of stream) {
            res.write(chunk);
        }
        res.end();
        return;
    }

    res.end("Not found 404");

});

server.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
});

/*Uso con Bun:
const server= Bun.serve({
    //Usar el puerto definido en las variables de entorno o el 3000 por defecto
    port: process.env.PORT ?? 3000,
    //Función asincrona que maneja las solicitudes entrantes
    async fetch(req){
        return new Response("La API workea waos");
    }
})

//Dice que el servidor está corriendo en la URL y puerto especificados
console.log(`Server running on ${server.url}:${server.port}`);

*/
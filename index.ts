import http from "http";

const port= process.env.PORT ?? 3000;

const server= http.createServer(async (req, res)=>{
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("La API workea waos");
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
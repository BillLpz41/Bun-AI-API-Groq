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
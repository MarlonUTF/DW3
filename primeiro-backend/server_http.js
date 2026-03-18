import http from 'http'

http.createServer((req, res) => {
    console.log("Chegou uma requisição")
    res.end("Olá, tudo bem?")
}).listen(3000)
console.log("Servidor rodando")
// Import the framework and instantiate it
import Fastify from 'fastify'
const server = Fastify({
  //logger: true
})

const tarefas = [
    { id: 1, titulo: 'Comprar leite', concluida: false },
    { id: 2, titulo: 'Estudar JavaScript', concluida: true },
    { id: 3, titulo: 'Fazer exercícios de programação', concluida: false }
]

// Declare a route
server.get('/', async (req, res) => {
    console.log('Requisição recebida!')
    res.send('Hello World')
})

server.get('/json', async (req, res) => {
    console.log('Requisição json recebida!')
    res.send({ nome: "João", idade: 30 })
})

server.get('/html', async (req, res) => {
    console.log('Requisição html recebida!')
    res
        .type('text/html')
        .send('<h1>Olá, mundo!</h1><p>Esta é uma resposta HTML.</p>')
})

server.get('/tarefas', async (req, res) => {
    console.log('Requisição tarefas recebida!')
    res.send(tarefas)
})

server.post('/tarefas', async (req, res) => {
    console.log('Requisição POST tarefas recebida!')
    const novaTarefa = req.body
    tarefas.push(novaTarefa)
    res.send({ status: 'successo', message: 'Tarefa adicionada com sucesso!' }) 
})

// Run the server!
try {
  await server.listen({ port: 3000 })
  console.log('Server rodando em http://localhost:3000')
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
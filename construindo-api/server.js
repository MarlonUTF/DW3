import Fastify from 'fastify'
import cors from '@fastify/cors'

const server = Fastify()
const PORT = 3000

// "Banco de dados" em memória
const tarefas = [
    { id: 1, descricao: "Fazer compras", concluido: false },
    { id: 2, descricao: "Lavar o carro", concluido: false },
    { id: 3, descricao: "Estudar Fastify", concluido: true }
]

// Habilita CORS para permitir requisições de qualquer origem
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

// READ: Lista todas as tarefas, com suporte a filtro por ?concluido=true/false
server.get('/tarefas', async (request, reply) => {
    const { busca, concluido } = request.query

    let resultado = tarefas

    // Filtro por descrição (busca)
    if (busca) {
        resultado = resultado.filter(t =>
            t.descricao.toLowerCase().includes(busca.toLowerCase())
        )
    }

    // Filtro por status (concluido)
    if (concluido !== undefined) {
        resultado = resultado.filter(t =>
            String(t.concluido) === concluido
        )
    }

    return reply.send(resultado)
})

// CREATE: Adiciona uma nova tarefa
server.post('/tarefas', async (request, reply) => {
    const tarefa = request.body
    const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1
    const novaTarefa = { id: novoId, ...tarefa }
    tarefas.push(novaTarefa)
    return reply.status(201).send(novaTarefa)
})

// READ: Busca uma tarefa específica por ID
server.get('/tarefas/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const tarefa = tarefas.find(t => t.id === id)
    if (!tarefa) {
        return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
    }
    return reply.send(tarefa)
})

// UPDATE: Atualiza parcialmente uma tarefa (PATCH)
server.patch('/tarefas/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const index = tarefas.findIndex(t => t.id === id)
    if (index === -1) {
        return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
    }
    const tarefaAtualizada = request.body
    // Mantém o ID e mescla as propriedades antigas com as novas
    tarefas[index] = { ...tarefas[index], ...tarefaAtualizada, id }
    return reply.send(tarefas[index])
})

// DELETE: Remove uma tarefa por ID
server.delete('/tarefas/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const index = tarefas.findIndex(t => t.id === id)
    if (index === -1) {
        return reply.status(404).send({ status: 'error', message: 'Tarefa não encontrada' })
    }
    tarefas.splice(index, 1)
    return reply.status(204).send()
})

// Personaliza resposta para rotas inexistentes
server.setNotFoundHandler((request, reply) => {
    return reply.code(404).send({
        status: 'error',
        message: 'O recurso solicitado não existe nesta API.',
    })
})

// Inicia o servidor de forma assíncrona
const start = async () => {
    try {
        await server.listen({ port: PORT })
        console.log(`Servidor rodando em http://localhost:${PORT}`)
    } catch (erro) {
        console.error(erro)
        process.exit(1)
    }
}

start()
import Fastify from 'fastify'
import cors from '@fastify/cors'

const server = Fastify()
const PORT = 3000

const tarefas = [
    { id: 1, descricao: "Fazer compras", concluido: false },
    { id: 2, descricao: "Lavar o carro", concluido: false },
    { id: 3, descricao: "Estudar Fastify", concluido: true }
]

server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

// GET com filtros combinados (busca + concluido)
server.get('/tarefas', async (request, reply) => {
    const { busca, concluido } = request.query

    let resultado = tarefas

    if (busca) {
        resultado = resultado.filter(t =>
            t.descricao.toLowerCase().includes(busca.toLowerCase())
        )
    }

    if (concluido !== undefined) {
        resultado = resultado.filter(t =>
            String(t.concluido) === String(concluido)
        )
    }

    return reply.send(resultado)
})

// POST com validação
server.post('/tarefas', async (request, reply) => {
    const { descricao, concluido = false } = request.body

    if (!descricao || descricao.trim() === '') {
        return reply.status(400).send({
            status: 'error',
            message: 'A descrição é obrigatória'
        })
    }

    const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1
    const novaTarefa = { id: novoId, descricao, concluido }

    tarefas.push(novaTarefa)

    return reply.status(201).send(novaTarefa)
})

// GET por ID
server.get('/tarefas/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const tarefa = tarefas.find(t => t.id === id)

    if (!tarefa) {
        return reply.status(404).send({
            status: 'error',
            message: 'Tarefa não encontrada'
        })
    }

    return reply.send(tarefa)
})

// PATCH padrão
server.patch('/tarefas/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const index = tarefas.findIndex(t => t.id === id)

    if (index === -1) {
        return reply.status(404).send({
            status: 'error',
            message: 'Tarefa não encontrada'
        })
    }

    tarefas[index] = { ...tarefas[index], ...request.body, id }

    return reply.send(tarefas[index])
})

// PATCH toggle concluir
server.patch('/tarefas/:id/concluir', async (request, reply) => {
    const id = Number(request.params.id)
    const index = tarefas.findIndex(t => t.id === id)

    if (index === -1) {
        return reply.status(404).send({
            status: 'error',
            message: 'Tarefa não encontrada'
        })
    }

    tarefas[index].concluido = !tarefas[index].concluido

    return reply.send(tarefas[index])
})

// DELETE
server.delete('/tarefas/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const index = tarefas.findIndex(t => t.id === id)

    if (index === -1) {
        return reply.status(404).send({
            status: 'error',
            message: 'Tarefa não encontrada'
        })
    }

    tarefas.splice(index, 1)

    return reply.status(204).send()
})

// GET resumo
server.get('/tarefas/resumo', async (request, reply) => {
    const total = tarefas.length
    const concluidas = tarefas.filter(t => t.concluido).length
    const pendentes = total - concluidas

    return reply.send({
        total,
        concluidas,
        pendentes
    })
})

server.setNotFoundHandler((request, reply) => {
    return reply.code(404).send({
        status: 'error',
        message: 'O recurso solicitado não existe nesta API.',
    })
})

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
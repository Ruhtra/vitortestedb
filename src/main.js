require('dotenv').config()
const express = require('express')
const Database = require('./config/mongoDB.js')
const app = express()
const configEngine = require('./config/viewEngine.js')

const PORT = process.env.PORT
configEngine(app)
app.use(express.urlencoded({ extended: true }))

const DB = {
    getIds: async () => {
        let result = await Database.get().collection('Data').find({}, { projection: { _id: 0, Nome: 0, Modelo: 0, Defeito: 0, Saida: 0, Chegada: 0 } } ).toArray()
        return result.map(e => e.Id)
    },
    insert: async (user) => {
        return await Database.get().collection('Data').insertOne(user)
    },
    search: {
        name: async (name) => {
            return await Database.get().collection('Data').find({ Nome: { $regex: name } }, { projection: { _id: 0 }}).toArray()
        },
        id: async (id) => {
            return await Database.get().collection('Data').find({ Id: id }, { projection: { _id: 0 } }).toArray()
        },
        _id: async (_id) => {
            return await Database.get().collection('Data').findOne({ _id: _id }, { projection: { _id: 0 } })
        }
    }
}
async function generateId() {
    var listId = await DB.getIds()
    while (true) {
        let id = Math.floor(1000*(Math.random() * (1 - 10) + 10))
        console.log(id)
        if (!listId.includes(id)) return id
    }
}
function filter(data) {
    return {
        Id: Number(data.Id),
        Nome: data.Nome.toString().toLowerCase().trim(),
        Modelo: data.Modelo.toString().trim(),
        Defeito: data.Defeito.toString().trim(),
        Chegada: new Date(data.Chegada),
        Saida: new Date(data.Saida)
    }
}

app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.get('/api/search/Name', async (req, res) => {
    let name = req.query.Name || ''

    name = name.toString().toLowerCase()

    let result = await DB.search.name(name)
    return res.send(result)
})
app.get('/api/search/Id', async (req, res) => {
    let id = req.query.Id
    id = Number(id)
    if (!id) return res.send([])

    let result = await DB.search.id(id)
    console.log(result)
    return res.send(result)
})
app.get('/api/search/all', async (req, res) => {
    var result = await Database.get().collection('Data').find({}, {projection: {_id: 0}}).toArray()
    return res.send(result)
})
app.post('/api/insert/newuser', async (req, res) => {
    var user = {
        Nome: req.body.Nome,
        Modelo: req.body.Modelo,
        Defeito: req.body.Defeito,
        Chegada: req.body.Chegada,
        Saida: req.body.Saida,
    }
    for (let e in user) {  if (!user[e]) return res.sendStatus(404) }
    user['Id'] = await generateId()
    var result = await DB.insert(filter(user))

    return res.send()
})


const main = async () => {
    await Database.connect()
    app.listen(PORT, () => {
        console.log(`> Running in port ${PORT}`)
    })
}


main().catch(err => {console.log(err)})


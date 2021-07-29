const DB = require('../Functions/queryDB.js')

async function generateId() {
    var listId = await DB.getIds()
    while (true) {
        let id = Math.floor(1000*(Math.random() * (1 - 10) + 10))
        if (!listId.includes(id)) return id
    }
}
function filter(data) {
    data.Chegada = Date.parse(data.Chegada)
    data.Saida = Date.parse(data.Saida)

    if (data.Nome.match(/[^a-z ]/g)) throw 'Nome invalido'
    if (isNaN(data.Chegada)) throw 'Data invalida'
    if (isNaN(data.Saida)) throw 'Data invalida'

    data.Chegada = new Date(data.Chegada)
    data.Saida = new Date(data.Saida)

    return data
}
function err(res) {
    return res.status(500).send({message: `Server error`})
}

module.exports = {
    search: {
        Name: async (req, res) => {
            var name = (req.query.Name || '').toString().toLowerCase().trim()
            
            if (!name) return err(res)
            if (name.match(/[^a-z ]/g)) return err(res)

            return res.send(await DB.search.name(name))
        },
        Id: async (req, res) => {
            var id = (req.query.Id || '').toString().toLowerCase().trim()

            if (!id) return err(res)
            if (id.match(/[^0-9]/g) || id.length != 4) return err(res)

            return res.send(await DB.search.id(Number(id)))
        },
        all: async (req, res) => {
            return res.send(await DB.all())
        }
    },
    insert: {
        newUser: async (req, res) => {
            var user = {
                Nome: (req.body.Nome || '').toString().toLowerCase().trim(),
                Modelo: (req.body.Modelo || '').toString().trim(),
                Defeito: (req.body.Defeito || '').toString().trim(),
                Chegada: (req.body.Chegada || '').toString().trim(),
                Saida: (req.body.Saida || '').toString().trim(),
            }
            for (let e in user) if (!user[e]) return err(res)
            
            try { user = filter(user) }
            catch { return err(res) }

            user['Id'] = await generateId()
            console.log(user)

            await DB.insert(user)
            return res.status(200).send()
        }
    }
}
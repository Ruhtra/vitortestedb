const Database = require('../config/mongoDB.js')
const DB = Database.get('Data')

module.exports = {
    getIds: async () => {
        let result = await DB.find({}, { projection: { _id: 0, Nome: 0, Modelo: 0, Defeito: 0, Saida: 0, Chegada: 0 } } ).toArray()
        return result.map(e => e.Id)
    },
    insert: async (user) => {
        return await DB.insertOne(user)
    },
    all: async () => {
        return await DB.find({}, { projection: { _id: 0 } }).toArray()
    },
    search: {
        name: async (name) => {
            return await DB.find({ Nome: { $regex: name } }, { projection: { _id: 0 }}).toArray()
        },
        id: async (id) => {
            return await DB.find({ Id: id }, { projection: { _id: 0 } }).toArray()
        },
        _id: async (_id) => {
            return await DB.findOne({ _id: _id }, { projection: { _id: 0 } })
        }
    }
}
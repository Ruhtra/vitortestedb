const { MongoClient } = require("mongodb")

const uri = process.env.MONGOURI
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

let database = null

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(uri, option, (err, db) => {
        if (err) return reject(err)

        database = db.db('Users')
        resolve(database)
    })
})

module.exports.get = () => {
    if(!database) throw new Error('Call connect DB first!')

    return database
}
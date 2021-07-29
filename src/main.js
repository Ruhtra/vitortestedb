require('dotenv').config()
const express = require('express')
const app = express()
const Database = require('./config/mongoDB.js')
const configEngine = require('./config/viewEngine.js')
const cors = require('cors')

// Vars
    const PORT = process.env.PORT || 3000

const main = async () => {
    console.log('> Starting Modules...')
    console.log(await Database.connect())
    // Config
        configEngine(app)
        app.use(cors())
        app.use(express.urlencoded({ extended: true }))
    // Routes
        app.get('/', (req, res) => {
            res.render('index.ejs')
        })
        app.use('/api', require('./routes/api.js'))
    // Errors
        app.use(function(err, req, res, next){
            console.log(err)
            res.status(500).send({ message: 'Erro interno do server' })
        })

    app.listen(PORT, () => {
        console.log(`> Running in port ${PORT}`)
    })
}

main().catch(console.error)
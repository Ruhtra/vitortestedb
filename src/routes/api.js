const controllerApi = require('../controllers/api.js')
const router = require('express').Router()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/search/Name', use(controllerApi.search.Name))
router.get('/search/Id', use(controllerApi.search.Id))
router.get('/search/all', use(controllerApi.search.all))
router.post('/insert/newUser', use(controllerApi.insert.newUser))

// router.get('/teste', use((req ,res) => {res.send('A test')}))


module.exports = router
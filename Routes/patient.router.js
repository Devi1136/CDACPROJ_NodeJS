const { createPatientController, loginPatientController , getAll } = require('../Controller/patient.controller')
const { checkToken } = require('../auth/token_validation')
const router = require('express').Router()


router.post('/patient/register', createPatientController)
router.post('/patient/login', loginPatientController)
router.get('/patient/getall/:id', checkToken, getAll)


module.exports = router;
const { createPatientService, getPatientByEmailService,getAllDetails } = require('../Model/patient.service')
const { SHA1 } = require('crypto-js')
const { sign } = require('jsonwebtoken')

const { sendMailTo } = require('../Model/mail.service')
module.exports = {

    createPatientController: (req,res) => {
        const image = req.files.profile_photo
        const body = req.body
        body.pwd = ''+SHA1(body.pwd)
        
        createPatientService(image.tempFilePath,body, (err, results) => {
            if(err){
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"})
            }
            else{
                var TO = body.email
                var SUBJECT = "Patient Registration"
                var TEXT = `Kindly informing you Mist/Miss ${body.fname} ${body.lname} Your Account on Med History App is Successfully Registered`
                sendMailTo(TO,SUBJECT,TEXT)
                return res.status(200).json({
                    success: 1,
                    data: results

            })}
        })
    },

    getAll: (req,res) => {
        const uid = req.params.id
        getAllDetails(uid, (err, results) => {
            if(err){
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Data not found"})
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Record not found"
                })
            }
            else{
                return res.status(200).json({
                    success: 1,
                    data: results
            })}
        })
    },

    loginPatientController : (req,res) =>{
      const body = req.body
      body.pwd = ''+SHA1(body.pwd)
      getPatientByEmailService(body,(err,results) => {
            if(err){
                console.log(err)
            }
            if(!results){
                return res.json({
                    success : 0,
                    data : "Invalid email or password"
                })
            }

            if(results){
                results.pwd = undefined
                
                const jsontoken = sign({ result: results }, process.env.PRIVATEKEY , { expiresIn:"30m" })
                return res.status(200).json({
                    success : 1,
                    message: "Login successfully",
                    token: jsontoken
                })
            }else{
                return res.json({
                    success : 0,
                    message : "Invalid email or password"
                })
            }
        })
    }
}
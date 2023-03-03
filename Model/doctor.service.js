const { cloud } = require('../config/cloudinary')
const pool = require('../config/database')

module.exports = {
    doctorPhotoService: (image,body,callBack) => {
        const imagePath = cloud(image)
        pool.execute(
            `update into doctor_primary 
            set profile_photo = '${imagePath}'
            where doctor_id = '${body.doctor_id}'`,
            (err, result) => {
                if(err){
                    return callBack(err)
                }
                return callBack(null,result)
                
            }
        )
    },

    docPatientDetailsService: (patientID, callBack) => {
        pool.execute(
            `select * from patient_primary
            where uid = '${patientID}'`,
            (err, result) => {
                if(err){
                    return callBack(err)
                }
                return callBack(null, result)
            }
        )
    }
}
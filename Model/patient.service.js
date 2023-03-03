const pool = require('../config/database')
const { cloud } = require('../Model/cloud.service')

module.exports = {

    createPatientService : (image,data,callBack) => {
        pool.execute(   //inserting address info in address table
            `insert into address(address_line_1,user_state,
                city,pincode,country)
            values('${data.address_line_1}','${data.user_state}',
            '${data.city}','${data.pincode}','${data.country}')`,
            (error, address_result) => {
                if(error){
                    return callBack(error)
                }
                pool.execute(   // selecting address_Id from address table
                    'select address_id from `address` where `address_line_1` = ?',[data.address_line_1],
                    (error, add_result) => {
                        if(error){
                            return callBack(error)
                        }
                        var add_id = add_result[0].address_id
                        cloud(image,(error,imageURL) => { // uploading image to cloudinary
                            if(error){
                                console.log(error)
                            }
                            console.log(imageURL)
                        pool.execute(
                            `insert into patient_primary(profile_photo,fname, lname, 
                                email, pwd, date_of_birth, 
                                phone,gender,adhaar_card,
                                marital_status,occupation,
                                address_id,
                                security_questions_answer) 
                            values('${imageURL}','${data.fname}','${data.lname}',
                            '${data.email}','${data.pwd}','${data.date_of_birth}',
                            '${data.phone}','${data.gender}','${data.adhaar_card}',
                            '${data.marital_status}','${data.occupation}',
                            '${add_id}',
                            '${data.security_questions_answer}')`,
                            (error, primary_results) => {
                                if(error){
                                    return callBack(error)
                                }
                                
                                return callBack(null,primary_results)
                            }
                
                        )
                        })
                    }
                )
            }
        )
    },
    getAllDetails: (uid,callBack) => {
        pool.execute(
            `select * from patient_primary where uid = '${uid}'`, 
            (error,results,fields) => {
                if(error){
                    return callBack(error)
                }
                return callBack(null,results[0])
            }
        )
    },

    getPatientByEmailService : (data,callBack) => {
        pool.execute(
            `select * from patient_primary where email = '${data.email}' and pwd = '${data.pwd}'`,
            (error,results) => {
                if(error){
                    return callBack(error)
                }
                
                return callBack(null,results[0])
            }
        )
    }



}
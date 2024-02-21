const bcrypt = require('bcrypt');


const encrypt = async (data) =>{
    const saltRounds = 12; 
    return new Promise((resolve, reject) => {
        bcrypt.hash(data, saltRounds, (err, hash) => {
            if (err) {
               reject(false);
            } else {
                resolve(hash);
            }
        });
    });
    
} 

const passCompare = async (userpass,dbpass) =>{

    return new Promise((resolve, reject) => {
        bcrypt.compare(userpass, dbpass, (err, result) => {
            if (err) {
                reject(false)
            } else if (result) {
                resolve(true)
            } else {
                reject(false)
            }
        });

    })
    


}

module.exports = {
    encrypt,
    passCompare,
    
};








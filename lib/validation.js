const bcrypt = require('bcrypt');


const encrypt = (data) => {
    const saltRounds = 12;

    bcrypt.hash(data, saltRounds, (err, hash) => {
        console.log(hash)

        if (err) {
            return false;
        } else {
            return hash;
        }
    });


}

const passCompare = async(userpass, dbpass) => {

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


const resultRes = (status, message = '', data = null) => {
    const defaultMessages = {
        success: `Youre a shinobi of success! Victory jutsu!`,
        error: 'Something went wrong',
    };

    message = message || defaultMessages[status] || '';

    const response = {
        status: status,
        message: message,
        data: data,
    };

    return response;
};




module.exports = {
    encrypt,
    passCompare,
    resultRes,

};
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');




const encrypt = (data) => {
    const saltRounds = 12;

    return new Promise((resolve, reject) => {
        bcrypt.hash(data, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
};
const passCompare = async(userpass, dbpass) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(userpass, dbpass, (err, result) => {
            if (err) {
                reject(err);
            } else if (result) {
                resolve(result);
            } else {
                reject(false);
            }
        });
    });
};






// Encryption function
const useridEncrypt = (data, secretKey) => {


    const useridSecretKey = "#117788$"
    try {
        const encryptedData = CryptoJS.AES.encrypt(data.toString(), useridSecretKey).toString();
        return encryptedData;
    } catch (error) {
        console.error('Encryption Error:', error);
        return null;
    }
};

// Decryption function
const useridDecrypt = (encryptedData, secretKey) => {
    const useridSecretKey = "#117788$"
    try {
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, useridSecretKey).toString(CryptoJS.enc.Utf8);
        return decryptedData;
    } catch (error) {
        console.error('Decryption Error:', error);
        return null;
    }
};

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

    useridEncrypt,
    useridDecrypt,
    encrypt,
    passCompare,
    resultRes,

};
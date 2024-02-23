const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const validator = require('validator');




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

function genRanNum(length) {
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Length should be a positive number greater than zero.');
    }
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

function diffArray(arr1, arr2) {
    const uniqueValues = [];
    const duplicateValues = [];

    // Create a copy of arr2 to avoid modifying the original array
    const remainingArr2 = [...arr2];

    for (const value of arr1) {
        const indexInArr2 = remainingArr2.indexOf(value);

        if (indexInArr2 !== -1) {
            duplicateValues.push(value);
            // Remove the value from remainingArr2 to avoid counting it again
            remainingArr2.splice(indexInArr2, 1);
        } else {
            uniqueValues.push(value);
        }
    }

    // The remaining values in remainingArr2 are unique to arr2
    const uniqueToArr2 = remainingArr2;

    return {
        uniqueValues,
        duplicateValues,
        uniqueToArr2,
    };
}

function EmptyValues(obj) {
    const emptyKeys = [];
    for (const key in obj) {
        if (obj[key] === '') {
            emptyKeys.push(key);
        }
    }

    return emptyKeys;
}



const validateField = (fieldName, fieldValue, minLength, maxLength, allowSpecialChars = false) => {

    fieldValue = validator.escape(fieldValue)
    if (fieldValue !== '') {
        if (validator.isLength(fieldValue, { min: minLength, max: maxLength })) {
            if (!allowSpecialChars && !validator.isAlphanumeric(fieldValue)) {
                return `${fieldName} contains special characters`;
            }
            return null;
        } else {
            return `${fieldName} must be between ${minLength} and ${maxLength} characters`;
        }
    } else {
        return `${fieldName} is required`;
    }
};

const validateEmail = (email) => {
    return validator.isEmail(validator.escape(email)) ? null : 'Invalid email address';
};

const validatePhoneNumber = (phoneNumber) => {
    return validator.isMobilePhone(validator.escape(phoneNumber), 'any', { strictMode: false }) ?
        null :
        'Invalid phone number';
};
const validateAddress = (address) => {

    const allowedSpecialChars = '-,./ ';
    const regex = new RegExp(`^[a-zA-Z0-9${allowedSpecialChars}\\(\\)]+$`);

    return regex.test(address) ? null : 'Invalid address format';
};
const isStrongPassword = (password) => {
    // Check if the password meets criteria for being strong
    const isStrong = validator.isStrongPassword(password, {
        minLength: 8, // Minimum length
        minLowercase: 1, // Require at least 1 lowercase letter
        minUppercase: 1, // Require at least 1 uppercase letter
        minNumbers: 1, // Require at least 1 digit
        minSymbols: 1, // Require at least 1 special character
    });

    return isStrong ? null : 'Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and have a length of 8 or more';
};




module.exports = {
    isStrongPassword,
    validateField,
    validateEmail,
    validatePhoneNumber,
    validateAddress,
    diffArray,
    genRanNum,
    useridEncrypt,
    useridDecrypt,
    encrypt,
    passCompare,
    resultRes,
    EmptyValues,

};
const express = require("express");
const mysqldb = require('../config/mysqldb');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path')
const { format } = require('date-fns');
const { authenticateToken, generateAccessToken } = require('../middleware/authMiddleware')
const {
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
} = require("../lib/validation")


const router = express.Router();

const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

//need to add auth and validation
//need to check dulicate
//need to use S3 for uploded
router.post('/signup', async(req, res, next) => {

    const result = {
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.body.uname,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        taddress: req.body.taddress,
        paddress: req.body.paddress,
        plan: "D",
        amount: 0.0,
        user_status: 'ACTIVE',
        password: req.body.password,
    };
    const minLength = 3
    const maxLength = 15

    const fnameError = validateField('First name', result.fname, minLength, maxLength);
    if (fnameError) return res.status(403).json(resultRes('error', fnameError));

    const lnameError = validateField('Last name', result.lname, minLength, maxLength);
    if (lnameError) return res.status(403).json(resultRes('error', lnameError));

    const unameError = validateField('User name', result.uname, minLength, maxLength);
    if (unameError) return res.status(403).json(resultRes('error', unameError));

    const emailError = result.email ? validateEmail(result.email) : null;
    if (emailError) return res.status(403).json(resultRes('error', emailError));

    const phoneNumberError = result.phonenumber ? validatePhoneNumber(result.phonenumber) : null;
    if (phoneNumberError) return res.status(403).json(resultRes('error', phoneNumberError));

    const taddressError = result.taddress ? validateAddress(result.taddress) : null;
    if (taddressError) return res.status(403).json(resultRes('error', taddressError));

    const paddressError = result.paddress ? validateAddress(result.paddress) : null;
    if (paddressError) return res.status(403).json(resultRes('error', paddressError));

    const passwordError = result.password ? isStrongPassword(result.password) : null;
    if (passwordError) return res.status(403).json(resultRes('error', passwordError));


    const columns = Object.keys(result).join(',');
    if (Object.keys(result).length === 11) {

        const table = "ss_userdetails";

        const selectSql = `SELECT * from ${table} where phonenumber = '${result['phonenumber']}' ;`;
        const dbdata = await mysqldb.find(selectSql);

        if (dbdata == null && dbdata.length == 0) {
            res.status(301).json(resultRes("error", "Phonumber is already exit, try other number"));
            return false;
        }

        try {
            result["password"] = await encrypt(req.body.password)
            const values = Object.values(result).map(val => (`'${val}'`)).join(', ');
            const insertSql = `INSERT INTO ${table} (${columns}) VALUES (${values});`
            if (await mysqldb.insertOne(insertSql)) {
                res.status(200).json(resultRes("success"));
            } else {
                res.status(408).json(resultRes("error", 'Something went worng'));
            }
        } catch (error) {
            res.status(500).json(resultRes("error", "Something went worng"));
        }

    } else {
        res.status(401).json(resultRes("error", "Invalid user data"));
    }
});

router.post('/login', async(req, res, next) => {

    const result = {
        phonenumber: req.body.phonenumber,
        password: req.body.password,

    };

    // const phoneNumberError = result.phonenumber ? validatePhoneNumber(result.phonenumber) : null;
    // if (phoneNumberError) return res.status(403).json(resultRes('error', phoneNumberError));
    // const passwordError = (result.password && result.password != '') ? true : false;
    // if (passwordError) return res.status(403).json(resultRes('error', passwordError));

    const columns = Object.keys(result).join(',');
    if (Object.keys(result).length === 2) {

        const values = Object.values(result).map(val => (`'${val}'`)).join(', ');
        const table = "ss_userdetails";
        const selectSql = `SELECT * from ${table} where phonenumber = '${result['phonenumber']}';`;
        const dbdata = await mysqldb.find(selectSql)

        // if (!dbdata) return res.status(403).json(resultRes('error', "something went worng"));

        if (dbdata != null && dbdata.length > 0) {
            let dbData = dbdata[0];
            var ispass = await passCompare(result["password"], dbData["password"]);
            let resultdata = {
                "uid": useridEncrypt(dbData["userid"]),
                "uname": dbData["uname"],
                "status": ispass,
                "token": ''
            }
            resultdata["token"] = generateAccessToken(resultdata)
            if (ispass) {
                res.status(200).json(resultRes("success", '', resultdata));
            } else {
                res.status(200).json(resultRes("error", "woring password"));
            }
        } else {
            res.status(201).json(resultRes("error", "Go to singup"));
        }
    } else {
        res.status(401).json(resultRes("error", "Invalid user data"));
    }
});

router.post('/Upload', authenticateToken, async(req, res, next) => {

    const form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {

        const formdata = [...new Set(Object.keys(fields))];
        const defaultData = ['uid', 'uname', "nocopy", "papertype", 'side', "delivarydate"];

        if (formdata.length > 0) {

            const { uniqueValues, duplicateValues, uniqueToArr2 } = diffArray(formdata, defaultData)

            let misingFiled = uniqueToArr2
            const invalidField = EmptyValues(formdata);

            if (misingFiled.length == 0 && invalidField.length == 0) {

                const userid = useridDecrypt(fields.uid[0]);
                const table = "scroll_tracking";
                const selectSql = `SELECT * from ${table} where userid = '${userid}';`;
                const dbdata = await mysqldb.find(selectSql);

                if (!dbdata) return res.status(403).json(resultRes('error', "something went worng"));

                let dbData = dbdata[0];
                if (dbdata == null && dbdata.length == 0) {

                    let fileFormate = files.img[0].mimetype;
                    let uploadPath = files.img[0].filepath;
                    let tempPath = path.join(__dirname, '../temp')
                    let orginalFormate = fileFormate.split('/')[1];
                    const fileName = `ss_${genRanNum(10)}.${orginalFormate}`
                    const filepath = `${tempPath}/${fileName}`;
                    let rawData = fs.readFileSync(uploadPath)
                    fs.writeFile(filepath, rawData, function(err) {
                        if (err) console.log(err)
                        return true
                    })
                    formdata["doc_name"] = fileName;
                    var userdata = {
                        'userid': userid,
                        'uname': dbData['uname'],
                        "nocopy": fields.nocopy[0],
                        "papertype": fields.papertype[0],
                        'side': fields.side[0],
                        "delivarydate": fields.delivarydate[0],
                        "doc_name": formdata["doc_name"],
                        "createddate": currentDateTime,
                        "modifieddate": currentDateTime
                    }
                    const table = 'scroll_tracking';
                    const columns = Object.keys(userdata).join(',');
                    const values = Object.values(userdata).map(val => (`'${val}'`)).join(', ');
                    const insertSql = `INSERT INTO ${table} (${columns}) VALUES (${values});`;
                    const insertRe = await mysqldb.insertOne(insertSql);
                    if (insertRe) {
                        res.status(200).json(resultRes("success", '', dbData));
                    } else {
                        res.status(408).json(resultRes("error", 'Something went worng'));
                    }
                } else {
                    let fileFormate = files.img[0].mimetype;
                    let uploadPath = files.img[0].filepath;
                    let tempPath = path.join(__dirname, '../temp')
                    let orginalFormate = fileFormate.split('/')[1];
                    const fileName = `ss_${genRanNum(10)}.${orginalFormate}`
                    const filepath = `${tempPath}/${fileName}`;

                    let rawData = fs.readFileSync(uploadPath)
                    fs.writeFile(filepath, rawData, function(err) {
                        if (err) console.log(err)
                        return true
                    })

                    formdata["doc_name"] = fileName;
                    var dbDoc_name = dbData["doc_name"];
                    var fDoc_name = `${formdata["doc_name"]},${dbDoc_name}`;

                    const table = 'scroll_tracking';
                    const updateSql = `UPDATE scroll_tracking set doc_name =? where userid =?`
                    const upVal = [fDoc_name, userid]
                    const updateRe = await mysqldb.update(updateSql, upVal);

                    if (updateRe && updateRe > 0) {
                        res.status(200).json(resultRes("success"));
                    } else {
                        res.status(408).json(resultRes("error", 'Something went worng'));
                    }
                }
            } else {
                res.status(401).json(resultRes("error", "Invalid user data", (misingFiled.length > 0 ? misingFiled : invalidField)));
            }
        } else {
            res.status(400).json(resultRes("error", "Invalid user data"));
        }
    })
})

router.post('/getdoc', authenticateToken, async(req, res, next) => {

    const userData = {
        uid: useridDecrypt(req.body.uid),
        docid: req.body.docid,
    };

    const docidError = result.taddress ? validateAddress(userData.docid) : null;
    if (docidError) return res.status(403).json(resultRes('error', docidError));

    const columns = Object.keys(userData).join(',');
    if (Object.keys(userData).length === 2) {

        const values = Object.values(userData).map(val => (`'${val}'`)).join(', ');
        const table = "scroll_tracking";
        const selectSql = `SELECT doc_name from ${table} where userid = '${userData['uid']}';`;

        const dbdata = await mysqldb.find(selectSql);

        if (dbdata != null && dbdata.length > 0) {

            let dbData = dbdata[0];
            const docNameArray = dbData.doc_name.includes(',') ? dbData.doc_name.split(',') : '';
            var finalNameArray = []
            let tempPath = path.join(__dirname, '../temp') // change to s3 
            docNameArray.forEach((value, index, array) => {
                console.log(value)
                finalNameArray.push(`${tempPath}/${value}`)
            })
            const docArray = [...new Set(finalNameArray)];
            var result = { docArray }

            res.status(200).json(resultRes("success", '', result));

        } else {
            res.status(203).json(resultRes("success", 'No data'));
        }
    }



})



module.exports = router;
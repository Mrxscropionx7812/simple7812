const express = require("express");
const mysqldb = require('../config/mysqldb');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path')
const { format } = require('date-fns');
const { authenticateToken, generateAccessToken } = require('../middleware/authMiddleware')
const {
    encrypt,
    passCompare,
    resultRes,
    useridEncrypt,
    useridDecrypt,
    genRanNum,
    diffArray,
    EmptyValues
} = require("../lib/validation")


const router = express.Router();

const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

//need to add auth and validation
//need to check dulicate
//need to use S3 for uploded
router.post('/signup', async(req, res, next) => {
    var response = {};

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
        password: ''
    };

    const columns = Object.keys(result).join(',');

    if (Object.keys(result).length === 11) {
        const table = "ss_userdetails";

        try {

            result["password"] = await encrypt(req.body.password)


            const values = Object.values(result).map(val => (`'${val}'`)).join(', ');
            const insertSql = `INSERT INTO ${table} (${columns}) VALUES (${values});`;


            await mysqldb.insertOne(insertSql);

            res.status(200).json(resultRes("success"));
        } catch (error) {
            res.status(500).json(resultRes("error", "Invalid user data"));
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

    const columns = Object.keys(result).join(',');

    if (Object.keys(result).length === 2) {

        const values = Object.values(result).map(val => (`'${val}'`)).join(', ');
        const table = "ss_userdetails";
        const selectSql = `SELECT * from ${table} where phonenumber = '${result['phonenumber']}';`;

        const dbdata = await mysqldb.find(selectSql);

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
            res.status(201).json(resultRes("error", "go to singup"));
        }


    } else {
        res.status(401).json(resultRes("error", "Invalid user data"));
    }
});

//need to add validation
//need to hanlde the mulitple file uploded
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
                const table = "ss_userdetails";
                const selectSql = `SELECT * from ${table} where userid = '${userid}';`;
                const dbdata = await mysqldb.find(selectSql);
                let dbData = dbdata[0];

                if (dbdata != null && dbdata.length > 0) {

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
                        //concat the filename and store
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

                    //insert
                    const table = 'scroll_tracking';
                    const columns = Object.keys(userdata).join(',');
                    const values = Object.values(userdata).map(val => (`'${val}'`)).join(', ');
                    const insertSql = `INSERT INTO ${table} (${columns}) VALUES (${values});`;

                    console.log("insertaury==>", insertSql)

                    // await mysqldb.insertOne(insertSql);

                    res.status(200).json(resultRes("success", '', dbData));

                } else {
                    //update the logic 
                    // for image name join the name with comma 
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

    const columns = Object.keys(userData).join(',');
    if (Object.keys(userData).length === 2) {

        const values = Object.values(userData).map(val => (`'${val}'`)).join(', ');
        const table = "scroll_tracking";
        const selectSql = `SELECT doc_name from ${table} where userid = '${userData['uid']}';`;

        const dbdata = await mysqldb.find(selectSql);

        if (dbdata != null && dbdata.length > 0) {

            //if concat change the logic
            let dbData = dbdata[0];
            // const docNameArray = dbData.doc_name.split(',');
            const docNameArray = "ss_1111.png,ss_782823.jpeg,234234.png".split(',');
            var finalNameArray = []
            let tempPath = path.join(__dirname, '../temp')

            docNameArray.forEach((value, index, array) => {
                console.log(value)
                finalNameArray.push(`${tempPath}/${value}`)
            })
            const docArray = [...new Set(finalNameArray)];
            var result = { docArray }
            res.status(200).json(resultRes("success", '', result));



        }
    }



})



module.exports = router;
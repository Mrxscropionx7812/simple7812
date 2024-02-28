const express = require("express");
const { ObjectId } = require('mongodb');
const mysqldb = require('../config/mysqldb');
const mongodbf = require('../config/mongodb');
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

        if (dbdata != null && dbdata.length == 0) {
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

    const phoneNumberError = result.phonenumber ? validatePhoneNumber(result.phonenumber) : null;
    if (phoneNumberError) return res.status(403).json(resultRes('error', phoneNumberError));
    const passwordError = (result.password && result.password != '') ? true : false;
    if (passwordError) return res.status(403).json(resultRes('error', passwordError));


    if (Object.keys(result).length === 2) {
        const table = "ss_userdetails";
        const selectSql = `SELECT * from ${table} where phonenumber = '${result['phonenumber']}';`;
        const dbdata = await mysqldb.find(selectSql)
        if (!dbdata) return res.status(403).json(resultRes('error', "something went worng"));

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

                // if (!dbdata) return res.status(403).json(resultRes('error', "something went worng"));

                if (dbdata == null) {

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
                        'uname': fields.uname[0],
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

                    const Muserdata = {
                                        "userid": userid,
                                        "docpath": tempPath,
                                        "basicdoc": [
                                            {
                                                docName:fileName,
                                                createddate:currentDateTime,
                                                modifieddate:currentDateTime,
                                                status:"active",
                                            },
                                        ],
                                    createddate:currentDateTime,
                                };
                    await mongodbf.MinsertOne("scroll_tracking_doc",Muserdata).then((val)=>{
                        
                        userdata["doc_name"] = val.insertedId.toString();

                        mysqldb.insertOne(insertSql).then((value) => {
                            res.status(200).json(resultRes("success", 'Uploaded success', ));
                        }).catch((error) => {
                            res.status(408).json(resultRes("error", 'Something went worng'));
                        });
                    }).catch((er)=>{
                        res.status(408).json(resultRes("error", 'Something went worng'));
                    })
                } else {
                    
                    let dbData = dbdata[0];
                    let fileFormate = files.img[0].mimetype;
                    let uploadPath = files.img[0].filepath;
                    let tempPath = path.join(__dirname, '../temp')
                    let orginalFormate = fileFormate.split('/')[1];
                    const fileName = `ss_${genRanNum(10)}.${orginalFormate}`
                    const filepath = `${tempPath}/${fileName}`;
                    const trackingdocid = (dbData.doc_name!='' && dbData.doc_name!=null) ? dbData.doc_name : '';

                    let rawData = fs.readFileSync(uploadPath)
                    fs.writeFile(filepath, rawData, function(err) {
                        if (err) console.log(err)
                        return true
                    })
                    if(trackingdocid!=''){
                        const McondiotnQuery = { _id: new ObjectId(trackingdocid) };
                        formdata["doc_name"] = fileName;
                        const Muserdata ={ 
                            $push: {
                                    "basicdoc":  {
                                        $each:[
                                            {
                                                docName:fileName,
                                                createddate:currentDateTime,
                                                modifieddate:currentDateTime,
                                                status:"active"
                                            }
                                        ] 
                                } 
                            }
                        }
                        await mongodbf.Mupsert("scroll_tracking_doc",McondiotnQuery,Muserdata).then((val)=>{
                            res.status(200).json(resultRes("success", 'Uploaded success', ));
                        }).catch((er)=>{
                            res.status(401).json(resultRes("error", "Invalid user data"));
                        })     
                    }else{
                        res.status(401).json(resultRes("error", "Invalid user data"));
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

router.post('/getdoc', authenticateToken, async (req, res, next) => {

    try {
        const docName = req.query.docname || null;
        const noOfDocs = parseInt(req.query.noofdocs) || null;
        const userData = { uid: useridDecrypt(req.body.uid) };

        if (Object.keys(userData).length === 1) {
            const table = "scroll_tracking";
            const selectSql = `SELECT doc_name from ${table} where userid = '${userData['uid']}';`;
            const dbdata = await mysqldb.find(selectSql);
            if (dbdata != null && dbdata.length > 0) {
                const dbData = dbdata[0];
                const trackingdocid = dbData.doc_name !== '' ? dbData.doc_name : '';
                let tempPath = path.join(__dirname, '../temp'); // change to s3 or anyother cloud 
                let McondiotnQuery = {};

                if (docName) {
                    McondiotnQuery = {
                        $and: [
                            { "_id": new ObjectId(trackingdocid) },
                            { "basicdoc": { $elemMatch: { "docName": docName } } }
                        ]
                    };
                } else {
                    McondiotnQuery = { _id: new ObjectId(trackingdocid) };
                }
                const result = await mongodbf.MfindWithCondition("scroll_tracking_doc", McondiotnQuery,( noOfDocs == null ? 1 :noOfDocs));
                const docs = [];
                for (const [key, val] of Object.entries(result)) {
                    for (const doc of val.basicdoc) {
                        const docObject = {
                            "name": doc.docName,
                            "createddate": doc.createddate,
                            "modifiedate": doc.modifieddate
                        };
                        docs.push(docObject);
                    }
                    break;
                }
                const outDataResult = {
                    "path": result.docpath,
                    "docs": docs
                };
                res.status(200).json(resultRes("success", '', outDataResult));
            } else {
                res.status(203).json(resultRes("success", 'No data'));
            }
        }else{
            res.status(401).json(resultRes("error", "Invalid user data"));
        }
    } catch (error) {
        res.status(500).json(resultRes("error", 'Internal Server Error'));
    }
})

module.exports = router;
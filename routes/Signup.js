const express = require("express");
const mysqldb = require('../config/mysqldb');
const {
    encrypt,
    passCompare,
    resultRes,
    useridEncrypt,
    useridDecrypt
} = require("../lib/validation")


const router = express.Router();

//need to add auth and validation
//need to check dulicate
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
    var response = {};

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

            let dbData = dbdata[0]
            var ispass = await passCompare(result["password"], dbData["password"])

            let resultdata = {
                "uid": useridEncrypt(dbData["userid"]),
                "uname": dbData["uname"],
                "status": ispass
            }
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



module.exports = router;
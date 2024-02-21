const express    = require("express");
const router = express.Router();  
// need to add auth
// need to add validation 



router.post('/',(req, res, next) => {

    const result = {
        fname : req.body.fname, 
        lname : req.body.lname,
        phonenumer : req.body.pnumber,
        email : req.body.email,
        taddress : req.body.taddress,
        paddress : req.body.paddress,
        govproof : req.body.govproof,
    }

    res.status(200).json({
      message: "Welcome OK " 
    });

});

module.exports = router;
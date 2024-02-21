const express = require("express");
const router = express.Router();  // Use Router() instead of router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Welcome OK -"
  });
});

router.get('/welcome/:usertype', (req, res, next) => {
    const usertype = req.params.usertype;
    

    switch (usertype) {
        case "Admin":
            
            break;
        case "student":
        
            break;
        case "student":
    
            break;
    
        default:
            break;
    }

    res.status(200).json({
      message: "OK"
    });
  });

module.exports = router;

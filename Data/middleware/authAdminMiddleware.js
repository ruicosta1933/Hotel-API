const jwt = require('jsonwebtoken');
const config = require("../../config");
module.exports = (req, res, next) => {

        const decoded = jwt.verify(req.headers['x-access-token'], config.secret)
        
        if(decoded.userType == "ADMIN"){
            res.send("Auth Accepted");
            next();
        }
        else{
            return res.status(401).json({
                message: "Auth Failed"
            })
        }
    }

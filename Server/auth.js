const bodyParser = require('body-parser');
const express = require('express');
const Users = require('../Data/users');
const cheackAuth = require ("../Data/middleware/authAdminMiddleware")
const Joi = require('joi')
const crypto = require('crypto')
const Token = require('../Data/Token/token')
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcrypt')
const config = require('../config')
const User = require('../Data/users/user');

function AuthRouter() {
    let router = express();

    router.use(bodyParser.json({
        limit: '100mb'
    }));
    router.use(bodyParser.urlencoded({
        limit: '100mb',
        extended: true
    }));


    router.route('/passwordReset')
    .post(async function (req, res) {
      try {
        const schema = Joi.object({ email: Joi.string().email().required() })

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email })
        if (!user)
          return res.status(400).send("Utilizador não existe")

        let token = await Token.findOne({ userId: user._id })
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
          }).save()
        }

        const link = `http://localhost:3000/auth/passwordReset/${user._id}/${token.token}`
        await sendEmail(user.email, "Password reset", link)
        res.send(" Password reset link sent to your email account!")
      } catch (error) {
        res.send("An error occured.")
        console.log(error)
      }
    })

  router.route("/passwordReset/:userId/:token")
    .post(async function (req, res) {
      try {
        const schema = Joi.object({ password: Joi.string().required() })
        const { error } = schema.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const user = await User.findById(req.params.userId)
        if (!user) return res.status(400).send("Invalid link or expired")

        const token = await Token.findOne({
          userId: user._id,
          token: req.params.token
        })
        if (!token) return res.status(400).send("Invalid link or expired")
        user.password = await bcrypt.hash(req.body.password, config.saltRounds);
        await user.save()
        await token.delete()

        res.send("Password reset sucessfully.")
      } catch (error) {
        res.send("An error occured.")
        console.log(error)
      }
    })



    router.route('/users')
    .get(function(req, res, next) {
        Users.findAll(req)
        .then((users)=>{
            res.send(users);
            next();
        })
        .catch((err)=>{
            next();
        });
    })
    .post(cheackAuth, function(req,res,next){

        let body = req.body;
        Users.create(body)
            .then(() =>{
                console.log('User saved');
                res.status(200);
                res.send(body);
                next();
            })
    .catch((err)=>{
        console.log('This user already exists');
        err.status = err.status || 500;
        res.status(401);
        next();
    });
    });

    router.route('/register')
        .post(function (req, res, next) {
            const body = req.body;

            Users.create(body)
                .then((user) => Users.createToken(user))
                .then((response) => {
                    res.status(200);
                    res.send(response);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500);
                    res.send(err);
                    next();
                });
        });

    router.route('/me')
        .get(function(req,res,next){
            let token = req.headers['x-access-token'];

            if(!token){
                return res.status(401).send({auth:false, message: 'No token provided.'})
            }

            return Users.verifyToken(token)
            .then((decoded)=>{
                res.status(202).send({ auth:true, decoded });
            })
            .catch((err)=>{
                res.status(500);
                res.send(err);
                next();
            });
        });

    router.route('/login')
        .post(function(req,res,next){
            const body = req.body;

            Users.findUser(body)
            .then((user)=>Users.createToken(user))
            .then((response)=>{
                res.status(202);
                res.send(response);
            })
            .catch((err)=>{
                res.status(500);
                res.send(err);
                next();
            });
        })

        router.route( '/login/:userId')
        .delete(cheackAuth, function(req,res,next){
            let userId = req.params.userId;
            Users.removeById(userId)
                .then(()=>{
                    console.log('User removed.');
                    res.status(200).json();
                    next();
                })
                .catch((err)=>{
                    console.log('err');
                    res.status(404);
                    next();
                });
        })
        .put(function(req,res,next){
            let userId= req.params.userId;
            let body = req.body;

            Users.update(userId, body)
                .then((user)=>{
                    res.status(200);
                    res.send(user);
                    next();
                })
                .catch((err)=>{
                    res.status(404);
                    next();
                });
        });

    return router;
}

module.exports = AuthRouter;
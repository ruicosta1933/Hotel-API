const jwt =  require('jsonwebtoken');
const bcrypt = require ('bcrypt');
const config= require('../../config');


function UserService(UserModel) {
    
    const ITEMS_PER_PAGE = 2;

    let service = {
        create,
        save,
        createToken,
        findAll,
        verifyToken,
        findUser,
        createPassword,
        comparePassword,
        update,
        removeById,
    };

    function create(user) {
        return createPassword(user)
        .then((hashPassword,err)=>{
            if(err){
                return Promise.reject("Not saved");
            }

        let newUserWithPassword ={
            ...user,
            password: hashPassword,
        }

        let newUser = UserModel(newUserWithPassword);
        return save(newUser);

        });
    }

    function save(model) {
        return new Promise(function (resolve, reject) {
            model.save(function (err) {
                //console.log(err);
                if (err) reject('There is a problem with register');

                resolve('User created');
            });
        });
    }

    return service;

    function createToken(user){
        let token;

            token = jwt.sign({id:user._id,userType : user.userType }, config.secret, {
                expiresIn: config.expiresPassword
            });
        
        return {auth: true, token}
    }

    function verifyToken(token){
        return new Promise((resolve, reject)=>{
            jwt.verify(token,config.secret, (err,decoded)=>{
                if(err){
                    reject();
                }

                return resolve(decoded);
            });
        })
    }

    function findUser({email, password}){
        return new Promise(function (resolve, reject){
            UserModel.findOne({email}, function (err,user){
                if(err) reject(err);

                if (!user){
                    reject("This data is wrong");
                }
                resolve(user);
            });
        })
            .then((user)=>{
                return comparePassword(password, user.password)
                .then((match)=>{
                    
                    if(!match) return Promise.reject ("User not valid");

                    return Promise.resolve(user);
                })
            })
    }

    function update(id,values){
        return new Promise(function(resolve,reject){
            UserModel.findByIdAndUpdate(id,values, {new: true}, function(err,user){
                if(err) reject(err);

                resolve(user);
            });
        });
    }

    function removeById(id){
        return new Promise(function(resolve,reject){
                console.log(id);
                UserModel.findByIdAndRemove(id,function(err){
                    console.log(err);
                    if(err) reject(err);
                    resolve();
                });
            });
    }


    function findAll(req){
        const {page = 1} = req.query;
        return new Promise(function(resolve,reject){
        
            UserModel.find({}, function (err,users){
                if(err) reject(err);
                resolve(users);
            })
            .limit(ITEMS_PER_PAGE)
            .skip((page-1) * ITEMS_PER_PAGE)
            .sort([[req.query.orderBy, req.query.direction]]);
        });
    }

    function createPassword(user){
        return bcrypt.hash(user.password, config.saltRounds);
    }

    function comparePassword(password,hash){
        return bcrypt.compare(password, hash);
    }
}

module.exports = UserService;
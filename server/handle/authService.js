const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const md5 = require('../auth/md5');
const { CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED } = require('../auth/constant');
const { decode } = require('../auth/user-jwt');
const User = require('../db/User');
const DBPool = require('../db/DBPool');
const { sendResponse } = require('../helper');

/**
 * function processor  -- doing about db processing
 * @params:  [0]== process type: find, create, update
 * @params:  [1]== process data, find: username, create: userData, update:userName
 * @params:  [2]== process data, find: password or non, create: non, update: new password
 * @return: an user collection from db
 */
async function processor(...args){
    const process = new User(DBPool.DB_NAME);
    await process.dbInstance();
    let userAuth = null;
    switch(args[0]){        // args[0] is process type: find, create, update
        case 'find':
            userAuth = args.length>2 ?
                await process.getUserByNameAndPwd(args[1], args[2]) :       // args[1]:username, args[2]:password
                await process.getUserByName(args[1]);                       // args[1]:username
            break;
        case 'create':
            userAuth = await process.createUser(args[1]);                   // args[1]: userData
            break;
        case 'update':
            userAuth = await process.updateUserPassword(args[1],args[2]);   // args[1]: username, args[2]: new password
            break;
        default: userAuth = null;
    }
    process.close();
    return userAuth;
}

/**
 * function login:  user login method, checking username and password exists
 * @param {*} req need Method:'POST', json: {username: 'username' , password: 'password' }
 * @returns: pass: 200, token and {id:userId, username: 'username', email:'email'}
 *           nopass: 400, null, message
 */
const login = async (req, res, next) => {
    const err = validationResult(req, res);
    if(!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    }else{
        let {username,password} = req.body;
        password = md5(password);   // encrypt the password by md5
        console.log('pwd',password);
        let userAuth = await processor('find',username, password);
        console.log('userAuth',userAuth);
        if(!!!userAuth){ return sendResponse(res,400,null,'user name or password incorrect'); }
        else{ 
            // jwt, payload need data in sign token
            const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED});
            let userData = { id: userAuth._id, username: userAuth.username, email: userAuth.email };
            sendResponse(res, CODE_SUCCESS ,{ token, userData },`success to login by user:${username}`);
        }
    }
}

/**
 * function register:  user register method, create a user as {username,password,email} exists
 * @param {*} req need Method:'POST', json: {username: 'username' , password: 'password', email: 'email'}
 * @returns: pass: 200, token and {id:userId, username: 'username', email:'email'}
 *           nopass: 400, null, message
 */
const register = async (req, res, next) => {
    const err = validationResult(req, res);
    if(!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    }else{
        let { username, password, email} = req.body;
        let userAuth = await processor('find',username);
        if(!!userAuth){ return sendResponse(res,CODE_ERROR,null, `This User[${username}] already exists`);}
        else{ 
            password = md5(password);
            let userData = { username:username, password:password, email:email };
            let newUser = await processor('create',userData);
            if(!!!newUser){ return sendResponse(res,CODE_ERROR,null,`Failure to register user[${username}]`); }
            else{
                const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED});
                let userData = { id: newUser._id, username: newUser.username, email: newUser.email };
                sendResponse(res, CODE_SUCCESS ,{ token, userData },`success to register user[${username}`);
            }
        }
    }
}

/**
 * function resetPwd:  user reset password method, 
 * @param {*} req need Method:'POST', json: {username: 'username' , oldPassword: 'password', newPassword: 'password'}
 * @returns: pass: 200, token and {id:userId, username: 'username', email:'email'}
 *           nopass: 400, null, message
 */
const resetPwd = async (req, res, next) => {
    const err = validationResult(req, res);
    if(!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    }else{
        let {username, oldPassword, newPassword } = req.body;
        oldPassword = md5(oldPassword);
        let userAuth = await processor('find', username, oldPassword);
        if(!!!userAuth){ return sendResponse(res,CODE_ERROR,null,'user name or password incorrect'); }
        else{
            newPassword = md5(newPassword);
            userAuth = await processor('update', username, newPassword);
            if(!!!userAuth){ return sendResponse(res,CODE_ERROR,null,'Failure to reset password!');}
            else{
                const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED});
                let userData = { id: userAuth._id, username: userAuth.username, email: userAuth.email };
                sendResponse(res, CODE_SUCCESS ,{ token, userData },`success to reset password!`);
            }
        }
    }
}

module.exports = { login, register, resetPwd };
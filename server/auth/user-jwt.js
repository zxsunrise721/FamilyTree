const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { PRIVATE_KEY } = require('./constant');

const jwtAuth = expressJwt({
    secret: PRIVATE_KEY,
    credentialsRequired : true, 
    getToken: (req) => {
        if(req.headers.authorization){
            return req.headers.authorization
        }else if(req.query && req.query.token){
            return req.query.token
        }
    },
    algorithms: ['RS256']
}).unless({
    path:[ '/', '/api/login', 'api/register', '/api/resetPwd' ]
})

function decode(req){
    const token = req.get('Authorization');
    return jwt.verify(token, PRIVATE_KEY);
}

module.exports = { jwtAuth, decode };
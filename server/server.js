const express = require('express');
const morgan = require('morgan');
const _ = require('lodash');
const fileUpload = require('express-fileupload');

const PORT = 8000;
const app = express();

const {uploadAvatar, uploadPhotos } = require('./handle/uploadHandle');     // test upload files
const { 
    createFamily, 
    getFamilies,
    getFamiliesPublic, 
    getFamiliesByUser,
    getMemberByFamily, 
    getMemberById, 
    createFamilyMember,  
    updateFamilyMember,
} = require('./handle/handle');
const { getFamilyTree, createFamilyTree, }= require('./handle/handleFamilyTree');
const { login, register, resetPwd } = require('./handle/authService');
const { getMappings, getMapping, getMappingByUser, createMappingByUser} = require('./handle/handleMapping');


app.get('/',(req,res)=>{
    console.log(`URL: ${req.url}`);
    res.send('Hello, Server!');
});
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(morgan('tiny'));
app.use(express.static('./server/assets'));
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));
app.use(fileUpload({createParentPath: true}));
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/'));

/************************************************************************************************/
/*------------------------------------ test api ------------------------------------------------*/
app.post('/upload-avatar', uploadAvatar)
app.post('/upload-photos', uploadPhotos)
/*-------------------------------- finished test api -------------------------------------------*/

/*************** handle family process ************************/
app.get('/api/get-families', getFamilies)
app.get('/api/get-families-public', getFamiliesPublic)
app.get('/api/get-families-user/:user', getFamiliesByUser)
app.post('/api/family-create',createFamily)
/*************** handle family member process *****************/
app.get('/api/get-family-members/:familyId', getMemberByFamily)
app.get('/api/get-family-member/:memberId',getMemberById)
app.post('/api/family-member-create',createFamilyMember)
app.put('/api/family-member-update',updateFamilyMember)
/*************** handle family tree process ******************/
app.get('/api/get-family-tree/:familyId', getFamilyTree)
app.get('/api/create-family-tree/:familyId', createFamilyTree)

/**************************************************/
/*************** login, register, reset ***********/
app.post('/api/login', login)
app.post('/api/register', register)
app.post('/api/reset', resetPwd)

/**********************************************************/
/*************** handle user & families mapping ***********/
app.get('/api/get-mappings', getMappings)
app.get('/api/get-mapping-id/:id', getMapping)
app.get('/api/get-mapping-user/:userId', getMappingByUser)
app.post('/api/create-mapping-user', createMappingByUser)

/************************************************************************************************/
app.get("*",(req,res)=>{
    res.status(404).json({status: 404, message: 'This is obviously not what you are looking for.',});
})
const server = app.listen(PORT,(error)=>{
    if(error) return console.log(`Error:${error}`);
    console.log(`Server listening on port ${server.address().port}`);
})
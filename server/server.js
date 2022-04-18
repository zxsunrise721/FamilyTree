const express = require('express');
const morgan = require('morgan');
const _ = require('lodash');
const fileUpload = require('express-fileupload');

const PORT = 8000;
const app = express();

const {uploadAvatar, uploadPhotos } = require('./handle/uploadHandle');     // test upload files
const { 
    createFamily, getFamilies, 
    getMemberByFamily, getMemberById, 
    createFamilyMember,  updateFamilyMember,
} = require('./handle/handle');
const { getFamilyTree, createFamilyTree, }= require('./handle/handleFamilyTree');

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

app.get('/api/get-families-public', getFamilies)
app.post('/api/family-create',createFamily)
app.get('/api/get-family-members/:familyId', getMemberByFamily)
app.get('/api/get-family-member/:memberId',getMemberById)
app.post('/api/family-member-create',createFamilyMember)
app.put('/api/family-member-update',updateFamilyMember)

app.get('/api/get-family-tree/:familyId', getFamilyTree)
app.get('/api/create-family-tree/:familyId', createFamilyTree)


/************************************************************************************************/
app.get("*",(req,res)=>{
    res.status(404).json({status: 404, message: 'This is obviously not what you are looking for.',});
})
const server = app.listen(PORT,(error)=>{
    if(error) return console.log(`Error:${error}`);
    console.log(`Server listening on port ${server.address().port}`);
})
# Project: Family Tree
## database design & development:
1. data design:-- mongodb, see README.md
2. data struct: see ./data/*.json file

## server side:
1. create file server to accept upload files, all upload files store in temp folder (server/uploading), need--> express-fileupload api
2. each handle service need upload image file, take from temp folder and move to server/public/images/<familyfolder>/<image rule name>, by node.js --> fs api
3. api wanted:
>    1. handle family process
>>        -    GET  | '/api/get-families',           | get all families, response an array of families
>>        -    GET  | '/api/get-families-public'     | get the public of families, response an array of families
>>        -    GET  | '/api/get-families-user/:user' | get all families by user, response an array of families
>>        -    POST | '/api/family-create'           | create a new family, response a new family object
>    2. handle family member process 
>>        -    GET  | '/api/get-family-members/:familyId'    | get all members, response an array of members
>>        -    GET  | '/api/get-family-member/:memberId'     | get a member with member id, response a member object
>>        -    POST | '/api/family-member-create'            | create a new member, response a new member object
>>        -    PUT  | '/api/family-member-update'            | update member's information. response an updated member object
>    3. handle family tree process
>>         -    GET  | '/api/get-family-tree/:familyId'       | get the family tree, if database is not exists, create a new tree
>>         -    GET  | '/api/create-family-tree/:familyId'    | create a new family tree, if database is exists, delete old one and create a new one.
>    4. handle authorization
>>         -    POST  | '/api/login'     | user login
>>         -    POST  | '/api/register'  | user register
>>         -    POST  | '/api/reset'     | user reset password
>    5. handle user & families mapping
>>         -    GET   | '/api/get-mappings'               | get all mappings
>>         -    GET   | '/api/get-mapping-id/:id'         | get mapping by mapping id
>>         -    GET   | '/api/get-mapping-user/:userId'   | get mapping by user id
>>         -    POST  | '/api/create-mapping-user'        | create a new mapping with user id.

## frontend:
1. create context to fetch all need fetch from server action, useing dispatch to handle all kind of process
2. create user context to handle login, register, etc. about of authorization process.
3. all page with react component
4. using @antv/x6 to drawing tree. please use recursion way to handle to caculate coordinate.
5. member's profile can be create, modify and show(noModify)) it. so it has 2 page to handle, one is show, anthor is edit-(1.create,2.update by member id);
6. navigate: 
>>     1. /home page, show public family button,
>>     2. when logined(after login or after register), avaiable the create famile icon, when the new family be create, also create a mapping
>>>        - when logined, login icon the color change to blue, when logout icon change to grey, action: delete all sessionStorage items, become to the initial state.
>>     3. when selected family, the member list, family tree, add member icon will be avaiabled. 

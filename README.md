# Project-FamilyTree
It's final project on Concordia bootCamp.

# Building environment:
1. Create React App
    1.1 npm install -g create-react-app
    1.2 create-react-app myapp
    1.3 install dependencies:
        a. react-icons
        b. react-router-dom
        c. style-components
        d. @antv/x6
        f. @antv/x6-react-shape
    
2. create Server
    1.1 make directory 'server'
    1.2 npm init(yarn init): add some information,
    1.3 yarn add body-parser, express, dotenv, mongodb, request, 
        bomm, express-fileupload, express-jwt, express-validator, jsonwebtoken, morgan, nodemon
    
3. configure mongodb, set up database
    3.1 create collection:
        a. family
        b. familyMember
        c. FamilyTree
        d. user
        f. MappingUserFamilies

# Project Goal:
1. create a tree for family. The tree can be draw in page and has a root, the descendant can be leyered display, the parents and each child has wired connection.
2. create a family module, detail: family name, can show in public or just private(just family member can see/edit), can give a picuture as a background image.
3. create a family member editor: include: member name, member's avatar, member's profile, member's birth and death, important relationship: type: root(a family only has a root), child, couple; and who is relationship with current member, can be select by before already add members.
4. create a member list, include avatar, name, birth-death, profile, relationship which is child with member of parents.
5. has login and logout; also has register user.
6. other requirements: when user logined, the family can be create, if choice of private, just this user can see/edit this family. if the public family can show any user even it's not login.  
    
# directory:
## myapp (frontend):
.
├── node_modules
├── public
├── src
│   ├── components
│   │    ├── family
│   │    │    ├── FamilyList.js
│   │    │    ├── FamilyTree.js
│   │    │    ├── FamilyTree2.js
│   │    │    └── MemberProfile.js
│   │    ├── Form
│   │    │    ├── FamilyCreate.js
│   │    │    ├── ProfileEdit.js
│   │    │    └── Upload.js(test file)
│   │    ├── Login
│   │    │    ├── LoginMain.js
│   │    │    ├── RLogin.js
│   │    │    └── RRegister.js
│   │    ├── App.js
│   │    ├── Home.js
│   │    └── Navbar.js
│   ├── hook
│   │    ├── useFetchFamilies.js
│   │    ├── useFetchFamilyMembers.js
│   │    └── useFetchFamilyTree.js
│   ├── utilies
│   │    └── utilies.js
│   ├── constant.js
│   ├── FamilyContext.js
│   ├── GlobalStyles.js  
│   ├── index.js
│   ├── Tooltip.css
│   └── UserContext.js
├── package-lock.json    
└── package.json

## server (backend):
.
├── node_modules
├── auth
│   ├── constant.js
│   ├── md5.js
│   └── user-jwt.js
├── db
│   ├── DBPool.js
│   ├── Family.js
│   ├── FamilyMember.js
│   ├── FamilyTree.js
│   ├── MappingUserFamilies.js
│   └── User.js
├── handle
│   ├── authService.js
│   ├── constant.js
│   ├── handle.js
│   ├── handleFamilyTree.js
│   ├── handleMapping.js
│   └── uploadHandle.js (test file)
├── public
│   └─── images (this folder is storage the families images, folder namer is family id)
│        └── default
│             ├── cloud.png
│             ├── cloud2.png
│             ├── cloud3.png
│             ├── cloud4.jpg
│             ├── defaultAvatar.jpg
│             ├── defaultImage.jpg
│             ├── female.png
│             └── male.png
└── uploads (this is temp folder, storage upload image)

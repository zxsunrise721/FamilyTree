import styled from 'styled-components';
import {useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FamilyContext from '../../FamilyContext';
import { DEFAULT_EDIT_AVATAR } from '../../constant';

const useStyles = makeStyles({
    name:{
        paddingTop: 10,
    },
    select:{
        marginBottom: 5,
        paddingTop: 10,
        width: 200,
        fontSize: 16,
        fontweight: 'bold',
    },
    button:{
        marginLeft: 60,
        fontSize: 16,
        fontWeight: 'bold',
    },
    profile:{
        paddingTop: 10,
        fontSize: 16,
    }
});

const initialMember = {memberName:null, birth:null,death:null, profile:null, relationshipType:null, relationshipWith:null};
const ProfileEdit = () =>{
    const context = useContext(FamilyContext);
    const classes = useStyles();
    const {memberId} = useParams();
    const [profileImg, setProfileImg] = useState(null);
    const [member, setMember] = useState(initialMember);
    const [change, setChange] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(()=>{
        const fetchMember = async ()=>{
            let resp = await context.request('GET',`/api/get-family-member/${memberId}`,null);
            if(resp.status === 200){ 
                setMember(resp.data); 
            }
        }
        if(!!memberId){fetchMember();}
    },[memberId])


    const handleImageChange = (e) =>{
        e.preventDefault();
        const file = e.target.files[0];
        setProfileImg(file);
        let imgEL = document.getElementById('profile-image');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (){
            imgEL.setAttribute('src', reader.result);
        }
        if(!!memberId){
            setUpdate(true); 
            if(!change.includes('avatar')){ setChange([...change,'avatar']); }
        }
        console.log(change);
    }

    const handleMemberChange = (type, e) =>{
        e.preventDefault();
        switch(type){
            case 'memberName':{ 
                if(!!memberId){
                    setUpdate(true);
                    if(!change.includes('memberName')){
                    setChange([...change, 'memberName']);}
                }
                setMember({ ...member, memberName: e.target.value }); break;}
            case 'birth':{ 
                if(!!memberId){
                    setUpdate(true);
                    if(!change.includes('birth')){setChange([...change, 'birth']);}
                }
                setMember({...member, birth: e.target.value }); break;}
            case 'death':{ 
                if(!!memberId){
                    setUpdate(true);
                    if(!change.includes('death')){setChange([...change, 'death']);}
                }
                setMember({...member, death: e.target.value }); break;}
            case 'profile':{ 
                if(!!memberId){
                    setUpdate(true);
                    if(!change.includes('profile')){setChange([...change, 'profile']);}
                }
                setMember({...member, profile: e.target.value }); break;}
            case 'rsType':{ 
                if(!!memberId){
                    setUpdate(true);
                    if(!change.includes('rsType')){setChange([...change, 'rsType']);}
                }
                setMember({...member, relationshipType: e.target.value }); break;}
            case 'rsWith':{ 
                if(!!memberId){
                    setUpdate(true);
                    if(!change.includes('rsWith')){setChange([...change, 'rsWith']);}
                }
                setMember({...member, relationshipWith: e.target.value }); break;}
            default: console.error('Unknown type',type);
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let formData = new FormData();
        console.log('save new member');
        console.log('member',member);
        console.log('update:',update,' change:',change);
        formData.append('familyId',context.getCurrentFamily()._id);
        formData.append('memberName', member.memberName); console.log(member.memberName);
        formData.append('avatar',profileImg);
        formData.append('birth', member.birth);
        formData.append('death', member.death);
        formData.append('profile', member.profile);
        formData.append('relationshipType', member.relationshipType);
        formData.append('relationshipWith', member.relationshipWith);
        
        try{
            fetch('/api/family-member-create', {method: 'POST',body: formData,})
                .then(res=>res.json())
                .then(resp=>{
                    let respData = resp.data;
                    window.sessionStorage.removeItem('family-tree');
                    console.log('message: ',resp.message, 'data: ',respData);
                    window.location.href = `/member/${respData._id}`;
                });
            }catch(err){console.error(err)};    
    }
    const handleUpdate = async (e) =>{
        e.preventDefault();
        console.log('update new member');
        console.log('member',member);
        console.log('update:',update,' change:',change);
        let formData = new FormData();
        formData.append('_id',memberId);
        formData.append('familyId',context.getCurrentFamily()._id);
        change.forEach(item=>{
            if(item==='avatar'){formData.append('avatar',profileImg);}
            if(item==='memberName'){formData.append('memberName', member.memberName);}
            if(item==='birth'){formData.append('birth', member.birth);}
            if(item==='death'){formData.append('death', member.death);}
            if(item==='profile'){formData.append('profile', member.profile);}
            if(item==='relationshipType'){formData.append('relationshipType', member.relationshipType);}
            if(item==='relationshipWith'){formData.append('relationshipWith', member.relationshipWith);}
        })
        console.log('formData', JSON.stringify(formData));
        try{
            try{
                fetch('/api/family-member-update', {
                method: 'PUT',
                body: formData,
                }).then(res=>res.json())
                    .then(resp=>{
                        let respData = resp.data;
                        console.log('message: ',resp.message, 'data: ',respData);
                        window.location.href = `/member/${respData._id}`;
                    });
            }catch(err){console.error(err)};
        }catch(err){console.error(err)};
    }

    return (
        <Wrapper>
            <HeadIMG className="img" bgImg={!!context.getCurrentFamily() && context.getCurrentFamily().backgroundImage!=='' ? context.getCurrentFamily().backgroundImage : '/images/default/cloud.png'}/>
            <MemberHeadDiv>
                <MemberHead>
                    <div>
                        {!!!memberId ?
                        <MemberIMG id='profile-image' src={!!profileImg ? profileImg.name : DEFAULT_EDIT_AVATAR}/>:
                        <MemberIMG id='profile-image' src={!!member.avatar ? member.avatar : DEFAULT_EDIT_AVATAR}/>
                        }
                        <IconContainer>
                        <Input accept="image/*" id="icon-button-file" type="file" onChange={(ev)=>handleImageChange(ev)}/>
                        <label htmlFor="icon-button-file">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera fontSize='large'/>
                            </IconButton>
                        </label>
                        </IconContainer>
                    </div>
                    <MemberName>
                        {!!!memberId ?
                        <TextField className={classes.name} required id="memberName" label="Enter member name (Required)" 
                                    variant="filled" 
                                    onChange={(ev)=>handleMemberChange('memberName',ev)} /> :
                        <TextField className={classes.name} required id="memberName" label="Enter member name (Required)" 
                                    variant="filled"  value={member.memberName} 
                                    onChange={(ev)=>handleMemberChange('memberName',ev)} />
                        }
                    </MemberName>
                    {!!!memberId ?
                        <Button className={classes.button} variant="contained" 
                                color="primary" onClick={ev=>handleSubmit(ev)}>Save Member Profile
                        </Button> :
                        !!!update ? 
                            <Button className={classes.button} variant="contained" 
                                    color="disabled" disabled>Update Member Profile
                            </Button> :
                            <Button className={classes.button} variant="contained" color="primary"
                                    onClick={ev=>handleUpdate(ev)}>Update Member Profile
                            </Button>
                    }
                    
                    
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberRelationship>
                    {!!!memberId ?
                        <>
                        <TextField className={classes.select} id="relationshipType" select label="type of relationship" variant="filled"
                                    onChange={(ev)=>handleMemberChange('rsType',ev)}>
                            <MenuItem value={'Root'}>Root</MenuItem>
                            <MenuItem value={'Child'}>Child</MenuItem>
                            <MenuItem value={'Couple'}>Couple</MenuItem>
                        </TextField>
                        <TextField className={classes.select} id="relationshipWith" select label="with Member" variant="filled"
                                    onChange={(ev)=>handleMemberChange('rsWith',ev)}>
                            <MenuItem value={""}><em>None</em></MenuItem>
                            {(!!context.state.members && context.state.members.length>0) && context.state.members.map(memb=>(
                                    <MenuItem key={memb._id} value={memb._id}>{memb.memberName}</MenuItem>)) 
                            }
                        </TextField>
                        </>
                        :
                        <>
                        <TextField className={classes.select} id="relationshipType" select label="type of relationship" variant="filled"
                                    value={member.relationshipType} onChange={(ev)=>handleMemberChange('rsType',ev)}>
                            <MenuItem value={'Root'}>Root</MenuItem>
                            <MenuItem value={'Child'}>Child</MenuItem>
                            <MenuItem value={'Couple'}>Couple</MenuItem>
                        </TextField>
                        <TextField className={classes.select} id="relationshipWith" select label="with Member" variant="filled"
                                    value={!!member.relationshipWith ? member.relationshipWith : ''} 
                                    onChange={(ev)=>handleMemberChange('rsWith',ev)}>
                                <MenuItem value={""}><em>None</em></MenuItem>
                            {!!context.state.members && context.state.members.length>0 && context.state.members.map(memb=>(
                                <MenuItem key={memb._id} value={memb._id}>{memb.memberName}</MenuItem>
                            ))}
                        </TextField>
                    </>
                    }
                </MemberRelationship>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    {!!!memberId ?
                        <TextField id="birth" label="Birth" type="date" InputLabelProps={{shrink: true,}} 
                                    onChange={(ev)=>handleMemberChange('birth',ev)} /> :
                        <TextField id="birth" label="Birth" type="date" value={member.birth} InputLabelProps={{shrink: true,}}  
                                    onChange={(ev)=>handleMemberChange('birth',ev)}/>
                    }
                    <p> - </p>
                    {!!!memberId ?
                        <TextField id="death" label="Death" type="date" InputLabelProps={{shrink: true,}} 
                                    onChange={(ev)=>handleMemberChange('death',ev)} /> :
                        <TextField id="death" label="Death" type="date" value={member.death} InputLabelProps={{shrink: true,}}  
                                    onChange={(ev)=>handleMemberChange('death',ev)}/>
                    }
                </BDdiv>
                <ProfileDiv>
                    {!!!memberId ?
                    <TextField className={classes.profile} id="profile" label="Edit Member's Profile" 
                                multiline minRows={10} maxRows={15} 
                                placeholder="Enter profile" fullWidth={true} variant="filled"
                                onChange={(ev)=>handleMemberChange('profile',ev)} /> :
                    <TextField className={classes.profile} id="profile" label="Edit Member's Profile" 
                                multiline minRows={10}  maxRows={15} 
                                variant="filled" fullWidth={true} value={member.profile} 
                                onChange={(ev)=>handleMemberChange('profile',ev)} />
                    }
                </ProfileDiv>
                </ProfileInfo>
            </MemberInfo>
            </Form>
            <PhotoDiv>
            </PhotoDiv>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    max-width: 1200px;
    height: 100%;
`;
const HeadIMG = styled.div`
    width: 1200px;
    height: 300px;
    background-image: ${props =>`url(${props.bgImg})`};
    background-size:cover;
    background-position: center;
    position: relative;
    box-shadow:  1px 1px 3px 1px rgba(0, 0, 0, 0.5);
`;
const MemberHeadDiv = styled.div`
    max-width: 1200px;
    width:1100px;
    position: absolute;
    top: 260px;
    left: 80px;
`;

const MemberHead= styled.div`
    display:flex;
    flex-direction: row;
    align-items: flex-end;
    border-bottom: 2px solid lightgrey;
    padding-bottom: 10px;
`;

const MemberIMG = styled.img`
    width: 280px;
    height: 300px;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.5);
    position: relative;
`;
const Input = styled.input`
    display:none;
`;
const IconContainer = styled.div`
    position: absolute;
    top: 0;
    left: 230px;
`;
const MemberName = styled.div`
    padding-left: 20px;
    input{
        height: 40px;
        width: 400px;
        font-size: 40px;
        font-weight: 700;
        opacity: 0.5;
        :focus{
            border: 1px solid lightblue;
            opacity:1;
        }
    }
`;

const MemberInfo = styled.div`
    margin-top: 10px;
    padding-left: 10px;
    height: 400px;
    font-size: 30px;
    display: flex;
    flex-direction: row;
`;
const Form = styled.div``;
const ProfileInfo = styled.div`
    padding-left: 5px;
    width: 100%;
`;
const BDdiv = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    align-content: center;
    input{
        height:32px;
        font-size:30px;
    }
`;
const ProfileDiv = styled.div`
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content:center;
    align-content: center;
`;
const MemberRelationship = styled.div`
    margin-top: 190px;
    padding-left: 10px;
    width: 100%;
    height: 100px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content: space-around;
    align-content: flex-start;
`;

const PhotoDiv = styled.div`
    margin-top: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: lightcyan;
`;
export default ProfileEdit;
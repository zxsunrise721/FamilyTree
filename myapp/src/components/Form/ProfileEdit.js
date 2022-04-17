import styled from 'styled-components';
import {useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FamilyContext from '../../FamilyContext';
import { DEFAULT_EDIT_AVATAR } from '../../constant';

const initialMember = {memberName:null, birth:null,death:null, profile:null, relationshipType:null, relationshipWith:null}
const ProfileEdit = () =>{
    const context = useContext(FamilyContext);
    const {memberId} = useParams();
    const [profileImg, setProfileImg] = useState(null);
    const [member, setMember] = useState(initialMember);

    useEffect(()=>{
        const fetchMember = async ()=>{
            let resp = await context.request('GET',`/api/get-family-member/${memberId}`,null);
            if(resp.status === 200){ setMember(resp.data); }
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
    }

    const handleMemberChange = (type, e) =>{
        e.preventDefault();
        switch(type){
            case 'memberName': setMember({ ...member, memberName: e.target.value }); break;
            case 'birth': setMember({...member, birth: e.target.value }); break;
            case 'death': setMember({...member, death: e.target.value }); break;
            case 'profile': setMember({...member, profile: e.target.value }); break;
            case 'rsType': setMember({...member, relationshipType: e.target.value }); break;
            case 'rsWith': setMember({...member, relationshipWith: e.target.value }); break;
            default: console.error('Unknown type',type);
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        let formData = new FormData();
        console.log(member);
        formData.append('familyId',context.state.curFamily._id);
        formData.append('memberName', member.memberName);
        formData.append('avatar',profileImg);
        formData.append('birth', member.birth);
        formData.append('death', member.death);
        formData.append('profile', member.profile);
        formData.append('relationshipType', member.relationshipType);
        formData.append('relationshipWith', member.relationshipWith);
        try{
            fetch('/api/family-member-create', {
            method: 'POST',
            body: formData,
            }).then(res=>res.json())
                .then(resp=>{
                    let respData = resp.data;
                    console.log('message: ',resp.message, 'data: ',respData);
                    window.location.href = `/member/${respData._id}`;
                });
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
                        <TextField required id="memberName" label="Enter member name (Required)" variant="filled" 
                                    onChange={(ev)=>handleMemberChange('memberName',ev)} /> :
                        <TextField required id="memberName" label="Enter member name (Required)" variant="filled"  defaultValue={member.memberName} 
                                    onChange={(ev)=>handleMemberChange('memberName',ev)} />
                        }
                    </MemberName>
                    <Button variant="contained" color="primary" onClick={ev=>handleSubmit(ev)}>{!!!memberId ? 'Save Member Profile' : 'Update Member Profile'}</Button>
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    {!!!memberId ?
                        <TextField id="birth" label="Birth" type="date" InputLabelProps={{shrink: true,}} onChange={(ev)=>handleMemberChange('birth',ev)} /> :
                        <TextField id="birth" label="Birth" type="date" value={member.birth} InputLabelProps={{shrink: true,}}  onChange={(ev)=>handleMemberChange('birth',ev)}/>
                    }
                    <p> - </p>
                    {!!!memberId ?
                        <TextField id="death" label="Death" type="date" InputLabelProps={{shrink: true,}} onChange={(ev)=>handleMemberChange('death',ev)} /> :
                        <TextField id="death" label="Death" type="date" value={member.death} InputLabelProps={{shrink: true,}}  onChange={(ev)=>handleMemberChange('death',ev)}/>
                    }
                </BDdiv>
                <ProfileDiv>
                    {!!!memberId ?
                    <TextField id="profile" label="Edit Member's Profile" multiline maxRows={10} placeholder="Enter profile" fullWidth={true}
                                onChange={(ev)=>handleMemberChange('profile',ev)} /> :
                    <TextField id="profile" label="Edit Member's Profile" multiline maxRows={10} value={member.profile} variant="filled" fullWidth={true}
                                onChange={(ev)=>handleMemberChange('profile',ev)} />
                    }
                </ProfileDiv>
                </ProfileInfo>
                <MemberRelationship>
                <TextField id="relationshipType" select label="type of relationship" variant="filled"
                            value={!!memberId ? member.relationshipType : ''}
                            onChange={(ev)=>handleMemberChange('rsType',ev)}>
                        <MenuItem key={'Root'} value={'Root'}>Root</MenuItem>
                        <MenuItem key={'Child'} value={'Child'}>Child</MenuItem>
                        <MenuItem key={'Couple'} value={'Couple'}>Couple</MenuItem>
                </TextField>
                <TextField id="relationshipWith" select label="with Member" variant="filled"
                            value={!!memberId ? member.relationshipWith : ''}
                            onChange={(ev)=>handleMemberChange('rsWith',ev)}>
                        {!!context.state.members && 
                            context.state.members.length>0 && 
                            context.state.members.map(member=>(
                                <MenuItem key={member._id} value={member._id}>{member.memberName}</MenuItem>
                            ))}
                </TextField>
                    
                </MemberRelationship>
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
    height: 400px;
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
    top: 320px;
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
    width: 300px;
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
    left: 250px;
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
    margin-top: 190px;
    padding-left: 10px;
    height: 400px;
    font-size: 30px;
    border: 1px solid lightgrey;
    background-color: lightyellow;
    display: flex;
    flex-direction: row;
`;
const Form = styled.div``;
const ProfileInfo = styled.div`
    padding-left: 5px;
    width: 75%;
    font-size: 30px;
    font-weight: bold;
    border: 1px solid lightgrey;
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
    textarea{
        width:98%;
        height:200px;
        font-size:30px;
    }
`;
const MemberRelationship = styled.div`
    margin-left: 5px;
    padding-left: 10px;
    width: 25%;
    font-size: 30px;
    font-weight: bold;
    border: 1px solid lightgrey;
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
    align-content: flex-start;
    select{
        font-size:28px;
        width:300px;
        background-color: lightyellow;
    }
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
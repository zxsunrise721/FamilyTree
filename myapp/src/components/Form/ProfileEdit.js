import styled from 'styled-components';
import {useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FcCameraAddon } from "react-icons/fc";
import FamilyContext from '../../FamilyContext';
import { DEFAULT_EDIT_AVATAR } from '../../constant';

const initialMember = {memberName:null, birth:null,death:null, profile:null, relationshipType:null, relationshipWith:null};
const ProfileEdit = () =>{
    const context = useContext(FamilyContext);
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
        if(!!!member.memberName){
            alert('Member must be enter!');
            return;
        }
        let formData = new FormData();
        formData.append('familyId',context.getCurrentFamily()._id);
        formData.append('memberName', member.memberName); 
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
        try{
            fetch('/api/family-member-update', {
                method: 'PUT',
                body: formData,
                }).then(res=>res.json())
                    .then(resp=>{
                        let respData = resp.data;
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
                            <div className="tooltip"> 
                                <span className="tooltiptext">Add A Photo</span>
                                <FcCameraAddon size={40}/>
                            </div>
                        </label>
                        </IconContainer>
                    </div>
                    <MemberName>
                        {!!!memberId ?
                        <input type="text" name="memberName" required placeholder="Enter member name" onChange={(ev)=>handleMemberChange('memberName',ev)}/>:
                        <input type="text" name="memberName" value={member.memberName} onChange={(ev)=>handleMemberChange('memberName',ev)}/>
                        }
                    </MemberName>
                    {!!!memberId ?
                        <>
                        {!!member.memberName ? 
                            <Button disabled={false} onClick={ev=>handleSubmit(ev)}>Save Member Profile</Button> :
                            <Button disabled={true} >Save Member Profile</Button>}
                        </>
                        :
                        !!!update ? 
                            <Button disabled={true} >Update Member Profile</Button> :
                            <Button disabled={false} onClick={ev=>handleUpdate(ev)}>Update Member Profile</Button>
                    }
                    
                    
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberRelationship>
                    {!!!memberId ?
                        <>
                        <div>
                        <label>Relationship Type:</label>
                        <select name="relationshipType" id="relationshipType" placeholder="choose relationship" onChange={(ev)=>handleMemberChange('rsType',ev)}>
                            <option value="#">-- Choose relationship type: --</option>
                            <option value="Root">Root</option>
                            <option defaultValue="Child">Child</option>
                            <option value="Couple">Couple</option>
                        </select>
                        </div>
                        <div>
                        <label>Relationship With:</label>
                        <select name="relationshipWith" id="relationshipWith" onChange={(ev)=>handleMemberChange('rsWith',ev)}>
                            <option value="#">-- Choose relationship with: --</option>
                            {!!context.state.members && context.state.members.length>0 && context.state.members.map(member=>{
                                return <option value={member._id} key={member._id}>{member.memberName}</option>
                            })}
                        </select>
                        </div>
                        </>
                        :
                        <>
                        <div>
                        <label>Relationship Type:</label>
                        <select name="relationshipType" id="relationshipType" placeholder="choose relationship" 
                                value={member.relationshipType}
                                onChange={(ev)=>handleMemberChange('rsType',ev)}>
                            <option value="#">-- Choose relationship type: --</option>
                            <option value="Root">Root</option>
                            <option value="Child">Child</option>
                            <option value="Couple">Couple</option>
                        </select>
                        </div>
                        <div>
                        <label>Relationship With:</label>
                        <select name="relationshipWith" id="relationshipWith" 
                                value={member.relationshipWith}
                                onChange={(ev)=>handleMemberChange('rsWith',ev)}>
                            <option value="#">-- Choose relationship with: --</option>
                            {!!context.state.members && context.state.members.length>0 && context.state.members.map(member=>{
                                return <option value={member._id} key={member._id}>{member.memberName}</option>
                            })}
                        </select>
                        </div>
                        </>
                    }
                </MemberRelationship>
            <MemberInfo>
                <ProfileInfo>
                    {!!!memberId ?
                        <BDdiv>
                            <div>
                                <label>Birth:</label>
                                <input type="date" name="birth" placeholder="Enter birth date" onChange={(ev)=>handleMemberChange('birth',ev)}/> 
                            </div>
                            <p> ~ </p>
                            <div>
                                <label>Death:</label>
                                <input type="date" name="death" placeholder="Enter death date" onChange={(ev)=>handleMemberChange('death',ev)}/>
                            </div>
                        </BDdiv>
                        :
                        <BDdiv>
                            <div>
                                <label>Birth:</label>
                                <input type="date" name="birth" value={member.birth} onChange={(ev)=>handleMemberChange('birth',ev)}/>
                            </div>
                            <p> ~ </p>
                            <div>
                                <label>Death:</label>
                                <input type="date" name="death" value={member.death} onChange={(ev)=>handleMemberChange('death',ev)}/>
                            </div>
                        </BDdiv>
                    }
                <ProfileDiv>
                    <label>Profile:</label>
                    {!!!memberId ?
                        <textarea id="profile" name="profile" rows="10" cols="50" placeholder="Enter profile" onChange={(ev)=>handleMemberChange('profile',ev)}/>
                        :
                        <textarea id="profile" name="profile" rows="10" cols="50" value={member.profile} onChange={(ev)=>handleMemberChange('profile',ev)}/>
                    }
                </ProfileDiv>
                </ProfileInfo>
            </MemberInfo>
            </Form>
            <PhotoDiv />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    min-width: 100vw;
    height: 100%;
`;
const HeadIMG = styled.div`
    width: 100%;
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
        padding-left: 5px;
        height: 60px;
        width: 400px;
        background-color: lightgrey;
        border:none;
        border-bottom: 3px solid blue;
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
const Button = styled.button`
    margin-left: 50px;
    width:360px;
    height: 42px;
    font-size: 28px;
    font-weight: bold;
    background-color: ${props=>props.disabled ? 'lightgrey' : 'blue'};
    color: ${props=>props.disabled ? 'blue' : 'yellow'};
    border-radius: 5px;
    box-shadow:  1px 1px 1px 1px rgba(0, 0, 0, 0.5);
`;
const Form = styled.div``;
const ProfileInfo = styled.div`
    padding-left: 5px;
    width: 100%;
`;
const BDdiv = styled.div`
    margin-top: 10px;
    height: 40px;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    align-content: center;
    border-bottom: 1px solid lightgrey;
    label{
        font-size:30px;
        font-weight: bold;
    }
    input{
        margin-bottom: 10px;
        padding-left: 20px;
        height:36px;
        font-size:30px;
        background-color: lightgrey;
        border:none;
        opacity: 0.6;
        :focus{
            border: 1px solid yellow;
            opacity:1;
        }
    }
`;
const ProfileDiv = styled.div`
    margin-top:10px;
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content:center;
    align-content: center;
    textarea{
        width:100%;
        height: 300px;
        font-size: 18px;
        background-color: lightgrey;
    }
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
    font-size: 28px;
    font-weight: bold;
    select{
        height: 30px;
        font-size:20px;
        background-color: lightgrey;
    }
`;

const PhotoDiv = styled.div`
    /* margin-top: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: lightcyan; */
`;
export default ProfileEdit;
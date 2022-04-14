import styled from 'styled-components';
import {useState, useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';

const initialMember = {memberName:null, birth:null,death:null, profile:null, relationshipType:null, relationshipWith:null}
const ProfileEdit = () =>{
    const [family, setFamily] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [members, setMembers] = useState(null);
    const [member, setMember] = useState(initialMember);

    useEffect(()=>{
        let v = window.sessionStorage.getItem('family');
        if(!!v){ v= JSON.parse(v); setFamily(v); }
        fetch(`/api/get-family-members/${v._id}`)
            .then(res=>res.json())
            .then(resp=>{
                let result = resp.data;
                setMembers(result);
            });
    },[])

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
        formData.append('familyId',family._id);
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
            <HeadIMG className="img" bgImg={!!family && family.backgroundImage!=='' ? family.backgroundImage : '/images/default/cloud.png'}/>
            <MemberHeadDiv>
                <MemberHead>
                    <div>
                    <MemberIMG id='profile-image' src={!!profileImg ? profileImg.name :'/images/default/defaultAvatar.jpg'}/>
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
                        <input type="text" name="memberName" placeholder="Enter member name" onChange={(ev)=>handleMemberChange('memberName',ev)}/>
                    </MemberName>
                    <Button variant="contained" color="primary" onClick={ev=>handleSubmit(ev)}>Save Member Profile</Button>
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    <label>Birth:</label><input type="date" name="birth" placeholder="Enter birth date" onChange={(ev)=>handleMemberChange('birth',ev)}/>
                    <p> - </p>
                    <label>Death:</label><input type="date" name="death" placeholder="Enter death date" onChange={(ev)=>handleMemberChange('death',ev)}/>
                </BDdiv>
                <ProfileDiv>
                    <label>Profile:</label>
                    <textarea id="profile" name="profile" rows="10" cols="50" placeholder="Enter profile" onChange={(ev)=>handleMemberChange('profile',ev)}/>
                </ProfileDiv>
                </ProfileInfo>
                <MemberRelationship>
                    <label>Relationship Type:</label>
                    <select name="relationshipType" id="relationshipType" placeholder="choose relationship" onChange={(ev)=>handleMemberChange('rsType',ev)}>
                        <option value="#">-- Choose relationship type: --</option>
                        <option value="Root">Root</option>
                        <option value="Child">Child</option>
                        <option value="Couple">Couple</option>
                    </select>
                    <label>Relationship With:</label>
                    <select name="relationshipWith" id="relationshipWith" onChange={(ev)=>handleMemberChange('rsWith',ev)}>
                        <option value="#">-- Choose relationship with: --</option>
                        {!!members && members.length>0 && members.map(member=>{
                            return <option value={member._id} key={member._id}>{member.memberName}</option>
                        })}
                    </select>
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
    width: 60%;
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
    width: 40%;
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
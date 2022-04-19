import styled from 'styled-components';
import {useState, useEffect, useContext} from 'react';
import {useParams, Link } from 'react-router-dom';
import FamilyContext from '../../FamilyContext';
import { DEFAULT_BACKGROUND_IMAGE,DEFAULT_EDIT_AVATAR } from '../../constant';

const MemberProfile = () =>{
    const context = useContext(FamilyContext);
    const {memberId} = useParams();
    const [member, setMember] = useState(null);

    useEffect(()=>{
        const fetchMember = async ()=>{
            let resp = await context.request('GET',`/api/get-family-member/${memberId}`,null);
            if(resp.status === 200){ setMember(resp.data); }
        }
        fetchMember();
    },[memberId])

    return (
        !!member &&
        <Wrapper>
            <HeadIMG className="img" bgImg={!!context.getCurrentFamily() && context.getCurrentFamily().backgroundImage!=='' 
                                                    ? context.getCurrentFamily().backgroundImage : DEFAULT_BACKGROUND_IMAGE}/>
            <MemberHeadDiv>
                <MemberHead>
                    <div>
                    <MemberIMG id='profile-image' src={!!member.avatar ? member.avatar : DEFAULT_EDIT_AVATAR}/>
                    </div>
                    <MemberName>
                        <input type="text" name="memberName" value={member.memberName} readOnly/>
                    </MemberName>
                    <Link to={`/edit/${member._id}`}><Button>Edit Member Profile</Button></Link>
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberRelationship>
                <div>
                    <label>Relationship Type:</label>
                    <select name="relationshipType" id="relationshipType" value={member.relationshipType} readOnly>
                        <option value="#">-- Choose relationship type: --</option>
                        <option value="Root">Root</option>
                        <option value="Child">Child</option>
                        <option value="Couple">Couple</option>
                    </select>
                </div>
                <div>
                    <label>Relationship With:</label>
                    <select name="relationshipWith" id="relationshipWith" value={member.relationshipWith} readOnly>
                        <option value="#">-- Choose relationship with: --</option>
                        {!!context.state.members && context.state.members.length>0 && context.state.members.map(member=>{
                            return <option value={member._id} key={member._id}>{member.memberName}</option>
                        })}
                    </select>
                </div>
            </MemberRelationship>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    <div>
                        <label>Birth:</label>
                        <input type="date" name="birth" value={member.birth} readOnly/>
                    </div>
                    <p> ~ </p>
                    <div>
                        <label>Death:</label>
                        <input type="date" name="death" value={member.death} readOnly/>
                    </div>
                </BDdiv>
                <ProfileDiv>
                    <label>Profile:</label>
                    <textarea id="profile" name="profile" rows="10" cols="50" value={member.profile} readOnly/>
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
    background-color: ${props=>props.disabled ? 'lightgrey' : 'lightblue'};
    color: ${props=>props.disabled ? 'yellow' : 'red'};
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
export default MemberProfile;
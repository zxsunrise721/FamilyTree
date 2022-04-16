import styled from 'styled-components';
import {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import FamilyContext from '../../FamilyContext';

const MemberProfile = () =>{
    const context = useContext(FamilyContext);
    console.log('context family: ',context.family);
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
            <HeadIMG className="img" bgImg={!!context.state.curFamily && context.state.curFamily.backgroundImage!=='' ? context.state.curFamily.backgroundImage : '/images/default/cloud.png'}/>
            <MemberHeadDiv>
                <MemberHead>
                    <div>
                    <MemberIMG id='profile-image' src={!!member ? member.avatar :'/images/default/defaultAvatar.jpg'}/>
                    </div>
                    <MemberName>
                        <input type="text" name="memberName" readOnly={true} value={member.memberName} />
                    </MemberName>
                    {/* <Button variant="contained" color="primary" onClick={ev=>handleSubmit(ev)}>Save Member Profile</Button> */}
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    <label>Birth:</label><input type="date" name="birth" readOnly={true} value={member.birth}/>
                    <p> - </p>
                    <label>Death:</label><input type="date" name="death" readOnly={true} value={member.death}/>
                </BDdiv>
                <ProfileDiv>
                    <label>Profile:</label>
                    <textarea id="profile" name="profile" rows="10" cols="50" readOnly={true} value={member.profile}/>
                </ProfileDiv>
                </ProfileInfo>
                <MemberRelationship>
                    <label>Relationship Type:</label>
                    <select name="relationshipType" id="relationshipType" readOnly={true} >
                        <option defaultValue={member.relationshipType} >{member.relationshipType}</option>
                    </select>
                    <label>Relationship With:</label>
                    <select name="relationshipWith" id="relationshipWith" readOnly={true} >
                        {!!member.relationship &&
                        <option defaultValue={member.relationship.rsMemberId}>{ member.relationship.rsMemberName }</option>
                        }
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

const MemberName = styled.div`
    padding-left: 20px;
    input{
        height: 40px;
        width: 400px;
        font-size: 40px;
        font-weight: 700;
        border:none;
    }
`;

const MemberInfo = styled.div`
    margin-top: 190px;
    padding-left: 10px;
    height: 400px;
    font-size: 30px;
    /* border: 1px solid lightgrey; */
    /* background-color: lightyellow; */
    display: flex;
    flex-direction: row;
`;
const Form = styled.div``;
const ProfileInfo = styled.div`
    padding-left: 5px;
    width: 60%;
    font-size: 30px;
    font-weight: bold;
    /* border: 1px solid lightgrey; */
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
        border:none;
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
export default MemberProfile;
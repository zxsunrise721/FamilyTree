import styled from 'styled-components';

const ProfileEdit = () =>{
    return (
        <Wrapper>
            <HeadIMG className="img" bgImg={''}/>
            <MemberHeadDiv>
                <MemberHead>
                    <MemberIMG  />
                    <MemberName>
                        <input type="text" name="memberName" placeholder="Enter member name" />
                    </MemberName>
                </MemberHead>
            </MemberHeadDiv>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    <label>Birth:</label><input type="date" name="birth" placeholder="Enter birth date" />
                    <p> - </p>
                    <label>Death:</label><input type="date" name="death" placeholder="Enter death date" />
                </BDdiv>
                <ProfileDiv>
                    <label>Profile:</label>
                    <textarea id="profile" name="profile" rows="10" cols="50" placeholder="Enter profile" />
                </ProfileDiv>
                </ProfileInfo>
                <MemberRelationship>
                    <label>Relationship Type:</label>
                    <select name="relationshipType" id="relationshipType" placeholder="choose relationship">
                        <option value="#">-- Choose relationship type: --</option>
                        <option value="Root">Root</option>
                        <option value="Child">Child</option>
                        <option value="Couple">Couple</option>
                    </select>
                    <label>Relationship With:</label>
                    <select name="relationshipWith" id="relationshipWith">
                        <option value="#">-- Choose relationship with: --</option>
                    </select>
                </MemberRelationship>
            </MemberInfo>
            <PhotoDiv>
            </PhotoDiv>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    max-width: 1200px;
    /* background-color: lightblue; */
    height: 100%;
`;
const HeadIMG = styled.div`
    width: 1200px;
    height: 400px;
    background-image: ${props =>`url(${props.bgImg})`};
    background-size:cover;
    background-position: center;
    position: relative;
    border:2px solid black;
`;
const MemberHeadDiv = styled.div`
    max-width: 1200px;
    width:1100px;
    position: absolute;
    top: 320px;
    left: 80px;
    background-color: lightblue;
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
    border: 4px solid blue;
    box-shadow: 1px 1px 2px 2px lightyellow;
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
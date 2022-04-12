import styled from 'styled-components';
import {useState, useEffect} from 'react';

const FamilyList = () =>{
    const [members, setMembers] = useState(null);
    useEffect(() =>{
        fetch('/api/get-family-members')
            .then(res=>res.json())
            .then(resp=>{
                let result = resp.data;
                setMembers(result);
            });
    },[]);
    return (
        <Wrapper>
            <div>
            {!!members && members.length>0 && 
            <MemberDiv>
            <table>
                <thead><tr><th>avatar</th><th>Given Name</th><th>birth-death</th><th>profile</th></tr></thead>
                <tbody>
                {members.map(member =>{
                    return(
                        <tr>
                            <td>{member.avatar}</td>
                            <td>{member.givenName}</td>
                            <td>{member.birthDeath}</td>
                            <td colspan="3">{member.profile}</td>
                        </tr>
                    );
                })}
            </tbody>
            </table>
            </MemberDiv>
            }
            </div>
            <Button>Create Family Member</Button>
        </Wrapper>
    );
}

const Wrapper = styled.div``;

const MemberDiv = styled.div``;
const Button = styled.button`

`;
export default FamilyList;
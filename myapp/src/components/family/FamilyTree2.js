import styled from 'styled-components';
import {useState, useEffect} from 'react';

const FamilyTree2 = () =>{
    const [members, setMembers] = useState(null);
    useEffect(() =>{
        let family = window.sessionStorage.getItem('family');
        family = !!family ? JSON.parse(family) : null;
        console.log(family);
        fetch(`/api/get-family-members/${family._id}`)
            .then(res=>res.json())
            .then(resp=>{
                let result = resp.data;
                console.log(result);
                setMembers(result);
            });
    },[]);

    return(
        <Wrapper>

        </Wrapper>
    );
}

const Wrapper = styled.div``;

export default FamilyTree2;
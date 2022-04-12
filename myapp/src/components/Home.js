import styled from "styled-components";
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

const Home = () =>{
    const [families, setFamilies] = useState(null);
    useEffect(()=>{
        fetch('/api/get-families-public')
            .then(res=>res.json())
            .then(resp=>{
                console.log('resp:'.resp);
                let result = resp.data;
                setFamilies(result);
            });
    },[]);

    const handleClick = (family)=>{
        window.sessionStorage.setItem('family',JSON.stringify(family));
        // window.location.reload();
    }
    return(
        <Wrapper>
            {console.log('Families: ',families)}
            {!!families && families.length>0 && 
                families.map(family =>{
                    return(
                        <FamilyList key={family._id+'2'} to={'/members'} onClick={()=>handleClick(family)}>{family.familyName} Family </FamilyList>
                    );
                })
            }
        </Wrapper>
    )
}

const Wrapper = styled.div``;
const FamilyList = styled(Link)`
    font-size: 32px;
    color: blue;
`;
export default Home;
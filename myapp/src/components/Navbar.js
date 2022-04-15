import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const Navbar = () =>{
    const [family, setFamily] = useState(null);
    useEffect(()=>{
        let family = window.sessionStorage.getItem('family');
        if(!!family){
            family = JSON.parse(family);
            setFamily(family);
        }
    },[]);

    const handleClick = () =>{
        window.sessionStorage.removeItem('family');
        window.location.href = '/';
    }
    return(
        <Wrapper>
            <Container>
                <Logo to="/">Family Tree App</Logo>
                {!!family && <FamilyContainer onClick={handleClick}>{family.familyName}</FamilyContainer>}
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div``;
const Container = styled.div`
    width:1200px;
    display: flex;
    flex-direction: row;
    padding: 1rem 2rem;
    background-color: #f0f0f0;
    align-items:center;
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    font-family: "Chango", cursive;
    font-size: 1.5rem;
    font-weight: bold;
    justify-content: center;
    text-decoration: none;
    color:black;
`;
const FamilyContainer = styled.div`
    margin-left: 20px;
    font-size: 2rem;
    font-style: italic;
    font-weight: bold;
    color: darkgreen; //rgb(37, 83, 3);
    cursor: pointer;
`;

export default Navbar;
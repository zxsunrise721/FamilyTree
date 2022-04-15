import styled from "styled-components";
import { useContext } from 'react';
import {Link} from 'react-router-dom';
import FamilyContext from '../FamilyContext';
import useFetchFamilies from '../hook/useFetchFamilies';

const Home = () =>{
    const context = useContext(FamilyContext);
    useFetchFamilies();
    return(
        <Wrapper>
            {!!context.families && context.families.length>0 && 
                <ContainerDiv>
                {context.families.map(family =>{
                    return(
                        <FamilyList key={family._id+'2'} to={'/members'} >
                            <Button img={family.backgroundImage} onClick={()=>context.setFamily(family)}>
                            {family.familyName} Family 
                            </Button>
                        </FamilyList>
                    );
                })}
                </ContainerDiv>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width:1200px;
    height: 1000px;
    background-image: url('/images/default/cloud.png');
    
`;
const ContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
    position: absolute;
    left:50%;
    top:40%;
    transform: translate(-50%,-40%);
`;
const FamilyList = styled(Link)`
    
`;
const Button = styled.button`
    font-size: 32px;
    color: yellow;
    background-image: ${props => `url(${props.img})`};
    border-radius:5px;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.5);
`;

export default Home;
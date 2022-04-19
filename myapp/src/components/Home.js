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
            {!!context.state.families && context.state.families.length>0 && 
                <ContainerDiv>
                {context.state.families.map(family =>{
                    return(
                        <FamilyList key={family._id+'2'} to={'/members'} >
                            <Button img={family.backgroundImage} onClick={()=>context.setCurrentFamily(family)}>
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
    min-width: 100vw;
    min-height: 120vh;
    background-image: url('/images/default/cloud.png');
    background-color: yellow;
    
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
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: bold;
    color: darkblue;
    background-image: ${props => `url(${props.img})`};
    border-radius:5px;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.5);
`;

export default Home;
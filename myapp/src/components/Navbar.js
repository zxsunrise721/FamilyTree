import styled from 'styled-components';
import { useContext, } from 'react';
import {Link} from 'react-router-dom';
import FamilyContext from '../FamilyContext';
import { ImTree } from "react-icons/im";
import { MdList, MdAccountTree, MdGroupAdd, MdContacts } from "react-icons/md";

const Navbar = () =>{
    const context = useContext(FamilyContext);
    const handleClick = () =>{
        context.clearCurrentFamily();
        window.location.href = '/';
    }
    const family = context.getCurrentFamily();
    return(
        <Wrapper>
            <Container>
                <Logo to="/">Family Tree App</Logo>
                {!!family && <FamilyContainer onClick={handleClick}>{family.familyName}</FamilyContainer>}
                <Toolbar>
                    <div className="tooltip"> 
                        <span className="tooltiptext">Family Add</span>
                        <Link to={'/create'} ><MdGroupAdd  size={30} color="blue"/></Link>
                    </div>
                    <div className="tooltip">
                        <span className="tooltiptext">Family List</span>
                        {!!family ? <Link to={'/members'} ><MdList size={30} color="blue" /></Link>
                                : <MdList size={30} color="silver" />}
                    </div>
                    <div className="tooltip">
                        <span className="tooltiptext">Family Tree</span>
                        {!!family ? <Link to={'/tree'} ><ImTree size={30} color='blue' /></Link>
                                : <ImTree size={30} color="silver"/>}
                    </div>
                    <div className="tooltip">
                        <span className="tooltiptext">Family Tree2</span>
                        {!!family ? <Link to={'/tree2'} ><MdAccountTree size={30} color="blue"/></Link>
                                        : <MdAccountTree size={30} color="silver"/>}
                    </div>
                    <div className="tooltip">
                        <span className="tooltiptext">Family Member Add</span>
                        {!!family ? <Link to={'/edit'} ><MdContacts size={30} color="blue"/></Link>
                                    : <MdContacts size={30} color="silver"/>}
                    </div>
                </Toolbar>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    min-width:100vw;
`;
const Container = styled.div`
    width:100%;
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

const Toolbar = styled.div`
    width: 250px;
    margin-left: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`;

export default Navbar;
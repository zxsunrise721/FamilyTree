import styled from 'styled-components';
import { useContext } from 'react';
import {Link} from 'react-router-dom';
import FamilyContext from '../FamilyContext';
import GroupAddSharpIcon from '@material-ui/icons/GroupAddSharp';
import ListSharpIcon from '@material-ui/icons/ListSharp';
import ListAltSharpIcon from '@material-ui/icons/ListAltSharp';
import PermContactCalendarSharpIcon from '@material-ui/icons/PermContactCalendarSharp';
import AccountTreeSharpIcon from '@material-ui/icons/AccountTreeSharp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const Navbar = () =>{
    const context = useContext(FamilyContext);
    const handleClick = () =>{
        context.clearCurrentFamily();
        window.location.href = '/';
    }
    return(
        <Wrapper>
            <Container>
                <Logo to="/">Family Tree App</Logo>
                {!!context.state.curFamily && <FamilyContainer onClick={handleClick}>{context.state.curFamily.familyName}</FamilyContainer>}
                <Toolbar>
                    <Tooltip title="Family add">
                        <IconButton  aria-label="Family add">
                            <Link to={'/create'} ><GroupAddSharpIcon  fontSize="large" color="primary" /></Link>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Family List">
                        <IconButton aria-label="Family List">
                            <Link to={'/members'} ><ListAltSharpIcon fontSize="large" color="primary" /></Link>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Family Tree">
                        <IconButton aria-label="Family Tree">
                            <Link to={'/tree2'} ><AccountTreeSharpIcon fontSize="large" color="primary"/></Link>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Family member add">
                        <IconButton aria-label="Family member add">
                            <Link to={'/edit'} ><PermContactCalendarSharpIcon fontSize="large" color="primary"/></Link>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
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

const Toolbar = styled.div`
    width: 250px;
    margin-left: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`;

export default Navbar;
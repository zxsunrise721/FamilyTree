import styled from 'styled-components';
import { useContext,} from 'react';
import {Link} from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ContactsIcon from '@material-ui/icons/Contacts';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FamilyContext from '../../FamilyContext';
import { DEFAULTMEMBERAVATAR } from '../../constant';
import useFetchFamilyMembers from '../../hook/useFetchFamilyMembers';


const columns = [
    {id: 'icon', label: '', minWidth: 10},
    {id: 'avatar', label: '', minWidth: 120},
    {id: 'name', label: 'Given Name', minWidth: 120, align: 'center', fontSize:20, fontWeight: 'bold',},
    {id: 'birth-death', label: 'Birth-Death', minWidth: 200, align:'center'},
    {id: 'profile', label: 'profile', minWidth: 400, align:'left'},
    {id: 'relationship', label: 'Relationship', minWidth: 200, align:'center'}
];

const useStyles = makeStyles({
    root:{ width: '100%', align:'center', },
    container:{ maxHeight: 440, },
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    body: { fontSize: 16, },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover, },
    },
}))(TableRow);

const FamilyList = () =>{
    const context = useContext(FamilyContext);
    const classes = useStyles();
    useFetchFamilyMembers();

    return (
        <Wrapper>
            <Paper className={classes.root}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                        </StyledTableCell>
                    ))}
                    </TableRow>
                </TableHead>
                {!!context.state.members && context.state.members.length>0 && 
                <TableBody>
                    {context.state.members.map(member =>{
                    return(
                        
                        <StyledTableRow key={member._id}>
                            <StyledTableCell key={member._id+'0'}>
                                    <Tooltip title="Family member edit">
                                    <IconButton  aria-label="Family member edit">
                                        <Link to={`/edit/${member._id}`} ><ContactsIcon  fontSize="large" color="primary" /></Link>
                                    </IconButton>
                                    </Tooltip></StyledTableCell>
                            <StyledTableCell key={member._id+'1'}><Link to={`/member/${member._id}`}><Img src={!!member.avatar ? member.avatar : DEFAULTMEMBERAVATAR} alt={member.memberName}/></Link></StyledTableCell>
                            <StyledTableCell key={member._id+'2'}><Link to={`/member/${member._id}`}>{member.memberName}</Link></StyledTableCell>
                            <StyledTableCell key={member._id+'3'}>{member.birth}~{member.death}</StyledTableCell>
                            <StyledTableCell key={member._id+'4'}><textarea rows="8" cols="50" readOnly={true} defaultValue={member.profile} /></StyledTableCell>
                            <StyledTableCell key={member._id+'5'}>{ member.relationshipType} {!!member.relationshipWith && member.relationshipWith!=="null" ? `of ${member.relationship.rsMemberName}` : ''}</StyledTableCell>
                        </StyledTableRow >
                    );
                })}
                </TableBody>
                }
                </Table>
            </Paper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    min-width: 100vw;
    background-image: url('/images/default/cloud.png');
    background-position: center;
`;

const Img = styled.img`
    width:100px;
    height:120px;
`;
export default FamilyList;
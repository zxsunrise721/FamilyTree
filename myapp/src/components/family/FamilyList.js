import styled from 'styled-components';
import { useContext,useState } from 'react';
import {Link} from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FamilyContext from '../../FamilyContext';
import useFetchFamilyMembers from '../../hook/useFetchFamilyMembers';

const columns = [
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
    // console.log('context family: ',context.state.curFamily);
    // console.log('context families: ',context.state.families);
    // console.log('context members: ',context.state.members);
    const classes = useStyles();
    const [checked, setChecked] = useState(null);
    useFetchFamilyMembers();
    const toggleChecked = () =>{
        setChecked((prev) => !prev);
        if(checked){
            window.location.href='/tree';
        }
    }

    return (
        <Wrapper>
            {/* <Toolbar>
                <Switch color="primary" checked={checked} onChange={toggleChecked} />
            </Toolbar> */}
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
                            <StyledTableCell key={member._id+'1'}><Link to={`/member/${member._id}`}><Img src={member.avatar} alt={member.memberName}/></Link></StyledTableCell>
                            <StyledTableCell key={member._id+'2'}><Link to={`/member/${member._id}`}>{member.memberName}</Link></StyledTableCell>
                            <StyledTableCell key={member._id+'3'}>{member.birth}~{member.death}</StyledTableCell>
                            <StyledTableCell key={member._id+'4'}><TextareaAutosize maxRows={8} defaultValue={member.profile} readOnly={true} /></StyledTableCell>
                            <StyledTableCell key={member._id+'5'}>{ member.relationshipType} {!!member.relationshipWith && member.relationshipWith!=="null" ? `of ${member.relationship.rsMemberName}` : ''}</StyledTableCell>
                        </StyledTableRow >
                    );
                })}
                </TableBody>
                }
                </Table>
            </Paper>
            <Link to={'/edit'}><Button>Create Family Member</Button></Link>
        </Wrapper>
    );
}


const Wrapper = styled.div`
    max-width: 1200px;
`;
const Toolbar = styled.div`
    height:30px;
    background-color:lightgrey;
`;

// const MemberDiv = styled.div``;

const Img = styled.img`
    width:100px;
    height:120px;
`;
const Button = styled.button`

`;
export default FamilyList;
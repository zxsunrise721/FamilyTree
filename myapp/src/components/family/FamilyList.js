import styled from 'styled-components';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const columns = [
    {id: 'avatar', label: '', minWidth: 120},
    {id: 'name', label: 'Given Name', minWidth: 120, align: 'center'},
    {id: 'birth-death', label: 'Birth-Death', minWidth: 200, align:'center'},
    {id: 'profile', label: 'profile', minWidth: 400, align:'left'},
    {id: 'relationship', label: 'Relationship', minWidth: 200, align:'center'}
];

const useStyles = makeStyles({
    root:{ width: '100%',  },
    container:{ maxHeight: 440, },
});

const FamilyList = () =>{
    const classes = useStyles();
    // const [family, setFamily] = useState(null);
    const [members, setMembers] = useState(null);
    useEffect(() =>{
        let family = window.sessionStorage.getItem('family');
        family = !!family ? JSON.parse(family) : null;
        // setFamily(family);
        console.log(family);
        fetch(`/api/get-family-members/${family._id}`)
            .then(res=>res.json())
            .then(resp=>{
                let result = resp.data;
                console.log(result);
                setMembers(result);
            });
    },[]);


    return (
        <Wrapper>
            <Paper className={classes.root}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                {!!members && members.length>0 && 
                <TableBody>
                    {members.map(member =>{
                    return(
                        
                        <TableRow key={member._id}>
                            <TableCell key={member._id+'1'}><Link to={`/member/${member._id}`}><Img src={member.avatar} alt={member.memberName}/></Link></TableCell>
                            <TableCell key={member._id+'2'}><Link to={`/member/${member._id}`}>{member.memberName}</Link></TableCell>
                            <TableCell key={member._id+'3'}>{member.birth}~{member.death}</TableCell>
                            <TableCell key={member._id+'4'}><TextareaAutosize maxRows={8} defaultValue={member.profile} readOnly={true} /></TableCell>
                            <TableCell key={member._id+'5'}>{ member.relationshipType} {!!member.relationshipWith ? `of ${member.relationship.rsMemberName}` : ''}</TableCell>
                        </TableRow >
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

const MemberDiv = styled.div``;

const Img = styled.img`
    width:100px;
    height:120px;
`;
const Button = styled.button`

`;
export default FamilyList;
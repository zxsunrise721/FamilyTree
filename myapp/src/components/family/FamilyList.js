import styled from 'styled-components';
import { useContext,} from 'react';
import {Link} from 'react-router-dom';
import { FcBusinessContact } from "react-icons/fc";
import '../../Tooltip.css';
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

const FamilyList = () =>{
    const context = useContext(FamilyContext);
    useFetchFamilyMembers();

    return (
        <Wrapper>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <Th key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                        </Th>
                    ))}
                    </TableRow>
                </TableHead>
                {!!context.state.members && context.state.members.length>0 && 
                <TableBody>
                    {context.state.members.map(member =>{
                    return(
                        <TableRow key={member._id}>
                            <TD key={member._id+'0'}>
                                <div className="tooltip"> 
                                    <span className="tooltiptext">Edit Member Profile</span>
                                    <Link to={`/edit/${member._id}`} ><FcBusinessContact  size={40} /></Link>
                                </div>
                            </TD>
                            <TD key={member._id+'1'}><Link to={`/member/${member._id}`}><Img src={!!member.avatar ? member.avatar : DEFAULTMEMBERAVATAR} alt={member.memberName}/></Link></TD>
                            <TD key={member._id+'2'}><Link to={`/member/${member._id}`}>{member.memberName}</Link></TD>
                            <TD key={member._id+'3'}>{member.birth}~{member.death}</TD>
                            <TD key={member._id+'4'}><textarea rows="8" cols="50" readOnly={true} defaultValue={member.profile} /></TD>
                            <TD key={member._id+'5'}>{ member.relationshipType} {!!member.relationshipWith && member.relationshipWith!=="null" ? `of ${member.relationship.rsMemberName}` : ''}</TD>
                        </TableRow >
                    );
                })}
                </TableBody>
                }
                </Table>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    min-width: 100vw;
    background-image: url('/images/default/cloud.png');
    background-position: center;
`;
const Table = styled.table`
    width:100%;
    border: 2px solid black;
    border-collapse: collapse;
    tr:nth-child(even){ 
        background-color:lightgrey;
    };
`;
const TableRow = styled.tr``;
const TableHead = styled.thead`
    height: 60px;
    background-color: #000;
    color: white;
    font-size: 24px;
    align-items: center;
    align-content: center;
`;
const Th = styled.th`
    padding-top: 15px;
    border: 1px solid black;
    align-items: center;
    align-content: center;
    text-align: center;
`;
const TableBody = styled.tbody``;
const TD = styled.td`
    border: 1px solid black;
    align-items: center;
    align-content: center;
    text-align: center;
    justify-content: center;
    vertical-align: middle;
    font-size: 20px;
    font-weight: bold;
    textarea{
        width: 100%;
        font-size: 14px;
    }
`;

const Img = styled.img`
    width:100px;
    height:120px;
`;
export default FamilyList;
import styled from 'styled-components';
import {useState, useEffect, useContext} from 'react';
import {useParams, Link } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FamilyContext from '../../FamilyContext';
import { DEFAULTMEMBERAVATAR, DEFAULT_BACKGROUND_IMAGE,DEFAULT_EDIT_AVATAR } from '../../constant';

const useStyles = makeStyles({
    name:{
        paddingTop: 10,
    },
    select:{
        marginBottom: 5,
        paddingTop: 10,
        width: 200,
        fontSize: 16,
        fontweight: 'bold',
    },
    button:{
        marginLeft: 60,
        fontSize: 16,
        fontWeight: 'bold',
    },
    profile:{
        paddingTop: 10,
        fontSize: 16,
    }
});

const MemberProfile = () =>{
    const classes = useStyles();
    const context = useContext(FamilyContext);
    const {memberId} = useParams();
    const [member, setMember] = useState(null);

    useEffect(()=>{
        const fetchMember = async ()=>{
            let resp = await context.request('GET',`/api/get-family-member/${memberId}`,null);
            if(resp.status === 200){ setMember(resp.data); }
        }
        fetchMember();
    },[memberId])

    return (
        !!member &&
        <Wrapper>
            <HeadIMG className="img" bgImg={!!context.getCurrentFamily() && context.getCurrentFamily().backgroundImage!=='' ? context.getCurrentFamily().backgroundImage : DEFAULT_BACKGROUND_IMAGE}/>
            <MemberHeadDiv>
                <MemberHead>
                    <div>
                    <MemberIMG id='profile-image' src={!!member.avatar ? member.avatar : DEFAULT_EDIT_AVATAR}/>
                    </div>
                    <MemberName>
                    <TextField className={classes.name} required id="memberName" variant="filled"  value={member.memberName} readOnly />
                    </MemberName>
                    <Link to={`/edit/${member._id}`}><Button className={classes.button} variant="contained" color="primary" >Edit Member Profile</Button></Link>
                </MemberHead>
            </MemberHeadDiv>
            <Form id='memberForm' enctype='multipart/form'>
            <MemberRelationship>
                <TextField select className={classes.select} id="relationshipType" 
                            label="type of relationship" variant="filled" readOnly
                            value={member.relationshipType} >
                            <MenuItem value={'Root'}>Root</MenuItem>
                            <MenuItem value={'Child'}>Child</MenuItem>
                            <MenuItem value={'Couple'}>Couple</MenuItem>
                </TextField>
                <TextField select className={classes.select} id="relationshipWith"  label="with Member" readOnly
                            variant="filled" value={!!member.relationshipWith ? member.relationshipWith : ''} >
                                <MenuItem value={""}><em>None</em></MenuItem>
                            {!!context.state.members && context.state.members.length>0 && context.state.members.map(memb=>(
                                <MenuItem key={memb._id} value={memb._id}>{memb.memberName}</MenuItem>
                            ))}
                </TextField>
            </MemberRelationship>
            <MemberInfo>
                <ProfileInfo>
                <BDdiv>
                    <TextField id="birth" label="Birth" type="date" value={member.birth} InputLabelProps={{shrink: true,}}  readOnly/>
                    <p> - </p>
                    <TextField id="death" label="Death" type="date" value={member.death} InputLabelProps={{shrink: true,}}  readOnly />
                </BDdiv>
                <ProfileDiv>
                    <TextField className={classes.profile} id="profile" label="Edit Member's Profile" 
                                multiline minRows={10}  maxRows={15} readOnly
                                variant="filled" fullWidth={true} value={member.profile}  />
                </ProfileDiv>
                </ProfileInfo>
            </MemberInfo>
            </Form>
            <PhotoDiv>
            </PhotoDiv>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    max-width: 1296px;
    height: 100%;
`;
const HeadIMG = styled.div`
    width: 1200px;
    height: 300px;
    background-image: ${props =>`url(${props.bgImg})`};
    background-size:cover;
    background-position: center;
    position: relative;
    box-shadow:  1px 1px 3px 1px rgba(0, 0, 0, 0.5);
`;
const MemberHeadDiv = styled.div`
    max-width: 1200px;
    width:1100px;
    position: absolute;
    top: 260px;
    left: 80px;
`;

const MemberHead= styled.div`
    display:flex;
    flex-direction: row;
    align-items: flex-end;
    border-bottom: 2px solid lightgrey;
    padding-bottom: 10px;
`;

const MemberIMG = styled.img`
    width: 280px;
    height: 300px;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.5);
    position: relative;
`;

const MemberName = styled.div`
    padding-left: 20px;
    input{
        height: 40px;
        width: 400px;
        font-size: 40px;
        font-weight: 700;
        border:none;
    }
`;

const MemberInfo = styled.div`
    margin-top: 10px;
    padding-left: 10px;
    height: 400px;
    font-size: 30px;
    display: flex;
    flex-direction: row;
`;
const Form = styled.div``;
const ProfileInfo = styled.div`
    padding-left: 5px;
    width: 100%;
`;
const BDdiv = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    align-content: center;
    input{
        height:32px;
        font-size:30px;
        border:none;
    }
`;
const ProfileDiv = styled.div`
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content:center;
    align-content: center;
`;
const MemberRelationship = styled.div`
    margin-top: 190px;
    padding-left: 10px;
    width: 100%;
    height: 100px;
    border-bottom: 1px solid lightgrey;
    border: 1px solid lightgrey;
    display: flex;
    flex-direction: row;
    align-items:center;
    justify-content: space-around;
    align-content: flex-start;
`;

const PhotoDiv = styled.div`
    margin-top: 10px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: lightcyan;
`;
export default MemberProfile;
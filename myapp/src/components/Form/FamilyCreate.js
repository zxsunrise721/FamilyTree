import styled from 'styled-components';
import {useState, useContext } from 'react';
import UserContext from '../../UserContext';


const FamilyCreate = () =>{
    const uContext = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [familyName, setFamilyName] = useState(null);
    const [type, setType] = useState('public');
    const [msg, setMsg] = useState(null);
    
    const handleSubmit = (ev) =>{
        ev.preventDefault();
        let formData = new FormData();
        formData.append("backgroundImage",file);
        formData.append("familyName", familyName);
        formData.append("showType",type);
        let curUser = uContext.getCurrentUser();
        if(!!curUser){formData.append("userId",curUser.id);}
        try{
            fetch('/api/family-create', {
            method: 'POST',
            body: formData,
            }).then(res=>res.json())
                .then(resp=>{
                    setMsg(resp.message);
                    let respData = resp.data;
                    window.sessionStorage.setItem('current-family', JSON.stringify(respData.family));
                    window.location.href = '/';
                });
        }catch(err){console.error(err)};
    }
    return (
        <Wrapper>
            <CreateBox>
                <H1>Family Create</H1>
                <Form id='form' enctype='multipart/form'>
                    <InputGroup>
                        <label>Family Name:</label>
                        <input type="text" name="familyName" placeholder="Enter Your Family Name" 
                                onChange={(ev)=>setFamilyName(ev.target.value)}/>
                    </InputGroup>
                    <InputGroup>
                        <label>Family Tree Show Type:</label>
                        <select name="family-tree-show-type" onChange={(ev)=>setType(ev.target.value)}>
                            <option value="public">public</option>
                            <option value="private">private</option>
                        </select>
                    </InputGroup>
                    <InputGroup>
                        <label>Choose Family background image</label>
                        <input type="file" name="familyBGImg"  onChange={(ev)=> setFile(ev.target.files[0])}/>
                    </InputGroup>
                    <Button type='submit' onClick={(ev)=>handleSubmit(ev)}>Create Family</Button>
                </Form>
                {!!msg && <MessageDiv>{msg}</MessageDiv>}
            </CreateBox>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 300px;
    background-image: url('/images/default/cloud.png');
    background-position: center;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 100%;
`;
const CreateBox = styled.div`
    position: absolute;
    left: 40vw;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    box-shadow: 0 1px 11px rgba(0,0,0,0.3);
    border-radius: 2px;
    width: 420px;
    background: #fff;
    padding: 45px 35px;
`;
const H1 = styled.h1`
    font-size: 30px;
    color: rgb(37, 83, 3);
`;
const Form = styled.div`
    background-color: white;
    padding: 30px;
`;
const InputGroup = styled.div`
    margin-top:10px;
    font-size:24px;
    font-weight:bold;
    label{
        display: block;
        margin-bottom: 10px;
    }
    input{
        font-size: 24px;
    }
    select{
        font-size:24px;
    }
`;
const Button = styled.button`
    margin-top: 10px;
    width: 100%;
    border: none;
    background: rgb(37, 83, 3);
    font-size: 24px;
    color: white;
    border-radius: 3px;
    padding: 20px;
    text-align: center;
`;
const MessageDiv = styled.div`

`;

export default FamilyCreate;
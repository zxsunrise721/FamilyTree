import styled from "styled-components";
import {useState, useContext} from 'react';
import UserContext from '../../UserContext';


const RRegister = () => {
    const uContext = useContext(UserContext);
    const [userData, setUserData] = useState({username:'',password:'',email:''});
    const [confirmPwd, setConfirmPwd] = useState('');
    const [errMsg, setErrMsg] = useState(null);

    const handleSubmit = async () =>{
        if(userData.password !== confirmPwd){ return; }
        else{
            let isLogined = await uContext.login(userData);
            if(isLogined){ window.location.href = '/'; }
        }
    }
    return(
        <Wrapper>
            <RightContent>
                <InputBox>
                <Input autocomplete="off" type="text" placeholder="Enter your username" 
                            onChange={(ev)=>setUserData({...userData, username: ev.target.value})} />
                    <Input autocomplete="off" type="email" placeholder="Enter your email" 
                            onChange={(ev)=>setUserData({...userData, email: ev.target.value})} />
                    <Input autocomplete="off" type="password" maxlength="20" placeholder="Enter your password"
                            onChange={(ev)=>setUserData({...userData, password: ev.target.value})}/>
                    <Input autocomplete="off" type="password" maxlength="20" placeholder="Confirm your password"
                            onChange={(ev)=>setConfirmPwd(ev.target.value)} />
                    <LoginButton onClick={handleSubmit}>Register</LoginButton>
                </InputBox>
                {!!uContext.state.error && <MsgBox>{uContext.state.errMessage}</MsgBox>}
            </RightContent>
        </Wrapper>
    );
}

const Wrapper = styled.div``;
const RightContent = styled.div``;
const InputBox = styled.div`
    .input {
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
            margin-top: 20px;
        }
    }
`;
const LoginButton = styled.button`
    width: 100%;
    height: 45px;
    margin-top: 40px;
    font-size: 15px;
`;

const Input = styled.input`
    padding: 10px 0px;
    font-size: 15px;
    width: 350px;
    color: #2c2e33;
    outline: none;
    border: 1px solid #fff;
    border-bottom-color: #e7e7e7;
    background-color: rgba(0, 0, 0, 0);
    opacity: 0.6;
    :focus {
        border-bottom-color: #0f52e0;
        outline: none;
        opacity: 1;
    }
`;

const MsgBox = styled.div`
    margin-top:10px;
    font-weight: bold;
    font-style: italic;
    color:red;
`;

export default RRegister;
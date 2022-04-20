import styled from "styled-components";
import {useState, useContext, useEffect} from 'react';
import UserContext from "../../UserContext";

const RLogin = () =>{
    const uContext = useContext(UserContext);
    const [username, setUsername] = useState(null);
    const [pwd, setPwd] = useState(null);

    const handleClick = async () =>{
        let userData = {username: username, password: pwd};
        let isLogined = await uContext.login(userData);
        if(isLogined){ window.location.href = '/'; }
    }
    return(
        <Wrapper>
            <RightContent>
                <InputBox>
                    <Input autocomplete="off" type="text" placeholder="Enter your username" onChange={(ev)=>setUsername(ev.target.value)} />
                    <Input autocomplete="off" type="password" placeholder="Enter your password" onChange={(ev)=>setPwd(ev.target.value)}/>
                    <LoginButton onClick={handleClick}>Login</LoginButton>
                </InputBox>
            </RightContent>
            <Option>
                <RememberCheckbox className="remember"><span className="checked">Remember me</span></RememberCheckbox>
                <span className="forget-pwd">forget password?</span>
            </Option>
            {!!uContext.state.error && <MsgBox>{uContext.state.errMessage}</MsgBox>}
        </Wrapper>
    );
}

const Wrapper = styled.div``;
const RightContent = styled.div`
    
`;
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
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
        margin-top: 20px;
    }
`;

const Option = styled.div`
    text-align: left;
    margin-top: 18px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    font-size: 14px;
    font-weight: 400;
    color: #4981f2;
    line-height: 20px;
    cursor: pointer;
`;
const RememberCheckbox = styled.div`
    float: right;
    font-size: 14px;
    font-weight: 400;
    color: #4981f2;
    line-height: 20px;
    cursor: pointer;
`;

const MsgBox = styled.div`
    margin-top:10px;
    font-weight: bold;
    font-style: italic;
    color:red;
`;

export default RLogin;
import styled from "styled-components";
import {useState} from 'react';
import RLogin from './RLogin';
import RRegister from './RRegister';

const LoginMain = () =>{
    const [typeView, setTypeView] = useState(0);
    
    return (
        <LoginContainer>
            <LoginBox>
                <LoginText>
                    <button onClick={()=>setTypeView(0)} >Log-in</button>
                    <button onClick={()=>setTypeView(1)} >Register</button>
                </LoginText>
                {typeView===0 ? <RLogin /> : <RRegister />}
            </LoginBox>
        </LoginContainer>
    );
}

const LoginContainer = styled.div`
    margin-top: 300px;
    background-position: center;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 100%;
`;
const LoginBox = styled.div`
    position: absolute;
    left: 40vw;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    box-sizing: border-box;
    text-align: center;
    box-shadow: 0 1px 11px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    width: 420px;
    background: #fff;
    padding: 45px 35px;
    .option {
        text-align: left;
        margin-top: 18px;
        .checked {
            padding-left: 5px;
        }
        .forget-pwd, .goback {
            float: right;
            font-size: 14px;
            font-weight: 400;
            color: #4981f2;
            line-height: 20px;
            cursor: pointer;
        }
        .protocol {
            color: #4981f2;
            cursor: pointer;
        }
    }`;
const LoginText = styled.div`
    width: 100%;
    text-align: center;
    padding: 0 0 30px;
    font-size: 24px;
    letter-spacing: 1px;
    button {
        width: 160px;
        padding: 10px;
        color: #969696;
        font-size: 24px;
        border:none;
        &:hover {
            border-bottom: 2px solid rgba(73, 129, 242, 1);
            color:rgba(73, 129, 242, 1);
        }
        &:active {
            font-weight: 600;
            color: rgba(73, 129, 242, 1);
            border-bottom: 2px solid rgba(73, 129, 242, 1);
        }
        
    }
    
`;

export default LoginMain;
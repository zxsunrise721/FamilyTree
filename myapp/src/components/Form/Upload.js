import styled from 'styled-components';
import {useState} from 'react';
// import axios from "axios";

const Upload = () =>{
    const [file, setFile] = useState(null);
    const handleSubmit = (ev) =>{
        ev.preventDefault();
        let formData = new FormData();
        formData.append("avatar",file);
        try{
            fetch('/upload-avatar', {
            method: 'POST',
            body: formData,
            // headers: {"Content-Type": "multipart/form-data"}
            }).then((res) => console.log(res));
            // axios.post('/upload-avatar', formData,{
            //     headers:{"Content-Type": "multipart/form-data"}
            // }).then((res)=>console.log(res));
        }catch(err){console.error(err)};
    }
    return (
        <Wrapper>
            <Container>
                <H1>File Upload</H1>
                <Form id='form' enctype='multipart/form'>
                    <InputGroup>
                        <label htmlFor='files'>Select files</label>
                        <input id='files' type='file' onChange={(ev)=> setFile(ev.target.files[0])}/>
                    </InputGroup>
                    <Button type='submit' onClick={(ev)=>handleSubmit(ev)}>Upload</Button>
                </Form>
            </Container>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    background-color: rgb(6, 26, 27);
    box-sizing: border-box;
`;
const Container = styled.div`
    max-width: 500px;
    margin: 60px auto;
`;
const H1 = styled.h1`
    text-align: center;
    color: white;
`;
const Form = styled.form`
    background-color: white;
    padding: 30px;
    label{
        display: block;
        margin-bottom: 10px;
    }
    input{
        padding: 12px 20px;
        width: 90%;
        border: 1px solid #ccc;
    }
`;

const InputGroup = styled.div`
    margin-bottom: 15px;
`;
const Button = styled.button`
    width: 100%;
    border: none;
    background: rgb(37, 83, 3);
    font-size: 18px;
    color: white;
    border-radius: 3px;
    padding: 20px;
    text-align: center;
`;
export default Upload;
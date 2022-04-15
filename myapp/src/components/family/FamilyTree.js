import styled from 'styled-components';
import {useState, useEffect} from 'react';
import TreeNode from './TreeNode';

const FamilyTree = () =>{
    const [family, setFamily] = useState(null);
    const [tree, setTree] = useState(null);

    useEffect(()=>{
        let currentFamily = window.sessionStorage.getItem('family');
        currentFamily = !!currentFamily ? JSON.parse(currentFamily) : null;
        setFamily(currentFamily);
        fetch(`/api/get-family-tree/${currentFamily._id}`)
            .then(res=>res.json())
            .then(resp=>{
                setTree(resp.data);
            });
    },[]);

    return(
        <Wrapper>
            {console.log(tree)}
            {!!tree && !!tree.member && <TreeNode member={tree.member}  left={0} />}
        </Wrapper>
    );
}

const Wrapper = styled.div``;

export default FamilyTree;
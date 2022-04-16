import styled from 'styled-components';
import {useState, useEffect, useContext} from 'react';
import TreeNode from './TreeNode';
import FamilyContext from '../../FamilyContext';

const FamilyTree = () =>{
    const context = useContext(FamilyContext);
    const [tree, setTree] = useState(null);

    useEffect(()=>{
        fetch(`/api/get-family-tree/${context.state.curFamily._id}`)
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
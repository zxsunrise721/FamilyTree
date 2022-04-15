import styled from 'styled-components';

const TreeNode = ({member,left}) =>{
    return(
        <Wrapper key={member.id+"1"}>
            <MemberDiv key={member.id+'2'} left={left}>
                <Img src={member.avatar} alt={member.name}/>
                <Label>{member.name}</Label>
            </MemberDiv>
            {!!member.children && <CanvasH id="mycanvas1" width="100%" height="50px" />}
            <ChildrenDiv>
            {!!member.children &&
                <>
                <CanvasV id="myCanvas" left={left+=50} />
                
                    { member.children.map( child => {
                    return(
                        <div key={child.member.id}>
                            <TreeNode key={child.member.id+'treenode'} member={child.member} left={left}/>
                        </div>
                    );
                })}
                </>
            }
            </ChildrenDiv>
        </Wrapper>
    );
}
const Wrapper = styled.div``;
const MemberDiv = styled.div`
    width:300px; 
    height: 140px;
    border: 1px solid red;
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Img = styled.img`
    width : 100px;
    height : auto;
`;
const Label = styled.label`
    padding-left: 10px;
    font-size: 24px;
    font-weight: bold;
`;
const ChildrenDiv = styled.div`
    display:flex;
    flex-direction: row;
`;

const CanvasV = styled.canvas`
    width: ${props=>`${props.left}px`};
    height:140px;
    border: 1px solid blue;
`;
const CanvasH = styled.canvas`
    width:100%;
    height: 50px;
    border: 1px solid blue;
`;

export default TreeNode;
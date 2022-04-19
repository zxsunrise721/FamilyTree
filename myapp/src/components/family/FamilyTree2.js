import styled from 'styled-components';
import {useContext, useEffect} from 'react';
import FamilyContext from '../../FamilyContext';
import { DEFAULTMEMBERAVATAR } from '../../constant';
import '@antv/x6-react-shape';
import { Graph, } from "@antv/x6";  // Cell, EdgeView, Vector

Graph.registerNode('org-node',
    { width: 280, height: 140,
        markup: [{tagName: 'rect',selector: 'body', },
                {tagName: 'image',selector: 'avatar', },
                {tagName: 'text',selector: 'birth',},
                {tagName: 'text',selector: 'death',},
                {tagName: 'text',selector: 'name',},],
        attrs: {body: { refWidth: '100%',
                        refHeight: '100%',
                        fill: '#5F95FF',
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        rx: 10,
                        ry: 10,
                        pointerEvents: 'visiblePainted',},
                avatar: { width: 100, height: 120, refX: 8, refY: 8, },
                birth: {
                    refX: 0.9,
                    refY: 0.2,
                    fill: 'yellow',
                    fontFamily: 'Courier New',
                    fontSize: 13,
                    textAnchor: 'end',
                    textDecoration: 'none',},
                death: {
                        refX: 0.9,
                        refY: 0.4,
                        fill: 'yellow',
                        fontFamily: 'Courier New',
                        fontSize: 13,
                        textAnchor: 'end',
                        textDecoration: 'none',},
                name: {
                    refX: 0.9,
                    refY: 0.7,
                    fill: 'darkred',
                    fontFamily: 'Courier New',
                    fontSize: 10,
                    fontWeight: '800',
                    textAnchor: 'end',},},
    },true, )
Graph.registerEdge('org-edge',
                    {zIndex: -1,
                        attrs: {
                            line: {
                                fill: 'none',
                                strokeLinejoin: 'round',
                                strokeWidth: 2,
                                stroke: 'blue', //'#A2B1C3',
                                sourceMarker: null,
                                targetMarker: 'block',}, },
                    }, true,)

const FamilyTree2 = () =>{
    const context = useContext(FamilyContext);
    // useFetchFamilyTree();
    useEffect(()=>{
        const graph = new Graph({
            container: document.getElementById('container'),
            connecting:{ anchor: 'orth',},
            width: 1296,
            height: 1000,
            background: {
                // image: context.getCurrentFamily().backgroundImage,
                repeat: 'flip-xy',
                opacity: 0.4,
            },
            mousewheel: {
                enabed: true,
                modifiers: ['ctrl', 'meta'],
                zoomAtMousePosition: true,
            }
        });
        function member(x, y, birth , death, name, image) {
            return graph.addNode({ x, y,shape: 'org-node',
                    attrs: { avatar: {opacity: 1.0, 'xlink:href': image,},
                            birth: {text: birth, wordSpacing: '-5px', letterSpacing: 0,},
                            death: {text: death, wordSpacing: '-5px', letterSpacing: 0,},
                            name: {text: name,fontSize: 16,fontFamily: 'Arial',letterSpacing: 0, }, },
                    })
        }
        function link(source, target, vertices) {
            return graph.addEdge({ vertices, source: { cell: source,}, target: {cell: target,}, shape: 'org-edge', })
        }

        function traverse(familyMember, vertex, father){
            let ccVertex = vertex;
            if(!!familyMember.children && familyMember.children.length >0){
                let i = familyMember.children.length;
                for(let j=0;j<i;j++){
                    const childMember = familyMember.children[j].member;
                    let childVertex = {x: vertex.x + 300, y: ccVertex.y + (j+1) * 140 };
                    const child = member(childVertex.x, childVertex.y, 
                                        `birth: ${childMember.birth}`,
                                        `death: ${childMember.death}`, 
                                        childMember.name, 
                                        !!childMember.avatar ? childMember.avatar : DEFAULTMEMBERAVATAR);
                    link(father, child,[{x: vertex.x + 140, y:childVertex.y + 70},]);
                    ccVertex = traverse(childMember,childVertex,child);
                }
            }
            return ccVertex;
        }
        // animation
        // function flash(cell){
        //     const cellView = graph.findViewByCell(cell);
        //     if(cellView){
        //         cellView.highlight();
        //         setTimeout(() => cellView.unhighlight(),300);
        //     }
        // }
        // graph.on('signal',(cell)=>{
        //     console.log('cell',cell.prototype.isEdge());
        //     if(!!cell && cell.prototype.isEdge()){
        //         const view = graph.findViewByCell(cell) //as EdgeView;
        //         if(view){
        //             const token = Vector.create('circle',{r:6,fill:'#feb662'});
        //             const target = cell.getTargetCell();
        //             setTimeout(()=>{
        //                 view.sendToken(token.node,1000,()=>{
        //                     if(target){ graph.trigger('signal',target)}
        //                 })
        //             },300)
        //         }
        //     }else{
        //         flash(cell);
        //         const edges = graph.model.getConnectedEdges(cell,{ outgoing:true,});
        //         edges.forEach(edge=>graph.trigger('signal',edge));
        //     }
        // })
        // graph.on('signal',cell=>{
        //         flash(cell);
        //         const edges = graph.model.getConnectedEdges(cell,{ outgoing:true,});
        //         edges.forEach(edge=>graph.trigger('signal',edge));
        // })

        // let manual = false;
        // graph.on('node:mousedown',({cell})=>{
        //     manual = true;
        //     graph.trigger('signal',cell);
        // })

        // const trigger = (a) =>{
        //     graph.trigger('signal', a);
        //     if(!manual){ setTimeout(trigger,5000)}
        // }
        
        let tree = context.getCurrentFamilyTree();
        let root;
        if(!!tree){
            const vertex = {x:10, y:10};
            root = member(vertex.x, vertex.y, `birth: ${tree.member.birth}`, `death: ${tree.member.death}`, tree.member.name, tree.member.avatar);
            traverse(tree.member, vertex, root);
            graph.zoomToFit({ padding: 20, maxScale: 1 });
        }
        // trigger(root);  //animation exec
    },[])

    return(
        <Wrapper>
            <div id="container"></div>
        </Wrapper>
    );
}
const Wrapper = styled.div`
    min-width: 100vw;
    min-height: 120vh;
    background-image: url('/images/default/cloud.png');
`;
export default FamilyTree2;
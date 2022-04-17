import {useContext, useEffect} from 'react';
import FamilyContext from '../../FamilyContext';
import '@antv/x6-react-shape';
import { Graph,} from "@antv/x6";
import { DEFAULTMEMBERAVATAR } from '../../constant';

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
                    refY: 0.6,
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
                                stroke: '#A2B1C3',
                                sourceMarker: null,
                                targetMarker: null,}, },
                    }, true,)

const FamilyTree1 = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const graph = new Graph({
            container: document.getElementById('container'),
            connecting:{ anchor: 'orth',},
            width: 1266,
            height: 800,
            background: {
                image: context.getCurrentFamily().backgroundImage,
                repeat: 'flip-xy',
                opacity: 0.4,
            },
            mousewheel: {
                enabed: true,
                modifiers: ['ctrl', 'meta'],
                zoomAtMousePosition: true,
            }
        });
        function member(x, y, birth, death, name, image) {
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
                    let childVertex = {x:ccVertex.x + j*300, y: vertex.y + 200}
                    const child = member(childVertex.x, childVertex.y, 
                                        `birth: ${childMember.birth}`, 
                                        `death: ${childMember.death}`, 
                                        childMember.name, 
                                        !!childMember.avatar ? childMember.avatar : DEFAULTMEMBERAVATAR );
                    link(father, child,[{x: ccVertex.x + 140 , y:childVertex.y - 30},{x: childVertex.x + 140, y: childVertex.y -30}]);
                    ccVertex = traverse(childMember,childVertex,child);
                }
            }
            return ccVertex;
        }
        
        let tree = context.getCurrentFamilyTree();
        if(!!tree){
            const vertex = {x:400, y:50};
            const father = member(vertex.x, vertex.y, `birth: ${tree.member.birth}`, `death: ${tree.member.death}`, tree.member.name, tree.member.avatar);
            traverse(tree.member, vertex, father);
            graph.zoomToFit({ padding: 20, maxScale: 1 });
        }
        
    },[])

    return(
        <div id="container"></div>
    );
}

export default FamilyTree1;
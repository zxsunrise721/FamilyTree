import {useContext, useEffect} from 'react';
import { DATASTATUS } from '../../constant';
import { getCurrentFamilyTree, } from '../../utilies/utilies';
import FamilyContext from '../../FamilyContext';
import '@antv/x6-react-shape';
import { Graph,} from "@antv/x6";

Graph.registerNode('org-node',
    { width: 280, height: 140,
        markup: [{tagName: 'rect',selector: 'body', },
                {tagName: 'image',selector: 'avatar', },
                {tagName: 'text',selector: 'years',},
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
                years: {
                    refX: 0.9,
                    refY: 0.2,
                    fill: '#fff',
                    fontFamily: 'Courier New',
                    fontSize: 13,
                    textAnchor: 'end',
                    textDecoration: 'underline',},
                name: {
                    refX: 0.9,
                    refY: 0.6,
                    fill: '#fff',
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

            

const male ='/images/default/male.png';

const FamilyTree2 = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const fetchTree = async () =>{
            if(context.TreeDataStatus!==DATASTATUS.LOADED){
                await context.fetchFamilyTree();
            }
        }
        

        const graph = new Graph({
            container: document.getElementById('container'),
            connecting:{ anchor: 'orth',},
            width: 1200,
            height: 800,
        });
        function member(x, y, years, name,image) {
            return graph.addNode({ x, y,shape: 'org-node',
                    attrs: { avatar: {opacity: 1.0, 'xlink:href': image,},
                            years: {text: years,wordSpacing: '-5px', letterSpacing: 0,},
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
                    let childVertex = {x: vertex.x + 300, y: ccVertex.y + (j+1) * 100};
                    const child = member(childVertex.x, childVertex.y, 
                                        childMember.years, 
                                        childMember.name, 
                                        !!childMember.avatar?childMember.avatar:male);
                    link(father, child,[{x: vertex.x + 140, y:childVertex.y + 70},]);
                    ccVertex = traverse(childMember,childVertex,child);
                }
            }
            return ccVertex;
        }
        
        fetchTree();
        let tree = context.state.familyTree;
        tree = !!!tree ? getCurrentFamilyTree() : tree;
        if(!!tree){
            const vertex = {x:10, y:10};
            const father = member(vertex.x, vertex.y, tree.member.years, tree.member.name, tree.member.avatar);
            traverse(tree.member, vertex, father);
            graph.zoomToFit({ padding: 20, maxScale: 1 });
        }
    },[])

    return(
        <div id="container"></div>
    );
}

export default FamilyTree2;
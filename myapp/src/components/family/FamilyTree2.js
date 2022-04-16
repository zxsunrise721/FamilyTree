import styled from 'styled-components';
import {useContext, useEffect} from 'react';
import { DATASTATUS } from '../../constant';
import FamilyContext from '../../FamilyContext';
import '@antv/x6-react-shape';
import { Graph, Node, Point } from "@antv/x6";

Graph.registerNode('org-node',
    { width: 240, height: 100,
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
                avatar: { width: 90, height: 100, refX: 8, refY: 2, },
                years: {
                    refX: 0.9,
                    refY: 0.2,
                    fill: '#fff',
                    fontFamily: 'Courier New',
                    fontSize: 14,
                    textAnchor: 'end',
                    textDecoration: 'underline',},
                name: {
                    refX: 0.9,
                    refY: 0.6,
                    fill: '#fff',
                    fontFamily: 'Courier New',
                    fontSize: 14,
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
const female = '/images/default/female.png'

const FamilyTree2 = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const fetchTree = async () =>{
            if(context.TreeDataStatus!==DATASTATUS.LOADED){
                await context.fetchFamilyTree();
            }
        }
        fetchTree();
        let tree = context.state.familyTree;
        console.log('tree',tree);

        const graph = new Graph({
            container: document.getElementById('container'),
            connecting:{ anchor: 'orth',},
            width: 1200,
            height: 800,
        });
        function member(x,y,years, name,image) {
            return graph.addNode({ x, y,shape: 'org-node',
                                    attrs: { avatar: {opacity: 0.7,'xlink:href': image,},
                                            rank: {text: years,wordSpacing: '-5px', letterSpacing: 0,},
                                            name: {text: name,fontSize: 13,fontFamily: 'Arial',letterSpacing: 0, }, },
            })
        }
        function link(source, target, vertices) {
            return graph.addEdge({
                vertices,
                source: { cell: source,},
                target: {cell: target,},
                shape: 'org-edge',
            })
        }

        //make member
        const root = member(300,50,tree.member['birth-death'],tree.member.name,tree.member.avatar);
        tree.member.children.forEach((child,index) => {
            let x, y=200;
            if(index===1){x = root.x - 240;}else{x = root.x + 240};
            const rchild = member(x,y, child.member['birth-death'], child.member.name, child.member.avatar);
            if(index===1){link(root,rchild,[{x:385,y:180,},{x: 175,y: 180, },]);}
            else{link(root,rchild,[{x: 385,y: 180,},{x: 585,y: 180,},]);}
        })
        

        // const bart = member(300, 50, 'CEO', 'Bart Simpson', male)
        // const homer = member(60, 200, 'VP Marketing', 'Homer Simpson', male)
        // const marge = member(300, 200, 'VP Sales', 'Marge Simpson', female)
        // const lisa = member(600, 200, 'VP Production', 'Lisa Simpson', female)
        // const maggie = member(400, 350, 'Manager', 'Maggie Simpson', female)
        // const lenny = member(190, 350, 'Manager', 'Lenny Leonard', male)
        // const carl = member(190, 500, 'Manager', 'Carl Carlson', male)
        // link(bart, marge, [{x: 385, y: 180,},])
        // link(bart, homer, [{x: 385,y: 180,},{x: 175,y: 180, },])
        // link(bart, lisa, [{x: 385,y: 180,},{x: 585,y: 180,},])
        // link(homer, lenny, [{x: 175,y: 380,},])
        // link(homer, carl, [{x: 175, y: 530,},])
        // link(marge, maggie, [{x: 385,y: 380,},])
        graph.zoomToFit({ padding: 20, maxScale: 1 })
    },[])

    return(
        <div id="container"></div>
    );
}

export default FamilyTree2;
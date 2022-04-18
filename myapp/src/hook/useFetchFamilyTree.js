import { useContext, useEffect } from 'react';
import { DATASTATUS } from '../constant';
import FamilyContext from '../FamilyContext';

const useFetchFamilyTree = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        window.sessionStorage.removeItem('family-tree');
                const fetchTree = async () =>{
            if(context.TreeDataStatus!==DATASTATUS.LOADED){
                await context.fetchFamilyTree();
            }
        }
        fetchTree();
        
    },[]);
}

export default useFetchFamilyTree;
import { useContext, useEffect } from 'react';
import { DATASTATUS } from '../constant';
import FamilyContext from '../FamilyContext';

const useFetchFamilyMembers = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        window.sessionStorage.removeItem('family-tree');
        const fetchMembers = async ()=>{
            if(context.state.membersDataStatus!==DATASTATUS.LOADED){
                await context.fetchMembers();
            }
        }
        const fetchTree = async () =>{
            if(context.TreeDataStatus!==DATASTATUS.LOADED){
                await context.fetchFamilyTree();
            }
        }

        fetchMembers();
        fetchTree();
        
    },[]);
}

export default useFetchFamilyMembers;
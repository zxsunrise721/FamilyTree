import { useContext, useEffect } from 'react';
import { DATASTATUS } from '../constant';
import FamilyContext from '../FamilyContext';

const useFetchFamilyMembers = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const fetchMembers = async ()=>{
            if(context.state.membersDataStatus!==DATASTATUS.LOADED){
                await context.fetchMembers();
            }
        }
        fetchMembers();
        
    },[]);
}

export default useFetchFamilyMembers;
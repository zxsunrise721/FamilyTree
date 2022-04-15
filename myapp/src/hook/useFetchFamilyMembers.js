import { useContext, useEffect } from 'react';
import FamilyContext from '../FamilyContext';

const useFetchFamilyMembers = (family) =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const fetchMembers = async ()=>{
            let resp = await context.request('GET',`/api/get-family-members/${family._id}`,null);
            if(resp.status === 200){ context.setMembers(resp.data); }
        }
        fetchMembers();
    },[family]);
}

export default useFetchFamilyMembers;
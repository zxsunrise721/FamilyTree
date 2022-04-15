import { useContext, useEffect } from 'react';
import FamilyContext from '../FamilyContext';

const useFetchFamilies = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const fetchFamilies = async ()=>{
            let resp = await context.request('GET','/api/get-families-public',null);
            if(resp.status === 200){ context.setFamilies(resp.data); }
        }
        fetchFamilies();
    },[]);
}

export default useFetchFamilies;
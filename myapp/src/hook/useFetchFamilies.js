import { useContext, useEffect } from 'react';
import FamilyContext from '../FamilyContext';
import { DATASTATUS } from '../constant';

const useFetchFamilies = () =>{
    const context = useContext(FamilyContext);
    useEffect(()=>{
        const fetchData = async ()=>{
            if(context.state.FamiliesDataStatus!==DATASTATUS.LOADED){
                await context.fetchFamilies();
            }
        }
        fetchData();
    },[]);
}

export default useFetchFamilies;
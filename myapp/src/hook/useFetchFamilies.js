import { useContext, useEffect } from 'react';
import FamilyContext from '../FamilyContext';
import UserContext from '../UserContext';
import { DATASTATUS } from '../constant';

const useFetchFamilies = () =>{
    const context = useContext(FamilyContext);
    const uContext = useContext(UserContext);
    useEffect(()=>{
        const fetchData = async ()=>{
            if(context.state.FamiliesDataStatus!==DATASTATUS.LOADED){
                let curUser = uContext.getCurrentUser();
                if(!!!curUser){
                    await context.fetchFamiliesPublic();
                }else{
                    curUser.role === 'admin'
                        ? await context.fetchFamilies()
                        : await context.fetchFamiliesByUser(curUser.id);
                }
            }
        }
        fetchData();
    },[]);
}

export default useFetchFamilies;
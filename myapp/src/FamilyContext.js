import { createContext, useReducer } from 'react';
import { DATASTATUS, USERSTATUS} from './constant';
import { getCurrentFamily, getCurrentFamilyTree, } from './utilies/utilies';

const initialState = { 
    families: [],
    FamiliesDataStatus: DATASTATUS.LOADING,
    curFamily: null,
    members:[],
    membersDataStatus: DATASTATUS.LOADING,
    familyTree:null,
    TreeDataStatus: DATASTATUS.LOADING,
    curUser: null,
    userStatus: USERSTATUS.UNLOGING,

    errorMsg: '',
};
const reducer = (state,action) =>{
    switch(action.type){
        case 'fetch-families':{ return { ...state, FamiliesDataStatus:DATASTATUS.LOADING, families: [] }; }
        case 'fetched-families':{ return {...state, FamiliesDataStatus: DATASTATUS.LOADED, families: action.data }; }
        case 'nofound-families':{ return {...state, FamiliesDataStatus: DATASTATUS.NOFOUND, families: [] }; }
        case 'error-fetch-families':{ return {...state,FamiliesDataStatus: DATASTATUS.ERROR, errorMsg: action.error}; }
        case 'fetch-members':{ return {...state, membersDataStatus: DATASTATUS.LOADING, members: [] }; }
        case 'fetched-members':{ return {...state,MembersDataStatus: DATASTATUS.LOADED, members: action.data };}
        case 'nofound-members':{ return {...state,MembersDataStatus: DATASTATUS.NOFOUND, members: [] };}
        case 'error-members':{ return {...state,MembersDataStatus: DATASTATUS.ERROR, errorMsg: action.error };}
        case 'set-current-family':{ return {...state, curFamily: action.currentFamily };}
        case 'clear-current-family':{ return {...state, curFamily: null};}
        case 'fetch-family-tree':{return{...state, TreeDataStatus:DATASTATUS.LOADING, }}
        case 'fetched-family-tree':{return{...state, TreeDataStatus:DATASTATUS.LOADED, familyTree: action.tree }}
        case 'error-family-tree':{return{...state, TreeDataStatus:DATASTATUS.ERROR, errorMsg: action.error }}
        default: throw new Error('errors');
    }
}

export const FamilyContext = createContext(null);
export const FamilyProvider = ({children}) =>{
    const [state, dispatch] = useReducer(reducer,initialState);

    const request = async (method, url, body) =>{
        method = method.toUpperCase();
        if(method==='GET'){ body = undefined; }
        else{ body = body && JSON.stringify(body); }
        let res = await fetch(url,{method,
                        body,
                        headers: {'Content-Type': 'application/json', 
                                'Accept':'application/json',
                                // 'Authorization': ('Bearer ' + localStorage.getItem('token')) || '',
                                },
        });
        return res.json();
    }

    const fetchFamilies = async (isRefresh) =>{
        dispatch({type:'fetch-families'});
        if((!!isRefresh && state.FamiliesDataStatus === DATASTATUS.LOADED)||(state.FamiliesDataStatus === DATASTATUS.LOADING)){ 
            let resp = await request('GET','/api/get-families-public');
            if(resp.status===200){
                !!resp.data && resp.data.length > 0 ?
                    dispatch({type:'fetched-families', data: resp.data}):
                    dispatch({type:'nofound-families'});
            }else{ dispatch({type:'error-fetch-families', error:resp.message})}
        }
    }

    const setCurrentFamily = (family) =>{
        dispatch({type:'set-current-family', currentFamily: family});
        window.sessionStorage.setItem('current-family', JSON.stringify(family) );
    }

    const clearCurrentFamily = () =>{
        dispatch({type:'clear-current-family'});
        window.sessionStorage.removeItem('current-family');
    }

    const fetchMembers = async (isRefresh) =>{
        dispatch({type:'fetch-members'});
        if((!!isRefresh && state.membersDataStatus === DATASTATUS.LOADED)||(state.membersDataStatus === DATASTATUS.LOADING)){ 
            let currentFamily = !!state.curFamily ? state.curFamily : getCurrentFamily();
            let resp = await request('GET',`/api/get-family-members/${currentFamily._id}`);
            if(resp.status===200){
                !!resp.data && resp.data.length > 0 ?
                    dispatch({type:'fetched-members', data: resp.data}):
                    dispatch({type:'nofound-members'});
            }else{ dispatch({type:'error-members', error:resp.message})}
        }
    }

    const fetchFamilyTree = async () =>{
        dispatch({type:'fetch-family-tree'});
        if(state.TreeDataStatus===DATASTATUS.LOADING){
            let currentFamily = !!state.curFamily ? state.curFamily : getCurrentFamily();
            let resp = await request('GET',`/api/get-family-tree/${currentFamily._id}`);
            if(resp.status === 200){ 
                dispatch({type:'fetched-family-tree', tree: resp.data});
                window.sessionStorage.setItem('family-tree', JSON.stringify(resp.data) );
            }else{ dispatch({type:'error-family-tree', error:resp.message}); }
        }
    }
    
    const values = { request, state, fetchFamilies, fetchMembers, setCurrentFamily, clearCurrentFamily, fetchFamilyTree, };
    return <FamilyContext.Provider value={values}>{children}</FamilyContext.Provider>
}

export default FamilyContext;
import { createContext, useReducer } from 'react';

const initialState ={ 
        isLogined: false,
        curUser: null,
        token:'',
        error: false,
        errMessage: '',
}

function reducer(state,action){
    console.log(action.type);
    switch(action.type){
        case 'login-error':{
            state = {...state, isLogined: false, error:true, errMessage: action.message}
            return state;
        }case 'logined':{
            window.sessionStorage.setItem('token', JSON.stringify(action.token));
            window.sessionStorage.setItem('current_user', JSON.stringify(action.userData));
            state = {...state, isLogined: true, 
                                curUser: action.userData,
                                token: action.token, };
            console.log(state);
            return state;
        }case 'registered' :{
            window.sessionStorage.setItem('token', JSON.stringify(action.token));
            window.sessionStorage.setItem('current_user', JSON.stringify(action.userData));
            state = {...state, isLogined: true, 
                                curUser: action.userData,
                                token: action.token, };
            return state;
        } case 'register-error':{
            state = {...state, isLogined: false, error:true, errMessage: action.message}
            return state;
        }case 'logout':{ 
            window.sessionStorage.removeItem('token');
            window.sessionStorage.removeItem('current_user');
            window.sessionStorage.removeItem('current-family');
            window.sessionStorage.removeItem('family-tree');
            state = {...state, isLogined: false,curUser:'', name: '', email: '', role: 'normal', token: '', error:false, errMessage:''};
            return state;
        }default: throw new Error('Invalid action');
    }
}

const UserContext = createContext(null);
export const UserProvider = ({children}) =>{
    const [state, dispatch] = useReducer(reducer,initialState);

    /**
     * save current user and token
     * @param {*} userData 
     * @returns logined = true
     */
    async function login(userData){
        const res = await fetch('/api/login', 
                            {method: 'POST', 
                            headers:{'Content-Type': 'application/json', 'Accept':'application/json',}, 
                            body: JSON.stringify(userData)});
        const resp =await res.json();
        if(resp.status===200){
            dispatch({type:'logined',userData: resp.data.userData, token: resp.data.token});
            return true;
        }else{ 
            dispatch({type:'login-error', message: resp.message});
            return false;
        }
    }

    /**
     * create a new user and auto save current user on front
     * @param {*} userData 
     * @returns logined = true;
     */
    async function register(userData){
        const res = await fetch('/api/register', 
                            {method: 'POST', 
                            headers:{'Content-Type': 'application/json', 'Accept':'application/json',}, 
                            body: JSON.stringify(userData)});
        const resp =await res.json();
        if(resp.status===200){
            dispatch({type:'registered',userData: resp.data.userData, token: resp.data.token});
            return true;
        }else{ 
            dispatch({type:'register-error', message: resp.message});
            return false;
        }
    }

    /**
     * action: logout
     */
    function logout(){
        dispatch({type:'logout'});
        window.location.href = '/';
    }

    /**
     * 
     * @returns current user
     */
    function getCurrentUser(){
        let user;
        user = !!state.curUser ? 
                    state.curUser : (
                        !!window.sessionStorage.getItem('current_user') ? 
                            JSON.parse(window.sessionStorage.getItem('current_user')) : null);
        return user;
    }

    const values ={ state, register, login, logout, getCurrentUser};
    return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

export default UserContext;
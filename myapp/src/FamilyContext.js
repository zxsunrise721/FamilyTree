import { useState, createContext } from 'react';

export const FamilyContext = createContext(null);

export const FamilyProvider = ({children}) =>{
    const [families, setFamilies] = useState(null);
    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);

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
    
    const values = { families, setFamilies, family, setFamily, members, setMembers, request, };
    return <FamilyContext.Provider value={values}>{children}</FamilyContext.Provider>
}

export default FamilyContext;
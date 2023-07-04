import {useState, createContext } from "react";

export const DataContext = createContext(null);



const DataProvider = ({children}) =>{
    const [account,setAccount] = useState({username:'', name:'', id:'',email:'' , picture:''})

    return(
        <DataContext.Provider value = {{
            account,
            setAccount
        }}>
            {children}
            </DataContext.Provider>
    )
}

export default DataProvider;
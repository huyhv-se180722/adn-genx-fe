import { createContext } from 'react'

export const StaffContext = createContext()

const StaffContextProvider = (props) => {

    const value = {
        
        
    }
    return (
        <StaffContext.Provider value={value}>
            {props.children}
        </StaffContext.Provider>
    )
}

export default StaffContextProvider
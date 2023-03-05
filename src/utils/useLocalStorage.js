import { useState } from "react";

export const useLocalStorage = (darkModeKey, initialValue) => {
    
    const [storedDarkModeValue, setStoredDarkModeValue] = useState(() => {
        const item = window.localStorage.getItem(darkModeKey);           
        return item ? JSON.parse(item) : initialValue;
    });
    
    const setLocalStorageDarkModeValue  = darkMode => {       
        window.localStorage.setItem(darkModeKey, JSON.stringify(darkMode));
        setStoredDarkModeValue(darkMode);
    };

    return [storedDarkModeValue, setLocalStorageDarkModeValue]; 
}

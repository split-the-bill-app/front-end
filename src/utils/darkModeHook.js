import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js"

const useDarkMode = () => {
    const [darkMode, setDarkMode] = useLocalStorage(false);    

    useEffect(() => {
        if (darkMode === true) {
            document.body.classList.add('dark-mode');
            if (document.querySelector('.dashboard-header-div')){
                document.querySelector('.dashboard-header-div').classList.add('dark-mode');
                document.querySelector('.totals-summary-div').classList.add('dark-mode');
            }
        }
        else {
            document.body.classList.remove('dark-mode');
            if (document.querySelector('.dashboard-header-div')) {
            document.querySelector('.dashboard-header-div').classList.remove('dark-mode');
            document.querySelector('.totals-summary-div').classList.remove('dark-mode');
            }
        }
    }, [darkMode]);

    return [darkMode, setDarkMode];
}
export default useDarkMode; 
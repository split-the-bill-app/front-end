import React from 'react';
import useDarkMode from "../utils/darkModeHook.js";

//dark mode toggle button and functionality
const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useDarkMode();
    
    const toggleMode = e => {
        e.preventDefault();
        setDarkMode(!darkMode);
    };

    return (
        <nav className="navbar">
            <div className="dark-mode__toggle">
                <div
                    onClick={toggleMode}
                    className={darkMode ? 'toggle toggled' : 'toggle'}
                />
            </div>
        </nav>
    );
};
export default DarkModeSwitch;
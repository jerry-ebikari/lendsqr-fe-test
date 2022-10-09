import React from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/Placeholder.scss"

function Placeholder() {
    const location = useLocation();
    let currentPath = location.pathname.replace(/-/g, ">").replace(/(.*\/)([\w>]*)$/, "$2").replace(/>/g, " ");
    return (
        <div className='flex align-center justify-center page-name'>
            {currentPath}
        </div>
    )
}

export default Placeholder
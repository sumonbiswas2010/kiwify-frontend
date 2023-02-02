import React, { useEffect } from 'react';
import logo from './page-not-found.jpg';
const NotFound = () => {
    useEffect(() => {
        document.title = 'Dashboard - Not Found';
    });
    return (
        <div style={{ textAlign: 'center', width: '90%' }}>
            <img width={'80%'} src={logo} alt="404" fluid />
        </div>
    );
};
export default NotFound;

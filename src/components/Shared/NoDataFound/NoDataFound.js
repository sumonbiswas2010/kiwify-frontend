import React from 'react';
import './NoDataFound.css';
const NoDataFound = ({ data = 'Data' }) => {
    return (
        <div className="no-data-found">
            <p>No {data} Found!</p>
        </div>
    );
};

export default NoDataFound;

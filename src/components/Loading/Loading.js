import React from 'react';
import Ellipse from './Ellipse.svg';
import './Loading.css';
import LoadingSVG from './Logo.svg';
const Loading = () => {
    return (
        <div>
            {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react-dom.js"></script>

            <div id="app"></div> */}

            <div className="loader">
                <div className="total">
                    <div className="only-logo-div">
                        <div></div>
                    </div>
                    <img className="only-logo-img" src={LoadingSVG} />
                    <div className="ellipse">
                        <img src={Ellipse} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Loading;

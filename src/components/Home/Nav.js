import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import UserImg from './user.png';
const Nav = () => {
    const percentage = 40;
    return (
        <div className="nav">
            <div>Members Area</div>
            <div className="nav-btns">
                <CircularProgressbar
                    className="progress-bar"
                    value={percentage}
                    text={`${percentage}%`}
                    styles={buildStyles({
                        textSize: '35px'
                    })}
                />
                <img
                    className="progress-bar"
                    src={UserImg}
                    alt="Group Of 10 Guys - Login User Icon Png@nicepng.com"
                ></img>
            </div>
        </div>
    );
};
export default Nav;

import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import ReactStars from 'react-rating-stars-component';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import apiCall from '../../api/apiCall';
import './Home.css';
import Nav from './Nav';
const Home = () => {
    const [courses, setCourses] = useState();
    const [displayData, setDisplayData] = useState();

    const [open, setOpen] = useState(false);
    const getCourses = async () => {
        const data = await apiCall('/course');
        if (data.ok) setCourses(data.data);
        else console.log(data.msg);
    };
    useEffect(() => {
        getCourses();
    }, []);

    useEffect(() => {
        if (!courses) return;
        setDisplayData({ ...courses[0]?.courses[0], class_title: courses[0]?.title });
    }, [courses]);

    return (
        <div className="home-div">
            <Nav />
            {displayData && (
                <div className="left-section">
                    <video controls="controls" width="100%" src={displayData.media}></video>
                    <div className="video-top-info">
                        <div>
                            <div>{displayData.class_title}</div>
                            <div>{displayData.title}</div>
                        </div>
                        <div>
                            <ReactStars
                                count={5}
                                value={displayData.rating || 0}
                                // onChange={ratingChanged}
                                size={24}
                                activeColor="#ffd700"
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="desc-top">{displayData.description_top}</div>
                    <div className="desc-btm">{displayData.description_bottom}</div>
                    <div className="attachments">Attachments</div>
                </div>
            )}
            <div className="right-section">
                <div className="classes-top">
                    <p>Classes</p> <p>X</p>
                </div>
                {courses?.map((d) => (
                    <>
                        <div onClick={() => setOpen(!open)} className="slider-top">
                            <span>{d.title}</span>
                            <span>
                                1/2
                                {open ? (
                                    <MdOutlineKeyboardArrowUp />
                                ) : (
                                    <MdOutlineKeyboardArrowDown />
                                )}
                            </span>
                        </div>
                        <SlideDown className={'my-dropdown-slidedown'}>
                            {open
                                ? d.courses?.map((c) => (
                                      <>
                                          <div
                                              onClick={() =>
                                                  setDisplayData({ ...c, class_title: d?.title })
                                              }
                                              className="dropdown-list"
                                          >
                                              <input
                                                  type="checkbox"
                                                  style={{
                                                      width: '25px',
                                                      height: '25px',
                                                      marginRight: '5px'
                                                  }}
                                              />
                                              {c.title}
                                          </div>
                                      </>
                                  ))
                                : null}
                        </SlideDown>
                    </>
                ))}
            </div>
        </div>
    );
};
export default Home;

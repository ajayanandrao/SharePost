import React, { useState } from 'react'
import aj from "./../Image/img/200.png";
import n from "./../Image/img/c1.png";
import { RxDotsVertical } from 'react-icons/rx';

export const on = () => {
    document.getElementById("Homeoverlay").style.display = "block";
}
const Overlay = () => {
    const [img, setImg] = useState(null);



    function off() {
        document.getElementById("Homeoverlay").style.display = "none";
    }

    return (
        <>

            <div style={{ padding: "20px" }}>
                <h2>Overlay with Text</h2>
                <button onClick={on}>Turn on overlay effect</button>
            </div>

            <div id="Homeoverlay" onClick={off} >
                <div id="Hometext">
                    <div className='div-center'>
                        <div className="Feed-Card-Container" >
                            <div className="Feed-card-div" id="d">

                                <div className="Feed-Section-One">
                                    <img src={aj} className="Feed-Profile-img" alt="" />
                                    <div className="Feed-Profile-name">Ajay Anandrao</div>
                                    <div className="Feed-Profile-Option-Container">

                                        <div className="dropdown">
                                            <div className='Feed-Option-btn-div btn ' >
                                                <RxDotsVertical fontSize={"20px"} />
                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="Feed-Section-Two">
                                    <div className="Feed-Post-Text">hello very one!</div>

                                    <div className="Feed-Post-img-Container mt-3">
                                        <label style={{ cursor: "pointer" }} htmlFor="img-id">
                                            <img className="Feed-Post-img" src={img ? URL.createObjectURL(img) : n} alt="" />
                                            <input id='img-id' style={{ display: "none" }} type="file" onChange={(e) => setImg(e.target.files[0])} />
                                        </label>
                                    </div>
                                </div>

                                <button className='btn btn-success  w-100'>done</button>
                                {/* <div className="Feed-Section-three">

                <div className="Feed-Comment-Section-div">
                  <BsFillHeartFill id={`myheart-${item.id}`} className="react-icons" style={{ color: "white", cursor: "pointer" }} onClick={() => Heart(item.id)} /> <span>3</span>
                </div>

                <div className="Feed-Comment-Section-div">
                  <FaCommentDots onClick={() => comment(item.id)} style={{ cursor: "pointer" }} className="react-icons" />
                </div>
                <div className="Feed-Comment-Section-div">
                  <IoMdShareAlt style={{ cursor: "pointer" }} className="react-icons" />
                </div>
              </div> */}

                                {/* <div className="Feed-Comment-Div" id={`comment-${item.id}`} style={{ display: "none" }}>
                <input type="text" placeholder='add a comment' className='Feed-Comment-Input' />
                <span style={{ margin: "0 0.5rem", fontSize: "18px", cursor: "pointer" }}>😃</span>
                <IoMdSend style={{ fontSize: "20px", cursor: "pointer" }} />
              </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overlay

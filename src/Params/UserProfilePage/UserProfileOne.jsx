import React from 'react';
import "./../UsersDetails.scss";
import ProfilePageTwo from '../../Profile/ProfilePages/ProfilePageTwo';
import ProfileTabes from "./ParamsTabe/ProfileTabes";

const UserProfileOne = ({ Param }) => {

    function on() {
        document.getElementById("overlay").style.display = "block";
    }

    function off() {
        document.getElementById("overlay").style.display = "none";
    }

    return (
        <>
            <div id="overlay" onClick={off}>
                <div id="text">
                    <img className='overlayImg' src={Param.userPhoto} alt="" />
                </div>
            </div>

            <div className='img' style={{ backgroundImage: `url(${Param.CoverPhoto ? Param.CoverPhoto : "https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80"})` }}>
            </div>

            <div className='profile-user-div'>
                <div className="profile-user-container">

                    <div className="profile-user-img-container">
                        <div onClick={on} style={{ backgroundImage: `url(${Param.userPhoto})` }} className="profile-user-img">
                        </div>
                    </div>

                    <div className='profile-name-div column-flex'>
                        <h2 className='profile-user-name'>{Param.name}</h2>

                        <div className='param-profile-btn-div'>
                        <button className='btn btn-primary custom-btn btn-sm'>+Add</button>
                        <button className='btn btn-primary custom-btn  btn-sm'>Message</button>
                    </div>
                    </div>

                    
                </div>

            </div>

            <hr />

            <ProfileTabes Param={Param} />
        </>
    )
}

export default UserProfileOne

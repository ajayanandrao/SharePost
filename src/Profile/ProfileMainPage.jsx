import React from 'react'
import ProfilePageOne from './ProfilePages/ProfilePageOne'
import ProfilePageTwo from './ProfilePages/ProfilePageTwo'
import ProfilePageThree from './ProfilePages/ProfilePageThree'
import "./ProfileMainPage.scss";

const ProfileMainPage = () => {
    return (
        <div className='profile-main-container'>
            <ProfilePageOne />
            <ProfilePageTwo/>
            <ProfilePageThree/>
        </div>
    )
}

export default ProfileMainPage

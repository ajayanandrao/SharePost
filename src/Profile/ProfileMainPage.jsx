import React from 'react'
import ProfilePageOne from './ProfilePages/ProfilePageOne'
import ProfilePageTwo from './ProfilePages/ProfilePageTwo'
import ProfilePageThree from './ProfilePages/ProfilePageThree'

const ProfileMainPage = () => {
    return (
        <div>
            <ProfilePageOne />
            <ProfilePageTwo/>
            <ProfilePageThree/>
        </div>
    )
}

export default ProfileMainPage

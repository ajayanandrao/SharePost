import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'


import About from './TabePages/About';

import Friends from './TabePages/Friends';
import Photos from './TabePages/Photos';
import UserPostProps from './TabePages/UserPostProps';
import "./ProfileSectionTow.scss";


const ProfileSectionTwo = () => {

  function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }


  return (
    <>
      <div className="tab">
        <button className="tablinks active" onClick={(event) => openCity(event, 'Post')}>Post</button>
        <button className="tablinks" onClick={(event) => openCity(event, 'About')}>About</button>
        <button className="tablinks" onClick={(event) => openCity(event, 'Friend')}>Friend</button>
        <button className="tablinks" onClick={(event) => openCity(event, 'Photo')}>Photos</button>
      </div>

      <hr className='hrr' />

      <div id="Post" className="tabcontent" style={{ display: "block" }}>
        <UserPostProps />
      </div>

      <div id="About" style={{ display: "none" }} className="tabcontent">
        <About />
        {/* about */}
      </div>

      <div id="Friend" style={{ display: "none" }} className="tabcontent">
        <Friends />
        {/* friend */}
      </div>

      <div id="Photo" style={{ display: "none" }} className="tabcontent">
        <Photos />
        {/* photo */}
      </div>
    </>
  )
}

export default ProfileSectionTwo
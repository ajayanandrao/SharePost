import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import "./ProfileSectionTow.scss";
import ParamUserPostProps from "./ParamsTabePages/ParamUserPostProps";
import ParamAbout from "./ParamsTabePages/ParamAbout";
import ParamFriends from "./ParamsTabePages/ParamFriends";
import ParamPhotos from "./ParamsTabePages/ParamPhotos";

const ProfileTabes = ({Param}) => {

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

      <div id="Post" className="tabcontent" style={{ display: "block" }}>
        <ParamUserPostProps Param={Param} />
      </div>

      <div id="About" style={{ display: "none" }} className="tabcontent">
        <ParamAbout user={Param} />
      </div>

      <div id="Friend" style={{ display: "none" }} className="tabcontent">
        <ParamFriends />
      </div>

      <div id="Photo" style={{ display: "none" }} className="tabcontent">
        <ParamPhotos />
      </div>
    </>
  )
}

export default ProfileTabes
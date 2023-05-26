import React, { useContext, useEffect, useState } from "react";
import "./About.scss";
import { RiHandbagFill } from "react-icons/ri";
import { BsFillHandbagFill, BsFillHeartFill, BsFillPhoneFill, BsPen, BsThreeDots } from "react-icons/bs";
import { GiEarthAfricaEurope } from "react-icons/gi";
import { IoMdSchool } from "react-icons/io";
import { SiHomeadvisor } from "react-icons/si";
import { collection, onSnapshot } from "firebase/firestore";
import { MdBusinessCenter, MdEmail, MdLocationOn, MdOutlineClose, MdOutlineWork, MdWork } from "react-icons/md"
import { AiFillHeart } from "react-icons/ai";
import { MdSchool } from "react-icons/md";
import { ImLink } from "react-icons/im";
import { HiPencil } from "react-icons/hi";
import { VscSymbolNamespace } from "react-icons/vsc";
import { AuthContext } from "../../../../AuthContaxt";
import { db } from "../../../../firebase";


const ParamAbout = ({ user }) => {

  const profileDataRef = collection(db, "UpdateProfile");
  const { currentuser } = useContext(AuthContext);
  const currentUser = currentuser && currentuser;

  const [api, setApiData] = useState([]);



  useEffect(() => {
    const unsub = onSnapshot(profileDataRef, (snapshot) => {
      setApiData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, [])

  function openCity(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("w3-indigo", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " w3-indigo";
  }

  function on() {
    document.getElementById("About-Overlay").style.display = "block";
  }

  function off() {
    document.getElementById("About-Overlay").style.display = "none";
  }

  const Data = api.map((item) => {

    const isCurrentUserPost = currentuser && item.uid === user.id;
    if (isCurrentUserPost) {
      return (
        <div key={item.id}>
          <div className="About-wrapper">
            <div className="About-div">

              <div className="About-title">

                <div className="About-title-text">
                  About
                </div>
                <div className="About-title-btn-div">
                  <button class=" w3-bar-item btnlink tablink " onClick={(e) => openCity(e, 'Overview')}>Overview</button>
                  <button class=" w3-bar-item btnlink tablink " onClick={(e) => openCity(e, 'Work')}>Work and education</button>
                  <button class=" w3-bar-item btnlink tablink " onClick={(e) => openCity(e, 'Places')}>Places lived</button>
                  <button class=" w3-bar-item btnlink tablink " onClick={(e) => openCity(e, 'Contact')}>Contact and basic info</button>
                </div>
              </div>

              <div className="About-details">

                <div id="Overview" class="w3-container city" >


                  <div className="About-icon">
                    <MdBusinessCenter /> <span className="About-icon-text">{item.work ? item.work : "Microsoft"}</span>
                  </div>

                  <div className="About-icon">
                    <MdSchool /> <span className="About-icon-text">{item.school ? item.school : "no High School to show"}</span>
                  </div>

                  <div className="About-icon">
                    <MdLocationOn /> <span className="About-icon-text">{item.Address ? item.Address : "No places to show"}</span>
                  </div>

                  <div className="About-icon">
                    <AiFillHeart /> <span className="About-icon-text">{item.relation ? item.relation : "No Relation to show"}</span>
                  </div>
                </div>

                <div id="Work" class="w3-container city" style={{ display: "none" }}>

                  <div className="About-icon">
                    <div style={{ color: "white", fontSize: "17px" }}> Work </div>
                    <MdBusinessCenter /> <span style={{ color: "#a9acb1" }} className="About-icon-text" >{item.work ? item.work : "No work to show"}</span>
                  </div>
                  <div className="About-icon">
                    <div style={{ color: "white", fontSize: "17px" }}> University </div>
                    <MdSchool /> <span style={{ color: "#a9acb1" }} className="About-icon-text" >{item.university ? item.university : "no University to show"}</span>
                  </div>
                  <div className="About-icon">
                    <div style={{ color: "white", fontSize: "17px" }}> High School </div>
                    <MdSchool /> <span style={{ color: "#a9acb1" }} className="About-icon-text" >{item.school ? item.school : "no high school to show"}</span>
                  </div>
                </div>

                <div id="Places" class="w3-container city" style={{ display: "none" }}>

                  <div className="About-icon">
                    <MdLocationOn /> <span className="About-icon-text" >{item.Address ? item.Address : "No places to show"}</span>
                  </div>
                </div>

                <div id="Contact" class="w3-container city" style={{ display: "none" }}>

                  <div className="About-icon">
                    <VscSymbolNamespace /> <span className="About-icon-text">{item.FirstName} {item.LastName} </span>
                  </div>
                  <div className="About-icon">
                    <MdEmail /> <span className="About-icon-text" style={{ textTransform: "lowercase" }}>{item.email ? item.email : "no email to show"}</span>
                  </div>
                  <div className="About-icon">
                    <BsFillPhoneFill /> <span className="About-icon-text">{item.MobileNumber}</span>
                  </div>
                  <div className="About-icon">
                    <ImLink /> <span className="About-icon-text" style={{ textTransform: "lowercase" }}>{item.link ? item.link : "no link to show"}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div >
      );
    }
  });

  return (
    <>

      {Data}

    </>
  );
};

export default ParamAbout;

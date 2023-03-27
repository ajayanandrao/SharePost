import React from "react";
import "./About.scss";
import { RiHandbagFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { GiEarthAfricaEurope } from "react-icons/gi";
import { IoMdSchool} from "react-icons/io";
import { SiHomeadvisor} from "react-icons/si";


const About = () => {
  return (
    <>
      <div className="about-div-bg">
        <div className="about-container">
          <div className="about-sec-one">
            <h5>About</h5>
            <div className="about-list">Overviews</div>
            <div className="about-list">Work and education</div>
            <div className="about-list">Place lived</div>
            <div className="about-list">Contanct and basic info</div>
            <div className="about-list">Family and relationship</div>
            <div className="about-list">Detail about you</div>
          </div>
          <div className="about-sec-two">

            <div className="sec-two-list">
              <RiHandbagFill className="about-s-two-icon" />{" "}
              <span className="about-s-two-text">
                Works at Affinity Express, EON IT park, Kharadi
              </span>
              <div className="about-opstion">
                <GiEarthAfricaEurope className="about-postion-icon earth me-3" />
                <BsThreeDots className="about-postion-icon" />
              </div>
            </div>

            <div className="sec-two-list">
              <IoMdSchool className="about-s-two-icon" />{" "}
              <span className="about-s-two-text">
                Studied Computer Science Engineering at shri shivaji
              </span>
              <div className="about-opstion">
                <GiEarthAfricaEurope className="about-postion-icon earth me-3" />
                <BsThreeDots className="about-postion-icon" />
              </div>
            </div>

            <div className="sec-two-list">
              <SiHomeadvisor className="about-s-two-icon" />{" "}
              <span className="about-s-two-text">
                Lives in Pune, Maharashtra
              </span>
              <div className="about-opstion">
                <GiEarthAfricaEurope className="about-postion-icon earth me-3" />
                <BsThreeDots className="about-postion-icon" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default About;

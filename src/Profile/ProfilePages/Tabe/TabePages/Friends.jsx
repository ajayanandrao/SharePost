import React, { useState } from "react";
import "./Friends.scss";
import { CgSearch } from "react-icons/cg";
import json from "./user.json";
import { useEffect } from "react";

const Friends = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <div style={{ height: "100vh" }}>
        <div className="friend-bg-div">
          <div className="friend-container">
            <div className="friend-div">
              <div className="friend-text">
                <span>Friends</span>
              </div>

              <div className="search-friend-div">
                <div className="search">
                  <CgSearch style={{ fontSize: "22px", color: "#cccccc" }} />
                  <input
                    type="text"
                    className="s-f-input"
                    placeholder="Search Friend"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />

                </div>
              </div>
            </div>

            <div className="friend-wrapper">



              {json.filter((value) => {
                if (search === "") {
                  return value
                } else if (value.name.toLowerCase().includes(search.toLowerCase())) {
                  return value
                }
              })
                .map((userlist) => {
                  return (
                    <div key={userlist.id} className="friend-list-div">
                      <img src={userlist.img} className="friend-img" alt="" />
                      <div className="friend-name">
                        <h6>{userlist.name}</h6>
                      </div>
                    </div>
                  );
                })}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;

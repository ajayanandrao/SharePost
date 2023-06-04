import React, { useContext, useState } from "react";
import "./Friends.scss";
import { CgSearch } from "react-icons/cg";
import json from "./user.json";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import { AuthContext } from "../../../../AuthContaxt";

const ParamFriends = ({user}) => {
  const [search, setSearch] = useState("");
  const { currentuser } = useContext(AuthContext);

  const [list, setList] = useState([]);
  const [listTwo, setListTwo] = useState([]);

  const AcceptedListRef = collection(db, 'A');
  const BRef = collection(db, 'B');

  useEffect(() => {
    const unsub = () => {
      onSnapshot(AcceptedListRef, (snapshot) => {
        let newbooks = []
        snapshot.docs.forEach((doc) => {
          newbooks.push({ ...doc.data(), id: doc.id })
        });
        setList(newbooks);
      })
    };

    const sub = () => {
      onSnapshot(BRef, (snapshot) => {
        let newbooks = []
        snapshot.docs.forEach((doc) => {
          newbooks.push({ ...doc.data(), id: doc.id })
        });
        setListTwo(newbooks);
      })
    };
    return unsub(), sub();
  }, []);


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

            <div className="friend-wrapper ">

              {
                list.map((item) => {
                  if (item.currentUid === user.uid) {
                    return (
                      <>
                        <div className="friend-list-div">
                          <img className="friend-img" src={item.photoUrl} alt="" />
                          <h4 className="friend-name">{item.name}</h4>

                        </div>
                      </>
                    )
                  }

                })
              }

              {
                listTwo.map((item) => {
                  if (item.uid === user.uid) {
                    return (
                      <>
                        <div className="friend-list-div">
                          <img className="friend-img" src={item.currentPhoto} alt="" />
                          <h4 className="friend-name">{item.currentName}</h4>

                        </div>
                      </>
                    )
                  }

                })
              }



              {/* {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div key={friend.id}>
                    <div className="friend-list-div">
                      {friend.senderId === currentuser.uid ? (
                        <>
                          <img className="friend-img" src={friend.receiverPhotoUrl} alt="" />
                          <div className="friend-name">{friend.receiverName}</div>
                        </>
                      ) : (
                        <>
                          <img className="friend-img" src={friend.senderPhotoUrl} alt="" />
                          <div className="friend-name">
                            <h6>{friend.senderName}</h6>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-friends-text">You have no friends.</div>
              )} */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParamFriends;

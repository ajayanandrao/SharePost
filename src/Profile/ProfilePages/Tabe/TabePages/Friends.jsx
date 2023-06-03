import React, { useContext, useRef, useState } from "react";
import "./Friends.scss";
import { CgSearch } from "react-icons/cg";
import { useEffect } from "react";
import { addDoc, collection, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { AuthContext } from "../../../../AuthContaxt";

const Friends = () => {
  const [search, setSearch] = useState("");
  const { currentuser } = useContext(AuthContext);

  // const [friends, setFriends] = useState([]);

  // useEffect(() => {
  //   if (currentuser) {

  //     const friendsQuery = query(collection(db, 'friendRequests'), where('status', '==', 'accepted'));
  //     const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
  //       const newFriends = snapshot.docs
  //         .filter(
  //           (doc) =>
  //             (doc.data().senderId === currentuser.uid || doc.data().receiverId === currentuser.uid) &&
  //             doc.data().status === 'accepted'
  //         )
  //         .map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setFriends(newFriends);
  //     });

  //     return () => {
  //       unsubscribeFriends();
  //     };
  //   }
  // }, [currentuser, db]);


  // const filteredFriends = friends.filter((friend) =>
  //   friend.senderName.toLowerCase().includes(search.toLowerCase()) ||
  //   friend.receiverName.toLowerCase().includes(search.toLowerCase())
  // );

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
                  if (item.currentUid === currentuser.uid) {
                    return (
                      <>
                        <h4>{item.name}</h4>
                      </>
                    )
                  }

                })
              }
              
              {
                listTwo.map((item) => {
                  if (item.uid === currentuser.uid) {
                    return (
                      <>
                        <h4>{item.currentName}</h4>
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

export default Friends;

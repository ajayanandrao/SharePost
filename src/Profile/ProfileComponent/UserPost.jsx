import "./../../Feed/Feed.scss";
import "./../../Feed/EditOverlay/OverlayEdit.scss";

import FlipMove from "react-flip-move";

import { RxDotsVertical } from "react-icons/rx";
import { BsFillHeartFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa";
import { IoMdSend, IoMdShareAlt } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AuthContext } from "../../AuthContaxt";
import ReactTimeago from "react-timeago";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CircularProgress, LinearProgress } from "@mui/material";
import { VscChromeClose } from "react-icons/vsc";
import { db, storage } from "../../firebase";
import photo from "./../../Image/img/photo.png";

const UserPost = () => {
  const colRef = collection(db, "AllPosts");
  const q = query(colRef, orderBy("bytime", "desc"));
  const [docs, loading, error] = useCollectionData(
    q,
    orderBy("bytime", "desc")
  );

  const { currentuser } = useContext(AuthContext);
  const [api, setApiData] = useState([]);

  const [editInput, setEditInput] = useState("");
  const [EditImg, setEditImg] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      setApiData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  const Heart = async (id) => {
    const element = document.getElementById(`myheart-${id}`);

    if (element.style.color === "white") {
      element.style.color = "#FF0040";
    } else {
      element.style.color = "white";
    }
  };

  function comment(id) {
    const element = document.getElementById(`comment-${id}`);

    if (element.style.display === "none") {
      element.style.display = "flex";
    } else {
      element.style.display = "none";
    }
  }

  function off(id) {
    document.getElementById(`overlay-${id}`).style.display = "none";
  }


  const done = async (id) => {
    setUpdating(true);
    const postRef = doc(db, "AllPosts", id);
    if (editInput && EditImg) {
      // If a new image is provided, upload it to storage and update the document
      const storageRef = ref(storage, `Post/${EditImg.name}`);
      await uploadBytes(storageRef, EditImg);

      const imageUrl = await getDownloadURL(storageRef);

      await updateDoc(postRef, {
        name: editInput,
        img: imageUrl,
      });
    } else {
      // If no new image is provided, only update the name field
      await updateDoc(postRef, {
        name: editInput,
      });
    }
    setEditInput("");
    setUpdating(false);
    document.getElementById(`overlay-${id}`).style.display = "none";
  };

  function postEdit(id) {
    // const x = document.getElementById(`edit-${id}`);
    document.getElementById(`overlay-${id}`).style.display = "block";
    const dropdown = document.getElementById(`myDropdown-${id}`);

    if (dropdown) {
      dropdown.classList.remove("show");
    }
  }

  const deletePost = async (id) => {
    const colRef = doc(db, "AllPosts", id);
    deleteDoc(colRef);
  };
  

  const Data = api?.map((item) => {

// ------------------------------------------------------------------------
    function OptionBtn(id) {
      const dropdownContent = document.getElementById(`myDropdown-${id}`);
      dropdownContent.classList.toggle("show");
      if (currentuser && currentuser.displayName !== item.displayName) {
        document.getElementById(`edit-${id}`).style.display = "none";
      }
    }

    const isCurrentUserPost =
      currentuser && item.displayName === currentuser.displayName;
    if (isCurrentUserPost) {
      // Render only the current user's post

      return (

        <div key={item.id}>
          <div className="div-center">
            <div className="Feed-Card-Container" id={item.id}>
              <div className="Feed-card-div" id="d">
                <div className="Feed-Section-One">
                  <img
                    src={item.photoURL}
                    className="Feed-Profile-img"
                    alt=""
                  />
                  <div className="Feed-Profile-name">{item.displayName}</div>

                  <div
                    className="timeago ms-3"
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <ReactTimeago
                      date={new Date(item?.bytime?.toDate()).toLocaleString()}
                    />
                  </div>

                  <div className="Feed-Profile-Option-Container">
                    <div className="dropdown">
                      <div
                        className="Feed-Option-btn-div btn "
                        onClick={() => OptionBtn(item.id)}
                      >
                        <RxDotsVertical fontSize={"20px"} />
                      </div>

                      <div
                        id={`myDropdown-${item.id}`}
                        className="dropdown-content"
                      >
                        <a
                          style={{ cursor: "pointer", color: "white" }}
                          onClick={() => postEdit(item.id)}
                          id={`edit-${item.id}`}
                        >
                          Edit
                        </a>

                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => deletePost(item.id)}
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="Feed-Section-Two">
                  <div
                    id={`overlay-${item.id}`}
                    style={{ display: "none" }}
                    className="overlay"
                  >
                    <div className="Overlay-Div">
                      <div className="overlay-Card">
                        <div className="firest-section-edit">
                          <div
                            className="btn x-btn"
                            onClick={() => off(item.id)}
                          >
                            <VscChromeClose fontSize={"16px"} />
                          </div>
                        </div>

                        <div className="second-section-edit">
                          <input
                            type="text"
                            className="edit-input"
                            placeholder="edit post"
                            onChange={(e) => setEditInput(e.target.value)}
                            value={editInput}
                          />
                        </div>

                        <div className="thurd-section-edit">
                          <label htmlFor="EditImg">
                            <img
                              className="postImg"
                              src={
                                EditImg
                                  ? URL.createObjectURL(EditImg)
                                  : "item.img"
                              }
                              alt=""
                            />

                            <div className="overlay-set-photos">
                              <img
                                className="photo-img me-2"
                                style={{ width: "25px" }}
                                src={photo}
                                alt=""
                              />
                              Photos
                            </div>
                          </label>
                        </div>

                        <div className="forth-section-edit">
                          <button
                          type="disable"
                            className="btn btn-success btn-sm w-25"
                            onClick={() => done(item.id)}
                          >
                            Update
                          </button>
                        </div>

                        {updating && <LinearProgress />}

                        <input
                          type="file"
                          id="EditImg"
                          onChange={(e) => setEditImg(e.target.files[0])}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="Feed-Post-Text d-flex">{item.name}</div>

                  <div className="Feed-Post-img-Container mt-3">
                    <img className="Feed-Post-img" src={item.img} alt="" />
                  </div>
                </div>

                <div className="Feed-Section-three">
                  <div className="Feed-Comment-Section-div">
                    <BsFillHeartFill
                      id={`myheart-${item.id}`}
                      className="react-icons"
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={() => Heart(item.id)}
                    />
                  </div>

                  <div className="Feed-Comment-Section-div">
                    <FaCommentDots
                      onClick={() => comment(item.id)}
                      style={{ cursor: "pointer" }}
                      className="react-icons"
                    />
                  </div>

                  <div className="Feed-Comment-Section-div">
                    <IoMdShareAlt
                      style={{ cursor: "pointer" }}
                      className="react-icons"
                    />
                  </div>
                </div>

                <div
                  className="Feed-Comment-Div"
                  id={`comment-${item.id}`}
                  style={{ display: "none" }}
                >
                  <input
                    type="text"
                    placeholder="add a comment"
                    className="Feed-Comment-Input"
                  />

                  <span
                    style={{
                      margin: "0 0.5rem",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    😃
                  </span>
                  <IoMdSend style={{ fontSize: "20px", cursor: "pointer" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }  
  });

  
  
  return (
  <>
  <div style={{height:"100vh"}}>
  {Data}
  </div>
  </>
)};

export default UserPost;

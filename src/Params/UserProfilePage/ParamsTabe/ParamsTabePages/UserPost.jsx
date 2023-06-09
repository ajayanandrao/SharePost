import FlipMove from "react-flip-move";
import { RxDotsVertical } from "react-icons/rx";
import { BsFillHeartFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa";
import { IoMdClose, IoMdSend, IoMdShareAlt } from "react-icons/io";
import React, { useContext, useEffect, useRef, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ReactTimeago from "react-timeago";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CircularProgress, LinearProgress } from "@mui/material";
import { VscChromeClose } from "react-icons/vsc";
import { db, storage } from "../../../../firebase";
import { AuthContext } from "../../../../AuthContaxt";
import TimeAgo from 'react-timeago';
import englishStrings from 'react-timeago/lib/language-strings/en';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import photo from "./../../../../Image/img/photo.png";
import Picker from '@emoji-mart/react';

const UserPost = ({ post, CurrentUser }) => {
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

  const [getComment, setComment] = useState([]);
  const [newComment, setNewComment] = useState([]);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };


  useEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      setApiData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  function OptionBtn(id) {
    // const dropdownContent = document.getElementById(`myDropdown-${id}`)
    // dropdownContent.classList.toggle('show')
    // if (CurrentUser.displayName !== post.displayName) {
    //   document.getElementById(`edit-${id}`).style.display = 'none'
    // }
  }

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


  const HandleComment = async (e, id) => {
    e.preventDefault()

    await addDoc(collection(db, "AllPosts", id, "comments"), {
      comment: getComment,
      displayName: CurrentUser.displayName,
      photoURL: CurrentUser.photoURL,
      timestamp: serverTimestamp(),
      uid: CurrentUser.uid
    })

    setComment("");
  };

  useEffect(() => {
    const sub = onSnapshot(collection(db, "AllPosts", post.id, "comments"), (snap) => {
      setNewComment(
        snap.docs.map((snap) => ({
          id: snap.id,
          ...snap.data(),
        }))
      );
    });
    return () => {
      sub();
    };
  }, [post.id]);


  const deleteComment = (id) => {
    const CommentRf = doc(db, 'AllPosts', post.id, "comments", id)
    deleteDoc(CommentRf);
  };

  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'AllPosts', post.id, 'comments'),
        orderBy('commentTime', 'desc')
      ),
      (snap) => {
        setNewComment(
          snap.docs.map((snap) => ({
            id: snap.id,
            ...snap.data(),
          }))
        );
        setCommentCount(snap.docs.length);
      }
    );

    return unsubscribe;
  }, [post.id]);

  const handleKey = (e, id) => {
    if (e.key === "Enter") {
      HandleComment(id);
      done(id);
    }
  };

  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "AllPosts", post.id, "likes"),
      (snapshot) => setLike(snapshot.docs)
    );
    return () => {
      unsub();
    };
  }, [post.id]);


  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'AllPosts', post.id, 'likes')),
      (snapshot) => {
        setIsliked(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
        // Log the uid property of each document
      }
    );

    return unsubscribe;
  }, [post.id]);


  useEffect(() => {
    setLiked(like.findIndex((like) => like.id === CurrentUser?.uid) !== -1);
  }, [like, CurrentUser.uid]);


  const formatter = buildFormatter(englishStrings);
  const userComment = newComment.map((item) => {

    return (
      <div className='userComment-div' id={`seeCom-${item.id}`} key={item.id}>
        <div className='comment-div'>
          <img src={item.photoURL} className="comment-img" alt="" />
          <span className='comment-name ms-2'>{item.displayName}</span>
          <div className='close-btn-comment'>
            <IoMdClose style={{ cursor: "pointer" }} onClick={() => deleteComment(item.id)} />
          </div>
        </div>
        <div className="comments post-Text">{item.comment}</div>
        {item.commentTime && (

          <TimeAgo className='timeago mt-3 post-Text'
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)'
            }} date={item.commentTime.toDate()} formatter={formatter} />
        )}
      </div>
    )
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleVideoBtnClick = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  function TimeAgoComponent({ timestamp }) {
    return <ReactTimeago date={timestamp} />;
  }

  const [isliked, setIsliked] = useState([]);

  const handleClick = () => {
    setAnimate(!animate);
  };

  function showLike(id) {
    const element = document.getElementById(`showliked-${id}`)
    const comment = document.getElementById(`comment-${id}`);

    if (element.style.display === 'none') {
      element.style.display = 'flex'
      comment.style.display = 'none';
    } else {
      element.style.display = 'none'
    }
  }

  const [showEmoji, setShowEmoji] = useState(false);
  const Emoji = () => {
    setShowEmoji(!showEmoji);
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-")
    let codesArray = []
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setComment(getComment + emoji);
  };

  return (
    <>
      <div className='div-center'>
        <div className='Feed-Card-Container' id={post.id}>
          <div className='Feed-card-div' id='d'>
            <div className='Feed-Section-One'>

              <div style={{ display: "flex", cursor: "pointer", alignItems: "center", color: "white" }} >
                <img src={post.photoURL} className='Feed-Profile-img' alt='' />
                <div className='Feed-Profile-name'>{post.displayName}</div>
              </div>

              <div
                className='timeago ms-3'
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <TimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} />
              </div>

              <div className='Feed-Profile-Option-Container'>

                <div className='dropdown'>
                  <div
                    className='Feed-Option-btn-div btn '
                    onClick={() => OptionBtn(post.id)}
                  >
                    <RxDotsVertical fontSize={'20px'} />
                  </div>

                  <div
                    id={`myDropdown-${post.id}`}
                    className='dropdown-content'

                  >
                    <a
                      style={{ cursor: 'pointer', color: 'white' }}
                      onClick={() => postEdit(post.id)}
                      id={`edit-${post.id}`}
                    >
                      Edit
                    </a>

                    <a
                      style={{ cursor: 'pointer', color: 'white' }}
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className='Feed-Section-Two'>
              <div
                id={`overlay-${post.id}`}
                style={{ display: 'none' }}
                className='overlay'
              >

                <div className='Overlay-Div'>
                  <div className='overlay-Card'>


                    <div className="firest-section-edit">
                      <div className='btn x-btn' onClick={() => off(post.id)} >
                        <VscChromeClose fontSize={"16px"} />
                      </div>
                    </div>


                    <div className='second-section-edit'>
                      <input
                        type='text'
                        className='edit-input'
                        placeholder='edit post'
                        onChange={(e) => setEditInput(e.target.value)}
                        value={editInput}
                        id={`editInput-${post.id}`}
                      />
                    </div>


                    <div className='thurd-section-edit'>
                      <label htmlFor="EditImg">
                        {/* <img className="postImg" src={EditImg ? URL.createObjectURL(EditImg) : "item.img"} alt="" /> */}


                        {EditImg && EditImg.type.startsWith('image/') && (
                          <img className="postImg" src={URL.createObjectURL(EditImg)} alt="" />
                        )}

                        {EditImg && EditImg.type.startsWith('video/') && (
                          <div className="video-container_">
                            <video width={"300px"} height={"250px"} ref={videoRef} onClick={handleClick} className="video_ ">
                              <source src={URL.createObjectURL(EditImg)} type={EditImg.type} />
                            </video>
                            {!isPlaying && (
                              <div className="play-button_" onClick={handleClick}>
                                {/* <i className="fas fa-play"></i> */}
                              </div>
                            )}
                          </div>
                        )}


                        <div className='overlay-set-photos'>
                          <img className='photo-img me-2' style={{ width: "25px" }} src={photo} alt="" /> Photos
                        </div>
                      </label>
                    </div>


                    <div className='forth-section-edit'>
                      <button
                        className='btn btn-success btn-sm w-25'
                        onClick={(e) => done(post.id)}
                      >
                        Update
                      </button>
                    </div>


                    <input type="file" id='EditImg'
                      onChange={(e) => setEditImg(e.target.files[0])}
                      style={{ display: "none" }} accept="image/*, video/*" />

                  </div>
                </div>

              </div>

              <div className='Feed-Post-Text d-flex'>{post.postText}</div>


              <div className='Feed-Post-img-Container mt-3'>

                {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                  <img width={"300px"} src={post.img} alt="Uploaded" className="Feed-Post-img image" />
                ) : post.img ? (

                  <div className="video-container">
                    <video ref={videoRef} className="video" onClick={handleVideoBtnClick}>
                      <source src={post.img} type="video/mp4" />
                    </video>
                    {!isPlaying && (
                      <a class="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                        <div className="play-button" >
                          <i className="fas fa-play"></i>
                        </div>
                        <span class="ripple pinkBg"></span>
                        <span class="ripple pinkBg"></span>
                        <span class="ripple pinkBg"></span>
                      </a>
                    )}
                  </div>


                ) : null}
              </div>

            </div>

            <div className="Feed-bottom-container">

              <div className="like-container">

                {liked ? (<div onClick={() => Heart(post.id)} className={`HeartAnimation${' animate'}`} >
                </div>) : (<div onClick={() => Heart(post.id)} className={`HeartAnimation${animate ? '' : ''}`} >
                </div>)}

                <div className="like-counter" onClick={() => showLike(post.id)}>
                  {like.length > 0 && like.length}
                </div>

              </div>

              <div className="Comment-container">
                <FaCommentDots
                  onClick={() => comment(post.id)}
                  style={{ cursor: 'pointer', fontSize: "20px" }}
                  className='react-icons'
                />
                <span className='comment-counter ms-2' >{commentCount > 0 && commentCount}</span>
              </div>

              <div className="Share-container">
                <IoMdShareAlt
                  style={{ cursor: 'pointer', fontSize: "20px" }}
                  className='react-icons' />
              </div>
            </div>

            {/* Like Section =================== */}

            <div className='See-Like-div' style={{ display: 'none' }} id={`showliked-${post.id}`}>

              <div className='userliked' id={`isliked${post.id}`} >
                {isliked.map((item) => {
                  return (
                    <>
                      <div className='mx-1' style={{ fontSize: "11px" }}>{item.name}</div>
                    </>
                  )

                })}
              </div>

            </div>

            {/* Comment Section ================ */}

            <div
              className='Feed-Comment-Div'
              id={`comment-${post.id}`}
              style={{ display: 'none' }}
            >
              <hr className='feed-hr' />
              <div className='feed-comment-div-one'>
                <input
                  type='text'
                  placeholder='add a comment'
                  className='Feed-Comment-Input'
                  value={getComment} onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleKey}
                />

                <div
                  onClick={Emoji}
                  style={{
                    margin: '0 1.5rem',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  😃
                </div>
                <IoMdSend type='submit' style={{ fontSize: '20px', cursor: 'pointer' }}
                  onClick={(e) => HandleComment(e, post.id)}
                />
                {/* <div className='see-com' onClick={toggleVisibility}>see com..</div> */}
              </div>

              {showEmoji && (<div>
                <div className='emoji mb-3'>
                  <Picker onEmojiSelect={addEmoji} />
                </div>
              </div>)}

              <div className='mb-3'>{userComment}</div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default UserPost;

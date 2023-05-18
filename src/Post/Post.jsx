import { Box, LinearProgress } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import "./Post.scss";
import "./../Practice.scss";

import photo from "./../Image/img/photo.png";
import video from "./../Image/img/v.png";
import smile from "./../Image/img/smile.png";
import aj from "./../Image/img/200.png";

import { db, storage } from '../firebase';
import { AuthContext } from '../AuthContaxt';
import { v4, uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, arrayUnion, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import Picker from '@emoji-mart/react';



const Post = () => {

  const colRef = collection(db, "AllPosts");
  const q = query(colRef, orderBy("bytime", "desc"));
  const { currentuser } = useContext(AuthContext);

  const [postText, setPostText] = useState("");
  const [api, setApiData] = useState([]);
  const [img, setImg] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  // const { uuid } = require('uuidv4');

  useEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      setApiData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  const dataRef = collection(db, "users");

  useEffect(() => {
    const unsub = onSnapshot(dataRef, (snapshot) => {
      setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);


  // ---------------------

  const handleUpload = async () => {

    setShowEmoji(false);
    setPostText("");
    setImg(null);

    if (img || postText) {
      let downloadURL = "";

      if (img) {

        const storageRef = ref(storage, "PostVideo/" + v4());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (progress < 100) {
              document.getElementById("p1").style.display = "block";
            } else {
              document.getElementById("p1").style.display = "none";
            }
            console.log("Loading:", progress);
          },
          (error) => {
            console.log("Error uploading img:", error);
          },
          async () => {
            try {
              await uploadTask;
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              saveData(downloadURL);

              console.log('img uploaded successfully');
            } catch (error) {
              console.log('Error uploading img:', error);
            }
          }
        );
      } else {
        saveData(downloadURL); // Pass an empty string as the downloadURL
      }
    } else {
      console.log('No img or text entered');
    }
  };

  const saveData = async (downloadURL) => {
    const allPostsColRef = collection(db, 'AllPosts');
    const userPostsListRef = doc(db, 'userPostsList', currentuser.uid);

    await addDoc(allPostsColRef, {
      name: img ? img.name : '',
      img: img ? downloadURL : '', // Only use the downloadURL if a img was uploaded
      uid: currentuser.uid,
      photoURL: currentuser.photoURL,
      displayName: currentuser.displayName,
      postText: postText,
      bytime: serverTimestamp(), // Use the server timestamp here
    });

    await updateDoc(userPostsListRef, {
      messages: arrayUnion({
        id: v4(),
        uid: currentuser.uid,
        photoURL: currentuser.photoURL,
        displayName: currentuser.displayName,
        postText: postText,
        img: downloadURL,
        bytime: Timestamp.now(),
      }),
    });

    setImg(null);
  };


  // ===================================

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleUpload();
    }
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-")
    let codesArray = []
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setPostText(postText + emoji);
  };

  const handleInputClick = () => {
    // setShowEmoji(false);
    // setImg(!showImg);
  };

  const Emoji = () => {
    setShowEmoji(!showEmoji);
    setShowImg(!showImg);

  };
  const ShowImg = () => {
    setShowImg(true);
  };
  const Wrapp = () => {
    // handleInputClick();
    ShowImg();
  };

  const [Photo, setPhoto] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleClick = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="div-center">

      <div className="post-container">
        <div className="post-inner" >
          <div className="user-post-container">
            <Link to="/profile">
              <img className="user-img" src={currentuser && currentuser.photoURL} />
            </Link>

            <input
              className="user-post-input"
              type="text"
              placeholder={`Whats on in your mind ? `}
              onClick={handleInputClick}
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={handleKey}
              value={postText}
            />
            <span className="post-name" onClick={handleUpload} type="button">
              Post
            </span>
          </div>

          <div className="post-add-container">

            <div className="post-category-contaner">
              <label htmlFor="p" onClick={Wrapp} style={{ cursor: "pointer" }}>

                <input type="file" id="p" accept="image/*, video/*" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />

                <img src={photo} className="post-cat-img" />
                <span className="post-cat-title">Photos</span>
              </label>
            </div>

            <div className="post-category-contaner">
              <img src={video} className="post-cat-img" />
              <span className="post-cat-title">Video</span>
            </div>

            <div onClick={Emoji} className="post-category-contaner">
              <img src={smile} className="post-cat-img" />
              <span className="post-cat-title">Feeling</span>
            </div>
          </div>
          {showEmoji && (<div>
            <div className='emoji'>
              <Picker onEmojiSelect={addEmoji} />
            </div>
          </div>)}
          {/* <EmojiPicker /> */}

          <div className="postImg-div">

            {img && img.type.startsWith('image/') && (
              <img className="postImg" src={URL.createObjectURL(img)} alt="" />
            )}

            {img && img.type.startsWith('video/') && (
              <div className="video-container mb-5">
                <video ref={videoRef} onClick={handleClick} className="video ">
                  <source src={URL.createObjectURL(img)} type={img.type} />
                </video>
                {!isPlaying && (
                  <div className="play-button" onClick={handleClick}>
                    <i className="fas fa-play"></i>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        <Box sx={{ width: '100%' }}>
          <LinearProgress id="p1" style={{ display: "none" }} />
        </Box>

      </div>
    </div>
  )
}

export default Post

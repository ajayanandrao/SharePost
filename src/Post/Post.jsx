import { Box, LinearProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "./Post.scss";

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


  // const { uuid } = require('uuidv4');

  useEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      setApiData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);


  const addPost = async (e) => {
    if (postText && api) {
      const colRef = collection(db, "AllPosts");

      if (img) {
        const storageRef = ref(storage, "Post/" + v4());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress < 100) {
              document.getElementById("p1").style.display = "block";
            } else {
              document.getElementById("p1").style.display = "none";
            }
          },
          (error) => { },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log("File available at", downloadURL);
              await addDoc(colRef, {
                uid: currentuser.uid,
                photoURL: currentuser.photoURL,
                displayName: currentuser.displayName,
                name: postText,
                img: downloadURL,
                bytime: serverTimestamp(),
              });

              await updateDoc(doc(db, "userPostsList", currentuser.uid), {
                messages: arrayUnion({
                  id: v4(),
                  uid: currentuser.uid,
                  photoURL: currentuser.photoURL,
                  displayName: currentuser.displayName,
                  name: postText,
                  img: downloadURL,
                  bytime: Timestamp.now(),
                }),
              });
            });
          }
        );
      } else {
        await addDoc(colRef, {
          uid: currentuser.uid,
          photoURL: currentuser.photoURL,
          displayName: currentuser.displayName,
          name: postText,
          bytime: serverTimestamp(),
        });

        await updateDoc(doc(db, "userPostsList", currentuser.uid), {
          messages: arrayUnion({
            id: v4(),
            uid: currentuser.uid,
            photoURL: currentuser.photoURL,
            displayName: currentuser.displayName,
            name: postText,
            bytime: Timestamp.now(),
          }),
        });
      }
      setImg(null);
      setPostText("");
      setShowEmoji(false);
    } else {
      // handle error case where postText or api is missing
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      addPost();
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
            <span className="post-name" onClick={addPost} type="button">
              Post
            </span>
          </div>

          <div className="post-add-container">

            <div className="post-category-contaner">
              <label htmlFor="p" onClick={Wrapp} style={{ cursor: "pointer" }}>
                <input type="file" id="p" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                <img src={photo} className="post-cat-img" />
                <span className="post-cat-title">Photos</span>
              </label>
            </div>

            <div  className="post-category-contaner">
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
            {showImg && (<img className="postImg" src={img ? URL.createObjectURL(img) : ""} alt="" />)}

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

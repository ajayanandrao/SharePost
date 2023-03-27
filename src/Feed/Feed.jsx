import React, { useEffect, useState } from 'react'
import "./Feed.scss";
import { BsFillHeartFill } from "react-icons/bs";
import { RxDotsVertical } from "react-icons/rx";
import { VscChromeClose } from "react-icons/vsc";
import { FaCommentDots } from "react-icons/fa";
import { IoMdClose, IoMdShareAlt } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import photo from "./../Image/img/photo.png";
import FlipMove from 'react-flip-move';
import { current } from '@reduxjs/toolkit';

const Feed = ({ post, CurrentUser }) => {

  const [editInput, setEditInput] = useState('');
  const [EditImg, setEditImg] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [getComment, setComment] = useState([]);
  const [newComment, setNewComment] = useState([]);

  function OptionBtn(id) {
    const dropdownContent = document.getElementById(`myDropdown-${id}`)
    dropdownContent.classList.toggle('show')
    if (CurrentUser.displayName !== post.displayName) {
      document.getElementById(`edit-${id}`).style.display = 'none'
    }
  }

  function postEdit(id) {
    // const x = document.getElementById(`edit-${id}`);
    document.getElementById(`overlay-${id}`).style.display = 'block'
    const dropdown = document.getElementById(`myDropdown-${id}`);

    if (dropdown) {
      dropdown.classList.remove('show');
    }

  };

  const deletePost = async id => {
    const colRef = doc(db, 'AllPosts', id)
    deleteDoc(colRef)
  }

  function off(id) {
    document.getElementById(`overlay-${id}`).style.display = 'none'
  }

  const done = async (id) => {
    setUpdating(true);
    const postRef = doc(db, 'AllPosts', id);
    if (EditImg) {
      // If a new image is provided, upload it to storage and update the document
      const storageRef = ref(storage, `Post/${EditImg.name}`);
      await uploadBytes(storageRef, EditImg);

      const imageUrl = await getDownloadURL(storageRef);

      await updateDoc(postRef, {
        name: editInput,
        img: imageUrl
      });
    } else {
      // If no new image is provided, only update the name field
      await updateDoc(postRef, {
        name: editInput
      });
    }
    setEditInput("");
    setUpdating(false);
    document.getElementById(`overlay-${id}`).style.display = 'none';
  }

  // Comment Section ---------------------------------

  const Heart = async id => {
    const element = document.getElementById(`myheart-${id}`)

    if (element.style.color === 'white') {
      element.style.color = '#FF0040'
    } else {
      element.style.color = 'white'
    }
  }

  function comment(id) {
    const element = document.getElementById(`comment-${id}`)

    if (element.style.display === 'none') {
      element.style.display = 'flex'
    } else {
      element.style.display = 'none'
    }
  }

  const seeComment = (id) =>{
  
      const x = document.getElementById(`seeCom-${id}`)

      if (x.style.display === 'none') {
        x.style.display = 'flex'
      } else {
        x.style.display = 'none'
      }
  
    }

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

  const userComment = newComment.map((item) => {

    return (
      <div className='userComment-div'  id={`seeCom-${item.id}`} key={item.id}>
        <div className='comment-div'>
          <img src={item.photoURL} className="comment-img" alt="" />
          <span className='comment-name ms-2'>{item.displayName}</span>
          <div className='close-btn-comment'>
            <IoMdClose style={{ cursor: "pointer" }} onClick={() => deleteComment(item.id)} />
          </div>
        </div>
        <div className="comments">{item.comment}</div>
      </div>
    )
  });

  const handleKey = (e, id) => {
    if (e.key === "Enter") {
      HandleComment(id);
    }
  };

  return (
    <>
      <div className='div-center'>
        <div className='Feed-Card-Container' id={post.id}>
          <div className='Feed-card-div' id='d'>
            <div className='Feed-Section-One'>
              <img src={post.photoURL} className='Feed-Profile-img' alt='' />
              <div className='Feed-Profile-name'>{post.displayName}</div>

              <div
                className='timeago ms-3'
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}
              >

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
                        onChange={e => setEditInput(e.target.value)}
                        value={editInput}
                        id={`editInput-${post.id}`}
                      />
                    </div>


                    <div className='thurd-section-edit'>
                      <label htmlFor="EditImg">
                        <img className="postImg" src={EditImg ? URL.createObjectURL(EditImg) : "item.img"} alt="" />

                        <div className='overlay-set-photos'>
                          <img className='photo-img me-2' style={{ width: "25px" }} src={photo} alt="" /> Photos
                        </div>
                      </label>
                    </div>


                    <div className='forth-section-edit'>
                      <button
                        className='btn btn-success btn-sm w-25'
                        onClick={() => done(post.id)}
                      >
                        Update
                      </button>
                    </div>


                    <input type="file" id='EditImg'
                      onChange={(e) => setEditImg(e.target.files[0])}
                      style={{ display: "none" }} />

                  </div>
                </div>

              </div>

              <div className='Feed-Post-Text'>{post.name}</div>

              <div className='Feed-Post-img-Container mt-3'>
                <img className='Feed-Post-img' src={post.img} alt='' />
              </div>
            </div>


            <div className='Feed-Section-three'>
              <div className='Feed-Comment-Section-div'>
                <BsFillHeartFill
                  id={`myheart-${post.id}`}
                  className='react-icons'
                  style={{ color: 'white', cursor: 'pointer' }}
                  onClick={() => Heart(post.id)}
                />
              </div>

              <div className='Feed-Comment-Section-div'>
                <FaCommentDots
                  onClick={() => comment(post.id)}
                  style={{ cursor: 'pointer' }}
                  className='react-icons'
                />
              </div>

              <div className='Feed-Comment-Section-div'>
                <IoMdShareAlt
                  style={{ cursor: 'pointer' }}
                  className='react-icons'
                />
              </div>
            </div>

            <div
              className='Feed-Comment-Div'
              id={`comment-${post.id}`}
              style={{ display: 'none' }}
            >

              <input
                type='text'
                placeholder='add a comment'
                className='Feed-Comment-Input'
                value={getComment} onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKey}
              />

              <span
                style={{
                  margin: '0 0.5rem',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                😃
              </span>
              <IoMdSend type='submit' style={{ fontSize: '20px', cursor: 'pointer' }}
                onClick={(e) => HandleComment(e, post.id)}
              />
              <div className='see-com' onClick={()=>seeComment(post.id)}>see com..</div>
            </div>
            {userComment}
          </div>
        </div>
      </div>
    </>
  )
}

export default Feed

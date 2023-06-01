import "./Photos.scss";
import "./PhotoTwo.scss";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { render } from "@testing-library/react";
import { AuthContext } from "../../../../AuthContaxt";
import { CgClose } from "react-icons/cg"
import { BsThreeDotsVertical } from "react-icons/bs"
import { saveAs } from "file-saver";
import { param } from "jquery";

const ParamPhotos = ({ Param }) => {

  const [userPhoto, setUserPhoto] = useState([]);
  const { currentuser } = useContext(AuthContext);

  // Video player ================

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef([]);

  // const handleVideoBtnClick = (id) => {
  //   const video = videoRef.current;
  //   if (video.paused) {
  //     video.play();
  //     setIsPlaying(true);
  //   } else {
  //     video.pause();
  //     setIsPlaying(false);
  //   }
  // };
  // Video player End ==========
  const handleVideoBtnClick = (id) => {
    const video = videoRef.current[id];
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // UseEffects =================

  useEffect(() => {
    const colRef = collection(db, 'UserPostPhoto');
    const q = query(colRef, orderBy('bytime', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
        return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
      });

      setUserPhoto(fetchedPosts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // UseEffect End ==============

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const isImage = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const extension = getFileExtension(filename);
    return imageExtensions.includes(extension);
  };

  const isVideo = (filename) => {
    const videoExtensions = ['mp4'];
    const extension = getFileExtension(filename);
    return videoExtensions.includes(extension);
  };

  const deletePhoto = async (selectedId) => {
    const colRef = doc(db, 'UserPostPhoto', selectedId)
    deleteDoc(colRef)
    off();
  };

  // Data Fetching =====================

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [isOpen, setIsOpen] = useState({});


  const dropdownRef = useRef(null);

  const toggleDropdown = (id) => {
    setIsOpen(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };


  const Download = (imageUrl, imageName) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = imageName;
    downloadLink.click();
  }

  const newData = userPhoto.map((post) => {

    if (post.uid === Param.uid) {

      return (
        <>
          {post.img && isImage(post.name) && (
            <div className="Background-Photo-div "
              style={{ backgroundImage: `url(${post.img})` }}>


              <div className="photo-option-btn-div" onClick={() => toggleDropdown(post.id)} >
                <BsThreeDotsVertical style={{ fontSize: "20px" }} />
              </div>


              <div className="option-mainu-container">
                {isOpen[post.id] ? (<>
                  <div className="option-mainu">

                    <span className="photo-option-item"
                      onClick={() => {
                        setSelectedPhoto(post.img); setSelectedId(post.id); on();
                      }}>
                      <i class="bi bi-fullscreen"></i>
                    </span>

                    <span className="photo-option-item">
                      <i class="bi bi-download" onClick={() => Download(post.img, post.name)}></i>
                    </span>

                    <span className="photo-option-item" onClick={() => deletePhoto(post.id)}>
                      <i class="bi bi-trash-fill"></i>
                    </span>
                  </div>

                </>) : ''}
              </div>

            </div >
          )
          }
        </>
      );
    }
  });

  function on() {
    document.getElementById("PhotOverlay").style.display = "block";
  }

  function off(id) {
    setIsOpen(
      prevState => ({
        ...prevState,
        [id]: !prevState[id]
      })
    )
    setSelectedPhoto(null);
    document.getElementById("PhotOverlay").style.display = "none";
  }


  const VideoData = userPhoto.map((post) => {
    if (post.uid === Param.uid) {
      return (
        <>
          {post.img && isVideo(post.name) && (
            <div class="video-background">
              <div className="video-option">

                <div className="photo-option-btn-div" onClick={() => toggleDropdown(post.id)} >
                  <BsThreeDotsVertical style={{ fontSize: "20px" }} />
                </div>

                <div className="option-mainu-container">
                  {isOpen[post.id] ? (<>
                    <div className="option-mainu">

                      <span className="photo-option-item"
                        onClick={() => {
                          setSelectedPhoto(post.img); setSelectedId(post.id); on();
                        }}>
                        <i class="bi bi-fullscreen"></i>
                      </span>

                      <span className="photo-option-item">
                        <i class="bi bi-download" onClick={() => Download(post.img, post.name)}></i>
                      </span>

                      <span className="photo-option-item" onClick={() => deletePhoto(post.id)}>
                        <i class="bi bi-trash-fill"></i>
                      </span>
                    </div>

                  </>) : ''}
                </div>

              </div>
              <video ref={(el) => (videoRef.current[post.id] = el)} onClick={() => handleVideoBtnClick(post.id)} autoplay >
                <source src={post.img} type="video/mp4" />
              </video>
            </div>
          )}
        </>
      )
    }
  });

  // const Demo = userPhoto.map((item) => {

  //   if (item.uid === Param.uid) {
  //     return (
  //       <>
  //         <h5>{item.uid}</h5>
  //       </>
  //     )
  //   }

  // })

  // -------------------------------------------

  return (
    <>



      {/* {Demo} */}


      <div id="PhotOverlay">

        <div id="Photo-text">

          <div className="photo-inner-div">
            <div className="photo-close">

              <div className="Photo-btn-one">
                <CgClose className="photo-close-btn" onClick={() => off(selectedId)} />
              </div>

            </div>
            <img src={selectedPhoto} className="overlay-photo" alt="Selected" />
          </div>
        </div>
      </div>

      {/* Video Ovarlay ========== */}

      <div id="PhotOverlay">

        <div id="Photo-text">

          <div className="photo-inner-div">
            <div className="photo-close">

              <div className="Photo-btn-one">
                <CgClose className="photo-close-btn" onClick={() => off(selectedId)} />
              </div>

            </div>
            <img src={selectedPhoto} className="overlay-photo" alt="Selected" />
          </div>
        </div>
      </div>

      {/* ======= */}
      <div className="mb-4 grid-center">
        <div className="grad-width" >
          <div className="grid-container" >
            {newData}
          </div>
        </div>
      </div>


      {/* <hr className="video-hr" /> */}
      <div className="div">
        <div className="Photo-video-container">
          <span className="Vdieo-text">Video</span>
        </div>
      </div>
      {/*  */}
      <div className="grad-width" >
        <div className="grid-center" >
          <div className="video-container-div">
            {VideoData}
          </div>
        </div>
      </div>

    </>
  );
};

export default ParamPhotos;

{/* <div className="centerr">
<div className="photo-div-bg">
  <div className="photo-grid">

    <div className="photo-div-inner">
      <img
        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1542451313056-b7c8e626645f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1521109464564-2fa2faa95858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1543425389-f01c86221d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=486&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1498263382026-c65d01dad017?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

    <div className="photo-div-inner">
      <img
        src="https://images.unsplash.com/photo-1543443436-bc6deeff2eb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
        className=" photo-img "
        alt="Boat on Calm Water"
      />
    </div>

  </div>
</div>
</div> */}
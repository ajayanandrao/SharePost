import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import "./Photos.scss";
import "./PhotoTwo.scss";
import { db } from "../../../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { render } from "@testing-library/react";
import PhotoTwo from "./PhotoTwo";
import { AuthContext } from "../../../../AuthContaxt";
import { CgClose } from "react-icons/cg"
import { BsThreeDotsVertical } from "react-icons/bs"
import { saveAs } from "file-saver";


const Photos = () => {

  const [userPhoto, setUserPhoto] = useState([]);
  const { currentuser } = useContext(AuthContext);

  // Video player ================

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef([]);


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
    if (post.uid === currentuser.uid) {

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
    if (post.uid === currentuser.uid) {
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



  return (
    <>

      <div id="PhotOverlay">
        <div id="Photo-text">

          <img onClick={() => off(selectedId)} src={selectedPhoto} className="overlay-photo" alt="Selected" />

        </div>
      </div>

      {/*  */}

      <div className="photo-container-height">
        <div class="grid-parent-container">
          <div className="grid-container" >
            {newData}
          </div>
        </div>

        <div className="video-text"><h3> Video </h3></div>

        <div class="grid-parent-container">
          <div className="video-container-div">
            {VideoData}
          </div>
        </div>

      </div>

    </>
  );
};

export default Photos;

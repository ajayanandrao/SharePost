import React, { useEffect, useRef, useState } from 'react';
import "./PhotoTwo.scss";

const PhotoTwo = ({ post }) => {

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

    return (
        <>

            {/* <div className="photo-grid-container">
                {post.img && isImage(post.name) && (
                    <img width="300px" src={post.img} className="grid-photo" alt="Uploaded" />
                )}
            </div> */}


            {post.img && isImage(post.name) && (
                <img width="300px" src={post.img} className="grid-photo" alt="Uploaded" />
            )}

            {post.img && isVideo(post.name) && (
                <div className="video-container">
                    <video ref={videoRef} className="video" onClick={handleVideoBtnClick}>
                        <source src={post.img} type="video/mp4" />
                    </video>

                    {!isPlaying && (
                        <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                            <div className="play-button">
                                <i className="fas fa-play"></i>
                            </div>
                        </a>
                    )}
                </div>
            )}

            {/* {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
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
                        </a>
                    )}
                </div>
            ) : null} */}

        </>
    )
}

export default PhotoTwo

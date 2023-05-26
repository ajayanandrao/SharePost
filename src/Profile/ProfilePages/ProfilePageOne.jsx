import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthContaxt';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { BsFillCameraFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { LinearProgress } from '@mui/material';
import { db, storage } from './../../firebase';
import "./ProfilePageOne.scss";

const ProfilePageOne = () => {

    const { currentuser } = useContext(AuthContext);

    const [img, setImg] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const profileDataRef = doc(db, "UpdateProfile", currentuser?.uid ?? "default");

    const handleUpload = () => {
        setLoading(true);
        const imageRef = ref(storage, `images/${img.name}`);
        uploadBytes(imageRef, img)
            .then((snapshot) => {
                console.log("Uploaded image successfully");
                getDownloadURL(imageRef).then((url) => {
                    setImageUrl(url);
                    setDoc(profileDataRef, { 
                        CoverPhoto: url 
                    }, 
                    { merge: true })
                        .then(() => {
                            console.log("Image URL added to Firestore");
                            setLoading(false);
                            off();
                        })
                        .catch((error) => {
                            console.error("Error adding image URL to Firestore:", error);
                            setLoading(false);
                        });
                });
            })
            .catch((error) => {
                console.error("Error uploading image", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            const docRef = doc(db, "UpdateProfile", currentuser?.uid ?? "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setImageUrl(data.imageUrl);
            }
        };
        fetchProfileData();
    }, [currentuser?.uid]);


    function on() {
        document.getElementById("overlay").style.display = "block";
    }

    function off() {
        document.getElementById("overlay").style.display = "none";
    }

    return (
        <>
            {loading && <div className='progress-cover'><LinearProgress /></div>}
            <div className="img" style={{ backgroundImage: `url(${imageUrl ? imageUrl : 'https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80'})` }}>
                <div id="overlay">

                    <div className="center">
                        <div className='center-card'>
                            <div className='center-card-close'>
                                <IoIosCloseCircle style={{ fontSize: "25px", cursor: "pointer" }} onClick={off} />
                            </div>

                            <label htmlFor="cover-img">
                                <img className='overlay-cover-img' src={img ? URL.createObjectURL(img) : (imageUrl ? imageUrl : 'https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80    ')} alt="" />
                            </label>

                            <input type="file" id='cover-img' onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />

                            <div className='my-3'>
                                <button className='btn btn-primary ms-4' onClick={handleUpload}>update</button>
                            </div>

                        </div>

                    </div>
                </div>
                <div className='img-inner'>
                    <div className='img-inner-div' onClick={on}>
                        <BsFillCameraFill className='cover-camera' />
                        <span className='edit-cover-photo me-2'>Edit Cover Photo</span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ProfilePageOne

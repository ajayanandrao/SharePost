import React, { useContext, useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';
import { AuthContext } from '../../AuthContaxt';
import "./ProfilePageTwo.scss";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { CircularProgress, LinearProgress, TextField } from '@mui/material';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { BsFillCameraFill } from 'react-icons/bs';
import { HiPencil } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';

const ProfilePageTwo = () => {

    const { currentuser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [profilePhoto, setProfilePhoto] = useState(null);

    const fileInput = useRef(null);

    const profileDataRef = doc(db, "UpdateProfile", currentuser?.uid ?? 'default');

    const handleUpload = async (file) => {
        setLoading(true);

        try {
            // Create a Firebase Storage reference to the NewProfilePhotos folder with a unique name
            const timestamp = new Date().getTime();
            const storageRef = ref(storage, `NewProfilePhotos/${timestamp}-${file.name}`);

            // Upload the selected image file to Firebase Storage
            await uploadBytes(storageRef, file);

            // Get download URL for uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            // Update user profile with new photoURL
            await updateProfile(auth.currentUser, { photoURL: downloadURL });

            await setDoc(profileDataRef, {
                userPhoto: downloadURL,
            }, { merge: true });

            console.log('Profile photo updated successfully!');
        } catch (error) {
            console.error('Error updating profile photo:', error);
        }

        setLoading(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProfilePhoto(file);
        handleUpload(file);
    };

    // =================================================================

    function on() {
        document.getElementById("UserNameUpdate").style.display = "block";
    }

    function off() {
        document.getElementById("UserNameUpdate").style.display = "none";
    }

    const [newName, setNewName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [uname, setUname] = useState('');

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    }

    useEffect(() => {
        if (currentuser) {
            const userDocRef = doc(db, 'users', currentuser.uid);

            // Listen for changes to the user's document in Firestore
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const { displayName } = doc.data();
                    setDisplayName(displayName);
                }
            });

            // Listen for changes to the user's display name in Firebase Auth
            const authUnsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setDisplayName(user.displayName);
                }
            });

            return () => {
                unsubscribe();
                authUnsubscribe();
            };
        }
    }, [currentuser]);




    const handleNameSubmit = async () => {
        if (!newName) {
            return;
        }

        try {
            await setDoc(profileDataRef, {
                name: newName,
            }, { merge: true });
            console.log("Profile data updated successfully!");
        } catch (error) {
            console.error("Error updating profile data:", error);
        }

        try {
            await updateProfile(currentuser, {
                displayName: newName
            });
            console.log('Name updated successfully!');
            setUname(newName);
        } catch (error) {
            console.error('Error updating name:', error);
        }
        setNewName("");
        off();
    }

    return (
        <>
            <div className='profile-user-div'>

                <div className="profile-user-container">

                    <div className="profile-user-img-container">
                       
                        <label htmlFor="profile-img">
                            <div style={{ backgroundImage: `url(${currentuser && currentuser.photoURL})` }} className="profile-user-img">
                                <div className='profile-img-select-div btn' >
                                    {loading ? (<CircularProgress style={{ fontSize: "20px" }} />) : (<BsFillCameraFill className='profile-img-camera' />)}
                                </div>
                            </div>
                        </label>

                    </div>
                    
                    <div className='profile-name-div'>
                        <h2 className='profile-user-name'>{currentuser && currentuser.displayName}</h2>

                        <div className='profile-pen-div btn' onClick={on}>
                            <HiPencil className='profile-pen' />
                        </div>
                    </div>

                </div>

            </div>

            <input type="button" id='profile-img' value="Select Image" style={{ display: "none" }} onClick={() => fileInput.current.click()} />
            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />


            {/* User Name Section --------------------- */}

            <div id="UserNameUpdate">
                <div className='overlay-center'>
                    <div className='overlay-card'>

                        <div className='btn-colse-div'>
                            <div className='btn close-btn' onClick={off}>
                                <IoMdClose fontSize={"18px"} />
                            </div>
                        </div>

                        <div className='card-inner-div'>
                            <img src={currentuser && currentuser.photoURL} className='card-inner-img' alt="" />
                            <h4 className='current-username'>{currentuser && currentuser.displayName}</h4>
                            <div className='px-2'>
                                <input type='text' placeholder='New userName' className='form-control new-input' value={newName} onChange={handleNameChange} />
                                <button className='btn mt-3 btn-sm btn-primary' onClick={handleNameSubmit}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default ProfilePageTwo

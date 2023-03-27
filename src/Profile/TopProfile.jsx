import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { v4, uuidv4 } from "uuid";
import { AuthContext } from '../AuthContaxt';
import { auth, db, storage } from '../firebase';
import "./TopProfile.scss";

const TopProfile = () => {
  const { currentuser } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newimageUrl, setImageUrl] = useState(null);
  // const updateProfileData = async () => {
  //   const userRef = doc(db, 'users', currentuser.uid);
  //   const data = {
  //     PhotoUrl: null, // Set to null initially to avoid deleting the existing data in the document 
  //   };
  //   if (newImgUpdate) {
  //     const storageRef = ref(storage, `userPhotos/${currentuser.uid}`);
  //     await uploadBytes(storageRef, newImgUpdate);
  //     const url = await getDownloadURL(storageRef);
  //     data.PhotoUrl = url;
  //   }
  //   await setDoc(userRef, data, { merge: true });
  //   console.log('Profile image updated successfully!');
  // };


  // const handleImageUpdate = async () => {
  //   if(img){
  //     const storageRef = ref(storage, "userPhotos/" + v4());
  //     const uploadTask = uploadBytesResumable(storageRef, img)
  //     uploadTask.on(
  //       ()=>{

  //       },()=>{
  //         getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL)=>{
  //         await updateProfile(currentuser && currentuser, {
  //             photoURL: downloadURL
  //           });
  //           await setDoc(doc(db, "users", currentuser && currentuser.uid),(db, "AllPost", currentuser && currentuser.uid), {
  //             uid: currentuser && currentuser.uid,
  //             photoURL: downloadURL
  //           })
  //         });
  //       }
  //     )


  //   }else{

  //   }
  // };

  const handleImageUpdate = async () => {
    if (img) {
      const storageRef = ref(storage, "userPhotos/" + v4());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // you can use this function to monitor the upload progress
          // if you want to show a progress bar or similar UI
        },
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const uid = currentuser && currentuser.uid;
          await updateProfile(currentuser, { photoURL: downloadURL });
          await setDoc(
            doc(db, "users", uid),
            { photoURL: downloadURL },
            { merge: true }
          );
        }
      );
    } else {
      // handle case where there is no image
    }
  };




  return (
    <>
      <div className="TopProfile-bg">
        <div className='TopProfile-absolut'>
          <div className="TopProfile-Profile-div">
            <img className='TopProfile-img' src={currentuser && currentuser.photoURL} alt="" />
            <div className="TopProfile-name">
              <h4 className='ms-3'>{currentuser && currentuser.displayName}</h4>
            </div>
          </div>
          <input type="file" onChange={(e) => setImg(e.target.files[0])} />
          <div className="btn btn-primary" onClick={handleImageUpdate}>ok</div>
        </div>
        {loading && "loading...."}
      </div>
    </>
  )
}

export default TopProfile

import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { v4, uuidv4 } from "uuid";
import { AuthContext } from '../AuthContaxt';
import { auth, db, storage } from '../firebase';
import "./TopProfile.scss";
import { motion } from 'framer-motion';

const TopProfile = () => {
  const { currentuser } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newimageUrl, setImageUrl] = useState(null);

// console.log(currentuser.displayName)

  const updateDisplayName = async () => {
    try {
      await updateProfile(auth.currentUser, {
        name: "Pooja"
      });
      console.log("Display name updated successfully!");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  }


  return (
    <>
      <div className="TopProfile-bg">
        <motion.div
          transition={{ duration: 1.5 }}
          initial={{ height: 100, }}
          animate={{ height: 230, }}
          className='TopProfile-absolut'>
          <motion.div
            transition={{ duration: 1.5, delay: 0.7 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, }}
            className="TopProfile-Profile-div">
            
            <img className='TopProfile-img' src={currentuser && currentuser.photoURL} alt="" />

            <div className="TopProfile-name">
              <h4 className='ms-3'>{currentuser && currentuser.displayName}</h4>
            </div>
          </motion.div>

    {/* <button onClick={()=>updateDisplayName()} className='btn btn-info'>add</button> */}

        </motion.div>
        {loading && "loading...."}
      </div>
    </>
  )
}

export default TopProfile

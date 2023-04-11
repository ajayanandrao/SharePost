import React, { useContext, useState } from 'react'
import "./Work.scss";
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { updateProfile as updateFirebaseProfile, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { AuthContext } from '../AuthContaxt';
import { uuid } from 'uuidv4';

const Work = () => {
    const colRef = collection(db, "users");
    const [input, setInput] = useState("");
    const [img, setImg] = useState(null);
    const [imgUrl, setImgurl] = useState(null);

    const { currentuser } = useContext(AuthContext);
    const updateProfileFunc = async () => {
        if (img) {
            const storageRef = ref(storage, "userPhotos/" + currentuser.uid)
            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on("state_changed", null, null, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                    setImgurl(downloadURL);
                    await updateProfile(currentuser, {
                        displayName: input,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "users", currentuser.uid), {
                        uid: currentuser.uid,
                        photoURL: downloadURL,
                        displayName: input,
                    })
                });
            })
        } else {
            await updateProfile(currentuser, {
                displayName: input,
            });
            await setDoc(doc(db, "users", currentuser.uid), {
                uid: currentuser.uid,
                displayName: input,
            })
        }
        // Reset input and image states
        setInput("");
        setImg(null);
    };




    return (
        <>
            <div className='m-3 d-flex justify-content-center'>

                <input type="text" placeholder='add name' value={input} onChange={(e) => setInput(e.target.value)} />

                <input type="file" onChange={(e) => setImg(e.target.files[0])} />

                <button onClick={() => updateProfileFunc()} className='btn ms-3 btn-sm btn-info'>add</button>

            </div>
        </>
    )
}

export default Work

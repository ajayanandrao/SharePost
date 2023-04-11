import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { db, storage } from '../firebase';
import { AuthContext } from '../AuthContaxt';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { updateProfile } from 'firebase/auth';
import "./WorkTwo.scss";

import Picker from 'emoji-picker-react';




const WorkTwo = ({ style }) => {

    // const [value, setValue] = useState('');

    // const add = async () => {
    //     try {
    //         const docRef = await addDoc(collection(db, "Peoples"), {
    //             first: "Ajay",
    //         });
    //         const docSnapshot = await getDoc(docRef);
    //         console.log(docSnapshot.data().first);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // };

    // const updateData = async () => {
    //     try {
    //         const docRef = doc(db, "Peoples", "SmXmNOEJmjwDHKRAZxGK");
    //         await updateDoc(docRef, { first: value });
    //         const docSnapshot = await getDoc(docRef);
    //         console.log("Document data:", docSnapshot.data());
    //     } catch (e) {
    //         console.error("Error updating document: ", e);
    //     }
    // };

    const colRef = collection(db, "users");
    const [input, setInput] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);


    const handleUpdateProfile = async () => {
        if (img) {
            const storageRef = ref(storage, "userPhotos/" + v4());
            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on(
                "state_changed",
                () => { },
                () => { },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateDoc(doc(db, "users", "xYR6qHd80z2goeWOKzfC"), {
                        name: input,
                        PhotoUrl: downloadURL,
                    });
                }
            );
        } else {
            await updateDoc(doc(db, "users", "xYR6qHd80z2goeWOKzfC"), {
                name: input,
            });


        }

        // Reset input and image states
        setInput("");
        setImg(null);
    };



    return (
        <>


            <div className='m-3 d-flex justify-content-center'>
                <input
                    type="text"
                    placeholder='add name'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <input
                    type="file"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <button
                    onClick={handleUpdateProfile}
                    className='btn ms-3 btn-sm btn-info'
                >
                    Update
                </button>
            </div>


            {/* <div className="btn btn-info" onClick={add}>add</div>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <button onClick={updateData}>Update Data</button> */}
        </>
    )
}

export default WorkTwo

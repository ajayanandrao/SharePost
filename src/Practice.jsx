import React from 'react'
import { useState } from 'react';
import { db, storage } from './firebase';
import { Timestamp, addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContaxt';
import { v4 } from 'uuid';
import { Box, LinearProgress } from '@mui/material';


const Practice = () => {


    const { currentuser } = useContext(AuthContext);

    const [file, setFile] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // useEffect
    const [apiData, setApiData] = useState([]);
    //

    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime };
            });

            setApiData(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleUpload = async () => {

        const storageRef = ref(getStorage(), "PostVideo/" + v4());
        const uploadTask = uploadBytesResumable(storageRef, file);

        if (file || text) {
            let downloadURL = "";

            if (file) {

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                        setLoading(true);
                    },
                    (error) => {
                        console.log("Error uploading file:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            saveData(downloadURL);

                            console.log('File uploaded successfully');
                        } catch (error) {
                            console.log('Error uploading file:', error);
                        }
                    }
                );
            } else {
                saveData(downloadURL); // Pass an empty string as the downloadURL
            }
        } else {
            console.log('No file or text entered');
        }
    };

    const saveData = async (downloadURL) => {
        const colRef = collection(db, 'AllPosts');
        await addDoc(colRef, {
            name: file ? file.name : '',
            img: file ? downloadURL : '', // Only use the downloadURL if a file was uploaded
            uid: currentuser.uid,
            photoURL: currentuser.photoURL,
            displayName: currentuser.displayName,
            postText: text,
            bytime: new Date(), // Use the server timestamp here
        });

        const userPostsListRef = doc(db, 'userPostsList', currentuser.uid);
        await updateDoc(userPostsListRef, {
            messages: arrayUnion({
                id: v4(),
                uid: currentuser.uid,
                photoURL: currentuser.photoURL,
                displayName: currentuser.displayName,
                postText: text,
                img: downloadURL,
                bytime: Timestamp.now(),
            }),
        });

        setText('');
        setFile(null);
    };



    return (
        <>
            <div>
                <div className='card-container'>
                    <div className='card-div'>
                    <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                        <div>
                            <input type="text" placeholder='what on your mind' onChange={(e) => setText(e.target.value)} value={text} className='w-25 form-control mb-4' />

                            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*, video/*" />

                            <button onClick={handleUpload} className='btn btn-primary'>Upload</button>
                        </div>
                        

                    </div>
                </div>


                <div className="posts-container">
                    {apiData.map((post) => (
                        <div className="post" key={post.id}>
                            {post.postText && <h1>{post.Name}</h1>}
                            {post.postText && <h1>{post.postText}</h1>}
                            {post.img && post.name && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                                <img width={"300px"} src={post.img} alt="Uploaded" className="image" />
                            ) : post.img && post.name && post.name.includes('.mp4') ? (
                                <video controls className="video">
                                    <source src={post.img} type="video/mp4" />
                                </video>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}

export default Practice


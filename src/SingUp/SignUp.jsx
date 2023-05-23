import React, { useContext, useEffect, useState } from 'react'
import "./SingUp.scss";
import f from "./../Image/img/ff.png";
import g from "./../Image/img/gg.png";
import t from "./../Image/img/tt.png";
import i from "./../Image/img/ic.png";

import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, onSnapshot, setDoc, doc, getDoc, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { AuthContext } from '../AuthContaxt';

const SignUp = () => {

    const [img, setImg] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const colRef = collection(db, "users");

    const { currentuser } = useContext(AuthContext);

    useEffect(() => {
        const unsub = onSnapshot(colRef, (snapshot) => {
            const arry = [];
            (snapshot.forEach((doc) => arry.push({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);


    const submit = async (e) => {
        e.preventDefault();

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, "userPhotos/" + name);
            const uploadTask = uploadBytesResumable(storageRef, img);
            // ------------------

            uploadTask.on('state_changed',
                (snapshot) => {

                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // console.log('File available at', downloadURL);
                        await updateProfile(res.user, {
                            displayName: name,
                            photoURL: downloadURL,
                        }).then(() => {
                            // Profile updated!
                            // ...
                        }).catch((error) => {
                            // An error occurred
                            // ...
                        });

                        await addDoc(colRef, {
                            uid: res.user.uid,
                            name: name,
                            email: email,
                            PhotoUrl: downloadURL,
                            // bytime: serverTimestamp(),
                        });

                        setDoc(doc(db, "userPostsList", res.user.uid), { messages: [] });

                        const profileDataRef = doc(db, "UpdateProfile", res.user.uid);

                        await setDoc(profileDataRef, {
                            name: name,
                            CoverPhoto: "",
                            userPhoto: downloadURL,

                            FirstName: "",
                            LastName: "",
                            
                            Address: "",
                            // MobileNumber: "No Mobile Number to show",
                            // UserName: 'no user name to show ',
                            
                            uid: currentuser.uid,
                        });

                    });
                }
            );

        } catch (err) {
            alert(err.message);
        }

        setImg(null);
        setName("");
        setEmail("");
        setPass("");
    };

    return (
        <>
            <div className="form-width">
                <form >

                    <label htmlFor="photo" className="img-div">
                        <img className="img" src={img ? URL.createObjectURL(img) : "https://as2.ftcdn.net/v2/jpg/03/04/80/77/1000_F_304807733_8ksZjSLiXierXMxRhjvGw8BgUIDA3sm2.jpg"} alt="" />

                        <input type="file" className="photoinput" id="photo" onChange={(e) => setImg(e.target.files[0])} />
                    </label>

                    <input
                        type="text"
                        className="form-control form-control-md mt-4"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <input
                        type="email"
                        id="form2Example1"
                        className="form-control form-control-md mt-4"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />

                    <input
                        type="password"
                        id="form2Example2"
                        className="form-control form-control-md my-4"
                        placeholder="Password"
                        onChange={(e) => setPass(e.target.value)}
                        value={password}
                    />

                    <div className="row mb-2">
                        <div className="col d-flex justify-content-center">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="form2Example34"
                                />
                                <label className="form-check-label" htmlFor="form2Example34">

                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div className="col">
                            <a href="#!">Forgot password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn  btn-success w-100 my-2"
                        onClick={submit}
                    >
                        SignUp
                    </button>
                    <div className="text-center">
                        <p>
                            Have an account ? <Link to="/">Login</Link>
                        </p>
                        <p>or sign up with:</p>

                        <button type="button" className="btn btn-floating mx-3">
                            <img src={f} />
                        </button>

                        <button type="button" className="btn btn-floating mx-3">
                            <img src={g} />
                        </button>

                        <button type="button" className="btn btn-floating mx-3">
                            <img src={t} />
                        </button>

                        <button type="button" className="btn btn-floating mx-3">
                            <img src={i} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUp

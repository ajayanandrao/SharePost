import React, { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import "./EditeAbout.scss";
import { IoMdClose } from 'react-icons/io';
import { db } from '../../../../../firebase';
import { AuthContext } from '../../../../../AuthContaxt';

const EditeAbout = ({off}) => {

    const { currentuser } = useContext(AuthContext);
    const currentUser = currentuser && currentuser;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [Default_Address, setDefault_Address] = useState("");
    const [Default_Number, setDefault_Number] = useState("");

    const profileDataRef = doc(db, "UpdateProfile", currentuser?.uid ?? 'default');
    const colRef = collection(db, "UpdateProfile");

    const [api, setApiData] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(colRef, (snapshot) => {
            setApiData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);


    useEffect(() => {
        const item = api.find((item) => {
            const isCurrentUserPost = currentuser && item.name === currentUser.displayName;
            return isCurrentUserPost;
        });

        if (item) {
            setDefault_Address(item.Address);
            setDefault_Number(item.MobileNumber);
        }

        return () => {
            // Cleanup function (optional)
            // It will be called when the component is unmounted or when the dependencies change
            // You can perform any cleanup tasks here
        };
    }, [api, currentuser, currentUser?.displayName]);

    const handleSubmit = async () => {

        const defaultInput = "default input";

        const firstNameValue = firstName || defaultInput;
        const lastNameValue = lastName || defaultInput;
        const addressValue = address || Default_Address;
        const mobileNumberValue = mobileNumber || Default_Number;

        try {
            await setDoc(profileDataRef, {
                FirstName: firstNameValue,
                LastName: lastNameValue,
                Address: addressValue,
                MobileNumber: mobileNumberValue,
                UserName: firstNameValue + ' ' + lastNameValue,
                CoverPhoto: imageUrl,
                uid: currentuser.uid,
                userPhoto: currentuser.photoURL,
                name: currentuser.displayName,
            });
            console.log("Profile data updated successfully!");
        } catch (error) {
            console.error("Error updating profile data:", error);
        }

        setFirstName("");
        setLastName("");
        setAddress("");
        setMobileNumber("");
        off();
    };
    return (
        <>
            <div className='overlay-card-div'>

                <div className="overlay-close-div">
                    <div className="overlay-close-btn-div btn" onClick={off}>
                        <IoMdClose style={{ fontSize: "18px" }} />
                    </div>
                </div>
                <h5>User Details</h5>

                <div className='overlay-card-inner-div'>
                    <div className='overlay-card-div-width'>
                        <input type="text" className='form-control overlay-input ' placeholder='Fist Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input type="text" className='form-control overlay-input my-2 ' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <input type="text" className='form-control overlay-input  ' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                        <input type="text" className='form-control overlay-input my-2' placeholder='Mobile Number' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                        <button className='btn btn-primary w-100 my-3' onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditeAbout

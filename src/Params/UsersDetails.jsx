import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import "./UsersDetails.scss";
import { LinearProgress } from '@mui/material';
import { db } from '../firebase';
import UserProfileOne from './UserProfilePage/UserProfileOne';

const UsersDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'UpdateProfile', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUser({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!user) {
        return <div><LinearProgress /></div>;
    }

    return (
        <>
            <UserProfileOne Param={user}/>
        </>
    )
}

export default UsersDetails
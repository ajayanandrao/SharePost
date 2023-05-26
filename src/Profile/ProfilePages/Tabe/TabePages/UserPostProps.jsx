import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';

import UserPost from './UserPost';
import "./UserPost.scss";
import { AuthContext } from '../../../../AuthContaxt';
import { db } from '../../../../firebase';

const UserPostProps = () => {

    const [api, setApiData] = useState([]);
    const { currentuser } = useContext(AuthContext);
    const currentUser = currentuser && currentuser;

    const colRef = collection(db, 'AllPosts')
    const q = query(colRef, orderBy('bytime', 'desc'))
    const [docs, loading, error] = useCollectionData(q, orderBy('bytime', 'desc'));

    useEffect(() => {
        const unsub = onSnapshot(q, snapshot => {
            setApiData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        })
        return unsub;
    }, []);

    

    const newData = api.map((item) => {

        const isCurrentUserPost =
        currentuser && item.displayName === currentuser.displayName;
        if (isCurrentUserPost) {


            return (
                <div key={item.id}>
                    <UserPost CurrentUser={currentUser} post={item} />
                </div>
            );
        }

    });

    return (
        <div className='profile-post-height'>
            {newData}
        </div>
    )
}

export default UserPostProps

import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from './firebase';
import { Avatar } from '@mui/material';

const Work = () => {

    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
        const userRef = collection(db, 'OnlyOnline');
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            const userList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }
            ));
            setOnlineUsers(userList);
        });
        return unsubscribe;
    }, []);

    // =======


    const [list, setList] = useState([]);

    useEffect(() => {
        const AcceptedListRef = collection(db, 'A');
        const unsub = () => {
            onSnapshot(AcceptedListRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setList(newbooks);
            })
        };
        return unsub();
    }, []);

    const listItems = list.map((item) => (
        item.uid
    ));

    return (<>
        <div>
            {onlineUsers.map((item) => {
                if (item.uid === "") {
                    return (
                        <>
                            <Avatar alt="Remy Sharp" src={item.photoUrl} />
                            {item.uid}

                        </>
                    )
                }
            })}
        </div>
        <hr />
        <h3>Friends :</h3>

        {
            list.map((list) => {
                return (
                    <>
                        {
                            onlineUsers.map((item) => {
                                if (list.uid === item.uid) {
                                    return (
                                        <div key={item.uid}>
                                            <Avatar alt="Remy Sharp" src={item.photoUrl} />
                                        </div>
                                    )
                                }
                            })
                        }
                    </>
                )
            })
        }



    </>
    )
}

export default Work

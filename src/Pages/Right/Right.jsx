import React, { useContext, useEffect, useState } from 'react';
import { RxDotsVertical } from 'react-icons/rx';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { AuthContext } from '../../AuthContaxt';
import { useNavigate } from 'react-router-dom/dist';
import "./Right.scss";
import "./RightTwo.scss";
import { GoPrimitiveDot } from 'react-icons/go'
import { Avatar, nativeSelectClasses } from '@mui/material';
import "./AddFriend.scss";
import { styled, keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';
import { MdOutlineClose } from 'react-icons/md';
import FlipMove from 'react-flip-move';

const Right = () => {

    const [api, setApiData] = useState([]);
    const colRef = collection(db, 'users')
    const q = query(colRef, orderBy('bytime', 'desc'))
    const [docs, loading, error] = useCollectionData(q, orderBy('bytime', 'desc'));
    const { currentuser } = useContext(AuthContext);
    const [UserDataApi, setUserDataApi] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [addedUsers, setAddedUsers] = useState(false);



    useEffect(() => {
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setUserDataApi(newApi);
        });

        return unsubscribe;
    }, []);

    // Own Friends Online

    // 

    const handleToggleShowAll = () => {
        setShowAll((prevShowAll) => !prevShowAll);
    };

    const handleAddFriend = (id) => {
        setAddedUsers(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        console.log(id)
    };

    const navigate = useNavigate();

    const handleUserClick = (id) => {
        navigate(`/users/${id}`);
    };

    const DeleteRequest = async (id) => {
        const RequestRef = doc(db, 'friendRequests', id);
        await deleteDoc(RequestRef);
    };


    const rippleAnimation = keyframes`
    0% {
      transform: scale(0.2);
      opacity: 1;
    }
    
    100% {
      transform: scale(3);
      opacity: 0;
    }
  `;

    // Define the StyledBadge component with custom styling
    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            // border: '1px solid red',
            color: '#44b700',
            boxShadow: `0 0 0 2px `,
            width: '2px',
            height: '8px',
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '100%',
                animation: `${rippleAnimation} 1.2s infinite ease-in-out`,
                border: '1px solid currentColor',
                content: '""',
            },
        },
    }));


    const Data = UserDataApi.filter((item) => item.uid !== currentuser.uid) // exclude current user's profile
        .slice(0, showAll ? UserDataApi.length : 3)
        .map((item) => (
            <div key={item.id} className="userDiv">
                <span style={{ cursor: "pointer" }} onClick={() => handleUserClick(item.uid)}>
                    <div className="userInnerDiv">
                        <img className="userImg" src={item.PhotoUrl} alt="" />
                        <div className="userName" key={item.id}>
                            {item.name}
                        </div>
                    </div>
                </span>
                <div className="userAdd">
                    <div style={{ cursor: "pointer" }} onClick={() => handleAddFriend(item.id)}>
                        {addedUsers[item.id] ? "Remove" :
                            (<><div onClick={() => sendFriendRequest(item.uid, item.name, item.PhotoUrl)}>Add</div></>)}
                    </div>
                </div>
            </div>
        ));


    // Send Friend Request 

    function sendFriendRequest(otherUserId, otherUserName, otherUserPhotoUrl) {
        // Check if friend request already exists
        const requestExists = friendRequests.some(
            (request) =>
                (request.senderId === currentuser.uid && request.receiverId === otherUserId) ||
                (request.senderId === otherUserId && request.receiverId === currentuser.uid)
        );

        if (requestExists) {
            alert('Friend request already exists');
            return;
        }

        // Create a new friend request document in the "friendRequests" collection
        const friendRef = collection(db, 'friendRequests');
        addDoc(friendRef, {
            senderId: currentuser.uid,
            senderName: currentuser.displayName,
            senderPhotoUrl: currentuser.photoURL,

            receiverPhotoUrl: otherUserPhotoUrl,
            receiverId: otherUserId,
            receiverName: otherUserName,
            status: 'pending',
            timestamp: serverTimestamp(),
        })

            .then((docRef) => {
                console.log('Friend request sent to:', docRef.id);
                // Handle success
            })
            .catch((error) => {
                console.error('Error sending friend request:', error);
                // Handle error
            });
    }

    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {

        const colRef = collection(db, 'friendRequests')
        const userlist = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setFriendRequests(newbooks);
            })
        };
        return userlist();
    }, []);

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

    // Accept Friend Request

    const acceptFriendRequest = async (requestId) => {
        try {
            const requestRef = doc(collection(db, 'friendRequests'), requestId);

            await updateDoc(requestRef, { status: 'accepted' });
            console.log('Friend request accepted successfully!');
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };
    // =====================

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (currentuser) {

            const friendsQuery = query(collection(db, 'friendRequests'), where('status', '==', 'accepted'));
            const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
                const newFriends = snapshot.docs
                    .filter(
                        (doc) =>
                            (doc.data().senderId === currentuser.uid || doc.data().receiverId === currentuser.uid) &&
                            doc.data().status === 'accepted'
                    )
                    .map((doc) => ({ id: doc.id, ...doc.data() }));
                setFriends(newFriends);
            });

            return () => {
                unsubscribeFriends();
            };
        }
    }, [currentuser, db]);

    return (
        <>

            <div className='div-right '>
                <div className='suggest-div'>
                    Suggestions for you
                    <div className='see-all' onClick={handleToggleShowAll}>{showAll ? (<TiArrowSortedUp style={{ cursor: "pointer", fontSize: "25px" }} />) : (<TiArrowSortedDown style={{ cursor: "pointer", fontSize: "25px" }} />)}
                    </div>
                </div>

                <div className="Data-div scrollable-container">
                    {Data}
                </div>

                <div className="right-bottom-div">
                    <div className="online-titl-div">
                        <span>Online</span> <div><GoPrimitiveDot className='online-icon' /></div>
                    </div>

                    {onlineUsers.map((item) => {
                        if (item.uid !== currentuser.uid) {
                            return (
                                <div key={item.id} className="online-user-div">

                                    <span>
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'left', horizontal: 'right' }}
                                            variant="dot"
                                        >
                                            <Avatar alt="Remy Sharp" src={item.photoUrl} />
                                        </StyledBadge>

                                    </span>

                                    <span className="online-user-name">{item.presenceName}</span>
                                </div>
                            )

                        }
                    })}

                </div>


                {friendRequests.map((item) => {
                    if (item.receiverId === currentuser.uid && item.status !== 'accepted') {
                        return (
                            <div key={item.id} className='request-Container'>
                                <div className='request-profile-container'>
                                    <div>
                                        <div className='request-profile-flex'>

                                            <img src={item.senderPhotoUrl} className='request-profile-img' alt="" />

                                            <div className='request-profile-name'>
                                                {item.senderName}
                                            </div>

                                            <div className="btn-div">
                                                <div className="btn glass-success btn-sm" onClick={() =>
                                                    acceptFriendRequest(
                                                        item.id, item.senderId, item.senderName
                                                    )}> Accept </div>
                                            </div>

                                            <div className='request-close-flex'>
                                                <i style={{ cursor: "pointer" }} class="bi bi-x"
                                                    onClick={() => DeleteRequest(item.id)}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })
                }

            </div >


        </>
    )
}

export default Right

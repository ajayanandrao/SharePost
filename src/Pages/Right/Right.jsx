import React, { useContext, useEffect, useState } from 'react';
import { RxDotsVertical } from 'react-icons/rx';
<<<<<<< HEAD
import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
=======
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
>>>>>>> de4cc00f3462f5e042bd3a1556cba3692eb502a0
import { db } from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { AuthContext } from '../../AuthContaxt';
import { useNavigate } from 'react-router-dom/dist';
import "./Right.scss";
import "./RightTwo.scss";
<<<<<<< HEAD
import { GoPrimitiveDot } from 'react-icons/go'
import { Avatar } from '@mui/material';

import { styled, keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';

const Right = () => {



=======

const Right = () => {

>>>>>>> de4cc00f3462f5e042bd3a1556cba3692eb502a0
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

<<<<<<< HEAD
    const [status, setStatus] = useState([]);

    useEffect(() => {
        const userRef = collection(db, 'userPresece');
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            const userList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStatus(userList);
        });
        return unsubscribe;
    }, []);

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const userRef = collection(db, 'OnlyOnline');
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            const userList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOnlineUsers(userList);
        });
        return unsubscribe;
    }, []);


=======
>>>>>>> de4cc00f3462f5e042bd3a1556cba3692eb502a0
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

<<<<<<< HEAD
    const handleUserClick = (id) => {
        navigate(`/users/${id}`);
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
    // Define the StyledBadge component with custom styling


=======
    const handleUserClick= (id) => {
        navigate(`/users/${id}`);
    };

>>>>>>> de4cc00f3462f5e042bd3a1556cba3692eb502a0
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
                        {addedUsers[item.id] ? "Remove" : "Add"}
                    </div>
                </div>
<<<<<<< HEAD
            </div>
        ));

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

                    {/* {status.map((item) => {
                        if (item.uid !== currentuser.uid) {
                            return (
                                <div key={item.id} className="online-user-div">

                                    <span>
                                        {item.status === 'online' ? (
                                            <StyledBadge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'left', horizontal: 'right' }}
                                                variant="dot"
                                            >
                                                <Avatar alt="Remy Sharp" src={item.photoUrl} />
                                            </StyledBadge>
                                        ) : (
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={item.photoUrl}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                        )}
                                    </span>

                                    <span className="online-user-name">{item.presenceName}</span>
                                </div>
                            )

                        }
                    })} */}

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

            </div >


        </>
=======
            </div>  
        ));

    return (
        <div className='div-right'>
            <div className='suggest-div'>Suggestions for you
                <div className='see-all' onClick={handleToggleShowAll}>{showAll ? (<TiArrowSortedUp style={{ cursor: "pointer", fontSize: "25px" }} />) : (<TiArrowSortedDown style={{ cursor: "pointer", fontSize: "25px" }} />)}</div> </div>
            {Data}
        </div>
>>>>>>> de4cc00f3462f5e042bd3a1556cba3692eb502a0
    )
}

export default Right

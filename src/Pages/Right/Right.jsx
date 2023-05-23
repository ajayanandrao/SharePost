import React, { useContext, useEffect, useState } from 'react';
import { RxDotsVertical } from 'react-icons/rx';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { AuthContext } from '../../AuthContaxt';
import { useNavigate } from 'react-router-dom/dist';
import "./Right.scss";
import "./RightTwo.scss";

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

    const handleUserClick= (id) => {
        navigate(`/users/${id}`);
    };

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
            </div>  
        ));

    return (
        <div className='div-right'>
            <div className='suggest-div'>Suggestions for you
                <div className='see-all' onClick={handleToggleShowAll}>{showAll ? (<TiArrowSortedUp style={{ cursor: "pointer", fontSize: "25px" }} />) : (<TiArrowSortedDown style={{ cursor: "pointer", fontSize: "25px" }} />)}</div> </div>
            {Data}
        </div>
    )
}

export default Right

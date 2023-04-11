import React, { useEffect, useState } from 'react';
import { RxDotsVertical } from 'react-icons/rx';
import "./Suggest.scss";
import "./SuggestTwo.scss";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {TiArrowSortedDown, TiArrowSortedUp} from "react-icons/ti";


const Suggest = () => {
    const [api, setApiData] = useState([]);
    const colRef = collection(db, 'users')
    const q = query(colRef, orderBy('bytime', 'desc'))
    const [docs, loading, error] = useCollectionData(q, orderBy('bytime', 'desc'));
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const o = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setBooks(newbooks);
            })
        };
        return o();
    }, []);
    const [showAll, setShowAll] = useState(false);

    const handleToggleShowAll = () => {
        setShowAll((prevShowAll) => !prevShowAll);
    };

    const Data =
        books.slice(0, showAll ? books.length : 3).map((book) => (
            <>
                <div key={book.id} className='userDiv'>
                    <div className='userInnerDiv'>
                        <img className='userImg' src={book.PhotoUrl} alt="" />
                        <div className='userName' key={book.id}>{book.name}</div>
                    </div>
                    <div className='userAdd'><span className='addtext'> Add </span></div>
                </div>
            </>

        ));

    return (
        <>
            <div className='suggest-div'>Suggestions for you <div className='see-all' onClick={handleToggleShowAll}>{showAll ? (<TiArrowSortedUp style={{cursor:"pointer", fontSize:"25px"}}/>) : (<TiArrowSortedDown style={{cursor:"pointer", fontSize:"25px"}}/>)}</div> </div>
            {Data}
        </>
    )
}

export default Suggest;


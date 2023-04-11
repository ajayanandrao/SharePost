import React, { useContext, useEffect, useState } from 'react'
import Feed from '../Feed/Feed';
import Post from '../Post/Post';
import "./Home.scss";
import { AiOutlineArrowUp } from "react-icons/ai";
import FlipMove from 'react-flip-move';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { AuthContext } from '../AuthContaxt';
import NHome from './NHome';

const Home = () => {

  const [api, setApiData] = useState([]);
    
  const { currentuser } = useContext(AuthContext);

  const currentUser = currentuser && currentuser;

  const colRef = collection(db, 'AllPosts')
  const q = query(colRef, orderBy('bytime', 'desc'))
  const [docs, loading, error] = useCollectionData(q, orderBy('bytime', 'desc'))

  useEffect(() => {
    const unsub = onSnapshot(q, snapshot => {
        setApiData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
    return unsub;
}, []);


 const newData = api.map((item) => {
      return (
          <div key={item.id}>
            <Feed CurrentUser={currentUser} post={item}/>
          </div>
      );
  });



  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <div style={{flex:"1", paddingTop:"0.5rem"}}>

      <div className="btn" onClick={handleScrollToTop} id="scrollTopBtn" >
        <AiOutlineArrowUp className="top-arrow" />
      </div>
      <Post />
      {/* <Feed /> */}
      <FlipMove>{ newData }</FlipMove>
    </div>
  )
}

export default Home

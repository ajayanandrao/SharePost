import { onAuthStateChanged } from 'firebase/auth';
import React from 'react'
import { auth, db } from './firebase';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

const Work = () => {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in, show the home page content

            // Add event listener to the "Send Friend Request" button
            const sendRequestBtn = document.getElementById('sendRequestBtn');
            sendRequestBtn.addEventListener('click', sendFriendRequest);
        } else {
            // User is not logged in, redirect to the login page
            window.location.href = 'login.html';
        }
    });

    function sendFriendRequest() {
        const authUser = auth.currentUser;
        const senderId = authUser.uid;
        const receiverId = 'RECEIVER_USER_ID'; // Replace with the actual receiver's user ID

        const friendRequestsCollection = collection(db, 'friendRequests');

        // Create a new friend request document
        const requestDoc = doc(friendRequestsCollection);

        // Set the data for the friend request
        setDoc(requestDoc, {
            senderId: senderId,
            receiverId: receiverId,
            status: 'pending',
            timestamp: serverTimestamp()
        })
            .then(() => {
                console.log('Friend request sent successfully!');
            })
            .catch(error => {
                console.error('Error sending friend request:', error);
            });
    }

    function acceptFriendRequest(requestId, senderId, receiverId) {
        const friendRequestsCollection = collection(db, 'friendRequests');

        // Update the friend request document to set the status as 'accepted'
        updateDoc(doc(friendRequestsCollection, requestId), { status: 'accepted' })
            .then(() => {
                console.log('Friend request accepted successfully!');

                // Update the friend lists for both sender and receiver
                updateFriendList(senderId, receiverId);
                updateFriendList(receiverId, senderId);
            })
            .catch(error => {
                console.error('Error accepting friend request:', error);
            });
    }


    function updateFriendList(userId, friendId) {
        const friendsCollection = doc(db, 'friendLists', userId);

        // Add the friend ID to the user's friend list
        updateDoc(friendsCollection, {
            friends: arrayUnion(friendId)
        })
            .then(() => {
                console.log('Friend list updated successfully!');
            })
            .catch(error => {
                console.error('Error updating friend list:', error);
            });
    }


    return (
        <div>
            hello
        </div>
    )
}

export default Work

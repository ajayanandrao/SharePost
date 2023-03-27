import { collection, doc } from 'firebase/firestore';
import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from './firebase';

const FormSub = ({ path }) => {
    const parentDocRef = collection(db, path)
    const [docs, loading, error] = useCollectionData(parentDocRef);


    return (
        <>
            {loading && "Loading..."}
            {
                docs?.map((item) => {
                    return (
                        <div key={Math.random()}>
                            <h1>{doc.title}</h1>

                        </div>
                    )
                })
            }
        </>
    )
}

export default FormSub

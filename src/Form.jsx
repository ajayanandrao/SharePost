import React, { useEffect, useState } from 'react'
import {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    doc,
    setDoc,
    query,
    orderBy,
    deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import FormSub from './FormSub'

const Form = () => {
    const parentDocRef = collection(db, `oses/Windows/children`)
    const [docs, loading, error] = useCollectionData(parentDocRef)

    const deleteSubcollection = async () => {
        const subcollectionRef = collection(
            db,
            'oses/Windows/children'
        )
        const snapshot = await getDocs(subcollectionRef)
        snapshot.docs.forEach(doc => {
            deleteDoc(doc.ref)
        })
    };

    return (
        <>
            {loading && 'loading...'}
            {docs?.map(doc => {
                return (
                    <>
                        <div key={Math.random()}>

                            <li>{doc.name}</li>

                            <button
                                className='btn btn-info'
                                onClick={() => deleteSubcollection(doc.id)}
                            >
                                delete
                            </button>
                            <FormSub path={`oses/windows/children`} />
                        </div>
                        {/* <FormSub path={`oses/${item.name}/company`}/> */}
                    </>
                )
            })}
        </>
    )
}

export default Form

import React from 'react'
import Home from './Home';
import "./Wrapper.scss";
import Left from '../Pages/Left/Left';
import Center from '../Pages/Center/Center';
import Right from '../Pages/Right/Right';
import Post from '../Post/Post';
import Feed from '../Feed/Feed';

const Wrapper = () => {
    return (
        <>
            <div className='Wrapper-container'>
                    <Left/>
                    <Center />
                    <Right/>
            </div>
        </>
    )
}

export default Wrapper

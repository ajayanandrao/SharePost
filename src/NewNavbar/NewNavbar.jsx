import React, { useContext } from 'react'
import "./NewNavbar.scss";
import { AiFillHeart, AiFillHome } from "react-icons/ai"
import { AuthContext } from '../AuthContaxt';
import { RiSearchLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const NewNavbar = () => {

    const { currentuser } = useContext(AuthContext);

    return (
        <>

            <div class="navbarTop">
                <div className='navbarTop-title-container'>
                    <a > <Link className='link ajay' to="/" > Ajay </Link></a>
                </div>
                <div className="navbarTop-search-container">
                    <div className='navbarTop-search-div'>
                        <input type="text" placeholder='search' />
                        <a >
                            <RiSearchLine className='navbarTop-search-icon' />
                        </a>
                    </div>
                </div>
            </div>

            {/*  */}

            <div class="navbar-bottom">
                <a >
                    <Link className='link' to="home/">
                        <AiFillHome className='navbar-bottom-icon' />
                    </Link>
                </a>
                <a ><AiFillHeart className='navbar-bottom-icon' /> </a>
                <a>
                    <i class="bi bi-messenger navbar-bottom-bi">
                    </i>
                </a>
                <a>
                    <Link to="/profile">
                        <img className='navbar-bottom-img' src={currentuser && currentuser.photoURL} alt="" />
                    </Link>
                </a>

            </div>

        </>
    )
}

export default NewNavbar

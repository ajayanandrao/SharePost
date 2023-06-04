import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

import "./Work.scss";

const Work = () => {

    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [navbarWidth, setNavbarWidth] = useState(0);

    useEffect(() => {
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setNavbarWidth(document.getElementById("sidenavbar").offsetWidth);
    };

    const handleTouchMove = (e) => {
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        const deltaX = currentX - startX;
        const threshold = 50; // Minimum distance to trigger open/close action

        if (deltaX > threshold) {
            // Swipe right, open navbar
            openNav();
        } else if (deltaX < -threshold) {
            // Swipe left, close navbar
            closeNav();
        }

        setCurrentX(0);
    };

    const openNav = () => {
        document.getElementById("sidenavbar").style.width = "250px";
    };

    const closeNav = () => {
        document.getElementById("sidenavbar").style.width = "0";
    };
    return (<>

        <button onClick={openNav} className='btn btn-sm btn-primary'>Open</button>
        <div id="sidenavbar" className="sidenavDemo">
            <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Clients</a>
            <a href="#">Contact</a>
        </div>

    </>
    )
}

export default Work

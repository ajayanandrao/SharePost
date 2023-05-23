import React from 'react';
import "./Facebook.scss";
import { RiHandbagFill } from 'react-icons/ri';
import { BsArrowRepeat, BsChatFill, BsFillHeartFill } from 'react-icons/bs';

const Facebook = ({post}) => {
    return (
        <>
            <div className="facebook-feed-container">
                <div className="facebook-feed-header">
                    <RiHandbagFill className="facebook-feed-header-icon" />
                    <div className="facebook-feed-header-title">Facebook Feed</div>
                </div>
                <div className="facebook-feed-post">
                    <div className="facebook-feed-post-content">
                        <div className="facebook-feed-post-content-text">
                            This is a sample Facebook post content.
                            <img src={post.photoURL} alt="" />
                        </div>
                    </div>
                    <div className="facebook-feed-post-icons">
                        <div className="facebook-feed-post-likes">
                            <BsFillHeartFill className="facebook-feed-post-likes-icon" />
                            <div className="facebook-feed-post-likes-count">10 Likes</div>
                        </div>
                        <div className="facebook-feed-post-comments">
                            <BsChatFill className="facebook-feed-post-comments-icon" />
                            <div className="facebook-feed-post-comments-count">5 Comments</div>
                        </div>
                        <div className="facebook-feed-post-share">
                            <BsArrowRepeat className="facebook-feed-post-share-icon" />
                            <div className="facebook-feed-post-share-count">2 Shares</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Facebook

import React, { useState } from 'react';
import { RxDotsVertical } from 'react-icons/rx';
import "./OverlayEdit.scss";
import j from "./../../api.json";

const OverlayEdit = () => {
    const [emoji, setEmoji] = useState();

    const handleEmoji = (selectedEmoji) => {
        setEmoji((prevEmoji) => prevEmoji ? `${prevEmoji} ${selectedEmoji}` : selectedEmoji);
        document.getElementById("emoji-input").value += ` ${selectedEmoji}`;
      };
    

    return (
        <>
            <input type="text" id="emoji-input" onChange={(e) => setEmoji(e.target.value)} />
            <button onClick={() => handleEmoji("😀")}>😀</button>
            <button onClick={() => handleEmoji("😂")}>😂</button>
            <button onClick={() => handleEmoji("❤️")}>❤️</button>
        </>
    )
}

export default OverlayEdit;

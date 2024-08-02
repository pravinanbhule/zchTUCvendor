import { useEffect, useState } from "react";
import './style.css';
const Lobby = ({ joinRoom }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    joinRoom();
  };

  return (
    <div>
      <form id="chatform" onSubmit={handleSubmit}>
        <div className="chat-icon" onClick={handleSubmit}>
          Chat
        </div>
      </form>
    </div>
  );
};

export default Lobby;

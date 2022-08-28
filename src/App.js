import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import "./App.css";



function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [currRoom, setCurrRoom] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);

  /** Keep socket inside useEffect to prevent multiple rerenders of the socket */
  useEffect(() => {
    if (socket === null) {
      setSocket(io("http://localhost:3001"));
    } else {
      socket.on("connect", () => {
        setMessages(prev => [...prev, "You are connected."]);
      });
      socket.on("receive-message", message => {
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket]);

  // Handle Change Functions //

  /** Given an input value, change username's state. */
  function handleUsernameChange(evt) {
    const { value } = evt.target;
    setUsername(value);
  }

  /** Given an input value, change messages's state. */
  function handleMessageChange(evt) {
    const { value } = evt.target;
    setMessage(value);
  }

  /** Given an input value, change room's state. */
  function handleRoomChange(evt) {
    const { value } = evt.target;
    setRoom(value);
  }

  // Handle Submit Functions //

  /** If username is not an empty string, setLogged in to true.
   *
   *  Console the error.
  */
  function handleUsernameSubmit() {
    if (username) {
      setLoggedIn(true);
    } else {
      console.error("Please add a username");
    }
  }

  /** If room is not an empty string, setCurrRoom to room and emit it to the socket.
   *
   *  Console the error.
   */
  function handleJoinRoomSubmit() {
    if (room) {
      socket.emit("join-room", username, room);
      setLoggedIn(true);
      setCurrRoom(room);
      setRoom("");
    } else {
      console.error("Enter a room name");
    }
  }
  /** If message is not an empty string, add it to messages and emit it to the socket.
   *
   *  Console the error.
   */
  function handleMessageSubmit() {
    if (message) {
      setMessages(prev => [...prev, `${username}: ${message}`]);
      socket.emit("send-message", username, message, currRoom);
      setMessage("");
    } else {
      console.error("Enter a message");
    }
  }

  /** If currently in a room, leave it. */
  function handleLeaveRoomSubmit() {
    if (currRoom) {
      socket.emit("leave-room", username, currRoom);
      setCurrRoom(room);
    } else {
      console.error("Currently not in a room");
    }
  }

  return (
    <div className="container">
      <h1>Welcome to the chat!</h1>
      {loggedIn === false
        ?
        <div>
          <label htmlFor="enter-username">Enter a username: </label>
          <input type="text" name="enter-username" onChange={handleUsernameChange} placeholder="Enter a username" />
          <button name="enter-username" onClick={handleUsernameSubmit}>Enter Username</button>
        </div>
        :
        <div className="messages-container">
          <div className="messages">
            {messages.map((message, idx) => (
              <p key={idx}>{message}</p>
            ))}
          </div>
          <div>
            <label htmlFor="send-message">Message:
              <input type="text" name="send-message" value={message} onChange={handleMessageChange} placeholder="Enter a message"
              />
              <button name="send-message" onClick={handleMessageSubmit}>Send Message</button>
            </label>
          </div>
          <div>
            <label htmlFor="join-room">Room:
              <input type="text" name="join-room" value={room} onChange={handleRoomChange} placeholder="Enter a room" />
              <button name="join-room" onClick={handleJoinRoomSubmit}>Join Room</button>
              <button name="leave-room" onClick={handleLeaveRoomSubmit}>Leave Room</button>
            </label>
          </div>
        </div>}
    </div>
  );
}

export default App;

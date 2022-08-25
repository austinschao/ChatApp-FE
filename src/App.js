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

  useEffect(() => {
    if (socket === null) {
      setSocket(io("http://localhost:3001"));
    } else {
      socket.on("connect", () => {
        setMessages(prev => [...prev, "You are connected."]);
        console.log("i connected many times");
      });

      socket.on("receive-message", message => {
        console.log("i went here bruh");
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket]);


  function handleChange(evt) {
    const { name, value } = evt.target;
    if (name === "enter-username") {
      setUsername(value);
    }
    if (name === "send-message") {
      setMessage(value);
    }
    if (name === "join-room") {
      setRoom(value);
    }
  }

  function handleSubmit(evt) {
    const { name } = evt.target;
    if (name === "enter-username") {
      setLoggedIn(true);
    }
    if (name === "send-message") {
      setMessages(prev => [...prev, `${username}: ${message}`]);
      socket.emit("send-message", username, message, currRoom);
    }
    if (name === "join-room") {
      socket.emit("join-room", username, room);
      setLoggedIn(true);
      setCurrRoom(room);
      setRoom("");
    }
    if (name === "leave-room") {
      socket.emit("leave-room", username, currRoom);
      setCurrRoom(room);
    }
  }



  return (
    <div className="container">
      <h1>Welcome to the chat!</h1>
      {loggedIn === false
        ?
        <div>
          <label htmlFor="enter-username">Enter a username: </label>
          <input type="text" name="enter-username" onChange={handleChange} />
          <button name="enter-username" onClick={handleSubmit}>Enter Username</button>
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
              <input type="text" name="send-message" value={message} onChange={handleChange}
              />
              <button name="send-message" onClick={handleSubmit}>Send Message</button>
            </label>
          </div>
          <div>
            <label htmlFor="join-room">Room:
              <input type="text" name="join-room" value={room} onChange={handleChange} />
              <button name="join-room" onClick={handleSubmit}>Join Room</button>
              <button name="leave-room" onClick={handleSubmit}>Leave Room</button>
            </label>
          </div>
        </div>}
    </div>
  );
}

export default App;

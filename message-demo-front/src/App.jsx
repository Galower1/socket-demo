import "./App.css";

import { useContext, useRef, useState } from "react";
import { useContacts } from "./hooks/api/useContacts";
import { SocketContext } from "./components/SocketProvider";
import { useEvent } from "./hooks/useEvent";

function App() {
  const { data, isLoading } = useContacts();
  const { socket } = useContext(SocketContext);
  const [selectedContact, setSelectedContact] = useState("1234567890");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");

  useEvent("message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  useEvent("typing", (data) => {
    setTyping(data.from);
    setTimeout(() => setTyping(""), 800);
  });

  const inputRef = useRef(null);

  const submitMessage = (event) => {
    event.preventDefault();

    socket.emit("message", {
      to: selectedContact,
      message: inputRef.current.value,
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-window__contacts">
        <h1>Contacts</h1>
        {!isLoading && (
          <ul>
            {data.map((contact) => (
              <li onClick={() => setSelectedContact(contact)} key={contact}>
                {contact}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="chat-window__messages">
        <h1>Chat</h1>
        <h2>Speaking with: {selectedContact}</h2>
        <div className="messages">
          {messages
            .filter((message) => message.from === selectedContact)
            .map((message) => (
              <div className="messages__chat" key={window.crypto.randomUUID()}>
                <h4>{message.from}: </h4>
                <p>{message.message}</p>
              </div>
            ))}
        </div>
        <form onSubmit={submitMessage}>
          <input
            onChange={() => socket.emit("typing", { to: selectedContact })}
            ref={inputRef}
            type="text"
            placeholder="message"
            name="message"
          />
          <button type="submit">Submit</button>
          <div>{typing === selectedContact && `${selectedContact} is typing...`}</div>
        </form>
      </div>
    </div>
  );
}

export default App;

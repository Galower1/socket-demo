import "./App.css";

import { useContext, useEffect, useRef, useState } from "react";
import { useContacts } from "./hooks/api/useContacts";
import { SocketContext } from "./components/SocketProvider";
import { useEvent } from "./hooks/useEvent";
import { decodeToken } from "react-jwt";
import { TOKEN } from "./lib/socket-io";

function App() {
  const { socket } = useContext(SocketContext);
  const [selectedContact, setSelectedContact] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const { data, isLoading } = useContacts();
  const [userId, setUserId] = useState("");
  const inputRef = useRef(null);
  const chatFormRef = useRef(null);

  useEvent("message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  useEvent("typing", (data) => {
    setTyping(data.from);
    setTimeout(() => setTyping(""), 800);
  });

  useEffect(() => {
    const { sub } = decodeToken(TOKEN);
    setSelectedContact(sub);
    setUserId(sub);
  }, []);

  useEffect(() => {
    chatFormRef.current.scrollTop = chatFormRef.current.scrollHeight;
  }, [messages]);

  const submitMessage = (event) => {
    event.preventDefault();

    socket.emit("message", {
      to: selectedContact,
      message: inputRef.current.value,
    });
    setMessages((prev) => [
      ...prev,
      { from: selectedContact, message: inputRef.current.value },
    ]);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{userId}</h1>
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
          <div ref={chatFormRef} className="messages">
            {messages
              .filter((message) => message.from === selectedContact)
              .map((message) => (
                <div
                  className="messages__chat"
                  key={window.crypto.randomUUID()}
                >
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
            <div>
              {typing === selectedContact && `${selectedContact} is typing...`}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import socket from "./socket";
import axios from "axios";

const profile = JSON.parse(localStorage.getItem("profile"));
const usernames = [
  {
    name: "user1",
    value: "user67d7a1ebac503a0d55c01448",
  },
  {
    name: "user2",
    value: "user67d7a455ac503a0d55c0144a",
  },
];
export default function Chat() {
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState("");
  const getProfile = async (username) => {
    await axios
      .get(`/users/${username}`, {
        baseURL: import.meta.env.VITE_API_URL,
      })
      .then((res) => {
        setReceiver(res.data.result._id);
        alert(`Now you can chat with ${res.data.result.name}`);
      });
  };
  useEffect(() => {
    socket.auth = {
      _id: profile._id,
    };
    socket.connect();
    socket.on("receive_message", (data) => {
      const { payload } = data;
      //Thêm vào array
      setConversations((conversations) => [...conversations, payload]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (receiver) {
      axios
        .get(`/conversations/receivers/${receiver}`, {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            limit: 10,
            page: 1,
          },
        })
        .then((res) => {
          setConversations(res.data.result.conversations);
        });
    }
  }, [receiver]);

  const send = (e) => {
    e.preventDefault();
    setValue("");
    //Object tương ứng với payload
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver,
    };
    socket.emit("send_message", {
      payload: conversation,
    });
    setConversations((conversations) => [
      ...conversations,
      {
        ...conversation,
        _id: new Date().getTime(),
      },
    ]);
  };
  return (
    <div>
      <h1>Chat</h1>
      <div>
        {usernames.map((username) => (
          <div key={username.name}>
            <button onClick={() => getProfile(username.value)}>
              {username.name}
            </button>
          </div>
        ))}
      </div>
      <div className="chat">
        {conversations.map((conversation) => (
          <div key={conversation._id}>
            <div className="message-container">
              <div
                className={
                  "message " +
                  (conversation.sender_id === profile._id
                    ? "message-right"
                    : "")
                }
              >
                {conversation.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

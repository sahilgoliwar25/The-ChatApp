import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChatCompo.css";
import grpChatIcon from "../assets/teamwork.png";
import send from "../assets/send.png";
const socket = io("https://sg-chatapp-server.onrender.com/");

function ChatCompo() {
  const [text, setText] = useState("");
  const [grpName, setGrpName] = useState("");
  const [currUserId, setCurrUserId] = useState("");
  const [currUserName, setCurrUserName] = useState("");
  const chatCont = document.getElementsByClassName("chatsDisplay");
  useEffect(() => {
    const data = prompt("Please Provide Your Name");

    // console.log(chatCont);

    socket.emit("JOINROOM", data);
    socket.on("SUCCESSROOM", (data, id, groupName) => {
      // console.log(data);
      // console.log(id);
      // console.log(groupName);
      setGrpName(groupName);
    });
    socket.on("USERNAME", (data, id) => {
      console.log(data);
      // console.log(id);
      setCurrUserName(data);
      setCurrUserId(id);
    });
  }, []);
  useEffect(() => {
    socket.on("sendtoRoomMsg", (data, cliName, id) => {
      // console.log(data);
      // console.log(currUserId);
      // console.log(id);
      if (currUserId !== id && currUserId !== "") {
        let newMessage = document.createElement("div");
        let newUserName = document.createElement("p");
        let newMessageBox = document.createElement("div");
        let newMessageContent = document.createElement("div");
        newMessage.classList.add("recieving");
        newUserName.classList.add("username");
        newMessageBox.classList.add("recievingSide");
        newMessageContent.classList.add("recievingbody");
        newUserName.innerText = cliName;
        newMessageContent.innerText = data;
        chatCont[0].appendChild(newMessage);
        newMessage.appendChild(newUserName);
        newMessage.appendChild(newMessageBox);
        newMessageBox.appendChild(newMessageContent);
      }
    });
  }, [currUserId, chatCont]);

  const sendRoomMess = () => {
    const sendGroupMsg = text;
    // const sendGroupMsg = "Hello";
    socket.emit("SENDROOMMSG", sendGroupMsg);
    setText("");
    let newMessage = document.createElement("div");
    let newUserName = document.createElement("p");
    let newMessageBox = document.createElement("div");
    let newMessageContent = document.createElement("div");
    newMessage.classList.add("sending");
    newUserName.classList.add("username");
    newMessageBox.classList.add("sendingSide");
    newMessageContent.classList.add("sendingbody");
    newUserName.innerText = currUserName;
    newMessageContent.innerText = sendGroupMsg;
    chatCont[0].appendChild(newMessage);
    newMessage.appendChild(newUserName);
    newMessage.appendChild(newMessageBox);
    newMessageBox.appendChild(newMessageContent);
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };
  return (
    <div>
      <div className="chatContainer">
        <div className="chatHeader">
          <div>
            <img
              className="grpChatIcon"
              src={grpChatIcon}
              alt="Icon not found"
            />
          </div>
          <div className="grpName">{grpName}</div>
        </div>
        <div className="chatBody">
          <div className="chatsDisplay">
            <div className="sending">
              <p className="username">You</p>
              <div className="sendingSide">
                <div className="sendingbody">Sample text</div>
              </div>
            </div>
            <div className="recieving">
              <p className="username">Sender</p>
              <div className="recievingSide">
                <div className="recievingbody">Sample text</div>
              </div>
            </div>
          </div>
          <div className="userInputChat">
            <input
              type="text"
              name="message"
              value={text}
              onChange={handleChange}
              placeholder="Message"
              className="messageInput"
            />
            <button className="btnSend" onClick={sendRoomMess}>
              <img className="sendbtnImg" src={send} alt="Icon not found" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatCompo;

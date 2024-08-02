import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import './style.css'

const ChatDemo = ({ userInfo, room }) => {
    const [connection, setConnection] = useState();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const messageRef = useRef();
    const [activeUser, setActiveUser] = useState(sessionStorage.getItem("activeUser") || "");

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const joinRoom = async () => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("https://oktadlzchapi.azurewebsites.net/chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (user, message) => {
                setMessages((messages) => [...messages, { user, message }]);
            });

            connection.on("UsersInRoom", (users) => {
                setUsers(users);
            });


            connection.onclose((e) => {
                setConnection();
                setMessages([]);
                setUsers([]);
            });
            if (!room) {
                room = '123456'
            }
            let user = "";
            if (!userInfo?.emailAddress) {
                user = 'demo'
            } else {
                user = userInfo.emailAddress
            }
            sessionStorage.setItem("activeUser", user);
            await connection.start();
            await connection.invoke("JoinRoom", { user, room });
            setConnection(connection);
        } catch (e) {
            console.log(e);
        }
    };

    const sendMessage = async (message) => {
        try {
            await connection.invoke("SendMessage", message);
        } catch (e) {
            console.log(e);
        }
    };

    const closeConnection = async () => {
        try {
            await connection.stop();
        } catch (e) {
            console.log(e);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (message) {
            sendMessage(message);
            setMessage('');
        }
    }

    return (
        <>
            {!connection ? (
                <div>
                    <div className="chat-icon" onClick={joinRoom}>
                        Chat
                    </div>
                </div>
            ) : (
                <div className='chat-box'>
                    <div className='chatWindow'>
                        <div className="chat-box-header">
                            <div className="chat-box-close" onClick={closeConnection}>
                                X
                            </div>
                        </div>
                        <div className='chat'>
                            <div ref={messageRef} className='message-container'>
                                {messages.map((m, index) => (
                                    <>
                                        {m.user !== "MyChat Bot" ?
                                            <div key={index} className={activeUser === m.user ? 'user-message' : 'other-user-message'}>
                                                <div className={`message ${activeUser === m.user ? 'bg-primary' : 'bg-info'}`} style={{ padding: 10 }}>
                                                    {m.message}
                                                </div>
                                                <div className='from-user'>{m.user}</div>
                                            </div>
                                            :
                                            <>
                                            </>
                                        }
                                    </>
                                ))}
                            </div>
                            <form onSubmit={(e) => handleSend(e)} className='send-message-form'>
                                <div className="col-md-12 frm-field frm-field-bggray chat-input">
                                    <input onChange={(e) => setMessage(e.target.value)} value={message} placeholder="message..."></input>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatDemo;




// import { useEffect, useState } from "react";
// import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
// import Lobby from "./Lobby";
// import Chat from "./Chat";
// // import "./App.css";

// const ChatDemo = ({ userInfo, room }) => {
//     const [connection, setConnection] = useState();
//     const [messages, setMessages] = useState([]);
//     const [users, setUsers] = useState([]);

//     const joinRoom = async () => {
//         try {
//             const connection = new HubConnectionBuilder()
//                 .withUrl("https://oktadlzchapi.azurewebsites.net/chat")
//                 .configureLogging(LogLevel.Information)
//                 .build();

//             connection.on("ReceiveMessage", (user, message) => {
//                 setMessages((messages) => [...messages, { user, message }]);
//             });

//             connection.on("UsersInRoom", (users) => {
//                 setUsers(users);
//             });


//             connection.onclose((e) => {
//                 setConnection();
//                 setMessages([]);
//                 setUsers([]);
//             });
//             if (!room) {
//                 room = '123456'
//             }
//             let user = "";
//             if (!userInfo?.emailAddress) {
//                 user = 'demo'
//             } else {
//                 user = userInfo.emailAddress
//             }
//             sessionStorage.setItem("activeUser", user);
//             await connection.start();
//             await connection.invoke("JoinRoom", { user, room });
//             setConnection(connection);
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const sendMessage = async (message) => {
//         try {
//             await connection.invoke("SendMessage", message);
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const closeConnection = async () => {
//         try {
//             await connection.stop();
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     return (
//         <>
//             {!connection ? (
//                 <Lobby joinRoom={joinRoom} />
//             ) : (
//                 <Chat
//                     sendMessage={sendMessage}
//                     messages={messages}
//                     users={users}
//                     closeConnection={closeConnection}
//                 />
//             )}
//         </>
//     );
// };

// export default ChatDemo;

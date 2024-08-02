import SendMessageForm from './SendMessageForm';
import MessageContainer from './MessageContainer';

const Chat = ({ sendMessage, messages, users, closeConnection }) => {
    return (
        <div className='chat-box'>
            <div className='chatWindow'>
                <div className="chat-box-header">
                    <div className="chat-box-close" onClick={closeConnection}>
                        X
                    </div>
                </div>
                <div className='chat'>
                    <MessageContainer messages={messages} />
                    <SendMessageForm sendMessage={sendMessage} />
                </div>
            </div>
        </div>
    );
};

export default Chat;
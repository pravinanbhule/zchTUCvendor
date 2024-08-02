import { useState } from 'react';
import FrmInput from '../common-components/frminput/FrmInput';

const SendMessageForm = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (message) {
            sendMessage(message);
            setMessage('');
        }
    }

    const writeMsg = (e) => {
        setMessage(e.target.value)
    }

    return (
        <form onSubmit={(e) => handleSend(e)} className='send-message-form'>
            <div className="col-md-12 frm-field frm-field-bggray chat-input">
                <input onChange={(e) => writeMsg(e)} value={message} placeholder="message..."></input>
            </div>
            {/* <div className='col-md-2'>
                <button className={`btn-blue-chat`} type="submit" disabled={!message}>Send</button>
            </div> */}
        </form>
    )
}

export default SendMessageForm;
import React, { useEffect, useState } from 'react';
import { useGetConversations } from '../lib/useGetConversations';
import { useGetMessages } from '../lib/useGetMessages';
import { useSendMessage } from '../lib/useSendMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { goToMenu } from '../lib/Navigate';
import { useNavigate } from 'react-router-dom';

type Conversation = {
    userId: number;
    corespondentId: number;
    corespondentName: string;
};

type MessageDTO = {
    senderId: number;
    receiverId: number;
    date: string;
    content: string;
};

const ChatPage: React.FC = () => {
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState<string>('');
    const email = useSelector((state: RootState) => state.login.email);
    const navigate = useNavigate();

    const conversations = useGetConversations(email);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    const userId = selectedConversation ? selectedConversation.userId : 0;
    const corespondentId = selectedConversation
        ? selectedConversation.corespondentId
        : 0;
    const messages = useGetMessages(userId, corespondentId, shouldRefresh);

    const { sendMessage } = useSendMessage();

    const handleConversationClick = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleSendMessage = async () => {
        if (newMessage && selectedConversation) {
            const messageDTO: MessageDTO = {
                senderId: selectedConversation.userId,
                receiverId: selectedConversation.corespondentId,
                date: new Date().toISOString(),
                content: newMessage,
            };
            await sendMessage(messageDTO);
            setNewMessage('');
            setShouldRefresh(true);
        }
    };

    useEffect(() => {
        if (shouldRefresh) {
            setShouldRefresh(false);
        }
    }, [shouldRefresh, userId, corespondentId]);

    return (
        <div className="chat-container">
            <div className="conversations-list">
                <h2>Conversations</h2>
                {conversations ? (
                    <ul>
                        {conversations.map((conv: Conversation) => (
                            <li
                                key={conv.corespondentId}
                                onClick={() => handleConversationClick(conv)}
                            >
                                {conv.corespondentName}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading conversations...</p>
                )}
            </div>

            {selectedConversation && (
                <div className="messages-section">
                    <h2>Messages with {selectedConversation.corespondentName}</h2>
                    {messages ? (
                        <ul className="messages-list">
                            {messages.map((msg: MessageDTO, index: number) => (
                                <li key={index}>
                                    <strong>
                                        {msg.senderId === selectedConversation.userId
                                            ? 'You'
                                            : selectedConversation.corespondentName}
                                    </strong>
                                    : {msg.content} <em>({msg.date})</em>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading messages...</p>
                    )}

                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Write a message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
            <button onClick={() => goToMenu(navigate)}>Powrót</button>
        </div>
    );
};

export default ChatPage;

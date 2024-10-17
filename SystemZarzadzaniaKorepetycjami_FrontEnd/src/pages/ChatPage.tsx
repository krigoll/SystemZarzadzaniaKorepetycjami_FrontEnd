import React, { useState } from 'react';
import { useGetConversations } from '../lib/useGetConversations';
import { useGetMessages } from '../lib/useGetMessages';
import { useSendMessage } from '../lib/useSendMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../futures/store';

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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const email = useSelector((state: RootState) => state.login.email);
  
  // Hook to fetch conversations
  const conversations = useGetConversations(email);

  // Hook to fetch messages of selected conversation (using conversation's userId and correspondentId)
  const messages = selectedConversation ? useGetMessages(selectedConversation.userId, selectedConversation.corespondentId) : null;

  // Hook to send a message
  const { sendMessage } = useSendMessage();

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (newMessage && selectedConversation) {
      const messageDTO: MessageDTO = {
        senderId: selectedConversation.userId,  // We now use userId from the selected conversation
        receiverId: selectedConversation.corespondentId,
        date: new Date().toISOString(),
        content: newMessage,
      };
      await sendMessage(messageDTO);
      setNewMessage('');  // Clear input after sending
    }
  };

  return (
    <div className="chat-container">
      <div className="conversations-list">
        <h2>Conversations</h2>
        {conversations ? (
          <ul>
            {conversations.map((conv: Conversation) => (
              <li key={conv.corespondentId} onClick={() => handleConversationClick(conv)}>
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
                  <strong>{msg.senderId === selectedConversation.userId ? 'You' : selectedConversation.corespondentName}</strong>: {msg.content} <em>({msg.date})</em>
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
    </div>
  );
};

export default ChatPage;

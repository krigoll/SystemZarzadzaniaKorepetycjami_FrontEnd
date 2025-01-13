import React, { useState, useEffect } from 'react';
import { useGetConversations } from '../lib/useGetConversations';
import { useGetMessages } from '../lib/useGetMessages';
import { useSendMessage } from '../lib/useSendMessage';
import { useSearchPersons } from '../lib/useSearchPersons';
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
    const uId = useSelector((state: RootState) => state.login.idPerson);
    const navigate = useNavigate();

    const [conversations, setConversations] = useState<Conversation[]>([]);

    const { getMessages, messages, loading, errorM } = useGetMessages();
    const { sendMessage } = useSendMessage();
    const {
        searchPersons,
        persons,
        loading: searchLoading,
        error: searchError,
    } = useSearchPersons();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const initialConversations = useGetConversations(email);

    useEffect(() => {
        if (initialConversations) {
            setConversations(initialConversations);
        }
    }, [initialConversations]);

    const handleConversationClick = async (conversation: Conversation) => {
        setSelectedConversation(conversation);
        await getMessages(conversation.userId, conversation.corespondentId);
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
            await getMessages(
                selectedConversation.userId,
                selectedConversation.corespondentId
            );
        }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            await searchPersons(query);
        }
    };

    const handlePersonClick = (person: {
        idPerson: number;
        fullName: string;
    }) => {
        const newConversation: Conversation = {
            userId: uId,
            corespondentId: person.idPerson,
            corespondentName: person.fullName,
        };

        setConversations((prevConversations) => {
            const updatedConversations = [...prevConversations, newConversation];

            updatedConversations.sort((a, b) =>
                a.corespondentName.localeCompare(b.corespondentName)
            );

            return updatedConversations;
        });

        setSelectedConversation(newConversation);

        getMessages(uId, person.idPerson);
    };

    return (
        <div className="chat-container">
            <div className="conversations-list">
                <h2 style={{ textAlign: 'center' }}>Wiadomości</h2>
                {conversations.length > 0 ? (
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
                    <p>Ładowanie wiadomości...</p>
                )}
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Wyszukaj osoby..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {searchLoading && <p>Szukanie...</p>}
                {searchError && <p>Błąd: {searchError}</p>}
                {persons && (
                    <ul>
                        {persons.map((person) => (
                            <li
                                key={person.idPerson}
                                onClick={() => handlePersonClick(person)}
                            >
                                {person.fullName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedConversation && (
                <div className="messages-section">
                    <h2>{selectedConversation.corespondentName}</h2>
                    {loading ? (
                        <p>Ładowanie wiadomości...</p>
                    ) : errorM ? (
                        <p>Błąd: {errorM}</p>
                    ) : messages && messages.length > 0 ? (
                        <ul className="messages-list">
                            {messages.map((msg: MessageDTO, index: number) => (
                                <li key={index}>
                                    <strong>
                                        {msg.senderId === selectedConversation.userId
                                            ? 'Ty'
                                            : selectedConversation.corespondentName}
                                    </strong>
                                    : {msg.content} <em>({msg.date})</em>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak wiadomości</p>
                    )}
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Napisz wiadomość..."
                        />
                        <button onClick={handleSendMessage}>Wyślij</button>
                    </div>
                </div>
            )}
            <button className="back-button" onClick={() => goToMenu(navigate)}>
                Powrót
            </button>
        </div>
    );
};

export default ChatPage;

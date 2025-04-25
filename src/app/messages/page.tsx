'use client';

import { Container, Row, Col, Card, Form, InputGroup, Button, Image } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { redirect } from 'next/navigation';

// Define types for our data
interface User {
  email: string;
  displayName?: string;
  image?: string;
  status?: 'online' | 'offline';
  lastActive?: string;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const MessagesPage = () => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = session?.user?.email || '';

  // Fetch conversations and users when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') return;

      try {
        // Fetch conversations
        const res = await fetch('/api/conversations');
        const data = await res.json();
        setConversations(data);

        // Fetch users for the sidebar
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        setUsers(usersData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      try {
        const res = await fetch(`/api/messages?conversationId=${activeConversation}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          conversationId: activeConversation,
          sender: currentUser,
        }),
      });

      if (response.ok) {
        const newMessageObj = await response.json();
        setMessages([...messages, newMessageObj]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Find other participant in conversation
  const getOtherParticipant = (conversation: Conversation) => {
    const otherUser = conversation.participants.find(p => p !== currentUser) || '';
    const user = users.find(u => u.email === otherUser);
    return user || { email: otherUser, status: 'offline' as const };
  };

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <main className="bg-light py-5 min-vh-100">
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="d-flex flex-row overflow-hidden">
              {/* People List */}
              <div className="p-3 border-end" style={{ width: 280, minHeight: '600px' }}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-search" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                <ul className="list-unstyled mb-0 conversation-list">
                  {conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    return (
                      <div
                        key={conversation.id}
                        className={`d-flex align-items-start gap-2 p-2 rounded ${
                          activeConversation === conversation.id ? 'bg-body-tertiary' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveConversation(conversation.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveConversation(conversation.id);
                          }
                        }}
                      >
                        <Image
                          src={otherUser.image || `https://ui-avatars.com/api/?name=
                            ${encodeURIComponent(otherUser.email)}&background=random`}
                          alt="avatar"
                          width={45}
                          height={45}
                          roundedCircle
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{otherUser.displayName || otherUser.email}</div>
                          <small
                            className={`d-flex align-items-center ${
                              otherUser.status === 'online' ? 'text-success' : 'text-secondary'
                            }`}
                          >
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }} />
                            {otherUser.status === 'online' ? 'online' : 'offline'}
                          </small>
                          {conversation.lastMessage && (
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>
                              {conversation.lastMessage}
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </div>

              {/* Chat Section */}
              <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '600px' }}>
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    {activeConversation && (
                      <div className="d-flex justify-content-between align-items-center border-bottom p-3">
                        <div className="d-flex align-items-center">
                          {(() => {
                            const conversation = conversations.find(c => c.id === activeConversation);
                            if (!conversation) return null;

                            const otherUser = getOtherParticipant(conversation);
                            return (
                              <>
                                <Image
                                  src={otherUser.image || `https://ui-avatars.com/api/?name=
                                    ${encodeURIComponent(otherUser.email)}&background=random`}
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                  roundedCircle
                                />
                                <div className="ms-2">
                                  <h6 className="mb-0">{otherUser.displayName || otherUser.email}</h6>
                                  <small>
                                    {(() => {
                                      if (otherUser.status === 'online') {
                                        return 'Online now';
                                      }
                                      if (otherUser.lastActive) {
                                        return `Last seen: ${otherUser.lastActive}`;
                                      }
                                      return 'Offline';
                                    })()}
                                  </small>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Chat History */}
                    <div className="flex-grow-1 p-3 overflow-auto bg-white">
                      <ul className="list-unstyled mb-0">
                        {messages.map((message) => (
                          <li key={message.id} className={`mb-4 ${message.sender === currentUser ? 'text-end' : ''}`}>
                            <div className="text-muted small mb-1">{formatTime(message.createdAt)}</div>
                            <div className="d-flex">
                              {message.sender !== currentUser && (
                                <Image
                                  src={`https://ui-avatars.com/api/?name=$
                                    {encodeURIComponent(message.sender)}&background=random`}
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                  roundedCircle
                                  className="me-2 align-self-end"
                                />
                              )}
                              <div
                                className={`${
                                  message.sender === currentUser
                                    ? 'bg-success-subtle ms-auto'
                                    : 'bg-secondary-subtle'
                                } d-inline-block p-3 rounded mt-2`}
                              >
                                {message.content}
                              </div>
                              {message.sender === currentUser && (
                                <Image
                                  src={`https://ui-avatars.com/api/?name=$
                                    {encodeURIComponent(currentUser)}&background=random`}
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                  roundedCircle
                                  className="ms-2 align-self-end"
                                />
                              )}
                            </div>
                          </li>
                        ))}
                        <div ref={messagesEndRef} />
                      </ul>
                    </div>

                    {/* Chat Input */}
                    <div className="border-top p-3">
                      <InputGroup>
                        <Form.Control
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button
                          variant="success"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <i className="bi bi-send" />
                          Send
                        </Button>
                      </InputGroup>
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center p-4">
                    <Image
                      src="/raw.png"
                      alt="UH Marketplace Logo"
                      width={100}
                      height={100}
                      className="mb-4 opacity-50"
                    />
                    <h4>Select a conversation</h4>
                    <p className="text-muted">
                      Choose a conversation from the list or start a new one to begin messaging
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default MessagesPage;

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Form, Image, InputGroup, Row } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

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

// Mock data for development/testing
const mockUsers = [
  {
    name: 'Vincent Porter',
    status: 'left 7 mins ago',
    statusClass: 'text-danger',
    img: 'https://bootdey.com/img/Content/avatar/avatar1.png',
  },
  {
    name: 'Aiden Chavez',
    status: 'online',
    statusClass: 'text-success',
    img: 'https://bootdey.com/img/Content/avatar/avatar2.png',
    active: true,
  },
  {
    name: 'Mike Thomas',
    status: 'online',
    statusClass: 'text-success',
    img: 'https://bootdey.com/img/Content/avatar/avatar3.png',
  },
  {
    name: 'Christian Kelly',
    status: 'left 10 hours ago',
    statusClass: 'text-danger',
    img: 'https://bootdey.com/img/Content/avatar/avatar7.png',
  },
  {
    name: 'Monica Ward',
    status: 'online',
    statusClass: 'text-success',
    img: 'https://bootdey.com/img/Content/avatar/avatar8.png',
  },
  {
    name: 'Dean Henry',
    status: 'offline since Oct 28',
    statusClass: 'text-danger',
    img: 'https://bootdey.com/img/Content/avatar/avatar3.png',
  },
];

// Main component
const Messages = () => {
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

    if (process.env.NODE_ENV === 'development') {
      // For development, ensure we exit loading state
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    return () => {}; // Satisfy ESLint
  }, [status]);

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

  const getOtherParticipant = (conversation: Conversation) => {
    const otherUser = conversation.participants.find(p => p !== currentUser) || '';
    const user = users.find(u => u.email === otherUser);
    return user || { email: otherUser, status: 'offline' as const };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConversationClick = (conversationId: number) => {
    setActiveConversation(conversationId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  // Mock UI when no data available
  if (conversations.length === 0) {
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
                      <i className="bi bi-search" aria-hidden="true" />
                    </InputGroup.Text>
                    <Form.Control
                      id="mock-search-input"
                      placeholder="Search..."
                      aria-label="Search contacts"
                    />
                  </InputGroup>
                  <ul className="list-unstyled mb-0">
                    {mockUsers.map((user) => (
                      <div
                        key={user.name}
                        className={`d-flex align-items-start gap-2 p-2 rounded ${
                          user.active ? 'bg-body-tertiary' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {}}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            // Handle activation
                          }
                        }}
                      >
                        <Image
                          src={user.img}
                          alt={`${user.name}'s avatar`}
                          width={45}
                          height={45}
                          roundedCircle
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{user.name}</div>
                          <small className={`d-flex align-items-center ${user.statusClass}`}>
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }} aria-hidden="true" />
                            {user.status}
                          </small>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>

                {/* Chat Section */}
                <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '600px' }}>
                  {/* Chat Header */}
                  <div className="d-flex justify-content-between align-items-center border-bottom p-3">
                    <div className="d-flex align-items-center">
                      <Image
                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                        alt="Aiden Chavez's avatar"
                        width={40}
                        height={40}
                        roundedCircle
                      />
                      <div className="ms-2">
                        <h6 className="mb-0">Aiden Chavez</h6>
                        <small>Last seen: 2 hours ago</small>
                      </div>
                    </div>
                    <div className="d-none d-md-flex gap-2">
                      <Button variant="outline-secondary" size="sm" aria-label="Camera">
                        <i className="bi bi-camera" aria-hidden="true" />
                      </Button>
                      <Button variant="outline-primary" size="sm" aria-label="Image">
                        <i className="bi bi-image" aria-hidden="true" />
                      </Button>
                      <Button variant="outline-info" size="sm" aria-label="Settings">
                        <i className="bi bi-gear" aria-hidden="true" />
                      </Button>
                      <Button variant="outline-warning" size="sm" aria-label="Help">
                        <i className="bi bi-question-circle" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {/* Chat History */}
                  <div className="flex-grow-1 p-3 overflow-auto bg-white">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-4 text-end">
                        <div className="text-muted small mb-1">10:10 AM, Today</div>
                        <div className="d-flex justify-content-end align-items-end">
                          <div className="bg-info-subtle d-inline-block p-3 rounded mt-2">
                            Buy this thing from me now.
                          </div>
                          <Image
                            src="https://bootdey.com/img/Content/avatar/avatar7.png"
                            alt="Your avatar"
                            width={40}
                            height={40}
                            roundedCircle
                            className="ms-2"
                          />
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="text-muted small mb-1">10:12 AM, Today</div>
                        <div className="d-flex align-items-end">
                          <Image
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt="Aiden's avatar"
                            width={40}
                            height={40}
                            roundedCircle
                            className="me-2"
                          />
                          <div className="bg-secondary-subtle d-inline-block p-3 rounded">
                            I buy for $5
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="text-muted small mb-1">10:15 AM, Today</div>
                        <div className="d-flex align-items-end">
                          <Image
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt="Aiden's avatar"
                            width={40}
                            height={40}
                            roundedCircle
                            className="me-2"
                          />
                          <div className="bg-secondary-subtle d-inline-block p-3 rounded">
                            Or for free is good too
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Chat Input */}
                  <div className="border-top p-3">
                    <InputGroup>
                      <Form.Control
                        id="mock-message-input"
                        placeholder="Enter text here..."
                        aria-label="Type a message"
                      />
                      <Button
                        variant="primary"
                        aria-label="Send message"
                      >
                        <i className="bi bi-send" aria-hidden="true" /> Send
                      </Button>
                    </InputGroup>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    );
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
                    <i className="bi bi-search" aria-hidden="true" />
                  </InputGroup.Text>
                  <Form.Control
                    id="search-conversations-input"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search conversations"
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
                        onClick={() => handleConversationClick(conversation.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleConversationClick(conversation.id);
                          }
                        }}
                      >
                        <Image
                          src={
              otherUser.image
              || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                otherUser.email,
              )}&background=random`
            }
                          alt={`${otherUser.email}'s avatar`}
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
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }} aria-hidden="true" />
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
                    <div className="d-flex justify-content-between align-items-center border-bottom p-3">
                      <div className="d-flex align-items-center">
                        {(() => {
                          const conversation = conversations.find(c => c.id === activeConversation);
                          if (!conversation) return null;

                          const otherUser = getOtherParticipant(conversation);
                          return (
                            <>
                              <Image
                                src={
                                  otherUser.image
                                  || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    otherUser.email,
                                  )}&background=random`
                                }
                                alt={`${otherUser.email}'s avatar`}
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

                    {/* Chat History */}
                    <div className="flex-grow-1 p-3 overflow-auto bg-white">
                      <ul className="list-unstyled mb-0">
                        {messages.map((message) => (
                          <li key={message.id} className={`mb-4 ${message.sender === currentUser ? 'text-end' : ''}`}>
                            <div className="text-muted small mb-1">{formatTime(message.createdAt)}</div>
                            <div className={`d-flex ${message.sender === currentUser ? 'justify-content-end' : ''}`}>
                              {message.sender !== currentUser && (
                                <Image
                                  src={`https://ui-avatars.com/api/?name=${
                                    encodeURIComponent(message.sender)
                                  }&background=random`}
                                  alt={`${message.sender}'s avatar`}
                                  width={40}
                                  height={40}
                                  roundedCircle
                                  className="me-2 align-self-end"
                                />
                              )}
                              <div
                                className={`${
                                  message.sender === currentUser
                                    ? 'bg-success-subtle'
                                    : 'bg-secondary-subtle'
                                } d-inline-block p-3 rounded mt-2`}
                              >
                                {message.content}
                              </div>
                              {message.sender === currentUser && (
                                <Image
                                  src={`https://ui-avatars.com/api/?name=${
                                    encodeURIComponent(currentUser)
                                  }&background=random`}
                                  alt="Your avatar"
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
                          id="message-input"
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={handleMessageChange}
                          onKeyPress={handleKeyPress}
                          aria-label="Type a message"
                        />
                        <Button
                          variant="success"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          aria-label="Send message"
                        >
                          <i className="bi bi-send" aria-hidden="true" /> Send
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

export default Messages;

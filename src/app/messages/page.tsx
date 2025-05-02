/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-unstable-nested-components */

'use client';

import { Container, Row, Col, Card, Form, InputGroup, Button, Image } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define types for our data
interface User {
  id: number;
  email: string;
  displayName?: string;
  image?: string;
  status?: 'online' | 'offline';
  lastActive?: string;
}

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    email: string;
  };
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  updatedAt: Date;
}

const MessagesPage = () => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
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
        const usersData = await res.json();
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
    const otherUserEmail = conversation.participants.find(p => p !== currentUser) || '';
    const user = users.find(u => u.email === otherUserEmail);
    return user || { email: otherUserEmail, status: 'offline' as const };
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
    return redirect('/auth/signin');
  }

  // Sample data for empty state
  const sampleUsers = [
    {
      name: 'Vincent Porter',
      status: 'offline',
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
  ];
  
  // Fallback to sample UI if no real data
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
                    {sampleUsers.map((user) => (
                      <li
                        key={user.name}
                        className={`d-flex align-items-start gap-2 p-2 rounded ${user.active ? 'bg-body-tertiary' : ''}`}
                        style={{ cursor: 'pointer' }}
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
                      </li>
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
                  </div>

                  {/* Empty State */}
                  <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center p-4">
                    <Image
                      src="/images/logo.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      className="mb-4 opacity-50"
                    />
                    <h4>No conversations yet</h4>
                    <p className="text-muted">
                      Start a new conversation from the Explore page
                    </p>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search conversations"
                  />
                </InputGroup>
                <ul className="list-unstyled mb-0 conversation-list">
                  {conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    return (
                      <li
                        key={conversation.id}
                        className={`d-flex align-items-start gap-2 p-2 rounded ${
                          activeConversation === conversation.id ? 'bg-body-tertiary' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveConversation(conversation.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveConversation(conversation.id);
                          }
                        }}
                      >
                        <Image
                          src={'image' in otherUser && otherUser.image ? otherUser.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.email)}&background=random`}
                          alt={`${otherUser.email}'s avatar`}
                          width={45}
                          height={45}
                          roundedCircle
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{'displayName' in otherUser ? otherUser.displayName : otherUser.email}</div>
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
                      </li>
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
                                src={'image' in otherUser && otherUser.image ? otherUser.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.email)}&background=random`}
                                alt={`${otherUser.email}'s avatar`}
                                width={40}
                                height={40}
                                roundedCircle
                              />
                              <div className="ms-2">
                                <h6 className="mb-0">{'displayName' in otherUser ? otherUser.displayName : otherUser.email}</h6>
                                <small>
                                  {otherUser.status === 'online'
                                    ? 'Online now'
                                    : 'lastActive' in otherUser && otherUser.lastActive
                                      ? `Last seen: ${otherUser.lastActive}`
                                      : 'Offline'}
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
                          <li key={message.id} className={`mb-4 ${message.sender.email === currentUser ? 'text-end' : ''}`}>
                            <div className="text-muted small mb-1">{formatTime(message.createdAt)}</div>
                            <div className={`d-flex ${message.sender.email === currentUser ? 'justify-content-end' : ''}`}>
                              {message.sender.email !== currentUser && (
                                <Image
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.email)}&background=random`}
                                  alt={`${message.sender.email}'s avatar`}
                                  width={40}
                                  height={40}
                                  roundedCircle
                                  className="me-2 align-self-end"
                                />
                              )}
                              <div
                                className={`${
                                  message.sender.email === currentUser
                                    ? 'bg-success-subtle'
                                    : 'bg-secondary-subtle'
                                } d-inline-block p-3 rounded mt-2`}
                              >
                                {message.content}
                              </div>
                              {message.sender.email === currentUser && (
                                <Image
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser)}&background=random`}
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
                          onChange={(e) => setNewMessage(e.target.value)}
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
                      src="/images/logo.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      className="mb-4 opacity-50"
                    />
                    <h4>Select a conversation</h4>
                    <p className="text-muted">
                      Choose a conversation from the list to begin messaging
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

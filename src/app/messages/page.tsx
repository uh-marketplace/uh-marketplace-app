'use client';

import { Container, Row, Col, Card, Form, InputGroup, Button, Image } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
// Define the types manually if they are not exported from @prisma/client
type User = {
  id: number;
  email: string;
  name?: string;
};

type Message = {
  id: number;
  content: string;
  createdAt: Date;
  senderId: number;
};

type Conversation = {
  id: number;
  name?: string;
  updatedAt: Date;
};

// Remove the incorrect import
// import { User, Message, Conversation } from '@prisma/client';

// Type definitions for the data we'll be working with

type ConversationWithParticipants = Conversation & {
  participants: User[];
  lastMessage?: Message;
};

type MessageWithSender = Message & {
  sender: User;
};

// Removed unused fetchUsers function

const fetchConversations = async (): Promise<ConversationWithParticipants[]> => {
  // Fetch conversations from API endpoint
  const response = await fetch('/api/conversations');
  return response.json();
};

const fetchMessages = async (conversationId: number): Promise<MessageWithSender[]> => {
  // Fetch messages for a specific conversation
  const response = await fetch(`/api/conversations/${conversationId}/messages`);
  return response.json();
};

const Messages = () => {
  // Removed unused 'users' state variable
  const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationWithParticipants | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load users and conversations when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const conversationsData = await fetchConversations();
        setConversations(conversationsData);

        // If we have conversations, set the first one as active
        if (conversationsData.length > 0) {
          setActiveConversation(conversationsData[0]);
          const messagesData = await fetchMessages(conversationsData[0].id);
          setMessages(messagesData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleConversationClick = async (conversation: ConversationWithParticipants) => {
    setActiveConversation(conversation);
    const messagesData = await fetchMessages(conversation.id);
    setMessages(messagesData);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConversation) return;

    try {
      // Send message to API endpoint
      const response = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          // Assuming we have the current user's ID available
          // For demo purposes, we're using an ID of 1
          senderId: 1,
          receiverId: activeConversation.participants.find(p => p.id !== 1)?.id || 2,
        }),
      });

      const savedMessage = await response.json();

      // Update messages with the new one
      setMessages([...messages, savedMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <main className="bg-light py-5 min-vh-100">
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="d-flex flex-row overflow-hidden">
              {/* Conversations List */}
              <div className="p-3 border-end" style={{ width: 280, minHeight: '600px' }}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-search" />
                  </InputGroup.Text>
                  <Form.Control placeholder="Search..." />
                </InputGroup>
                <ul className="list-unstyled mb-0">
                  {conversations.map((conversation) => {
                    // Find the other participant (not the current user)
                    const otherParticipant = conversation.participants.find(p => p.id !== 1)
                    || conversation.participants[0];

                    return (
                      <div
                        key={conversation.id}
                        className={`d-flex align-items-start gap-2 p-2 rounded ${
                          activeConversation?.id === conversation.id ? 'bg-body-tertiary' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleConversationClick(conversation)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleConversationClick(conversation);
                          }
                        }}
                      >
                        <Image
                          src={`https://bootdey.com/img/Content/avatar/avatar${(otherParticipant.id % 8) + 1}.png`}
                          alt="avatar"
                          width={45}
                          height={45}
                          roundedCircle
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{otherParticipant.email.split('@')[0]}</div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: '180px' }}>
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </div>
                        </div>
                        {conversation.lastMessage && (
                          <small className="text-muted">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </small>
                        )}
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
                        {activeConversation.participants.length > 0 && (
                          <Image
                            src={`https://bootdey.com/img/Content/avatar/avatar${
                              (activeConversation.participants.find(p => p.id !== 1)?.id !== undefined
                                ? (activeConversation.participants.find(p => p.id !== 1)!.id % 8) + 1
                                : 1)
                            }.png`}
                            alt="avatar"
                            width={40}
                            height={40}
                            roundedCircle
                          />
                        )}
                        <div className="ms-2">
                          <h6 className="mb-0">
                            {activeConversation.name
                              || activeConversation.participants.find(p => p.id !== 1)?.email.split('@')[0]
                              || 'Chat'}
                          </h6>
                          <small>
                            Last seen:
                            {formatDate(activeConversation.updatedAt)}
                          </small>
                        </div>
                      </div>
                      <div className="d-none d-md-flex gap-2">
                        <Button variant="outline-secondary" size="sm">
                          <i className="bi bi-camera" />
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-image" />
                        </Button>
                        <Button variant="outline-info" size="sm">
                          <i className="bi bi-gear" />
                        </Button>
                      </div>
                    </div>

                    {/* Chat History */}
                    <div className="flex-grow-1 p-3 overflow-auto bg-white">
                      <ul className="list-unstyled mb-0">
                        {messages.map((message, index) => {
                          const isSelf = message.senderId === 1; // Assuming current user ID is 1
                          const showDate = index === 0
                          || formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                          return (
                            <React.Fragment key={message.id}>
                              {showDate && (
                                <li className="text-center my-3">
                                  <small className="bg-light px-3 py-1 rounded-pill">
                                    {formatDate(message.createdAt)}
                                  </small>
                                </li>
                              )}
                              <li className={`mb-3 ${isSelf ? 'text-end' : ''}`}>
                                <div className="text-muted small mb-1">
                                  {formatTime(message.createdAt)}
                                </div>
                                <div className="d-flex align-items-end gap-2 mb-1">
                                  {!isSelf && (
                                    <Image
                                      src={`https://bootdey.com/img/Content/avatar/avatar
                                        ${(message.sender.id % 8) + 1}.png`}
                                      alt="avatar"
                                      width={30}
                                      height={30}
                                      roundedCircle
                                    />
                                  )}
                                  <div
                                    className={`d-inline-block p-3 rounded ${
                                      isSelf ? 'bg-primary text-white ms-auto' : 'bg-light'
                                    }`}
                                  >
                                    {message.content}
                                  </div>
                                  {isSelf && (
                                    <Image
                                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                      alt="avatar"
                                      width={30}
                                      height={30}
                                      roundedCircle
                                    />
                                  )}
                                </div>
                              </li>
                            </React.Fragment>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </ul>
                    </div>

                    {/* Chat Input */}
                    <div className="border-top p-3">
                      <Form onSubmit={handleSendMessage}>
                        <InputGroup>
                          <Form.Control
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <Button type="submit" variant="primary">
                            <i className="bi bi-send me-1" />
                            Send
                          </Button>
                        </InputGroup>
                      </Form>
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <i className="bi bi-chat-text" style={{ fontSize: '4rem', color: '#ddd' }} />
                    <h5 className="mt-3">Select a conversation to start chatting</h5>
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

'use client';

import { Container, Row, Col, Card, Form, InputGroup, Button, Image } from 'react-bootstrap';
import React from 'react';

const users = [
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

const Messages = () => (
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
                <Form.Control placeholder="Search..." />
              </InputGroup>
              <ul className="list-unstyled mb-0">
                {users.map((user) => (
                  <li
                    key={user.name}
                    className={`d-flex align-items-start gap-2 p-2 rounded ${user.active ? 'bg-body-tertiary' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image
                      src={user.img}
                      alt="avatar"
                      width={45}
                      height={45}
                      roundedCircle
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{user.name}</div>
                      <small className={`d-flex align-items-center ${user.statusClass}`}>
                        <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }} />
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
                    alt="avatar"
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
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-camera" />
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-image" />
                  </Button>
                  <Button variant="outline-info" size="sm">
                    <i className="bi bi-gear" />
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    <i className="bi bi-question-circle" />
                  </Button>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-grow-1 p-3 overflow-auto bg-white">
                <ul className="list-unstyled mb-0">
                  <li className="mb-4 text-end">
                    <div className="text-muted small mb-1">10:10 AM, Today</div>
                    <Image
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="avatar"
                      width={40}
                      height={40}
                      roundedCircle
                      className="ms-2"
                    />
                    <div className="bg-info-subtle d-inline-block p-3 rounded mt-2">
                      Buy this thing from me now.
                    </div>
                  </li>
                  <li className="mb-4">
                    <div className="text-muted small mb-1">10:12 AM, Today</div>
                    <div className="bg-secondary-subtle d-inline-block p-3 rounded">
                      I buy for $5
                    </div>
                  </li>
                  <li>
                    <div className="text-muted small mb-1">10:15 AM, Today</div>
                    <div className="bg-secondary-subtle d-inline-block p-3 rounded">
                      Or for free is good too
                    </div>
                  </li>
                </ul>
              </div>

              {/* Chat Input */}
              <div className="border-top p-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-send" />
                  </InputGroup.Text>
                  <Form.Control placeholder="Enter text here..." />
                </InputGroup>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Messages;

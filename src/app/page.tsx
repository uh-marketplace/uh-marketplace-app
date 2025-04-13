'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Home = () => (
  <main className="bg-white min-vh-100">
    <Container fluid className="py-5 text-center">
      {/* Headline Section */}
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="fw-bold mb-3" style={{ color: '#00664B' }}>
            Buy, Sell, and Trade on Campus
          </h1>
          <p className="mb-4">
            Welcome to UH Marketplace – a safe and easy place to trade goods within the UH Manoa community.
            Post what you want, browse what you need, and keep it all on campus.
          </p>
          <Button variant="success" size="lg">
            Start Browsing
          </Button>
        </Col>
      </Row>

      {/* Featured Items Section */}
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Img variant="top" src="/placeholder.png" alt="Item Preview" />
            <Card.Body className="text-start">
              <Card.Title className="fw-bold mb-1">Mini Fridge</Card.Title>
              <Card.Text className="text-muted mb-0">$40 · Near Campus Center</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Img variant="top" src="/placeholder.png" alt="Item Preview" />
            <Card.Body className="text-start">
              <Card.Title className="fw-bold mb-1">Desk Chair</Card.Title>
              <Card.Text className="text-muted mb-0">$15 · Hale Aloha</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Img variant="top" src="/placeholder.png" alt="Item Preview" />
            <Card.Body className="text-start">
              <Card.Title className="fw-bold mb-1">Textbooks</Card.Title>
              <Card.Text className="text-muted mb-0">$10 · Free pickup</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;

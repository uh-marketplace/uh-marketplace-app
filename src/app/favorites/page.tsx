'use client';

import { Container, Row, Col, Image, Card, Dropdown, ButtonGroup } from 'react-bootstrap';

const Favorites = () => (
  <main className="bg-white min-vh-100">
    <Container fluid className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="fw-bold mb-3" style={{ color: '#00664B' }}>
            Favorites
          </h1>
          <p className="mb-4">
            Revisit listings you liked in your Heart List
          </p>
        </Col>
      </Row>
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          Sort by:
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#">Price, high</Dropdown.Item>
          <Dropdown.Item href="#">Price, low</Dropdown.Item>
          <Dropdown.Item href="#">Date added</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Img variant="top" src="/jeans.png" alt="Item Preview" />
            <Card.Body className="text-start">
              <Card.Title className="fw-bold mb-1">Baggy Jeans</Card.Title>
              <Card.Text className="text-muted mb-0">
                $30 · Near Campus Center
                <Image
                  src="/suit-heart-fill.svg"
                  alt="heart"
                  width="25"
                  height="25"
                  className="ms-5"
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Img variant="top" src="/desk.png" alt="Item Preview" />
            <Card.Body className="text-start">
              <Card.Title className="fw-bold mb-1">Desk</Card.Title>
              <Card.Text className="text-muted mb-0">
                $45 · Hale Aloha
                <Image
                  src="/suit-heart-fill.svg"
                  alt="heart"
                  width="25"
                  height="25"
                  className="ms-5"
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Img variant="top" src="/textbooks.png" alt="Item Preview" />
            <Card.Body className="text-start">
              <Card.Title className="fw-bold mb-1">Textbooks</Card.Title>
              <Card.Text className="text-muted mb-0">
                $10 · Free pickup
                <Image
                  src="/suit-heart-fill.svg"
                  alt="heart"
                  width="25"
                  height="25"
                  className="ms-5"
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Favorites;

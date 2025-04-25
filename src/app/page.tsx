import { Container, Row, Col, Button } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import ItemCard from '@/components/ItemCard';
import Footer from '@/components/Footer';

export default async function Home() {
  const items = await prisma.item.findMany();

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="bg-white flex-grow-1">
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
          <Row className="justify-content-center mt-5 g-4 pb-5">
            {items.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <ItemCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

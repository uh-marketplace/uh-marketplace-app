import { Container, Row, Col, Button } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Item = {
  id: string;
  // Add other fields based on your database schema
  name: string;
  description: string;
  price: number;
};

export default async function Home() {
  const items: Item[] = await prisma.item.findMany({
    where: {
      condition: {
        in: ['good', 'fair', 'poor'], // Only include valid conditions
      },
    },
  });

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
              <Link href="/explore" passHref>
                <Button variant="success" size="lg">
                  Start Browsing
                </Button>
              </Link>
            </Col>
          </Row>

          {/* Featured Items Section */}
          <Row className="justify-content-center mt-5 g-4 pb-5">
            {items.map((item: Item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <ItemCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}

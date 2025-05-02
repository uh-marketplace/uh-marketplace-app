import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ItemCard from '@/components/ItemCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const items = await prisma.item.findMany({
    orderBy: { id: 'desc' },
    take: 4,
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="bg-white flex-grow-1">
        <Container fluid className="text-center mt-5" style={{ marginTop: '100px' }}>
          <Row className="justify-content-center">
            <Col md={8}>
              {/* Logo image */}
              <Image
                src="/a19283b9-f8d4-46d0-a3ce-5dddd80d8b59.png"
                alt="UH Marketplace Logo"
                width={420}
                height={420}
                className="mb-4"
              />

              {/* Headline and Description */}
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
            {items.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <ItemCard item={item} initialFavorited={false} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}


import { GeoAltFill } from 'react-bootstrap-icons';
import { Container, Row, Col } from 'react-bootstrap';
import ItemCard from '@/components/ItemCard';

export default function ExplorePageContent({ items }: { items: any[] }) {
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-4 fw-bold m-0">Today&apos;s Picks</h1>
        <GeoAltFill size={28} color="#555" />
      </div>
      <Row className="g-4">
        {items.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addItem } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddItemSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: {
  name: string;
  condition: string;
  price: number;
  location: string;
  owner: string;
  imageUrl: string;
  description: string;
}) => {
  await addItem(data);
  swal('Success', 'Your item has been added', 'success', {
    timer: 2000,
  });
};

const AddItemForm: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddItemSchema),
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={10}>
          <Card className="shadow-sm">
            <Card.Header
              className="d-flex align-items-center justify-content-center text-white"
              style={{ backgroundColor: '#00664B', height: '60px' }}
            >
              <h3 className="m-0">Add New Item</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('name')}
                        isInvalid={!!errors.name}
                        placeholder="Enter item name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Condition</Form.Label>
                      <Form.Select
                        {...register('condition')}
                        isInvalid={!!errors.condition}
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.condition?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        {...register('price')}
                        isInvalid={!!errors.price}
                        placeholder="Enter price"
                        onBlur={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!Number.isNaN(value)) {
                            e.target.value = value.toFixed(2); // Format to 2 decimal places
                          }
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('location')}
                        isInvalid={!!errors.location}
                        placeholder="Enter location"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.location?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('imageUrl')}
                    isInvalid={!!errors.imageUrl}
                    placeholder="Enter image URL"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.imageUrl?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register('description')}
                    isInvalid={!!errors.description}
                    placeholder="Enter item description"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <input type="hidden" {...register('owner')} value={currentUser} />
                <div className="d-flex justify-content-between">
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#00664B', borderColor: '#00664B' }}
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddItemForm;

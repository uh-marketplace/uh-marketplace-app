'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, HeartFill, PencilFill, TrashFill } from 'react-bootstrap-icons';
import { Modal, Button, Form } from 'react-bootstrap';

const ItemCard = ({ 
  item, 
  isOwner = false,
  onEdit,
  onDelete 
}: { 
  item: any;
  isOwner?: boolean;
  onEdit?: (itemId: string, updatedData: any) => void;
  onDelete?: (itemId: string) => void;
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: item.title,
    price: item.price,
    description: item.description,
  });

  const toggleFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites/${item.id}`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleEdit = async () => {
    if (onEdit) {
      await onEdit(item.id, editFormData);
      setShowEditModal(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete && window.confirm('Are you sure you want to delete this item?')) {
      await onDelete(item.id);
    }
  };

  return (
    <>
      <div className="position-relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-2 bg-white">
        {/* Action Buttons */}
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
          <button
            type="button"
            onClick={toggleFavorite}
            className="bg-white rounded-circle border-0 p-1"
            aria-label="Toggle favorite"
          >
            {isFavorited ? (
              <HeartFill color="red" size={20} />
            ) : (
              <Heart color="gray" size={20} />
            )}
          </button>
          
          {isOwner && (
            <>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="bg-white rounded-circle border-0 p-1"
                aria-label="Edit item"
              >
                <PencilFill color="#00664B" size={20} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-white rounded-circle border-0 p-1"
                aria-label="Delete item"
              >
                <TrashFill color="#dc3545" size={20} />
              </button>
            </>
          )}
        </div>

        {/* Item Image */}
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={300}
          height={200}
          className="w-100 h-auto object-cover"
        />

        {/* Item Content */}
        <div className="p-2">
          <p className="fw-bold mb-1">${item.price}</p>
          <h2 className="fs-6 fw-normal mb-1">{item.title}</h2>
          <p className="text-secondary small">{item.location}</p>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editFormData.price}
                onChange={(e) => setEditFormData({...editFormData, price: Number(e.target.value)})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ItemCard;

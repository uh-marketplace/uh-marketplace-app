'use client';

import Image from 'next/image';

const ItemCard = ({ item }: { item: any }) => (
  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-2">
    <Image
      src={item.imageUrl}
      alt={item.title}
      width={300}
      height={200}
      className="w-100 h-auto object-cover"
    />
    <div className="p-2">
      {/* Price */}
      <p className="fw-bold mb-1">{item.price}</p>

      {/* Title */}
      <h2 className="fs-6 fw-normal mb-1">{item.title}</h2>

      {/* Location */}
      <p className="text-secondary small">{item.location}</p>
    </div>
  </div>
);

export default ItemCard;

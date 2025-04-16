'use client';

import React from 'react';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const editPost = () => {
    console.log('Edit post clicked');
  };

  const deletePost = () => {
    console.log('Delete post clicked');
  };

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: Arial, sans-serif;
        }

        .profile-banner {
          background-color: #00664b;
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border-radius: 10px;
        }

        .profile-details h2 {
          margin: 0;
        }

        section {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #f9f9f9;
          border-radius: 10px;
        }

        h3 {
          margin-bottom: 1rem;
          color: #333;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .item-card {
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .manage-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>

      <div className="container">
        {/* Profile Header */}
        <div className="profile-banner">
          <Image
            src="/images/default-avatar.png"
            alt="User Avatar"
            width={100}
            height={100}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div className="profile-details">
            <h2>John Doe</h2>
            <p>Email: john.doe@hawaii.edu</p>
            <p>Member since: January 2024</p>
          </div>
        </div>

        {/* About */}
        <section>
          <h3>About</h3>
          <p>
            Hi! I&apos;m John and I love trading cool stuff on UH Marketplace.
            Looking for school supplies, dorm furniture, and tech gadgets.
          </p>
        </section>

        {/* Posted Items */}
        <section>
          <h3>Posted Items</h3>
          <div className="items-grid">
            <div className="item-card">
              <Image
                src="/images/sample1.jpg"
                alt="Item 1"
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>Calculator - $20</p>
            </div>
            <div className="item-card">
              <Image
                src="/images/sample2.jpg"
                alt="Item 2"
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>Mini Fridge - $75</p>
            </div>
          </div>
        </section>

        {/* Favorites */}
        <section>
          <h3>Favorites</h3>
          <div className="items-grid">
            <div className="item-card">
              <Image
                src="/images/sample3.jpg"
                alt="Fav 1"
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>Desk Chair</p>
            </div>
            <div className="item-card">
              <Image
                src="/images/sample4.jpg"
                alt="Fav 2"
                width={300}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p>LED Lamp</p>
            </div>
          </div>
        </section>

        {/* Manage Posts */}
        <section>
          <h3>Manage Your Posts</h3>
          <div className="manage-buttons">
            <button type="button" onClick={editPost}>
              Edit Post
            </button>
            <button type="button" onClick={deletePost}>
              Delete Post
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProfilePage;

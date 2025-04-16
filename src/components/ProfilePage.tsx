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

        .profile-banner img {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          object-fit: cover;
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

        .item-card img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 0.5rem;
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
          <img src="/images/default-avatar.png" alt="User Avatar" />
          <div className="profile-details">
            <h2>John Doe</h2>
            <p>Email: john.doe@hawaii.edu</p>
            <p>Member since: January 2024</p>
          </div>
        </div>

        {/* About */}
        <section>
          <h3>About</h3>
          <p>Hi! I'm John and I love trading cool stuff on UH Marketplace. Looking for school supplies, dorm furniture, and tech gadgets.</p>
        </section>

        {/* Posted Items */}
        <section>
          <h3>Posted Items</h3>
          <div className="items-grid">
            <div className="item-card">
              <img src="/images/sample1.jpg" alt="Item 1" />
              <p>Calculator - $20</p>
            </div>
            <div className="item-card">
              <img src="/images/sample2.jpg" alt="Item 2" />
              <p>Mini Fridge - $75</p>
            </div>
          </div>
        </section>

        {/* Favorites */}
        <section>
          <h3>Favorites</h3>
          <div className="items-grid">
            <div className="item-card">
              <img src="/images/sample3.jpg" alt="Fav 1" />
              <p>Desk Chair</p>
            </div>
            <div className="item-card">
              <img src="/images/sample4.jpg" alt="Fav 2" />
              <p>LED Lamp</p>
            </div>
          </div>
        </section>

        {/* Manage Posts */}
        <section>
          <h3>Manage Your Posts</h3>
          <div className="manage-buttons">
            <button type="button" onClick={editPost}>Edit Post</button>
            <button type="button" onClick={deletePost}>Delete Post</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProfilePage;

'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExplorePage from '@/components/ExplorePage';

const Explore = () => (
  <>
    <Navbar />
    <main className="bg-white min-vh-100">
      <ExplorePage />
    </main>
    <Footer />
  </>
);

export default Explore;

import type { NextPage } from 'next';
import React from 'react';
import Center from 'src/components/Center';

import Sidebar from 'src/components/Sidebar';

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div></div>
    </div>
  );
};

export default Home;

import type { NextPage, NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';
import Center from 'src/components/Center';
import Player from 'src/components/Player';

import Sidebar from 'src/components/Sidebar';

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context: NextPageContext) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

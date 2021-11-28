import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';

import { colors } from 'src/constants';
import { playlistState, playlistIdState } from 'src/atoms/playlistAtom';
import useSpotify from 'src/hooks/useSpotify';
import Songs from './Songs';

const Center: FC = () => {
  const { data: session } = useSession();

  const spotifyApi = useSpotify();

  const [color, setColor] = useState<string>('from-indigo-500');
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] =
    useRecoilState<SpotifyApi.SinglePlaylistResponse>(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop()!);
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => setPlaylist(data.body))
      .catch((error) =>
        console.error(`Something went wrong: ${error.message}`)
      );
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8 ">
        <div
          onClick={() => signOut()}
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white"
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user?.image || undefined}
            alt={session?.user?.name || undefined}
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black h-80 text-white p-8 ${color}`}
      >
        <img
          src={playlist?.images?.[0]?.url}
          alt={playlist?.name}
          className="h-44 w-44 shadow-2xl"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;

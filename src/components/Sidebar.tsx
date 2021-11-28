import { FC, useEffect, useState } from 'react';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { signOut } from 'next-auth/react';
import useSpotify from 'src/hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from 'src/atoms/playlistAtom';

const sideBarButtons = [
  { Icon: HomeIcon, name: 'Home' },
  { Icon: SearchIcon, name: 'Search' },
  { Icon: LibraryIcon, name: 'Your Library' },
  { Icon: PlusCircleIcon, name: 'Create Playlist' },
  { Icon: HeartIcon, className: 'text-blue-500', name: 'Liked Songs' },
  { Icon: RssIcon, className: 'text-green-500', name: 'Your Episodes' },
];

const Sidebar: FC = () => {
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    spotifyApi
      .getUserPlaylists()
      .then((data) => setPlaylists(data.body.items))
      .catch((error) =>
        console.error(`Something went wrong: ${error.message}`)
      );
  }, [spotifyApi]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <p>Logout</p>
        </button>
        {sideBarButtons.slice(0, 3).map(({ Icon, name }) => (
          <button
            key={name}
            className="flex items-center space-x-2 hover:text-white"
          >
            <Icon className="h-5 w-5" />
            <p>{name}</p>
          </button>
        ))}
        <hr className="border-t-[0.1px] border-gray-900" />

        {sideBarButtons.slice(3).map(({ Icon, name, className }) => (
          <button
            key={name}
            className="flex items-center space-x-2 hover:text-white"
          >
            <Icon className={`h-5 w-5 ${className}`} />
            <p>{name}</p>
          </button>
        ))}
        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

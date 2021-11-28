import { FC } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from 'src/atoms/songAtom';

import useSpotify from 'src/hooks/useSpotify';
import { millisToMinutesAndSeconds } from 'src/lib/time';

interface Props {
  track: SpotifyApi.PlaylistTrackObject;
  order: number;
}

const Song: FC<Props> = ({ track: { track }, order }) => {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<string>(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({ uris: [track.uri] });
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order}</p>
        <img
          className="h-10 w-10"
          src={track.album.images[0].url}
          alt={track.name}
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.name}</p>
          <p className="w-40">{track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;

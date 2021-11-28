import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from 'src/atoms/playlistAtom';
import Song from './Song';

const Songs: FC = () => {
  const playlist =
    useRecoilValue<SpotifyApi.SinglePlaylistResponse>(playlistState);
  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      {playlist?.tracks.items.map((track, index) => (
        <Song key={track.track.id} track={track} order={index + 1} />
      ))}
    </div>
  );
};

export default Songs;

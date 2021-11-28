import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from 'src/atoms/songAtom';
import useSongInfo from 'src/hooks/useSongInfo';
import useSpotify from 'src/hooks/useSpotify';

const Player: FC = () => {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<string>(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(50);

  const fetchCurrentSongs = () => {
    !songInfo &&
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) => {
          data.body.item && setCurrentTrackId(data.body.item?.id);
          spotifyApi
            .getMyCurrentPlaybackState()
            .then((data) => setIsPlaying(data.body.is_playing))
            .catch((error) =>
              console.error(`Something went wrong: ${error.message}`)
            );
        })
        .catch((error) =>
          console.error(`Something went wrong: ${error.message}`)
        );
  };

  useEffect(() => {
    !currentTrackId && fetchCurrentSongs() && setVolume(50);
  }, [currentTrackId, spotifyApi, session]);

  return (
    <div className="grid grid-cols-3 text-xs md:text-base px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt={songInfo?.name}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon className="button w-10 h-10" />
        ) : (
          <PlayIcon className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
    </div>
  );
};

export default Player;

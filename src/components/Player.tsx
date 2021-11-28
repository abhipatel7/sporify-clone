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
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
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

  const rewind = () => spotifyApi.skipToPrevious();

  const fastForward = () => spotifyApi.skipToNext();

  const onPlayPause = () =>
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      })
      .catch((error) =>
        console.error(`Something went wrong: ${error.message}`)
      );

  const onVolumeChange = (event: ChangeEvent<HTMLInputElement>) =>
    setVolume(Number(event.target.value));

  const onVolumeDown = () => volume > 0 && setVolume(volume - 10);

  const onVolumeUp = () => volume < 100 && setVolume(volume + 10);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi
        .setVolume(volume)
        .catch((error) =>
          console.error('Something went wrong: ', error.message)
        );
    }, 500),
    []
  );

  useEffect(() => {
    !currentTrackId && fetchCurrentSongs() && setVolume(50);
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    volume > 0 && volume < 100 && debounceAdjustVolume(volume);
  }, []);

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
        <RewindIcon onClick={rewind} className="button" />
        {isPlaying ? (
          <PauseIcon onClick={onPlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={onPlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon onClick={fastForward} className="button" />
        <ReplyIcon className="button" />

        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
          <VolumeDownIcon onClick={onVolumeDown} className="button" />
          <input
            className="w-14 md:w-28"
            type="range"
            value={volume}
            onChange={onVolumeChange}
            min={0}
            max={100}
          />
          <VolumeUpIcon onClick={onVolumeUp} className="button" />
        </div>
      </div>
    </div>
  );
};

export default Player;

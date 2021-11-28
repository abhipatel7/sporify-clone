import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from 'src/atoms/songAtom';
import useSpotify from './useSpotify';

const useSongInfo = () => {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<string>(currentTrackIdState);
  const [songInfo, setSongInfo] = useState<SpotifyApi.SingleTrackResponse>();

  const fetchSongInfo = async () => {
    if (currentTrackId) {
      spotifyApi
        .getTrack(currentTrackId)
        .then((data) => setSongInfo(data.body));
    }
  };

  useEffect(() => {
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
};

export default useSongInfo;

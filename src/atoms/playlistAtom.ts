import { atom, RecoilState } from 'recoil';

export const playlistIdState = atom({
  key: 'playlistIdState',
  default: '4LnTQT9pZuyXG96WS9RNzU',
});

export const playlistState: any = atom({
  key: 'playlistAtomState',
  default: null,
});

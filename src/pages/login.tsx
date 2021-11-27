import type { NextPage } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

const Login: NextPage<Props> = ({ providers }) => {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img src="/spotify-logo.png" alt="spotify-logo" className="w-52 mb-5" />

      {Object.values(providers).map(({ id, name }) => (
        <div key={name}>
          <button
            className="bg-[#18D868] text-white p-5 rounded-full"
            onClick={() => signIn(id, { callbackUrl: '/' })}
          >
            Login with {name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

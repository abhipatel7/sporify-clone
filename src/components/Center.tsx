import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import { shuffle } from 'lodash';

import { colors } from 'src/constants';

const Center: FC = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState<string>('from-indigo-500');

  useEffect(() => {
    const newColor = shuffle(colors).pop();
    if (newColor) setColor(newColor);
  }, []);

  return (
    <div className="flex-grow">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-red-400 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
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
        hello
      </section>
    </div>
  );
};

export default Center;

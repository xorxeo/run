import Head from 'next/head';
import { Inter } from '@next/font/google';

import Events from './events';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>RUN</title>
      </Head>
      <Navbar />
      <Events >
        <EventCard title="fsgfdgtrgsdf" />
      </Events>
    </>
  );
}

import Head from 'next/head'
import { Inter } from '@next/font/google'


import { Hero } from '@/components/Hero/Hero';
import  Events  from './events';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  return (
    <>
      <Head>
        <title>RUN</title>
      </Head>
      <Navbar/>
      <Hero />
      <Events>
        <EventCard title="fsgfdgtrgsdf"/>
      </Events>
     
    </>
  );
}

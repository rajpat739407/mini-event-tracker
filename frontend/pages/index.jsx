import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Only redirect on client side
    if (isClient) {
      if (isAuthenticated()) {
        router.push('/events');
      } else {
        router.push('/login');
      }
    }
  }, [isClient, router]);

  return (
    <div>
      <Head>
        <title>Mini Event Tracker</title>
        <meta name="description" content="Track your events with ease" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  );
}
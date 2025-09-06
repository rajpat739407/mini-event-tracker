import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Layout from '../../components/Layout';

export default function SharedEvent() {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { shareToken } = router.query;

  useEffect(() => {
    if (shareToken) {
      fetchSharedEvent();
    }
  }, [shareToken]);

  const fetchSharedEvent = async () => {
    try {
      const response = await api.get(`/events/shared/${shareToken}`);
      setEvent(response.data.event);
    } catch (error) {
      toast.error('Event not found or share link is invalid');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="mt-4 text-gray-600">The event you're looking for doesn't exist or the share link is invalid.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{event.title} - Mini Event Tracker</title>
      </Head>
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold leading-6 text-gray-900">{event.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Shared by {event.creator.email}</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {event.description || 'No description provided'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {format(new Date(event.dateTime), 'PPP p')}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {event.location}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Your Own Events
          </button>
        </div>
      </div>
    </Layout>
  );
}
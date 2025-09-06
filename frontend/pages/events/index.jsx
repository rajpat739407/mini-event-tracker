import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../../utils/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const params = filter !== 'all' ? { filter } : {};
      const response = await api.get('/events', { params });
      setEvents(response.data.events);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const copyShareLink = (shareToken) => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>My Events - Mini Event Tracker</title>
        </Head>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">My Events</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all your events including title, date, time, and location.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link
                href="/events/create"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add event
              </Link>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'upcoming'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'past'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past
            </button>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Title
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date & Time
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Location
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {events.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-3 py-4 text-sm text-gray-500 text-center">
                            No events found. <Link href="/events/create" className="text-indigo-600 hover:text-indigo-500">Create your first event</Link>.
                          </td>
                        </tr>
                      ) : (
                        events.map((event) => (
                          <tr key={event._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {event.title}
                              {event.description && (
                                <p className="text-gray-500 text-xs mt-1">{event.description}</p>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(event.dateTime), 'PPP p')}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {event.location}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => copyShareLink(event.shareToken)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Share
                              </button>
                              <Link
                                href={`/events/edit/${event._id}`}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(event._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
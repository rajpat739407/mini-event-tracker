import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Layout from '../../../components/Layout';

export default function EditEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get('/events');
      const event = response.data.events.find(e => e._id === id);
      
      if (event) {
        // Format date for datetime-local input
        const dateTime = new Date(event.dateTime);
        const formattedDateTime = dateTime.toISOString().slice(0, 16);
        
        setFormData({
          title: event.title,
          description: event.description || '',
          dateTime: formattedDateTime,
          location: event.location,
        });
      } else {
        toast.error('Event not found');
        router.push('/events');
      }
    } catch (error) {
      toast.error('Failed to fetch event');
      router.push('/events');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }
    
    if (!formData.dateTime) {
      toast.error('Date and time are required');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error('Location is required');
      return;
    }

    setIsLoading(true);

    try {
      await api.put(`/events/${id}`, formData);
      toast.success('Event updated successfully!');
      router.push('/events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
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
          <title>Edit Event - Mini Event Tracker</title>
        </Head>
        <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Event</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter event description (optional)"
              />
            </div>

            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                required
                value={formData.dateTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter event location"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/events')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaRupeeSign, FaTimes, FaCheck } from 'react-icons/fa';

interface BookingHistoryProps {
  onClose: () => void;
}

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  price: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const BookingHistoryPage: React.FC<BookingHistoryProps> = ({ onClose }) => {
  // Mock booking history data
  const bookings: Booking[] = [
    {
      id: '1',
      serviceName: 'House Cleaning',
      date: '2024-02-15',
      time: '10:00 AM',
      address: '123 Main St, City, State - 123456',
      price: '₹500',
      status: 'completed'
    },
    {
      id: '2',
      serviceName: 'Plumbing Service',
      date: '2024-02-18',
      time: '02:00 PM',
      address: '456 Park Ave, City, State - 123456',
      price: '₹800',
      status: 'pending'
    },
    {
      id: '3',
      serviceName: 'Electrician',
      date: '2024-02-10',
      time: '11:00 AM',
      address: '789 Oak Rd, City, State - 123456',
      price: '₹600',
      status: 'cancelled'
    }
  ];

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </motion.button>

        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Booking History
        </h2>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {booking.serviceName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{booking.address}</span>
                </div>
                <div className="flex items-center">
                  <FaRupeeSign className="mr-2" />
                  <span>{booking.price}</span>
                </div>
              </div>

              {booking.status === 'completed' && (
                <div className="mt-4 flex items-center text-green-600">
                  <FaCheck className="mr-2" />
                  <span>Service completed successfully</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingHistoryPage;
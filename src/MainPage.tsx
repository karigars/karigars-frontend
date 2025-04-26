import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  FaSearch, 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock,
  FaSignOutAlt,
  FaBell,
  FaHistory,
  FaCheckCircle,
  FaQuestionCircle,
  FaBook,
  FaHeadset,
  FaInfoCircle,
  FaPray,
  FaUtensils,
  FaPalette,
  FaCamera,
  FaUpload
} from 'react-icons/fa';
import BookingPage from './BookingPage';
import BookingHistoryPage from './BookingHistoryPage';

interface Service {
  id: string;
  name: string;
  category: 'event' | 'daily' | 'religious';
  description: string;
  image: string;
  price: string;
  rating: number;
  location: string;
  availability: string;
  laborCharges?: boolean;
  options?: {
    decoration?: {
      available: boolean;
      price: string;
    };
    food?: {
      available: boolean;
      price: string;
    };
    fullArrangement?: {
      available: boolean;
      price: string;
    };
  };
}

interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  profileImage?: string;
}

interface MainPageProps {
  initialUserProfile: UserProfile | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

export default function MainPage({ initialUserProfile }: MainPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'event' | 'daily' | 'religious'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Help topics data
  const helpTopics: HelpTopic[] = [
    {
      id: '1',
      title: 'How to Book a Service',
      content: `
        1. Browse through our available services
        2. Click on "Book Now" for your chosen service
        3. Select your preferred date and time
        4. Enter your address details
        5. Choose a payment method
        6. Confirm your booking
      `,
      icon: <FaBook className="text-blue-500" />
    },
    {
      id: '2',
      title: 'Payment Methods',
      content: `
        We accept the following payment methods:
        - UPI Payment
        - Credit/Debit Cards
        - Cash on Service
        
        All online payments are secure and encrypted.
      `,
      icon: <FaHeadset className="text-green-500" />
    },
    {
      id: '3',
      title: 'Cancellation Policy',
      content: `
        - Free cancellation up to 24 hours before the service
        - Cancellation within 24 hours may incur a fee
        - No-show will be charged full amount
        
        Contact customer support for assistance with cancellations.
      `,
      icon: <FaInfoCircle className="text-red-500" />
    }
  ];

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Booking Confirmed',
      message: 'Your house cleaning service has been confirmed for tomorrow at 10 AM',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Special Offer',
      message: 'Get 20% off on all event planning services this weekend!',
      time: '1 day ago',
      read: false
    },
    {
      id: '3',
      title: 'Service Completed',
      message: 'How was your experience with our plumbing service?',
      time: '2 days ago',
      read: true
    }
  ]);

  // Add event listener for new notifications
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      const newNotification = event.detail;
      setNotifications(prev => [newNotification, ...prev]);
    };

    window.addEventListener('addNotification', handleNewNotification as EventListener);

    return () => {
      window.removeEventListener('addNotification', handleNewNotification as EventListener);
    };
  }, []);

  const services: Service[] = [
    {
      id: '1',
      name: 'House Cleaning',
      category: 'daily',
      description: 'Professional house cleaning service with eco-friendly products',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      price: '₹500',
      rating: 4.5,
      location: 'Currently Only In Mumbai',
      availability: 'Available Now',
      laborCharges: true
    },
    {
      id: '2',
      name: 'Event Photography',
      category: 'event',
      description: 'Professional event photography service with high-end equipment',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
      price: '₹2000',
      rating: 4.8,
      location: 'Currently Only In Mumbai',
      availability: 'Book in advance'
    },
    {
      id: '3',
      name: 'Plumbing Service',
      category: 'daily',
      description: 'Expert plumbing repairs and installations',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=800',
      price: '₹800',
      rating: 4.3,
      location: 'Currently Only In Mumbai',
      availability: 'Available 24/7',
      laborCharges: true
    },
    {
      id: '4',
      name: 'Wedding Planning',
      category: 'event',
      description: 'Complete wedding planning and coordination services',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
      price: '₹25000',
      rating: 4.9,
      location: 'Currently Only In Mumbai',
      availability: 'Book 3 months ahead'
    },
    {
      id: '5',
      name: 'Electrical Repairs',
      category: 'daily',
      description: 'Professional electrical repair and installation services',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
      price: '₹600',
      rating: 4.4,
      location: 'Currently Only In Mumbai',
      availability: 'Same Day Service',
      laborCharges: true
    },
    {
      id: '6',
      name: 'Corporate Event Management',
      category: 'event',
      description: 'Full-service corporate event planning and execution',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      price: '₹15000',
      rating: 4.7,
      location: 'Currently Only In Mumbai',
      availability: 'Flexible Booking'
    },
    {
      id: '7',
      name: 'Ganesh Chaturthi Celebration',
      category: 'religious',
      description: 'Complete Ganesh Chaturthi celebration arrangements including pooja, decoration, and prasad',
      image: 'https://images.pexels.com/photos/6591154/pexels-photo-6591154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      price: '₹15000',
      rating: 4.9,
      location: 'Currently Only In Mumbai',
      availability: 'Book in advance',
      options: {
        decoration: {
          available: true,
          price: '₹5000'
        },
        food: {
          available: true,
          price: '₹7000'
        },
        fullArrangement: {
          available: true,
          price: '₹15000'
        }
      }
    },
    {
      id: '8',
      name: 'Satyanarayan Pooja',
      category: 'religious',
      description: 'Traditional Satyanarayan Pooja with all necessary items and professional pandits',
      image: 'https://images.pexels.com/photos/5730956/pexels-photo-5730956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      price: '₹11000',
      rating: 4.8,
      location: 'Currently Only In Mumbai',
      availability: 'Available on request',
      options: {
        decoration: {
          available: true,
          price: '₹3000'
        },
        food: {
          available: true,
          price: '₹5000'
        },
        fullArrangement: {
          available: true,
          price: '₹11000'
        }
      }
    },
    {
      id: '9',
      name: 'Rudrabhishek',
      category: 'religious',
      description: 'Sacred Rudrabhishek ceremony with authentic Vedic rituals and arrangements',
      image: 'https://images.pexels.com/photos/6591159/pexels-photo-6591159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      price: '₹13000',
      rating: 4.9,
      location: 'Currently Only In Mumbai',
      availability: 'Book 3 days ahead',
      options: {
        decoration: {
          available: true,
          price: '₹4000'
        },
        food: {
          available: true,
          price: '₹6000'
        },
        fullArrangement: {
          available: true,
          price: '₹13000'
        }
      }
    }
  ];

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserProfile(prev => prev ? { ...prev, profileImage: base64String } : null);
        // Save to localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          localStorage.setItem('user', JSON.stringify({ ...parsedData, profileImage: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                THE KARIGAR STOP
              </motion.h1>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelp(true)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaQuestionCircle className="text-gray-600 text-xl" />
                </motion.button>

                <motion.div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                  >
                    <FaBell className="text-gray-600 text-xl" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50"
                      >
                        <div className="p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <motion.div
                              key={notification.id}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className={`p-4 border-b cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800">{notification.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowProfile(true)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaUser className="text-gray-600 text-xl" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-8">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('daily')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === 'daily'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Daily Services
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('event')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === 'event'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Event Services
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('religious')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === 'religious'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Religious Events
              </motion.button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layoutId={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-gray-600">{service.rating}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-blue-600 font-semibold">{service.price}</span>
                      {service.laborCharges && (
                        <p className="text-xs text-gray-500">*Labor charges only</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{service.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaClock className="mr-1" />
                    <span>{service.availability}</span>
                  </div>
                  {service.options ? (
                    <div className="space-y-2 mb-4">
                      {service.options.decoration?.available && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <FaPalette className="mr-2 text-purple-500" />
                            <span>Decoration Only</span>
                          </div>
                          <span className="text-gray-600">{service.options.decoration.price}</span>
                        </div>
                      )}
                      {service.options.food?.available && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <FaUtensils className="mr-2 text-orange-500" />
                            <span>Food Only</span>
                          </div>
                          <span className="text-gray-600">{service.options.food.price}</span>
                        </div>
                      )}
                      {service.options.fullArrangement?.available && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <FaPray className="mr-2 text-green-500" />
                            <span>Full Arrangement</span>
                          </div>
                          <span className="text-gray-600">{service.options.fullArrangement.price}</span>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedService(service)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Book Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative"
                onClick={e => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelp(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </motion.button>

                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Help Center
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {helpTopics.map(topic => (
                      <motion.div
                        key={topic.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedHelpTopic === topic.id
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedHelpTopic(topic.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {topic.icon}
                          <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    {selectedHelpTopic ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-gray-800">
                          {helpTopics.find(t => t.id === selectedHelpTopic)?.title}
                        </h3>
                        <div className="text-gray-600 whitespace-pre-line">
                          {helpTopics.find(t => t.id === selectedHelpTopic)?.content}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <FaQuestionCircle className="mx-auto text-4xl mb-4" />
                        <p>Select a topic to view details</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Need more help?</h4>
                  <p className="text-blue-600">
                    Contact our support team at support@karigerstop.com or call us at +91-1234567890
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Modal */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowProfile(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
                onClick={e => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowProfile(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </motion.button>

                <div className="text-center mb-6">
                  <motion.div 
                    className="relative w-24 h-24 mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    {userProfile?.profileImage ? (
                      <img
                        src={userProfile.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-4xl" />
                      
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                    >
                      <FaCamera size={16} />
                    </motion.button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900">{userProfile?.fullName}</h2>
                </div>

                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                    whileHover={{ scale: 1.02, backgroundColor: "#EEF2FF" }}
                  >
                    <FaEnvelope className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{userProfile?.email}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                    whileHover={{ scale: 1.02, backgroundColor: "#EEF2FF" }}
                  >
                    <FaPhone className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="text-gray-900">{userProfile?.mobile}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.02, backgroundColor: "#EEF2FF" }}
                    onClick={() => {
                      setShowProfile(false);
                      setShowBookingHistory(true);
                    }}
                  >
                    <FaHistory className="text-blue-500" />
                    <div>
                      <p className="text-lg font-semibold">Booking History</p>
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#FEE2E2" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 text-red-600 rounded-lg transition-all duration-300"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking History Modal */}
        <AnimatePresence>
          {showBookingHistory && (
            <BookingHistoryPage onClose={() => setShowBookingHistory(false)} />
          )}
        </AnimatePresence>

        {/* Service Booking Modal */}
        {selectedService && (
          <BookingPage
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onConfirm={() => {
              setSelectedService(null);
              // You can add additional confirmation handling here
            }}
          />
        )}
      </div>
    </LayoutGroup>
  );
}
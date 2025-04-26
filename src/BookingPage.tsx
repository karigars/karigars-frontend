import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaRupeeSign, FaTimes, FaCheck, FaMobile } from 'react-icons/fa';
import { format, addYears } from 'date-fns';

interface BookingPageProps {
  service: {
    name: string;
    price: string;
    image: string;
  };
  onClose: () => void;
  onConfirm: () => void;
}

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ service, onClose, onConfirm }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [customerOTP, setCustomerOTP] = useState('');
  const [servicemanOTP, setServicemanOTP] = useState('');
  const [showCustomerOTP, setShowCustomerOTP] = useState(false);
  const [showServicemanOTP, setShowServicemanOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [servicemanVerified, setServicemanVerified] = useState(false);

  // Calculate min and max dates
  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardDetailsChange = (field: keyof CardDetails, value: string) => {
    let processedValue = value;
    
    switch (field) {
      case 'number':
        processedValue = value.replace(/\D/g, '').slice(0, 16);
        processedValue = processedValue.replace(/(\d{4})/g, '$1 ').trim();
        break;
      case 'expiry':
        processedValue = value.replace(/\D/g, '').slice(0, 4);
        if (processedValue.length > 2) {
          processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2);
        }
        break;
      case 'cvv':
        processedValue = value.replace(/\D/g, '').slice(0, 4);
        break;
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const handleSendCustomerOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setCustomerOTP(otp);
    setShowCustomerOTP(true);
  };

  const handleVerifyCustomerOTP = () => {
    if (customerOTP.length === 6) {
      setOtpVerified(true);
      const servicemanOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setServicemanOTP(servicemanOtp);
      setShowServicemanOTP(true);
      
      const newNotification = {
        id: Date.now().toString(),
        title: 'Serviceman OTP Generated',
        message: `OTP for service completion: ${servicemanOtp}`,
        time: 'Just now',
        read: false
      };
      
      window.dispatchEvent(new CustomEvent('addNotification', { detail: newNotification }));
    }
  };

  const handleVerifyServicemanOTP = () => {
    if (servicemanOTP.length === 6) {
      setServicemanVerified(true);
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = () => {
    setIsBookingConfirmed(true);

    // Create a notification with the correct service details
    const newNotification = {
      id: Date.now().toString(),
      title: 'Booking Confirmed',
      message: `Your ${service.name} has been confirmed for ${selectedDate} at ${selectedTime}`,
      time: 'Just now',
      read: false
    };
    
    window.dispatchEvent(new CustomEvent('addNotification', { detail: newNotification }));

    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return address.street && address.city && address.state && address.pincode;
      case 3:
        if (paymentMethod === 'card') {
          return cardDetails.number && cardDetails.name && cardDetails.expiry && cardDetails.cvv;
        }
        return paymentMethod && otpVerified && servicemanVerified;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Date</label>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can book services from today up to one year in advance
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg text-sm ${
                      selectedTime === time
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Enter your street address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">PIN Code</label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit PIN code"
                maxLength={6}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Landmark (Optional)</label>
              <input
                type="text"
                value={address.landmark}
                onChange={(e) => handleAddressChange('landmark', e.target.value)}
                placeholder="Nearby landmark"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 overflow-y-auto max-h-[60vh] pr-2"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <p><FaCalendarAlt className="inline mr-2" />{selectedDate}</p>
                <p><FaClock className="inline mr-2" />{selectedTime}</p>
                <p><FaMapMarkerAlt className="inline mr-2" />{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                <p><FaRupeeSign className="inline mr-2" />{service.price}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-4 rounded-lg text-left ${
                    paymentMethod === 'upi'
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-400'
                    }`} />
                    <span className="ml-3">UPI Payment</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-lg text-left ${
                    paymentMethod === 'card'
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-400'
                    }`} />
                    <span className="ml-3">Card Payment</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('cash')}
                  className={`w-full p-4 rounded-lg text-left ${
                    paymentMethod === 'cash'
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'cash'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-400'
                    }`} />
                    <span className="ml-3">Cash on Service</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => handleCardDetailsChange('number', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength={19}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => handleCardDetailsChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardDetailsChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                      placeholder="123"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {!otpVerified && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Verify Your Mobile Number</h3>
                {!showCustomerOTP ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendCustomerOTP}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
                  >
                    <FaMobile className="inline mr-2" />
                    Send OTP
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={customerOTP}
                      onChange={(e) => setCustomerOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVerifyCustomerOTP}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
                    >
                      Verify OTP
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {otpVerified && showServicemanOTP && !servicemanVerified && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Serviceman Confirmation</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Serviceman's OTP"
                    value={servicemanOTP}
                    onChange={(e) => setServicemanOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyServicemanOTP}
                    className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600"
                  >
                    Verify Serviceman
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-hidden flex flex-col"
      >
        {!isBookingConfirmed ? (
          <>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <FaTimes size={24} />
            </motion.button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Book {service.name}
              </h2>
              <p className="text-gray-600">Complete your booking in 3 simple steps</p>
            </div>

            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="flex flex-col items-center"
                  onClick={() => isStepComplete(step - 1) && setCurrentStep(step)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep === step
                        ? 'bg-blue-500 text-white'
                        : currentStep > step
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step ? <FaCheck /> : step}
                  </div>
                  <span className="text-sm mt-2">
                    {step === 1 ? 'Date & Time' : step === 2 ? 'Address' : 'Payment & Verification'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-1">
              {renderStep()}
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  Back
                </motion.button>
              )}
              {currentStep < 3 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    isStepComplete(currentStep)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <FaCheck className="text-white text-3xl" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-600">Your service has been scheduled successfully. ✨</p>
            <p className="text-blue-600 mt-2">We'll send you a confirmation email shortly! 📧</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingPage;
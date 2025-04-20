import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import MainPage from './MainPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'main'>('login');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserProfile(JSON.parse(userData));
      setCurrentPage('main');
    }
  }, []);

  const handleLoginSuccess = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserProfile(JSON.parse(userData));
      setCurrentPage('main');
    }
  };

  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage 
          onSignUpClick={() => setCurrentPage('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentPage === 'signup' && (
        <SignUpPage onLoginClick={() => setCurrentPage('login')} />
      )}
      {currentPage === 'main' && userProfile && (
        <MainPage initialUserProfile={userProfile} />
      )}
    </div>
  );
}

export default App;
import React, {useEffect, useState} from 'react';
import Login from './src/client/components/LoginScreen';
import Navigation from './src/client/components/Navigation';
import Toast from 'react-native-toast-message';
import {SavedJobsProvider} from './src/client/contexts/SavedJobContext';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const profile = await KakaoLogin.getProfile();
        if (profile.email !== null) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <SavedJobsProvider>
          <Navigation setLoggedIn={setIsLoggedIn} />
        </SavedJobsProvider>
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
      <Toast />
    </>
  );
}

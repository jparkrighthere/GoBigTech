import React from 'react';
import {SafeAreaView, View, Image, TouchableOpacity} from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import GoBigTech_logo from '../../assets/GoBigTech_logo.png';
import KakaoLogin_img from '../../assets/kakao_login_medium_narrow.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from '../utils/styles';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({onLoginSuccess}) => {
  const handleLogin = async () => {
    try {
      await KakaoLogin.login();
      const profile = await KakaoLogin.getProfile();

      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          name: profile.nickname,
        }),
      });

      if (response.ok) {
        await AsyncStorage.setItem('email', profile.email);
        await AsyncStorage.setItem('name', profile.nickname);
        onLoginSuccess();
        console.log('Login success');
      } else {
        console.error('Failed to save user info');
      }
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.logInContainer}>
      <View style={styles.innerContainer}>
        <Image source={GoBigTech_logo} style={styles.logInLogo} />
        <TouchableOpacity onPress={handleLogin}>
          <Image source={KakaoLogin_img} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

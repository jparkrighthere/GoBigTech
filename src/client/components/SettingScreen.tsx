import React, {useEffect, useState} from 'react';
import {View, Text, Image, Alert, TouchableOpacity} from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {styles} from '../utils/styles';
import logo_img from '../../assets/GoBigTech_logo.png';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingScreenProps {
  setLoggedIn: (value: boolean) => void;
}

const SettingScreen: React.FC<SettingScreenProps> = ({setLoggedIn}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedName = await AsyncStorage.getItem('name');
      setEmail(storedEmail);
      setName(storedName);
    };
    getEmail();
  }, []);

  const handleUnlink = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/unlink', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (response.ok) {
        console.log('Successfully unlinked account');
      }
      await AsyncStorage.removeItem('email');
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: '탈퇴 완료',
        text2: '계정이 탈퇴되었습니다.',
      });
    } catch (error) {
      console.error('Error unlinking account:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '탈퇴 실패',
        text2: '계정 탈퇴에 실패했습니다.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{name}님의 계정 설정</Text>
        <Image source={logo_img} style={styles.logo} />
      </View>
      <View style={styles.listContainer}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => {
            Alert.alert('로그아웃 확인', '로그아웃 하시겠습니까?', [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: async () => {
                  await KakaoLogin.logout();
                  await AsyncStorage.removeItem('email');
                  await AsyncStorage.removeItem('name');
                  setLoggedIn(false);
                },
              },
            ]);
          }}>
          <Text style={styles.listItemText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => {
            Alert.alert('계정 탈퇴 확인', '계정을 탈퇴하시겠습니까?', [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: async () => {
                  handleUnlink();
                  await AsyncStorage.removeItem('email');
                  await AsyncStorage.removeItem('name');
                  await KakaoLogin.unlink();
                  setLoggedIn(false);
                },
              },
            ]);
          }}>
          <Text style={styles.listItemText}>계정 탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;

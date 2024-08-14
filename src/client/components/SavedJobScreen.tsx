/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
} from 'react-native';
import {styles} from '../utils/styles';
import {imgMap} from '../utils/constants';
import logo_img from '../../assets/GoBigTech_logo.png';
import Toast from 'react-native-toast-message';
import {useSavedJobs} from '../contexts/SavedJobContext';
import {JobInfo} from '../utils/JobInfo';

const SavedJobScreen = () => {
  const {savedJobs, removeJob} = useSavedJobs();

  const handleRemoveJob = (job: JobInfo) => {
    Alert.alert('삭제 확인', '이 공고를 저장된 목록에서 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: async () => {
          try {
            await removeJob(job);
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: '삭제 완료',
              text2: '공고가 저장 목록에서 삭제되었습니다.',
            });
          } catch (error) {
            console.error('Error removing job:', error);
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: '삭제 실패',
              text2: '공고 삭제에 실패했습니다.',
            });
          }
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: JobInfo}) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
      <View style={styles.jobContainer}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text>
          {item.careerRequired ? item.careerRequired : '무관'} |{' '}
          {item.employmentType ? item.employmentType : '정규직'} |{' '}
          {item.deadline ? item.deadline : '채용시까지'}
        </Text>
        <Text>{'\n\n'}</Text>
        {item.location && <Text>근무지: {item.location}</Text>}
        {item.company && <Text>계열사: {item.company}</Text>}
        <Text>{'\n\n'}</Text>
        <TouchableOpacity
          style={styles.starButton}
          onPress={() => handleRemoveJob(item)}>
          <Text style={{color: 'gold', fontSize: 20}}>★</Text>
        </TouchableOpacity>
        <Image source={imgMap[item.tag]} style={styles.companyLogo} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>저장된 채용 공고</Text>
        <Image source={logo_img} style={styles.logo} />
      </View>
      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>저장된 공고가 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

export default SavedJobScreen;

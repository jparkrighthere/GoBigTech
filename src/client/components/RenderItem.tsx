/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  Linking,
  Image,
} from 'react-native';
import {styles} from '../utils/styles';
import {JobInfo} from '../utils/JobInfo';
import {useSavedJobs} from '../contexts/SavedJobContext';
import {imgMap} from '../utils/constants';
import Toast from 'react-native-toast-message';

const RenderItem = ({item}: {item: JobInfo}) => {
  const {savedJobs, saveJob, removeJob} = useSavedJobs();
  const handleSaveJob = async (job: JobInfo) => {
    try {
      const isJobSaved = savedJobs.some(savedJob => savedJob.id === job.id);
      if (isJobSaved) {
        await removeJob(job);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: '삭제 완료',
          text2: '공고가 저장 목록에서 삭제되었습니다.',
        });
      } else {
        await saveJob(job);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: '저장 완료',
          text2: '공고가 저장 목록에 추가되었습니다.',
        });
      }
    } catch (error) {
      console.error('Error updating saved jobs:', error);
    }
  };

  const isJobSaved = savedJobs.some(savedJob => savedJob.id === item.id);

  return (
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
          onPress={() =>
            Alert.alert(
              isJobSaved ? '삭제' : '저장',
              isJobSaved
                ? '이 공고를 저장된 목록에서 삭제하시겠습니까?'
                : '이 공고를 저장하시겠습니까?',
              [
                {
                  text: '취소',
                  style: 'cancel',
                },
                {
                  text: isJobSaved ? '삭제' : '저장',
                  onPress: () => handleSaveJob(item),
                },
              ],
            )
          }>
          <Text style={{color: isJobSaved ? 'gold' : 'grey'}}>★</Text>
        </TouchableOpacity>
        <Image source={imgMap[item.tag]} style={styles.companyLogo} />
      </View>
    </TouchableOpacity>
  );
};

export default RenderItem;

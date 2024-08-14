/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
} from 'react-native';
import logo_img from '../../assets/GoBigTech_logo.png';
import {styles} from '../utils/styles';
import {imgMap} from '../utils/constants';
import {useSavedJobs} from '../contexts/SavedJobContext';
import {JobInfo} from '../utils/JobInfo';
import Toast from 'react-native-toast-message';
import {sortJobsByDeadline} from '../utils/jobUtils';

const SearchJobScreen = ({jobs}: {jobs: JobInfo[]}) => {
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredJobs = jobs.filter(job => {
    const searchLowerCase = searchQuery.toLowerCase();
    return (
      (job.title && job.title.toLowerCase().includes(searchLowerCase)) ||
      (job.company && job.company.toLowerCase().includes(searchLowerCase)) ||
      (job.employmentType &&
        job.employmentType.toLowerCase().includes(searchLowerCase)) ||
      (job.careerRequired &&
        job.careerRequired.toLowerCase().includes(searchLowerCase))
    );
  });

  const sortedJobs = sortJobsByDeadline(filteredJobs);

  const renderItem = ({item}: {item: JobInfo}) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>채용 공고 검색</Text>
        <Image source={logo_img} style={styles.logo} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="어떤 직무를 찾고 계신가요?"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      {searchQuery.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            {sortedJobs.length}개의 검색 결과
          </Text>
          {sortedJobs.length > 0 ? (
            <FlatList
              disableVirtualization={false}
              data={sortedJobs}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default SearchJobScreen;

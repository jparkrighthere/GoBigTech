/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import JobListScreen from './JobListScreen';
import SearchJobScreen from './SearchJobScreen';
import SavedJobScreen from './SavedJobScreen';
import SettingScreen from './SettingScreen';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

interface NavigationProps {
  setLoggedIn: (value: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({setLoggedIn}) => {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const serverUrl = 'http://localhost:3000/api/jobs';
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await fetch(serverUrl, requestOptions);
        if (response.ok) {
          console.log('Successfully loaded jobs');
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="JobList">
        <Tab.Screen
          name="JobList"
          options={{
            title: '목록',
            headerShown: false,
            tabBarIcon: () => <Icon name="list" size={15} />,
          }}>
          {() => <JobListScreen jobs={jobs} />}
        </Tab.Screen>
        <Tab.Screen
          name="SearchJob"
          options={{
            title: '검색',
            headerShown: false,
            tabBarIcon: () => <Icon name="search" size={15} />,
          }}>
          {() => <SearchJobScreen jobs={jobs} />}
        </Tab.Screen>
        <Tab.Screen
          name="SavedJobs"
          options={{
            title: '저장',
            headerShown: false,
            tabBarIcon: () => <Icon name="bookmark" size={15} />,
          }}>
          {() => <SavedJobScreen />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={{
            title: '설정',
            headerShown: false,
            tabBarIcon: () => <Icon name="user" size={15} />,
          }}>
          {() => <SettingScreen setLoggedIn={setLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

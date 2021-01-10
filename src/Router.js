import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import {WelcomeScreen, VideoScreen} from './Container';
export default function Router() {
  let selectedContainer;
  const containers = {
    Welcome: 'Welcome',
    Video: 'Video',
  };
  const [container, setContainer] = useState(containers.Welcome);
  const [streamId, setStreamId] = useState('');
  switch (container) {
    case containers.Welcome:
      selectedContainer = (
        <WelcomeScreen
          streamId={streamId}
          setStreamId={setStreamId}
          containers={containers}
          setContainer={setContainer}
        />
      );
      break;

    case containers.Video:
      selectedContainer = <VideoScreen />;
      break;

    default:
      selectedContainer = <Text>Error Container not selexcted</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>{selectedContainer}</SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

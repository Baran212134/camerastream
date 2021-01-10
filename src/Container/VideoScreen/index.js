import React, {useRef, useState} from 'react';
import 'react-native-get-random-values';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {RNFFmpeg} from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import {VLCPlayer, VlCPlayerView} from 'react-native-vlc-media-player';
const streamDeviceDomain = '93.47.192.183';
const streamingDevice = {
  ip: streamDeviceDomain,
  url: `rtsp://${streamDeviceDomain}:554/live/ch00_0`,
};
const videoFormat = 'mp4';
const photoFormat = 'jpg';
const FN = {
  video: `streamVideo.${videoFormat}`,
  photo: `streamPhoto${uuidv4().substring(0, 3)}.${photoFormat}`,
};
import Carousel from 'react-native-anchor-carousel';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const calcVLCPlayerHeight = (windowWidth, aspetRatio) => {
  return windowWidth * aspetRatio;
};
export default function VideoScreen() {
  const vlcRef = useRef('null');
  const carouselRef = useRef(null);
  const recordVideo = async () => {
    setCheck(true);
    console.log('record video basladı');
    if (streamingDevice.url) {
      console.log('record video if e girdi');
      const videoPath = `${RNFS.ExternalDirectoryPath}/${FN.video}`;
      const FFMPEGcommand = `-i ${streamingDevice.url} -b:v 1000000 -c:v copy -r 60 -y ${videoPath}`;
      const videoResult = await RNFFmpeg.execute(FFMPEGcommand);
      console.log('video kayıt bitti');
    }
  };
  const [check, setCheck] = useState(false);
  const [dir, setDir] = useState(null);
  const takeSnap = async () => {
    setCheck(true);
    console.log('takeSnap basladı');
    if (streamingDevice.url) {
      console.log('takeSnap if e girdi');
      const photoPath = `${RNFS.ExternalDirectoryPath}/${FN.photo}`;
      //const FFMPEGcommand = `-i ${streamingDevice.url} -b:v 1000000 -c:v copy -r 60 -y ${videoPath}`;
      const FFMPEGcommand = `-y -i ${streamingDevice.url} -frames:v 1 ${photoPath}`;
      //-y -i rtsp -vframes 1 do.jpg
      const photoResult = await RNFFmpeg.execute(FFMPEGcommand);
      console.log('snap bitti');
    }
    setCheck(false);
  };
  const readFile = async () => {
    RNFS.readDir(RNFS.ExternalDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        console.log('GOT RESULT', result[0].name);
        console.log(`${RNFS.ExternalDirectoryPath}/${result[0].name}`);
        setDir(result);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  };

  const stopVideoRecording = () => {
    console.log('stop video basladı');
    if (streamingDevice.url) {
      console.log('stop video if e girdi');
      RNFFmpeg.cancel();
    }
    setCheck(false);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.headingView}>
            <Text style={styles.heading}>RTSP CAMERA</Text>
          </View>
          <View style={styles.body}>
            <VLCPlayer
              source={{
                initType: 2,
                hwDecoderEnabled: 1,
                hwDecoderForced: 1,
                uri: 'rtsp://93.47.192.183:554/live/ch00_0',
                initOptions: [
                  '--no-audio',
                  '--rtsp-tcp',
                  '--network-caching=150',
                  '--rtsp-caching=150',
                  '--no-stats',
                  '--tcp-caching=150',
                  '--realrtsp-caching=150',
                ],
              }}
              autoplay={true}
              autoAspectRatio={true}
              resizeMode="cover"
              // videoAspectRatio={"4:3"}
              isLive={true}
              autoReloadLive={true}
              style={{
                height: calcVLCPlayerHeight(
                  Dimensions.get('window').width,
                  3 / 4,
                ),
              }}
            />
          </View>
        </ScrollView>
        <View
          style={{
            height: calcVLCPlayerHeight(Dimensions.get('window').width, 3 / 4),
          }}>

        </View>
        <View style={styles.carouselContainer}>
          <TouchableOpacity
            style={[styles.startButton, check ? styles.startButton1 : null]}
            activeOpacity={0.7}
            onLongPress={recordVideo}
            onPressOut={stopVideoRecording}
            onPress={takeSnap}>
            <View style={[check ? styles.View1 : null]}>
              <Text>start</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  View1: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {flex: 1},
  video: {width: '100%', height: 300},
  carouselContainer: {
    height: 150,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousel: {
    flex: 1,
  },
  startButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'gray',
  },
  startButton1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'black',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  headingView: {alignItems: 'center', justifyContent: 'center'},
  heading: {
    fontSize: 25,
    fontWeight: '600',
    color: Colors.black,
  },
  body: {
    backgroundColor: Colors.white,
  },
});

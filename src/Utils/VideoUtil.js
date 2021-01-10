import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
async function androidResourcePath(resourceName) {
  const destinationPath = RNFS.CachesDirectoryPath + '/' + resourceName;

  await RNFS.copyFileAssets(resourceName, destinationPath).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(
      'Failed to copy android resource: ' +
        resourceName +
        ', err message: ' +
        err.message +
        ', err code: ' +
        err.code,
    );
    return undefined;
  });

  return destinationPath;
}

function iosResourcePath(resourceName) {
  return new Promise((resolve) => {
    resolve(RNFS.MainBundlePath + '/' + resourceName);
  });
}

const resourcePath = (resourceName) => {
  if (Platform.OS === 'ios') {
    return iosResourcePath(resourceName);
  } else {
    return androidResourcePath(resourceName);
  }
};

// const vide = (image1, video) =>
//   '-i ' +
//   video +
//   ' ' +
//   '-i' +
//   image1 +
//   ' ' +
//   '-filter_complex ' +
//   '[0:v]:[1:v] overlay=50:50' +
//   ' -pix_fmt yuv420p -c:a copy' +
//   outPutVideoPath;

const getSaveVideoCommand = (image1, video) => {
  const uuid = uuidv4();
  return {
    command: `-i ${video} -i ${image1} -filter_complex overlay=50:50 ${RNFS.CachesDirectoryPath}/video_${uuid}.mp4`,
    pathName: RNFS.CachesDirectoryPath + '/video_' + uuid + '.mp4',
  };
};

export {resourcePath, getSaveVideoCommand};

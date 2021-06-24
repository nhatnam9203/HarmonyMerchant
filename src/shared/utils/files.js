import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { formatBytes } from './format';

export const createFilePath = async (body) => {
  const dirs = RNFetchBlob.fs.dirs;
  try {
    const fileDownload = await RNFetchBlob.config({
      title: `${body.fileName}.${body.extention}`,
      fileCache: true,
      appendExt: `${body.extention}`,
      useDownloadManager: true,
      mediaScannable: true,
      notification: true,
      description: 'File downloaded by download manager.',
      path: `${dirs.DocumentDir}/${body.fileName}.${body.extention}`,
    }).fetch('GET', body.url, {});

    return fileDownload.path();
  } catch (error) {
    return null;
  }
};

// popup handle file download, when button downloaded file pressed
export const handleTheDownloadedFile = (pathFile) => {
  // console.log('pathFile',pathFile)
  if (Platform.OS === 'ios') {
    RNFetchBlob.ios.previewDocument(pathFile);
  } else {
    const android = RNFetchBlob.android;
    android.actionViewIntent(
      pathFile,
      'application/vnd.android.package-archive'
    );
  }
};

export const getInfoPathFile = async (pathFile) => {
  try {
    let info = await RNFetchBlob.fs.stat(pathFile);
    info.size = formatBytes(info.size);
    return info;
  } catch (error) {
    return null;
  }
};

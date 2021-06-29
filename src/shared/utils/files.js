import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { formatBytes, uppercaseFirstLetter } from './format';
import Share from 'react-native-share';
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

export const handleShareFile = async (title, url) => {
  const shareOptions = {
    title,
    failOnCancel: false,
    saveToFiles: true,
    url,
  };
  // If you want, you can use a try catch, to parse
  // the share response. If the user cancels, etc.
  try {
    const ShareResponse = await Share.open(shareOptions);
    // console.log('ShareResponse', JSON.stringify(ShareResponse, null, 2));
  } catch (error) {
    // console.log('Error =>', error);
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

// create title for time, to set default title print
export const getTimeTitleFile = (initTitle, values) => {
  const { timeStart, timeEnd, quickFilterText, quickFilter } = values || {};
  let title = '';
  if (quickFilter === 'custom') {
    if (timeEnd && timeStart) {
      title = ` ${timeStart.split('/').join('')} - ${timeEnd
        .split('/')
        .join('')}`;
    }
  } else {
    title = uppercaseFirstLetter(quickFilter) ?? 'ThisWeek';
  }
  return initTitle + (title?.replaceAll(' ', '') ?? '');
};

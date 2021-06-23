import useAxios from 'axios-hooks';
import { UPLOAD_FILE } from '../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';
import FormData from 'form-data';
import { Platform } from 'react-native';

export const useUploadFile = () => {
  const createFormData = (data, images) => {
    const formData = new FormData();
    if (data) {
      formData.append('data', data);
    }

    if (images) {
      images.forEach((image, i) => {
        formData.append('files[]', {
          ...image,
          uri:
            Platform.OS === 'android'
              ? image.uri
              : image.uri.replace('file://', ''),
          name: image.fileName ?? `image-${i}`,
          type: 'image/jpeg', // it may be necessary in Android.
        });
      });
    }

    return formData;
  };

  const [
    { data: uploadData, loading: uploadLoading, error, response },
    execute,
  ] = useAxios(UPLOAD_FILE, {
    manual: true,
  });

  const uploadFile = (images) => {
    execute({
      data: createFormData(null, images),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return [{ uploadData, uploadLoading }, uploadFile];
};

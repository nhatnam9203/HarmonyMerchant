import NavigationServices from "@navigators/NavigatorServices";

const CODE_TYPE = {
  NONE: 0,
  SUCCESS: 1,
  INVALID: 2,
  DUPLICATE: 3,
  UNKNOWN: 4, // Something went wrong.
  UNAUTHORIZED: 5,
  EMPTY: 6,
  NOT_FOUND: 7,
};

const processNetworkError = () => {};

const processResponseError = (codeNumber, codeStatus, message) => {
  switch (parseInt(codeNumber, 10)) {
    case 401:
      if (parseInt(codeStatus) === CODE_TYPE.UNAUTHORIZED) {
        // UNAUTHORIZED
        NavigationServices.logout();
      } else {
        // NavigationServices.logout();
        alert("Permission Denied");
      }
      break;

    case 404: // not found
      break;

    case 400: // thieu field
      if (codeStatus !== 2 && codeStatus !== 5 && codeStatus !== 4) {
        // exception cho phone not exist -> checkout
        setTimeout(() => {
          alert(`${message}`);
        }, 100);
      }

      break;
    default:
      break;
  }

  return { message, codeNumber, codeStatus };
};

export const ErrorHandler = (response, error) => {
  if (response) {
    const status = response.status;
    switch (status) {
      case 200:
      default:
        const { codeStatus, message, codeNumber, data } = response.data;
        response = processResponseError(
          codeNumber ?? status,
          codeStatus,
          message
        );
        break;
    }
  }

  // if (error.request) {
  //   if (error.message.includes('timeout')) {
  //     throw 'TIME_OUT';
  //   } else if (error.message.includes('Network Error')) {
  //     throw 'NET_WORK_REQUEST_FAIL';
  //   } else {
  //     throw error;
  //   }
  // }

  return response;
};

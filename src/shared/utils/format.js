import moment from "moment";
import _ from "lodash";
import { SORT_TYPE } from "./app";

export const trimSpaces = (text) => text && text.replace(/\s/g, "");

export const pad2 = (number) => (number < 10 ? "0" : "") + number;

export const pad_ = (n, len) =>
  (0).toFixed(len).slice(2, -n.toString().length) + n.toString();

export const DATE_FORMAT_STRING = "MM/DD/YYYY";
export const BIRTH_DAY_DATE_FORMAT_STRING = "MM/DD/YYYY";
export const DATE_SHOW_FORMAT_STRING = "LL";
export const DATE_TIME_SHOW_FORMAT_STRING = "LLL";

export const dateToString = (
  d = new Date(),
  formatString = DATE_FORMAT_STRING
) => {
  return moment(d).format(formatString);
};

export const hours = (d, extraMinutes = 0) => {
  const dateString = d ?? new Date();
  return moment(dateString)
    .add("7:00", "hours")
    .add(extraMinutes, "minutes")
    .format("hh:mm A");
};

export const splitCodeAndPhone = (phone) => {
  if (`${phone}`.includes("+1")) {
    const temptPhone = phone?.split("+1");
    return {
      phone: temptPhone[1],
      areaCode: "1",
    };
  } else if (`${phone}`.includes("+84")) {
    const temptPhone = phone?.split("+84");

    return {
      phone: temptPhone[1],
      areaCode: "84",
    };
  }
  return {
    phone: phone,
    areaCode: "1",
  };
};

export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");

  // Format Phone Us
  var matchUS = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (matchUS) {
    var intlUSCode = matchUS[1] ? "+1 " : "";
    return [
      intlUSCode,
      "(",
      matchUS[2],
      ") ",
      matchUS[3],
      "-",
      matchUS[4],
    ].join("");
  }

  // Format Phone Vietnamese
  var matchVN = cleaned.match(/^(84|)?(\d{3})(\d{3})(\d{3})$/);
  if (matchVN) {
    var intlVNCode = matchVN[1] ? "+84 " : "";
    return [intlVNCode, matchVN[2], "-", matchVN[3], "-", matchVN[4]].join("");
  }

  return null;
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 bytes";
  const byte = 1024;
  const sizes = ["bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
  const i = Math.floor(Math.log(bytes) / Math.log(byte));
  return parseFloat((bytes / Math.pow(byte, i)).toFixed(2)) + sizes[i];
};

export const uppercaseFirstLetter = (string = "") => {
  let firstLetter = string.charAt(0).toUpperCase();
  return firstLetter + string?.slice(1);
};

export const formatFullAddress = ({ city, stateName, street, zipCode }) => {
  let addressInfo = { street, city, stateName, zipCode };
  let addressNotEmpty = Object.values(addressInfo).filter((item) => item);

  if (addressNotEmpty.length > 0) return addressNotEmpty.join(", ");
  return "";
};

export const dateCompare = (a, b) => {
  if (!a || !b) return 0;

  // check valid date -> sort date
  if (moment(a).isValid() && moment(b).isValid()) {
    return new Date(a) - new Date(b);
  }
  return a.toString().localeCompare(b.toString());
};

export const sortByDate = (items, sort, sortKey) => {
  let sortList = [...items]; // clone
  if (sortKey && sortList?.length > 0) {
    return sortList.sort((a, b) => {
      if (sort === SORT_TYPE.DESC) {
        return dateCompare(a[sortKey], b[sortKey]);
      } else if (sort === SORT_TYPE.ASC) {
        return dateCompare(b[sortKey], a[sortKey]);
      } else return 0;
    });
  }
  return sortList;
};

export const forgotPincode = (data) => ({
  queryId: "forgotPincode",
  params: {
    url: `/staff/forgotpin`,
    method: "POST",
    data,
  },
});

export const staffLoginRequest = (merchantID, pinCode) => ({
  params: {
    url: "/staff/login",
    method: "POST",
    data: {
      merchantCode: merchantID,
      staffPin: pinCode,
    },
  },
});

export const addStaff = (data) => ({
  queryId: "addStaff",
  params: {
    url: `staff?api-version=1.1`,
    method: "POST",
    data,
  },
});

export const getStaffById = (staffId, merchantId) => ({
  queryId: "getStaffById",
  params: {
    url: `/staff/${staffId}`,
    method: "GET",
  },
});

export const updateStaff = (staffId, data) => ({
  queryId: "updateStaff",
  params: {
    url: `staff/${staffId}?api-version=1.1`,
    method: "PUT",
    data,
  },
});

export const getStaffByDate = (merchantId, date) => ({
  queryId: "getStaffByDate",
  params: {
    url: `staff/getbydate/${merchantId}?date=${date}`,
    method: "GET",
  },
});

export const getStaffOfService = (serviceId, date) => ({
  queryId: "getStaffOfService",
  params: {
    url: `/staff/byService/${serviceId}`,
    method: "GET",
  },
});

export const staffGetAvaiableTime = (staffId, data) => ({
  queryId: "staffGetAvaiableTime",
  params: {
    url: `staff/getavailabletime/${staffId}`,
    method: "PUT",
    data,
  },
});

export const getStaffByMerchant = (merchantId) => ({
  queryId: "getStaffByMerchant",
  params: {
    url: `staff/getbymerchant/${merchantId}`,
    method: "GET",
  },
});

export const archiveStaff = (staffId) => ({
  queryId: "ArchiveStaff",
  params: {
    url: `staff/archive/${staffId}`,
    method: "PUT",
  },
});

export const restoreStaff = (staffId) => ({
  queryId: "ArchiveStaff",
  params: {
    url: `staff/restore/${staffId}`,
    method: "PUT",
  },
});

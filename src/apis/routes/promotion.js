export const getPromotionMerchant = () => ({
  queryId: "getPromotionMerchant",
  params: {
    url: `/MerchantPromotion?api-version=1.2`,
    method: "GET",
  },
});

export const getMarketPlaces = (page = 1) => ({
  queryId: "getMarketPlaces",
  params: {
    url: `/MarketPlace?page=${page}`,
    method: "GET",
  },
});

export const getSmsInformation = (conditionId) => ({
  queryId: "getSmsInformation",
  params: {
    url: `MerchantPromotion/smsLength/${conditionId}?api-version=1.2`,
    method: "GET",
  },
});

export const createNewCampaign = (data) => ({
  queryId: "createNewCampaign",
  params: {
    url: `MerchantPromotion?api-version=1.2`,
    method: "POST",
    data,
  },
});

export const updatePromotionById = (promotionId, data) => ({
  queryId: "updatePromotionById",
  params: {
    url: `MerchantPromotion/${promotionId}?api-version=1.2`,
    method: "PUT",
    data,
  },
});

export const getPromotionDetailById = (promotionId) => ({
  queryId: "getPromotionDetailById",
  params: {
    url: `MerchantPromotion/${promotionId}?api-version=1.2`,
    method: "GET",
  },
});

export const disablePromotionById = (promotionId) => ({
  queryId: "disablePromotionById",
  params: {
    url: `MerchantPromotion/disable/${promotionId}?api-version=1.2`,
    method: "PUT",
    data: {},
  },
});

export const deletePromotion = (promotionId) => ({
  queryId: "disablePromotionById",
  params: {
    url: `MerchantPromotion/${promotionId}`,
    method: "DELETE",
    data: {},
  },
});

export const enablePromotionById = (promotionId) => ({
  queryId: "enablePromotionById",
  params: {
    url: `MerchantPromotion/enable/${promotionId}?api-version=1.2`,
    method: "PUT",
    data: {},
  },
});

export const getPromotionAppointment = (appointmentId) => ({
  queryId: "getPromotionAppointment",
  params: {
    url: `appointment/promotion/${appointmentId}`,
    method: "GET",
  },
});

export const customPromotion = (appointmentId, data) => ({
  queryId: "customPromotion",
  params: {
    url: `appointment/custompromotion/${appointmentId}`,
    method: "PUT",
    data,
  },
});

export const addPromotionNote = (appointmentId, data) => ({
  queryId: "addPromotionNote",
  method: "POST",
  params: {
    url: `appointment/promotion/note/${appointmentId}`,
    method: "POST",
    data,
  },
});

export const setSchedulePromotion = (promotionId, isSchedule) => ({
  queryId: "SchedulePromotion",
  params: {
    url: `MerchantPromotion/UpdateIsSchedule/${promotionId}`,
    method: "PUT",
    data: { isSchedule },
  },
});

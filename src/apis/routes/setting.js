export const getAdvanceSetting = () => ({
  queryId: "getAdvanceSetting",
  params: {
    url: `merchant/setting/advance`,
    method: "GET",
  },
});

export const editAdvanceSetting = (data) => ({
  queryId: "editAdvanceSetting",
  params: {
    url: `merchant/setting/advance`,
    method: "PUT",
    data,
  },
});

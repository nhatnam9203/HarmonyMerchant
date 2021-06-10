export const email = RegExp(
  /^[a-z0-9](\.?[a-z0-9])+@(\.?[a-z0-9])+\.[a-zA-Z]{2,4}$/,
);

export const isEmail = (value) => {
  return email.test(String(value).toLowerCase());
};

import NavigationServices from "@navigators/NavigatorServices";
import { appMerchant, authMerchant } from "@redux/slices";
// import { useSignIn } from '@shared/services/api/merchant';
import { getTerminalIds, statusSuccess } from "@shared/utils/app";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import actions from "@redux/actions";

const log = (obj, message = "") => {
  Logger.log(`[SiginScreen] ${message}`, obj);
};

const terminalIDs = getTerminalIds();

export const useProps = ({ navigation }) => {
  /**
  |--------------------------------------------------
  | VARIABLES
  |--------------------------------------------------
  */
  const { t } = useTranslation();
  const SignInSchema = Yup.object().shape({
    email: Yup.string().required(t("Email is required!")),
    password: Yup.string()
      .min(1, t("Password is short!"))
      .max(30, t("Password is long!"))
      .required(t("Password is required")),
    terminalId: Yup.string().required(t("Terminal is required")),
  });
  const inputIdRef = React.useRef(null);
  const inputPassRef = React.useRef(null);
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = React.useState(null);
  const toggleCheckBox = useSelector((state) => state.appMerchant.rememberMID);
  const merchantID = useSelector((state) => state.appMerchant.merchantID);
  const errorLogin = useSelector((state) => state.auth.errorLogin);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  // const [loginData, merchantLogin] = useSignIn();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const signInFormik = useFormik({
    initialValues: {
      email: merchantID,
      password: "",
      terminalId: terminalIDs[1].value,
    },
    validationSchema: SignInSchema,
    onSubmit: ({ email, password, terminalId }) => {
      dispatch(actions.auth.login(email, password, terminalId, toggleCheckBox));
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  // React.useEffect(() => {
  //   if (!loginData) {
  //     return;
  //   }
  //   const { codeStatus, message, data } = loginData;
  //   console.log(codeStatus);
  //   if (statusSuccess(codeStatus)) {
  //     setErrorMsg(null);
  //     dispatch(authMerchant.signInSuccess(data));
  //     dispatch(
  //       appMerchant.saveMerchantID(
  //         toggleCheckBox ? data?.merchant?.merchantCode : null
  //       )
  //     );

  //     return;
  //   }

  //   if (message) {
  //     setErrorMsg(message);
  //   }
  // }, [loginData]);

  React.useEffect(() => {
    const { email, password, terminalId } = signInFormik.errors;
    if (email) {
      setErrorMsg(email);
    } else if (password) {
      setErrorMsg(password);
    } else if (terminalId) {
      setErrorMsg(terminalId);
    } else {
      setErrorMsg(null);
    }
  }, [signInFormik.errors]);

  React.useEffect(() => {
    if (errorLogin) alert(errorLogin);
  }, [errorLogin]);

  return {
    inputIdSubmit: () => {
      setErrorMsg(null);
      inputPassRef?.current?.focus();
    },
    inputIdRef,
    onChangeMerchantId: (text) => {
      if (errorMsg) setErrorMsg(null);
    },
    inputPassSubmit: () => {
      setErrorMsg(null);
    },
    inputPassRef,

    onForgotPasswordPress: () => {
      // NavigationServices.navigate('merchant.forgotpassword');
    },
    terminalIDs: terminalIDs,
    errorMsg,
    toggleCheckBox,
    setToggleCheckBox: (value) => {
      dispatch(appMerchant.rememberMID(value));
    },
    signInFormik,
  };
};

import NavigationServices from "@navigators/NavigatorServices";
import { addStaffByMerchant, editStaff } from "@redux/actions/staff";
import { STAFF_PERMISSIONS, STAFF_PERMISSIONS_ROLES } from "@shared/utils";
import { BusinessWorkingTime } from "@utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import actions from "@actions";
import { useFocusEffect } from "@react-navigation/native";

let counter = -1000000;

const INITIAL_VALUE_STAFF = {
  firstName: "",
  lastName: "",
  displayName: "",
  address: {
    street: "",
    city: "",
    state: 0,
    zip: "",
  },
  cellphone: "",
  email: "",
  pin: "",
  confirmPin: "",
  isActive: true,
  isDisabled: 0,
  workingTime: BusinessWorkingTime,
  birthdate: "",
  gender: "",
  roles: {
    nameRole: "Admin",
  },
  driverlicense: null,
  socialSecurityNumber: null,
  professionalLicense: null,
  tipFee: {
    percent: {
      value: "0.0",
      isCheck: false,
    },
    fixedAmount: {
      value: "0.0",
      isCheck: false,
    },
  },
  salary: {
    perHour: {
      value: "0.00",
      isCheck: true,
    },
    commission: {
      value: [],
      isCheck: false,
    },
  },
  productSalary: {
    perHour: {
      value: "0.00",
      isCheck: true,
    },
    commission: {
      value: "0.00",
      isCheck: false,
    },
  },
  cashPercent: 0,
  fileId: 0,
  imageUrl: "",
  categories: [],
  permission: STAFF_PERMISSIONS_ROLES,
};

const SALARY_TYPE = {
  COMMISSION: "commission",
  PER_HOUR: "per Hour",
};

export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const roleSelectRef = React.useRef(null);

  const staffDetail = useSelector((state) => state.staff?.staffDetail);

  const [errorMsg, setErrorMsg] = React.useState(null);
  const [current_staff, setCurrentStaff] = React.useState(null);
  const [salary, setSalary] = React.useState(SALARY_TYPE.PER_HOUR);
  const [staffPermission, setStaffPermission] = React.useState("Admin");
  const [permission, setPermission] = React.useState(STAFF_PERMISSIONS_ROLES);
  const [staffId, setStaffId] = React.useState(null);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  // new
  const createStaff = (staff) => {
    dispatch(addStaffByMerchant(staff, false, buttonCancelPress));
  };
  // edit
  const editStaffs = (staff, id) => {
    dispatch(editStaff(staff, id, false, buttonCancelPress));
  };

  // !! ??
  const updateObject = (values) => {
    const keys = Object.keys(values);
    const newValues = { ...INITIAL_VALUE_STAFF };
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      newValues[element] = values[element];
    }
    return newValues;
  };
  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: item ?? INITIAL_VALUE_STAFF,
    validationSchema: Yup.object().shape({
      lastName: Yup.string().required(t("LastName is required!")),
      firstName: Yup.string().required(t("FirstName is required!")),
      cellphone: Yup.string().required(t("Phone is required")),
      email: Yup.string().email(t("Email not valid!")),
      birthdate: Yup.string(),
      gender: Yup.string(),
      pin: Yup.string().length(4, "Pin code must have 4 digits"),
      roleName: Yup.string(),
    }),
    onSubmit: (values) => {
      const displayName = values.firstName + " " + values.lastName;
      values.displayName = displayName;
      values.confirmPin = values.pin;

      if (isNew) {
        values.roles = {
          nameRole: staffPermission,
        };
        if (staffPermission === "Manager") {
          values.permission = permission;
        }
        createStaff(values);
      } else if (isEdit) {
        let newValues = updateObject(values);
        newValues.roles = {
          nameRole: staffPermission,
        };
        if (staffPermission === "Manager") {
          newValues.permission = permission;
        }
        editStaffs(newValues, current_staff.staffId);
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  useFocusEffect(
    React.useCallback(() => {
      if (item) {
        setCurrentStaff(null);
        setStaffId(item?.staffId);
        dispatch(actions.staff.getDetailStaffByMerchantId(item?.staffId));
      }
    }, [item])
  );

  React.useEffect(() => {
    if (staffDetail && staffId && staffId === staffDetail.staffId) {
      setCurrentStaff(staffDetail);

      if (staffDetail.productSalaries?.commission?.isCheck) {
        setSalary(SALARY_TYPE.COMMISSION);
      } else {
        setSalary(SALARY_TYPE.PER_HOUR);
        form?.setFieldValue("salary.perHour.isCheck", true);
        form?.setFieldValue("salary.commission.isCheck", false);
        form?.setFieldValue("productSalary.perHour.isCheck", true);
        form?.setFieldValue("productSalary.commission.isCheck", false);
      }

      setStaffPermission(staffDetail?.roleName);
      if (staffDetail.roleName === "Manager") {
        setPermission(
          staffDetail.permission?.length > 0
            ? STAFF_PERMISSIONS_ROLES.map((value) => {
                const per = staffDetail.permission.find(
                  (x) => x.key === value.key
                );
                return per ?? value;
              })
            : STAFF_PERMISSIONS_ROLES
        );
      }

      roleSelectRef.current?.selectIndex(
        STAFF_PERMISSIONS?.findIndex(
          (x) => x.value === staffDetail?.roleName
        ) || 0
      );
    }
  }, [staffDetail, staffId]);

  const buttonCancelPress = () => {
    NavigationServices.goBack();
  };

  return {
    isNew,
    isEdit,
    current_staff,
    buttonCancelPress,
    form,
    salary,
    setSalary,
    SALARY_TYPE,
    onChangeStaffPermissions: (val) => {
      setStaffPermission(val);
      form.setFieldValue("roleName", val);
      if (val === "Manager") {
        setPermission(
          current_staff?.permission?.length > 0
            ? STAFF_PERMISSIONS_ROLES.map((value) => {
                const per = current_staff?.permission.find(
                  (x) => x.key === value.key
                );
                return per ?? value;
              })
            : STAFF_PERMISSIONS_ROLES
        );
      }
    },
    staffPermission,
    permission,
    onChangePermissionRole: (it) => {
      if (!permission || permission?.length <= 0) return;
      const index = permission?.findIndex((x) => x.key === it.key);
      permission[index] = it;
      setPermission(permission);
    },
    roleSelectRef,
  };
};

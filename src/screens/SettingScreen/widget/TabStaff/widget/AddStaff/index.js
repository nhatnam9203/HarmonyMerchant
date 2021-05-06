import React from "react";
import { Alert } from "react-native";
import _ from "ramda";

import Layout from "./layout";
import strings from "./strings";
import {
  validateEmail,
  getIdStateByName,
  getNameStateById,
  getCodeAreaPhone,
  scaleSzie,
  checkStateIsValid,
  BusinessWorkingTime,
  formatNumberFromCurrency,
} from "@utils";

const initState = {
  user: {
    firstName: "",
    lastName: "",
    displayName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cellphone: "",
    email: "",
    pin: "",
    confirmPin: "",
    isActive: true,
    isDisabled: "Active",
    roles: {
      nameRole: "Admin",
    },
    driverlicense: "",
    socialSecurityNumber: "",
    professionalLicense: "",
  },
  staffId: "",
  tipFee: {
    percent: {
      value: "",
      isCheck: false,
    },
    fixedAmount: {
      value: "",
      isCheck: false,
    },
  },
  salary: {
    perHour: {
      value: "0.00",
      isCheck: false,
    },
    commission: {
      value: [
        {
          from: 0,
          to: 0,
          commission: 0
        }
      ],
      isCheck: false,
    },
  },
  productSalary: {
    commission: {
      value: 0,
      isCheck: false,
    },
  },
  cashPercent: 0,
  fileId: 0,
  imageUrl: "",
  isSubmitButton: true,
  value: {},
  dynamicMarginBottomState: 24,
  rowsSalaryIncome: 0,
  isEditStaff: false,
  staffIdCheck: 0,
  categories: [],
  isEditSSN: false
}

class AddStaff extends Layout {
  constructor(props) {
    super(props);
    const { profile } = this.props;
    this.state = {
      ...initState,
      workingTime: profile.businessHour
        ? profile.businessHour
        : BusinessWorkingTime,
    };
    this.browserFileRef = React.createRef();
    this.cellphoneRef = React.createRef();
    this.scrollStaffRef = React.createRef();
    this.perHourServiceSalaryRef = React.createRef();
    this.commissionSalaryRef = React.createRef();
    this.percentTipFeeRef = React.createRef();
    this.fixedAmountTipFeeRef = React.createRef();
    this.commisionProductScalaryRef = React.createRef();
    this.cashPercentRef = React.createRef();
    this.servivesRef = React.createRef();

    this.assignSevices = React.createRef();
  }

  scrollStaffTo(position) {
    this.scrollStaffRef.current.scrollTo({
      x: 0,
      y: scaleSzie(position),
      animated: true,
    });
  }

  setStateFromParent = async (infoStaffHandle, isEditStaff) => {
    if (isEditStaff) {
      const { stateCity } = this.props;
      await this.setState({
        user: {
          firstName: infoStaffHandle?.firstName || "",
          lastName: infoStaffHandle?.lastName || "",
          displayName: infoStaffHandle?.displayName || "",
          address: {
            street: infoStaffHandle.address,
            city: infoStaffHandle.city,
            state: getNameStateById(stateCity, infoStaffHandle.stateId),
            zip: infoStaffHandle.zip,
          },
          cellphone: getCodeAreaPhone(infoStaffHandle.phone).phone,
          email: infoStaffHandle?.email,
          pin: infoStaffHandle?.pin,
          confirmPin: infoStaffHandle?.pin,
          isActive: infoStaffHandle?.isActive
            ? infoStaffHandle.isActive
            : false,
          isDisabled: infoStaffHandle?.isDisabled === 0 ? "Active" : "Disable",
          roles: {
            nameRole: infoStaffHandle?.roleName,
          },
          driverlicense: infoStaffHandle?.driverLicense,
          socialSecurityNumber: infoStaffHandle?.ssn,
          professionalLicense: infoStaffHandle?.professionalLicense,
        },
        staffId: infoStaffHandle?.staffId || "",
        fileId: infoStaffHandle?.fileId || 0,
        imageUrl: infoStaffHandle.imageUrl,
        rowsSalaryIncome: infoStaffHandle?.salaries?.commission?.value.length || 1,
        isEditSSN: false,

        workingTime: infoStaffHandle?.workingTimes || BusinessWorkingTime,
        salary: infoStaffHandle?.salaries,
        productSalary: infoStaffHandle?.productSalaries,
        tipFee: infoStaffHandle?.tipFees,
        cashPercent: infoStaffHandle?.cashPercent

      });
      this.browserFileRef.current.setImageUrlFromParent(
        infoStaffHandle.imageUrl
      );
      this.cellphoneRef.current.setcodeAreaPhoneFromParent(
        getCodeAreaPhone(infoStaffHandle.phone).areaCode
      );
    } else {
      // ----------- Create New Staff -----------
      const { profile } = this.props;
      await this.setState({
        ...initState,
        workingTime: profile.businessHour
          ? profile.businessHour
          : BusinessWorkingTime,
      });
      this.browserFileRef?.current?.setImageUrlFromParent("");
      this.assignSevices?.current?.getServiceAssignData();
    }

    await this.setState({ isEditStaff: isEditStaff });
    if (this.scrollStaffRef?.current) {
      this.scrollStaffRef?.current?.scrollTo({ y: 0, animated: false });
    }
  };

  editButtonSubmit = async (isSubmit) => {
    await this.setState({
      isSubmitButton: isSubmit,
    });
  };

  setStaffInfoFromParent = (staff) => { };

  setRefTimeWorking = (ref) => {
    if (ref) {
      this.inputRefsTime.push(ref);
    }
  };

  updateFileId = async (fileId) => {
    await this.setState({
      fileId,
    });
  };

  checkSalaryIncomeService = () => {
    const incomeSalary =
      this.commissionSalaryRef?.current?.getDataFromParent() || [];
    const values = [];
    let isCheckIsValidIncome = true;
    let isEmpty = false;

    for (let ref of incomeSalary) {
      let from = ref?.state?.from || "0.00";
      let to = ref?.state?.to || "0.00";
      let commission = ref?.state?.commission || "0.00";

      if (!from || !to || !commission) {
        isEmpty = true;
        break;
      } else {
        if (formatNumberFromCurrency(from) < formatNumberFromCurrency(to)) {
          values.push({
            from: formatNumberFromCurrency(from),
            to: formatNumberFromCurrency(to),
            commission: formatNumberFromCurrency(commission),
          });
        } else {
          isCheckIsValidIncome = false;
          break;
        }
      }
    }
    if (isEmpty) {
      return {
        status: false,
        message: "Please enter full salary income information!",
        data: [{ from: 0.0, to: 0.0, commission: 0.0 }],
      };
    }

    if (!isCheckIsValidIncome) {
      return {
        status: false,
        message: "From income not greater than to income",
        data: [{ from: 0.0, to: 0.0, commission: 0.0 }],
      };
    }

    return {
      status: true,
      message: "",
      data: values,
    };
  };

  setServives = (services) => {
    const { isEditStaff } = this.state;
    const arrServices = services.map((item) => ({
      id: !isEditStaff ? 0 : item.id,
      categoryId: item.categoryId,
      selected: item?.selected ? item?.selected : false,
      staffServices: item.staffServices.map((i) => ({
        id: !isEditStaff ? 0 : i.id,
        serviceId: i.serviceId,
        selected: i?.selected ? i.selected : false,
      })),
    }));
    this.setState({ categories: arrServices });
  };

  addAdmin = () => {
    const { user } = this.state;
    const { stateCity } = this.props;
    const arrayKey = Object.keys(user);
    let keyError = "";
    for (let i = 0; i < arrayKey.length; i++) {
      if (arrayKey[i] == "address") {
        if (
          user.address.state !== "" &&
          !checkStateIsValid(stateCity, user.address.state)
        ) {
          keyError = "stateInvalid";
          break;
        }
      } else if (arrayKey[i] == "roles") {
        if (user.roles.nameRole == "") {
          keyError = "nameRole";
          break;
        }
      } else if (arrayKey[i] == "email" && user[arrayKey[i]] !== "") {
        if (!validateEmail(user[arrayKey[i]])) {
          keyError = "emailInvalid";
          break;
        }
      } else if (
        arrayKey[i] != "driverlicense" &&
        arrayKey[i] != "socialSecurityNumber" &&
        arrayKey[i] != "professionalLicense"
      ) {
        if (
          user[arrayKey[i]] === "" &&
          arrayKey[i] !== "cellphone" &&
          arrayKey[i] !== "email"
        ) {
          keyError = arrayKey[i];
          break;
        }
      }
    }
    if (user.pin !== user.confirmPin) {
      keyError = "pinnotmatch";
    }
    // ------- Check Service Salary Income ------------
    const resultSalaryIncome = this.checkSalaryIncomeService();
    const isCheckIncomeSalary = this.commissionSalaryRef?.current?.state
      ?.isCheck;
    if (isCheckIncomeSalary && !resultSalaryIncome.status) {
      keyError = resultSalaryIncome?.message || "";
    }
    if (keyError !== "") {
      Alert.alert(`${strings[keyError] ? strings[keyError] : keyError}`);
    } else {


      const { address } = user;
      const temptAddress = {
        ...address,
        state: getIdStateByName(stateCity, address.state),
      };
      const temptStaff = {
        ...user,
        cellphone:
          user.cellphone === ""
            ? ""
            : `${this.cellphoneRef?.current?.state?.codeAreaPhone}${user.cellphone}`,
        address: temptAddress,
        isDisabled: user.isDisabled === "Active" ? 0 : 1,
        // workingTime: objWorkingTime,
        workingTime: { ...this.state.workingTime },
        salary: this.state.salary,
        tipFee: this.state.tipFee,
        fileId: this.state.fileId,
        imageUrl: this.state.imageUrl,
        productSalary: this.state.productSalary,
        cashPercent: parseFloat(this.state.cashPercent),
        categories: this.assignSevices?.current?.getStateFromParent()
      };
      if (this.state.isEditStaff) {
        this.props.editStaff(temptStaff, this.state.staffId);
      } else {
        this.props.addStaff(temptStaff);
      }
    }
  };

  convertKeyToName(key) {
    let name = "";
    switch (key) {
      case "Percent (%)":
        name = "percent";
        break;
      case "Fixed amount ($)":
        name = "fixedAmount";
        break;
      case "Per hour ($)":
        name = "perHour";
        break;
      case "Commission (%)":
        name = "commission";
        break;
      default:
        name = "commission1";
    }
    return name;
  }

  updateUserInfo(key, value, keyParent = "") {
    const { user } = this.state;
    if (keyParent !== "") {
      const temptParent = user[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...user, [keyParent]: temptChild };
      this.setState({
        user: temptUpdate,
      });
    } else {
      const temptUpdate = { ...user, [key]: value };
      this.setState({
        user: temptUpdate,
      });
    }
  }

  disableFixedAmountTip = () => {
    this.fixedAmountTipFeeRef.current.setStateFromParent();
  };

  disablePercentTip = () => {
    this.percentTipFeeRef.current.setStateFromParent();
  };

  disableCommisionServiceSalary = () => {
    this.commissionSalaryRef.current.setStateFromParent();
  };

  disablePerHourSalary = () => {
    this.perHourServiceSalaryRef.current.setStateFromParent();
  };

  selectCheckbox = (day, isCheck) => async () => {
    const tempWorkingTime = { ...this.state.workingTime };
    tempWorkingTime[day].isCheck = !isCheck;

    await this.setState({
      workingTime: tempWorkingTime
    })
  }

  onChangeTimeOfWorkingTime = async (value, day, keyTime) => {
    const tempWorkingTime = { ...this.state.workingTime };
    tempWorkingTime[day][keyTime] = value;
    await this.setState({
      workingTime: tempWorkingTime
    })
  }

  // ------------------- New Code ---------------

  handlePerHourCheckBox = () => {
    const tempSalary = { ...this.state.salary };
    const isCheck = tempSalary?.perHour?.isCheck;
    if (isCheck) {
      tempSalary.perHour.value = "0.00";
    } else {
      tempSalary.commission = {
        value: [
          {
            from: 0,
            to: 0,
            commission: 0
          }
        ],
        isCheck: false
      }
    }
    tempSalary.perHour.isCheck = !isCheck;

    this.setState({
      salary: tempSalary
    })
  }

  handleChangePerHourValue = async (value) => {
    const tempSalary = { ...this.state.salary };
    tempSalary.perHour.value = value;

    await this.setState({
      salary: tempSalary
    })
  }

  onPressIncomesCheckbox = () => {
    const tempSalary = { ...this.state.salary };
    const isCheck = tempSalary?.commission?.isCheck;

    if (isCheck) {
      tempSalary.commission.value = [
        {
          from: 0,
          to: 0,
          commission: 0
        }
      ];
    } else {
      tempSalary.perHour = {
        value: "0.00",
        isCheck: false
      };
    }
    tempSalary.commission.isCheck = !isCheck;

    this.setState({
      salary: tempSalary
    })
  }

  addMoreSalary = () => {
    const tempSalary = { ...this.state.salary };
    tempSalary.commission.value.push({
      from: "",
      to: "",
      commission: ""
    });

    this.setState({
      salary: tempSalary
    })
  }

  removeSalaryByIndex = (indexRemove) => {
    const tempSalary = { ...this.state.salary };
    const valueCommission = tempSalary?.commission?.value || [];
    const tempValueCommission = valueCommission.filter((value, index) => index !== indexRemove);
    tempSalary.commission.value = tempValueCommission;

    this.setState({
      salary: tempSalary
    })
  }

  onChangeSalaryByIndex = (value, key, index) => {
    const tempSalary = { ...this.state.salary };
    tempSalary.commission.value[index][key] = value;

    this.setState({
      salary: tempSalary
    })
  }

  handleProductSalaryCheckBox = () => {
    const tempProductSalary = { ...this.state.productSalary };
    const isCheck = tempProductSalary?.commission?.isCheck;
    tempProductSalary.commission.isCheck = !isCheck;

    this.setState({
      productSalary: tempProductSalary
    })
  }

  handleChangeProductSalaryValue = (value) => {
    const tempProductSalary = { ...this.state.productSalary };
    tempProductSalary.commission.value = value;

    this.setState({
      productSalary: tempProductSalary
    })
  }

  handleTipFeePercentCheckBox = () => {
    const tempTipFee = { ...this.state.tipFee };
    const isCheck = tempTipFee?.percent?.isCheck;

    if (isCheck) {
      tempTipFee.percent.value = '0.00';
    } else {
      tempTipFee.fixedAmount.isCheck = false;
      tempTipFee.fixedAmount.value = '0.00';
    }

    tempTipFee.percent.isCheck = !isCheck;

    this.setState({
      tipFee: tempTipFee
    })

  }

  handleChangeTipFeePercentValue = (value) => {
    const tempTipFee = { ...this.state.tipFee };
    tempTipFee.percent.value = value;

    this.setState({
      tipFee: tempTipFee
    })
  }

  handleTipFeeFixedAmountCheckBox = () => {
    const tempTipFee = { ...this.state.tipFee };
    const isCheck = tempTipFee?.fixedAmount?.isCheck;

    if (isCheck) {
      tempTipFee.fixedAmount.value = '0.00';
    }else{
      tempTipFee.percent.isCheck = false;
      tempTipFee.percent.value = '0.00';
    }

    tempTipFee.fixedAmount.isCheck = !isCheck;

    this.setState({
      tipFee: tempTipFee
    })
  }

  handleChangeTipFeeFixedAmountValue = (value) => {
    const tempTipFee = { ...this.state.tipFee };
    tempTipFee.fixedAmount.value = value;

    this.setState({
      tipFee: tempTipFee
    })
  }

  handleChangeCashPercentValue =(value)=>{
    this.setState({
      cashPercent: value
    })
  }

}

export default AddStaff;

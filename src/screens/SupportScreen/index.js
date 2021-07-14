import React from "react";
import { Keyboard } from "react-native";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";

class SupportScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: true,
      indexTab: 0,
      visibleLogout: false,

      isReady: false,
      status: "",
      quality: "",
      error: "",
    };
    this.scrollTabRef = React.createRef();
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) => {
        this.setState({
          isFocus: false,
        });
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
      }
    );
  }

  handleLockScreen = () => {
    const { isFocus } = this.state;
    if (isFocus) {
      this.props.navigation.navigate("Home");
      // console.log("CSScreen");
      this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    }
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  selectMenu(index) {
    if (index === 8) {
      this.setState({
        visibleLogout: true,
      });
    } else {
      this.setState({
        indexTab: index,
      });
      this.scrollTabRef.current?.goToPage(index);
      Keyboard.dismiss();
    }
  }

  logout = () => {
    this.props.actions.auth.requestLogout();
    // this.props.navigation.navigate("SigninStack");

  };

  backTab = () => {
    const { indexTab } = this.state;
    if (indexTab == 1) {
      this.props.actions.staff.switchAddStaff(false);
    }
  };

  clearIntervalById = () => {
    const { notiIntervalId } = this.props;
    if (notiIntervalId) {
      clearInterval(notiIntervalId);
      this.props.actions.app.resetNotiIntervalId();
    }
  }

  componentWillUnmount() {
    this.didBlurSubscription();
    this.didFocusSubscription();
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  notiIntervalId: state.app.notiIntervalId
});

export default connectRedux(mapStateToProps, SupportScreen);

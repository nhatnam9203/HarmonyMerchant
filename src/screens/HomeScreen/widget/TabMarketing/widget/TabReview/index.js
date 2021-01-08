import React from "react";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import { getServiceIdByName } from "@utils";
import { scaleSzie } from "../../../../../../utils";

class TabReview extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isvisible: false,
      isReview: '',
      isStatus: ''
    };
  }

  componentDidMount() {
    // this.props.actions.marketing.getPromotionByMerchant();
  }

  openImage = () => {
    this.setState({ isvisible: true });
  };

  closeImage = () => {
    this.setState({ isvisible: false });
  };
}

const mapStateToProps = (state) => ({});

export default connectRedux(mapStateToProps, TabReview);

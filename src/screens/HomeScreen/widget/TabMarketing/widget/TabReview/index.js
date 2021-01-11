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
      isReview: "all",
      isStatus: "all",
    };
  }

  componentDidMount() {
    const merchantId = this.props.merchantId;
    this.props.actions.review.getSummaryReview(merchantId);
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview
    );
  }

  openImage = () => {
    this.setState({ isvisible: true });
  };

  closeImage = () => {
    this.setState({ isvisible: false });
  };

  onFilterReview = (review) => {
    switch (review) {
      case "All reviews":
        this.setState({ isReview: "all" });
        break;
      case "Good reviews":
        this.setState({ isReview: "good" });
        break;
      case "Bad reviews":
        this.setState({ isReview: "bad" });
        break;
      default:
        break;
    }
    console.log(this.state.isStatus, this.state.isReview);
    // this.props.actions.review.getListReview(
    //   this.state.isStatus,
    //   this.state.isReview
    // );
  };

  formatDataReview = (item) => {
    switch (item) {
      case "all":
        return { value: "All reviews" };
      case "good":
        return { value: "Good reviews" };
      case "bad":
        return { value: "Bad reviews" };
      default:
        break;
    }
  };

  formatDataStatus = (item) => {
    switch (item) {
      case "all":
        return { value: "All Status" };
      case "show":
        return { value: "Show" };
      case "hidden":
        return { value: "Hidden" };
      default:
        break;
    }
  };

  onFilterStatus = (status) => {
    // SET STATE STATUS
    switch (status) {
      case "All Status":
        this.setState({ isStatus: "all" });
        break;
      case "Show":
        this.setState({ isStatus: "show" });
        break;
      case "Hidden":
        this.setState({ isStatus: "hidden" });
        break;
      default:
        break;
    }
    console.log(this.state.isStatus, this.state.isReview);

    // this.props.actions.review.getListReview(
    //   this.state.isStatus,
    //   this.state.isReview
    // );
  };

  onLoadmore = () => {
    const merchantId = this.props.merchantId;
    this.props.actions.review.getSummaryReview(merchantId);
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview
    );
  };

  onRefesh = () => {
    const merchantId = this.props.merchantId;
    this.props.actions.review.getSummaryReview(merchantId);
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview
    );
  };

  isVisibleReview = (status, id) => {
    switch (status) {
      case "show":
        this.props.actions.review.hideRating(id);
        break;
      case "hide":
        this.props.actions.review.showRating(id);
        break;

      default:
        break;
    }
  };
}

const mapStateToProps = (state) => ({
  merchantId: state.dataLocal.profile?.merchantId,
  summaryReview: state.review.summaryReview,
});

export default connectRedux(mapStateToProps, TabReview);

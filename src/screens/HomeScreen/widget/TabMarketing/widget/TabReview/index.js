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
      refreshing: false,
      imageArr: [],
      indexImage: 0,
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    const merchantId = this.props.merchantId;
    this.props.actions.review.getSummaryReview(merchantId);
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview
    );
  }

  openImage = (ratingImages, index) => {
    this.setState({
      isvisible: true,
      imageArr: this.formatImageArr(ratingImages),
      indexImage: index,
    });
  };

  formatImageArr = (oldArr) => {
    const resultArr = oldArr.map((item) => ({
      url: item.imageUrl,
      id: item.staffRatingId,
      // width: 200,
      // height: 300
    }));
    return resultArr;
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
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview
    );
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
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview
    );
  };

  onLoadmore = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalPages, currentPage } = this.props;
      if (currentPage < totalPages) {
        this.props.actions.review.getListReview(
          this.state.isStatus,
          this.state.isReview,
          parseInt(currentPage + 1),
          false,
          true
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
      console.log(totalPages, currentPage);
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    const merchantId = this.props.merchantId;
    this.props.actions.review.getSummaryReview(merchantId, false);
    this.props.actions.review.getListReview(
      this.state.isStatus,
      this.state.isReview,
      1,
      false,
      false
    );
    this.setState({ refreshing: false });
  };

  isVisibleReview = (status, id) => {
    switch (status) {
      case 0:
        this.props.actions.review.hideRating(id);
        setTimeout(() => {
          this.props.actions.review.getListReview(
            this.state.isStatus,
            this.state.isReview
          );
        }, 500);
        break;
      case 1:
        this.props.actions.review.showRating(id);
        setTimeout(() => {
          this.props.actions.review.getListReview(
            this.state.isStatus,
            this.state.isReview
          );
        }, 500);
        break;
      default:
        break;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { isGetReview } = this.props;
    if (prevProps.isGetReview !== isGetReview && isGetReview) {
      this.props.actions.review.resetListReview();
      this.setState({isReview: "all", isStatus: "all"})
    }
    
  }
}

const mapStateToProps = (state) => ({
  merchantId: state.dataLocal.profile?.merchantId,
  summaryReview: state.review.summaryReview,
  listReview: state.review.listReview,
  isLoadMoreReviewList: state.review.isLoadMoreReviewList,
  totalPages: state.review.totalPages,
  currentPage: state.review.currentPage,
  isGetReview: state.review.isGetReview,
});

export default connectRedux(mapStateToProps, TabReview);

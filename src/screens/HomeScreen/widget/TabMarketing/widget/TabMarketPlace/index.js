import React from "react";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";

class TabMarketPlace extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.onEndReachedCalledDuringMomentum = true;
    this.flatListRef = React.createRef();
  }

  componentDidMount() {
    this.props.actions.review.getListMarketPlace();
  }

  onLoadmore = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalPages, currentPage } = this.props;
      if (currentPage < totalPages) {
        this.props.actions.review.getListMarketPlace(
          parseInt(currentPage + 1),
          false,
          true
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });

    this.props.actions.review.getListMarketPlace(1, false, false);
    this.setState({ refreshing: false });
  };

  setStateFromParent = () => {
    if (this.flatListRef?.current) {
      this.flatListRef?.current?.scrollToOffset({ y: 0, animated: false });
    }

  };
}

const mapStateToProps = (state) => ({
  listMarketPlace: state.review.listMarketPlace,
  isLoadMoreMarketList: state.review.isLoadMoreMarketList,
  totalPages: state.review.totalPages,
  currentPage: state.review.currentPage,
  language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, TabMarketPlace);

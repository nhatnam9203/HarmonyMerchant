import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";

class TabMarketPlace extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    // this.props.actions.review.getListMarketPlace();
  }

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
}

const mapStateToProps = (state) => ({
  listMarketPlace: state.review.listMarketPlace,
  isLoadMoreMarketList: state.review.isLoadMoreMarketList,
  totalPages: state.review.totalPages,
  currentPage: state.review.currentPage,
  language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, TabMarketPlace);

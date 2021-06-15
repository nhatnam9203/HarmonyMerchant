import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
  getQuickFilterStringInvoice,
  getShortOrderRetailStatus,
  getShortOrderPurchasePoint,
} from '@utils';

class OrderHome extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      visibleFilterModal: false,
      purchansePointSelectedFilter: 'All Points',
      statusSelectedFilter: 'All Status',
      visibleCalendar: false,
      titleRangeTime: 'Last Month',
    };
    this.modalCalendarRef = React.createRef();
    this.onEndReachedCalledDuringMomentum = true;
    this.setFilterStateToFilterModal = null;
  }

  componentDidMount() {
    this.getOrderListFromStore();
  }

  getOrderListFromStore(page = 1) {
    const {
      searchKeyword,
      purchansePointSelectedFilter,
      statusSelectedFilter,
      titleRangeTime,
    } = this.state;
    const { isCustomizeDate, startDate, endDate } =
      this.modalCalendarRef?.current?.state;
    let api = `page=${page}&status=${getShortOrderRetailStatus(
      statusSelectedFilter,
    )}&purchasePoint=${getShortOrderPurchasePoint(
      purchansePointSelectedFilter,
    )}&key=${searchKeyword}`;
    if (isCustomizeDate) {
      api = `${api}&timeStart=${startDate}&timeEnd=${endDate}&quickFilter=custom`;
    } else {
      api = `${api}&quickFilter=${getQuickFilterStringInvoice(titleRangeTime)}`;
    }
    this.props.actions.orderRetail.getOrdersFromStore(api, 1); // !! dev
  }

  search = () => {
    this.getOrderListFromStore();
  };

  showCalendar = () => {
    this.setState({
      visibleCalendar: true,
    });
  };

  changeTitleTimeRange = async (title) => {
    await this.setState({
      titleRangeTime: title === 'Select' ? 'Today' : title,
      visibleCalendar: false,
    });

    this.getOrderListFromStore();
  };

  showFilterModal = async () => {
    if (this.setFilterStateToFilterModal) {
      const { purchansePointSelectedFilter, statusSelectedFilter } = this.state;
      this.setFilterStateToFilterModal(
        purchansePointSelectedFilter,
        statusSelectedFilter,
      );
    }
    await this.setState({
      visibleFilterModal: true,
    });
  };

  closeFilterModal = () => {
    this.setState({
      visibleFilterModal: false,
    });
  };

  resetFilter = () => {
    alert('applyFilter');
  };

  applyFilter =
    (purchansePointSelectedFilter, statusSelectedFilter) => async () => {
      await this.setState({
        purchansePointSelectedFilter,
        statusSelectedFilter,
        visibleFilterModal: false,
      });
      setTimeout(() => {
        this.getOrderListFromStore();
      }, 500);
    };

  clearPurchansePointFilter = async () => {
    await this.setState({
      purchansePointSelectedFilter: 'All Points',
    });
    this.getOrderListFromStore();
  };

  clearStatusFilter = async () => {
    await this.setState({
      statusSelectedFilter: 'All Status',
    });
    this.getOrderListFromStore();
  };

  clearAllFilter = async () => {
    await this.setState({
      purchansePointSelectedFilter: 'All Points',
      statusSelectedFilter: 'All Status',
    });
    this.getOrderListFromStore();
  };

  handleNewOrder = () => {
    this.props.handleNewOrder();
  };

  loadMoreOrderList = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { orderListOfRetailerTotalPages, orderListOfRetailerCurrentPage } =
        this.props;
      if (orderListOfRetailerCurrentPage < orderListOfRetailerTotalPages) {
        this.props.actions.orderRetail.getOrdersFromStore(
          orderListOfRetailerCurrentPage + 1,
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  goToOrderRetailDetail = (order) => () => {
    this.props.actions.orderRetail.getOrderRetailDetail(order?.appointmentid);
  };

  passFilterStateToFilterModal = (ref) => {
    this.setFilterStateToFilterModal = ref;
  };

  componentWillUnmount() {
    this.setFilterStateToFilterModal = null;
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
  token: state.dataLocal.token,
  profileStaffLogin: state.dataLocal.profileStaffLogin,

  orderListOfRetailer: state.orderRetail.orderListOfRetailer,
  orderListOfRetailerTotalPages:
    state.orderRetail.orderListOfRetailerTotalPages,
  orderListOfRetailerCurrentPage:
    state.orderRetail.orderListOfRetailerCurrentPage,
});

export default connectRedux(mapStateToProps, OrderHome);

import React from "react";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import { updateStateChildren, getQuickFilterStringInvoice } from "@utils";

const initalSate = {
  searchFilter: {
    keySearch: "",
    status: "",
  },
  titleRangeTime: "Time Range",
  visibleCalendar: false,
};

class TabTransaction extends Layout {
  constructor(props) {
    super(props);
    this.state = initalSate;
    this.modalCalendarRef = React.createRef();
    this.onEndReachedCalledDuringMomentum = true;
  }

  resetStateFromParent = async () => {
    await this.setState(initalSate);
  };

  searchTransactions = (page = 1, isShowloading = true, isLoadMore = false) => {
    const { searchFilter } = this.state;
    const { keySearch, status } = searchFilter;
    const { isCustomizeDate, startDate, endDate, quickFilter } =
      this.modalCalendarRef.current.state;

    this.props.actions.invoice.getTransactionSettlement(
      status,
      isCustomizeDate ? startDate : "",
      isCustomizeDate ? endDate : "",
      keySearch,
      quickFilter ? getQuickFilterStringInvoice(quickFilter) : "",
      page,
      isShowloading,
      isLoadMore
    );
  };

  loadMoreSettlement = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { settlementCurrentPage, settlementTotalPages } = this.props;
      if (settlementCurrentPage < settlementTotalPages) {
        this.searchTransactions(
          parseInt(settlementCurrentPage + 1),
          false,
          true
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  showCalendar = () => {
    this.setState({
      visibleCalendar: true,
    });
  };

  changeTitleTimeRange = async (title) => {
    await this.setState({
      titleRangeTime: title === "Select" ? "Time Range" : title,
      visibleCalendar: false,
    });
    setTimeout(() => {
      this.searchTransactions();
    }, 200);
  };

  updateSearchFilterInfo = async (key, value) => {
    const temptState = updateStateChildren(key, value, this.state.searchFilter);
    await this.setState({
      searchFilter: temptState,
    });
    if (key !== "keySearch") {
      setTimeout(() => {
        this.searchTransactions();
      }, 100);
    } else {
    }
  };

  clearSearchText = () => {
    this.updateSearchFilterInfo("keySearch", "");
  };

  didFocus = () => {
    this.modalCalendarRef.current?.selectQuickFilter("Time Range");
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  transactionsSettlement: state.invoice.transactionsSettlement,
  listTransactionSearch: state.invoice.listTransactionSearch,
  isShowSearchTransaction: state.invoice.isShowSearchTransaction,
  refreshingTransaction: state.invoice.refreshingTransaction,

  settlementCurrentPage: state.invoice.settlementCurrentPage,
  settlementTotalPages: state.invoice.settlementTotalPages,
  isLoadMoreTransSettlement: state.invoice.isLoadMoreTransSettlement,
});

export default connectRedux(mapStateToProps, TabTransaction);

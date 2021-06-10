import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabSettle extends Layout {

    constructor(props) {
        super(props);
        this.scrollTabRef = React.createRef();
        this.tabFirstSettleRef = React.createRef();
        this.tabsecondSettleRef = React.createRef();
        this.staffIIncomeDetailsRef = React.createRef();
        this.giftCardSalesDetailsTabRef = React.createRef();
    }

    callReportFromChildren = () => {
        this.tabFirstSettleRef?.current?.handlePAXReport();
    }

    onDidFocus = () => {
        this.scrollTabRef.current.goToPage(0);
        this.tabFirstSettleRef?.current?.setStateFromParent();
        this.tabsecondSettleRef?.current?.resetStateFromParent();
    }

    gotoTabSecondSettle = (settlement, creditCount) => {
        this.scrollTabRef.current.goToPage(3);
        if (this.tabsecondSettleRef.current) {
            this.tabsecondSettleRef.current.setStateFromParent(settlement, creditCount);
        } else {
            setTimeout(() => {
                this.tabsecondSettleRef.current.setStateFromParent(settlement, creditCount);
            }, 500);
        }
    }

    backTabFirstSettle = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    finishBatch = () => {
        if (this.tabFirstSettleRef.current) {
            this.tabFirstSettleRef.current.resetNoteFromParent();
            this.tabFirstSettleRef.current.refreshSettlement();
        }
    }

    // ----------- New code ------------
    onPressStaff = (staffId) => {
        this.props.actions.invoice.toggleDisplayBackSettleIcon();
        this.scrollTabRef.current.goToPage(1);
        if (this.staffIIncomeDetailsRef.current) {
            this.staffIIncomeDetailsRef.current.setStateFromParent(staffId);
        } else {
            setTimeout(() => {
                this.staffIIncomeDetailsRef.current.setStateFromParent(staffId);
            }, 300)
        }
    }

    onPressGiftCardTotal = () => {
        this.props.actions.invoice.toggleDisplayBackSettleIcon();
        this.scrollTabRef.current.goToPage(2);
        if (this.giftCardSalesDetailsTabRef.current) {
            this.giftCardSalesDetailsTabRef.current.setStateFromParent();
        } else {
            setTimeout(() => {
                this.giftCardSalesDetailsTabRef.current.setStateFromParent();
            }, 300)
        }
    }

    scrollTabFromParent = () => {
        this.scrollTabRef.current.goToPage(0);
    }

}

const mapStateToProps = state => ({
})



export default connectRedux(mapStateToProps, TabSettle);
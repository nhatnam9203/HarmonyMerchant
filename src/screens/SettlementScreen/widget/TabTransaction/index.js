import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getArrayNameCategories, getCategoryIdByName } from '@utils';

class TabTransaction extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            },
            visibleCalendar: false
        };
        this.modalCalendarRef = React.createRef();
    }

    componentDidMount(){
       this.props.actions.invoice.getTransactionSettlement();
    }

    searchTransactions =() =>{

    }

    showCalendar = () =>{
        this.setState({
            visibleCalendar: true
        })
    }

    

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    transactionsSettlement: state.invoice.transactionsSettlement
})



export default connectRedux(mapStateToProps, TabTransaction);
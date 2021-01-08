import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getServiceIdByName } from '@utils';
import { scaleSzie } from '../../../../../../utils';

class TabReview extends Layout {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    // this.props.actions.marketing.getPromotionByMerchant();
  }

}

const mapStateToProps = state => ({

})



export default connectRedux(mapStateToProps, TabReview);



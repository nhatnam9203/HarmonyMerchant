import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SlideDrawer extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    changeLanguage =(item)=>{
        const {language}= this.props;
        const  temptLanguage = language === 'en' ? 'vi' : 'en';
        this.props.actions.dataLocal.changeLanguageApp(temptLanguage);
    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, SlideDrawer);
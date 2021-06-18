import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { scaleSize } from '@utils';

class BusinessInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            initQuestion: false,
            businessInfo: {
                question1: {
                    isAccept: false,
                    desc: '',
                    question: 'question1'
                },
                question2: {
                    isAccept: false,
                    desc: '',
                    question: 'question2'
                },
                question3: {
                    isAccept: false,
                    desc: '',
                    question: 'question3'
                },
                question4: {
                    isAccept: false,
                    desc: '',
                    question: 'question4'
                },
                question5: {
                    isAccept: false,
                    desc: '',
                    question: 'question5'
                },
            }
        };
        this.srollBusinessRef = React.createRef();
    }

    componentDidMount() {
        this.getQuestions();
    }

    getQuestions = () => {
        this.props.actions.app.getQuestion();
    }

    scrollBusinessTo(position) {
        this.srollBusinessRef.current?.scrollTo({ x: 0, y: scaleSize(position), animated: true })
    }

    updateBusinessInfo(key, value, keyParent = '') {
        const { businessInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = businessInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...businessInfo, [keyParent]: temptChild };
            this.setState({
                businessInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...businessInfo, [key]: value };
            this.setState({
                businessInfo: temptUpdate
            })
        }
    }

    changeStatusCheck(isCheck, key) {
        if (isCheck) {
            this.updateBusinessInfo('isAccept', true, key);
        } else {
            const { businessInfo } = this.state;
            const temptParent = businessInfo[key];
            const temptChild = { ...temptParent, isAccept: false, desc: '' };
            const temptUpdate = { ...businessInfo, [key]: temptChild };
            this.setState({
                businessInfo: temptUpdate
            })
        }
    }

    nextTab = () => {
        const { question } = this.props;
        const { businessInfo } = this.state;
        if (question.length === 0) {
            alert("Click button above to get the questions from server!")
        } else {
            this.props.actions.app.setBusinessInfo(businessInfo);
            this.props.goToPage(2);
        }
    }

    updateQuestionBusinessInfo = () => {
        const { question } = this.props;
        this.setState({
            businessInfo: {
                question1: {
                    isAccept: false,
                    desc: '',
                    question: question[0].value
                },
                question2: {
                    isAccept: false,
                    desc: '',
                    question: question[1].value
                },
                question3: {
                    isAccept: false,
                    desc: '',
                    question: question[2].value
                },
                question4: {
                    isAccept: false,
                    desc: '',
                    question: question[3].value
                },
                question5: {
                    isAccept: false,
                    desc: '',
                    question: question[4].value
                }
            }
        })

    }

    componentDidUpdate(prevProps, prevState) {
        const { question, loading } = this.props;
        if (prevProps.question.length === 0 && question.length > 0) {
            this.updateQuestionBusinessInfo();
        }
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    question: state.app.question,
    loading: state.app.loading,
})



export default connectRedux(mapStateToProps, BusinessInfoScreen);
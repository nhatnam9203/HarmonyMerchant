import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

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
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.question.length > 0 && !prevState.initQuestion) {
            console.log(nextProps.question);
            const { question } = nextProps
            return {
                initQuestion: true,
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
                    },
                }
            }
        }
        return null
    }

    componentDidMount() {
        this.props.actions.app.getQuestion();
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
        const { businessInfo } = this.state;
        this.props.actions.app.setBusinessInfo(businessInfo);
        this.props.navigation.navigate('BankInfo');
    }




}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    question: state.app.question,
    loading: state.app.loading
})



export default connectRedux(mapStateToProps, BusinessInfoScreen);
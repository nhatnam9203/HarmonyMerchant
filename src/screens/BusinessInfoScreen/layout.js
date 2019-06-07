import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { InputQuestionBusiness, FormInfoParent, Text } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';


export default class Layout extends React.Component {

    render() {
        const {
            question1, question2, question3, question4, question5
        } = this.state.businessInfo;
        return (
            <FormInfoParent
                title="Business Information"
                back={() => this.props.navigation.goBack()}
                next={this.nextTab}
            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />

                    <InputQuestionBusiness
                        question={'Have You Ever Accepted Credit/Debit Cards Before?'}
                        subYes="if yes, who was the processor"
                        value={question1.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question1')}
                        clearTextInput={() => this.updateBusinessInfo('desc', '', 'question1')}
                    />

                    <InputQuestionBusiness
                        question={'Has a Processor Ever Terminated Your Merchant Account?'}
                        subYes="if yes, who was the processor"
                        value={question2.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question2')}
                        clearTextInput={() => this.updateBusinessInfo('desc', '', 'question2')}
                    />

                    <InputQuestionBusiness
                        question={'Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?'}
                        subYes="if yes, date filed"
                        value={question3.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question3')}
                        clearTextInput={() => this.updateBusinessInfo('desc', '', 'question3')}
                    />

                    <InputQuestionBusiness
                        question={'Has Merchant been previously identified by Visa/Mastercard Risk Programs?'}
                        subYes="if yes, was program and when"
                        value={question4.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question4')}
                        clearTextInput={() => this.updateBusinessInfo('desc', '', 'question4')}
                    />

                    <InputQuestionBusiness
                        question={'Will Product(s) or Service(s) Be Sold Outside of The U.S ?'}
                        subYes=""
                        value={question5.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question5')}
                        clearTextInput={() => this.updateBusinessInfo('desc', '', 'question5')}
                    />

                </View>
            </FormInfoParent>

        );
    }
}

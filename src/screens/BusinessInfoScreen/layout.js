import React from 'react';
import {
    View,
} from 'react-native';

import { InputQuestionBusiness, FormInfoParent, Text } from '@components';
import { scaleSzie, localize } from '@utils';

export default class Layout extends React.Component {

    render() {
        const {
            question1, question2, question3, question4, question5
        } = this.state.businessInfo;
        const { language } = this.props;
        return (
            <FormInfoParent
                title={`${localize('Business Information', language)}`}
                back={() => this.props.navigation.goBack()}
                next={this.nextTab}
            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />

                    <InputQuestionBusiness
                        question={`${localize('Have You Ever Accepted Credit/Debit Cards Before?', language)}`}
                        subYes={`${localize('if yes, who was the processor', language)}`}
                        value={question1.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question1')}
                        changeStatusCheck={(isCheck) => this.changeStatusCheck(isCheck, 'question1')}
                        clearTextInput={() => this.updateBusinessInfo('desc', '', 'question1')}
                    />

                    <InputQuestionBusiness
                        question={`${localize('Has a Processor Ever Terminated Your Merchant Account?', language)}`}
                        subYes={`${localize('if yes, who was the processor', language)}`}
                        value={question2.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question2')}
                        changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question2')}
                    />

                    <InputQuestionBusiness
                        question={`${localize('Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?', language)}`}
                        subYes={`${localize('if yes, date filed', language)}`}
                        value={question3.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question3')}
                        changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question3')}
                    />

                    <InputQuestionBusiness
                        question={`${localize('Has Merchant been previously identified by Visa/Mastercard Risk Programs?', language)}`}
                        subYes={`${localize('if yes, was program and when', language)}`}
                        value={question4.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question4')}
                        changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question4')}
                    />

                    <InputQuestionBusiness
                        question={`${localize('Will Product(s) or Service(s) Be Sold Outside of The U.S ?', language)}`}
                        subYes=""
                        value={question5.desc}
                        onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question5')}
                        changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question5')}
                    />

                </View>
            </FormInfoParent>

        );
    }
}

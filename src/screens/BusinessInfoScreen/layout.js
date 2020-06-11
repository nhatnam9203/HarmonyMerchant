import React from 'react';
import {
    View,
    ScrollView,
    Dimensions
} from 'react-native';

import { InputQuestionBusiness, FormInfoParent, Text } from '@components';
import { scaleSzie, localize } from '@utils';

const {width} = Dimensions.get('window');

export default class Layout extends React.Component {

    render() {
        const {
            question1, question2, question3, question4, question5
        } = this.state.businessInfo;
        const { language, loading, } = this.props;
        return (
            <FormInfoParent
                back={() => this.props.navigation.goBack()}
                next={this.nextTab}
            >
                {
                    !this.state.initQuestion ? <View /> :
                        <ScrollView
                            ref={this.srollBusinessRef}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* ------ Header ------ */}
                            <View style={{
                                width, paddingHorizontal: scaleSzie(15),
                                marginTop: scaleSzie(8)
                            }}  >
                                <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                                    {localize('Please fill the form below', language)}
                            </Text>
                                <View style={{
                                    height: scaleSzie(38), backgroundColor: '#0764B0', justifyContent: 'center',
                                    paddingLeft: scaleSzie(5), marginTop: scaleSzie(5)
                                }} >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                                        {localize('Business Information', language)}
                                    </Text>
                                </View>
                            </View>
                            {/* ------------------------- */}
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                                <View style={{ height: scaleSzie(16) }} />
                                <InputQuestionBusiness
                                    question={`${localize(question1.question, language)}`}
                                    subYes={`${localize('if yes, who was the processor', language)}`}
                                    value={question1.desc}
                                    onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question1')}
                                    changeStatusCheck={(isCheck) => this.changeStatusCheck(isCheck, 'question1')}
                                    clearTextInput={() => this.updateBusinessInfo('desc', '', 'question1')}
                                    onFocus={() => this.scrollBusinessTo(80)}
                                />

                                <InputQuestionBusiness
                                    question={`${localize(question2.question, language)}`}
                                    subYes={`${localize('if yes, who was the processor', language)}`}
                                    value={question2.desc}
                                    onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question2')}
                                    changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question2')}
                                    onFocus={() => this.scrollBusinessTo(160)}
                                />

                                <InputQuestionBusiness
                                    question={`${localize(question3.question, language)}`}
                                    subYes={`${localize('if yes, date filed', language)}`}
                                    value={question3.desc}
                                    onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question3')}
                                    changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question3')}
                                    onFocus={() => this.scrollBusinessTo(280)}
                                />

                                <InputQuestionBusiness
                                    question={`${localize(question4.question, language)}`}
                                    subYes={`${localize('if yes, what was program and when', language)}`}
                                    value={question4.desc}
                                    onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question4')}
                                    changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question4')}
                                    onFocus={() => this.scrollBusinessTo(370)}
                                />

                                <InputQuestionBusiness
                                    question={`${localize(question5.question, language)}`}
                                    subYes={`${localize('if yes, who was your previous company', language)}`}
                                    value={question5.desc}
                                    onChangeText={(value) => this.updateBusinessInfo('desc', value, 'question5')}
                                    changeStatusCheck={(value) => this.updateBusinessInfo('isAccept', value, 'question5')}
                                    onFocus={() => this.scrollBusinessTo(440)}
                                />
                            </View>
                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                }
            </FormInfoParent>

        );
    }
}

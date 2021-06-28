import React from 'react';
import {
    View,
    ScrollView,
    Dimensions
} from 'react-native';

import { InputQuestionBusiness, FormInfoParent, Text, ButtonCustom } from '@components';
import { scaleSize, localize } from '@utils';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {

    renderQuestions() {
        const {
            question1, question2, question3, question4, question5
        } = this.state.businessInfo;
        const { language } = this.props;

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSize(25) }} >
                <View style={{ height: scaleSize(16) }} />
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
        );
    }

    renderEmptyQuestion() {
        const { language } = this.props;

        return (
            <View style={{ flex: 1 ,alignItems:"center",}} >
                <Text style={{fontSize:scaleSize(22),fontWeight:"600",marginTop:scaleSize(50),color:"red"}} >
                    The questions is empty!
                </Text>
                <ButtonCustom
                    width={`50%`}
                    backgroundColor="#F1F1F1"
                    title={localize('Get Questions From Server', language)}
                    textColor="#6A6A6A"
                    onPress={this.getQuestions}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        backgroundColor: '#0764B0',
                        flex: 1,marginTop:scaleSize(30)
                    }}
                    styleText={{ fontSize: scaleSize(20), fontWeight: '600', color: '#fff' }}
                />
            </View>
        );
    }

    render() {
        const { language, question } = this.props;

        return (
            <FormInfoParent
                back={() => this.props.goToPage(0)}
                next={this.nextTab}
            >
                <ScrollView
                    ref={this.srollBusinessRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* ------ Header ------ */}
                    <View style={{
                        width, paddingHorizontal: scaleSize(15),
                        marginTop: scaleSize(8)
                    }}  >
                        <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: scaleSize(18) }} >
                            {localize('Please fill the form below', language)}
                        </Text>
                        <View style={{
                            height: scaleSize(38), backgroundColor: '#0764B0', justifyContent: 'center',
                            paddingLeft: scaleSize(5), marginTop: scaleSize(5)
                        }} >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scaleSize(18) }} >
                                {localize('Business Information', language)}
                            </Text>
                        </View>
                    </View>
                    {/* ---------- Questions --------*/}
                    {
                        question.length > 0 ? this.renderQuestions() : this.renderEmptyQuestion()
                    }

                    <View style={{ height: scaleSize(250) }} />
                </ScrollView>
            </FormInfoParent>

        );
    }
}

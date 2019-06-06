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
        return (
            <FormInfoParent
                title="Business Information"
                back={() => alert('back')}
                next={() => alert('next')}
            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height: scaleSzie(16) }} />

                            <InputQuestionBusiness
                                question={'Have You Ever Accepted Credit/Debit Cards Before?'}
                                subYes="if yes, who was the processor"
                            />

                            <InputQuestionBusiness
                                question={'Has a Processor Ever Terminated Your Merchant Account?'}
                                subYes="if yes, who was the processor"
                            />

                            <InputQuestionBusiness
                                question={'Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?'}
                                subYes="if yes, date filed"
                            />

                            <InputQuestionBusiness
                                question={'Has Merchant been previously identified by Visa/Mastercard Risk Programs?'}
                                subYes="if yes, was program and when"
                            />

                            <InputQuestionBusiness
                                question={'Will Product(s) or Service(s) Be Sold Outside of The U.S ?'}
                                subYes=""
                            />

                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                    </View>
                </View>
            </FormInfoParent>

        );
    }
}

import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image
} from 'react-native';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupRestock extends React.Component {

    constructor(props) {
        super(props);
    }

    // ---------- Render --------
    render() {
        const { title, visible, onRequestClose, language } = this.props;
        const temptHeight = width - scaleSzie(540);
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{}}
                width={330}
            >
                <View style={{
                    height: scaleSzie(temptHeight), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(12)
                }} >
                    <View style={{ flex: 1 }} >
                        {/* ------- Title ----- */}
                        <View style={{ paddingTop: scaleSzie(14), paddingBottom: scaleSzie(8), alignItems: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                                {localize('Enter the amount of product added', language)}
                            </Text>
                        </View>
                        {/* ------ Display Box --- */}
                        <View style={{
                            height: scaleSzie(65), backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#C5C5C5',
                            justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10), marginBottom: scaleSzie(12)
                        }} >
                            <Text style={{ fontSize: scaleSzie(40), color: '#0764B0' }} >
                                10
                            </Text>
                        </View>
                        {/* ----- Keyboard ---- */}
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {/* ---- Left ----- */}
                            <View style={{ flex: 1 }} >
                                {/* ---- Row 1 ----- */}
                                <View style={styles.rowKeyboard} >
                                    {
                                        [7, 8, 9].map((number, index) => <Key
                                            key={index}
                                            number={number}
                                            onPressNumber={(number) => { console.log(number) }}
                                        />)
                                    }
                                </View>
                                {/* ---- Row 2 ----- */}
                                <View style={[styles.rowKeyboard, { marginTop: scaleSzie(9) }]} >
                                    {
                                        [4, 5, 6].map((number, index) => <Key
                                            key={index}
                                            number={number}
                                            onPressNumber={(number) => { console.log(number) }}
                                        />)
                                    }
                                </View>
                                {/* ---- Row 3 ----- */}
                                <View style={[styles.rowKeyboard, { marginTop: scaleSzie(9) }]} >
                                    {
                                        [1, 2, 3].map((number, index) => <Key
                                            key={index}
                                            number={number}
                                            onPressNumber={(number) => { console.log(number) }}
                                        />)
                                    }
                                </View>
                                {/* ---- Row 4 ----- */}
                                <View style={[styles.rowKeyboard, { marginTop: scaleSzie(9) }]} >
                                    <Button onPress={() => onPressNumber(number)} style={styles.keyContainer} >
                                        <Image source={IMAGE.subKeyboard} />
                                    </Button>

                                    <Key
                                        number={0}
                                        onPressNumber={() => { }}
                                    />
                                    <Button onPress={() => onPressNumber(number)} style={styles.keyContainer} >
                                        <Image source={IMAGE.clearKeyboard} />
                                    </Button>
                                </View>

                            </View>
                            {/* ---- Center ----- */}
                            <View style={{ width: scaleSzie(18), paddingBottom: scaleSzie(20), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: scaleSzie(4), backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* ---- Right ----- */}
                            <View style={{ width: scaleSzie(70) }} >
                                <Key
                                    number={10}
                                    onPressNumber={() => { }}
                                />
                                 <Key
                                    number={20}
                                    onPressNumber={() => { }}
                                    style={{marginTop: scaleSzie(9) }}
                                />
                                <Key
                                    number={50}
                                    onPressNumber={() => { }}
                                    style={{marginTop: scaleSzie(9) }}
                                />
                                <Key
                                    number={100}
                                    onPressNumber={() => { }}
                                    style={{marginTop: scaleSzie(9) }}
                                />
                            </View>
                        </View>
                        {/* ---- Footer ------ */}
                        <View style={{
                            height: scaleSzie(60), flexDirection: 'row',
                            justifyContent: 'center'
                        }} >
                            <ButtonCustom
                                width={200}
                                height={45}
                                backgroundColor="#F1F1F1"
                                title={localize('Cancel', language)}
                                textColor="#6A6A6A"
                                onPress={this.showModalEditProduct}
                                style={{
                                    borderRadius: scaleSzie(2),
                                    borderColor: '#C5C5C5',
                                    borderWidth: 1,
                                }}
                                styleText={{
                                    fontSize: scaleSzie(16),
                                    fontWeight: 'normal'
                                }}
                            />
                            <View style={{ width: scaleSzie(15) }} />
                            <ButtonCustom
                                width={200}
                                height={45}
                                backgroundColor="#0764B0"
                                title={localize('Submit', language)}
                                textColor="#fff"
                                onPress={this.showModalEditProduct}
                                style={{
                                    borderRadius: scaleSzie(2),
                                    borderColor: '#C5C5C5',
                                    borderWidth: 1,
                                }}
                                styleText={{
                                    fontSize: scaleSzie(16),
                                    fontWeight: 'normal'
                                }}
                            />
                        </View>
                    </View>
                </View>
            </PopupParent>
        );
    }
}

const Key = ({ number, onPressNumber,style }) => {
    return (
        <Button onPress={() => onPressNumber(number)} style={[styles.keyContainer,style]} >
            <Text style={{ fontSize: scaleSzie(26), color: '#404040', fontWeight: '500' }} >
                {number}
            </Text>
        </Button>
    );
}


const styles = StyleSheet.create({
    keyContainer: {
        width: scaleSzie(67),
        height: scaleSzie(45),
        backgroundColor: '#fff',
        borderRadius: scaleSzie(4),
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                borderRadius: scaleSzie(4),
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 0 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    rowKeyboard: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default PopupRestock;



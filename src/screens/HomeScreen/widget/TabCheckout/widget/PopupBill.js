import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupBill extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quality: 0
        }
    }

    setStateFromParent = (quality) => {
        this.setState({
            quality
        })
    }

    onPressNumber = (number) => {
        this.setState(prevState => ({
            quality: prevState.quality == 0 ? `${number}` : `${prevState.quality}${number}`
        }))
    }

    convertNagativeNumber = () => {
        this.setState({
            quality: 0
        })
    }

    clearNumber = () => {
        this.setState(prevState => ({
            quality: `${prevState.quality}`.slice(0, (`${prevState.quality}`.length) - 1)
        }))
    }

    submitStock = () => {
        this.props.submitRestock(this.state.quality);
    }

    // ---------- Render --------
    render() {
        const { title, visible, onRequestClose, language } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{}}
                width={450}
            >
                <View style={{
                    height: scaleSzie(300), backgroundColor: '#fff',
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
                            justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10), marginBottom: scaleSzie(3)
                        }} >
                            <Text style={{ fontSize: scaleSzie(40), color: '#0764B0' }} >
                                {this.state.quality}
                            </Text>
                        </View>
                        {/* ----- Keyboard ---- */}
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {/* ---- Left ----- */}
                            <View style={{ flex: 1, }} >
                                {/* ---- Row 1 ----- */}
                                <View style={styles.rowKeyboard} >
                                    {
                                        [7, 8, 9].map((number, index) => <Key
                                            key={index}
                                            number={number}
                                            onPressNumber={this.onPressNumber}
                                        />)
                                    }
                                </View>
                                {/* ---- Row 2 ----- */}
                                <View style={styles.rowKeyboard} >
                                    {
                                        [4, 5, 6].map((number, index) => <Key
                                            key={index}
                                            number={number}
                                            onPressNumber={this.onPressNumber}
                                        />)
                                    }
                                </View>
                                {/* ---- Row 3 ----- */}
                                <View style={styles.rowKeyboard} >
                                    {
                                        [1, 2, 3].map((number, index) => <Key
                                            key={index}
                                            number={number}
                                            onPressNumber={this.onPressNumber}
                                        />)
                                    }
                                </View>
                                {/* ---- Row 4 ----- */}
                                <View style={styles.rowKeyboard} >
                                    <Button onPress={this.convertNagativeNumber} style={styles.keyContainer} >
                                        <Text style={{ fontSize: scaleSzie(26), color: '#404040', fontWeight: '500' }} >
                                            {`AC`}
                                        </Text>
                                    </Button>

                                    <Key
                                        number={0}
                                        onPressNumber={this.onPressNumber}
                                    />
                                    <TouchableOpacity onPress={this.clearNumber} style={styles.keyContainer} >
                                        <Image source={IMAGE.clearKeyboard} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                            {/* ---- Line ----- */}
                            <View style={{ width: scaleSzie(18), paddingBottom: scaleSzie(22), paddingTop: scaleSzie(9), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: scaleSzie(4), backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* -------------- */}
                            <View style={{ width: scaleSzie(70) }} >
                                {
                                    [10, 20, 50, 100].map((number, index) => <Key
                                        key={number}
                                        number={number}
                                        onPressNumber={this.onPressNumber}
                                        style={{ marginTop: scaleSzie(9) }}
                                    />)
                                }
                            </View>
                            {/* ---- Line ----- */}
                            <View style={{ width: scaleSzie(18), paddingBottom: scaleSzie(22), paddingTop: scaleSzie(9), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: scaleSzie(4), backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* -------------- */}
                            <View style={{ width: scaleSzie(90) }} >
                                {
                                    [10, 20, 50, 100].map((number, index) => <Key
                                        key={number}
                                        number={number}
                                        onPressNumber={this.onPressNumber}
                                        style={{ marginTop: scaleSzie(9) }}
                                    />)
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </PopupParent>
        );
    }
}

const Key = ({ number, onPressNumber, style }) => {
    return (
        <Button onPress={() => onPressNumber(number)} style={[styles.keyContainer, style]} >
            <Text style={{ fontSize: scaleSzie(26), color: '#404040', fontWeight: '500' }} >
                {number}
            </Text>
        </Button>
    );
}


const styles = StyleSheet.create({
    keyContainer: {
        width: scaleSzie(70),
        height: scaleSzie(35),
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
        justifyContent: 'space-between',
        marginTop: scaleSzie(9)
    }
})

export default PopupBill;



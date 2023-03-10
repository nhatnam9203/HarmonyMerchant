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
import { scaleSize, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupRestock extends React.Component {

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

    onPressAddNumber = (number) => {
        const temptData = parseInt(this.state.quality) + number;
        this.setState({
            quality: temptData,
        })
    }

    convertNagativeNumber = () => {
        this.setState({
            quality: 0
        })
    }

    clearNumber = async () => {
        if (this.state.quality !== 0) {
            if (this.state.quality.length == 1) {
                await this.setState({
                    quality: 0
                })
            } else {
                await this.setState(prevState => ({
                    quality: `${prevState.quality}`.slice(0, (`${prevState.quality}`.length) - 1)
                }))
            }
        }
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
                width={scaleSize(330)}
            >
                <View style={{
                    height: scaleSize(420), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15),
                    borderBottomRightRadius: scaleSize(15),
                    paddingHorizontal: scaleSize(12)
                }} >
                    <View style={{ flex: 1 }} >
                        {/* ------- Title ----- */}
                        <View style={{ paddingTop: scaleSize(14), paddingBottom: scaleSize(8), alignItems: 'center' }} >
                            <Text style={{ fontSize: scaleSize(16), color: '#0764B0' }} >
                                {localize('Enter the amount of product added', language)}
                            </Text>
                        </View>
                        {/* ------ Display Box --- */}
                        <View style={{
                            height: scaleSize(65), backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#C5C5C5',
                            justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSize(10), marginBottom: scaleSize(3)
                        }} >
                            <Text style={{ fontSize: scaleSize(40), color: '#0764B0' }} >
                                {this.state.quality}
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
                                        <Text style={{ fontSize: scaleSize(26), color: '#404040', fontWeight: '500' }} >
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
                            {/* ---- Center ----- */}
                            <View style={{ width: scaleSize(18), paddingBottom: scaleSize(38), paddingTop: scaleSize(9), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: scaleSize(4), backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* ---- Right ----- */}
                            <View style={{ width: scaleSize(70) }} >
                                {
                                    [10, 20, 50, 100].map((number, index) => <Key
                                        key={number}
                                        number={number}
                                        onPressNumber={this.onPressAddNumber}
                                        style={{ marginTop: scaleSize(9) }}
                                    />)
                                }
                            </View>
                        </View>
                        {/* ---- Footer ------ */}
                        <View style={{
                            height: scaleSize(60), flexDirection: 'row',
                            justifyContent: 'center'
                        }} >
                            <ButtonCustom
                                width={200}
                                height={45}
                                backgroundColor="#F1F1F1"
                                title={localize('Cancel', language)}
                                textColor="#6A6A6A"
                                onPress={() => onRequestClose()}
                                style={{
                                    borderRadius: scaleSize(2),
                                    borderColor: '#C5C5C5',
                                    borderWidth: 1,
                                }}
                                styleText={{
                                    fontSize: scaleSize(16),
                                    fontWeight: 'normal'
                                }}
                            />
                            <View style={{ width: scaleSize(15) }} />
                            <ButtonCustom
                                width={200}
                                height={45}
                                backgroundColor="#0764B0"
                                title={localize('Submit', language)}
                                textColor="#fff"
                                onPress={this.submitStock}
                                style={{
                                    borderRadius: scaleSize(2),
                                    borderColor: '#C5C5C5',
                                    borderWidth: 1,
                                }}
                                styleText={{
                                    fontSize: scaleSize(16),
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

const Key = ({ number, onPressNumber, style }) => {
    return (
        <Button onPress={() => onPressNumber(number)} style={[styles.keyContainer, style]} >
            <Text style={{ fontSize: scaleSize(26), color: '#404040', fontWeight: '500' }} >
                {number}
            </Text>
        </Button>
    );
}


const styles = StyleSheet.create({
    keyContainer: {
        width: scaleSize(67),
        height: scaleSize(45),
        backgroundColor: '#fff',
        borderRadius: scaleSize(4),
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                borderRadius: scaleSize(4),
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
        marginTop: scaleSize(9)
    }
})

export default PopupRestock;



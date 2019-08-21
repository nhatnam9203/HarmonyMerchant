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


    extract = () => {

    }

    cancel = () => {

    }

    done = () => {

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
                width={470}
            >
                <View style={{
                    height: scaleSzie(297), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(12)
                }} >
                    <View style={{ flex: 1 }} >
                        {/* ------ Display Box --- */}
                        <View style={{ flexDirection: 'row', height: scaleSzie(85), marginTop: scaleSzie(14) }} >
                            {/* ------ Box Left --- */}
                            <View style={{
                                width: scaleSzie(318), backgroundColor: '#FAFAFA', borderWidth: 3,
                                borderColor: 'rgb(235,235,235)',
                                justifyContent: 'center', paddingLeft: scaleSzie(20),borderRadius:4
                            }} >
                                <Text style={{ fontSize: scaleSzie(60), color: '#8BC53F' }} >
                                    {`$ ${this.state.quality}`}
                                </Text>
                            </View>
                            <View style={{ width: scaleSzie(18), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: 2, backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* ------ Box Right --- */}
                            <View style={{ flex: 1, borderWidth: 3,borderColor: 'rgb(235,235,235)',borderRadius:4,
                        backgroundColor:'rgb(243,243,243)',paddingHorizontal:scaleSzie(10),paddingTop:scaleSzie(14)
                        }} >
                            <Text style={{color:'rgb(29,110,178)',fontWeight:'600',fontSize:scaleSzie(20),
                        marginBottom:scaleSzie(8)
                        }} >
                                Change
                            </Text>
                            <Text style={{color:'rgb(65,65,65)',fontWeight:'600',fontSize:scaleSzie(18)}} >
                                {`$ ${0}`}
                            </Text>
                            </View>
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
                            <View style={{ width: scaleSzie(18), paddingBottom: scaleSzie(25), paddingTop: scaleSzie(9), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: 2, backgroundColor: '#D0D2D3' }} />
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
                            <View style={{ width: scaleSzie(18), paddingBottom: scaleSzie(25), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: 2, backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* ------- Extract  ------- */}
                            <View style={{ width: scaleSzie(110), marginTop: scaleSzie(9) }} >
                                {/* -------- Btn Extract ------ */}
                                <Button onPress={this.extract} style={{
                                    width: '100%', height: scaleSzie(35), backgroundColor: '#4CD964',
                                    justifyContent: 'center', alignItems: 'center', borderRadius: scaleSzie(4),
                                }} >
                                    <Text style={{ color: '#fff', fontSize: scaleSzie(20), fontWeight: '600' }} >
                                        Exact
                                    </Text>
                                </Button>
                                {/* -------- Btn Cancel ------ */}
                                <Button onPress={this.cancel} style={{
                                    width: '100%', height: scaleSzie(35), backgroundColor: '#F1F1F1',
                                    justifyContent: 'center', alignItems: 'center', borderRadius: scaleSzie(4),
                                    borderColor: '#C5C5C5', borderWidth: 1, marginTop: scaleSzie(9)
                                }} >
                                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(20), fontWeight: '600' }} >
                                        Cancel
                                    </Text>
                                </Button>
                                {/* -------- Btn Done ------ */}
                                <Button onPress={this.done} style={{
                                    width: '100%', height: scaleSzie(79), backgroundColor: '#0764B0',
                                    justifyContent: 'center', alignItems: 'center', borderRadius: scaleSzie(4), marginTop: scaleSzie(9)
                                }} >
                                    <Text style={{ color: '#fff', fontSize: scaleSzie(20), fontWeight: '600' }} >
                                        Done
                                    </Text>
                                </Button>
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
        marginTop: scaleSzie(9),
    }
})

export default PopupBill;



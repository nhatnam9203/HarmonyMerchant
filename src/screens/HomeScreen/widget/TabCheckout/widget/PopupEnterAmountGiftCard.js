import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';

import { PopupParent, Button } from '@components';
import { scaleSzie, localize, formatMoney } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

class PopupEnterAmountGiftCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quality: '0'
        }
    }

    setStateFromParent = (quality) => {
        this.setState({
            quality
        })
    }

    onPressNumber = (number) => {
        this.setState(prevState => ({
            quality: prevState.quality === '0' ? `${number}` : `${prevState.quality}${number}`
        }))
    }

    onPressAddNumber = (number) => {
        const temptData = parseFloat(this.state.quality) + number;
        this.setState({
            quality: temptData,
        })
    }

    addDotInNumber = () => {
        if (!`${this.state.quality}`.includes('.')) {
            this.setState(prevState => ({
                quality: `${prevState.quality}.`
            }))
        }
    }

    clearNumber = async () => {
        if (this.state.quality !== 0) {
            if (this.state.quality.length == 1) {
                await this.setState({
                    quality: `${0}`
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


    extract = () => {
        this.props.extractBill();
    }

    cancel = () => {
        this.setState({
            quality: '0'
        })
    }

    done = () => {
        this.props.doneBill();
    }

    addGiftCardAmount = () => {
        const { quality } = this.state;
        if (parseFloat(quality) > 0) {
            this.props.actions.appointment.handleEnterGiftCardAmount(parseFloat(quality));
        } else {
            alert("Amount must greater than 0!")
        }
    }

    // ---------- Render --------
    render() {
        const { title, visible, onRequestClose, language, visiblePopupGiftCardEnterAmount } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visiblePopupGiftCardEnterAmount}
                onRequestClose={() => {
                    this.setState({
                        quality: '0'
                    });
                    this.props.actions.appointment.switchPopupGiftCardEnterAmount(false);
                    // onRequestClose();
                }}
                style={{}}
                width={350}
                styleTitle={{
                    fontSize: scaleSzie(18),
                    fontWeight: "bold"
                }}
            >
                <View style={{
                    minHeight: scaleSzie(360), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(12)
                }} >
                    <View style={{ flex: 1 }} >
                        {/* ------ Display Box --- */}
                        <Text style={{ textAlign: "center", marginTop: scaleSzie(20), fontSize: scaleSzie(16), fontWeight: "600" }} >
                            {`Enter the amount to active gift card`}
                        </Text>

                        {/* ------ Display Box --- */}
                        <View style={{ flexDirection: 'row', height: scaleSzie(50), marginTop: scaleSzie(14) }} >
                            {/* ------ Box Left --- */}
                            <View style={{
                                flex: 1, backgroundColor: '#FAFAFA', borderWidth: 2,
                                borderColor: '#6A6A6A',
                                justifyContent: 'space-between', paddingHorizontal: scaleSzie(8), borderRadius: 4,
                                flexDirection: 'row', alignItems: 'center',
                            }} >
                                <Text style={{ fontSize: scaleSzie(28), color: '#8BC53F', fontWeight: "600" }} >
                                    {`$`}
                                </Text>
                                <Text style={{ fontSize: scaleSzie(28), color: '#8BC53F', fontWeight: "600" }} >
                                    {`${formatMoney(this.state.quality)}`}
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
                                    <Button onPress={this.addDotInNumber} style={styles.keyContainer} >
                                        <Text style={{ fontSize: scaleSzie(26), color: '#404040', fontWeight: '500' }} >
                                            {`.`}
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
                            <View style={{ width: scaleSzie(18), paddingBottom: scaleSzie(2), paddingTop: scaleSzie(9), alignItems: 'center' }} >
                                <View style={{ height: '100%', width: 4, backgroundColor: '#D0D2D3' }} />
                            </View>
                            {/* -------------- */}
                            <View style={{ width: scaleSzie(70) }} >
                                {
                                    [10, 20, 50, 100].map((number, index) => <Key
                                        key={number}
                                        number={number}
                                        onPressNumber={this.onPressAddNumber}
                                        style={{ marginTop: scaleSzie(9), }}
                                        txtStyle={{
                                            color: "#0764B0"
                                        }}
                                    />)
                                }
                            </View>
                        </View>

                        {/* ------------- Add To Basket Button -------- */}
                        <Button onPress={this.addGiftCardAmount} style={{
                            height: scaleSzie(50), width: "100%", backgroundColor: '#0764B0', marginVertical: scaleSzie(15),
                            borderRadius: scaleSzie(2), alignItems: "center", justifyContent: "center"
                        }} >
                            <Text style={{ color: "#fff", fontSize: scaleSzie(20), fontWeight: "600" }} >
                                {`ADD TO BASKET`}
                            </Text>
                        </Button>

                    </View>
                </View>
            </PopupParent>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { isUpdateQuantityOfGiftCard, addGiftCardInfoAction } = this.props;
        if (isUpdateQuantityOfGiftCard && prevProps.isUpdateQuantityOfGiftCard !== isUpdateQuantityOfGiftCard) {
            this.props.actions.appointment.updateQuantityOfGiftCard(false);
            const tempQuantity = addGiftCardInfoAction?.giftCardInfo?.isActive ? `0` : `${addGiftCardInfoAction?.giftCardInfo?.amount || 0}`
            this.setState({
                quality: tempQuantity
            });
            // console.log("--------- updateQuantityOfGiftCard -----");
           
           
        }
    }

}

const Key = ({ number, onPressNumber, style, txtStyle }) => {
    return (
        <TouchableOpacity onPress={() => onPressNumber(number)} style={[styles.keyContainer, style]} >
            <Text style={[{ fontSize: scaleSzie(26), color: '#404040', fontWeight: '500' }, txtStyle]} >
                {number}
            </Text>
        </TouchableOpacity>
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

const mapStateToProps = state => ({
    visiblePopupGiftCardEnterAmount: state.appointment.visiblePopupGiftCardEnterAmount,
    isUpdateQuantityOfGiftCard: state.appointment.isUpdateQuantityOfGiftCard,
    addGiftCardInfoAction: state.appointment.addGiftCardInfoAction
});

export default connectRedux(mapStateToProps, PopupEnterAmountGiftCard);



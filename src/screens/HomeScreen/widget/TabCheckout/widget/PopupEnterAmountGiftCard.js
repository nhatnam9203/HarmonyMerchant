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
import { scaleSzie, formatNumberFromCurrency, formatMoney } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

const initState = {
    leftNumbers: "0",
    rightNumners: "00",
    isPressDot: 0,
    isClear: 1,
    quality: '0',
    isResetQuantityToZero: false
}

class PopupEnterAmountGiftCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = initState;
    }

    setStateFromParent = (quality) => {
        this.setState({
            quality
        });
    }

    onPressNumber = async (number) => {
        const { leftNumbers, isPressDot, rightNumners } = this.state;
        const amount = formatMoney(`${leftNumbers}.${rightNumners}`);
        if (`${amount}`.length < 12) {
            if (!isPressDot) {
                this.setState(prevState => ({
                    leftNumbers: prevState.leftNumbers == '0' ? `${number}` : `${prevState.leftNumbers}${number}`,
                    isClear: 1,
                }));
            } else {
                let tempRightNumners = false;
                if (isPressDot === 1) {
                    tempRightNumners = `${number}${rightNumners[1]}`;
                } else if (isPressDot === 2) {
                    tempRightNumners = `${rightNumners[0]}${number}`;
                }
                if (tempRightNumners) {
                    this.setState({
                        rightNumners: tempRightNumners,
                        isPressDot: isPressDot === 1 ? 2 : 0,
                        isClear: 1,
                    });
                }
            }
        }

    }

    onPressAddNumber = (number) => {
        const { leftNumbers, rightNumners } = this.state;
        const tempQuantity = formatNumberFromCurrency(`${leftNumbers}.${rightNumners}`) + number;
        const { leftMoney, rightMoney } = this.formatState(tempQuantity);

        this.setState({
            leftNumbers: leftMoney,
            rightNumners: rightMoney,
            isPressDot: 0,
            isClear: 1,
        });
    }

    formatState = (MoneyString) => {
        const quantity = `${MoneyString}`.split(".");

        return {
            leftMoney: quantity[0],
            rightMoney: quantity[1] ? (quantity[1] < 10 && quantity[1].length < 2 ? `0${quantity[1]}` : `${quantity[1]}`) : "00",
        }

    }

    addDotInNumber = () => {
        this.setState({
            isPressDot: 1
        })
    }

    clearNumber = async () => {
        this.setState(initState);
    }

    cancel = () => {
        this.setState({
            quality: '0'
        })
    }


    addGiftCardAmount = () => {
        // const { quality } = this.state;
        const { leftNumbers, rightNumners } = this.state;

        const money = formatNumberFromCurrency(`${leftNumbers}.${rightNumners}`);
        if (formatNumberFromCurrency(money) > 0) {
            this.props.actions.appointment.handleEnterGiftCardAmount(formatNumberFromCurrency(money));
        } else {
            alert("Amount must greater than 0!")
        }
    }

    onRequestClose = () => {
        this.props.actions.appointment.switchPopupGiftCardEnterAmount(false);
        this.setState(initState);
    }

    // ---------- Render --------
    render() {
        const { title, visible, onRequestClose, language, visiblePopupGiftCardEnterAmount, addGiftCardInfoAction } = this.props;
        const { leftNumbers, rightNumners } = this.state;
        const amount = formatMoney(`${leftNumbers}.${rightNumners}`);

        const tempTitle = addGiftCardInfoAction?.giftCardInfo?.isActive === 1 ? "Gift Card" : "Gift Card Active Amount";
        const tempDescription = addGiftCardInfoAction?.giftCardInfo?.isActive === 1 ? "Enter the amount" : "Enter the amount to active gift card";

        return (
            <PopupParent
                title={tempTitle}
                visible={visiblePopupGiftCardEnterAmount}
                onRequestClose={this.onRequestClose}
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
                            {`${tempDescription}`}
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
                                    {`${amount}`}
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

    async componentDidUpdate(prevProps, prevState) {
        const { isUpdateQuantityOfGiftCard, addGiftCardInfoAction } = this.props;
        if (isUpdateQuantityOfGiftCard && prevProps.isUpdateQuantityOfGiftCard !== isUpdateQuantityOfGiftCard) {
            this.props.actions.appointment.updateQuantityOfGiftCard(false);
            const tempQuantity = addGiftCardInfoAction?.giftCardInfo?.isActive === 1 ? `0.00` : `${addGiftCardInfoAction?.giftCardInfo?.amount}`;

            const quantityFormat = formatNumberFromCurrency(tempQuantity);
            const { leftMoney, rightMoney } = this.formatState(`${quantityFormat}`);

            this.setState({
                leftNumbers: leftMoney,
                rightNumners: rightMoney,
                isPressDot: 0,
                isClear: 1,
            });

            this.props.actions.appointment.switchPopupGiftCardEnterAmount(true);
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

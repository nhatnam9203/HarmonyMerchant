import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button, } from '@components';
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

class RowTableProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: true,
            isCheck: false
        }
    }

    handleArchirveStaff = () => {
        this.setState({
            isArchive: false
        })
    }

    handleRestoreStaff = () => {
        this.setState({
            isArchive: true
        })
    }

    selectCheckBox = () => {
        this.setState(prevState => ({ isCheck: !prevState.isCheck }), () => {
            if (!this.state.isCheck) {
                this.props.unSelectAll();
            }
        })
    }

    setCheckBoxFromParent = (isSelect) => {
        this.setState({ isCheck: isSelect })
    }

    render() {
        const { product,nameCategory } = this.props;
        const { isCheck } = this.state;
        const temptIconCheckbox = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    flex: 1, flexDirection: 'row',
                }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: scaleSzie(12)
                    }]} >
                        <Button onPress={this.selectCheckBox} style={{ marginRight: scaleSzie(12) }} >
                            <Image source={temptIconCheckbox}
                            />
                        </Button>
                        <Text style={styles.textTableHeader} >
                            {product.name}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: scaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {product.sku}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {nameCategory}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {product.price}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 4 ------ */}

                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(140), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {product.needToorDer}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSzie(14)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default RowTableProducts;


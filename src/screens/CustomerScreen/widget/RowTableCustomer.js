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

class RowTableCustomer extends React.Component {

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
        const { product, index, archiveService, editService, restoreService } = this.props;
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
                        <Text style={styles.textTableHeader} >
                            {/* {product.name} */}
                            Adrienne Miller
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: scaleSzie(172), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {/* {product.sku} */}
                            093755566
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(172), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {/* {product.price} */}
                            abc@gmail.com
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(172), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        Deandre Wallace
                        </Text>
                        <Text style={styles.textTableHeader} >
                        (874) 895-8899
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
        color: '#C5C5C5',
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

export default RowTableCustomer;


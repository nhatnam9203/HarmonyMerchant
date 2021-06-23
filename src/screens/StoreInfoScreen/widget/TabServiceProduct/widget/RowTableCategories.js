import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { ButtonCustom, } from '@components';
import { ScaleSzie } from '@utils';
import IMAGE from '@resources';

class RowTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: this.props.category.isDisabled === 0 ? true : false
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

    render() {
        const { category, index, archiveService, editService, restoreService } = this.props;
        const { isArchive } = this.state;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    width: ScaleSzie(300), flexDirection: 'row',
                }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: ScaleSzie(12)
                    }]} >
                        <Image source={IMAGE.indicate}
                            style={{ width: ScaleSzie(12), height: ScaleSzie(29), marginRight: ScaleSzie(12) }}
                        />
                        <View style={{flex:1}} >
                        <Text style={styles.textTableHeader}  numberOfLines={1} >
                            {category.name}
                        </Text>
                        </View>
                        
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: ScaleSzie(300), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {category.categoryType}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{
                    flex: 1,
                    flexDirection: 'row'
                }} >
                    <View style={styles.actionButton} >
                        <ButtonCustom
                            width={'80%'}
                            height={28}
                            backgroundColor="#0764B0"
                            title="Edit"
                            textColor="#fff"
                            onPress={() => editService()}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: ScaleSzie(2) }}
                            styleText={{
                                fontSize: ScaleSzie(14)
                            }}
                        />
                    </View>
                    <View style={styles.actionButton} >
                        {
                           category.isDisabled === 0 ? <ButtonCustom
                                width={'80%'}
                                height={28}
                                backgroundColor="#FF3B30"
                                title="Archive"
                                textColor="#fff"
                                onPress={() => archiveService()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: ScaleSzie(2) }}
                                styleText={{
                                    fontSize: ScaleSzie(14)
                                }}
                            /> :
                                <ButtonCustom
                                    width={'80%'}
                                    height={28}
                                    backgroundColor="#F1F1F1"
                                    title="Restore"
                                    textColor="#6A6A6A"
                                    onPress={() => restoreService()}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: ScaleSzie(2) }}
                                    styleText={{
                                        fontSize: ScaleSzie(14)
                                    }}
                                />
                        }

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
        height: ScaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: ScaleSzie(14)
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

export default RowTable;


import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { ButtonCustom, } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

class RowTableServices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: true
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
        const { service, index, archiveService, editService, restoreService,
            categoryName, extraName
        } = this.props;
        const { isArchive } = this.state;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    width: scaleSize(230), flexDirection: 'row',
                }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: scaleSize(12)
                    }]} >
                        {
                            service.imageUrl ? <FastImage
                                style={{ width: scaleSize(30), height: scaleSize(30) }}
                                source={{
                                    uri: service.imageUrl,
                                    priority: FastImage.priority.low,
                                    cache:FastImage.cacheControl.immutable
                                }}
                            /> : <Image source={IMAGE.service_holder} style={{ width: scaleSize(30), height: scaleSize(30) }} />
                        }
                        <Image source={IMAGE.indicate}
                            style={{
                                width: scaleSize(12), height: scaleSize(29), marginRight: scaleSize(12),
                                marginLeft: scaleSize(8)
                            }}
                        />
                        <View style={{flex:1}} >
                        <Text style={styles.textTableHeader}  numberOfLines={1} >
                            {service.name}
                        </Text>
                        </View>

                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: scaleSize(180), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader}  numberOfLines={1} >
                            {categoryName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSize(180), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSize(10) }} >
                        <Text style={styles.textTableHeader}  numberOfLines={1}  >
                            {extraName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 4 ------ */}
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
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                            styleText={{
                                fontSize: scaleSize(14)
                            }}
                        />
                    </View>
                    <View style={styles.actionButton} >
                        {
                            service.isDisabled == 0 ? <ButtonCustom
                                width={'80%'}
                                height={28}
                                backgroundColor="#FF3B30"
                                title="Archive"
                                textColor="#fff"
                                onPress={() => archiveService()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                                styleText={{
                                    fontSize: scaleSize(14)
                                }}
                            /> :
                                <ButtonCustom
                                    width={'80%'}
                                    height={28}
                                    backgroundColor="#F1F1F1"
                                    title="Restore"
                                    textColor="#6A6A6A"
                                    onPress={() => restoreService()}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                                    styleText={{
                                        fontSize: scaleSize(14)
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
        height: scaleSize(60),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSize(14)
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

export default RowTableServices;


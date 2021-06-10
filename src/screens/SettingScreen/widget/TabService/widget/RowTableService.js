import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { ButtonCustom } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

const RowTableService = ({ service, index, archiveService, editService, restoreService, categoryName, move, moveEnd }) => {

    // const [source, setSource] = useState({
    //     uri: service?.imageUrl,
    //     priority: FastImage.priority.low,
    //     cache: FastImage.cacheControl.immutable
    // });

    // useEffect(() => {
    //     if (source?.uri && source?.uri !== service?.imageUrl) {
    //         setSource({
    //             uri: service?.imageUrl,
    //             priority: FastImage.priority.low,
    //             cache: FastImage.cacheControl.immutable
    //         })
    //     }
    // }, [service?.imageUrl])


    return (
        <TouchableOpacity
            onLongPress={move}
            onPressOut={moveEnd}
            style={styles.tableHeader}
        >
            {/* ----- 1 ------ */}
            <View style={[{
                width: scaleSize(50),
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }]} >
                <Image source={IMAGE.indicate}
                    style={{ width: scaleSize(12), height: scaleSize(29) }}
                />
                <Text style={styles.textTableHeader} >
                    {`${parseInt(index) + 1}.`}
                </Text>
            </View>
            {/* ----- 2 ------ */}
            <View style={{
                width: scaleSize(160), flexDirection: 'row',
            }} >
                <View style={{ justifyContent: 'center' }} >
                {
                        service.imageUrl ? <FastImage
                            style={{ width: scaleSize(30), height: scaleSize(30) }}
                            source={{
                                uri: service?.imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                            // onError={() => setSource(IMAGE.service_holder)}
                        /> : <FastImage source={IMAGE.service_holder} style={{ width: scaleSize(30), height: scaleSize(30) }} />
                    }

                </View>

                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                    <Text style={styles.textTableHeader} numberOfLines={1} >
                        {service.name}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 3 ------ */}
            <View style={{
                width: scaleSize(140), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                    <Text style={styles.textTableHeader} >
                        {categoryName}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 4 ----- */}
            <View style={{
                width: scaleSize(110), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                    <Text style={styles.textTableHeader} >

                        {
                            service.isDisabled === 0 ? 'Active' : 'Disable'
                        }
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 5 ------ */}
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
                        service.isDisabled === 0 ? <ButtonCustom
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
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSize(55),
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

export default RowTableService;


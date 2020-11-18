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
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

const RowTableExtra = ({ extra, index, archiveExtra, editService, restoreExtra, move, moveEnd }) => {

    const [source, setSource] = useState({
        uri: extra?.imageUrl,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable
    });

    useEffect(() => {
        if (source?.uri && source?.uri !== extra?.imageUrl) {
            setSource({
                uri: extra?.imageUrl,
                priority: FastImage.priority.low,
                cache: FastImage.cacheControl.immutable
            })
        }
    }, [extra?.imageUrl])

    return (
        <TouchableOpacity
            onLongPress={move}
            onPressOut={moveEnd}
            style={styles.tableHeader} >
            {/* ----- 1 ------ */}
            <View style={[{
                width: scaleSzie(50),
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }]} >
                <Image source={IMAGE.indicate}
                    style={{ width: scaleSzie(12), height: scaleSzie(29) }}
                />
                <Text style={styles.textTableHeader} >
                    {`${parseInt(index) + 1}.`}
                </Text>
            </View>
            {/* ----- 2 ------ */}
            <View style={{
                width: scaleSzie(160), flexDirection: 'row',
            }} >
                <View style={{ justifyContent: 'center', marginRight: scaleSzie(8) }} >
                    {
                        extra.imageUrl ? <FastImage
                            style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                            source={source}
                            onError={() => setSource(IMAGE.extra_holder)}
                        /> : <FastImage source={IMAGE.extra_holder} style={{ width: scaleSzie(30), height: scaleSzie(30) }} />
                    }
                </View>

                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                    <Text style={styles.textTableHeader} numberOfLines={1} >
                        {extra.name}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 3 ------ */}
            <View style={{
                width: scaleSzie(140), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >
                        {`${extra.price}`}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 4 ----- */}
            <View style={{
                width: scaleSzie(110), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    <Text style={styles.textTableHeader} >

                        {
                            extra.isDisabled === 0 ? 'Active' : 'Disable'
                        }
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
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
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                        styleText={{
                            fontSize: scaleSzie(14)
                        }}
                    />
                </View>
                <View style={styles.actionButton} >
                    {
                        extra.isDisabled === 0 ? <ButtonCustom
                            width={'80%'}
                            height={28}
                            backgroundColor="#FF3B30"
                            title="Archive"
                            textColor="#fff"
                            onPress={() => archiveExtra()}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                        /> :
                            <ButtonCustom
                                width={'80%'}
                                height={28}
                                backgroundColor="#F1F1F1"
                                title="Restore"
                                textColor="#6A6A6A"
                                onPress={() => restoreExtra()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                                styleText={{
                                    fontSize: scaleSzie(14)
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
        height: scaleSzie(55),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
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

export default RowTableExtra;


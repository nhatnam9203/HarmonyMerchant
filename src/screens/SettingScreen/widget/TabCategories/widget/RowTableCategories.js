import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch
} from 'react-native';

import { ButtonCustom } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

class RowTableCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: true
        }
    }

    toggleIsDisplay = (isActive) => {
        const { category } = this.props;
        this.props.toggleIsDisplayOnSignInApp(category, isActive);
    }

    render() {
        const { category, index, archiveCategory, editCategory, restoreCategory,
            move, moveEnd
        } = this.props;
        return (
            <TouchableOpacity
                onLongPress={move}
                onPressOut={moveEnd}
                style={styles.tableHeader} >
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
                    width: scaleSize(150), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                        <Text style={styles.textTableHeader} numberOfLines={2} >
                            {category.name}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{
                    width: scaleSize(100), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            {category.categoryType}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSize(170), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        {
                            category?.categoryType === "Service" ? <Switch
                                trackColor={{ false: "#767577", true: "#0764B0" }}
                                ios_backgroundColor="#E5E5E5"
                                onValueChange={this.toggleIsDisplay}
                                value={category?.isShowSignInApp}
                            /> : <View />
                        }

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
                            onPress={() => editCategory()}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                            styleText={{
                                fontSize: scaleSize(14)
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
                                onPress={() => archiveCategory()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                                styleText={{
                                    fontSize: scaleSize(13)
                                }}
                            /> :
                                <ButtonCustom
                                    width={'80%'}
                                    height={28}
                                    backgroundColor="#F1F1F1"
                                    title="Restore"
                                    textColor="#6A6A6A"
                                    onPress={() => restoreCategory()}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                                    styleText={{
                                        fontSize: scaleSize(13)
                                    }}
                                />
                        }

                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        height: scaleSize(55),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSize(13)
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

export default RowTableCategories;


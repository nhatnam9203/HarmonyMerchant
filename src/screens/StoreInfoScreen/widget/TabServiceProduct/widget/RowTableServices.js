import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { ButtonCustom, } from '@components';
import { scaleSzie } from '@utils';
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
                    width: scaleSzie(230), flexDirection: 'row',
                }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: scaleSzie(12)
                    }]} >
                        <Image source={IMAGE.indicate}
                            style={{ width: scaleSzie(12), height: scaleSzie(29), marginRight: scaleSzie(12) }}
                        />
                        <Text style={styles.textTableHeader} >
                            {service.name}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: scaleSzie(180), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {categoryName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ----- */}
                <View style={{
                    width: scaleSzie(180), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader}  >
                            {extraName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
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
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
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
                                    textColor="#C5C5C5"
                                    onPress={() => restoreService()}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                                    styleText={{
                                        fontSize: scaleSzie(14)
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

export default RowTableServices;


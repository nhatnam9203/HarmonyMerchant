import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { scaleSzie } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { Text, Button, ButtonCustom } from '@components';
import {ItemBanner} from './widget';

class Layout extends React.Component {

    renderHeader() {
        return (
            <View style={styles.header} >
                <View style={{
                    flex: 1, justifyContent: 'flex-end',
                    paddingLeft: scaleSzie(15), paddingBottom: scaleSzie(10)
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        Media List
                        </Text>
                </View>
                <View style={{
                    flex: 0.8,
                    paddingBottom: scaleSzie(10), justifyContent: 'flex-end'
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        Create new media
                        </Text>
                </View>
            </View>
        );
    }

    renderLeftContent() {
        return (
            <View style={styles.leftContent} >
                <FlatList 
                data={[1,2,3,4]}
                renderItem={({item,index}) => <ItemBanner />}
                keyExtractor={(item,index) => `${index}`}
                showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    renderRightContent() {
        return (
            <View style={styles.rightContent} >
                <View style={{ flex: 1, paddingTop: scaleSzie(40) }} >
                    <View style={{
                        width: scaleSzie(300), height: scaleSzie(240),
                        borderWidth: 2, borderColor: '#C5C5C5',
                        borderStyle: "dashed",
                        borderRadius: scaleSzie(14),
                        alignItems: 'center',
                        paddingTop: scaleSzie(30)

                    }} >
                        <Button onPress={this.takePhoto} >
                            <Image
                                source={IMAGE.camera}
                            />
                        </Button>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: scaleSzie(10) }} >
                            <Text style={{
                                color: '#6A6A6A', fontSize: scaleSzie(20), fontWeight: 'bold',
                            }} >
                                Take a Photo
                            </Text>
                            <Text style={{
                                color: '#6A6A6A', fontSize: scaleSzie(20),
                                marginVertical: scaleSzie(15)
                            }} >
                                Or
                            </Text>
                            <ButtonCustom
                                width={scaleSzie(140)}
                                height={40}
                                backgroundColor="#F1F1F1"
                                title="Browse File"
                                textColor="#6A6A6A"
                                onPress={this.openImageLibrary}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                styleText={{ fontSize: scaleSzie(16), fontWeight: '500' }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ height: scaleSzie(70), }} >
                    <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={() => { }}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(24), fontWeight: 'bold' }}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                <View style={styles.content} >
                    {this.renderLeftContent()}
                    {this.renderRightContent()}
                </View>
            </View>
        );
    }

}

export default Layout;


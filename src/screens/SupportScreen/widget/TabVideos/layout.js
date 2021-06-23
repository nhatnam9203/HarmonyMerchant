import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    FlatList
} from 'react-native';
import YouTube from 'react-native-youtube';

import { ButtonCustom, Text, Dropdown, Button } from '@components';
import { ScaleSzie, localize, YOUTUBE_DATA } from '@utils';
import IMAGE from '@resources';
import styles from './style';


class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <FlatList
                    data={YOUTUBE_DATA}
                    renderItem={({ item, index }) => <YouTubeItem
                        data={item}
                        showFullScreeen={this.showFullScreeen}
                    />}
                    keyExtractor={(item, index) => `${item.videoId}_${index}`}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        paddingHorizontal: ScaleSzie(20),
                        marginTop: ScaleSzie(20)
                    }}
                />

            </View>

        );
    }
}


class YouTubeItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            status: '',
            quality: '',
            error: ''
        }
    }

    onReady = (e) =>{
    }

    onChangeState = (e) =>{
    }

    onChangeQuality = (e) =>{
    }

    onError = (e) =>{
    }

    showFullScreeen =() =>{
        const { data} = this.props;
        this.props.showFullScreeen(data.videoId);
    }

    render() {
        const { data} = this.props
        return (
            <View style={{ width: ScaleSzie(180) }} >
                <View style={{ width: ScaleSzie(180), height: ScaleSzie(120) }} >
                    <YouTube
                        videoId={data.videoId}
                        // play={true}
                        fullscreen={true}
                        loop={false}
                        onReady={this.onReady}
                        onChangeState={this.onChangeState }
                        onChangeQuality={this.onChangeQuality}
                        onError={this.onError}
                        style={{ width: ScaleSzie(180), height: ScaleSzie(120) }}
                    />
                    <Button onPress={this.showFullScreeen} style={{
                        width: ScaleSzie(30), height: ScaleSzie(20),
                        position: 'absolute', bottom: 0, right: 0
                    }} >

                    </Button>
                </View>
                <View style={{ paddingRight: ScaleSzie(10), marginTop: ScaleSzie(10) }} >
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(12) }} >
                        {data.description}
                    </Text>
                </View>
            </View>
        )
    }

}


export default Layout;


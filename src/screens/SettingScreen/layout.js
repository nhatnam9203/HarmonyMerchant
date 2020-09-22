import React from 'react';
import {
    View,
    Image,
    Platform
} from 'react-native';

import { StatusBarHeader, Button, ParentContainer, Text, PopupLogout, 
    PopupCheckStaffPermission,
    ScrollableTabView
} from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabStaff, TabService, TabExtra, TabCategories, TabGaneral, TabHardware, TabTAX } from './widget';
import configs from "@configs";

const MENU = ["General", "Staff", "Categories", "Services", "Extra", "Tax", "Hardware", "Logout"];

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Settings', language)}
                </Text>
            </View>
        );
    }

    render() {
        const { language, navigation, settingTabPermission, isAddStaff } = this.props;
        const { isFocus, indexTab } = this.state;
        const isScrollWithoutAnimation = Platform.OS === "ios" ? false: true;

        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <LeftMenuSetting
                            ref={this.leftMenuSettingRef}
                            selectMenu={this.selectMenu}
                        />
                        <View style={{ flex: 1 }} >
                            <ScrollableTabView
                                ref={this.scrollTabRef}
                                style={{}}
                                initialPage={0}
                                tabBarPosition="bottom"
                                locked={true}
                                springTension={1}
                                springFriction={1}
                                // scrollWithoutAnimation={isScrollWithoutAnimation}
                                renderTabBar={() => <View />}
                            >
                                <TabGaneral ref={this.generalTabRef} />
                                <TabStaff
                                    ref={this.tabStaffRef}
                                />
                                <TabCategories
                                    ref={this.tabCategoriesRef}
                                />
                                <TabService
                                    ref={this.tabServiceRef}
                                />
                                <TabExtra ref={this.tabExtraRef} />
                                <TabTAX ref={this.taxTabRef} />
                                <TabHardware />
                            </ScrollableTabView>
                        </View>
                    </View>

                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                    {
                        isAddStaff ? <Button onPress={this.backTab} style={[configs.btn_right_position,{
                            width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                        }]} >
                            <Image source={IMAGE.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                        </Button> : null
                    }


                </View>
                <PopupLogout
                    visible={this.state.visibleLogout}
                    title={localize('Confirmation', language)}
                    message={`${localize('Are you sure you want to Log out', language)}?`}
                    onRequestClose={() => this.setState({ visibleLogout: false })}
                    confimYes={this.logout}
                    language={language}
                />
                <PopupCheckStaffPermission
                    ref={this.checkPermissionRef}
                    visiblePopupCheckStaffPermission={settingTabPermission}
                    title={localize('Input PIN Number', language)}
                    tabName="Settings"
                    onRequestClose={this.closePopupCheckSettingTabPermission}
                />
            </ParentContainer>
        );
    }
}

class LeftMenuSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            indexTab: 0
        };
    }

    setStateFromParent =async (indexTab) =>{
        await this.setState({
            indexTab
        });
    }

    render() {
        const {selectMenu} = this.props;
        const { indexTab } = this.state;

        return (
            <View style={{ width: scaleSzie(140), backgroundColor: 'rgb(250,250,250)',zIndex:1 }} >
                {
                    MENU.map((title, index) => {
                        const temptIcon = index === indexTab ? title : `${title}_in`;
                        const temptBackground = index === indexTab ? { backgroundColor: '#fff', borderLeftColor: '#0764B0', borderLeftWidth: 7 } : {};
                        const temptTextColorSelect = index === indexTab ? { color: '#0764B0' } : {}
                        return (
                            <Button onPress={() => selectMenu(index)} key={index} style={[{
                                height: scaleSzie(50), borderBottomColor: 'rgb(241,241,241)', borderBottomWidth: 3,
                                flexDirection: 'row', alignItems: "center", paddingLeft: scaleSzie(10)
                            }, temptBackground]} >
                                <Image source={IMAGE[temptIcon]} style={{
                                    width: scaleSzie(18), height: scaleSzie(18),
                                    marginRight: scaleSzie(10)
                                }} />
                                <Text style={[{ color: '#404040', fontSize: scaleSzie(16) }, temptTextColorSelect]} >
                                    {title}
                                </Text>
                            </Button>
                        );
                    })
                }

            </View>
        );
    }

}



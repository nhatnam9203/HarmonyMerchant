import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

import connectRedux from "@redux/ConnectRedux";
import ICON from "@resources";
import { scaleSzie } from "@utils";
import { Button } from "@components";

class ServicesAssign extends Component {
    state = {
        activeSections: [],
        content: []
    };

    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };

    selectService = (selectService) => () => {
        const tempContent = [...this.state.content];
        let isBreak = false;
        for (let category of tempContent) {
            if (category?.categoryId === selectService?.categoryId) {
                const tempSevices = category?.staffServices || [];
                for (let service of tempSevices) {
                    if (service?.serviceId === selectService?.serviceId) {
                        service.selected = !selectService?.selected;
                        isBreak = true;
                        break;
                    }
                }
            }

            if (isBreak) {
                break;
            }

        }
        this.setState({
            content: tempContent
        })
    }

    selectCategory = (categorySelect) => async () => {
        const tempContent = [...this.state.content];
        const servicesOfCategorySelect = categorySelect?.staffServices || [];
        const isSelectCategory = servicesOfCategorySelect.length > 0 ? this.getIsSelectCategory(servicesOfCategorySelect) : categorySelect?.selected;
        if (servicesOfCategorySelect.length > 0) {
            for (let category of tempContent) {
                if (category?.categoryId === categorySelect?.categoryId) {
                    const tempServices = category?.staffServices || [];
                    for (let service of tempServices) {
                        service.selected = !isSelectCategory;
                    }
                    break;
                }
            }
        } else {
            for (let category of tempContent) {
                if (category?.categoryId === categorySelect?.categoryId) {
                    category.selected = !isSelectCategory;
                    break;
                }
            }
        }

        await this.setState({
            content: tempContent
        })

    }

    getIsSelectCategory = (staffServices) => {
        let selected = false;
        for (let service of staffServices) {
            if (service?.selected) {
                selected = true;
                break;
            }
        }

        return selected;
    }

    renderHeader = (section, _, isActive) => {
        const services = section?.staffServices || [];
        const selected = services.length > 0 ? this.getIsSelectCategory(services) : section?.selected;

        return (
            <View>
                <View style={{ height: scaleSzie(6), backgroundColor: "#FAFAFA" }} />

                <View style={{
                    height: scaleSzie(50), flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
                    paddingHorizontal: scaleSzie(20)
                }} >
                    <Button onPress={this.selectCategory(section)}  >
                        <Image source={selected ? ICON.checkBox : ICON.checkBoxEmpty} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
                    </Button>
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(14), fontWeight: "600", marginLeft: scaleSzie(8) }} >
                        {`${section?.name} (${section?.staffServices?.length || 0})`}
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Image
                            source={isActive ? ICON.Arrow_up : ICON.Arrow_down}
                            style={{ width: scaleSzie(18), height: scaleSzie(18) }}
                        />
                    </View>
                </View>
            </View>

        );
    };

    renderContent = (section, _, isActive) => {
        return (
            <View>
                {
                    section?.staffServices.map((service, key) =>
                        <>
                            <View style={{ height: scaleSzie(3), backgroundColor: "#FAFAFA" }} />
                            <View key={`${service?.serviceId}_${key}`} style={{
                                height: scaleSzie(50), flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
                                paddingHorizontal: scaleSzie(40)
                            }} >
                                <Button onPress={this.selectService(service)} >
                                    <Image source={service?.selected ? ICON.checkBox : ICON.checkBoxEmpty} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
                                </Button>
                                <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(14), marginLeft: scaleSzie(8) }} >
                                    {service?.name}
                                </Text>

                            </View>
                        </>
                    )
                }
            </View>
        );
    }

    render() {
        const { content, activeSections } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.txt_title}>
                    {`Assign services this staff can perform`}
                </Text>
                {/* <View style={styles.select_all}>
                    <Button
                        // onPress={this.selectAllItem}
                        style={{ width: scaleSzie(30), justifyContent: "center" }}
                    >
                        <Image
                            source={temptIconCheck}
                            style={{ width: scaleSzie(15), height: scaleSzie(15) }}
                        />
                    </Button>

                    <View
                        style={{
                            width: scaleSzie(120),
                            justifyContent: "center",
                        }}
                    >
                        <Text style={styles.text}>{`Select All`}</Text>
                    </View>
                </View> */}
                <Accordion
                    activeSections={activeSections}
                    sections={content}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={true}
                    renderHeader={this.renderHeader}
                    renderContent={this.renderContent}
                    duration={400}
                    onChange={this.setSections}
                />
            </View>
        );
    }

    componentDidUpdate(prevProps,prevState){
        const {isGetStaffDetailSuccess,staffDetail} = this.props;
        if(isGetStaffDetailSuccess && prevProps.isGetStaffDetailSuccess !== isGetStaffDetailSuccess){
            const tempcategories = staffDetail?.categories || [];
            this.setState({
                content : [...tempcategories]
            });
            this.props.actions.staff.resetStateGetStaffDetail();
            console.log("------ ahihi ------");
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txt_title: {
        color: "#404040",
        fontSize: scaleSzie(14),
    }

});

const mapStateToProps = (state) => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    categoriesByMerchant: state.category.categoriesByMerchant,
    servicesByMerchant: state.service.servicesByMerchant,
    staffDetail: state.staff.staffDetail,
    isGetStaffDetailSuccess: state.staff.isGetStaffDetailSuccess
});

export default connectRedux(mapStateToProps, ServicesAssign);
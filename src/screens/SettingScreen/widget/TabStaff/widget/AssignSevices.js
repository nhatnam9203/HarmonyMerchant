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

class AssignSevices extends Component {
    state = {
        activeSections: [],
        content: [],
        isSelectAll: true
    };

    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };

    getServiceAssignData = async () => {
        const { categoriesByMerchant, servicesByMerchant } = this.props;
        const serviceCategories = [];
        for (let category of categoriesByMerchant) {
            if (category?.categoryType === "Service") {
                serviceCategories.push({
                    selected: true,
                    categoryId: category?.categoryId,
                    name: category?.name,
                    staffServices: []
                })
            }
        }

        for (let service of servicesByMerchant) {
            for (let category of serviceCategories) {
                if (service?.categoryId === category?.categoryId) {
                    category?.staffServices.push({
                        selected: true,
                        serviceId: service?.serviceId,
                        name: service?.name,
                        categoryId: category?.categoryId,
                    });
                    break;
                }
            }
        }
        await this.setState({
            content: serviceCategories
        })

    }

    getStateFromParent = () => {
        const tempcategories = [...this.state.content];
        for (let category of tempcategories) {
            const staffServices = category?.staffServices || [];
            const isSelectCategory = staffServices.length > 0 ? this.getIsSelectCategory(staffServices) : category?.selected;
            category.selected = isSelectCategory;
        }

        return tempcategories;
    }

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
        }, () => this.checkIsSelectAll());
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
        }, () => this.checkIsSelectAll())

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

    selectAllServices = () => {
        const { isSelectAll, content } = this.state;
        const tempContent = [...content];
        for (let category of tempContent) {
            category.selected = !isSelectAll;
            let staffServices = category?.staffServices || [];
            for (let service of staffServices) {
                service.selected = !isSelectAll;
            }
        }

        this.setState((prevState) => ({
            content: tempContent,
            isSelectAll: !prevState.isSelectAll
        }), () => this.checkIsSelectAll())
    }

    checkIsSelectAll = async () => {
        const { content } = this.state;
        let isSelectAll = true;
        for (let category of content) {
            if (!category?.selected) {
                isSelectAll = false;
            } else {
                const services = category?.staffServices || [];
                for (let service of services) {
                    if (!service?.selected) {
                        isSelectAll = false;
                        break;
                    }
                }
            }

            if (!isSelectAll) {
                break;
            }
        }

        await this.setState({
            isSelectAll
        })
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
        const { content, activeSections, isSelectAll } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.txt_title}>
                    {`Assign services this staff can perform`}
                </Text>
                <View style={styles.select_all}>
                    <Button
                        onPress={this.selectAllServices}
                        style={{ width: scaleSzie(30), justifyContent: "center" }}
                    >
                        <Image
                            source={isSelectAll ? ICON.checkBox : ICON.checkBoxEmpty}
                            style={{ width: scaleSzie(15), height: scaleSzie(15) }}
                        />
                    </Button>

                    <View
                        style={{
                            width: scaleSzie(120),
                            justifyContent: "center",
                        }}
                    >
                        <Text style={[styles.txt_title, { fontWeight: "600" }]}>{`Select All`}</Text>
                    </View>
                </View>
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

    componentDidUpdate(prevProps, prevState) {
        const { isGetStaffDetailSuccess, staffDetail } = this.props;
        if (isGetStaffDetailSuccess && prevProps.isGetStaffDetailSuccess !== isGetStaffDetailSuccess) {
            const tempcategories = staffDetail?.categories || [];
            this.setState({
                content: [...tempcategories],
            }, () => this.checkIsSelectAll());
            this.props.actions.staff.resetStateGetStaffDetail();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scaleSzie(25),
        marginTop: scaleSzie(15)
    },
    txt_title: {
        color: "#404040",
        fontSize: scaleSzie(14),
    },
    select_all: {
        flexDirection: "row",
        marginTop: scaleSzie(14),
        marginBottom: scaleSzie(15),
    },

});

const mapStateToProps = (state) => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    categoriesByMerchant: state.category.categoriesByMerchant,
    servicesByMerchant: state.service.servicesByMerchant,
    staffDetail: state.staff.staffDetail,
    isGetStaffDetailSuccess: state.staff.isGetStaffDetailSuccess,
});

export default connectRedux(mapStateToProps, AssignSevices);
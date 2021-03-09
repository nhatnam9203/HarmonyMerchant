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

const CONTENT = [
    {
        "isSelect": false,
        "categoryId": 306,
        "name": "Test ne",
        "services": []
    },
    {
        "isSelect": false,
        "categoryId": 305,
        "name": "Hihihuhuhu",
        "services": []
    },
    {
        "isSelect": false,
        "categoryId": 304,
        "name": "Test",
        "services": []
    },
    {
        "isSelect": false,
        "categoryId": 303,
        "name": "Gel",
        "services": [
            {
                "isSelect": false,
                "serviceId": 888,
                "name": "Test ne hihi revere refer we’re really wr were raw ",
                "categoryId": 303
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 274,
        "name": "tt",
        "services": [
            {
                "isSelect": false,
                "serviceId": 875,
                "name": "tui test ne moi nguoi",
                "categoryId": 274
            },
            {
                "isSelect": false,
                "serviceId": 877,
                "name": "Hoịh ihihihihihihinininininininininihihihihihihihihihihininininininininininiinij",
                "categoryId": 274
            },
            {
                "isSelect": false,
                "serviceId": 876,
                "name": "tui test lai ne",
                "categoryId": 274
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 257,
        "name": "hiyii",
        "services": []
    },
    {
        "isSelect": false,
        "categoryId": 251,
        "name": "ttv",
        "services": [
            {
                "isSelect": false,
                "serviceId": 852,
                "name": "hihi",
                "categoryId": 251
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 199,
        "name": "Manicure children",
        "services": [
            {
                "isSelect": false,
                "serviceId": 610,
                "name": "Nails for children",
                "categoryId": 199
            },
            {
                "isSelect": false,
                "serviceId": 611,
                "name": "manicure childrens ",
                "categoryId": 199
            },
            {
                "isSelect": false,
                "serviceId": 836,
                "name": "rr",
                "categoryId": 199
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 198,
        "name": "Service 1a",
        "services": [
            {
                "isSelect": false,
                "serviceId": 609,
                "name": "service 1",
                "categoryId": 198
            },
            {
                "isSelect": false,
                "serviceId": 612,
                "name": "service ",
                "categoryId": 198
            },
            {
                "isSelect": false,
                "serviceId": 827,
                "name": "gellll",
                "categoryId": 198
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 197,
        "name": "Nails Polish",
        "services": [
            {
                "isSelect": false,
                "serviceId": 607,
                "name": "Nails Polish",
                "categoryId": 197
            },
            {
                "isSelect": false,
                "serviceId": 608,
                "name": "nails painting",
                "categoryId": 197
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 161,
        "name": "Service promotion",
        "services": [
            {
                "isSelect": false,
                "serviceId": 862,
                "name": "Test test test",
                "categoryId": 161
            },
            {
                "isSelect": false,
                "serviceId": 438,
                "name": "Service promotion ",
                "categoryId": 161
            },
            {
                "isSelect": false,
                "serviceId": 889,
                "name": "Naihh",
                "categoryId": 161
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 123,
        "name": "Nails",
        "services": [
            {
                "isSelect": false,
                "serviceId": 603,
                "name": "Gel",
                "categoryId": 123
            },
            {
                "isSelect": false,
                "serviceId": 295,
                "name": "Acrylic Toen",
                "categoryId": 123
            },
            {
                "isSelect": false,
                "serviceId": 339,
                "name": "Spa pedicure",
                "categoryId": 123
            },
            {
                "isSelect": false,
                "serviceId": 338,
                "name": "Backfill",
                "categoryId": 123
            },
            {
                "isSelect": false,
                "serviceId": 891,
                "name": "Test ",
                "categoryId": 123
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 125,
        "name": "Hair Extensions",
        "services": [
            {
                "isSelect": false,
                "serviceId": 439,
                "name": "Cut hair childrens",
                "categoryId": 125
            },
            {
                "isSelect": false,
                "serviceId": 296,
                "name": "Full Face",
                "categoryId": 125
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 124,
        "name": "Waxing",
        "services": [
            {
                "isSelect": false,
                "serviceId": 340,
                "name": "Gel waxing",
                "categoryId": 124
            },
            {
                "isSelect": false,
                "serviceId": 297,
                "name": "Lip, Eyebrows, Chin,Nose",
                "categoryId": 124
            }
        ]
    },
    {
        "isSelect": false,
        "categoryId": 339,
        "name": "Van test",
        "services": []
    },
    {
        "isSelect": false,
        "categoryId": 351,
        "name": "Category 1",
        "services": [
            {
                "isSelect": false,
                "serviceId": 896,
                "name": "Services 1",
                "categoryId": 351
            }
        ]
    }
]


class ServicesAssign extends Component {
    state = {
        activeSections: [],
        collapsed: true,
        multipleSelect: false,
        content: CONTENT
    };

    toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
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
                const tempSevices = category?.services || [];
                for (let service of tempSevices) {
                    if (service?.serviceId === selectService?.serviceId) {
                        service.isSelect = !selectService?.isSelect;
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

    renderHeader = (section, _, isActive) => {
        return (
            <View>
                <View style={{ height: scaleSzie(6), backgroundColor: "#FAFAFA" }} />

                <View style={{
                    height: scaleSzie(50), flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
                    paddingHorizontal: scaleSzie(20)
                }} >

                    <Image source={section?.isSelect ? ICON.checkBox : ICON.checkBoxEmpty} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(14), fontWeight: "600", marginLeft: scaleSzie(8) }} >
                        {`${section?.name} (${section?.services?.length || 0})`}
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
                    section?.services.map((service, key) =>
                        <>
                            <View style={{ height: scaleSzie(3), backgroundColor: "#FAFAFA" }} />
                            <View key={`${service?.serviceId}_${key}`} style={{
                                height: scaleSzie(50), flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
                                paddingHorizontal: scaleSzie(40)
                            }} >
                                <Button onPress={this.selectService(service)} >
                                    <Image source={service?.isSelect ? ICON.checkBox : ICON.checkBoxEmpty} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    active: {
        backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
    },
    multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
    },
    multipleToggle__title: {
        fontSize: 16,
        marginRight: 8,
    }

});

const mapStateToProps = (state) => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    categoriesByMerchant: state.category.categoriesByMerchant,
    servicesByMerchant: state.service.servicesByMerchant,
    categories: state.staff.staffDetail,
});

export default connectRedux(mapStateToProps, ServicesAssign);
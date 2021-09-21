import { Button, ButtonCustom, Text } from "@components";
import connectRedux from "@redux/ConnectRedux";
import { localize, scaleSize } from "@utils";
import React from "react";
import {
  Image,
  NativeModules,
  View,
  TextInput,
  ScrollView,
} from "react-native";
// import BluetoothScanner from "@lib/BluetoothScanner";
// import { ScrollView } from 'react-native-gesture-handler';
import moment from "moment";
import {
  createFilePath,
  getInfoPathFile,
  handleTheDownloadedFile,
  handleShareFile,
} from "@shared/utils/files";
import * as RNFS from "react-native-fs";

class AddDeviceHardware extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peripherals: [],
      textPaxLog: null,
    };
    this.bluetoothScannerRef = React.createRef();
  }

  componentDidMount() {}

  addDevice = () => {
    this.props.gotoSetupDevice();
  };

  showLogPax = async () => {
    const date = moment(date).format("yyyy-MM-DD") + "";

    await NativeModules.logPax.readLogPax({ dateStr: date }, (textLog) => {
      this.setState({ textPaxLog: textLog });
    });
  };

  saveLogPax = async () => {
    const { textPaxLog } = this.state;
    var path = RNFS.DocumentDirectoryPath + "/logPax.txt";
    console.log(path);

    RNFS.writeFile(path, textPaxLog, "utf8")
      .then((success) => {
        setTimeout(() => {
          handleShareFile("Log File", path);
        }, 250);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  scanAndConnect() {}

  backHomeHardware = () => {
    this.props.backHomeHardware();
  };

  handleStopScan = (list) => {
    this.props.actions.app.stopLoadingApp();
    this.setState({
      peripherals: list,
    });
  };

  handleSelectPeripheral = (peripheral) => {
    this.props.actions.dataLocal.saveBluetoothPaxInfo(peripheral);
  };

  // -------- Render ------

  renderNoConnected() {
    const { language } = this.props;

    return (
      <View style={{ marginBottom: scaleSize(10) }}>
        <Text
          style={{
            fontSize: scaleSize(12),
            color: "rgb(131,131,131)",
            marginTop: scaleSize(10),
            marginBottom: scaleSize(7),
          }}
        >
          {localize("No connected device", language)}
        </Text>

        <Button
          onPress={this.addDevice}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: scaleSize(120),
          }}
        >
          <View
            style={{
              width: scaleSize(20),
              height: scaleSize(20),
              borderRadius: scaleSize(4),
              borderColor: "#0764B0",
              borderWidth: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: scaleSize(14),
                color: "#0764B0",
                fontWeight: "bold",
              }}
            >
              +
            </Text>
          </View>

          <Text
            style={{
              fontSize: scaleSize(12),
              color: "#0764B0",
              marginLeft: scaleSize(8),
            }}
          >
            {localize("Add device", language)}
          </Text>
        </Button>
      </View>
    );
  }

  renderConnected() {
    const { paxMachineInfo } = this.props;
    const { textPaxLog } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Button
          onPress={this.addDevice}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: scaleSize(120),
            marginTop: scaleSize(12),
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(14),
              fontWeight: "bold",
              color: "#0764B0",
              marginLeft: scaleSize(8),
              textDecorationLine: "underline",
            }}
          >
            {paxMachineInfo.name}
          </Text>
        </Button>

        <View style={{ flexDirection: "row" }}>
          <Button
            onPress={this.showLogPax}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: scaleSize(65),
              height: scaleSize(20),
              marginTop: scaleSize(20),
              borderRadius: scaleSize(3),
              backgroundColor: "#0764B0",
            }}
          >
            <Text
              style={{
                fontSize: scaleSize(10),
                color: "white",
                //   textDecorationLine: "underline",
              }}
            >
              {"Get LogPax"}
            </Text>
          </Button>

          {textPaxLog && (
            <Button
              onPress={this.saveLogPax}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: scaleSize(65),
                height: scaleSize(20),
                marginTop: scaleSize(20),
                borderRadius: scaleSize(3),
                backgroundColor: "#fff",
                marginLeft: scaleSize(5),
              }}
            >
              <Text
                style={{
                  fontSize: scaleSize(10),
                  color: "gray",
                  //   textDecorationLine: "underline",
                }}
              >
                {"Save LogPax"}
              </Text>
            </Button>
          )}
        </View>

        {textPaxLog && (
          <View
            style={{
              flex: 1,
              fontSize: scaleSize(16),
              backgroundColor: "#eaeaef",
              marginTop: scaleSize(5),
              marginBottom: scaleSize(100),
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 3,
              padding: scaleSize(4),
            }}
          >
            <ScrollView>
              <Text
                style={{
                  flex: 1,
                  fontSize: scaleSize(12),
                  textAlignVertical: "bottom",
                }}
              >
                {textPaxLog}
              </Text>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  render() {
    const { paxMachineInfo, language } = this.props;
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleSize(14),
          paddingTop: scaleSize(20),
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(16),
            fontWeight: "600",
            color: "#0764B0",
          }}
        >
          {localize("Payment Terminal", language)}
        </Text>

        <Text
          style={{
            fontSize: scaleSize(16),
            fontWeight: "600",
            color: "rgb(81,81,81)",
            marginTop: scaleSize(26),
          }}
        >
          {localize("Connected Device", language)}
        </Text>
        {!paxMachineInfo.isSetup
          ? this.renderNoConnected()
          : this.renderConnected()}

        {/* ------- Footer -------- */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            justifyContent: "flex-end",
            paddingBottom: scaleSize(30),
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <ButtonCustom
              width={scaleSize(130)}
              height={50}
              backgroundColor="#F1F1F1"
              title={localize("BACK", language)}
              textColor="#6A6A6A"
              onPress={this.backHomeHardware}
              style={{
                borderWidth: 2,
                borderColor: "rgb(227,227,227)",
                borderRadius: 2,
              }}
              styleText={{ fontSize: scaleSize(20), fontWeight: "500" }}
            />
          </View>
        </View>

        {/* <BluetoothScanner
                    ref={this.bluetoothScannerRef}
                    handleStopScan={this.handleStopScan}
                /> */}
      </View>
    );
  }

  componentWillUnmount() {
    // subscription.remove();
  }
}

const ItemBluetoothConnect = ({ title, isSelect, onPress }) => {
  const tempIconSelect = isSelect ? ICON.radioExportSe : ICON.radioExport;

  return (
    <Button
      onPress={() => onPress(title)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: scaleSize(10),
      }}
    >
      <Image source={tempIconSelect} />
      <Text
        style={{
          fontSize: scaleSize(14),
          color: "rgb(131,131,131)",
          marginLeft: scaleSize(10),
        }}
      >
        {title}
      </Text>
    </Button>
  );
};

const ItemBluetooth = ({ peripheral, isConnected, onPress }) => {
  return (
    <Button
      onPress={() => onPress(peripheral)}
      style={{
        height: scaleSize(45),
        backgroundColor: "rgb(250,250,250)",
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: scaleSize(15),
        paddingRight: scaleSize(40),
        justifyContent: "space-between",
        marginBottom: scaleSize(13),
      }}
    >
      <View>
        <Text
          style={{
            fontSize: scaleSize(14),
            fontWeight: "600",
          }}
        >
          {peripheral?.name || "No Name"}
        </Text>
        <Text
          style={{
            fontSize: scaleSize(8),
            fontWeight: "300",
          }}
        >
          {peripheral?.id || ""}
        </Text>
      </View>

      <Text
        style={{
          fontSize: scaleSize(12),
          fontWeight: "600",
          color: "#0764B0",
        }}
      >
        {`${isConnected ? "Connected" : ""}`}
      </Text>
    </Button>
  );
};

const mapStateToProps = (state) => ({
  paxMachineInfo: state.hardware.paxMachineInfo,
  language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, AddDeviceHardware);

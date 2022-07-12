import actions from "@actions";
import { Button } from "@components";
import ICON from "@resources";
import { metrics } from "@shared/themes";
import {
  formatWithMoment,
  getColorTitleByNotiType,
  getIconByNotiType,
  getNotiContentByType,
  scaleSize,
} from "@utils";
import React from "react";
import { Image, Modal, Text, View, VirtualizedList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const PopupNotifications = React.forwardRef(
  ({ handlePushNotifyDataToWebView }, ref) => {
    const dispatch = useDispatch();
    const { notiCurrentPage, notiTotalPages, notificationList } =
      useSelector((state) => state.app) || {};

    const [visible, setVisible] = React.useState(false);
    const [endReachedCalledDuringMomentum, setEndReachedCalledDuringMomentum] =
      React.useState(false);

    const _forceClosePopup = () => {
      setVisible(false);
    };

    const _readAllNotifications = () => {
      dispatch(actions.app.readAllNotification());
    };

    const _getItemCount = (data) => {
      return data?.length ?? 0;
    };

    const _getItem = (data, index) => {
      return {
        ...data[index],
        id: `${data[index]?.merchantNotificationId}_${Math.random()
          .toString(12)
          .substring(0)}`,
      };
    };

    const _loadMoreNotificationList = () => {
      if (!endReachedCalledDuringMomentum) {
        if (notiCurrentPage < notiTotalPages) {
          dispatch(actions.app.getNotificationList(notiCurrentPage + 1));
          setEndReachedCalledDuringMomentum(true);
        }
      }
    };

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
      },
    }));

    const _renderItem = (noti) => {
      const icon = noti?.view
        ? `${getIconByNotiType(noti?.type || "")}_is_read`
        : getIconByNotiType(noti?.type || "");

      const content = getNotiContentByType(noti);
      const _handlePushNotiDataToWebView = () => {
        if (
          handlePushNotifyDataToWebView &&
          typeof handlePushNotifyDataToWebView === "function"
        ) {
          handlePushNotifyDataToWebView(noti);
        }
        _forceClosePopup();
      };

      return (
        <Button
          onPress={_handlePushNotiDataToWebView}
          style={{ minHeight: scaleSize(110) }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingTop: scaleSize(10),
              paddingBottom: scaleSize(6),
            }}
          >
            {/* ------------ Icon ------------ */}
            <View style={{ width: scaleSize(50) }}>
              <Image
                source={ICON[icon]}
                style={{ width: scaleSize(30), height: scaleSize(30) }}
              />
            </View>
            {/* ------------ Information ------------ */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: getColorTitleByNotiType(noti?.view, noti?.type),
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                  marginBottom: scaleSize(6),
                }}
              >
                {noti?.title || ""}
              </Text>
              {content}

              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text
                  style={{
                    color: "#585858",
                    fontSize: scaleSize(12),
                    marginTop: scaleSize(10),
                  }}
                >
                  {formatWithMoment(noti?.createdDate, "MM/DD/YYYY   hh:mm A")}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 2, backgroundColor: "#EEEEEE" }} />
        </Button>
      );
    };

    return (
      <Modal transparent={true} visible={visible} animationType={"fade"}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            paddingTop: scaleSize(48),
          }}
        >
          <View
            style={{
              height: metrics.screenHeight - scaleSize(48),
              width: scaleSize(300),
              backgroundColor: "#fff",
              paddingHorizontal: scaleSize(10),
            }}
          >
            {/* -------------- Header ----------- */}
            <View style={{ height: scaleSize(50) }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(14),
                  fontWeight: "600",
                  marginTop: scaleSize(10),
                }}
              >
                {`Notifications`}
              </Text>

              <Button
                onPress={_forceClosePopup}
                style={{
                  height: scaleSize(30),
                  width: scaleSize(30),
                  justifyContent: "center",
                  alignItems: "flex-end",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <Image source={ICON.close_noti_popup} />
              </Button>

              <Button
                onPress={_readAllNotifications}
                style={{
                  position: "absolute",
                  top: 0,
                  right: scaleSize(16),
                  height: scaleSize(30),
                  width: scaleSize(30),
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: scaleSize(22), height: scaleSize(22) }}
                  source={ICON.read_all_noti}
                />
              </Button>
            </View>

            {/* ------------ Notification List ---------- */}
            <View style={{ flex: 1 }}>
              <VirtualizedList
                data={notificationList}
                initialNumToRender={10}
                renderItem={_renderItem}
                keyExtractor={(item, index) =>
                  `${item?.merchantNotificationId}_${index}`
                }
                getItemCount={_getItemCount}
                getItem={_getItem}
                showsVerticalScrollIndicator={false}
                onEndReached={_loadMoreNotificationList}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  setEndReachedCalledDuringMomentum(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

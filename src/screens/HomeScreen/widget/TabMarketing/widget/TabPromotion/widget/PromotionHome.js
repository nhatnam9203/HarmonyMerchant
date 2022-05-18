import * as appActions from "@actions/app";
import { Button, Text } from "@components";
import { formatWithMoment, scaleSize } from "@utils";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  View,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { setSchedulePromotion, useAxiosMutation } from "@apis";

const { width } = Dimensions.get("window");
const DeleteConfirmButton = WithDialogConfirm(Button);

const PromotionHome = ({
  promotions,
  createNewCampaign,
  editCampaign,
  disableCampaign,
  enableCampaign,
  deleteCampaign,
  viewRule,
  disableRule,
  sendStartCampaign,
}) => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state?.dataLocal?.profile);

  const [giftForNewEnabled, setGiftForNewEnabled] = useState(true);
  const [focusPromotionId, setFocusPromotionId] = useState(null);
  /**
   * API Check permission
   */
  const [, disableAutoSendMessage] = useAxiosMutation({
    ...setSchedulePromotion(focusPromotionId, false),
    onSuccess: (data, response) => {
      // console.log(data);
      if (response?.codeNumber === 200) {
      }
    },
  });

  useEffect(() => {
    setGiftForNewEnabled(profile?.giftForNewEnabled);
  }, [profile]);

  handleChangeGiftForCustomer = (value) => {
    setGiftForNewEnabled(value);
    dispatch(appActions.changeIsGiftForNew(value));
  };

  onSendStartCampaign = (item) => {
    if (sendStartCampaign && typeof sendStartCampaign === "function") {
      sendStartCampaign(item?.id);
    }
  };

  onHandleDisablePromotion = async (item) => {
    await setFocusPromotionId(item.id);
    await disableAutoSendMessage();
    if (disableCampaign && typeof disableCampaign === "function") {
      disableCampaign(item);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ------------------- Campaigns ------------------- */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: scaleSize(14),
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(16),
            fontWeight: "600",
          }}
        >
          {`Campaigns`}
        </Text>
        <Button
          onPress={createNewCampaign}
          style={{
            height: scaleSize(30),
            width: scaleSize(130),
            backgroundColor: "#0764B0",
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: scaleSize(13),
              fontWeight: "600",
            }}
          >
            {`New Campaign`}
          </Text>
        </Button>
      </View>
      <CampaignTableHeader />

      <FlatList
        data={promotions}
        renderItem={({ item, index }) => (
          <CampaignRow
            data={item}
            editCampaign={() => {
              editCampaign(item);
            }}
            disableCampaign={async () => {
              await onHandleDisablePromotion(item);
            }}
            enableCampaign={() => {
              enableCampaign(item);
            }}
            deleteCampaign={() => {
              deleteCampaign(item);
            }}
            sendStartCampaign={onSendStartCampaign}
          />
        )}
        ListFooterComponent={() => (
          <>
            {/* ------------  Gift For New Customer ------------ */}

            <View style={{ flexDirection: "row", marginTop: scaleSize(25) }}>
              <Text
                style={{
                  color: "#404040",
                  marginLeft: scaleSize(14),
                  fontSize: scaleSize(14),
                  marginRight: scaleSize(25),
                }}
              >
                {`Gift For New Customer`}
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#0764B0" }}
                ios_backgroundColor="#E5E5E5"
                onValueChange={handleChangeGiftForCustomer}
                value={giftForNewEnabled}
              />
            </View>

            <View style={{ height: scaleSize(50) }} />
          </>
        )}
      />
    </View>
  );
};

const CampaignTableHeader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: scaleSize(14),
        marginTop: scaleSize(30),
        marginBottom: scaleSize(12),
      }}
    >
      {/* ------------------- Name ------------------- */}
      <View style={[{ flex: 1 }, styles.center_txt]}>
        <Text style={styles.txt_header}>{`Name`}</Text>
      </View>
      {/* ------------------- Status ------------------- */}
      <View style={[{ width: scaleSize(90) }, styles.center_txt]}>
        <Text style={styles.txt_header}>{`Status`}</Text>
      </View>
      {/* ------------------- Start date ------------------- */}
      <View style={[{ width: scaleSize(100) }, styles.center_txt]}>
        <Text style={styles.txt_header}>{`Start date`}</Text>
      </View>
      {/* ------------------- End date ------------------- */}
      <View style={[{ width: scaleSize(100) }, styles.center_txt]}>
        <Text style={styles.txt_header}>{`End date`}</Text>
      </View>
      {/* ------------------- Actions ------------------- */}
      <View
        style={[
          { width: scaleSize(150), alignItems: "center" },
          styles.center_txt,
        ]}
      >
        <Text style={styles.txt_header}>{`Actions`}</Text>
      </View>
    </View>
  );
};

const RuleTableHeader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: scaleSize(14),
        marginVertical: scaleSize(12),
      }}
    >
      {/* ------------------- Name ------------------- */}
      <View style={[{ flex: 1 }, styles.center_txt]}>
        <Text style={styles.txt_header}>{`Name`}</Text>
      </View>
      {/* ------------------- Status ------------------- */}
      <View style={[{ width: scaleSize(90) }, styles.center_txt]}>
        <Text style={styles.txt_header}>{`Status`}</Text>
      </View>
      <View style={[{ width: scaleSize(100) }, styles.center_txt]} />
      <View style={[{ width: scaleSize(100) }, styles.center_txt]} />

      {/* ------------------- Actions ------------------- */}
      <View
        style={[
          { width: scaleSize(150), alignItems: "center" },
          styles.center_txt,
        ]}
      >
        <Text style={styles.txt_header}>{`Actions`}</Text>
      </View>
    </View>
  );
};

const RuleRow = ({ viewRule, disableRule }) => {
  return (
    <View
      style={{
        minHeight: scaleSize(45),
        backgroundColor: "#fff",
        flexDirection: "row",
        paddingHorizontal: scaleSize(14),
        borderTopWidth: 1,
        borderTopColor: "#F1F1F1",
      }}
    >
      {/* ------------------- Name ------------------- */}
      <View style={[{ flex: 1 }, styles.center_txt]}>
        <Text style={styles.txt_name_row}>{`Happy valentine`}</Text>
      </View>
      {/* ------------------- Status ------------------- */}
      <View style={[{ width: scaleSize(90) }, styles.center_txt]}>
        <Text style={styles.txt_row}>{`Active`}</Text>
      </View>
      <View style={[{ width: scaleSize(100) }, styles.center_txt]} />

      <View style={[{ width: scaleSize(100) }, styles.center_txt]} />
      {/* ------------------- Actions ------------------- */}
      <View
        style={[
          { width: scaleSize(150), flexDirection: "row" },
          styles.center_txt,
        ]}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Button onPress={viewRule} style={styles.btn_row}>
            <Text
              style={[
                styles.txt_row,
                { color: "#fff", fontSize: scaleSize(12), fontWeight: "600" },
              ]}
            >
              {`View`}
            </Text>
          </Button>
        </View>
        <View style={{ width: scaleSize(10) }} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Button
            onPress={disableRule}
            style={[styles.btn_row, { backgroundColor: "#FF3B30" }]}
          >
            <Text
              style={[
                styles.txt_row,
                { color: "#fff", fontSize: scaleSize(12), fontWeight: "600" },
              ]}
            >
              {`Disable`}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const CampaignRow = ({
  data,
  editCampaign,
  disableCampaign,
  enableCampaign,
  deleteCampaign,
  sendStartCampaign,
}) => {
  const onHandleSendStartCampaign = () => {
    if (sendStartCampaign && typeof sendStartCampaign === "function") {
      sendStartCampaign(data);
    }
  };
  return (
    <TouchableOpacity
      style={{
        minHeight: scaleSize(45),
        backgroundColor: "#fff",
        flexDirection: "row",
        paddingHorizontal: scaleSize(14),
        borderTopWidth: 1,
        borderTopColor: "#F1F1F1",
      }}
      onPress={editCampaign}
    >
      {/* ------------------- Name ------------------- */}
      <View style={[{ flex: 1 }, styles.center_txt]}>
        <Text style={styles.txt_name_row}>{data?.name || ""}</Text>
      </View>
      {/* ------------------- Status ------------------- */}
      <View style={[{ width: scaleSize(90) }, styles.center_txt]}>
        <Text style={styles.txt_row}>
          {data?.isDisabled ? "Disable" : "Active"}
        </Text>
      </View>
      {/* ------------------- Start date ------------------- */}
      <View style={[{ width: scaleSize(100) }, styles.center_txt]}>
        <Text style={styles.txt_row}>
          {formatWithMoment(data?.fromDate, "MM/DD/YYYY")}
        </Text>
      </View>
      {/* ------------------- End date ------------------- */}
      <View style={[{ width: scaleSize(100) }, styles.center_txt]}>
        <Text style={styles.txt_row}>
          {formatWithMoment(data?.toDate, "MM/DD/YYYY")}
        </Text>
      </View>
      {/* ------------------- Actions ------------------- */}
      <View
        style={[
          { width: scaleSize(220), flexDirection: "row" },
          styles.center_txt,
        ]}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          {!data?.isDisabled && (
            <DeleteConfirmButton
              description={
                "Are you sure you want to send message for this Campaign ?"
              }
              onPress={onHandleSendStartCampaign}
              style={[styles.btn_row, { backgroundColor: "#0764B0" }]}
            >
              <Text style={[styles.txt_row, { color: "#fff" }]}>{`Send`}</Text>
            </DeleteConfirmButton>
          )}
        </View>
        <View style={{ width: scaleSize(10) }} />

        <View style={{ flex: 1, justifyContent: "center" }}>
          {data?.isDisabled ? (
            <Button
              onPress={enableCampaign}
              style={[styles.btn_row, { backgroundColor: "#0764B0" }]}
            >
              <Text
                style={[
                  styles.txt_row,
                  {
                    color: "#fff",
                    fontSize: scaleSize(12),
                  },
                ]}
              >
                {`Active`}
              </Text>
            </Button>
          ) : (
            <Button
              onPress={disableCampaign}
              style={[styles.btn_row, { backgroundColor: "#efefef" }]}
            >
              <Text
                style={[
                  styles.txt_row,
                  {
                    color: "#666",
                    fontSize: scaleSize(12),
                  },
                ]}
              >
                {`Disable`}
              </Text>
            </Button>
          )}
        </View>
        <View style={{ width: scaleSize(10) }} />

        <View style={{ flex: 1, justifyContent: "center" }}>
          {data.isDisabled ? (
            <DeleteConfirmButton
              description={"Are you sure you want to Delete this Campaign ?"}
              onPress={deleteCampaign}
              style={[styles.btn_row, { backgroundColor: "#FF3B30" }]}
            >
              <Text
                style={[styles.txt_row, { color: "#fff" }]}
              >{`Delete`}</Text>
            </DeleteConfirmButton>
          ) : (
            <Button
              //   disabled={true}
              onPress={() => {
                alert("You can't delete active Campaign!");
              }}
              style={[styles.btn_row, { backgroundColor: "#FF3B30" }]}
            >
              <Text
                style={[styles.txt_row, { color: "#fff" }]}
              >{`Delete`}</Text>
            </Button>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  center_txt: {
    justifyContent: "center",
  },
  txt_header: {
    color: "#404040",
    fontSize: scaleSize(12),
    fontWeight: "600",
  },
  txt_name_row: {
    color: "#0764B0",
    fontSize: scaleSize(12),
    fontWeight: "600",
  },
  txt_row: {
    color: "#404040",
    fontSize: scaleSize(11),
    fontWeight: "400",
  },
  btn_row: {
    height: scaleSize(30),
    width: "100%",
    backgroundColor: "#0764B0",
    borderRadius: scaleWidth(6),
    borderWidth: scaleHeight(2),
    borderColor: "#fdfdfd",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PromotionHome;

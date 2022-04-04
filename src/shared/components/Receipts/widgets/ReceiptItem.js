import { fonts } from "@shared/themes";
import { formatMoneyWithUnit, formatNumberFromCurrency } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { LineHeader, LineItem } from "./ReceiptLine";

const SALON_COLUMN_WIDTH = [4, 3, 3];
const RETAILER_RETURN_COLUMN_WIDTH = [3, 1, 2, 2, 2];
const RETAILER_COLUMN_WIDTH = [4, 2.5, 1, 2.5];

export const ReceiptItemType = {
  SALON: "SalonPos",
  RETAILER: "RetailerPos",
  RETAILER_RETURN: "RetailerReturn",
};

export const ReceiptItem = ({ item, index, type }) => {
  const { t } = useTranslation();

  const { data = {}, note = "", staff = {}, extras = [] } = item || {};
  const {
    price = 0,
    discount = 0,
    discountPercent = 0,
    qty = 1,
    name = "",
    label = "",
    barCode,
    returnPrice = 0,
    returnQuantity = 1,
  } = data;

  const totalPrice = formatNumberFromCurrency(price) * qty;

  switch (type) {
    case ReceiptItemType.RETAILER:
      const onRenderRetailerColumOne = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TextItem>{`${index + 1}. ${name}`}</TextItem>
          {!!label && <TextLabel>{`${label} `}</TextLabel>}
          {!!barCode && <TextLabel>{`- Barcode: ${barCode} `}</TextLabel>}
          {!!note && <TextLabel>{`${note}.`}</TextLabel>}
        </View>
      );

      const onRenderRetailerColumTwo = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <TextItem>{`${formatMoneyWithUnit(price)}`}</TextItem>
        </View>
      );

      const onRenderRetailerColumThree = () => (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <TextItem>{`${qty}`}</TextItem>
        </View>
      );

      const onRenderRetailerColumFour = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <TextItem>{`${formatMoneyWithUnit(totalPrice)}`}</TextItem>
        </View>
      );

      return (
        <View>
          {index > 0 && <LineItem />}
          <LayoutFourColumn
            key="retailer-item"
            columnWidths={RETAILER_COLUMN_WIDTH}
            ColumnOne={onRenderRetailerColumOne}
            ColumnTwo={onRenderRetailerColumTwo}
            ColumnThree={onRenderRetailerColumThree}
            ColumnFour={onRenderRetailerColumFour}
          />
          {(discount > 0 || discountPercent > 0) && (
            <LayoutFourColumn
              key="retailer-item-discount"
              columnWidths={RETAILER_COLUMN_WIDTH}
              ColumnOne={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  {discount > 0 && (
                    <TextLabel key="discount">{`${t(
                      "Discount"
                    )}: $ ${discount}`}</TextLabel>
                  )}
                  {discountPercent > 0 && (
                    <TextLabel key="discountPercent">{`${t(
                      "Discount"
                    )}: ${discountPercent}%`}</TextLabel>
                  )}
                </View>
              )}
              ColumnTwo={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  {discount > 0 && (
                    <TextItem key="discount">{`- ${formatMoneyWithUnit(
                      discount / qty
                    )}`}</TextItem>
                  )}
                  {discountPercent > 0 && (
                    <TextItem key="discountPercent">{`- ${formatMoneyWithUnit(
                      (discountPercent * price) / 100
                    )}`}</TextItem>
                  )}
                </View>
              )}
              ColumnThree={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                  }}
                />
              )}
              ColumnFour={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  {discount > 0 && (
                    <TextItem key="discount">{`- ${formatMoneyWithUnit(
                      discount
                    )}`}</TextItem>
                  )}
                  {discountPercent > 0 && (
                    <TextItem key="discountPercent">{`- ${formatMoneyWithUnit(
                      ((discountPercent * price) / 100) * qty
                    )}`}</TextItem>
                  )}
                </View>
              )}
            />
          )}
        </View>
      );
    case ReceiptItemType.RETAILER_RETURN:
      const renderName = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TextItem>{`${index + 1}. ${name}`}</TextItem>
        </View>
      );

      const renderQty = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <TextItem>{`${qty}`}</TextItem>
        </View>
      );

      const renderPrice = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <TextItem>{`${price}`}</TextItem>
        </View>
      );

      const renderReturnQty = () => (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextItem>{`${returnQuantity}`}</TextItem>
        </View>
      );

      const renderReturnPrice = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <TextItem>{`${returnPrice}`}</TextItem>
        </View>
      );

      return (
        <View>
          {index > 0 && <LineItem />}
          <LayoutFiveColumn
            key="return-item"
            columnWidths={RETAILER_RETURN_COLUMN_WIDTH}
            ColumnOne={renderName}
            ColumnTwo={renderQty}
            ColumnThree={renderPrice}
            ColumnFour={renderReturnQty}
            ColumnFive={renderReturnPrice}
          />
        </View>
      );
    case ReceiptItemType.SALON:
    default:
      const onRenderColumOne = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TextItem>{`${index + 1}. ${name}`}</TextItem>
          {extras?.length > 0 &&
            extras.map((x) => (
              <TextLabel
                key={`${x.extraId}`}
              >{`   - ${x.extraName}`}</TextLabel>
            ))}
          {!!note && <TextLabel>{`(Note: ${note})`}</TextLabel>}
        </View>
      );

      const onRenderColumTwo = () => (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <TextLabel>{`${staff?.displayName ?? ""}`}</TextLabel>
        </View>
      );

      const onRenderColumThree = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <TextLabel>{`${formatMoneyWithUnit(price)}`}</TextLabel>
          {extras?.length > 0 &&
            extras.map((x) => (
              <TextLabel key={`${x.extraId}`}>{`${formatMoneyWithUnit(
                x.price ?? 0
              )}`}</TextLabel>
            ))}
        </View>
      );

      return (
        <View>
          {index > 0 && <LineItem />}
          <LayoutThreeColumn
            key="salon-item"
            columnWidths={SALON_COLUMN_WIDTH}
            ColumnOne={onRenderColumOne}
            ColumnTwo={onRenderColumTwo}
            ColumnThree={onRenderColumThree}
          />
        </View>
      );
  }
};

export const ReceiptHeaderItem = ({ type }) => {
  const { t } = useTranslation();

  const onRenderColumOne = () => (
    <View
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      <TextHeader>{t("DESCRIPTION")}</TextHeader>
    </View>
  );
  const onRenderColumTwo = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextHeader>{t("PRICE")}</TextHeader>
    </View>
  );
  const onRenderColumThree = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextHeader>{t("QTY")}</TextHeader>
    </View>
  );
  const onRenderColumFour = () => (
    <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
      <TextHeader>{t("TOTAL")}</TextHeader>
    </View>
  );

  const onRenderStaffColumn = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextHeader>{t("STAFF")}</TextHeader>
    </View>
  );

  switch (type) {
    case ReceiptItemType.RETAILER:
      return (
        <>
          <View style={styles.margin} />
          <LineHeader />
          <LayoutFourColumn
            columnWidths={RETAILER_COLUMN_WIDTH}
            ColumnOne={onRenderColumOne}
            ColumnTwo={onRenderColumTwo}
            ColumnThree={onRenderColumThree}
            ColumnFour={onRenderColumFour}
          />
          <LineHeader />
        </>
      );
    case ReceiptItemType.RETAILER_RETURN:
      const nameCol = () => (
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TextHeader>{t("Name")}</TextHeader>
        </View>
      );

      const qtyCol = () => (
        <View
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
        >
          <TextHeader>{t("Qty")}</TextHeader>
        </View>
      );

      const priceCol = () => (
        <View
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
        >
          <TextHeader>{t("Total")}</TextHeader>
        </View>
      );

      const returnQtyCol = () => (
        <View
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
        >
          <TextHeader>{t("Return")}</TextHeader>
        </View>
      );

      const returnTotalCol = () => (
        <View
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
        >
          <TextHeader>{t("Price")}</TextHeader>
        </View>
      );

      return (
        <>
          <View style={styles.margin} />
          <LineHeader />
          <LayoutFiveColumn
            columnWidths={RETAILER_RETURN_COLUMN_WIDTH}
            ColumnOne={nameCol}
            ColumnTwo={qtyCol}
            ColumnThree={priceCol}
            ColumnFour={returnQtyCol}
            ColumnFive={returnTotalCol}
          />
          <LineHeader />
        </>
      );
    case ReceiptItemType.SALON:
    default:
      return (
        <>
          <View style={styles.margin} />
          <LineHeader />
          <LayoutThreeColumn
            columnWidths={SALON_COLUMN_WIDTH}
            ColumnOne={onRenderColumOne}
            ColumnTwo={onRenderStaffColumn}
            ColumnThree={onRenderColumFour}
          />
          <LineHeader />
        </>
      );
  }
};

export const ReceiptTotalItem = ({ type, total }) => {
  const onRenderColumOne = () => (
    <View
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      <TextLabel>{"Total items"}</TextLabel>
    </View>
  );
  const onRenderColumTwo = () => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    />
  );
  const onRenderColumThree = () => (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
    >
      <TextItem>{`${total}`}</TextItem>
    </View>
  );
  const onRenderColumFour = () => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    ></View>
  );

  switch (type) {
    case ReceiptItemType.RETAILER:
      return (
        <>
          <LineItem />
          <LayoutFourColumn
            key="retailer-item"
            columnWidths={RETAILER_COLUMN_WIDTH}
            ColumnOne={onRenderColumOne}
            ColumnTwo={onRenderColumTwo}
            ColumnThree={onRenderColumThree}
            ColumnFour={onRenderColumFour}
          />
        </>
      );
    case ReceiptItemType.RETAILER_RETURN:
    case ReceiptItemType.SALON:
    default:
      return null;
  }
};

const LayoutFourColumn = ({
  columnWidths,
  ColumnOne,
  ColumnTwo,
  ColumnThree,
  ColumnFour,
}) => {
  return (
    <View style={styles.content}>
      {columnWidths.map((x, idx) => {
        switch (idx) {
          case 0:
            return (
              <View key="f-one" style={{ flex: x }}>
                {ColumnOne()}
              </View>
            );
          case 1:
            return (
              <View key="f-two" style={{ flex: x }}>
                {ColumnTwo()}
              </View>
            );
          case 2:
            return (
              <View key="f-three" style={{ flex: x }}>
                {ColumnThree()}
              </View>
            );
          case 3:
          default:
            return (
              <View key="f-four" style={{ flex: x }}>
                {ColumnFour()}
              </View>
            );
        }
      })}
    </View>
  );
};

const LayoutThreeColumn = ({
  columnWidths,
  ColumnOne,
  ColumnTwo,
  ColumnThree,
}) => {
  return (
    <View style={styles.content}>
      {columnWidths.map((x, idx) => {
        switch (idx) {
          case 0:
            return (
              <View key="f-one" style={{ flex: x }}>
                {ColumnOne()}
              </View>
            );
          case 1:
            return (
              <View key="f-two" style={{ flex: x }}>
                {ColumnTwo()}
              </View>
            );
          case 2:
          default:
            return (
              <View key="f-three" style={{ flex: x }}>
                {ColumnThree()}
              </View>
            );
        }
      })}
    </View>
  );
};

const LayoutFiveColumn = ({
  columnWidths,
  ColumnOne,
  ColumnTwo,
  ColumnThree,
  ColumnFour,
  ColumnFive,
}) => {
  return (
    <View style={styles.content}>
      {columnWidths.map((x, idx) => {
        switch (idx) {
          case 0:
            return (
              <View key="f-one" style={{ flex: x }}>
                {ColumnOne()}
              </View>
            );
          case 1:
            return (
              <View key="f-two" style={{ flex: x }}>
                {ColumnTwo()}
              </View>
            );
          case 2:
            return (
              <View key="f-three" style={{ flex: x }}>
                {ColumnThree()}
              </View>
            );
          case 3:
            return (
              <View key="f-four" style={{ flex: x }}>
                {ColumnFour()}
              </View>
            );
          case 4:
          default:
            return (
              <View key="f-five" style={{ flex: x }}>
                {ColumnFive()}
              </View>
            );
        }
      })}
    </View>
  );
};

const TextHeader = ({ children }) => (
  <Text style={styles.textHeaderStyle}>{children}</Text>
);

const TextItem = ({ children }) => (
  <Text style={styles.textStyle}>{children}</Text>
);

const TextLabel = ({ children }) => (
  <Text style={styles.textLabelStyle}>{children}</Text>
);

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
  },

  textStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(20),
    fontWeight: "600",
  },
  textLabelStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(18),
    fontWeight: "500",
    marginLeft: scaleWidth(10),
  },
  textHeaderStyle: {
    // fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(16),
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },

  headerStyle: {
    fontSize: scaleFont(17),
    fontWeight: "500",
    textAlign: "left",
  },

  headerContent: {
    justifyContent: "center",
    alignItems: "center",
    height: scaleHeight(30),
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});

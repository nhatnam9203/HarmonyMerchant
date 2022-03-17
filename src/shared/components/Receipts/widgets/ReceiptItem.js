import {
  formatMoneyWithUnit,
  formatMoney,
  formatNumberFromCurrency,
} from "@utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Dash from "react-native-dash";
import { useTranslation } from "react-i18next";
import { fonts, color, layouts } from "@shared/themes";

const SALON_COLUMN_WIDTH = [5, 2, 3];
const RETAILER_COLUMN_WIDTH = [4, 2, 1.5, 2.5];

export const ReceiptItemType = {
  SALON: "SalonPos",
  RETAILER: "RetailerPos",
  RETAILER_RETURN: "RetailerReturn",
};

export const ReceiptItem = ({ item, index, type }) => {
  const { t } = useTranslation();

  const { data = {}, note = "" } = item || {};
  const {
    price = 0,
    discount = 0,
    discountPercent = 0,
    qty = 1,
    name = "",
    label = "",
  } = data;

  const totalPrice = formatNumberFromCurrency(price) * qty;
  const ColumOne = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      {children}
    </View>
  );
  const ColumTwo = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    >
      {children}
    </View>
  );
  const ColumThree = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    >
      {children}
    </View>
  );
  const ColumFour = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    >
      {children}
    </View>
  );

  switch (type) {
    case ReceiptItemType.RETAILER:
      return (
        <>
          {index > 0 && <LineItem />}
          <LayoutFourColumn
            key="retailer-item"
            columnWidths={RETAILER_COLUMN_WIDTH}
            ColumnOne={() => (
              <ColumOne>
                <TextItem>{`${index + 1}. ${name}`}</TextItem>
                {!!label && <TextLabel>{`${label}`}</TextLabel>}
                {!!note && <TextLabel>{`${note}.`}</TextLabel>}
              </ColumOne>
            )}
            ColumnTwo={() => (
              <ColumTwo>
                <TextItem>{`${formatMoneyWithUnit(price)}`}</TextItem>
              </ColumTwo>
            )}
            ColumnThree={() => (
              <ColumThree>
                <TextItem>{`${qty}`}</TextItem>
              </ColumThree>
            )}
            ColumnFour={() => (
              <ColumFour>
                <TextItem>{`${formatMoneyWithUnit(totalPrice)}`}</TextItem>
              </ColumFour>
            )}
          />
          {(discount > 0 || discountPercent > 0) && (
            <LayoutFourColumn
              key="retailer-item-discount"
              columnWidths={RETAILER_COLUMN_WIDTH}
              ColumnOne={() => (
                <ColumOne>
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
                </ColumOne>
              )}
              ColumnTwo={() => (
                <ColumTwo>
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
                </ColumTwo>
              )}
              ColumnThree={() => <ColumThree></ColumThree>}
              ColumnFour={() => (
                <ColumFour>
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
                </ColumFour>
              )}
            />
          )}
        </>
      );
    case ReceiptItemType.RETAILER_RETURN:
    case ReceiptItemType.SALON:
    default:
      return <View style={styles.content}></View>;
  }
};

export const ReceiptHeaderItem = ({ type }) => {
  const { t } = useTranslation();

  const onRenderColumOne = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextHeader>{t("DESCRIPTION")}</TextHeader>
    </View>
  );
  const onRenderColumTwo = () => (
    <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
      <TextHeader>{t("PRICE")}</TextHeader>
    </View>
  );
  const onRenderColumThree = () => (
    <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
      <TextHeader>{t("QTY")}</TextHeader>
    </View>
  );
  const onRenderColumFour = () => (
    <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
      <TextHeader>{t("TOTAL")}</TextHeader>
    </View>
  );

  switch (type) {
    case ReceiptItemType.RETAILER:
      return (
        <>
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
    case ReceiptItemType.SALON:
    default:
      return <View style={styles.content}></View>;
  }
};

export const ReceiptTotalItem = ({ type, total }) => {
  const ColumOne = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      {children}
    </View>
  );
  const ColumTwo = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    >
      {children}
    </View>
  );
  const ColumThree = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    >
      {children}
    </View>
  );
  const ColumFour = ({ children }) => (
    <View
      style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-start" }}
    >
      {children}
    </View>
  );

  switch (type) {
    case ReceiptItemType.RETAILER:
      return (
        <>
          <LineItem />
          <LayoutFourColumn
            key="retailer-item"
            columnWidths={RETAILER_COLUMN_WIDTH}
            ColumnOne={() => (
              <ColumOne>
                <TextLabel>{"Total items"}</TextLabel>
              </ColumOne>
            )}
            ColumnTwo={() => <ColumTwo></ColumTwo>}
            ColumnThree={() => (
              <ColumThree>
                <TextItem>{`${total}`}</TextItem>
              </ColumThree>
            )}
            ColumnFour={() => <ColumFour></ColumFour>}
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

const TextHeader = ({ children }) => (
  <Text style={styles.textHeaderStyle}>{children}</Text>
);

const TextItem = ({ children }) => (
  <Text style={styles.textStyle}>{children}</Text>
);

const TextLabel = ({ children }) => (
  <Text style={styles.textLabelStyle}>{children}</Text>
);

const LineHeader = () => (
  <Dash
    style={{
      width: "100%",
      height: 1,
      marginVertical: scaleHeight(4),
      marginHorizontal: scaleWidth(4),
    }}
    dashGap={2}
    dashLength={10}
    dashThickness={1}
  />
);

const LineItem = () => (
  <Dash
    style={{
      width: "98%",
      height: 1,
      paddingHorizontal: scaleWidth(5),
    }}
    dashGap={4}
    dashLength={1}
    dashThickness={1}
    dashColor="#0009"
  />
);

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    paddingVertical: scaleHeight(3),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    color: "#000",
    fontSize: scaleFont(14),
    fontWeight: "normal",
  },
  textLabelStyle: {
    fontFamily: fonts.LIGHT,
    color: "#000",
    fontSize: scaleFont(13),
    fontWeight: "normal",
    marginLeft: scaleWidth(10),
  },
  textExtraStyle: { fontSize: scaleFont(14), textAlign: "left" },
  textHeaderStyle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(15),
    textAlign: "center",
    color: "#000",
  },

  headerStyle: {
    fontSize: scaleFont(15),
    fontWeight: "500",
    textAlign: "left",
  },

  headerContent: {
    justifyContent: "center",
    alignItems: "center",
    height: scaleHeight(30),
  },
});

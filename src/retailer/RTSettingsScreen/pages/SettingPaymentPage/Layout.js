import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, layouts, fonts } from '@shared/themes';
import { CustomSwitch, DialogAddNewPaymentMethod } from '@shared/components';
import { getPaymentLogoByName } from '@shared/utils';
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import IMAGE from '@resources';
export const Layout = ({
  payments,
  refDialog,
  openAddNewPayment,
  onValueChange,
  isEnabled,
}) => {
  const { t } = useTranslation();
  const RowHeaderPayment = ({ name }) => (
    <View style={[layouts.horizontal, styles.layoutRowHeader]}>
      <Text style={styles.txtTitle}>{name}</Text>
    </View>
  );
  const RowItemPayment = (item, index) => (
    <View
      key={index + ''}
      style={[layouts.horizontal, styles.layoutRowItem, layouts.fullWidth]}
    >
      <Image
        source={IMAGE[getPaymentLogoByName(item)]}
        width={scaleWidth(32)}
        height={scaleWidth(32)}
        style={styles.icon}
      />
      <Text style={{ ...styles.txtTitle, color: colors.BROWNISH_GREY }}>
        {item}
      </Text>
      <View
        style={[
          layouts.fill,
          layouts.horizontalCenterRight,
          layouts.horizontal,
        ]}
      >
        <CustomSwitch defaultValue={isEnabled}  />
      </View>
    </View>
  );
  const RowEmptyItem = ({ type = '' }) => (
    <View
      style={[
        layouts.horizontal,
        styles.layoutRowItem,
        { borderBottomWidth: 0 },
      ]}
    >
      <Text style={styles.txtEmpty}>
        {t('No payment method ')}
        {type}
      </Text>
    </View>
  );

  const ListPayment = ({ data = [], typeEmpty = '' }) => (
    <View style={[layouts.fullWidth, { paddingLeft: scaleWidth(40) }]}>
      {data?.length > 0 ? (
        data.map(RowItemPayment)
      ) : (
        <RowEmptyItem type={typeEmpty} />
      )}
    </View>
  );

  const AddPaymentMethod = () => (
    <TouchableOpacity
      onPress={openAddNewPayment}
      style={[
        layouts.horizontal,
        styles.layoutRowItem,
        layouts.fullWidth,
        layouts.horizontalSpaceBetween,
        { paddingLeft: scaleWidth(40), borderBottomWidth: 0 },
      ]}
    >
      <Text style={styles.txtAddPayment}>
        {t('Add a customer payment method')}
      </Text>
      <Image
        source={IMAGE.add_discount_checkout}
        width={scaleWidth(24)}
        height={scaleWidth(24)}
        style={styles.iconAdd}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView bounces={false}>
      <View style={styles.container}>
        <View
          style={[layouts.horizontal, styles.layoutTitle, layouts.fullWidth]}
        >
          <Text style={styles.txtParentTitle}>{t('Payment types')}</Text>
        </View>
        <RowHeaderPayment name={t('Enabled payments')} />
        <ListPayment data={payments} typeEmpty={t('enabled')} />
        <AddPaymentMethod />

        <RowHeaderPayment name={t('Disabled payments')} />
        <ListPayment data={[]} typeEmpty={t('disabled')} />
      </View>

      <DialogAddNewPaymentMethod ref={refDialog} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtParentTitle: {
    fontSize: scaleFont(20),
    color: colors.OCEAN_BLUE,
    fontFamily: fonts.MEDIUM,
  },
  txtTitle: {
    fontSize: scaleFont(17),
    color: colors.GREYISH_BROWN,
    fontFamily: fonts.MEDIUM,
  },
  txtAddPayment: {
    fontSize: scaleFont(15),
    color: colors.OCEAN_BLUE,
    fontFamily: fonts.REGULAR,
  },
  txtEmpty: {
    fontSize: scaleFont(15),
    color: colors.GREYISH_BROWN,
    fontFamily: fonts.LIGHT,
  },
  layoutTitle: {
    paddingBottom: scaleHeight(40),
    paddingTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(20),
  },
  layoutRowHeader: {
    backgroundColor: colors.WHITE_FA,
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(10),
  },
  layoutRowItem: {
    height: scaleHeight(60),
    alignItems: 'center',
    paddingRight: scaleWidth(23),
    borderBottomWidth: scaleWidth(1),
    borderBottomColor: colors.WHITE_TWO,
    borderRadius: 1,
  },
  icon: {
    marginRight: scaleWidth(16),
    resizeMode: 'contain',
    width: scaleWidth(32),
    height: scaleWidth(32),
  },
  iconAdd: {
    resizeMode: 'contain',
    width: scaleWidth(24),
    height: scaleWidth(24),
    marginRight: scaleWidth(7),
  },
});

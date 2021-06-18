import IMAGE from '@resources';
import { ButtonCalendarFilter, ExportModal } from '@shared/components';
import { Table } from '@shared/components/CustomTable';
import { layouts } from '@shared/themes';
import { dateToString, DATE_SHOW_FORMAT_STRING } from '@shared/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const ACTIVE_COLOR = '#0764B0';
const INACTIVE_COLOR = '#6A6A6A';

const log = (obj, message = '') => {
  Logger.log(`[CustomerDetail] ${message}`, obj);
};

export default function CustomerDetail({
  route: {
    params: { customerId, name, timeValue },
  },
  navigation,
  showBackButton,
  onChangeTimeValue,
  data,
  onRefresh,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  const [details, setDetails] = React.useState(null);

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      showBackButton(true);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      showBackButton(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useEffect(() => {
    if (customerId && data?.length > 0) {
      const itemSelect = data.find(
        (detail) => detail.customerId === customerId
      );
      setDetails(itemSelect?.details || []);
    } else {
      setDetails([]);
    }
  }, [customerId, data]);

  React.useEffect(() => {
    calendarRef.current?.updateTimeValue(timeValue);
  }, [timeValue]);

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            ref={calendarRef}
            onChangeTimeValue={onChangeTimeValue}
            paddingLeft={scaleWidth(105)}
            paddingTop={scaleHeight(170)}
            // defaultValue={timeValue}
          />
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text style={layouts.title}>{name}</Text>
        <ExportModal />
      </View>
      <View style={styles.content}>
        <Table
          items={details}
          headerKeyLabels={{
            code: t('ID'),
            purchasePoint: t('Purchase Point'),
            date: t('Purchase Date'),
            billToName: t('Bill-to Name'),
            shipToName: t('Ship-to Name'),
            status: t('Status'),
            total: t('Grand Total'),
          }}
          whiteListKeys={[
            'code',
            'purchasePoint',
            'date',
            'billToName',
            'shipToName',
            'status',
            'total',
          ]}
          //   sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
          primaryKey="code"
          //   unitKeys={{ totalDuration: "hrs" }}
          widthForKeys={{
            code: scaleWidth(120),
            purchasePoint: scaleWidth(150),
            date: scaleWidth(150),
            billToName: scaleWidth(180),
            shipToName: scaleWidth(180),
            status: scaleWidth(120),
            total: scaleWidth(150),
          }}
          emptyDescription={t('No Report Data')}
          //   styleTextKeys={{ customerName: styles.textName }}
          //   onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
          }}
          renderCell={onRenderCell}
          onRefresh={onRefresh}
          //   onRowPress={onSelectRow}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    marginTop: scaleHeight(20),
  },

  rowContent: {
    marginTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cellAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
  },
  txtSalary: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#6A6A6A',
    marginRight: 5,
  },
  imgDetail: {
    tintColor: '#6A6A6A',
    width: 20,
    height: 20,
  },
  btnInCell: {
    height: '100%',
    width: 35,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartDetail: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  chartDetailItem: {
    flexDirection: 'row',
    margin: 10,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

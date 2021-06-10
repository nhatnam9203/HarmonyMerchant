import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, ButtonCustom } from '@components';
import { scaleSize } from '@utils';
import { Block } from '../components';
class RowTableCustomer extends React.Component {
  constructor(props) {
    super(props);
  }

  RowItem = ({ children }) => {
    return (
      <Block flex row middle>
        <Block width={1}>
          <Block flex backgroundColor="#E5E5E5" />
        </Block>
        <Block flex>{children}</Block>

        <Block width={1}>
          <Block flex backgroundColor="#E5E5E5" />
        </Block>
      </Block>
    );
  };

  render() {
    const { customer } = this.props;
    const onShowDetail = () => this.props.showModalDetail(customer);
    return (
      <Button onPress={onShowDetail} style={styles.tableHeader}>
        {/* ----- 1 ------ */}
        <this.RowItem>
          <Text
            style={{ ...styles.textTableHeader, fontWeight: '700' }}
            numberOfLines={1}
          >
            {`${customer?.firstName || ''} ${customer?.lastName || ''}`}
          </Text>
        </this.RowItem>

        {/* ----- 2 ----- */}
        <this.RowItem>
          <Text numberOfLines={1} style={styles.textTableHeader} numberOfLines={1}>
            {customer?.phone || ''}
          </Text>
        </this.RowItem>

        {/* ----- 3 ----- */}
        <this.RowItem>
          <Text numberOfLines={1} style={styles.textTableHeader} numberOfLines={1}>
            {customer?.email || ''}
          </Text>
        </this.RowItem>

        {/* ----- 4 ----- */}
        <this.RowItem>
          <Text numberOfLines={1} style={styles.textTableHeader} numberOfLines={1}>
            {customer?.group || ''}
          </Text>
        </this.RowItem>

        {/* ----- 5 ----- */}
        <this.RowItem>
          <Text numberOfLines={1} style={styles.textTableHeader} numberOfLines={1}>
            {customer?.sinceDate || ''}
          </Text>
        </this.RowItem>
        {/* ----- 6 ----- */}
        <this.RowItem>
          <ButtonCustom
            width={scaleSize(72)}
            height={28}
            backgroundColor="#0764B0"
            title={'Edit'}
            textColor="#FFFFFF"
            onPress={onShowDetail}
            style={{ borderRadius: 4, alignSelf: 'center' }}
            styleText={{
              fontSize: scaleSize(15),
            }}
          />
        </this.RowItem>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableHeader: {
    height: scaleSize(50),
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
  },
  textTableHeader: {
    color: '#6A6A6A',
    fontSize: scaleSize(13),
    paddingLeft: scaleSize(10),
  },
  itemTableHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RowTableCustomer;

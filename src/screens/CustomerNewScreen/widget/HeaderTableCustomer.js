import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IMAGE from '@resources';
import { scaleSize, localize } from '@utils';
import { Block, ButtonIcon } from '../components';
class HeaderTableCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSort: false,
    };
  }

  onChangeSortStatus = () => this.setState({ isSort: !this.state.isSort });

  RowItems = ({ data = [] }) => {
    const { language } = this.props;
    return data?.map((item, index) => {
      return (
        <Block key={index + ''} flex row middle>
          <Block width={1} style={{ paddingVertical: scaleSize(3) }}>
            <Block flex backgroundColor="#E5E5E5" />
          </Block>
          <Block
            flex
            style={{
              paddingLeft: scaleSize(15),
            }}
          >
            <Text style={styles.textTableHeader}>
              {localize(item?.title, language)}
            </Text>
          </Block>
          {item?.iconRight && (
            <ButtonIcon
              onPress={item?.actionRight}
              source={item.iconRight}
              imgWidth={scaleSize(10)}
              imgHeight={scaleSize(16)}
              style={{ marginRight: scaleSize(30) }}
            />
          )}
          <Block width={1} style={{ paddingVertical: scaleSize(3) }}>
            <Block flex backgroundColor="#E5E5E5" />
          </Block>
        </Block>
      );
    });
  };

  render() {
    const iconSortStatus = this.state.isSort ? IMAGE.sortUp : IMAGE.sortDown;
    const data = [
      {
        title: 'Name',
        iconRight: iconSortStatus,
        actionRight: this.onChangeSortStatus,
      },
      { title: 'Phone Number' },
      { title: 'Email' },
      { title: 'Group' },
      { title: 'Customer since' },
      { title: 'Actions' },
    ];

    return (
      <Block row backgroundColor="#F1F1F1" height={scaleSize(40)}>
        <this.RowItems data={data} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textTableHeader: {
    color: '#0764B0',
    fontSize: scaleSize(15),
    fontWeight: '600',
  },
  itemTableHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSort: {
    width: scaleSize(8),
    height: scaleSize(12),
  },
});

export default HeaderTableCustomer;

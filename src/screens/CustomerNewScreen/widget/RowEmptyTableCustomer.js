import React from 'react';
import { StyleSheet } from 'react-native';

import { scaleSize } from '@utils';
import { Block } from '../components';
class RowEmptyTableCustomer extends React.Component {
  constructor(props) {
    super(props);
  }

  RowItems = ({ data = [] }) => {
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
          ></Block>

          <Block width={1} style={{ paddingVertical: scaleSize(3) }}>
            <Block flex backgroundColor="#E5E5E5" />
          </Block>
        </Block>
      );
    });
  };

  render() {
    const data = [1, 2, 3, 4, 5, 6];

    return (
      <Block
        border={styles.borderStyle}
        row
        height={scaleSize(40)}
        backgroundColor="#FAFAFA"
      >
        <this.RowItems data={data} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  borderStyle: {
    borderWidth: 0.5,
    borderColor: '#C5C5C5',
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

export default RowEmptyTableCustomer;

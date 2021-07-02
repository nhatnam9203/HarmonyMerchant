import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Row } from './Row';
import { Cell } from './Cell';
import { colors, layouts, fonts } from '@shared/themes';
import { getUniqueId, SORT_TYPE } from '../helpers';
import IMAGE from '@resources';

const DEFAULT_KEY = 'table.default-header';
/**
 * T
 *
 *
 */
export const Header = ({
  style = styles.container,
  height = scaleHeight(40),
  children,
  onPress,
  disabled,
  whiteListKeys,
  headerKeyLabels,
  sortedKeys, // {'keyName1': 'asc', 'keyName2': 'desc'}
  onSortWithKey,
  getWidthForKey, // custom width for key
  draggable,
}) => {
  const handleSort = (sortKey) => {
    // console.log(sortKey);
    if (onSortWithKey && typeof onSortWithKey === 'function') {
      onSortWithKey(sortKey);
    }
  };
  return (
    <Row
      onPress={onPress}
      disabled={disabled}
      key={DEFAULT_KEY}
      height={height}
      style={style}
      draggable={false}
    >
      <View style={[layouts.fill, styles.contentLayout]}>
        {draggable && <View style={{ width: scaleWidth(30) }} />}
        {whiteListKeys &&
          whiteListKeys?.map((key, index) => (
            <Cell
              key={getUniqueId(key, index, 'header')}
              columnKey={key}
              index={index}
              text={headerKeyLabels[key] ?? ' '}
              textStyle={styles.textStyle}
              getWidthForKey={getWidthForKey}
            >
              {sortedKeys && Object.keys(sortedKeys)?.includes(key) && (
                <TouchableOpacity
                  style={styles.buttonSort}
                  onPress={() => handleSort(key)}
                >
                  <Image
                    style={styles.imageSort}
                    source={
                      sortedKeys[key] === SORT_TYPE.ASC
                        ? IMAGE.sortUp
                        : IMAGE.sortDown
                    }
                    resizeMode="center"
                  />
                </TouchableOpacity>
              )}
            </Cell>
          ))}
      </View>

      {children}
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.VERY_LIGHT_PINK_1,
  },

  contentLayout: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  buttonSort: {
    width: scaleWidth(50),
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: scaleWidth(4),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  imageSort: { width: scaleWidth(18), height: scaleHeight(18) },
});
import React from 'react';
import { View, Image } from 'react-native';
import Swipeout from 'react-native-swipeout';

import { scaleSize, getTotalProductByQuantity, formatMoney } from '@utils';
import { Text, Button } from '@components';
import ICON from '@resources';

const ItemBasket = ({
  item,
  removeItemBasket,
  onPress,
  disabled = false,
  changeProduct,
  removeExtra,
}) => {
  const { data } = item;
  const swipeoutBtns = [
    {
      backgroundColor: '#6A6A6A',
      component: (
        <Button
          onPress={() => removeItemBasket(item)}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={ICON.removeItemBasket}
            style={{ width: scaleSize(24), height: scaleSize(24) }}
          />
        </Button>
      ),
    },
  ];

  return (
    <Swipeout
      right={swipeoutBtns}
      buttonWidth={scaleSize(45)}
      disabled={disabled}
      close={true}
    >
      <Button
        onPress={() => {
          if (item.type === 'Service') {
            onPress(item);
          } else if (item.type === 'Product') {
            changeProduct(item);
          }
        }}
        style={{
          minHeight: scaleSize(35),
          backgroundColor: '#fff',
          borderBottomColor: '#DDDDDD',
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            height: scaleSize(35),
            flexDirection: 'row',
          }}
        >
          {/* -------- Avatar ------- */}
          <View
            style={{
              width: scaleSize(45),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.type === 'Service' ? (
              <View style={{ width: scaleSize(30), height: scaleSize(30) }}>
                {item.staff && item.staff.imageUrl ? (
                  <Image
                    source={
                      item?.imageUrl
                        ? { uri: item.imageUrl }
                        : ICON.service_holder
                    }
                    style={{ width: scaleSize(30), height: scaleSize(30) }}
                  />
                ) : (
                  <Image
                    source={ICON.staff_basket}
                    style={{ width: scaleSize(30), height: scaleSize(30) }}
                  />
                )}
              </View>
            ) : item.type === 'Extra' ? (
              <View
                style={{
                  width: scaleSize(30),
                  height: scaleSize(30),
                  borderRadius: scaleSize(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={ICON.extra_holder}
                  style={{ width: scaleSize(22), height: scaleSize(20) }}
                />
              </View>
            ) : item.type === 'GiftCards' ? (
              <Image source={ICON.giftcard} />
            ) : (
              <Image
                source={ICON.blue_productBasket}
                style={{ width: scaleSize(22), height: scaleSize(20) }}
              />
            )}
          </View>
          {/* -------- Name ------- */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* ------------ */}
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <Text
                numberOfLines={1}
                style={{
                  color: '#0764B0',
                  fontSize: scaleSize(13),
                  fontWeight: '500',
                }}
              >
                {item.type === 'Service'
                  ? item?.data?.name || ''
                  : data?.name || ''}
              </Text>
            </View>

            {/* ------------ */}
            <View
              style={{
                flex: 0.8,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: '#6A6A6A',
                  fontSize: scaleSize(13),
                  fontWeight: '500',
                }}
              >
                {item.type === 'Product' || item.type === 'GiftCards'
                  ? item?.quanlitySet || 1
                  : item?.staff?.displayName || 'Any staff'}
              </Text>
            </View>
            {/* -------- Price ------- */}
            <View
              style={{
                flex: 1.2,
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingRight: scaleSize(10),
              }}
            >
              <Text
                style={{
                  color: '#404040',
                  fontSize: scaleSize(14),
                  fontWeight: '500',
                }}
              >
                {`$ ${
                  item.type === 'Product'
                    ? getTotalProductByQuantity(data.price, item.quanlitySet)
                    : formatMoney(data.price)
                }`}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ height: 10 }} />
        {/* ------------------ Extra ----------------- */}
        {item.type === 'Service' && item.extras
          ? item.extras.map((extra) => (
              <View
                key={extra?.id}
                style={{
                  alignItems: 'center',
                  paddingLeft: scaleSize(45),
                  paddingRight: scaleSize(10),
                  flexDirection: 'row',
                  marginBottom: scaleSize(8),
                }}
              >
                <Image
                  source={ICON.extra_mini}
                  style={{ height: scaleSize(15), width: scaleSize(15) }}
                />
                <Text
                  style={{
                    color: '#6A6A6A',
                    fontSize: scaleSize(12),
                    fontWeight: '500',
                    marginHorizontal: scaleSize(6),
                  }}
                  numberOfLines={1}
                >
                  {`${extra?.data?.name}`}
                </Text>

                <Button onPress={() => removeExtra(extra)}>
                  <Image
                    source={ICON.delete_extra_mini}
                    style={{ height: scaleSize(15), width: scaleSize(15) }}
                  />
                </Button>

                {/* --------------- Price ------------------ */}
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    color: '#6A6A6A',
                    fontSize: scaleSize(12),
                    fontWeight: '600',
                  }}
                  numberOfLines={1}
                >
                  {`$ ${extra?.data?.price}`}
                </Text>
              </View>
            ))
          : null}
      </Button>
    </Swipeout>
  );
};

export default ItemBasket;

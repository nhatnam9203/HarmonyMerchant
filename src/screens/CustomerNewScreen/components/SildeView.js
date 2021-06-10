import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { scaleSize } from '@utils';
const DEFAULT_WITDH = 240;
const VALUE_X = DEFAULT_WITDH * 2;
export const SildeView = ({
  height,
  width,
  style,
  children,
  visible,
  onClosed,
  onOpened,
}) => {
  var x = useRef(new Animated.Value(VALUE_X)).current;
  const [isSlide, setSlide] = useState(false);
  const slide = () => {
    let config = {
      speed: 20,
      toValue: 0,
      bounciness: 0,
      useNativeDriver: true,
    };
    Animated.spring(x, config).start();
    setSlide(true);
    if (typeof onOpened === 'function') {
      onOpened();
    }
  };
  const hidden = () => {
    let config = {
      toValue: VALUE_X,
      useNativeDriver: true,
    };
    Animated.spring(x, config).start();

    setTimeout(() => {
      setSlide(false);
    }, 250);
    if (typeof onClosed === 'function') {
      onClosed();
    }
  };
  useEffect(() => {
    if (visible) {
      slide();
    } else {
      hidden();
    }
  }, [visible]);

  if (isSlide)
    return (
      <Animated.View
        style={[
          styles.defaultStyle,
          {
            height,
            width,
            transform: [
              {
                translateX: x,
              },
            ],
          },

          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  return null;
};
const styles = StyleSheet.create({
  defaultStyle: {
    position: 'absolute',
    right: 0,
    zIndex: 1000000,
    backgroundColor: '#FFFFFF',
  },
});

SildeView.defaultProps = {
  width: scaleSize(DEFAULT_WITDH),
  height: Dimensions.get('window').height,
  visible: false,
  onOpened: null,
  onClosed: null,
};

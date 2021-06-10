import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SildeView, Block, ButtonIcon } from '../components';
import { ButtonCustom, Dropdown, Text } from '@components';
import { scaleSize, localize } from '@utils';
import ICON from '@resources';
class PopupFilterCustomer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { onClose } = this.props;
    return (
      <SildeView
        height="100%"
        style={styles.shadowStyle}
        visible={this.props.visible}
      >
        {/* ----------- Header ------------ */}
        <Block
          middle
          space="space-between"
          row
          width="100%"
          height={scaleSize(50)}
          border={{ borderBottomWidth: 2, borderColor: '#EEEEEE' }}
          style={{
            paddingHorizontal: scaleSize(10),
          }}
        >
          <Text style={styles.txtTitle}>{localize('Filters')}</Text>
          <ButtonIcon
            onPress={onClose}
            source={ICON.closePopup}
            imgWidth={scaleSize(16)}
            imgHeight={scaleSize(16)}
            tintColor="#00001D"
          />
        </Block>

        <Block
          flex
          style={{
            paddingHorizontal: scaleSize(10),
          }}
        >
          <Text style={styles.txtContent}>{localize('Group')}</Text>

          {/* ----------- Drop Down Group ------------ */}
          <Block height={scaleSize(40)}>
            <Dropdown
              label="All Groups"
              data={[
                { value: 'All Groups' },
                { value: 'Normal' },
                { value: 'VIP' },
              ]}
              baseColor="#404040"
              fontSize={scaleSize(17)}
              containerStyle={styles.dropDownStyle}
            />
          </Block>
        </Block>

        {/* ----------- Bottom ------------ */}
        <Block width="100%" flex={1} style={styles.bottomStyle} center>
          <Block
            middle
            space="space-between"
            row
            width="100%"
            height={scaleSize(50)}
          >
            <ButtonCustom
              width={'45%'}
              height={32}
              backgroundColor="#F1F1F1"
              title={localize('Reset')}
              textColor="#6A6A6A"
              onPress={onClose}
              styleText={styles.txtButton}
            />
            <ButtonCustom
              width={'45%'}
              height={32}
              backgroundColor="#0764B0"
              title={localize('Apply')}
              textColor="#fff"
              onPress={onClose}
              styleText={styles.txtButton}
            />
          </Block>
        </Block>
      </SildeView>
    );
  }
}

const styles = StyleSheet.create({
  shadowStyle: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0,0.3)',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 1,
      },

      android: {
        elevation: 2,
      },
    }),
  },

  dropDownStyle: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    flex: 1,
  },
  bottomStyle: {
    justifyContent: 'flex-end',
    paddingHorizontal: scaleSize(10),
    marginBottom: scaleSize(10),
  },
  txtTitle: {
    fontSize: scaleSize(17),
    fontWeight: '700',
  },
  txtButton: {
    fontSize: scaleSize(15),
  },
  txtContent: {
    fontSize: scaleSize(15),
    color: '#0764B0',
    paddingVertical: scaleSize(15),
  },
});

export default PopupFilterCustomer;

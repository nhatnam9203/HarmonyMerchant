import { scaleSzie, localize } from "@utils";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import styles from "./style";
import { ItemBrand } from "./widget";

class Layout extends React.Component {
  render() {
    const { language, listMarketPlace, isLoadMoreMarketList } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.tabName}>
          <Text style={styles.title}>{`${localize(
            "Brand List",
            language
          )}`}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#FFF",
            marginTop: -1,
            paddingLeft: scaleSzie(4),
            height: "95%",
          }}
        >
          <FlatList
          ref={ this.flatListRef }
            data={listMarketPlace}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            renderItem={({ item, index }) => (
              <ItemBrand key={index} item={item} />
            )}
            numColumns={"5"}
            keyExtractor={(item, index) => `${index}`}
            onEndReached={this.onLoadmore}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            removeClippedSubviews={true}
            initialNumToRender={20}
            maxToRenderPerBatch={5}
            ListFooterComponent={() => (
              <View
                style={{
                  height: scaleSzie(20),
                  justifyContent: "center",
                  marginBottom: scaleSzie(40),
                }}
              >
                {isLoadMoreMarketList ? (
                  <ActivityIndicator size="large" color="#0764B0" />
                ) : null}
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

export default Layout;

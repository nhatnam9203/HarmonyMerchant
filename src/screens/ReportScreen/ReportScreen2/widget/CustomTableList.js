import React, { Component } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";

export default function TableList({ data, selectedItem }) {
  const renderItem = ({ item, index, separators }) => {
    return <TableRow></TableRow>;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      extraData={selectedItem}
    />
  );
}

function TableRow({}) {
  return (
    <TouchableOpacity>
      <View></View>
    </TouchableOpacity>
  );
}

function TableCell({}) {
  return (
    <TouchableOpacity>
      <View></View>
    </TouchableOpacity>
  );
}

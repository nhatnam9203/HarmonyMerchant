import React from "react";
import { View } from "react-native";
import {useSelector} from 'react-redux';

import IMAGE from "@resources";
import { HeaderTitle, HeaderTooltip, PopupButton, TableList } from "../widget";

export default function StaffSalaryTab({ style }) {

  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);

  return (
    <View style={style}>
      <HeaderTitle title="STAFF SALARY" />
      <HeaderTooltip>
        <PopupButton text="Last Week" />
        <PopupButton text="All Staff" imageSrc={IMAGE.Report_Dropdown_Arrow} />
        <PopupButton text="Export" imageSrc={IMAGE.Report_Export} />
      </HeaderTooltip>

      <View style={{ flex: 1, backgroundColor: "green" }}>
        <TableList data={listStaffsSalary}/>
      </View>
    </View>
  );
}


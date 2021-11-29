import React from "react";
import { archiveStaff, restoreStaff, useAxiosMutation } from "@apis";

export const useApis = (onResponse = () => {}) => {
  const [staffId, setStaffId] = React.useState(null);

  const [, archiveForStaff] = useAxiosMutation({
    ...archiveStaff(staffId),
    onSuccess: (data, response) => {
      if (response?.codeNumber == 200) {
        onResponse("archiveForStaff", data);
      }
    },
  });

  const [, restoreForStaff] = useAxiosMutation({
    ...restoreStaff(staffId),
    onSuccess: (data, response) => {
      if (response?.codeNumber == 200) {
        onResponse("restoreForStaff", data);
      }
    },
  });

  return {
    archiveForStaff: async (id) => {
      await setStaffId(id);
      await archiveForStaff();
    },
    restoreForStaff: async (id) => {
      await setStaffId(id);
      await restoreForStaff();
    },
  };
};

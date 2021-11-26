import { archiveStaff, restoreStaff, useAxiosMutation } from "@apis";

export const useApis = (props, onResponse) => {
  const { staffId } = props;

  const [, archiveForStaff] = useAxiosMutation({
    ...archiveStaff(staffId),
    onSuccess: (data, response) => {
      if (response?.codeNumber == 200) {
      }
    },
  });

  const [, restoreForStaff] = useAxiosMutation({
    ...restoreStaff(staffId),
    onSuccess: (data, response) => {
      if (response?.codeNumber == 200) {
      }
    },
  });

  return {
    archiveForStaff: (staffId) => {
      console.log(archiveForStaff);
      archiveForStaff(staffId);
    },
    restoreForStaff: (staffId) => {},
  };
};

import actions from "@redux/actions";
import { useGetCategoriesList } from "@shared/services/api/retailer";
import { useDispatch, useSelector } from "react-redux";
import React from 'react';

export const useLockScreen = (onSubmitSuccess) => {
    const dispatch = useDispatch();
    const profileStaffLogin = useSelector(
        (state) => state.dataLocal?.profileStaffLogin
    );

    const merchantID = useSelector(
        (state) => state.dataLocal?.profile?.merchantCode
    );
    const isLoginStaff = useSelector((state) => state.dataLocal.isLoginStaff);
    const [, getCategoriesList] = useGetCategoriesList();

    const handleSubmit = (value) => {
        dispatch(actions.staff.loginStaff(merchantID, value));
    };


    const onLoadApps = React.useCallback(() => {
        if (isLoginStaff) {
            getCategoriesList();
        }
    }, [isLoginStaff]);

    React.useEffect(() => {
        if (isLoginStaff) {
            if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
                onSubmitSuccess();
            }
            onLoadApps();
        }
    }, [isLoginStaff]);

    return {
        loginStaff: handleSubmit
    };
};

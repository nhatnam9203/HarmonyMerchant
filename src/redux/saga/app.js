import { put, takeLatest, all } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";
import { Alert } from 'react-native';

import { requestAPI } from '../../utils';
import actions from "../actions";

function* getMerchantByID(action) {
    try {
        if (!action.isRefresh) {
            yield put({ type: 'LOADING_ROOT' });
        }
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_MERCHANT_BY_ID_SUCCESS',
                payload: responses?.data
            });
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            });
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
            yield put({
                type: 'GET_MERCHANT_BY_ID_FAIL',
            });
        }
    } catch (error) {
        yield put({
            type: 'GET_MERCHANT_BY_ID_FAIL',
        });
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });

    }
}

function* registerUser(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "RESET_AGREE_TERM"
            });
            yield put({
                type: "REGISTER_USER_SUCCESS"
            })
            NavigationServices.navigate('SignIn');
        } else {
            yield put({
                type: "REGISTER_USER_FAIL"
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getStateCity(action) {
    try {
        const responses = yield requestAPI(action);
        yield put({
            type: 'GET_STATE_CITY_SUCCESS',
            payload: responses?.data || []

        });
    } catch (error) {
        yield put({ type: error });
    } finally {
    }
}

function* getQuestion(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_QUESTION_SUCCESS',
                payload: responses?.data || []

            });
        } else {
            yield put({
                type: 'GET_QUESTION_FAIL',
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }

    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* merchantSetting(action) {
    try {
        if (action.isLoading) {
            yield put({ type: 'LOADING_ROOT' });
        }
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'MERCHANT_SETTING_SUCCESS',
            });
            yield put({
                type: 'UPDATE_MERCHANT_PROFILE',
                payload: responses?.data
            });
            if (action.isShowAlert) {
                setTimeout(() => {
                    alert("Update Successfull!")
                }, 500)
            }

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'MERCHANT_SETTING_FAIL',
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({
            type: 'MERCHANT_SETTING_FAIL',
        });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* sendLinkInstallApp(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({ type: 'STOP_LOADING_ROOT' });
            setTimeout(() => {
                alert('Sent !')
            }, 500)

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* setupMerchantTAX(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SAVE_PROFILE_LOCAL',
                payload: { profile: responses?.data }
            });
            yield put({
                type: 'CHANGE_FLAG_SUBMIT_TAX',
                payload: false
            });

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkEmailSignup(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getPackageAndPricing(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_PACKAGE_AND_PRICING_SUCCESS",
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}
function* changeIsGiftForNew(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "CHANGE_IS_GIFT_FOR_NEW_SUCCESS",
                payload: action.visible
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
            yield put({
                type: "CHANGE_IS_GIFT_FOR_NEW_FAIL",
                payload: !action.visible
            })
        }
    } catch (error) {
        yield put({ type: error });
        yield put({
            type: "CHANGE_IS_GIFT_FOR_NEW_FAIL",
            payload: !action.visible
        })
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getNotificationList(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_NOTIFICATION_LIST_SUCCESS",
                payload: responses?.data || [],
                totalPages: responses?.pages || 0,
                currentPage: action.currentPage
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
            yield put({
                type: "GET_NOTIFICATION_LIST_FAIL",
            })
        }
    } catch (error) {
        yield put({ type: error });
        yield put({
            type: "GET_NOTIFICATION_LIST_FAIL",
        })
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getCountUnReadOfNotification(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_COUNT_UNREAD_OF_NOTIFICATION_SUCCESS",
                payload: responses?.data || "0"
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* maskNotiAsReadById(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(actions.app.getCountUnReadOfNotification());

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* requestNetworkTimeout(action) {
    yield put({ type: 'STOP_LOADING_ROOT' });
    if (action.typeParent && action.typeParent === 'LOGIN_STAFF') {
        yield put({
            type: 'TURN_ON_OFFLINE_MODE',
            payload: true
        })
    } else {
        setTimeout(() => {
            alert('Please check your internet !');
        }, 300)
    }


}

function* timeout(action) {
    yield put({ type: 'Server not response' });
    setTimeout(() => {
        alert('Server not response');
    }, 500)

}

function* showErrorMessage(action) {
    yield put({ ...action, type: 'STOP_LOADING_ROOT' });
    if (action.message === "The pincode is exsits.") {
        setTimeout(() => {
            Alert.alert(
                'Oops!',
                `This PIN already exists for another staff. Please enter a different 4-digit PIN.`,
                [
                    {
                        text: 'OK', onPress: () => { }
                    },
                ],
                { cancelable: false },
            );
        }, 300)
    } else {
        setTimeout(() => {
            alert(action?.message || 'Some thing went wrong, Please contact with admin!');
        }, 300)
    }
}

function* handleSomethingWentWrong(action) {
    try {
        yield put({ ...action, type: 'STOP_LOADING_ROOT' });
        alert('Some thing went wrong, Please contact with admin!');
    } catch (error) {
        yield put({ type: error });
    }
}

export default function* saga() {
    yield all([
        takeLatest('GET_MERCHANT_BY_ID', getMerchantByID),
        takeLatest('REGISTER_USER', registerUser),
        takeLatest('GET_STATE_CITY', getStateCity),
        takeLatest('GET_QUESTION', getQuestion),
        takeLatest('SEND_LINK_INSTALL_APP', sendLinkInstallApp),
        takeLatest('SETUP_MERCHANT_TAX', setupMerchantTAX),
        takeLatest('CHECK_EMAIL_SIGN_UP', checkEmailSignup),
        takeLatest('GET_PACKAGE_AND_PRICING', getPackageAndPricing),
        takeLatest('CHANGE_IS_GIFT_FOR_NEW', changeIsGiftForNew),
        takeLatest('GET_NOTIFICATION_LIST', getNotificationList),
        takeLatest('GET_COUNT_UNREAD_OF_NOTIFICATION', getCountUnReadOfNotification),
        takeLatest('MASK_NOTI_AS_READ_BY_ID', maskNotiAsReadById),


        takeLatest('NET_WORK_REQUEST_FAIL', requestNetworkTimeout),
        takeLatest('TIME_OUT', timeout),
        takeLatest('SHOW_ERROR_MESSAGE', showErrorMessage),
        takeLatest('MERCHANT_SETTING', merchantSetting),
        takeLatest('SOMETHING_WENT_WRONG', handleSomethingWentWrong),
    ])
}
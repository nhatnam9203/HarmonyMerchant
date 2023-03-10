import * as React from "react";
import { NavigationActions } from "react-navigation";
import { StackActions } from "@react-navigation/native";

let _container; // eslint-disable-line
export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

function navigate(name, params) {
  if (isReadyRef.current) navigationRef.current?.navigate(name, params);
}

function replace(name) {
  if (isReadyRef.current)
    navigationRef.current?.dispatch(StackActions.replace(name));
}

function goBack() {
  navigationRef.current?.goBack();
}

function setContainer(container) {
  _container = container;
}

function reset(routeName, params) {
  _container.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName })],
    })
  );
}

// function navigate_old(routeName: string, params?: NavigationParams) {
//   _container.dispatch(
//     NavigationActions.navigate({
//       type: "Navigation/NAVIGATE",
//       routeName,
//       params,
//     })
//   );
// }

function navigateDeep(actions) {
  _container.dispatch(
    actions.reduceRight(
      (prevAction, action) =>
        NavigationActions.navigate({
          type: "Navigation/NAVIGATE",
          routeName: action.routeName,
          params: action.params,
          action: prevAction,
        }),
      undefined
    )
  );
}

function popToTop() {
  _container.dispatch(StackActions.popToTop());
}

function back() {
  _container.dispatch(NavigationActions.back());
}

function getCurrentRoute() {
  if (!_container || !_container.state.nav) {
    return null;
  }

  return _container.state.nav.routes[_container.state.nav.index] || null;
}

export default {
  setContainer,
  navigateDeep,
  navigate,
  // navigate_old,
  reset,
  getCurrentRoute,
  back,
  popToTop,
  goBack,
  replace,
};

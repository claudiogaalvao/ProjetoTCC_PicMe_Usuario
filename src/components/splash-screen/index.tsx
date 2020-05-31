import React, { Component } from "react";
import { View } from "react-native";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import ScreenBase from "../common/screen-base";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { HomeState } from "../../store/reducers/home";
import { getRemoteUserModel } from "../../store/thunk/home";

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<any>, any>,
  home: HomeState,
  getRemoteUser: Function
}
class SplashScreen extends ScreenBase<Props> {
  componentDidMount() {
    if (firebase.auth().currentUser) {
      this.props.getRemoteUser();
      
      this.navigateNoHistory('Home');
    } else {
      this.navigateNoHistory('Welcome');
    }
  }

  render() {
    return(
      <View />
    );
  }
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => ({
  getRemoteUser: () => dispatch(getRemoteUserModel())
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
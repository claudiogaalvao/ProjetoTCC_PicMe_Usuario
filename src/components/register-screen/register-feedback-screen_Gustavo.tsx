import React from "react";
import ScreenBase from "../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { Container, Content, Text, Icon, H1, Button, View } from "native-base";

interface Props {
}
class RegisterFeedbackScreen extends ScreenBase<Props> {
  static navigationOptions: NavigationScreenOptions = {
    header: null
  }

  constructor(props: Props) {
    super(props);
  }

  render() {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 16, alignItems: 'center' }}>
          <Icon name='person' />
          <H1>Welcome</H1>
          <Text>Your account has been created!</Text>
          <Text style={{ textAlign: 'center' }}>Please check your email inbox in order to activate your account.</Text>
          <Button style={{ marginTop: 24 }} full rounded info onPress={() => { this.navigateNoHistory('Home'); }}>
            <Text>Back</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default RegisterFeedbackScreen;
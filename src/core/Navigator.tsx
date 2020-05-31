import { createStackNavigator, createAppContainer, NavigationScreenProp, NavigationRoute, NavigationActions, StackActions } from 'react-navigation';
import SplashScreen from '../components/splash-screen';
import WelcomeScreen from '../components/login-screen/index';
import SignInScreen from '../components/login-screen/sign-in';
import RegisterScreen from '../components/register-screen/index';
import HomeScreen from '../components/home-screen';
import PhotographerProfileScreen from '../components/profile-photographer/index';
import PayMethod from '../components/wallet-screen/payMethod'
import AddBalance from '../components/wallet-screen/addBalance'
import ListBottomFilter from '../components/home-screen/filter'
import SessionDetails from '../components/sessions-historic/sessionDetail'

const MainNavigator = createStackNavigator({
  Splash: SplashScreen,
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  Register: RegisterScreen,
  Home: HomeScreen,
  PhotographerProfile: PhotographerProfileScreen,
  PayMethod: PayMethod,
  AddBalance: AddBalance,
  ListBottomFilter: ListBottomFilter,
  SessionDetails: SessionDetails
}, {
  initialRouteName: 'Splash',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#009975',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    }
  }
});

const Container = createAppContainer(MainNavigator);

export default Container;
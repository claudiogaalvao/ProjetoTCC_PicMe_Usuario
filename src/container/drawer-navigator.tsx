import React, {Component} from 'react';
import { createDrawerNavigator, createAppContainer, DrawerItems, DrawerItemsProps } from 'react-navigation';
import NavigatorControl from '../core/Navigator'
import WalletScreen from '../components/wallet-screen/addBalance';
import SessionHistoric from '../components/sessions-historic/index';
import navigatorLayout from './navigator-layout';

const MyDrawerNavigator = createDrawerNavigator({
    Principal: NavigatorControl,
    Carteira: WalletScreen,
    SessionHistoric: SessionHistoric
},
{
    initialRouteName: 'Principal',
    contentComponent: navigatorLayout,
    drawerWidth: 300,
    drawerPosition: 'left',
});

const AppContainer = createAppContainer(MyDrawerNavigator);

export default class DrawerNavigator extends Component {
    render (){
        return <AppContainer />;
    }
}
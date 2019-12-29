import React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native'

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import CharacterSelect from './CharacterSelect'
import SoundGrid from './SoundGrid'

const AppNavigator = createStackNavigator(
  {
    CharacterSelect: CharacterSelect,
    SoundGrid: SoundGrid,
  },
  {
    initialRouteName: 'CharacterSelect'
  }
);

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

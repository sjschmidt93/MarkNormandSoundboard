import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import CharacterSelect from './screens/CharacterSelect'
import SoundGrid from './screens/SoundGrid'
import StartScreen from './screens/StartScreen'
import { Provider } from 'mobx-react'
import soundStore from './SoundStore'

const AppNavigator = createStackNavigator(
  {
    StartScreen: StartScreen,
    CharacterSelect: CharacterSelect,
    SoundGrid: SoundGrid,
  },
  {
    initialRouteName: 'StartScreen'
  }
)

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
  render() {
    return (
      <Provider soundStore={soundStore}>
        <AppContainer />
      </Provider>
    )
  }
}

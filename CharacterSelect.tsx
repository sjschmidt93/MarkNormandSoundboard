import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'

export interface NaivgationScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class CharacterSelect extends React.Component<NaivgationScreenProps> {
  onPressMark = () => this.props.navigation.navigate('SoundGrid', { comedian: 'Mark'})

  onPressJoe = () => this.props.navigation.navigate('SoundGrid', { comedian: 'Joe' })

  render() {
      return (
        <View>
          <Text>Choose your Comedian</Text>
          <View>
            <TouchableOpacity onPress={this.onPressMark} style={styles.comedianButton}>

            </TouchableOpacity>
            <TouchableOpacity>

            </TouchableOpacity>
          </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  comedianButton: {
    backgroundColor: 'black',
    height: 100,
    width: 100
  }
})
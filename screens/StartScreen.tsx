import React from "react"
import { Image, View, StyleSheet, Text } from "react-native"
import { tuesdaysBlue, NavigationProps } from "./CharacterSelect"
import { TouchableOpacity } from "react-native-gesture-handler"

export default class StartScreen extends React.Component<NavigationProps> {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.tuesdaysLogo} source={require('./../assets/images/tuesdays_logo.jpg')} />
        <TouchableOpacity style={styles.startTextContainer} onPress={() => this.props.navigation.navigate('CharacterSelect')}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tuesdaysBlue,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tuesdaysLogo: {
    height: 400,
    width: 400
  },
  startTextContainer: {

  },
  startText: {

  }
})
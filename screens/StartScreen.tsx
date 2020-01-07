import React from "react"
import { Image, View, StyleSheet, Text } from "react-native"
import { tuesdaysBlue, NavigationProps } from "./CharacterSelect"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Audio } from 'expo-av'
import { Octicons } from '@expo/vector-icons'
import { observer } from 'mobx-react'
import { observable } from "mobx"

@observer
export default class StartScreen extends React.Component<NavigationProps> {
  static navigationOptions = {
    header: null
  }

  @observable
  muted = false

  sound = new Audio.Sound()

  componentDidMount() {
    this.loadAudio()
  }

  loadAudio = async () => {
    try {
      await this.sound.loadAsync(require('./../assets/sounds/theme_song.mp3'))
      await this.sound.playAsync();
    } catch (error) {
      console.warn('Failed to to load theme song')
    }
  }

  onPressMute = () => {
    this.sound.setIsMutedAsync(this.muted)
    this.muted = !this.muted
  }

  onPressStart = () => this.props.navigation.navigate('CharacterSelect', { sound: this.sound })

  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Image style={styles.tuesdaysLogo} source={require('./../assets/images/tuesdays_logo.jpg')} />
          <TouchableOpacity style={styles.startTextContainer} onPress={this.onPressStart}>
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.muteButtonContainer} onPress={this.onPressMute}>
          <Octicons name={this.muted ? "mute" : "unmute"} size={25} color="white" />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: tuesdaysBlue,
    flex: 1
  },
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'center',
  },
  tuesdaysLogo: {
    height: 400,
    width: 400
  },
  startTextContainer: {
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 25,
    padding: 5,
    margin: 5
  },
  muteButtonContainer: {
    paddingBottom: 10,
    paddingLeft: 10
  },
  startText: {
    fontSize: 38,
    color: 'white',
    padding: 5
  }
})

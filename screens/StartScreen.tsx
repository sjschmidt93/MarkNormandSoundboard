import React from "react"
import { Image, View, StyleSheet, Text } from "react-native"
import { tuesdaysBlue, NavigationProps } from "./CharacterSelect"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Audio } from 'expo-av'
import { Octicons } from '@expo/vector-icons'

interface StartScreenState {
  muted: boolean
}

export default class StartScreen extends React.Component<NavigationProps, StartScreenState> {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = { muted: false }
  }

  componentDidMount() {
    this.state = { muted: false }
    this.loadAudio()
  }

  sound = new Audio.Sound()

  loadAudio = async () => {
    try {
      await this.sound.loadAsync(require('./../assets/sounds/theme_song.mp3'))
      await this.sound.playAsync();
    } catch (error) {
      console.warn('Failed to to load theme song')
    }
  }

  onPressMute = () => {
    this.setState({ muted: !this.state.muted })
    this.sound.setIsMutedAsync(!this.state.muted)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.tuesdaysLogo} source={require('./../assets/images/tuesdays_logo.jpg')} />
        <TouchableOpacity onPress={this.onPressMute}>
          <Octicons name={this.state.muted ? "mute" : "unmute"} size={32} color="white" />
        </TouchableOpacity>
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
    alignItems: 'center',
    width: '100%'
  },
  tuesdaysLogo: {
    height: 400,
    width: 400
  },
  startTextContainer: {
    // borderColor: 'red',
    // borderWidth: 5,
    // borderRadius: 100,
    // width: '100%',
    // backgroundColor: tuesdaysBlue
  },
  startText: {
    fontSize: 48,
    color: 'white',
    padding: 5
  }
})

import React from "react"
import { Image, View, StyleSheet, Text } from "react-native"
import { tuesdaysBlue, NavigationProps, MuteButton } from "./CharacterSelect"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Audio } from 'expo-av'
import { observer, inject } from 'mobx-react'
import { SoundStoreProp } from "./SoundGrid"
import { LinearGradient } from "expo-linear-gradient"

const GRADIENT_COLOR_ONE = '#7C98B3'
const GRADIENT_COLOR_TWO = '#637081'

@inject('soundStore')
@observer
export default class StartScreen extends React.Component<NavigationProps & SoundStoreProp> {
  static navigationOptions = {
    header: null
  }

  sound = new Audio.Sound()

  componentDidMount() {
    this.loadAudio()
  }

  loadAudio = async () => {
    try {
      await this.sound.loadAsync(require('./../assets/sounds/theme_song.mp3'))
      //this.props.soundStore.play(this.sound)
    } catch (error) {
      console.warn('Failed to to load theme song')
    }
  }

  onPressStart = () => this.props.navigation.navigate('CharacterSelect')

  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Image style={styles.tuesdaysLogo} source={require('./../assets/images/tuesdays_logo.jpg')} />
          <LinearGradient
            start={[0, 1]}
            end={[1, 0]}
            style={styles.startTextContainer}
            colors={[GRADIENT_COLOR_ONE, GRADIENT_COLOR_TWO]}
          >
            <TouchableOpacity onPress={this.onPressStart}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <MuteButton />
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
    alignItems: 'center'
  },
  tuesdaysLogo: {
    height: 400,
    width: 400
  },
  startTextContainer: {
    //borderColor: 'white',
    //borderWidth: 5,
    //borderRadius: 25,
    padding: 5,
    margin: 5,
    width: '60%'
  },
  startText: {
    fontSize: 38,
    color: 'white',
    padding: 5,
    textAlign: 'center'
  }
})

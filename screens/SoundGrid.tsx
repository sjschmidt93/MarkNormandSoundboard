import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text, Animated } from "react-native"
import { NavigationProps, tuesdaysBlue } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'
import { markGridProps, joeGridProps } from "../grids"
import { Foundation, Ionicons } from '@expo/vector-icons'
import _ from "lodash"

interface SoundGridState {
  playingSound: Audio.Sound
}

export default class SoundGrid extends React.Component<NavigationProps, SoundGridState> {
  static navigationOptions = {
    headerStyle: { 
      backgroundColor: tuesdaysBlue
    }
  }

  constructor(props) {
    super(props)
    this.state = { playingSound: null }
  }

  comedian: string = this.props.navigation.getParam('comedian')

  gridProps = this.comedian === 'Joe List'
    ? joeGridProps
    : markGridProps

  onPressStop = () => this.setState({ playingSound: null })

  render () {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.comedianText}>{this.comedian}</Text>
          {
            this.gridProps.map((gridProps, index) => (
              <View key={index} style={styles.rowContainer}>
                { 
                  gridProps.map((props, index) => {
                    const onPress = (sound: Audio.Sound) => this.setState({ playingSound: sound })
                    return <Square key={index} sound={props.sound} text={props.text} onPress={onPress} />
                  })
                }
              </View>
            ))
          }
          <PlaybackButtons sound={this.state.playingSound} onPressStop={this.onPressStop} />
        </View>
      </ScrollView>
    );
  }
}
  
  export interface SquareProps {
    sound: PlaybackSource
    text: String
    onPress: (sound: Audio.Sound) => void
  }
  
  interface SquareState {
    played: boolean
  }
  
  class Square extends React.Component<SquareProps, SquareState> {
    sound = new Audio.Sound()

    constructor(props) {
      super(props)
      this.state = { played: false }
    }
  
    componentDidMount() {
      this.loadAudio()
    }
  
    loadAudio = async () => {
      try {
        await this.sound.loadAsync(this.props.sound)
      } catch (error) {
        console.warn('Failed to to load' + this.props.sound)
      }
    }
  
    onPress = () => {
      if (this.state.played) {
        this.sound.replayAsync()
      } else {
        this.sound.playAsync()
        this.setState({ played: true })
        this.props.onPress(this.sound)
      }
    }
  
    render() {
      return (
        <TouchableOpacity onPress={this.onPress} style={styles.square}>
          <Text style={styles.squareText}>{this.props.text}</Text>
        </TouchableOpacity>
      )
    }
  }
  
  interface PlaybackButtonsProps {
    sound: Audio.Sound
    onPressStop: () => void
  }

  interface PlayBackButtonsState {
    paused: boolean
  }

  class PlaybackButtons extends React.Component<PlaybackButtonsProps, PlayBackButtonsState> {
    constructor(props) {
      super(props)
      this.state = { paused: false }
      this.getAudioLength(props.sound)
    }

    audioLength = 0

    onPressStop = () => this.props.onPressStop()

    onPressPause = () => {
      this.props.sound.pauseAsync()
      this.setState({ paused: true })
    }

    onPressPlay = () => this.props.sound.playAsync()

    onPressPlayPause = () => {
      if (this.state.paused) {
        this.props.sound.playAsync()
      } else {
        this.props.sound.pauseAsync()
      }
      this.setState({ paused: !this.state.paused })
    }

    componentDidUpdate(prevProps) {
      if (prevProps.sound !== this.props.sound) {
        this.getAudioLength(this.props.sound)
      }
    }

    getAudioLength = (sound: Audio.Sound) => {
      if (!_.isNil(sound)) {
        sound.getStatusAsync()
          .then(status => {
            if (status.isLoaded) {
              this.audioLength = status.durationMillis
              console.log(this.audioLength)
            }
          })
          .catch(e => console.warn('Error getting sound status', e))
      }
    }

    render() {
      if (this.props.sound === null) {
        return null
      }

      return (
        <View style={styles.playbackContainer}>
          <View style={styles.playbackButtonsContainer}>
            <TouchableOpacity onPress={this.props.onPressStop} style={styles.playbackButton}>
              <Foundation name="stop" color="white" size={50} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressPlayPause} style={styles.playbackButton}>
              <Ionicons name={this.state.paused ? "md-play" : "md-pause"} color="white" size={50} />
            </TouchableOpacity>
          </View>
          <View style={styles.playbackBarContainer}>
            <View style={styles.circle} />
            <View style={styles.playbackBar}>
              <Animated.View style={styles.completedPlaybackBar} />
            </View>
          </View>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 20
    },
    scrollContainer: {
      paddingVertical: 20,
      backgroundColor: tuesdaysBlue
    },
    playbackButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 20
    },
    playbackButton: {
      paddingHorizontal: 15
    },
    square: {
      width: 160,
      height: 100,
      backgroundColor: 'grey',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'white',
      borderWidth: 1
    },
    rowContainer: {
      paddingHorizontal: 30,
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    squareText: {
      color: 'red'
    },
    comedianText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 24,
      paddingBottom: 20
    },
    playbackContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20
    },
    playbackBar: {
      backgroundColor: 'white',
      height: 6,
    },
    completedPlaybackBar: {
      position: 'absolute',
      height: 6,
      top: 0,
      left: 0,
      backgroundColor: 'grey'
    },
    circle: {
      height: 20,
      width: 20  ,
      borderRadius: 10,
      backgroundColor: 'grey',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 5,
      transform: [
        { translateX: 5 } // translate with animated value
      ]
    },
    playbackBarContainer: {
      height: 10,
      justifyContent: 'center'
    }
  })
  
import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from "react-native"
import { NavigationProps, tuesdaysBlue } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'
import { markGridProps, joeGridProps } from "../grids"
import { Foundation, Ionicons } from '@expo/vector-icons'
import _ from "lodash"
import { observer } from 'mobx-react'
import { observable, reaction, computed } from 'mobx'

@observer
export default class SoundGrid extends React.Component<NavigationProps> {
  static navigationOptions = {
    headerStyle: { 
      backgroundColor: tuesdaysBlue
    },
    headerTintColor: 'white'
  }

  @observable
  playingSound = null

  comedian: string = this.props.navigation.getParam('comedian')

  gridProps = this.comedian === 'Joe List'
    ? joeGridProps
    : markGridProps

  onPressStop = () => this.playingSound = null

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
                    const onPress = (sound: Audio.Sound) => this.playingSound = sound
                    return <Square key={index} sound={props.sound} text={props.text} onPress={onPress} />
                  })
                }
              </View>
            ))
          }
          <PlaybackButtons sound={this.playingSound} onPressStop={this.onPressStop} />
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
  
  class Square extends React.Component<SquareProps> {
    sound = new Audio.Sound()
    played = false
  
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
      if (this.played) {
        this.sound.replayAsync()
      } else {
        this.sound.playAsync()
        this.played = true
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

  const CIRCLE_RADIUS = 10

  @observer
  class PlaybackButtons extends React.Component<PlaybackButtonsProps> {
    @observable
    paused = false

    @observable
    finished = false

    @observable
    audioLength = 0

    @observable
    circleX = new Animated.Value(10)

    @computed
    get showingPlayButton() {
      return this.paused || this.finished
    }

    reaction = reaction(
      () => this.props.sound,
      sound => this.getAudioLength(sound)
    )

    componentDidMount() {
      this.getAudioLength(this.props.sound)
    }

    onPressStop = () => {
      this.props.onPressStop()
      this.props.sound.stopAsync()
      this.circleX.setValue(0)
    }

    onPressPause = () => {
      this.props.sound.pauseAsync()
      this.paused = true
      this.circleX.stopAnimation(value => this.circleX.setValue(value))
    }

    onPressPlay = () => {
      if (this.paused) {

      } else if (this.finished) {
        this.finished = false
        this.props.sound.replayAsync()
        this.animateBar()
      } else {
        this.circleX.setValue(0)
        this.props.sound.playAsync()
      }
    }

    onPressPlayPause = () => {
      if (this.showingPlayButton) {
        this.onPressPlay()
      } else {
        this.onPressPause()
      }
      //this.paused = !this.paused
    }

    animateBar = () => {
      Animated.timing(
        this.circleX,
        {
          toValue: Dimensions.get('screen').width - 40,
          duration: this.audioLength
        }
      ).start()
      setInterval(() => {
        this.circleX.setValue(0)
        this.finished = true // it isn't really paused, so use a different var here
        this.paused = false
      }, this.audioLength)
    }

    getAudioLength = (sound: Audio.Sound) => {
      if (!_.isNil(sound)) {
        sound.getStatusAsync()
          .then(status => {
            if (status.isLoaded) {
              this.audioLength = status.durationMillis
              this.animateBar()
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
              <Ionicons name={this.showingPlayButton ? "md-play" : "md-pause"} color="white" size={50} />
            </TouchableOpacity>
          </View>
          <View style={styles.playbackBarContainer}>
            <Animated.View style={[styles.circle, { transform: [{ translateX: this.circleX }] }]} />
            <View style={styles.playbackBar}>
              <Animated.View style={[styles.completedPlaybackBar, { width: Animated.add(this.circleX, CIRCLE_RADIUS) }]} />
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
      height: CIRCLE_RADIUS * 2,
      width: CIRCLE_RADIUS * 2  ,
      borderRadius: CIRCLE_RADIUS,
      backgroundColor: 'grey',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 5
    },
    playbackBarContainer: {
      height: 10,
      justifyContent: 'center'
    }
  })
  
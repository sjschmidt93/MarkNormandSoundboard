import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from "react-native"
import { NavigationProps, tuesdaysBlue, MuteButton } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'
import { markGridProps, joeGridProps } from "../grids"
import { Foundation, Ionicons } from '@expo/vector-icons'
import _ from "lodash"
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx'
import { SoundStore } from "../SoundStore"
import SocialRow from "../components/SocialRow"

export interface SoundStoreProp {
  soundStore: SoundStore
}

export enum Comedian {
  JOE = 'Joe',
  MARK = 'Mark'
}

@inject('soundStore')
@observer
export default class SoundGrid extends React.Component<NavigationProps & SoundStoreProp> {
  static navigationOptions = {
    headerStyle: { 
      backgroundColor: tuesdaysBlue
    },
    headerTintColor: 'white'
  }

  @computed
  get comedian() {
    return this.props.navigation.getParam('comedian')
  }

  @computed
  get gridProps() {
    return this.comedian === Comedian.MARK ? markGridProps : joeGridProps
  }

  onPressStop = () => this.props.soundStore.stop()

  render () {
    return (
      <View style={{ flex : 1 }}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: PLAYBACK_BUTTONS_HEIGHT }}>
          <View style={styles.container}>
            <Text style={styles.comedianText}>{this.comedian}</Text>
            <SocialRow comedian={this.comedian} />
            {
              this.gridProps.map((gridProps, index) => (
                <View key={index} style={styles.rowContainer}>
                  { 
                    gridProps.map((props, index) => 
                      <Square key={index} sound={props.sound} text={props.text} />
                    )
                  }
                </View>
              ))
            }
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PlaybackButtons />
        </View>
      </View>
    )
  }
}
  
export interface SquareProps {
  sound: PlaybackSource
  text: String
}

@inject('soundStore')
@observer
class Square extends React.Component<SquareProps & SoundStoreProp> {
  sound = new Audio.Sound()
  duration = 0
  played = false

  componentDidMount() {
    this.loadAudio()
  }

  loadAudio = async () => {
    try {
      await this.sound.loadAsync(this.props.sound)
      this.sound.getStatusAsync()
        .then(status => {
          if (status.isLoaded) {
            this.duration = status.durationMillis
          }
        })
    } catch (error) {
      console.warn('Failed to to load' + this.props.sound)
    }
  }

  onPress = () => {
    this.props.soundStore.stop()

    this.props.soundStore.duration = this.duration

    this.props.soundStore.animateBar()
    if (this.played) {
      this.props.soundStore.replay(this.sound)
    } else {
      this.props.soundStore.play(this.sound)
      this.played = true
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

const CIRCLE_RADIUS = 10
const SCREEN_WIDTH = Dimensions.get('screen').width
const ANIMATION_END_VALUE = SCREEN_WIDTH - 100 - CIRCLE_RADIUS
const PLAYBACK_BUTTONS_HEIGHT = 100
const PLAYBACK_BUTTON_SIZE = 30

@inject('soundStore')
@observer
class PlaybackButtons extends React.Component<SoundStoreProp> {
  @observable
  finished = false

  animationStopValue = -1

  @observable
  circleX = new Animated.Value(0)

  componentDidMount() {
    this.props.soundStore.animateBar = this.animateBar
  }

  @computed
  get showingPlayButton() {
    return this.props.soundStore.isPaused || this.finished
  }

  onPressStop = () => {
    this.props.soundStore.stop()
    this.circleX.setValue(0)
  }

  onPressPause = () => {
    this.props.soundStore.pause(() => {
      this.circleX.stopAnimation(value => {
        this.circleX.setValue(value)
        this.animationStopValue = value
      })
    })
  }

  onPressPlay = () => {
    if (this.props.soundStore.isPaused) {
      this.unpause()
    } else {
      this.replay()
    }
  }

  replay = () => {
    this.finished = false
    this.props.soundStore.replay(null, () => this.finished = false)
  }

  unpause = () => {
    this.props.soundStore.unpause(() => {
      Animated.timing(
        this.circleX,
        {
          toValue: ANIMATION_END_VALUE,
          duration: this.props.soundStore.duration * (1 - this.animationStopValue / ANIMATION_END_VALUE)
        }
      ).start(result => this.finished = result.finished)
    })
  }

  onPressPlayPause = () => {
    if (this.showingPlayButton) {
      this.onPressPlay()
    } else {
      this.onPressPause()
    }
  }

  animateBar = () => {
    this.finished = false
    this.circleX.setValue(0)
    Animated.timing(
      this.circleX,
      {
        toValue: ANIMATION_END_VALUE,
        duration: this.props.soundStore.duration
      }
    ).start(result => this.finished = result.finished)
  }

  render() {
    if (this.props.soundStore.isSoundNil) {
      return null
    }

    return (
      <View style={styles.playbackContainer}>
        <View style={styles.playbackButtonsContainer}>
          <MuteButton containerStyle={styles.playbackButton} size={PLAYBACK_BUTTON_SIZE} />
          <TouchableOpacity onPress={this.onPressStop} style={styles.playbackButton}>
            <Foundation name="stop" color="white" size={PLAYBACK_BUTTON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressPlayPause} style={styles.playbackButton}>
            <Ionicons name={this.showingPlayButton ? "md-play" : "md-pause"} color="white" size={PLAYBACK_BUTTON_SIZE} />
          </TouchableOpacity>
        </View>
        <View style={styles.playbackBarContainer}>
          <Animated.View style={[styles.circle, { transform: [{ translateX: this.circleX }] }]} />
          <View style={styles.playbackBar} />
          <Animated.View style={[styles.completedPlaybackBar, { width: Animated.add(this.circleX, CIRCLE_RADIUS) }]} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    flex: 1
  },
  scrollContainer: {
    paddingVertical: 20,
    backgroundColor: tuesdaysBlue,
    flex: 1
  },
  playbackButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20
  },
  playbackButton: {
    paddingHorizontal: 10
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
    paddingVertical: 20,
    backgroundColor: 'rgb(174,174,178)',
    marginHorizontal: 30,
    position: 'absolute',
    bottom: 5,
    width: SCREEN_WIDTH - 60,
    height: PLAYBACK_BUTTONS_HEIGHT,
    borderRadius: 10
  },
  playbackBar: {
    backgroundColor: 'white',
    height: 4,
    borderRadius: 10
  },
  completedPlaybackBar: {
    position: 'absolute',
    height: 10,
    top: 0,
    left: 0,
    backgroundColor: 'grey',
    borderRadius: 10
  },
  circle: {
    height: CIRCLE_RADIUS * 2,
    width: CIRCLE_RADIUS * 2  ,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: 'grey',
    position: 'absolute',
    left: 0,
    zIndex: 5
  },
  playbackBarContainer: {
    height: 10,
    justifyContent: 'center'
  }
})
  
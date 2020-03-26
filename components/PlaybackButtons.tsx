import { inject, observer } from "mobx-react"
import { Animated, View, TouchableOpacity, Dimensions, StyleSheet, Text } from "react-native"
import { observable, computed, reaction } from "mobx"
import React from "react"
import { SoundStoreProp } from "../screens/SoundGrid"
import { MuteButton } from "../screens/CharacterSelect"
import { Foundation, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export const PLAYBACK_BUTTONS_HEIGHT = 120

const DIMENSIONS = Dimensions.get('screen')
const SCREEN_WIDTH = DIMENSIONS.width
const CIRCLE_RADIUS = 10
const ANIMATION_END_VALUE = SCREEN_WIDTH - 100 - CIRCLE_RADIUS
const PLAYBACK_BUTTON_SIZE = 30
const BOTTOM_FINAL = 5
const BOTTOM_INITIAL = -(BOTTOM_FINAL + PLAYBACK_BUTTONS_HEIGHT)

const GRADIENT_COLOR_ONE = '#28313B'
const GRADIENT_COLOR_TWO = '#485461'

@inject('soundStore')
@observer
export default class PlaybackButtons extends React.Component<SoundStoreProp> {
  @observable
  finished = false

  animationStopValue = -1

  @observable
  circleX = new Animated.Value(0)

  @observable
  bottom = new Animated.Value(BOTTOM_INITIAL)

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

  reaction = reaction(
    () => this.props.soundStore.isSoundNil,
    isSoundNil => Animated.timing(
      this.bottom,
      {
        toValue: isSoundNil ? BOTTOM_INITIAL : BOTTOM_FINAL
      }
    ).start()
  )

  render() {
    return (
      <Animated.View style={{ position: 'absolute', bottom: this.bottom }}>
        <LinearGradient
          start={[0, 1]}
          end={[1, 0]}
          style={styles.playbackContainer}
          colors={[GRADIENT_COLOR_ONE, GRADIENT_COLOR_TWO]}
        >
          <Text style={styles.playbackContainerText}>{this.props.soundStore.soundText}</Text>
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
        </LinearGradient>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute'
  },
  playbackContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgb(174,174,178)',
    marginHorizontal: 30,
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
  playbackButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20
  },
  playbackButton: {
    paddingHorizontal: 10
  },
  playbackContainerText: {
    textAlign: 'center',
    color: 'white'
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

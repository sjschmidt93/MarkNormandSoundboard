import { observable, action, computed } from "mobx"
import { Audio } from "expo-av"
import _ from "lodash"
import { PlaybackStatus } from "expo-av/build/AV"

export class SoundStore {
  @observable
  private _sound: Audio.Sound = null

  @observable
  duration = 0

  @observable
  private _isMuted = false

  @observable
  private _isPaused = false

  @action
  play = (sound: Audio.Sound = null) => {
    if (!_.isNil(sound)) {
      this._sound = sound
    }

    this._sound.playAsync()
  }

  @action
  replay = (sound: Audio.Sound = null) => {
    if (!_.isNil(sound)) {
      this._sound = sound
    }

    this._sound.replayAsync()
  }

  @action
  toggleMute = () => {
    this._isMuted = !this._isMuted
    this._sound.setIsMutedAsync(this._isMuted)
  }

  stop = () => {
    if (!_.isNil(this._sound)) {
      this._isPaused = false
      this._sound.stopAsync()
      this._sound = null
    }
  }

  pause = (callback: () => void) => {
    this._sound.pauseAsync()
      .then(status => {
        if (status.isLoaded) {
          this._isPaused = true
          callback()
        }
      })
      .catch(e => console.warn('Error pausing sound'))
  }

  unpause = (callback: () => void) => {
    if (this._isPaused) {
      this._sound.playAsync()
        .then(status => {
          if (status.isLoaded) {
            this._isPaused = false
            callback()
          }
        })
        .catch(e => console.warn('Error pausing sound'))
    } else {
      console.warn('Called SoundStore.unpause when _sound was not paused')
    }
  }

  @computed
  get isSoundNil() {
    return _.isNil(this._sound)
  }

  @computed
  get isMuted() {
    return this._isMuted
  }

  @computed
  get isPaused() {
    return this._isPaused
  }

  animateBar: () => void = null
}

const soundStore = new SoundStore()
export default soundStore
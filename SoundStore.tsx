import { observable, action, computed } from "mobx"
import { Audio } from "expo-av"
import _ from "lodash"

export class SoundStore {
  @observable
  private _sound: Audio.Sound = null

  @observable
  duration = 0

  @observable
  private _isMuted = false

  @action
  toggleMute = () => {
    this._isMuted = !this._isMuted
    this._sound.setIsMutedAsync(this._isMuted)
  }

  @action
  replay = (sound: Audio.Sound) => {
    this._sound = sound
    sound.replayAsync()
  }

  stop = () => {
    if (!_.isNil(this._sound)) {
      this._sound.stopAsync()
      this._sound = null
    }
  }

  pause = () => {
    this._sound.pauseAsync()
  }

  play = (sound: Audio.Sound = null) => {
    if (!_.isNil(sound)) {
      this._sound = sound
    }

    this._sound.playAsync()
  }

  @computed
  get isMuted() {
    return this._isMuted
  }

  @computed
  get sound() {
    return this._sound
  }

  animateBar: () => void = null
}

const soundStore = new SoundStore()
export default soundStore
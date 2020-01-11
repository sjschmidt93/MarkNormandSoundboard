import { observable, action, computed } from "mobx"
import { Audio } from "expo-av"
import _ from "lodash"

export class SoundStore {
  @observable
  private sound: Audio.Sound = null

  @observable
  duration = 0

  @observable
  private _isMuted = false

  @action
  toggleMute = () => {
    this._isMuted = !this._isMuted
    this.sound.setIsMutedAsync(this._isMuted)
  }

  @action
  playAndSet = (sound: Audio.Sound) => {
    this.sound = sound
    sound.playAsync()
  }

  replay = (sound: Audio.Sound) => {
    sound.replayAsync()
  }

  stop = () => {
    if (!_.isNil(this.sound)) {
      this.sound.stopAsync()
      this.sound = null
    }
  }

  pause = () => {
    this.sound.pauseAsync()
  }

  play = () => {
    this.sound.playAsync()
  }

  @computed
  get isMuted() {
    return this._isMuted
  }

  animateBar: () => void = null
}

const soundStore = new SoundStore()
export default soundStore
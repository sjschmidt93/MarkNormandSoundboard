import { observable, action } from "mobx"
import { Audio } from "expo-av"

export class SoundStore {
  @observable
  sound: Audio.Sound = null

  @observable
  duration = 0

  @observable
  playing = false

  @observable
  muted = false

  @action
  toggleMute = () => {
    this.muted = !this.muted
    this.sound.setIsMutedAsync(this.muted)
  }

  //soundAssignmentCall: () => void = null
}

const soundStore = new SoundStore()
export default soundStore
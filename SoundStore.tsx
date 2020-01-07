import { observable } from "mobx";
import { Audio } from "expo-av";

export class SoundStore {
  @observable
  sound: Audio.Sound = null

  @observable
  duration = 0

  @observable
  playing = false

  soundAssignmentCall: () => void = null

}

const soundStore = new SoundStore()
export default soundStore
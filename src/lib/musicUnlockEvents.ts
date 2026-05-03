/** Dispatched from BootScreen capture-phase pointerdown — keeps audio.play() on real user gesture stack */
export const VLGR_BOOT_AUDIO_TRY = 'vlgr-boot-audio-try'

export function dispatchBootAudioTry(): void {
  window.dispatchEvent(new Event(VLGR_BOOT_AUDIO_TRY))
}

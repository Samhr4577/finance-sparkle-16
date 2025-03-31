
// Define audio files
const audioFiles = {
  transaction: "/sounds/transaction.mp3",
  notification: "/sounds/notification.mp3",
  error: "/sounds/error.mp3",
  success: "/sounds/success.mp3"
};

// Cache audio elements
const audioCache: Record<string, HTMLAudioElement> = {};

// Preload sounds
export const preloadSounds = () => {
  Object.entries(audioFiles).forEach(([key, src]) => {
    try {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioCache[key] = audio;
    } catch (error) {
      console.error(`Failed to preload sound: ${key}`, error);
    }
  });
};

// Play a sound effect
export const playSoundEffect = (
  sound: keyof typeof audioFiles,
  volume = 0.5
) => {
  try {
    // Use cached audio if available
    let audio = audioCache[sound];
    
    // Create new audio if not cached
    if (!audio) {
      audio = new Audio(audioFiles[sound]);
      audioCache[sound] = audio;
    }
    
    // Reset audio to beginning if already playing
    audio.currentTime = 0;
    audio.volume = volume;
    
    // Play the sound
    const playPromise = audio.play();
    
    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  } catch (error) {
    console.error(`Failed to play sound: ${sound}`, error);
  }
};

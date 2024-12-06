const playSound = async (soundUrl: string, volume: number = 0.7) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  } catch (error) {
    console.error("Error creating audio:", error);
  }
};

export const playSounds = {
  click: () => playSound("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/click.mp3"),
  bet: () => playSound("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/apostar.mp3"),
  recharge: () => playSound("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/recarga.mp3"),
  error: () => playSound("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/error.mp3", 0.5),
  coin: () => playSound("https://mwdaxgwuztccxfgbusuj.supabase.co/storage/v1/object/public/sounds/multi-coin.mp3")
};
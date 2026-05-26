import { useCallback } from "react";

export const useNotificationSound = () => {
    const playNotificationSound = useCallback(() => {
        // Create audio context and play a loud multi-tone notification sound for 30 seconds
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);

            // Enhanced notification with higher volume and multiple tones
            const beepDuration = 0.15; // 150ms per beep for more prominence
            const gap = 0.08; // 80ms gap between beeps
            const highVolume = 0.7; // Increased volume for better audibility
            const totalDuration = 30; // 30 seconds total sound duration
            const patternDuration = beepDuration + gap + beepDuration + gap + beepDuration + gap + beepDuration + gap; // ~0.74 seconds
            
            let currentTime = audioContext.currentTime;
            const endTime = currentTime + totalDuration;

            // Repeat the beep pattern for 30 seconds
            while (currentTime < endTime) {
                const now = currentTime;

                // Tone 1 - High frequency beep (1200 Hz)
                const osc1 = audioContext.createOscillator();
                osc1.connect(gainNode);
                osc1.frequency.value = 1200;
                osc1.type = "sine";
                gainNode.gain.setValueAtTime(highVolume, now);
                osc1.start(now);
                osc1.stop(now + beepDuration);

                // Tone 2 - Mid frequency beep (1000 Hz)
                const osc2 = audioContext.createOscillator();
                osc2.connect(gainNode);
                osc2.frequency.value = 1000;
                osc2.type = "sine";
                const start2 = now + beepDuration + gap;
                gainNode.gain.setValueAtTime(highVolume, start2);
                osc2.start(start2);
                osc2.stop(start2 + beepDuration);

                // Tone 3 - Lower frequency beep (800 Hz)
                const osc3 = audioContext.createOscillator();
                osc3.connect(gainNode);
                osc3.frequency.value = 800;
                osc3.type = "sine";
                const start3 = start2 + beepDuration + gap;
                gainNode.gain.setValueAtTime(highVolume, start3);
                osc3.start(start3);
                osc3.stop(start3 + beepDuration);

                // Tone 4 - Highest frequency beep for extra prominence (1400 Hz)
                const osc4 = audioContext.createOscillator();
                osc4.connect(gainNode);
                osc4.frequency.value = 1400;
                osc4.type = "sine";
                const start4 = start3 + beepDuration + gap;
                gainNode.gain.setValueAtTime(highVolume, start4);
                osc4.start(start4);
                osc4.stop(start4 + beepDuration);
                gainNode.gain.setValueAtTime(0, start4 + beepDuration);

                // Move to next pattern repetition
                currentTime += patternDuration;
            }
        } catch (error) {
            console.error("Error playing notification sound:", error);
        }
    }, []);

    return { playNotificationSound };
};

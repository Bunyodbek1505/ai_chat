"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function VoiceChat({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSendVoiceMessage?: (audioBlob: Blob) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const visualize = () => {
      if (!analyserRef.current) return;
      const analyser = analyserRef.current;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const loop = () => {
        animationFrameIdRef.current = requestAnimationFrame(loop);
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioLevel(average);
      };
      loop();
    };

    const startRecording = async () => {
      // --- MUHIM O'ZGARISH: BU YERDA TEKSHIRAMIZ ---
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error(
          "Mikrofon (getUserMedia) bu brauzerda yoki xavfsiz bo'lmagan (HTTP) muhitda qo'llab-quvvatlanmaydi."
        );
        alert(
          "Mikrofonni ishlatish uchun saytni HTTPS orqali oching yoki localhost'dan foydalaning."
        );
        setIsRecording(false);
        return;
      }
      // --- TEKSHIRUV TUGADI ---

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        visualize();
      } catch (err) {
        console.error("Mikrofonga ruxsat berilmadi:", err);
        setIsRecording(false);
      }
    };

    const stopRecording = () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
      setAudioLevel(0);
    };

    if (isOpen && isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isOpen, isRecording]);

  if (!isOpen) return null;

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-[#00071C] z-50 flex flex-col items-center justify-center text-white">
      {/* ANIMATION GIF */}
      <div className="absolute top-0">
        <Image
          src="https://cdn.dribbble.com/userupload/24087657/file/original-94d180707ef3b05419ec4666226a6e0d.gif"
          alt="voice-anim"
          width={608}
          height={508}
          className="rounded-full shadow-2xl"
          style={{
            transform: `scale(${1 + audioLevel / 250})`,
            transition: "transform 0.1s ease-out",
          }}
        />
      </div>

      {/* FOOTER CONTROLS */}
      <div className="absolute bottom-8 ">
        <div className="flex items-center gap-6">
          <button
            onClick={handleToggleRecording}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border border-white/20 cursor-pointer ${
              isRecording
                ? "bg-blue-600/80 hover:bg-blue-600"
                : "bg-red-600/80 hover:bg-red-600"
            }`}
          >
            {/* --- IKONKA MANTIG'I TO'G'RILANDI --- */}
            <Icon
              icon={isRecording ? "mdi:microphone" : "mdi:microphone-off"}
              className="w-6 h-6 text-white"
            />
          </button>

          <button
            onClick={onClose}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center cursor-pointer"
          >
            <Icon icon="mdi:close" className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

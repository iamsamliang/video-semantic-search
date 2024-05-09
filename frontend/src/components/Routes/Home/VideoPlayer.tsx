import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  videoURL: string;
  timestamp: number;
  trigger: number;
};

export default function VideoPlayer({
  videoURL,
  timestamp,
  trigger,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  }, [timestamp, trigger]);

  return (
    <video
      ref={videoRef}
      src={videoURL}
      controls
      width="640"
      height="480"
    ></video>
  );
}

"use client";

import QueryBar from "@/components/Routes/Home/QueryBar";
import VideoPlayer from "@/components/Routes/Home/VideoPlayer";
import VideoUploader from "@/components/Routes/Home/VideoUploader";
import { useState } from "react";

export default function Home() {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoNamespace, setVideoNamespace] = useState<string | null>(
    null
  );

  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [trigger, setTrigger] = useState<number>(-1);

  function handleUploaded(url: string, namespace: string) {
    setVideoURL(url);
    setVideoNamespace(namespace);
  }

  function changeTrigger() {
    setTrigger(trigger + 1);
  }

  return (
    <section className="flex flex-col justify-center items-center mt-5 gap-5">
      <VideoUploader videoURL={videoURL} onUploaded={handleUploaded} />

      {videoURL && videoNamespace && (
        <div className="flex w-full justify-center items-center mt-8">
          <QueryBar
            namespace={videoNamespace}
            setTimestamps={setTimestamps}
            changeTrigger={changeTrigger}
          />
        </div>
      )}
      {videoURL && (
        <VideoPlayer
          videoURL={videoURL}
          timestamp={timestamps[0]}
          trigger={trigger}
        />
      )}
      {trigger !== -1 && (
        <>
          <div>Jumped to second {timestamps[0]} in video</div>
          {timestamps.map((timestamp, index) => {
            if (index != 0) {
              return (
                <div key={index}>
                  Other timestamps: {timestamp} seconds
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </section>
  );
}

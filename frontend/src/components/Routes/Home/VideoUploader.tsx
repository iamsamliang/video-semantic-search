import LoadingIcon from "@/components/LoadingIcon";
import { UploadResponse } from "@/types/uploadResponse";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type VideoUploaderInputs = {
  video: FileList;
};
type VideoUploaderProps = {
  onUploaded: (url: string, namespace: string) => void;
  videoURL: string | null;
};

export default function VideoUploader({
  onUploaded,
  videoURL,
}: VideoUploaderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoUploaderInputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<VideoUploaderInputs> = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    if (videoURL) URL.revokeObjectURL(videoURL);

    const file = data.video[0];
    const url = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("video", file); // "video" is the key expected on backend

    try {
      const response = await fetch(
        "http://localhost:8000/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error();

      const result: UploadResponse = await response.json();
      onUploaded(url, result.namespace);
    } catch (error) {
      setErrorMessage("Error Processing Video");
    }
    setIsLoading(false);
    reset();
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-10">
        Upload a Video to Perform Visual Semantic Search
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-6"
      >
        <input
          type="file"
          accept="video/*"
          className="flex items-center justify-center text-center w-[30%]"
          {...register("video", { required: true })}
        />
        {isLoading ? (
          <LoadingIcon className="w-7 h-7" />
        ) : (
          <button className="p-3 rounded-md bg-blue-500" type="submit">
            Upload Video
          </button>
        )}

        {errors.video && (
          <p className="text-red-600">*Video file is required.</p>
        )}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      </form>
    </div>
  );
}

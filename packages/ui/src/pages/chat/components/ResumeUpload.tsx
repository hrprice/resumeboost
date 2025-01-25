import UploadIcon from "@material-symbols/svg-400/rounded/upload_file-fill.svg?react";
import { useRef } from "react";
import Text from "@resume-optimizer/ui/components/Text";

const ResumeUpload = ({
  setResumeFile,
}: {
  setResumeFile: (set: File) => void;
}) => {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setResumeFile(droppedFiles[0]);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="border-dashed cursor-pointer border-[2px] rounded-2xl w-[600px] h-[300px] border-text-muted bg-gray-200 flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        accept="application/pdf"
        multiple={false}
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) setResumeFile(e.target.files[0]);
        }}
        className="hidden"
      />
      <div className="flex flex-col gap-2 items-center">
        <UploadIcon className="fill-text-muted size-20" />
        <Text variant="subtitle1" className="text-text-muted">
          Choose a file or drag it here
        </Text>
      </div>
    </div>
  );
};
export default ResumeUpload;

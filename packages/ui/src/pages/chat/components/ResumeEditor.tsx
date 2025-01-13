import Text from "@resume-optimizer/ui/components/Text";
import classNames from "classnames";
import { TextContent } from "@resume-optimizer/shared/socket-constants";

const TextDisplay = ({ content }: { content: TextContent[] }) => {
  return (
    <div className="bg-background w-full p-4" style={{ aspectRatio: 8.5 / 11 }}>
      {content.map(({ content: textContent, type }) => (
        <Text
          key={textContent.slice(10)}
          className={classNames(
            "whitespace-pre-wrap text-md transition-opacity",
            { "bg-accent/20": type === "updated" }
          )}
        >
          {textContent}
        </Text>
      ))}
    </div>
  );
};

const ResumeEditor = ({
  resumeTextContent,
}: {
  resumeTextContent: TextContent[][];
}) => {
  return (
    <div className="w-[65%] min-h-full border bg-secondary-light flex rounded-xl overflow-auto p-4 flex-col max-h-fit gap-4">
      <div className="flex-col flex h-fit gap-4">
        {resumeTextContent?.map((page) => (
          <TextDisplay key={page[0].content[0].slice(10)} content={page} />
        ))}
      </div>
    </div>
  );
};
export default ResumeEditor;

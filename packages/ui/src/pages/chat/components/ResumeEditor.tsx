import { getPDFText } from "@resume-optimizer/ui/utils/pdf-utils";
import { useCallback, useEffect, useState } from "react";
import { Buffer } from "buffer";
import Text from "@resume-optimizer/ui/components/Text";
import classNames from "classnames";

export interface ResumeUpdate {
  find: string;
  replace: string;
}

interface TextContent {
  content: string;
  type: "original" | "updated";
}

const TextDisplay = ({
  content,
  updates,
}: {
  content: string;
  updates: ResumeUpdate[] | undefined;
}) => {
  const [splitContent, setSplitContent] = useState<TextContent[]>([
    { content, type: "original" },
  ]);

  const updateTextContent = useCallback(
    (update: ResumeUpdate) => {
      const temp: TextContent[] = [];
      const { find, replace } = update;
      for (const item of splitContent) {
        const findIdx = item.content.toLowerCase().indexOf(find.toLowerCase());
        if (findIdx === -1) {
          temp.push(item);
        } else {
          const beg = item.content.slice(0, findIdx);
          const end = item.content.slice(findIdx + find.length);
          temp.push(
            { content: beg, type: item.type },
            { content: replace, type: "updated" },
            { content: end, type: item.type }
          );
        }
      }
      setSplitContent(temp);
    },
    [splitContent]
  );

  useEffect(() => {
    if (!updates) return;
    if (updates.length > 0) {
      updateTextContent(updates.at(-1)!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updates]);

  return (
    <div className="bg-background w-full p-4" style={{ aspectRatio: 8.5 / 11 }}>
      {splitContent.map(({ content: textContent, type }) => (
        <Text
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
  resumeFile,
  resumeUpdates,
}: {
  resumeFile: File | null;
  resumeUpdates: ResumeUpdate[];
}) => {
  const [resumeText, setResumeText] = useState<string[]>();

  useEffect(() => {
    if (!resumeFile) return;
    const getResumeBuffer = async () => {
      const resumeBuffer = await resumeFile.arrayBuffer();
      const PDFText = await getPDFText(Buffer.from(resumeBuffer)).then((text) =>
        text.map((content) => content.replace(/●/g, "•"))
      );
      setResumeText(PDFText);
    };
    getResumeBuffer();
  }, [resumeFile]);

  console.log(resumeText);

  return (
    <div className="w-[65%] min-h-full border bg-secondary-light flex rounded-xl overflow-auto p-4 flex-col max-h-fit gap-4">
      <div className="flex-col flex h-fit gap-4">
        {resumeText?.map((content) => (
          <TextDisplay
            key={content.slice(10)}
            updates={resumeUpdates}
            content={content}
          />
        ))}
      </div>
    </div>
  );
};
export default ResumeEditor;

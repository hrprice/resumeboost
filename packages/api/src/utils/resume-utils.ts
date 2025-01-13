import { ResumeUpdate, TextContent } from '@resume-optimizer/shared/socket-constants';

export const getUpdatedTextContent = (existingContent: TextContent[][], update: ResumeUpdate) => {
  const updated: TextContent[][] = [];
  const { find, replace } = update;
  for (const page of existingContent) {
    const current: TextContent[] = [];
    for (const item of page) {
      const findIdx = item.content.toLowerCase().indexOf(find.substring.toLowerCase());
      if (findIdx === -1) {
        current.push(item);
      } else {
        const beg = item.content.slice(0, findIdx);
        const end = item.content.slice(findIdx + find.substring.length);
        current.push(
          { content: beg, type: item.type },
          { content: replace, type: 'updated' },
          { content: end, type: item.type }
        );
      }
    }
    updated.push(current);
  }
  return updated;
};

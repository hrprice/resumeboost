import { flatMap, uniqBy } from 'lodash';

/**
 * This code was copied from https://github.com/Zachary-work/similar-substrin.
 * Licensed under the ISC License.
 *
 * Copyright (c) Zachary Lai
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

const isValid = (value: number) => {
  return value !== INVALID;
};

const INVALID = -1;

interface GridPosition {
  row: number;
  col: number;
}

interface Grid {
  value: number;
  position: GridPosition;
}

interface ResultRange {
  startIndex: number;
  endIndex: number;
}

interface SimilarSubstringResult {
  similarity: number;
  items: ResultItem[];
}

interface ResultItem {
  substring: string;
  range: ResultRange;
}

interface SimilarSubstringOption {
  debug: boolean;
}

/**
 * @example
 * // return [est]
 * simsilarSubstring("testing", "eat")
 * @param text {String} The text/paragraph input you want to perform the searching
 * @param pattern {String} The string pattern you are looking for in the text
 */
export const similarSubstring = (
  text: string,
  pattern: string,
  options: SimilarSubstringOption = { debug: false }
): SimilarSubstringResult | null => {
  if (text == null) {
    throw new Error('Invalid text input');
  }
  if (pattern == null) {
    throw new Error('Invalid pattern input');
  }
  if (text.length == 0) {
    return null;
  }
  const dp: number[][] = [];
  const numOfRow = pattern.length + 1;
  const numOfCol = text.length + 1;
  for (let row = 0; row < numOfRow; row++) {
    dp[row] = new Array(numOfCol);
    for (let col = 0; col < numOfCol; col++) {
      if (row == 0) {
        dp[row][col] = 0;
        continue;
      }
      if (col == 0) {
        dp[row][col] = row;
        continue;
      }
      const top: number = dp[row - 1][col];
      const left: number = dp[row][col - 1];
      const topLeft: number = dp[row - 1][col - 1];
      const base = Math.min(top, left, topLeft);
      const current = text.charAt(col - 1) === pattern.charAt(row - 1) ? 0 : 1;
      dp[row][col] = base + current;
    }
  }

  if (options.debug) {
    console.table(dp);
  }

  const minDistance: number = Math.min(...dp[numOfRow - 1]);
  const minDistanceCols = dp[numOfRow - 1].reduce((acc: number[], distance: number, index: number) => {
    if (distance === minDistance) {
      acc.push(index);
    }
    return acc;
  }, []);

  const traceResult: GridPosition[][] = flatMap(minDistanceCols, (col) => {
    return _trace([], dp, numOfRow - 1, col);
  });

  const paths: number[][] = traceResult.map((path: GridPosition[]) => {
    return path.map((position) => position.col);
  });

  const clearRanges = paths
    .map((path) => [path[0], path[path.length - 1]])
    .filter((range) => range[1] >= range[0])
    .filter((range) => text.length >= range[0]);
  const uniqRanges = uniqBy(clearRanges, (range) => range.toString());

  const items: ResultItem[] = uniqRanges.map((range: number[]) => {
    let word = '';
    for (let i = range[0] - 1; i <= range[1] - 1; i++) {
      word = word.concat(text.charAt(i));
    }
    return {
      substring: word,
      range: {
        startIndex: range[0] - 1,
        endIndex: range[1] - 1
      }
    };
  });
  return {
    similarity: (pattern.length - minDistance) / pattern.length,
    items
  };
};

const _trace = (mem: GridPosition[][][][], dp: number[][], row: number, col: number): GridPosition[][] => {
  if (row == 0) {
    return [[]];
  }
  if (col == 0) {
    return [[]];
  }
  if (mem[row] != null && mem[row][col] != null) {
    return mem[row][col];
  }
  const top: Grid = { value: dp[row - 1][col], position: { row: row - 1, col: col } };
  const left: Grid = { value: col > 0 ? dp[row][col - 1] : INVALID, position: { row: row, col: col - 1 } };
  const topLeft: Grid = {
    value: row > 0 && col > 0 ? dp[row - 1][col - 1] : INVALID,
    position: { row: row - 1, col: col - 1 }
  };
  const factors: Grid[] = [top, left, topLeft].filter((factor) => isValid(factor.value));
  const min = Math.min(...factors.map((factor) => factor.value));
  const minFactors: Grid[] = factors.filter((factor) => factor.value === min);

  const result: GridPosition[][] = flatMap(minFactors, (factor: Grid) => {
    const paths: GridPosition[][] = _trace(mem, dp, factor.position.row, factor.position.col);
    return paths.map((path: GridPosition[]) => {
      return [...path, { row, col }];
    });
  });
  if (mem[row] == null) {
    mem[row] = [];
  }
  mem[row][col] = result;

  return result;
};

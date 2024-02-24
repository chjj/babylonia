"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = visualize;
var _traceMapping = require("@jridgewell/trace-mapping");
const CONTEXT_SIZE = 4;
const LOC_SIZE = 10;
const CONTENT_SIZE = 15;
const padStart = "".padStart ? Function.call.bind("".padStart) : (str, len, pad) => pad.repeat(Math.max(0, len - str.length)) + str;
const padEnd = "".padStart ? Function.call.bind("".padEnd) : (str, len, pad) => str + pad.repeat(Math.max(0, len - str.length));
function simpleCodeFrameRange(lines, line, colStart, colEnd) {
  colEnd = Math.min(colEnd, lines[line - 1].length);
  const start = Math.max(colStart - CONTEXT_SIZE, 0);
  const end = Math.min(colEnd + CONTEXT_SIZE, lines[line - 1].length);
  const markerSize = colEnd - colStart;
  const marker = markerSize === 0 ? "><" : " " + "^".repeat(markerSize);
  const markerPadding = colStart - start - 1;
  const code = lines[line - 1].slice(start, end);
  const loc = padStart(`(${line}:${colStart}-${colEnd}) `, LOC_SIZE, " ");
  return loc + code + "\n" + " ".repeat(markerPadding + loc.length) + marker;
}
function joinMultiline(left, right, leftLen) {
  var _leftLen;
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  (_leftLen = leftLen) != null ? _leftLen : leftLen = leftLines.reduce((len, line) => Math.max(len, line.length), 0);
  const linesCount = Math.max(leftLines.length, rightLines.length);
  let res = "";
  for (let i = 0; i < linesCount; i++) {
    if (res !== "") res += "\n";
    if (i < leftLines.length) res += padEnd(leftLines[i], leftLen, " ");else res += " ".repeat(leftLen);
    if (i < rightLines.length) res += rightLines[i];
  }
  return res;
}
function visualize(output, map) {
  const sourcesLines = new Map(map.sources.map((source, index) => [source, map.sourcesContent[index].split("\n")]));
  const outputLines = output.split("\n");
  const ranges = [];
  let prev = null;
  (0, _traceMapping.eachMapping)(new _traceMapping.TraceMap(map), mapping => {
    if (prev === null) {
      prev = mapping;
      return;
    }
    const original = {
      from: {
        line: prev.originalLine,
        column: prev.originalColumn
      },
      to: {
        line: mapping.originalLine,
        column: mapping.originalColumn
      }
    };
    const generated = {
      from: {
        line: prev.generatedLine,
        column: prev.generatedColumn
      },
      to: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      }
    };
    if (original.from.line !== original.to.line) {
      original.to.line = original.from.line;
      original.to.column = Infinity;
    } else if (original.to.column < original.from.column) {
      original.to.column = original.from.column;
    }
    if (generated.from.line !== generated.to.line) {
      generated.to.line = generated.from.line;
      generated.to.column = Infinity;
    } else if (generated.to.column < generated.from.column) {
      generated.to.column = generated.from.column;
    }
    ranges.push({
      original,
      generated,
      source: prev.source
    });
    prev = mapping;
  });
  if (prev.originalLine) {
    ranges.push({
      original: {
        from: {
          line: prev.originalLine,
          column: prev.originalColumn
        },
        to: {
          line: prev.originalLine,
          column: Infinity
        }
      },
      generated: {
        from: {
          line: prev.generatedLine,
          column: prev.generatedColumn
        },
        to: {
          line: prev.generatedLine,
          column: Infinity
        }
      },
      source: prev.source
    });
  }
  for (let i = ranges.length - 1; i >= 0; i--) {
    const {
      original
    } = ranges[i];
    if (original.from.column === original.to.column && original.to.column < ranges[i + 1].original.to.column) {
      original.to.column = ranges[i + 1].original.to.column;
    }
  }
  const res = ranges.map(({
    original,
    generated,
    source
  }) => {
    const input = simpleCodeFrameRange(sourcesLines.get(source), original.from.line, original.from.column, original.to.column);
    const output = simpleCodeFrameRange(outputLines, generated.from.line, generated.from.column, generated.to.column);
    return joinMultiline(joinMultiline(input, " <--  ", LOC_SIZE + CONTEXT_SIZE * 2 + CONTENT_SIZE), output);
  });
  return res.join("\n\n");
}

//# sourceMappingURL=source-map-visualizer.js.map

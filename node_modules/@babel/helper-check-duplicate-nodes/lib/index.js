"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkDuplicateNodes;
var _t = require("@babel/types");
const {
  VISITOR_KEYS
} = _t;
function checkDuplicateNodes(ast) {
  if (arguments.length !== 1) {
    throw new Error("checkDuplicateNodes accepts only one argument: ast");
  }
  const parentsMap = new Map();
  const hidePrivateProperties = (key, val) => {
    if (key[0] === "_") return "[Private]";
    return val;
  };
  const stack = [{
    node: ast,
    parent: null
  }];
  let item;
  while ((item = stack.pop()) !== undefined) {
    const {
      node,
      parent
    } = item;
    if (!node) continue;
    const keys = VISITOR_KEYS[node.type];
    if (!keys) continue;
    if (parentsMap.has(node)) {
      const parents = [parentsMap.get(node), parent];
      throw new Error("Do not reuse nodes. Use `t.cloneNode` (or `t.clone`/`t.cloneDeep` if using babel@6) to copy them.\n" + JSON.stringify(node, hidePrivateProperties, 2) + "\nParent:\n" + JSON.stringify(parents, hidePrivateProperties, 2));
    }
    parentsMap.set(node, parent);
    for (const key of keys) {
      const subNode = node[key];
      if (Array.isArray(subNode)) {
        for (const child of subNode) {
          stack.push({
            node: child,
            parent: node
          });
        }
      } else if (typeof subNode === "object" && subNode !== null) {
        stack.push({
          node: subNode,
          parent: node
        });
      }
    }
  }
}

//# sourceMappingURL=index.js.map

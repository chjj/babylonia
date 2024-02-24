"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushAccessor = pushAccessor;
exports.toDefineObject = toDefineObject;
var _core = require("@babel/core");
function pushAccessor(mutatorMap, node) {
  var _mutatorMap$alias;
  const alias = _core.types.toKeyAlias(node);
  const map = (_mutatorMap$alias = mutatorMap[alias]) != null ? _mutatorMap$alias : mutatorMap[alias] = {
    _inherits: [],
    _key: node.key
  };
  map._inherits.push(node);
  const value = _core.types.functionExpression(null, node.params, node.body, node.generator, node.async);
  value.returnType = node.returnType;
  _core.types.inheritsComments(value, node);
  map[node.kind] = value;
  return map;
}
function toDefineObject(mutatorMap) {
  const objExpr = _core.types.objectExpression([]);
  Object.keys(mutatorMap).forEach(function (mutatorMapKey) {
    const map = mutatorMap[mutatorMapKey];
    map.configurable = _core.types.booleanLiteral(true);
    map.enumerable = _core.types.booleanLiteral(true);
    const mapNode = _core.types.objectExpression([]);
    const propNode = _core.types.objectProperty(map._key, mapNode, map._computed);
    Object.keys(map).forEach(function (key) {
      const node = map[key];
      if (key[0] === "_") return;
      const prop = _core.types.objectProperty(_core.types.identifier(key), node);
      _core.types.inheritsComments(prop, node);
      _core.types.removeComments(node);
      mapNode.properties.push(prop);
    });
    objExpr.properties.push(propNode);
  });
  return objExpr;
}

//# sourceMappingURL=define-map.js.map

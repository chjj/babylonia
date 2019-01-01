"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = require("babylonia/helper-plugin-utils");

  _helperPluginUtils = function () {
    return data;
  };

  return data;
}

function _pluginSyntaxFlow() {
  const data = _interopRequireDefault(require("babylonia/plugin-syntax-flow"));

  _pluginSyntaxFlow = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require("babylonia/core");

  _core = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils().declare)(api => {
  api.assertVersion(7);

  function wrapInFlowComment(path, parent) {
    let attach = path.getPrevSibling();
    let where = "trailing";

    if (!attach.node) {
      attach = path.parentPath;
      where = "inner";
    }

    attach.addComment(where, generateComment(path, parent));
    path.remove();
  }

  function generateComment(path, parent) {
    let comment = path.getSource().replace(/\*-\//g, "*-ESCAPED/").replace(/\*\//g, "*-/");
    if (parent && parent.optional) comment = "?" + comment;
    if (comment[0] !== ":") comment = ":: " + comment;
    return comment;
  }

  return {
    name: "transform-flow-comments",
    inherits: _pluginSyntaxFlow().default,
    visitor: {
      TypeCastExpression(path) {
        const {
          node
        } = path;
        path.get("expression").addComment("trailing", generateComment(path.get("typeAnnotation")));
        path.replaceWith(_core().types.parenthesizedExpression(node.expression));
      },

      Identifier(path) {
        if (path.parentPath.isFlow()) {
          return;
        }

        const {
          node
        } = path;

        if (node.typeAnnotation) {
          const typeAnnotation = path.get("typeAnnotation");
          path.addComment("trailing", generateComment(typeAnnotation, node));
          typeAnnotation.remove();

          if (node.optional) {
            node.optional = false;
          }
        } else if (node.optional) {
          path.addComment("trailing", ":: ?");
          node.optional = false;
        }
      },

      AssignmentPattern: {
        exit({
          node
        }) {
          const {
            left
          } = node;

          if (left.optional) {
            left.optional = false;
          }
        }

      },

      Function(path) {
        if (path.isDeclareFunction()) return;
        const {
          node
        } = path;

        if (node.returnType) {
          const returnType = path.get("returnType");
          const typeAnnotation = returnType.get("typeAnnotation");
          const block = path.get("body");
          block.addComment("leading", generateComment(returnType, typeAnnotation.node));
          returnType.remove();
        }

        if (node.typeParameters) {
          const typeParameters = path.get("typeParameters");
          const id = path.get("id");
          id.addComment("trailing", generateComment(typeParameters, typeParameters.node));
          typeParameters.remove();
        }
      },

      ClassProperty(path) {
        const {
          node,
          parent
        } = path;

        if (!node.value) {
          wrapInFlowComment(path, parent);
        } else if (node.typeAnnotation) {
          const typeAnnotation = path.get("typeAnnotation");
          path.get("key").addComment("trailing", generateComment(typeAnnotation, typeAnnotation.node));
          typeAnnotation.remove();
        }
      },

      ExportNamedDeclaration(path) {
        const {
          node,
          parent
        } = path;

        if (node.exportKind !== "type" && !_core().types.isFlow(node.declaration)) {
          return;
        }

        wrapInFlowComment(path, parent);
      },

      ImportDeclaration(path) {
        const {
          node,
          parent
        } = path;

        if (node.importKind !== "type" && node.importKind !== "typeof") {
          return;
        }

        wrapInFlowComment(path, parent);
      },

      Flow(path) {
        const {
          parent
        } = path;
        wrapInFlowComment(path, parent);
      },

      Class(path) {
        const {
          node
        } = path;

        if (node.typeParameters) {
          const typeParameters = path.get("typeParameters");
          const block = path.get("body");
          block.addComment("leading", generateComment(typeParameters, typeParameters.node));
          typeParameters.remove();
        }
      }

    }
  };
});

exports.default = _default;
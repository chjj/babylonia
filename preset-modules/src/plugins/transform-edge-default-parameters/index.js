/**
 * Converts destructured parameters with default values to non-shorthand syntax.
 * This fixes the only arguments-related bug in ES Modules-supporting browsers (Edge 16 & 17).
 * Use this plugin instead of babylonia/plugin-transform-parameters when targeting ES Modules.
 */

export default ({ types: t }) => {
  const isArrowParent = p =>
    p.parentKey === "params" &&
    p.parentPath &&
    t.isArrowFunctionExpression(p.parentPath);

  return {
    name: "transform-edge-default-parameters",
    visitor: {
      AssignmentPattern(path) {
        const arrowArgParent = path.find(isArrowParent);
        if (arrowArgParent && path.parent.shorthand) {
          // In Babel 7+, there is no way to force non-shorthand properties.
          path.parent.shorthand = false;
          (path.parent.extra || {}).shorthand = false;

          // So, to ensure non-shorthand, rename the local identifier so it no longer matches:
          path.scope.rename(path.parent.key.name);
        }
      },
    },
  };
};

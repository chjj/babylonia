"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateMissingPluginMessage;
const pluginNameMap = {
  asyncDoExpressions: {
    syntax: {
      name: "babylonia/plugin-syntax-async-do-expressions",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-async-do-expressions"
    }
  },
  decimal: {
    syntax: {
      name: "babylonia/plugin-syntax-decimal",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-decimal"
    }
  },
  decorators: {
    syntax: {
      name: "babylonia/plugin-syntax-decorators",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-decorators"
    },
    transform: {
      name: "babylonia/plugin-proposal-decorators",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-decorators"
    }
  },
  doExpressions: {
    syntax: {
      name: "babylonia/plugin-syntax-do-expressions",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-do-expressions"
    },
    transform: {
      name: "babylonia/plugin-proposal-do-expressions",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-do-expressions"
    }
  },
  exportDefaultFrom: {
    syntax: {
      name: "babylonia/plugin-syntax-export-default-from",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-export-default-from"
    },
    transform: {
      name: "babylonia/plugin-proposal-export-default-from",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-export-default-from"
    }
  },
  flow: {
    syntax: {
      name: "babylonia/plugin-syntax-flow",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-flow"
    },
    transform: {
      name: "babylonia/preset-flow",
      url: "https://github.com/babel/babel/tree/main/packages/babel-preset-flow"
    }
  },
  functionBind: {
    syntax: {
      name: "babylonia/plugin-syntax-function-bind",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-function-bind"
    },
    transform: {
      name: "babylonia/plugin-proposal-function-bind",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-function-bind"
    }
  },
  functionSent: {
    syntax: {
      name: "babylonia/plugin-syntax-function-sent",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-function-sent"
    },
    transform: {
      name: "babylonia/plugin-proposal-function-sent",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-function-sent"
    }
  },
  jsx: {
    syntax: {
      name: "babylonia/plugin-syntax-jsx",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-jsx"
    },
    transform: {
      name: "babylonia/preset-react",
      url: "https://github.com/babel/babel/tree/main/packages/babel-preset-react"
    }
  },
  importAttributes: {
    syntax: {
      name: "babylonia/plugin-syntax-import-attributes",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes"
    }
  },
  pipelineOperator: {
    syntax: {
      name: "babylonia/plugin-syntax-pipeline-operator",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-pipeline-operator"
    },
    transform: {
      name: "babylonia/plugin-proposal-pipeline-operator",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-pipeline-operator"
    }
  },
  recordAndTuple: {
    syntax: {
      name: "babylonia/plugin-syntax-record-and-tuple",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-record-and-tuple"
    }
  },
  throwExpressions: {
    syntax: {
      name: "babylonia/plugin-syntax-throw-expressions",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-throw-expressions"
    },
    transform: {
      name: "babylonia/plugin-proposal-throw-expressions",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-proposal-throw-expressions"
    }
  },
  typescript: {
    syntax: {
      name: "babylonia/plugin-syntax-typescript",
      url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-typescript"
    },
    transform: {
      name: "babylonia/preset-typescript",
      url: "https://github.com/babel/babel/tree/main/packages/babel-preset-typescript"
    }
  }
};
{
  Object.assign(pluginNameMap, {
    asyncGenerators: {
      syntax: {
        name: "babylonia/plugin-syntax-async-generators",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-async-generators"
      },
      transform: {
        name: "babylonia/plugin-transform-async-generator-functions",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-async-generator-functions"
      }
    },
    classProperties: {
      syntax: {
        name: "babylonia/plugin-syntax-class-properties",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-class-properties"
      },
      transform: {
        name: "babylonia/plugin-transform-class-properties",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-class-properties"
      }
    },
    classPrivateProperties: {
      syntax: {
        name: "babylonia/plugin-syntax-class-properties",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-class-properties"
      },
      transform: {
        name: "babylonia/plugin-transform-class-properties",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-class-properties"
      }
    },
    classPrivateMethods: {
      syntax: {
        name: "babylonia/plugin-syntax-class-properties",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-class-properties"
      },
      transform: {
        name: "babylonia/plugin-transform-private-methods",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-private-methods"
      }
    },
    classStaticBlock: {
      syntax: {
        name: "babylonia/plugin-syntax-class-static-block",
        url: "https://github.com/babel/babel/tree/HEAD/packages/babel-plugin-syntax-class-static-block"
      },
      transform: {
        name: "babylonia/plugin-transform-class-static-block",
        url: "https://github.com/babel/babel/tree/HEAD/packages/babel-plugin-transform-class-static-block"
      }
    },
    dynamicImport: {
      syntax: {
        name: "babylonia/plugin-syntax-dynamic-import",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-dynamic-import"
      }
    },
    exportNamespaceFrom: {
      syntax: {
        name: "babylonia/plugin-syntax-export-namespace-from",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-export-namespace-from"
      },
      transform: {
        name: "babylonia/plugin-transform-export-namespace-from",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-export-namespace-from"
      }
    },
    importAssertions: {
      syntax: {
        name: "babylonia/plugin-syntax-import-assertions",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-assertions"
      }
    },
    importMeta: {
      syntax: {
        name: "babylonia/plugin-syntax-import-meta",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-meta"
      }
    },
    logicalAssignment: {
      syntax: {
        name: "babylonia/plugin-syntax-logical-assignment-operators",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-logical-assignment-operators"
      },
      transform: {
        name: "babylonia/plugin-transform-logical-assignment-operators",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-logical-assignment-operators"
      }
    },
    moduleStringNames: {
      syntax: {
        name: "babylonia/plugin-syntax-module-string-names",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-module-string-names"
      }
    },
    numericSeparator: {
      syntax: {
        name: "babylonia/plugin-syntax-numeric-separator",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-numeric-separator"
      },
      transform: {
        name: "babylonia/plugin-transform-numeric-separator",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-numeric-separator"
      }
    },
    nullishCoalescingOperator: {
      syntax: {
        name: "babylonia/plugin-syntax-nullish-coalescing-operator",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-nullish-coalescing-operator"
      },
      transform: {
        name: "babylonia/plugin-transform-nullish-coalescing-operator",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-nullish-coalescing-opearator"
      }
    },
    objectRestSpread: {
      syntax: {
        name: "babylonia/plugin-syntax-object-rest-spread",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-object-rest-spread"
      },
      transform: {
        name: "babylonia/plugin-transform-object-rest-spread",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-object-rest-spread"
      }
    },
    optionalCatchBinding: {
      syntax: {
        name: "babylonia/plugin-syntax-optional-catch-binding",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-optional-catch-binding"
      },
      transform: {
        name: "babylonia/plugin-transform-optional-catch-binding",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-optional-catch-binding"
      }
    },
    optionalChaining: {
      syntax: {
        name: "babylonia/plugin-syntax-optional-chaining",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-optional-chaining"
      },
      transform: {
        name: "babylonia/plugin-transform-optional-chaining",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-optional-chaining"
      }
    },
    privateIn: {
      syntax: {
        name: "babylonia/plugin-syntax-private-property-in-object",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-private-property-in-object"
      },
      transform: {
        name: "babylonia/plugin-transform-private-property-in-object",
        url: "https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-private-property-in-object"
      }
    },
    regexpUnicodeSets: {
      syntax: {
        name: "babylonia/plugin-syntax-unicode-sets-regex",
        url: "https://github.com/babel/babel/blob/main/packages/babel-plugin-syntax-unicode-sets-regex/README.md"
      },
      transform: {
        name: "babylonia/plugin-transform-unicode-sets-regex",
        url: "https://github.com/babel/babel/blob/main/packages/babel-plugin-proposalunicode-sets-regex/README.md"
      }
    }
  });
}
const getNameURLCombination = ({
  name,
  url
}) => `${name} (${url})`;
function generateMissingPluginMessage(missingPluginName, loc, codeFrame) {
  let helpMessage = `Support for the experimental syntax '${missingPluginName}' isn't currently enabled ` + `(${loc.line}:${loc.column + 1}):\n\n` + codeFrame;
  const pluginInfo = pluginNameMap[missingPluginName];
  if (pluginInfo) {
    const {
      syntax: syntaxPlugin,
      transform: transformPlugin
    } = pluginInfo;
    if (syntaxPlugin) {
      const syntaxPluginInfo = getNameURLCombination(syntaxPlugin);
      if (transformPlugin) {
        const transformPluginInfo = getNameURLCombination(transformPlugin);
        const sectionType = transformPlugin.name.startsWith("babylonia/plugin") ? "plugins" : "presets";
        helpMessage += `\n\nAdd ${transformPluginInfo} to the '${sectionType}' section of your Babel config to enable transformation.
If you want to leave it as-is, add ${syntaxPluginInfo} to the 'plugins' section to enable parsing.`;
      } else {
        helpMessage += `\n\nAdd ${syntaxPluginInfo} to the 'plugins' section of your Babel config ` + `to enable parsing.`;
      }
    }
  }
  return helpMessage;
}
0 && 0;

//# sourceMappingURL=missing-plugin-helper.js.map

import { declare } from "babylonia/helper-plugin-utils";
import syntaxPipelineOperator from "babylonia/plugin-syntax-pipeline-operator";
import minimalVisitor from "./minimalVisitor";
import smartVisitor from "./smartVisitor";

const visitorsPerProposal = {
  minimal: minimalVisitor,
  smart: smartVisitor,
};

export default declare((api, options) => {
  api.assertVersion(7);

  return {
    name: "proposal-pipeline-operator",
    inherits: syntaxPipelineOperator,
    visitor: visitorsPerProposal[options.proposal],
  };
});

import _Reflect$construct from "core-js/library/fn/reflect/construct.js";
import getPrototypeOf from "./getPrototypeOf.js";
import isNativeReflectConstruct from "./isNativeReflectConstruct.js";
import possibleConstructorReturn from "./possibleConstructorReturn.js";
export default function _callSuper(t, o, e) {
  return o = getPrototypeOf(o), possibleConstructorReturn(t, isNativeReflectConstruct() ? _Reflect$construct(o, e || [], getPrototypeOf(t).constructor) : o.apply(t, e));
}
const color = require("./colorConsole");

const getConstructor = value => value === null ? "null" : value === undefined ? "undefined" : value.constructor.name;
function verifyConfig(config, propertyName, fallback, required = false, minValue, maxValue) {
  if (!config.hasOwnProperty(propertyName)) {
    if (required) throw new Error(`config.${propertyName} is required`);
    else return fallback;
  }
  else return verify(config[propertyName], fallback, `config.${propertyName}`, required, minValue, maxValue);
}
function verify(value, fallback, valueName = "<value>", required = true, minValue = -Infinity, maxValue = Infinity) {
  if (required && fallback instanceof constructor) {
    if (fallback === BigInt || fallback === Number || fallback === String || fallback === Boolean || fallback === Function) fallback = fallback(0);
    else fallback = { constructor: fallback };
  }
  const useFallback = err => {
    throwIfRequired(err);
    return fallback;
  };
  const throwIfRequired = err => {
    if (required) throw err;
    //else console.warn(err);
  };
  if (value == null || fallback == null) { // if either is null or undefined
    if (value === fallback) return value;
    else return useFallback(new TypeError(`${valueName} must be of type ${getConstructor(fallback)}, received type ${getConstructor(value)}`));
  }
  else if (typeof value === "object") {
    if (typeof fallback === "object") {
      if (value instanceof fallback.constructor) return value;
      else return useFallback(new TypeError(`${valueName} must be of type ${fallback.constructor.name}, received type ${value.constructor.name}`));
    }
    else if (value.constructor === fallback.constructor) value = fallback.constructor(value);
  }
  if (typeof value === "number" && typeof fallback === "number") {
    if (isNaN(value) && isNaN(fallback)) return value;
    else if (isNaN(value)) return useFallback(new Error(`${valueName} is NaN`));
    else if (isNaN(fallback)) return useFallback(new Error(`${valueName} must be NaN`));
    else {
      if (value < minValue) {
        throwIfRequired(new RangeError(`${valueName} ${required ? "must" : "should"} be at least ${minValue}`));
        if (fallback < minValue) return undefined;
        else return fallback;
      }
      else if (value > maxValue) {
        throwIfRequired(new RangeError(`${valueName} ${required ? "must" : "should"} be at most ${maxValue}`));
        if (fallback > maxValue) return undefined;
        else return fallback;
      }
      else return value;
    }
  }
  else if (typeof value === typeof fallback) return value;
  else return useFallback(new TypeError(`${valueName} must be of type ${typeof fallback}, received type ${typeof value}`));
}
verify.config = verifyConfig;
module.exports = verify;
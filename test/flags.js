module.exports = () => {
  const args = {};
  let currentArg;
  for (let arg of process.argv.slice(2)) {
    if (arg.match(/-[a-z]|--[a-z]{2,}/)) {
      currentArg = arg.replace(/^--?/, "");
      args[currentArg] = true;
    }
    else {
      if (!currentArg) throw new Error("Unexepcted Token: " + arg);
      else if (arg.match(/^-?\d*\.?\d+$/)) args[currentArg] = parseFloat(arg);
      else if (arg.match(/^t(?:rue)?$/)) args[currentArg] = true;
      else if (arg.match(/^f(?:alse)?$/)) args[currentArg] = false;
      else args[currentArg] = arg;
      currentArg = undefined;
    }
  }
  return args;
};
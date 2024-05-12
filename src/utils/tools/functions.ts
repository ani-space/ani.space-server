export function getMethodName() {
  const err = new Error();
  // @ts-ignore: we want the 2nd method in the call stack
  return /at \w+\.(\w+)/.exec(err.stack.split('\n')[2])[1];
}

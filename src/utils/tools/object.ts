export type MapSelectKey = boolean | MapResultSelect;
export type MapResultSelect = { [key: string]: MapSelectKey };

export function reverseBooleanValueInObj(obj: any): MapResultSelect {
  const stack = [obj];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        if (typeof current[key] === 'object' && current[key] !== null) {
          stack.push(current[key]);
        } else if (typeof current[key] === 'boolean') {
          current[key] = true;
        }
      }
    }
  }

  return obj;
}

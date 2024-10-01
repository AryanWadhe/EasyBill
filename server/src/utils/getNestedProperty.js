const getNestedProperty = (obj, path) => {
  return path.split(".").reduce((prev, curr) => {
    return prev && prev[curr];
  }, obj);
};

export default getNestedProperty;

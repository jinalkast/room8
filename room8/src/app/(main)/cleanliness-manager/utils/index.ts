export const removeConfidenceInterval = (name: string) => {
  const confidence = name.match(/\(conf: ([0-9.]+)\)/);
  if (confidence) {
    const percentage = +confidence[1] * 100;
    return [name.replace(confidence[0], ''), percentage.toFixed(0) + '%'];
  }
  return [name, ''];
};

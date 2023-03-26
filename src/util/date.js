export const ConvertDate = input => {
  let x = Date.parse(input);
  if (!isNaN(x)) {
    let date = new Date(input);
    let result = new Date(date.getTime()).toISOString().substring(0, 10);
    return result;
  } else if (input === "") return "";
};

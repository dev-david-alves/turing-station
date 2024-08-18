// Convert array of substrings to a text string
export const convertSubstringsToString = (substrings = []) => {
  let text = "";
  for (let i = 0; i < substrings.length; i++) {
    text += substrings[i];
  }

  return text;
};

// Converts input text to an array of substrings
export const transformInputText = (value = "", texMap = {}) => {
  let allSubstrings = [];
  allSubstrings = subAndSupMatch(allSubstrings, value);
  allSubstrings = texMapMatch(allSubstrings, texMap);

  return allSubstrings;
};

// RegEx Functions
export const subAndSupMatch = (arr = [], value = "") => {
  let regexPattern = "(?<!\\\\)_\\{.+?\\}|(?<!\\\\)_\\w|(?<!\\\\)\\^\\{.+?\\}|(?<!\\\\)\\^\\w";

  let regex = new RegExp(regexPattern, "g");
  let matches = value.match(regex);

  let substrings = [...arr];

  // For each match, get the index for substring
  if (matches) {
    let index = 0;
    let lastIndex = 0;
    for (let match of matches) {
      index = value.indexOf(match, index);
      substrings.push(value.substring(lastIndex, index));
      substrings.push(value.substring(index, index + match.length));
      index += match.length;
      lastIndex = index;
    }

    if (lastIndex < value.length) substrings.push(value.substring(lastIndex));
  } else {
    substrings.push(value);
  }

  // console.log(substrings);
  return substrings;
};

export const texMapMatch = (arr = [], texMap = {}) => {
  let substrings = [...arr];

  for (let key in texMap) {
    for (let i = 0; i < substrings.length; i++) {
      let regex = new RegExp(`\\${key}`, "g");
      substrings[i] = substrings[i].replace(regex, texMap[key]);
    }
  }

  return substrings;
};

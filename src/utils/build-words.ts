export default function buildWords(abstract_inverted_index: {
  [key: string]: number[];
}): string {
  const words = [];
  for (const [key, value] of Object.entries(abstract_inverted_index)) {
    for (const v of value) {
      words[v] = key;
    }
  }

  let abstractData = "";
  for (const word of words) {
    abstractData += word + " ";
  }

  return abstractData;
}

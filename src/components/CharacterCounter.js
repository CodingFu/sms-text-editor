import React from "react";
import gsmCharCount from "./gsmCharCount";

const SPECIAL_REGEX = /[{|]\w+[}|]/g;

// replaceMap param is in format of { "{abc}": 10 }
// that means that {abc} template will be replaced
// with a string that takes up to 10 characters
// thus, we'll adjust the size
export default function CharacterCounter({ content, maxChars, replaceMap }) {
  let size = gsmCharCount(content);
  const matches = content.match(SPECIAL_REGEX);

  if (matches) {
    matches.forEach(m => {
      const k = m.toUpperCase();
      const maxSize = replaceMap[k];
      if (maxSize) {
        size -= k.length;
        size -= 2; // special chars take up 2 bytes in GSM and I'm sure about it
        size += maxSize;
      }
    });
  }

  return <span>{maxChars - size}</span>;
}

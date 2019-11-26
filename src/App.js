import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Editor from "./components/Editor";

const MERGE_TAGS = [
  { id: "CARRIER", tag: "CARRIER", text: "Carrier code", length: 3 },
  { id: "CPHONE", tag: "CPHONE", text: "Phone number", length: 10 },
  { id: "HPHONE", tag: "HPHONE", text: "Hashed phone number", length: 10 },
  {
    id: "TEXTKEYWORD",
    tag: "TEXTKEYWORD",
    text: "Last text keyword",
    length: 15
  },
  { id: "BIRTHDATE", tag: "BIRTHDATE", text: "Birthdate", length: 25 },
  { id: "BIRTHDAY", tag: "BIRTHDAY", text: "Birthday", length: 20 },
  {
    id: "EMAIL_ADDRESS",
    tag: "EMAIL_ADDRESS",
    text: "Email Address",
    length: 67
  },
  { id: "FIRST_NAME", tag: "FIRST_NAME", text: "First Name", length: 75 },
  { id: "LAST_NAME", tag: "LAST_NAME", text: "Last Name", length: 50 }
];

const COUPON_CODE_GROUPS = [
  { id: "FOO", text: "FOO (89/90)", length: 5 },
  { id: "MYCODEX", text: "MYCODEX (1000/1000)", length: 10 }
];

function App() {
  return (
    <div className="App">
      <Editor
        maxChars={500}
        initialContent="Hello, testing merge tags: {foo}"
        mergeTags={MERGE_TAGS.map(x => ({
          key: x.id,
          value: x.id,
          ...x
        }))}
        couponCodeGroups={COUPON_CODE_GROUPS.map(x => ({
          key: x.id,
          value: x.id,
          ...x
        }))}
      />
    </div>
  );
}

export default App;

import React from "react";
import { Dropdown } from "semantic-ui-react";

export default function MergeTagSelect({ onSelect, mergeTags = [] }) {
  function handleChange(e, { value }) {
    onSelect(`{${value}}`);
  }

  return (
    <Dropdown
      button
      search
      text="Merge Tag"
      options={mergeTags}
      className="mini"
      onChange={handleChange}
      value={null}
    ></Dropdown>
  );
}

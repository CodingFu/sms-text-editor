import React, { useState } from "react";
import { Popup, Button } from "semantic-ui-react";
import { style } from "./style";

export default function ShortenUrl({ onShorten }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpen = () => {
    console.log("handleOpen");
    setIsOpen(true);
  };

  function handleClose() {
    console.log("handleClose");
    setIsOpen(false);
  }

  function shorten() {
    console.log("shortening");
    if (url) {
      setTimeout(() => {
        let shortened = "bit.ly/testlink";
        onShorten(shortened);
        setUrl("");
      }, 1000);
    }
    handleClose();
  }

  const content = (
    <div style={style.shortenContent}>
      <div className="ui action input" style={style.shortenContentInput}>
        <input
          type="text"
          placeholder="https://google.com"
          autoFocus
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.which === 13 && shorten()}
        />
        <Button onClick={shorten}>Shorten</Button>
      </div>
    </div>
  );

  return (
    <Popup
      trigger={<Button className="mini" content="Shorten URL" />}
      content={content}
      on="click"
      open={isOpen}
      position="bottom left"
      onOpen={handleOpen}
      onClose={handleClose}
    />
  );
}

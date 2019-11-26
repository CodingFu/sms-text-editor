import React from "react";
import PropTypes from "prop-types";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  ContentState,
  Modifier,
  convertFromHTML
} from "draft-js";

import { style } from "./style";
import ShortenUrl from "./ShortenUrl";
import MergeTagSelect from "./MergeTagSelect";
import CouponCodeGroupSelect from "./CouponCodeGroupSelect";
import CharacterCounter from "./CharacterCounter";

export default class TatangoEditor extends React.Component {
  static propTypes = {
    initialContent: PropTypes.string,
    maxChars: PropTypes.number.isRequired,
    mergeTags: PropTypes.array.isRequired,
    couponCodeGroups: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.editorRef = React.createRef();
    this.replaceMap = _generateReplaceMap(
      props.mergeTags,
      props.couponCodeGroups
    );
    console.log(this.replaceMap);

    const initialEditorState = _editorStateFromRaw(props.initialContent || "");

    // those guys colorize merge tags and coupon code groups
    const compositeDecorator = new CompositeDecorator([
      { strategy: mergeTagStrategy, component: MergeTagSpan },
      { strategy: ccgStrategy, component: CcgSpan },
      { strategy: bitlyStrategy, component: BitlyLink }
    ]);

    // setting initial state
    this.state = {
      textContent: props.initialContent || "",
      editorState: EditorState.createWithContent(
        initialEditorState,
        compositeDecorator
      )
    };
  }

  onChange = editorState => {
    const textContent = editorState.getCurrentContent().getPlainText();
    this.setState({ textContent, editorState });
  };

  focus = () => setTimeout(() => this.editorRef.current.focus(), 300);

  insertText = text => {
    const { editorState } = this.state;

    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const selection = editorState.getSelection();

    // adding a space before inserted text in case there's some kind of letter before space
    // if we insert "bit.ly" and "|" is cursor position
    // "Here's a link:| xoxo" => "Here's a link: bit.ly| xoxo"
    const startBlock = blockMap.get(selection.getStartKey());
    const startOffset = selection.getStartOffset() - 1;
    const charBeforeSelectionStart = startBlock.getText()[startOffset];
    if (startOffset >= 0 && charBeforeSelectionStart !== " ") {
      text = " " + text;
    }

    // adding a space after inserted text in case when there's no space or line break after cursor position
    const endBlock = blockMap.get(selection.getEndKey());
    const charAfterSelectionEnd = endBlock.getText()[selection.getEndOffset()];
    if (
      !charAfterSelectionEnd ||
      (charAfterSelectionEnd !== " " && charAfterSelectionEnd !== "\n")
    ) {
      text += " ";
    }

    // modifying prev content state with our inserted text
    const newContentState = Modifier.replaceText(content, selection, text);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );
    this.setState({ editorState: newEditorState });

    // lastly, focusing back to the editor
    this.focus();
  };

  render() {
    const { editorState, textContent } = this.state;
    const { mergeTags, couponCodeGroups, maxChars } = this.props;
    return (
      <div>
        <div>
          <ShortenUrl onShorten={this.insertText} />
          <MergeTagSelect mergeTags={mergeTags} onSelect={this.insertText} />
          <CouponCodeGroupSelect
            couponCodeGroups={couponCodeGroups}
            onSelect={this.insertText}
          />
        </div>

        <div style={style.editorWrapper} onClick={this.focus}>
          <Editor
            ref={this.editorRef}
            editorState={editorState}
            onChange={this.onChange}
          />
        </div>

        <span style={style.counter}>
          <CharacterCounter
            content={textContent}
            maxChars={maxChars}
            replaceMap={this.replaceMap}
          />
        </span>
        <div style={{ clear: "both" }} />
      </div>
    );
  }
}

const MERGE_TAG_REGEX = /\{\w+\}/g;
const CCG_REGEX = /\|\w+\|/g;
const BITLY_REGEX = /bit\.ly\/\w+/g;

function mergeTagStrategy(contentBlock, callback, contentState) {
  _findWithRegex(MERGE_TAG_REGEX, contentBlock, callback);
}

function ccgStrategy(contentBlock, callback, contentState) {
  _findWithRegex(CCG_REGEX, contentBlock, callback);
}

function bitlyStrategy(contentBlock, callback, contentState) {
  _findWithRegex(BITLY_REGEX, contentBlock, callback);
}

function _findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const MergeTagSpan = ({ offsetKey, children }) => (
  <span style={{ backgroundColor: "#fedeb6" }} data-offset-key={offsetKey}>
    {children}
  </span>
);

const CcgSpan = ({ offsetKey, children }) => (
  <span style={{ backgroundColor: "#c1f5b0" }} data-offset-key={offsetKey}>
    {children}
  </span>
);

// TODO: that does not actually render a real link
// should probably be replaced with draft-js-linkify-plugin
const BitlyLink = ({ offsetKey, children }) => (
  <a
    href={`https://${children}`}
    target="_blank"
    rel="noreferrer noopener"
    style={{ textDecoration: "underline" }}
    data-offset-key={offsetKey}
  >
    {children}
  </a>
);

function _editorStateFromRaw(rawContent) {
  const html = rawContent.replace("\n", "<br/>");
  const blocksFromHtml = convertFromHTML(html);

  return ContentState.createFromBlockArray(
    blocksFromHtml.contentBlocks,
    blocksFromHtml.entityMap
  );
}

function _generateReplaceMap(mergeTags, couponCodeGroups) {
  let map = [];
  mergeTags.forEach(t => (map[`{${t.key}}`] = t.length));
  couponCodeGroups.forEach(c => (map[`|${c.key}|`] = c.length));

  return map;
}

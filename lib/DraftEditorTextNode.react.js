/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
'use strict';

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var ReactDOM = require("react-dom");

var UserAgent = require("fbjs/lib/UserAgent");

var invariant = require("fbjs/lib/invariant"); // In IE, spans with <br> tags render as two newlines. By rendering a span
// with only a newline character, we can be sure to render a single line.


var useNewlineChar = UserAgent.isBrowser('IE <= 11');
/**
 * Check whether the node should be considered a newline.
 */

function isNewline(node) {
  return useNewlineChar ? node.textContent === '\n' : node.tagName === 'BR';
}
/**
 * Placeholder elements for empty text content.
 *
 * What is this `data-text` attribute, anyway? It turns out that we need to
 * put an attribute on the lowest-level text node in order to preserve correct
 * spellcheck handling. If the <span> is naked, Chrome and Safari may do
 * bizarre things to do the DOM -- split text nodes, create extra spans, etc.
 * If the <span> has an attribute, this appears not to happen.
 * See http://jsfiddle.net/9khdavod/ for the failure case, and
 * http://jsfiddle.net/7pg143f7/ for the fixed case.
 */


var NEWLINE_A = useNewlineChar ? React.createElement("span", {
  key: "A",
  "data-text": "true"
}, '\n') : React.createElement("br", {
  key: "A",
  "data-text": "true"
});
var NEWLINE_B = useNewlineChar ? React.createElement("span", {
  key: "B",
  "data-text": "true"
}, '\n') : React.createElement("br", {
  key: "B",
  "data-text": "true"
});

/**
 * The lowest-level component in a `DraftEditor`, the text node component
 * replaces the default React text node implementation. This allows us to
 * perform custom handling of newline behavior and avoid re-rendering text
 * nodes with DOM state that already matches the expectations of our immutable
 * editor state.
 */
var DraftEditorTextNode =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(DraftEditorTextNode, _React$Component);

  function DraftEditorTextNode(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // By flipping this flag, we also keep flipping keys which forces
    // React to remount this node every time it rerenders.

    _defineProperty(_assertThisInitialized(_this), "_forceFlag", void 0);

    _this._forceFlag = false;
    return _this;
  }

  var _proto = DraftEditorTextNode.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var node = ReactDOM.findDOMNode(this);
    var shouldBeNewline = nextProps.children === '';
    !(node instanceof Element) ? process.env.NODE_ENV !== "production" ? invariant(false, 'node is not an Element') : invariant(false) : void 0;

    if (shouldBeNewline) {
      return !isNewline(node);
    }

    return node.textContent !== nextProps.children;
  };

  _proto.componentDidMount = function componentDidMount() {
    this._forceFlag = !this._forceFlag;
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this._forceFlag = !this._forceFlag;
  };

  _proto.render = function render() {
    if (this.props.children === '') {
      return this._forceFlag ? NEWLINE_A : NEWLINE_B;
    }

    return React.createElement("span", {
      key: this._forceFlag ? 'A' : 'B',
      "data-text": "true"
    }, this.props.children);
  };

  return DraftEditorTextNode;
}(React.Component);

module.exports = DraftEditorTextNode;
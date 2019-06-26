class {
    static get inherits() { return ["Mrbr.System.Object", "Mrbr.System.EventEmitter"]; }
    constructor(...args) {
        let self = this;
        self.base(...args)
        //self._id = args[0].id;
        self._elementType = args[0].elementType || self._elementType;
        self._element = args[0].element || Mrbr.Html.BaseHtml.createElement(self.elementType);
        if (args[0].id) {
            self._element.setAttribute("id", args[0].id)
        }
        else if (args[0].element) {
            self._id = self._element.getAttribute("id")
        }
        if (self._name) { self._element.setAttribute("name", self._name) }
        self.childElements = [];
    }
    addChild(element){
        console.log(element)
        console.log(element.element)
        this.childElements.push(element);
        this.appendChild(element.element)
    }
    setAttribute(name, value) {
        this.element.setAttribute(name, value);
    }
    getAttribute(name) {
        return this.element.getAttribute(name);
    }
    get elementType() { return this._elementType; }
    set elementType(value) { this._elementType = value; return this; }
    get element() { return this._element; }
    set element(value) { this._element = value; return this; }
    // A unique identifier for the element.
    // There must not be multiple elements in a document that have the same id value.
    // Any string, with the following restrictions:
    // must be at least one character long
    // must not contain any space characters
    // Previous versions of HTML placed greater restrictions on the content of ID values (for example, they did not permit ID values to begin with a number).
    get id() { return this.element.id; }
    set id(value) { this.this.element.id = value; return this; }
    // accesskey = list of key labels CHANGED
    // A key label or list of key labels with which to associate the element; each key label represents a keyboard shortcut which UAs can use to activate the element or give focus to the element.
    // An ordered set of unique space-separated tokens, each of which must be exactly one Unicode code point in length.
    get accessKey() { return this.element.accessKey; }
    set accessKey(value) { this.element.accessKey = value; return this; }
    // ⓘ class = set of space-separated tokens
    // A name of a classification, or list of names of classifications, to which the element belongs.    
    get class() { return this.element.class; }
    set class(value) { this.element.class = value; return this; }
    // ⓘ contenteditable = "true" or "false" or "" (empty string) or empty NEW
    // Specifies whether the contents of the element are editable.    
    get contentEditable() { return this.element.contentEditable; }
    set contentEditable(value) { this.element.contentEditable = value; return this; }
    // ⓘ contextmenu = ID reference NEW
    // The value of the id attribute on the menu with which to associate the element as a context menu.    
    get contextMenu() { return this.element.contextMenu; }
    set contextMenu(value) { this.element.contextMenu = value; return this; }
    // dir = "ltr" or "rtl" or "auto"
    // Specifies the element’s text directionality.
    get dir() { return this.element.dir; }
    set dir(value) { this.element.dir = value; return this; }
    // ⓘ draggable = "true" or "false" NEW
    // Specifies whether the element is draggable.
    get draggable() { return this.element.draggable; }
    set draggable(value) { this.element.draggable = value; return this; }
    // ⓘ dropzone = dropzone value NEW
    // Specifies what types of content can be dropped on the element, and instructs the UA about which actions to take with content when it is dropped on the element.
    // An unordered set of unique space-separated tokens, each of which is a case-insensitive match for one of the following:  
    // copy
    // Indicates that dropping an accepted item on the element will result in a copy of the dragged data.
    // move
    // Indicates that dropping an accepted item on the element will result in the dragged data being moved to the new location.
    // link
    // Indicates that dropping an accepted item on the element will result in a link to the original data.
    // Any string with three characters or more, beginning with the literal string "string:".
    // Indicates that Plain Unicode string items, of the type indicated by the part of of the keyword after the "string:" string, can be dropped on this element.
    // Any string with three characters or more, beginning with the literal string "file:".
    // Indicates that File items, of the type indicated by the part of of the keyword after the "file:" string, can be dropped on this element.
    // The value must not have more than one of the three tokens "copy", "move", or "link". If none are specified, the element represents a copy dropzone.
    get dropzone() { return this.element.dropzone; }
    set dropzone(value) { this.element.dropzone = value; return this; }
    // ⓘ hidden = "hidden" or "" (empty string) or empty NEW
    // Specifies that the element represents an element that is not yet, or is no longer, relevant.
    get hidden() { return this.element.hidden; }
    set hidden(value) { this.element.hidden = value; return this; }
    // ⓘ lang = language tag
    // Specifies the primary language for the contents of the element and for any of the element’s attributes that contain text.
    // A valid language tag as defined in [BCP 47].
    get lang() { return this.element.lang; }
    set lang(value) { this.element.lang = value; return this; }
    // ⓘ style = string
    // Specifies zero or more CSS declarations that apply to the element [CSS].
    get style() { return this.element.style; }
    set style(value) { this.element.style = value; return this; }
    // ⓘ spellcheck = "true" or "false" or "" (empty string) or empty NEW
    // Specifies whether the element represents an element whose contents are subject to spell checking and grammar checking.
    get spellcheck() { return this.element.spellcheck; }
    set spellcheck(value) { this.element.spellcheck = value; return this; }
    // ⓘ tabindex = integer
    // Specifies whether the element represents an element that is is focusable (that is, an element which is part of the sequence of focusable elements in the document), and the relative order of the element in the sequence of focusable elements in the document.
    get tabIndex() { return this.element.tabIndex; }
    set tabIndex(value) { this.element.tabIndex = value; return this; }
    // ⓘ title = any value
    // Advisory information associated with the element.
    get title() { return this.element.title; }
    set title(value) { this.element.title = value; return this; }
    //ⓘ translate = "yes" or "no"
    //Specifies whether an element’s attribute values and contents of its children are to be translated when the page is localized, or whether to leave them unchanged.
    get translate() { return this.element.translate; }
    set translate(value) { this.element.translate = value; return this; }

    get name() { return this.element.name; }
    set name(value) { this.element.name = value; return this; }

    get attributes() { return this.element.attributes; }	//Returns a NamedNodeMap of an element's attributes
    set attributes(value) { this.element.attributes = value; return this; }
    get childElementCount() { return this.element.childElementCount; }	//Returns the number of child elements an element has
    set childElementCount(value) { this.element.childElementCount = value; return this; }
    get childNodes() { return this.element.childNodes; }	//Returns a collection of an element's child nodes (including text and comment nodes)
    set childNodes(value) { this.element.childNodes = value; return this; }
    get children() { return this.element.children; }	//Returns a collection of an element's child element (excluding text and comment nodes)
    set children(value) { this.element.children = value; return this; }
    get classList() { return this.element.classList; }	//Returns the class name(s) of an element
    set classList(value) { this.element.classList = value; return this; }
    get className() { return this.element.className; }	//Sets or returns the value of the class attribute of an element
    set className(value) { this.element.className = value; return this; }
    get clientHeight() { return this.element.clientHeight; }	//Returns the height of an element, including padding
    set clientHeight(value) { this.element.clientHeight = value; return this; }
    get clientLeft() { return this.element.clientLeft; }	//Returns the width of the left border of an element
    set clientLeft(value) { this.element.clientLeft = value; return this; }
    get clientTop() { return this.element.clientTop; }	//Returns the width of the top border of an element
    set clientTop(value) { this.element.clientTop = value; return this; }
    get clientWidth() { return this.element.clientWidth; }	//Returns the width of an element, including padding
    set clientWidth(value) { this.element.clientWidth = value; return this; }
    get firstChild() { return this.element.firstChild; }	//Returns the first child node of an element
    set firstChild(value) { this.element.firstChild = value; return this; }
    get firstElementChild() { return this.element.firstElementChild; }	//Returns the first child element of an element
    set firstElementChild(value) { this.element.firstElementChild = value; return this; }
    get innerHTML() { return this.element.innerHTML; }	//Sets or returns the content of an element
    set innerHTML(value) { this.element.innerHTML = value; return this; }
    get innerText() { return this.element.innerText; }	//Sets or returns the text content of a node and its descendants
    set innerText(value) { this.element.innerText = value; return this; }
    get isContentEditable() { return this.element.isContentEditable; }	//Returns true if the content of an element is editable, otherwise false
    set isContentEditable(value) { this.element.isContentEditable = value; return this; }
    get lastChild() { return this.element.lastChild; }	//Returns the last child node of an element
    set lastChild(value) { this.element.lastChild = value; return this; }
    get lastElementChild() { return this.element.lastElementChild; }	//Returns the last child element of an element
    set lastElementChild(value) { this.element.lastElementChild = value; return this; }
    get namespaceURI() { return this.element.namespaceURI; }	//Returns the namespace URI of an element
    set namespaceURI(value) { this.element.namespaceURI = value; return this; }
    get nextSibling() { return this.element.nextSibling; }	//Returns the next node at the same node tree level
    set nextSibling(value) { this.element.nextSibling = value; return this; }
    get nextElementSibling() { return this.element.nextElementSibling; }	//Returns the next element at the same node tree level
    set nextElementSibling(value) { this.element.nextElementSibling = value; return this; }
    get nodeName() { return this.element.nodeName; }	//Returns the name of a node
    set nodeName(value) { this.element.nodeName = value; return this; }
    get nodeType() { return this.element.nodeType; }	//Returns the node type of a node
    set nodeType(value) { this.element.nodeType = value; return this; }
    get nodeValue() { return this.element.nodeType; }	//Sets or returns the value of a node
    set nodeValue(value) { this.element.nodeValue = value; return this; }
    get offsetHeight() { return this.element.offsetHeight; }	//Returns the height of an element, including padding, border and scrollbar
    set offsetHeight(value) { this.element.offsetHeight = value; return this; }
    get offsetWidth() { return this.element.offsetWidth; }	//Returns the width of an element, including padding, border and scrollbar
    set offsetWidth(value) { this.element.offsetWidth = value; return this; }
    get offsetLeft() { return this.element.offsetLeft; }	//Returns the horizontal offset position of an element
    set offsetLeft(value) { this.element.offsetLeft = value; return this; }
    get offsetParent() { return this.element.offsetParent; }	//Returns the offset container of an element
    set offsetParent(value) { this.element.offsetParent = value; return this; }
    get offsetTop() { return this.element.offsetTop; }	//Returns the vertical offset position of an element
    set offsetTop(value) { this.element.offsetTop = value; return this; }
    get ownerDocument() { return this.element.ownerDocument; }	//Returns the root element (document object) for an element
    set ownerDocument(value) { this.element.ownerDocument = value; return this; }
    get parentNode() { return this.element.parentNode; }	//Returns the parent node of an element
    set parentNode(value) { this.element.parentNode = value; return this; }
    get parentElement() { return this.element.parentElement; }	//Returns the parent element node of an element
    set parentElement(value) { this.element.parentElement = value; return this; }
    get previousSibling() { return this.element.previousSibling; }	//Returns the previous node at the same node tree level
    set previousSibling(value) { this.element.previousSibling = value; return this; }
    get previousElementSibling() { return this.element.previousElementSibling; }	//Returns the previous element at the same node tree level
    set previousElementSibling(value) { this.element.previousElementSibling = value; return this; }
    get scrollHeight() { return this.element.scrollHeight; }	//Returns the entire height of an element, including padding
    set scrollHeight(value) { this.element.scrollHeight = value; return this; }
    get scrollLeft() { return this.element.scrollLeft; }	//Sets or returns the number of pixels an element's content is scrolled horizontally
    set scrollLeft(value) { this.element.scrollLeft = value; return this; }
    get scrollTop() { return this.element.scrollTop; }	//Sets or returns the number of pixels an element's content is scrolled vertically
    set scrollTop(value) { this.element.scrollTop = value; return this; }
    get scrollWidth() { return this.element.scrollWidth; }	//Returns the entire width of an element, including padding
    set scrollWidth(value) { this.element.scrollWidth = value; return this; }
    get tagName() { return this.element.tagName; }	//Returns the tag name of an element
    set tagName(value) { this.element.tagName = value; return this; }
    get textContent() { return this.element.textContent; }//.	Sets or returns the textual content of a node and its descendants
    set textContent(value) { this.element.textContent = value; return this; }
    addEventListener() { } //Attaches an event handler to the specified element
    appendChild(node) { this.element.appendChild(node) } //Adds a new child node, to an element, as the last child node
    blur() { this.element.blur() } //Removes focus from an element
    click() { this.element.click() } //Simulates a mouse-click on an element
    cloneNode(cloneChildren) { return this.element.cloneNode(cloneChildren) } //Clones an element
    compareDocumentPosition(node) { return this.element.compareDocumentPosition(node) } //	Compares the document position of two elements
    contains(node) { return this.element.contains(node) } //	Returns true if a node is a descendant of a node, otherwise false
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    } //	Cancels an element in fullscreen mode
    focus() { this.element.focus() } //Gives focus to an element
    getAttributeNode(name) { return this.element.getAttributeNode(name) } //Returns the specified attribute node
    getBoundingClientRect() { return this.element.getBoundingClientRect() } //Returns the size of an element and its position relative to the viewport
    getElementsByClassName(className) { return this.element.getElementsByClassName(className) } //Returns a collection of all child elements with the specified class name
    getElementsByTagName(name) { return this.element.getElementsByTagName(name) } //Returns a collection of all child elements with the specified tag name
    hasAttribute(name) { return this.element.hasAttribute(name) } //Returns true if an element has the specified attribute, otherwise false
    hasAttributes() { return this.element.hasAttributes() } //Returns true if an element has any attributes, otherwise false
    hasChildNodes() { return this.element.hasChildNodes() } //Returns true if an element has any child nodes, otherwise false
    insertAdjacentElement(position, node) { this.element.insertAdjacentElement(position, node) } //Inserts a HTML element at the specified position relative to the current element
    insertAdjacentHTML(position, node) { this.element.insertAdjacentHTML(position, node) } //Inserts a HTML formatted text at the specified position relative to the current element
    insertAdjacentText(position, node) { this.element.insertAdjacentText(position, node) } //Inserts text into the specified position relative to the current element
    insertBefore(newnode, existingnode) { this.element.insertBefore(newnode, existingnode) } //Inserts a new child node before a specified, existing, child node
    isDefaultNamespace(namespace) { return this.element.isDefaultNamespace(namespace) } //	Returns true if a specified namespaceURI is the default, otherwise false
    isEqualNode(node) { return this.element.isEqualNode(node) } //	Checks if two elements are equal
    isSameNode(node) { return this.element.isSameNode(node) } //	Checks if two elements are the same node
    isSupported(feature, version) { return this.element.isSupported(feature, version) } //	Returns true if a specified feature is supported on the element
    normalize() { this.element.normalize() } //	Joins adjacent text nodes and removes empty text nodes in an element
    querySelector(selectors) { return this.element.querySelector(selectors) } //Returns the first child element that matches a specified CSS selector(s) of an element
    querySelectorAll(selectors) { return this.element.querySelectorAll(selectors) } //Returns all child elements that matches a specified CSS selector(s) of an element
    removeAttribute(attributename) { this.element.removeAttribute(attributename) } //Removes a specified attribute from an element
    removeAttributeNode(attributenode) { this.element.removeAttributeNode(attributenode) } //Removes a specified attribute node, and returns the removed node
    removeChild(node) { this.element.removeChild(node) } //Removes a child node from an element
    removeEventListener(event, fn, useCapture) { this.element.removeEventListener(event, fn, useCapture) } //Removes an event handler that has been attached with the addEventListener() method
    replaceChild(newnode, oldnode) { this.element.replaceChild(newnode, oldnode) } //Replaces a child node in an element
    requestFullscreen() {
        const elem = this.element;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    } //Shows an element in fullscreen mode
    scrollIntoView() { this.element.scrollIntoView() } //Scrolls the specified element into the visible area of the browser window
    setAttributeNode(attributenode) { this.element.setAttributeNode(attributenode) } //Sets or changes the specified attribute node
    toString() { return this.element.toString(); } //Converts an element to a string
    static createElement(elementType) {
        return document.createElement(elementType);
    }
    static create(elementName, ...args) {
        return new Mrbr.System.Assembly.toObject(elementName)(args)
    }
}
class {
    static get inherits() { return ["Mrbr.System.Object"]; }
    constructor(...args) {
        let self = this;
        self.base(...args)
        self._id = args[0].id;
        self._elementType = args.elementType || "div";
        self._element = args[0].element || Mrbr.Html.BaseHtml.createElement(self.elementType);
        if (self._id) {
            self._element.setAttribute("id", self._id)
        }
        else if (self._element && self._element.getAttribute("id")) {
            self._id = self._element.getAttribute("id")
        }
        if (self._name) { self._element.setAttribute("name", self._name) }
    }
    setAttribute(name, value) {
        this.element.setAttribute(name, value);
    }
    getAttribute(name) {
        return this.element.getAttribute(name);
    }
    get elementType() { return this._elementType; }
    set elementType(value) { this._elementType = value; }
    get element() { return this._element; }
    set element(value) { this._element = value; }
    // A unique identifier for the element.
    // There must not be multiple elements in a document that have the same id value.
    // Any string, with the following restrictions:
    // must be at least one character long
    // must not contain any space characters
    // Previous versions of HTML placed greater restrictions on the content of ID values (for example, they did not permit ID values to begin with a number).
    get id() { return this.getAttribute("id"); }
    set id(value) { this.setAttribute("id", value); }
    // accesskey = list of key labels CHANGED
    // A key label or list of key labels with which to associate the element; each key label represents a keyboard shortcut which UAs can use to activate the element or give focus to the element.
    // An ordered set of unique space-separated tokens, each of which must be exactly one Unicode code point in length.
    get accessKey() { return this.getAttribute("accessKey"); }
    set accessKey(value) { this.setAttribute("accessKey", value); }
    // ⓘ class = set of space-separated tokens
    // A name of a classification, or list of names of classifications, to which the element belongs.    
    get class() { return this.getAttribute("class"); }
    set class(value) { this.setAttribute("class", value); }
    // ⓘ contenteditable = "true" or "false" or "" (empty string) or empty NEW
    // Specifies whether the contents of the element are editable.    
    get contentEditable() { return this.getAttribute("contentEditable"); }
    set contentEditable(value) { this.setAttribute("contentEditable ", value); }
    // ⓘ contextmenu = ID reference NEW
    // The value of the id attribute on the menu with which to associate the element as a context menu.    
    get contextMenu() { return this.getAttribute("contextMenu"); }
    set contextMenu(value) { this.setAttribute("contextMenu", value); }
    // dir = "ltr" or "rtl" or "auto"
    // Specifies the element’s text directionality.
    get dir() { return this.getAttribute("dir"); }
    set dir(value) { this.setAttribute("dir", value); }
    // ⓘ draggable = "true" or "false" NEW
    // Specifies whether the element is draggable.
    get draggable() { return this.getAttribute("draggable"); }
    set draggable(value) { this.setAttribute("draggable", value); }
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
    get dropzone() { return this.getAttribute("dropzone"); }
    set dropzone(value) { this.setAttribute("dropzone", value); }
    // ⓘ hidden = "hidden" or "" (empty string) or empty NEW
    // Specifies that the element represents an element that is not yet, or is no longer, relevant.
    get hidden() { return this.getAttribute("hidden"); }
    set hidden(value) { this.setAttribute("hidden", value); }
    // ⓘ lang = language tag
    // Specifies the primary language for the contents of the element and for any of the element’s attributes that contain text.
    // A valid language tag as defined in [BCP 47].
    get lang() { return this.getAttribute("lang"); }
    set lang(value) { this.setAttribute("lang", value); }
    // ⓘ style = string
    // Specifies zero or more CSS declarations that apply to the element [CSS].
    get style() { return this.getAttribute("style"); }
    set style(value) { this.setAttribute("style", value); }
    // ⓘ spellcheck = "true" or "false" or "" (empty string) or empty NEW
    // Specifies whether the element represents an element whose contents are subject to spell checking and grammar checking.
    get spellcheck() { return this.setAttribute("spellcheck"); }
    set spellcheck(value) { this.getAttribute("spellcheck", value); }
    // ⓘ tabindex = integer
    // Specifies whether the element represents an element that is is focusable (that is, an element which is part of the sequence of focusable elements in the document), and the relative order of the element in the sequence of focusable elements in the document.
    get tabIndex() { return this.setAttribute("tabIndex"); }
    set tabIndex(value) { this.getAttribute("tabIndex", value); }
    // ⓘ title = any value
    // Advisory information associated with the element.
    get title() { return this.setAttribute("title"); }
    set title(value) { this.getAttribute("title", value); }
    //ⓘ translate = "yes" or "no"
    //Specifies whether an element’s attribute values and contents of its children are to be translated when the page is localized, or whether to leave them unchanged.
    get translate() { return this.setAttribute("translate"); }
    set translate(value) { this.getAttribute("translate", value); }

    get name() { return this.getAttribute("name"); }
    set name(value) { this.setAttribute("name", value); }
    static createElement(elementType) {
        return document.createElement(elementType);
    }
}
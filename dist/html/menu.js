class {static get inherits(){return["Mrbr.Html.BaseHtml"]}constructor(...t){this._elementType="menu",this.base(...t),this.setAttribute("id",this.id),this.setAttribute("name",this.name)}get type(){return this.getAttribute("type")}set type(t){this.setAttribute("type",t)}get label(){return this.getAttribute("label")}set label(t){this.setAttribute("label",t)}}
class {
    static get inherits() { return ["Mrbr.Controls.Control"]; }
    constructor(...args) {
        var self = this;
        self.base(...args)
        self.app = new PIXI.Application();
        document.body.appendChild(self.app.view);
        self.renderer = self.app.renderer;
        self.desktopStage = new PIXI.Container();
        self.desktopStage.interactive = true;
        self.desktopStage.sortableChildren = true;
        self.animate = self.fnanimate.bind(self);
        self.animate();
    }
    relayerDisplayObjects() {
        this.displayList.relayerDisplayObjects();
    }
    displayObjectSelected(sender, args) {
        this.displayList.displayObjectSelected(send, args);
    }
    addDisplayObject(displayObject) {
        this.displayList.addDisplayObject(displayObject);
    }
    fnanimate() {
        var self = this;
        self.renderer.render(self.desktopStage);
        requestAnimationFrame(self.animate);
    }
}
const GObject         = imports.gi.GObject
const Main            = imports.ui.main
const MenuHider       = imports.misc.extensionUtils.getCurrentExtension()

var MenuHiderExtension = GObject.registerClass(
  class MenuHiderExtension extends GObject.Object {

    _init() {
      this.uniteChangedId = 0;
      this.extensionChangedId = Main.extensionManager.connect('extension-state-changed',
                                                        (data, extension) => {
          if (extension.uuid === 'unite@hardpixel.eu') {
            if (extension.state === 1) {
              this._enable();
            } else {
              this._disable();
            }
          }
      });
      this._enable();
    }

    _enable() {
      let controls = Main.panel.statusArea['uniteWindowControls'];
      if (controls && this.uniteChangedId === 0) {
        this.uniteChangedId = controls.container.connect('notify::visible', () => {
          this._toggle();
        });
      }
    }

    _disable() {
      if (this.uniteChangedId > 0) {
        let controls = Main.panel.statusArea['uniteWindowControls'];
        if (controls) {
          controls.container.disconnect(this.uniteChangedId);
        }
        this.uniteChangedId = 0;
      }
    }

    destroy() {
      if (this.extensionChangedId > 0) {
        Main.extensionManager.disconnect(this.extensionChangedId);
        this.extensionChangedId = 0;
      }
      this._disable();
    }

    _toggle() {
      let controls = Main.panel.statusArea['uniteWindowControls'];
      if (controls) {
        let visible = controls.container.visible;

        let activitiesButton = Main.panel.statusArea['arc-menu']
        if (activitiesButton) {
          if (visible) {
            activitiesButton.container.hide()
          } else {
            activitiesButton.container.show()
          }
        }
      }
    }
  }
)

function enable() {
  global.menuHider = new MenuHiderExtension()
}

function disable() {
  global.menuHider.destroy()
  global.menuHider = null
}

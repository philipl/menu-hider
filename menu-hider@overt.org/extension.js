import GObject from 'gi://GObject';
import {Main} from './dependencies/shell/ui.js';
import {Extension} from './dependencies/shell/extensions/extension.js';

const MenuHider = GObject.registerClass(
  class MenuHider extends GObject.Object {

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
      const controls = Main.panel.statusArea['uniteWindowControls'];
      if (controls && this.uniteChangedId === 0) {
        this.uniteChangedId = controls.container.connect('notify::visible', () => {
          this._toggle();
        });
      }
    }

    _disable() {
      if (this.uniteChangedId > 0) {
        const controls = Main.panel.statusArea['uniteWindowControls'];
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
      const controls = Main.panel.statusArea['uniteWindowControls'];
      if (controls) {
        const visible = controls.container.visible;

        const activitiesButton = Main.panel.statusArea['ArcMenu']
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

let menuHider;

export default class MenuHiderExtension extends Extension.Extension {
    enable() {
        menuHider = new MenuHider();
    }

    disable() {
        menuHider?.destroy();
        menuHider = null;
    }
}

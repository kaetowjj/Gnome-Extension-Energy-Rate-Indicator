const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Mainloop = imports.mainloop;

let refreshRate = 3000; // Refresh rate in milliseconds (3 second)
let refreshTimerId = 0;

class Indicator {
    static Instance = null;

    constructor() {
        if (Indicator.Instance) {
            return Indicator.Instance;
        }

        this.label = new St.Label({
            text: "Power Rate: N/A",
            style_class: "power-rate-label", // Apply a CSS class
            y_expand: true,
            y_align: 2,
        });

        Indicator.Instance = this;
    }

    update() {
        try {
            // Execute a shell command to get the power rate
            let [success, stdout] = GLib.spawn_command_line_sync(
                "cat /sys/class/power_supply/BAT0/power_now"
            );
            if (success) {
                let powerRate = parseFloat(stdout) / 1e6; // Convert µW to W
                this.label.text = `Power Rate: ${powerRate.toFixed(2)} W`;
            } else {
                logError("Failed to execute the command.");
                this.label.text = "Power Rate: N/A";
            }
        } catch (e) {
            logError(e);
            this.label.text = "Power Rate: N/A";
        }

        // Schedule the next update after the specified refresh rate
        refreshTimerId = Mainloop.timeout_add(
            refreshRate,
            this.update.bind(this)
        );
    }
}

function init() {
    // Nothing to do here
}

function enable() {
    // Create a new instance of the Indicator class
    Indicator.Instance = new Indicator();

    // Create a PanelMenu.Button with the label as its child
    let button = new PanelMenu.Button(null, "Power Rate Indicator");
    button.actor.add_child(Indicator.Instance.label);

    // Add the button to the top panel
    Main.panel.addToStatusArea("power-rate-indicator", button);

    // Start updating the power rate immediately
    Indicator.Instance.update();
}

function disable() {
    Indicator.Instance = null;

    // Remove the button from the top panel and stop the update loop
    Mainloop.source_remove(refreshTimerId);
    Main.panel.statusArea["power-rate-indicator"].destroy();
}

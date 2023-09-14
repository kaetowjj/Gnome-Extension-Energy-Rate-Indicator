const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Mainloop = imports.mainloop;

let label;
let refreshRate = 3000; // Refresh rate in milliseconds (3 second)
let refreshTimerId = 0;

function updatePowerRate() {
    try {
        // Execute a shell command to get the power rate
        let [success, stdout] = GLib.spawn_command_line_sync("cat /sys/class/power_supply/BAT0/power_now");
        if (success) {
            let powerRate = parseFloat(stdout) / 1e6; // Convert µW to W
            label.text = `Power Rate: ${powerRate.toFixed(2)} W`;
        } else {
            logError("Failed to execute the command.");
            label.text = "Power Rate: N/A";
        }
    } catch (e) {
        logError(e);
        label.text = "Power Rate: N/A";
    }

    // Schedule the next update after the specified refresh rate
    refreshTimerId = Mainloop.timeout_add(refreshRate, updatePowerRate);
}


function init() {
    // Create a label with the initial text and apply styles
    label = new St.Label({
        text: "Power Rate: N/A",
        style_class: "power-rate-label", // Apply a CSS class
        y_expand: true, y_align: 2,
    
    });

    //label.set_y_align(Clutter.ActorAlign.CENTER);
}


function enable() {
    // Create a PanelMenu.Button with the label as its child
    let button = new PanelMenu.Button(null, "Power Rate Indicator");
    button.actor.add_child(label);
    
    // Add the button to the top panel
    Main.panel.addToStatusArea("power-rate-indicator", button);
    
    // Start updating the power rate immediately
    updatePowerRate();
}

function disable() {
    // Remove the button from the top panel and stop the update loop
    Mainloop.source_remove(refreshTimerId);
    Main.panel.statusArea['power-rate-indicator'].destroy();
}


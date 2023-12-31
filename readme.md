﻿
# Power Rate Indicator

This GNOME Shell extension displays the current power rate of your system's battery in the top panel. It updates the power rate every 3 seconds and provides a convenient way to monitor your device's power consumption.

## Installation

1.  Clone or download this repository to your local machine.
2.  Copy the `energy-rate-indicator@kaetowjj.gmail.com` folder to `~/.local/share/gnome-shell/extensions/` directory. You may need to create the `extensions` directory if it doesn't exist.
3.  Restart GNOME.

## Usage

Once the extension is installed and activated, you will see the "Power Rate Indicator" in the top panel. It will display the current power rate in watts (W). If it fails to retrieve the power rate, it will display "Power Rate: N/A."

## Customization

You can customize the refresh rate and appearance of the indicator by modifying the extension's code. Here are the key parameters you can adjust:

-   `refreshRate`: You can change the refresh rate (in milliseconds) by modifying the `refreshRate` variable in the code. The default is 3000 milliseconds (3 seconds).
    

addLayer("mse", {
    name: "Source Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SE", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        ki: new Decimal(0),
        kiPerSec: new Decimal(0),

        miasma: new Decimal(0),
        miasmaCap: new Decimal(10),
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#87d2d0, #5ab28c)",
            backgroundOrigin: "border-box",
            borderColor: "rgba(0,0,0,0.6)",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Source Energy",
    branches: [],
    color: "#be6eec",
    update(delta) {
        let onepersec = new Decimal(1)

        player.mse.kiPerSec = new Decimal(0.1)
    },
    effects() {
        let str = ""
        str = "You have <h3>" + formatSimple(player.mse.ki) + "</h3> Ki"
        if (player.mse.kiPerSec.gt(0)) str = str.concat("<br><small>(+" + formatSimple(player.mse.kiPerSec) + "/s)</small>")
        if (player.mse.kiPerSec.lt(0)) str = str.concat("<br><small>(" + formatSimple(player.mse.kiPerSec) + "/s)</small>")
        return str
    },
    bars: {
        miasmaBar: {
            unlocked: true,
            direction: RIGHT,
            width: 350,
            height: 40,
            progress() {
                return player.mse.miasma.div(player.mse.miasmaCap)
            },
            borderStyle: {border: "3px solid #4d1d1d", borderLeftWidth: "2px", borderRadius: "0 20px 20px 0"},
            baseStyle: {backgroundColor: "#1b0808"},
            fillStyle: {backgroundColor: "#361010"},
            textStyle: {color: "white", fontSize: "20px", lineHeight: "0.8", fontFamily: "monospace"},
            display() {return formatSimple(player.mse.miasma) + "/" + formatSimple(player.mse.miasmaCap) + " Miasma"},
        },
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["bar", "miasmaBar"],
        ], {width: "800px", height: "46px"}],
        ["blank", "10px"],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
addLayer("mcl", {
    name: "<span style='text-shadow:0 0 20px #cc6600'>Cleansing</span>", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<span style='text-shadow:0 0 20px #cc6600'>CL</span>", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#331900, #190c00)",
            backgroundOrigin: "border-box",
            borderColor: "#994c00",
            color: "#cc6600",
        };
    },
    tooltip: "Cleansing",
    branches: [["mme", "#4d1d1d"]],
    color: "#994c00",
    update(delta) {
        let onepersec = new Decimal(1)
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["layer-proxy", ["mse", [["bar", "miasmaBar"]]]],
        ], {width: "710px", height: "46px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
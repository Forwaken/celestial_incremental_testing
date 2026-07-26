addLayer("mme", {
    name: "Meridian", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ME", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#ff77c9, #be6eec)",
            backgroundOrigin: "border-box",
            borderColor: "#4c229f",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Meridian",
    branches: [],
    color: "#be6eec",
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
        ["style-column", [
            ["style-column", [

            ], {width: "700px", height: "197px", background: "#ff77c922", borderBottom: "3px solid #854da5", borderRadius: "17px 17px 0 0"}],
            ["always-scroll-column", [

            ], {width: "700px", height: "560px", background: "#be6eec22"}],
            ["style-column", [

            ], {width: "700px", height: "37px", background: "#ff77c922", borderTop: "3px solid #854da5", borderRadius: "0 0 17px 17px"}],
        ], {width: "700px", height: "800px", border: "3px solid #854da5", borderRadius: "20px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
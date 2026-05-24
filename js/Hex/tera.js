addLayer("tera", {
    name() {return "Tera"},
    symbol: "目", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Tera", // Decides the nodes tooltip
    color: "#6D9BE0", // Decides the nodes color.
    nodeStyle: {background: "linear-gradient(135deg, #85ADE6, #5085D8)", borderColor: "#0046AA", color: "#0046AA"}, // Decides the nodes style, in CSS format.
    branches: [], // Decides the nodes branches.
    startData() { return {

    }},
    update (delta) {

    },
    clickables: {},
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
    ],
    layerShown() { return true }, // Decides if this node is shown or not.
});
addLayer("dotf", {
    name: "Dark OTF's", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DO", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "D1",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        slotsUsed: 0,
        featureScaling: new Decimal(1),
        penumbral: false,
        miasmata: false,
    }},
    automate() {},
    nodeStyle() {},
    tooltip: "Dark OTF's",
    color: "white",
    update(delta) {
        let onepersec = new Decimal(1)

        player.dotf.slotsUsed = 0
        if (player.dotf.penumbral) player.dotf.slotsUsed++
        if (player.dotf.miasmata) player.dotf.slotsUsed++

        player.dotf.featureScaling = Decimal.add(1, player.dotf.slotsUsed)
    },
    clickables: {
        11: {
            display() {
                return player.dotf.penumbral ? "ON" : ("OFF<br><h6>Cost: " + formatWhole(new Decimal(3).pow(player.dotf.featureScaling).floor()) + " Punchcard Selections</h6>");
            },
            canClick() { return player.pu.storedSelections.gte(new Decimal(3).pow(player.dotf.featureScaling).floor()) },
            unlocked() {return true},
            onClick() {
                player.dotf.penumbral = true
                player.pu.storedSelections = player.pu.storedSelections.sub(new Decimal(3).pow(player.dotf.featureScaling).floor())
            },
            style() {
                let look = {width: '250px', minHeight: '75px', maxHeight: '75px', backgroundOrigin: "border-box", border: "3px solid #0000003f", fontSize: '20px', borderRadius: "0px 0px 10px 10px"}
                look.background = player.dotf.penumbral ? "#bbb" : this.canClick() ? "#fff" : "#bf8f8f"
                return look
            },
        },
        12: {
            display() {
                return player.dotf.miasmata ? "ON" : ("OFF<br><h6>Cost: " + formatWhole(new Decimal(5).pow(player.dotf.featureScaling).floor()) + " Punchcard Selections</h6>");
            },
            canClick() { return player.pu.storedSelections.gte(new Decimal(5).pow(player.dotf.featureScaling).floor()) },
            unlocked() {return true},
            onClick() {
                player.dotf.miasmata = true
                player.pu.storedSelections = player.pu.storedSelections.sub(new Decimal(5).pow(player.dotf.featureScaling).floor())
            },
            style() {
                let look = {width: '250px', minHeight: '75px', maxHeight: '75px', backgroundOrigin: "border-box", border: "3px solid #0000003f", fontSize: '20px', borderRadius: "0px 0px 10px 10px"}
                look.background = player.dotf.miasmata ? "#bbb" : this.canClick() ? "#fff" : "#bf8f8f"
                return look
            },
        },
    },
    tabFormat: [
        ["raw-html", () => {return "You have <h3>" + formatWhole(player.pu.storedSelections) + "</h3> punchcard selections."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
        ["raw-html", () => {
            if (player.dotf.slotsUsed == 1) return "You have <h3>" + formatWhole(player.dotf.slotsUsed) + " feature selected, increasing feature selection cost by ^" + formatSimple(player.dotf.featureScaling) + "."
            return "You have <h3>" + formatWhole(player.dotf.slotsUsed) + " features selected, increasing feature selection cost by ^" + formatSimple(player.dotf.featureScaling) + "."
        }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "25px"],
        ["style-row", [
            ["style-column", [
                ["style-column", [
                    ["raw-html", "Penumbral", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ], {backgroundColor: "#4c431e", borderRadius: "10px 10px 0px 0px", width: "250px", height: "50px"}],
                ["style-column", [
                    ["raw-html", "☾", {color: "white", fontSize: "128px", fontWeight: "100", lineHeight: "1", fontFamily: "monospace"}],
                    ["raw-html", "Blurred lines.", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {background: "linear-gradient(0deg, #222 -100%, #4c431e 100%)", borderBottom: "3px solid #99863d", borderTop: "3px solid #99863d", width: "250px", height: "169px"}],
                ["clickable", 11],
            ], () => {return layers.po.clickables[11].unlocked() ? {backgroundColor: "#4c431e", border: "3px solid #99863d", borderRadius: "13px", width: "250px", height: "300px", margin: "4px"} : {display: "none !important"}}],
            ["style-column", [
                ["style-column", [
                    ["raw-html", "Miasmata", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ], {backgroundColor: "#361010", borderRadius: "10px 10px 0px 0px", width: "250px", height: "50px"}],
                ["style-column", [
                    ["raw-html", "☯", {color: "white", fontSize: "128px", fontWeight: "100", lineHeight: "1", fontFamily: "monospace"}],
                    ["raw-html", "A land now decayed.<br><small>[NOT IMPLEMENTED YET]</small>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {background: "linear-gradient(0deg, #111 -100%, #361010 100%)", borderBottom: "3px solid #4d1d1d", borderTop: "3px solid #4d1d1d", width: "250px", height: "169px"}],
                ["clickable", 12],
            ], () => {return layers.po.clickables[12].unlocked() ? {backgroundColor: "#361010", border: "3px solid #4d1d1d", borderRadius: "13px", width: "250px", height: "300px", margin: "4px"} : {display: "none !important"}}],
        ]],
        ["blank", "25px"],
    ],
    layerShown() { return hasUpgrade("le", 150) },
    deactivated() { return !player.sma.inStarmetalChallenge},
})
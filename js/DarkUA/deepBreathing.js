addLayer("mdb", {
    name: "Deep Breathing", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DB", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        focus: new Decimal(0),
        focusGain: new Decimal(0),
        focusPerSec: new Decimal(0),
        focusActive: new Decimal(1),
        focusEffect: new Decimal(1),

        active: new Decimal(0),
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#9999aa, #888899)",
            backgroundOrigin: "border-box",
            borderColor: "#555566",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Deep Breathing",
    branches: [["mme", "#4d1d1d"]],
    color: "#555566",
    update(delta) {
        let onepersec = new Decimal(1)

        player.mdb.focusGain = new Decimal(1)
        if (hasUpgrade("mdb", 11)) player.mdb.focusGain = player.mdb.focusGain.mul(upgradeEffect("mdb", 11))

        player.mdb.focusEffect = player.mdb.focus.pow(0.2).div(2).add(1)
        player.mdb.focusActive = hasUpgrade("mdb", 12) ? new Decimal(2) : new Decimal(1)

        if (player.mdb.active.gt(0)) {
            player.mdb.active = player.mdb.active.sub(delta).max(0)
            player.mdb.focus = player.mdb.focus.add(player.mdb.focusGain.mul(delta))
            player.mse.tempMiasma = player.mse.tempMiasma.add(player.mdb.focusGain.div(10).mul(delta))
        }
    },
    clickables: {
        1: {
            title: "",
            canClick: true,
            unlocked: true,
            onClick() {player.mdb.active = new Decimal(0.1)},
            onHold() {player.mdb.active = new Decimal(0.1)},
            style() {
                let look = {width: "200px", minHeight: "200px", background: "repeating-radial-gradient(#556 0px, #445, 20px, #556 30px)", color: "rgba(0,0,0,0.6)", border: "10px solid rgba(0,0,0,0.6)", borderRadius: "100px"}
                if (player.mdb.active.lte(0)) look.filter = "brightness(0.7)"
                return look
            },
        },
    },
    upgrades: {
        11: {
            fullDisplay() {
                return "<h3>DB Upgrade I</h3><br>" +
                    "Boost Focus gain based on Ki<br>" +
                    "Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>" + 
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Focus<br>" +
                    "Penalty: +0.25 Miasma"
            },
            unlocked: true,
            cost: new Decimal(20),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(0.25);layers.mse.resetCheck()},
            currencyLocation() { return player.mdb },
            currencyInternalName: "focus",
            effect() {return player.mse.ki.add(1).log(10).div(4).add(1)},
            style() {
                let look = {width: "150px", minHeight: "100px", borderRadius: "10px", color: "white", border: "2px solid #555566", margin: "1.5px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#19191e"
                return look
            }
        },
        12: {
            fullDisplay() {
                return "<h3>DB Upgrade II</h3><br>" +
                    "Double Ki while deep breathing<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Focus<br>" +
                    "Penalty: +0.5 Miasma"
            },
            unlocked: true,
            cost: new Decimal(50),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(0.5);layers.mse.resetCheck()},
            currencyLocation() { return player.mdb },
            currencyInternalName: "focus",
            style() {
                let look = {width: "150px", minHeight: "100px", borderRadius: "10px", color: "white", border: "2px solid #555566", margin: "1.5px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#19191e"
                return look
            }
        },
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["layer-proxy", ["mse", [["bar", "miasmaBar"]]]],
        ], {width: "710px", height: "46px"}],
        ["blank", "25px"],
        ["style-row", [
            ["style-column", [
                ["clickable", 1],
            ], {width: "250px", height: "250px", background: "#55556644", borderRight: "3px solid #555566", borderRadius: "17px 0 0 0"}],
            ["style-column", [
                ["style-column", [
                    ["row", [
                        ["raw-html", () => {return "You Have " + formatSimple(player.mdb.focus) + " Focus"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.mdb.focusPerSec.gt(0) ? "<span style='margin-left:10px'>(+" + formatSimple(player.mdb.focusPerSec) + "/s)</span>" : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                    ]],
                    ["raw-html", () => {return "Boosts Ki gain by x" + formatSimple(player.mdb.focusEffect)}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "447px", height: "60px", borderBottom: "3px solid #555566"}],
                ["top-column", [
                    ["blank", "25px"],
                    ["raw-html", "While deep breathing:", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                    ["blank", "10px"],
                    ["raw-html", () => {
                        let str = "Gain +" + formatSimple(player.mdb.focusGain) + " Focus per second<br>" + 
                        "Gain +" + formatSimple(player.mdb.focusGain.div(10)) + " Temporary Miasma per second"
                        if (hasUpgrade("mdb", 12)) str = str.concat("<br>Boost Ki gain by x" + formatSimple(player.mdb.focusActive))
                        return str
                    }, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace", marginLeft: "10px"}
                        if (player.mdb.active.lte(0)) look.color = "gray"
                        return look
                    }],
                ], {width: "447px", height: "144px"}],
                ["style-row", [
                    ["raw-html", "<i>Hold or click on orb to deep breathe</i>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "447px", height: "40px", borderTop: "3px solid #555566"}],
            ], {width: "447px", height: "250px", background: "#55556666", borderRadius: "0 17px 0 0"}],
        ], {width: "700px", height: "250px", border: "3px solid #555566", borderRadius: "20px 20px 0 0"}],
        ["style-row", [
            ["upgrade", 11], ["upgrade", 12],
        ], {width: "700px", height: "120px", background: "#55556688", border: "3px solid #555566", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
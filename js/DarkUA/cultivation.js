addLayer("mcu", {
    name: "Cultivation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Cu", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        mantraSelected: 0,
        mantraEffects: {
            11: new Decimal(1),
            12: new Decimal(1),
            21: new Decimal(1),
            22: new Decimal(1),
            31: new Decimal(1),
            32: new Decimal(1),
        },
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#eead0e, #cd950c, #b8860b)",
            backgroundOrigin: "border-box",
            borderColor: "#735307",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Cultivation",
    branches: [],
    color: "#735307",
    update(delta) {
        let onepersec = new Decimal(1)

        player.mcu.mantraEffects[11] = player.mse.ki.add(1).log(10).add(1)
        player.mcu.mantraEffects[12] = player.mse.miasma.add(player.mse.tempMiasma).add(1).log(2).add(1)
        player.mcu.mantraEffects[21] = player.mci.flow.add(1).log(10).div(2).add(1)
        player.mcu.mantraEffects[22] = player.mci.circAmt.add(1).log(2).div(5).add(1)
        player.mcu.mantraEffects[31] = player.mme.meridianTotal.add(1).log(2).div(5).add(1)
        player.mcu.mantraEffects[32] = player.mme.meridianTotal.add(1).log(3).div(50).add(1)
    },
    clickables: {
        11: {
            title() { return "<h3>Mantra 1:1</h3><hr style='width:200px;border:1px solid white'>Boost Ki based on Ki<br>Currently: x" + formatSimple(player.mcu.mantraEffects[11]) },
            canClick() { return player.mcu.mantraSelected != 11},
            unlocked() { return true },
            onClick() {
                player.mcu.mantraSelected = 11
            },
            style() {
                let look = {width: "225px", minHeight: "100px", borderRadius: "15px", color: "white", border: "3px solid #735307", margin: "5px"}
                !this.canClick() ? look.backgroundColor =  "#433004" : look.backgroundColor = "black"
                return look
            },
        },
        12: {
            title() { return "<h3>Mantra 1:2</h3><hr style='width:200px;border:1px solid white'>Boost Ki based on Miasma<br>Currently: x" + formatSimple(player.mcu.mantraEffects[12]) },
            canClick() { return player.mcu.mantraSelected != 12},
            unlocked() { return true },
            onClick() {
                player.mcu.mantraSelected = 12
            },
            style() {
                let look = {width: "225px", minHeight: "100px", borderRadius: "15px", color: "white", border: "3px solid #735307", margin: "5px"}
                !this.canClick() ? look.backgroundColor =  "#433004" : look.backgroundColor = "black"
                return look
            },
        },
        21: {
            title() { return "<h3>Mantra 2:1</h3><hr style='width:200px;border:1px solid white'>Boost Circulation Speed based on Flow<br>Currently: x" + formatSimple(player.mcu.mantraEffects[21]) },
            canClick() { return player.mcu.mantraSelected != 21},
            unlocked() { return true },
            onClick() {
                player.mcu.mantraSelected = 21
            },
            style() {
                let look = {width: "225px", minHeight: "100px", borderRadius: "15px", color: "white", border: "3px solid #735307", margin: "5px"}
                !this.canClick() ? look.backgroundColor =  "#433004" : look.backgroundColor = "black"
                return look
            },
        },
        22: {
            title() { return "<h3>Mantra 2:2</h3><hr style='width:200px;border:1px solid white'><small>Boost Circulation Efficiency based on Circulations</small><br>Currently: x" + formatSimple(player.mcu.mantraEffects[22]) },
            canClick() { return player.mcu.mantraSelected != 22},
            unlocked() { return true },
            onClick() {
                player.mcu.mantraSelected = 22
            },
            style() {
                let look = {width: "225px", minHeight: "100px", borderRadius: "15px", color: "white", border: "3px solid #735307", margin: "5px"}
                !this.canClick() ? look.backgroundColor =  "#433004" : look.backgroundColor = "black"
                return look
            },
        },
        31: {
            title() { return "<h3>Mantra 3:1</h3><hr style='width:200px;border:1px solid white'><small>Reduce meridian ki cost based on total meridian levels</small><br>Currently: /" + formatSimple(player.mcu.mantraEffects[31]) },
            canClick() { return player.mcu.mantraSelected != 31},
            unlocked() { return hasUpgrade("mcu", 18) },
            onClick() {
                player.mcu.mantraSelected = 31
            },
            style() {
                let look = {width: "225px", minHeight: "100px", borderRadius: "15px", color: "white", border: "3px solid #735307", margin: "5px"}
                !this.canClick() ? look.backgroundColor =  "#433004" : look.backgroundColor = "black"
                return look
            },
        },
        32: {
            title() { return "<h3>Mantra 3:2</h3><hr style='width:200px;border:1px solid white'><small>Reduce miasma cap penalty based on total meridian levels</small><br>Currently: /" + formatSimple(player.mcu.mantraEffects[32], 2) },
            tooltip: "Miasma rounds to the nearest tenth",
            canClick() { return player.mcu.mantraSelected != 32},
            unlocked() { return hasUpgrade("mcu", 18) },
            onClick() {
                player.mcu.mantraSelected = 32
            },
            style() {
                let look = {width: "225px", minHeight: "100px", borderRadius: "15px", color: "white", border: "3px solid #735307", margin: "5px"}
                !this.canClick() ? look.backgroundColor =  "#433004" : look.backgroundColor = "black"
                return look
            },
        },
    },
    upgrades: {
        11: {
            fullDisplay() {
                return "<h3>Circulating</h3><br>" +
                    "Unlocks Circulation<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +0.5 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(1),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(0.5);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        12: {
            fullDisplay() {
                return "<h3>Concentrated Gains</h3><br>" +
                    "Boost ki based on concentration buff<br>" + 
                    "Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +0.5 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(10),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(0.5);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            effect() {return player.mci.concentrateBuff.pow(0.7).pow(buyableEffect("mse", 3))},
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        13: {
            fullDisplay() {
                return "<h3>Mantras</h3><br>" +
                    "Unlocks Mantras<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +1 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(50),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(1);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        14: {
            fullDisplay() {
                return "<h3>Better Concentration</h3><br>" +
                    "Double concentration effectiveness<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +1 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(200),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(1);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        15: {
            fullDisplay() {
                return "<h3>Cultivating</h3><br>" +
                    "Boost ki by x1.2 per cultivation upgrade<br>" +
                    "Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +2 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(1000),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(2);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            effect() {return Decimal.pow(1.2, player.mcu.upgrades.length)},
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        16: {
            fullDisplay() {
                return "<h3>Meridians</h3><br>" +
                    "Unlocks Meridians<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +2 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(2500),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(2);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        17: {
            fullDisplay() {
                return "<h3>Flowing Pathways</h3><br>" +
                    "Increase flow gain based on total meridian levels<br>" +
                    "Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +3 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(50000),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(3);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            effect() {return player.mme.meridianTotal.add(1).log(2).div(10).add(1)},
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        18: {
            fullDisplay() {
                return "<h3>Meridian Mantras</h3><br>" +
                    "Unlock meridian mantras<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Ki<br>" +
                    "Penalty: +3 Miasma"
            },
            unlocked() { return true },
            cost: new Decimal(1e6),
            onPurchase() {player.mse.miasma = player.mse.miasma.add(3);layers.mse.resetCheck()},
            currencyLocation() { return player.mse },
            currencyInternalName: "ki",
            style() {
                let look = {width: "130px", borderRadius: "15px", color: "white", border: "2px solid #735307", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
        // Upgrade that allows for you to select one mantra in every row instead of just one
        // Upgrade that unlocks deep breathing
        // Upgrade that unlocks more meridian nodes
        // Upgrade that unlocks a new mantra for each type
    },
    microtabs: {
        stuff: {
            "Upgrades": {
                buttonStyle() { return { background: "#b8860b22", border: "2px solid #735307", borderRadius: "10px" } },
                unlocked() { return true },
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", "Upgrades", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {width: "680px", height: "40px", background: "#b8860b44", border: "3px solid #735307", borderRadius: "15px 15px 0 0", marginBottom: "-3px"}],
                    ["style-column", [
                        ["blank", "5px"],
                        ["style-row", [
                            ["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15],
                            ["upgrade", 16], ["upgrade", 17], ["upgrade", 18],
                        ], {maxWidth: "680px"}],
                        ["blank", "5px"],
                    ], {width: "680px", background: "#b8860b22", border: "3px solid #735307"}],
                    ["style-column", [], {width: "680px", height: "20px", background: "#b8860b44", border: "3px solid #735307", borderRadius: "0 0 15px 15px", marginTop: "-3px"}],
                ],
            },
            "Mantras": {
                buttonStyle() { return { background: "#b8860b22", border: "2px solid #735307", borderRadius: "10px" } },
                unlocked() { return hasUpgrade("mcu", 13) },
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", "Mantras", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {width: "755px", height: "40px", background: "#b8860b44", border: "3px solid #735307", borderRadius: "15px 15px 0 0", marginBottom: "-3px"}],
                    ["style-column", [
                        ["blank", "5px"],
                        ["style-row", [["clickable", 11], ["clickable", 12]], {width: "755px"}],
                        ["style-row", [["clickable", 21], ["clickable", 22]], {borderTop: "3px solid #503a04"}],
                        ["style-row", [["clickable", 31], ["clickable", 32]], () => {return hasUpgrade("mcu", 18) ? {borderTop: "3px solid #503a04"} : {display: "none !important"}}],
                        ["blank", "5px"],
                    ], {width: "755px", background: "#b8860b11", border: "3px solid #735307"}],
                    ["style-column", [
                        ["raw-html", "Swapping mantras does not reset anything", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "755px", height: "30px", background: "#b8860b44", border: "3px solid #735307", borderRadius: "0 0 15px 15px", marginTop: "-3px"}],
                ],
            },
        },
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["layer-proxy", ["mse", [["bar", "miasmaBar"]]]],
        ], {width: "710px", height: "46px"}],
        ["blank", "10px"],
        ["microtabs", "stuff", { 'border-width': '0px' }],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
addLayer("mdb", {
    name: "Deep Breathing", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DB", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        inhalation: new Decimal(0),
        inhalationGain: new Decimal(1),

        exhalation: new Decimal(0),
        exhalationGain: new Decimal(1),

        breath: new Decimal(0),
        breathCap: new Decimal(10),
        decayRate: new Decimal(0.9),
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
    branches: [["mcu", "#4d1d1d"]],
    color: "#555566",
    update(delta) {
        // Gain code
        player.mdb.inhalationGain = new Decimal(1)
        if (hasUpgrade("mdb", 11)) player.mdb.inhalationGain = player.mdb.inhalationGain.mul(2)


        // Breath calculation code
        let prev = player.mdb.breath
        player.mdb.breath = player.mdb.breath.add(delta)

        let cyclesPast = Decimal.div(delta, player.mdb.breathCap).floor()
        player.mdb.breath = player.mdb.breath.sub(cyclesPast.mul(player.mdb.breathCap))

        // Temporary variables to prevent weird conflicts
        let currChange = [new Decimal(0), new Decimal(0)]

        if (Decimal.gte(cyclesPast, 1)) {
            let half = player.mdb.breathCap.div(2)
            currChange[0] = currChange[0].add(player.mdb.inhalationGain.mul(cyclesPast).mul(half).mul(Decimal.sub(1, player.mdb.decayRate)))
            currChange[1] = currChange[1].add(player.mdb.exhalationGain.mul(cyclesPast).mul(half).mul(Decimal.sub(1, player.mdb.decayRate)))
        }

        if (Decimal.gt(cyclesPast, 0)) {
            let firstSeg = layers.mdb.remainderCheck(Decimal.modulo(prev, player.mdb.breathCap), player.mdb.breathCap)
            let secondSeg = layers.mdb.remainderCheck(new Decimal(0), Decimal.modulo(player.mdb.breath, player.mdb.breathCap))
            currChange[0] = currChange[0].add(firstSeg[0]).add(secondSeg[0])
            currChange[1] = currChange[1].add(firstSeg[1]).add(secondSeg[1])
        } else {
            let seg = layers.mdb.remainderCheck(Decimal.modulo(prev, player.mdb.breathCap), Decimal.modulo(player.mdb.breath, player.mdb.breathCap))
            currChange[0] = currChange[0].add(seg[0])
            currChange[1] = currChange[1].add(seg[1])
        }

        player.mdb.inhalation = player.mdb.inhalation.add(currChange[0]).max(0)
        player.mdb.exhalation = player.mdb.exhalation.add(currChange[1]).max(0)
        if (player.mdb.breath.gt(player.mdb.breathCap)) player.mdb.breath = new Decimal(0)
    },
    remainderCheck(start, end) {
        let half = player.mdb.breathCap.div(2)
        let changes = [new Decimal(0), new Decimal(0)]

        // Inhale
        if (Decimal.lt(start, half)) {
            let inhaleTime = Decimal.min(end, half).sub(start)
            changes[0] = changes[0].add(player.mdb.inhalationGain.mul(inhaleTime))
            changes[1] = changes[1].sub(player.mdb.exhalationGain.mul(inhaleTime).mul(player.mdb.decayRate))
        }

        // Exhale
        if (Decimal.gt(end, half)) {
            let exhaleTime = Decimal.sub(end, Decimal.max(start, half))
            changes[1] = changes[1].add(player.mdb.exhalationGain.mul(exhaleTime))
            changes[0] = changes[0].sub(player.mdb.inhalationGain.mul(exhaleTime).mul(player.mdb.decayRate))
        }

        return changes
    },
    bars: {
        breath: {
            unlocked: true,
            direction: RIGHT,
            width: 700,
            height: 50,
            progress() {
                let cycleTime = player.mdb.breath.modulo(player.mdb.breathCap)
                let half = player.mdb.breathCap.div(2)
                if (Decimal.lt(cycleTime, half)) {
                    return Decimal.div(cycleTime, half)
                } else {
                    return Decimal.sub(1, cycleTime.sub(half).div(half))
                }
            },
            borderStyle: {border: "0px", borderRadius: "0"},
            baseStyle() {return player.mdb.breath.lt(player.mdb.breathCap.div(2)) ? {background: "#6328"} : {background: "#3348"}},
            fillStyle() {return player.mdb.breath.lt(player.mdb.breathCap.div(2)) ? {background: "#3348"} : {background: "#6328"}},
            textStyle: {color: "white", fontSize: "20px", lineHeight: "0.8", fontFamily: "monospace"},
            display() {
                let halfCap = player.mdb.breathCap.div(2)
                let str = formatTime(player.mdb.breath.modulo(halfCap)) + "/" + formatTime(halfCap)
                return player.mdb.breath.lt(halfCap) ? str.concat("<br><small>[Breathing In]</small>") : str.concat("<br><small>[Breathing Out]</small>")
            },

        },
    },
    upgrades: {
        11: {
            fullDisplay() {
                return "<h3>Inhalation I</h3><br>" +
                    "Double inhalation gain<br><br>" +
                    "Cost: " + formatShortWhole(tmp[this.layer].upgrades[this.id].cost) + " Inhalation<br>" +
                    "Penalty: +0.5 Temp Miasma"
            },
            unlocked: true,
            cost: new Decimal(5),
            onPurchase() {player.mse.tempMiasma = player.mse.tempMiasma.add(0.5);layers.mse.resetCheck()},
            currencyLocation() { return player.mdb },
            currencyInternalName: "inhalation",
            style() {
                let look = {width: "150px", minHeight: "100px", borderRadius: "10px", color: "white", border: "2px solid #555566", margin: "1.5px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#19191e"
                return look
            }
        },
    },
    tabFormat: [
        ["layer-proxy", ["mse", [
            ["row", [
                ["style-column", [
                    ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                ], {width: "300px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
                ["clickable", 11],
                ["bar", "miasmaBar"],
            ]],
        ]]],
        ["blank", "25px"],
        ["style-column", [
            ["style-row", [
                    ["style-column", [
                        ["raw-html", () => {return "You Have " + formatSimple(player.mdb.inhalation) + " Inhalation"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            let currGain = player.mdb.breath.lt(player.mdb.breathCap.div(2)) ? player.mdb.inhalationGain : player.mdb.inhalationGain.mul(player.mdb.decayRate).mul(-1)
                            return currGain.gt(0) ? "(+" + formatSimple(currGain) + "/s)" : "(" + formatSimple(currGain) + "/s)"
                        }, () => {let look = {color: "white", fontSize: "18px", fontFamily: "monospace"};if (player.mdb.breath.gt(player.mdb.breathCap.div(2))) look.color = "#fbb";return look}],
                    ], {width: "348px", height: "77px", borderRight: "3px solid #555566"}],
                    ["style-column", [
                        ["raw-html", () => {return "You Have " + formatSimple(player.mdb.exhalation) + " Exhalation"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            let currGain = player.mdb.breath.gt(player.mdb.breathCap.div(2)) ? player.mdb.exhalationGain : player.mdb.exhalationGain.mul(player.mdb.decayRate).mul(-1)
                            return currGain.gt(0) ? "(+" + formatSimple(currGain) + "/s)" : "(" + formatSimple(currGain) + "/s)"
                        }, () => {let look = {color: "white", fontSize: "18px", fontFamily: "monospace"};if (player.mdb.breath.lt(player.mdb.breathCap.div(2))) look.color = "#fbb";return look}],
                    ], {width: "349px", height: "77px"}],
            ], {width: "700px", height: "77px", background: "#55556666", borderBottom: "3px solid #555566", borderRadius: "17px 17px 0 0"}],
            ["bar", "breath"],
        ], {width: "700px", height: "130px", border: "3px solid #555566", borderRadius: "20px 20px 0 0"}],
        ["style-row", [
            ["upgrade", 11], ["upgrade", 12],
        ], {width: "700px", height: "120px", background: "#55556688", border: "3px solid #555566", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
    ],
    layerShown() { return hasUpgrade("mcu", 21) ? true : 'ghost' },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
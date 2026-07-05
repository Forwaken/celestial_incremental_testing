addNode("piositySpell", {
    name() {return "🙏"},
    symbol() {return "🙏"},
    tooltip() {return "<h3>Piosity</h3><br>Increases blessings during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>" + formatSimple(player.tera.hexEnergy) + "/" + formatSimple(Decimal.sub(6, buyableEffect("tera", "piosityCost"))) + " Hex-Energy"},
    tooltipLocked() {return "<h3>Piosity</h3><br>Increases blessings during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>" + formatSimple(player.tera.hexEnergy) + "/" + formatSimple(Decimal.sub(6, buyableEffect("tera", "piosityCost"))) + " Hex-Energy"},
    canClick() {return player.tera.hexEnergy.gte(Decimal.sub(6, buyableEffect("tera", "piosityCost")))},
    layerShown() {return player.tera.clickables["piosityPin"]},
    onClick() {
        if (this.canClick()) {
            player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.sub(6, buyableEffect("tera", "piosityCost")))
                if (player.tera.trueHex.gte(15)) player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1)).add(1).mul(buyableEffect("tera", "piosityBuff").sub(1)).add(1)
                else player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1)).pow(1/0.9).add(1).pow(0.9).mul(buyableEffect("tera", "piosityBuff").sub(1)).add(1)
        }
    },
    nodeStyle() {
        let look = {width: "60px !important", height: "60px !important", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "10px"}
        this.canClick() ? look.background = "radial-gradient(#b38600, #ffbf00)" : look.background = "#4c3900"
        return look
    },
})
addNode("bewitchSpell", {
    name() {return "🔮"},
    symbol() {return "🔮"},
    tooltip() {
        let str = "<h3>Bewitch</h3><br>Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " free Δ-jinxes<br>"
        if (getBuyableAmount("tera", "bewitchEnhance").gte(1)) str = str.concat("Improve B-jinx by " + formatSimple(buyableEffect("tera", "bewitchBuff").mul(5)) + "%<br>")
        if (getBuyableAmount("tera", "bewitchEnhance").gte(2)) str = str.concat("Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " effective vexes<br>")
        return str.concat("<br>" + formatSimple(Decimal.div(6, buyableEffect("tera", "bewitchCost"))) + " Hex-Energy per minute")
    },
    tooltipLocked() {
        let str = "<h3>Bewitch</h3><br>Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " free Δ-jinxes<br>"
        if (getBuyableAmount("tera", "bewitchEnhance").gte(1)) str = str.concat("Improve B-jinx by " + formatSimple(buyableEffect("tera", "bewitchBuff").mul(5)) + "%<br>")
        if (getBuyableAmount("tera", "bewitchEnhance").gte(2)) str = str.concat("Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " effective vexes<br>")
        return str.concat("<br>" + formatSimple(Decimal.div(6, buyableEffect("tera", "bewitchCost"))) + " Hex-Energy per minute")
    },
    canClick() {return player.tera.hexEnergy.gt(0)},
    layerShown() {return player.tera.clickables["bewitchPin"]},
    onClick() {
        if (this.canClick()) {
            if (player.tera.clickables["bewitchSpell"]) {
                player.tera.clickables["bewitchSpell"] = false
            } else {
                player.tera.clickables["bewitchSpell"] = true
            }
        }
    },
    nodeStyle() {
        let look = {width: "60px !important", height: "60px !important", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "10px"}
        !this.canClick() ? look.background = "#bf8f8f" : player.tera.clickables["bewitchSpell"] ? look.background = "linear-gradient(30deg, #7fbebe, #d4e9e9, #7fbebe)" : look.background = "#7c9797"
        return look
    },
})
addNode("chronotachysisSpell", {
    name() {return "⏳"},
    symbol() {return "⏳"},
    tooltip() {return "<h3>Chronotachysis</h3><br>Increases uni-alpha tickspeed by x" + formatSimple(Decimal.mul(2, buyableEffect("tera", "chronotachysisBuff"))) + " for " + formatTime(Decimal.add(60, buyableEffect("tera", "chronotachysisDuration").sub(1))) + "<br>Currently: " + formatTime(player.tera.chronotachysisSpell[0]) + "<br><br>" + formatSimple(player.tera.hexEnergy) + "/" + formatSimple(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost"))) + " Hex-Energy"},
    tooltipLocked() {return "<h3>Chronotachysis</h3><br>Increases uni-alpha tickspeed by x" + formatSimple(Decimal.mul(2, buyableEffect("tera", "chronotachysisBuff"))) + " for " + formatTime(Decimal.add(60, buyableEffect("tera", "chronotachysisDuration").sub(1))) + "<br>Currently: " + formatTime(player.tera.chronotachysisSpell[0]) + "<br><br>" + formatSimple(player.tera.hexEnergy) + "/" + formatSimple(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost"))) + " Hex-Energy"},
    canClick() {return player.tera.hexEnergy.gte(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost")))},
    layerShown() {return player.tera.clickables["chronotachysisPin"]},
    onClick() {
        if (this.canClick()) {
            player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost")))
            let duration = player.tera.chronotachysisSpell[0]
            duration = duration.add(buyableEffect("tera", "chronotachysisDuration").sub(1).add(60).mul(player.tera.trueHex.gte(5) ? new Decimal(2) : new Decimal(1)))
            player.tera.chronotachysisSpell = [duration, Decimal.mul(2, buyableEffect("tera", "chronotachysisBuff"))]
        }
    },
    nodeStyle() {
        let look = {width: "60px !important", height: "60px !important", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "10px"}
        this.canClick() ? look.background = "linear-gradient(0deg, #0d66e1, #0098E5, #0d66e1)" : look.background = "#004c72"
        return look
    },
})
addLayer("tera", {
    name() {return "Tera"},
    symbol: "目", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Tera", // Decides the nodes tooltip
    color: "#6D9BE0", // Decides the nodes color.
    nodeStyle() {
        if (!player.tera.unsealed) return {background: "linear-gradient(135deg, #425673, #28426c)", borderColor: "#002355", color: "#002355"}
        return {background: "linear-gradient(135deg, #85ADE6, #5085D8)", borderColor: "#0046AA", color: "#0046AA"}
    }, // Decides the nodes style, in CSS format.
    branches: [], // Decides the nodes branches.
    startData() { return {
        sinceTera: new Decimal(0),

        trueHex: new Decimal(0),
        trueHexReq: new Decimal(1e60),
        trueHexGain: new Decimal(0),
        trueHexEffect: new Decimal(1),

        hexEssence: new Decimal(0),
        hexEssencePerSecond: new Decimal(0),
        hexEssenceEffect: new Decimal(1),

        hexEnergy: new Decimal(0),
        hexEnergyCap: new Decimal(10),
        hexEnergyGain: new Decimal(0),

        piositySpell: new Decimal(300),
        piosityAuto: new Decimal(0),
        chronotachysisSpell: [new Decimal(0), new Decimal(2)], // Duration / Multiplier
        // Add spell that increases cost and power of next cast.

        realmMastery: [false, false, false, false, false, false],

        trueHept: new Decimal(0),
        trueHeptReq: new Decimal(1e70),
        trueHeptGain: new Decimal(0),

        seal: false,
    }},
    update (delta) {
        let sinceGain = new Decimal(1)
        player.tera.sinceTera = player.tera.sinceTera.add(Decimal.mul(delta, sinceGain.mul(player.h.tickspeed)))
        
        for (let i = 101; i < 113; i++) {
            if (player.tera.clickables[i] && Decimal.gt(player.tera.clickables[i], 0)) player.tera.clickables[i] = Decimal.sub(player.tera.clickables[i], delta)
        }

        // TRUE HEX CONTENT
        player.tera.trueHexReq = Decimal.pow(1e6, player.tera.trueHex).mul(1e60)
        player.tera.trueHexGain = player.hpw.power.add(1).div(1e60).ln().div(Decimal.ln(1e6)).add(1).sub(player.tera.trueHex).floor().max(0)
        player.tera.trueHexEffect = player.tera.trueHex.gte(6) ? Decimal.pow(7/6, player.tera.trueHex.sub(5)) : new Decimal(1)

        player.tera.hexEssencePerSecond = player.tera.trueHex.gt(0) ? Decimal.pow(Decimal.mul(6, buyableEffect("tera", "hexRed")), player.tera.trueHex.mul(buyableEffect("tera", "hexGreen")).sub(1)).mul(buyableEffect("tera", "hexBlue")).div(60).add(1).pow(buyableEffect("tera", "hexOpacity")).sub(1) : new Decimal(0)

        player.tera.hexEssence = player.tera.hexEssence.add(player.tera.hexEssencePerSecond.mul(delta))

        player.tera.hexEssenceEffect = player.tera.trueHex.gte(4) ? Decimal.pow(1.01, player.tera.hexEssence.add(1).log(6)) : new Decimal(1)

        player.tera.hexEnergyCap = new Decimal(9).add(buyableEffect("tera", "hexEnergyCap"))
        player.tera.hexEnergyGain = Decimal.pow(1.01, player.tera.trueHex).sub(1).mul(buyableEffect("tera", "hexEnergyBuff")).mul(player.tera.hexEssenceEffect)

        if (getBuyableAmount("tera", "piosityAuto").gt(0)) player.tera.piosityAuto = player.tera.piosityAuto.sub(delta)

        if (player.tera.piosityAuto.lte(0)) {
            player.tera.piosityAuto = buyableEffect("tera", "piosityAuto")
            player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1).max(0.001)).pow(1/0.9).add(1).pow(0.9).mul(buyableEffect("tera", "piosityBuff").sub(1).max(0.001)).add(1)
        }
        
        if (player.tera.clickables["bewitchSpell"]) player.tera.hexEnergyGain = player.tera.hexEnergyGain.sub(Decimal.div(6, buyableEffect("tera", "bewitchCost")).div(60))
        player.tera.hexEnergy = player.tera.hexEnergy.add(player.tera.hexEnergyGain.mul(delta)).min(player.tera.hexEnergyCap).max(0)

        if (player.tera.clickables["bewitchSpell"] && player.tera.hexEnergy.lte(0)) player.tera.clickables["bewitchSpell"] = false

        if (player.tera.chronotachysisSpell[0].gt(0)) player.tera.chronotachysisSpell[0] = player.tera.chronotachysisSpell[0].sub(delta).max(0)
        
        // TRUE HEPT CONTENT
        player.tera.trueHeptReq = Decimal.pow(1e7, player.tera.trueHept).mul(1e70)
        player.tera.trueHeptGain = player.hpw.power.add(1).div(1e70).ln().div(Decimal.ln(1e7)).add(1).sub(player.tera.trueHept).floor().max(0)
    },
    teraReset(type) {
        // TERA
        player.tera.sinceTera = new Decimal(0)
        player.tera.piositySpell = new Decimal(1)

        // SIN
        player.tera.wrath = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.tera.lust = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.tera.clickables = {}

        // POWER
        player.hpw.totalPower = new Decimal(0)
        player.hpw.power = new Decimal(0)
        player.hpw.powerGain = new Decimal(0)
        for (let i = 0; i < player.hpw.upgScale.length; i++) {
            player.hpw.upgScale[i] = 1
        }
        player.hpw.vigor = 0

        player.hpw.upgrades.splice(0, player.hpw.upgrades.length)
        player.hpw.milestones.splice(0, player.hpw.milestones.length)
        for (let i in player.hpw.buyables) {
            player.hpw.buyables[i] = new Decimal(0)
        }
        player.hpw.sincePower = new Decimal(0)

        // SACRIFICE
        player.hsa.holyPower = new Decimal(0)
        player.hsa.holyPowerGain = new Decimal(0)
        player.hsa.sacredEnergy = new Decimal(0)
        player.hsa.sacredEnergyPerSecond = new Decimal(0)
        player.hsa.sacredEffect = new Decimal(0)
        player.hsa.sacredEffect2 = new Decimal(1)
        player.hsa.dimensionAmounts = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),
            new Decimal(0),new Decimal(0)]
        player.hsa.dimensionsPerSecond = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),
            new Decimal(0),new Decimal(0)]
        player.hsa.prayerTime = new Decimal(0)
        player.hsa.prayerMult = new Decimal(1)
        player.hsa.prayTimeCheck = new Decimal(0)
        player.hsa.praying = false
        if (player.hsa.autoSac >= 0) player.hsa.autoSac = false

        player.hsa.upgrades.splice(0, player.hsa.upgrades.length)

        for (let i in player.hsa.buyables) {
            player.hsa.buyables[i] = new Decimal(0)
        }
        
        // REALM
        for (let i in player.hrm.challenges) {
            player.hrm.challenges[i] = new Decimal(0)
        }
        player.hrm.activeChallenge = null
        for (let i in player.hrm.buyables) {
            player.hrm.buyables[i] = new Decimal(0)
        }
        player.hrm.realmCompletions = new Decimal(0)
        player.hrm.realmEffect = new Decimal(1)
        player.hrm.blessLimit = new Decimal(0)
        player.hrm.dreamTimer = new Decimal(60)
        player.hrm.realmEssence = new Decimal(0)
        player.hrm.totalRealmEssence = new Decimal(0)
        player.hrm.realmEssenceGain = new Decimal(0)
        player.hrm.realmEssenceEffects = [new Decimal(1), new Decimal(1)]

        // PURITY
        player.hpu.purity = new Decimal(0)
        player.hpu.totalPurity = new Decimal(0)
        player.hpu.purityGain = new Decimal(0)
        player.hpu.keptPurity = new Decimal(0)
        player.hpu.puritySpent = new Decimal(0)
        for (let i in player.hpu.purifiers) {
            player.hpu.purifiers[i].amount = new Decimal(0)
            if (i != "2" || i != "5") player.hpu.purifiers[i].effect = new Decimal(1)
        }
        
        // CURSES
        player.hcu.curses = new Decimal(0)
        player.hcu.cursesGain = new Decimal(0)
        for (let i = 101; i < 115; i++) {
            player.hcu.buyables[i] = new Decimal(0)
        }

        // VEXES
        player.hve.vex = new Decimal(0)
        player.hve.vexTotal = new Decimal(0)
        player.hve.vexGain = new Decimal(0)
        player.hve.rowCurrent = [0, 0, 0, 0, 0, 0]
        player.hve.rowSpent = [0, 0, 0, 0, 0, 0]
        player.hve.vexEffects = [new Decimal(0), new Decimal(1), new Decimal(1), new Decimal(1)]
        for (let i = 0; i < player.hve.upgrades.length; i++) {
            player.hve.upgrades.splice(i, 1);
            i--;
        }
        for (let i = 11; i < 15; i++) {
            player.hve.buyables[i] = new Decimal(0)
        }

        // BLESSINGS
        player.hbl.blessings = new Decimal(0)
        player.hbl.blessingsGain = new Decimal(0)
        player.hbl.blessingPerSec = new Decimal(0)
        player.hbl.boons = new Decimal(0)
        player.hbl.boonsGain = new Decimal(0)
        player.hbl.blessAutomation = false
        for (let i in player.hbl.boosters) {
            player.hbl.boosters[i].level = new Decimal(0)
            player.hbl.boosters[i].xp = new Decimal(0)
            if (i != "5") player.hbl.boosters[i].effect = new Decimal(1)
        }
        for (let i = 0; i < player.hbl.upgrades.length; i++) {
            player.hbl.upgrades.splice(i, 1);
            i--;
        }
        for (let i = 0; i < player.hbl.milestones.length; i++) {
            player.hbl.milestones.splice(i, 1);
            i--;
        }

        // REFINEMENT
        player.hre.refinement = new Decimal(0)
        player.hre.refinementGain = new Decimal(0)
        for (let i = 0; i < 12; i++) {
            player.hre.refinementEffect[i] = [new Decimal(1), new Decimal(1)]
        }
        for (let i = 0; i < player.hre.milestones.length; i++) {
            player.hre.milestones.splice(i, 1);
            i--;
        }
        player.hre.temperer = new Decimal(0)
        player.hre.tempererPerSec = new Decimal(0)
        for (let i in player.hre.buyables) {
            player.hre.buyables[i] = new Decimal(0)
        }
        
        // RANK
        for (let i = 0; i < 12; i++) {
            player.hpr.rank[i] = new Decimal(0)
            player.hpr.rankGain[i] = new Decimal(0)
            if (i < 6) player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
            else player.hpr.rankEffect[i] = [new Decimal(0), new Decimal(0)]
        }

        // HEX POINTS
        player.h.hexPointGain = new Decimal(0)
        player.h.hexPoint = new Decimal(0)
    },
    bars: {
        hexEnergy: {
            unlocked: true,
            direction: RIGHT,
            width: 300,
            height: 40,
            progress() {
                return player.tera.hexEnergy.div(player.tera.hexEnergyCap)
            },
            baseStyle: {backgroundColor: "rgba(0,0,0,0.5)"},
            fillStyle: {backgroundColor: "#425673", borderRadius: "7px"},
            borderStyle: {
                border: "3px solid rgba(0,0,0,0.5)",
                borderRadius: "10px",
            },
            display() {
                if (player.tera.hexEnergyGain.lt(0)) return formatSimple(player.tera.hexEnergy) + "/" + formatSimple(player.tera.hexEnergyCap) + " Hex Energy<br><small>[-" + formatSimple(player.tera.hexEnergyGain.abs()) + "/s]</small>"
                return formatSimple(player.tera.hexEnergy) + "/" + formatSimple(player.tera.hexEnergyCap) + " Hex Energy<br><small>[" + formatSimple(player.tera.hexEnergyGain) + "/s]</small>"
            },
        },
    },
    clickables: {
        "seal1": {
            title() {return player.tera.clickables["seal1"] ? "" : formatSimple(player.points) + "/<br>e4,800,000<br>Points"},
            canClick() {return player.points.gte("1e4800000")},
            unlocked() {return !player.tera.clickables["seal1"]},
            branches: [["sealCenter", "gray", 25]],
            onClick() {
                player.tera.clickables["seal1"] = true

                let comp = 0
                for (let i = 1; i < 7; i++) {
                    if (player.tera.clickables["seal"+i]) comp++
                }
                if (comp>=6) {
                    player.tera.trueHex = player.tera.trueHex.add(1)
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                }
            },
            style: {width: "150px", height: "150px", fontSize: "12px", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"},
        },
        "seal2": {
            title() {return player.tera.clickables["seal2"] ? "" : formatSimple(player.s.pylonEnergy) + "/<br>1e12<br>Radiation Pylon Energy"},
            canClick() {return player.s.pylonEnergy.gte(1e12)},
            unlocked() {return !player.tera.clickables["seal2"]},
            branches: [["sealCenter", "gray", 25]],
            onClick() {
                player.tera.clickables["seal2"] = true

                let comp = 0
                for (let i = 1; i < 7; i++) {
                    if (player.tera.clickables["seal"+i]) comp++
                }
                if (comp>=6) {
                    player.tera.trueHex = player.tera.trueHex.add(1)
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                }
            },
            style: {width: "150px", height: "150px", fontSize: "12px", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"},
        },
        "seal3": {
            title() {return player.tera.clickables["seal3"] ? "" : formatSimple(player.tad.infinitum) + "/<br>1e180<br>Infinitum"},
            canClick() {return player.tad.infinitum.gte(1e180)},
            unlocked() {return !player.tera.clickables["seal3"]},
            branches: [["sealCenter", "gray", 25]],
            onClick() {
                player.tera.clickables["seal3"] = true

                let comp = 0
                for (let i = 1; i < 7; i++) {
                    if (player.tera.clickables["seal"+i]) comp++
                }
                if (comp>=6) {
                    player.tera.trueHex = player.tera.trueHex.add(1)
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                }
            },
            style: {width: "150px", height: "150px", fontSize: "12px", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"},
        },
        "seal4": {
            title() {return player.tera.clickables["seal4"] ? "" : formatSimple(player.ca.replicanti) + "/<br>1e2,400<br>Replicanti"},
            canClick() {return player.ca.replicanti.gte("1e2400")},
            unlocked() {return !player.tera.clickables["seal4"]},
            branches: [["sealCenter", "gray", 25]],
            onClick() {
                player.tera.clickables["seal4"] = true

                let comp = 0
                for (let i = 1; i < 7; i++) {
                    if (player.tera.clickables["seal"+i]) comp++
                }
                if (comp>=6) {
                    player.tera.trueHex = player.tera.trueHex.add(1)
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                }
            },
            style: {width: "150px", height: "150px", fontSize: "12px", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"},
        },
        "seal5": {
            title() {return player.tera.clickables["seal5"] ? "" : formatSimple(player.ep2.cookies) + "/<br>1e30<br>Cookies"},
            canClick() {return player.ep2.cookies.gte(1e30)},
            unlocked() {return !player.tera.clickables["seal5"]},
            branches: [["sealCenter", "gray", 25]],
            onClick() {
                player.tera.clickables["seal5"] = true

                let comp = 0
                for (let i = 1; i < 7; i++) {
                    if (player.tera.clickables["seal"+i]) comp++
                }
                if (comp>=6) {
                    player.tera.trueHex = player.tera.trueHex.add(1)
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                }
            },
            style: {width: "150px", height: "150px", fontSize: "12px", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"},
        },
        "seal6": {
            title() {return player.tera.clickables["seal6"] ? "" : formatSimple(getLevelableAmount("pu", 401)) + "/36<br> Humanity Punchcard Levels"},
            canClick() {return getLevelableAmount("pu", 401).gte(36)},
            unlocked() {return !player.tera.clickables["seal6"]},
            branches: [["sealCenter", "gray", 25]],
            onClick() {
                player.tera.clickables["seal6"] = true

                let comp = 0
                for (let i = 1; i < 7; i++) {
                    if (player.tera.clickables["seal"+i]) comp++
                }
                if (comp>=6) {
                    player.tera.trueHex = player.tera.trueHex.add(1)
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                }
            },
            style: {width: "150px", height: "150px", fontSize: "12px", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"},
        },
        "sealCenter": {
            title: "目",
            canClick() {
                let count = 0
                for (let i = 1; i < 7; i++) {if (player.tera.clickables["seal"+i]) count++}
                return count >= 6
            },
            unlocked: true,
            onClick() {player.tera.unsealed = true},
            style() {
                let count = 0
                for (let i = 1; i < 7; i++) {if (player.tera.clickables["seal"+i]) count++}
                let look = {width: "100px", minHeight: "100px", background: "linear-gradient(135deg, #85ADE6, #5085D8)", fontSize: "30px", color: "#0046AA", border: "5px solid #0046AA", borderRadius: "50%"}
                look.filter = "brightness(" + formatWhole((count+3)*10) + "%)"
                if (!this.canClick()) {look.userSelect = "none"; look.cursor = "default"}
                return look
            },
        },
        "trueTiers": {
            title: "True Tiers",
            canClick() {return player.subtabs["tera"]["tabs"] != "trueTiers"},
            unlocked: true,
            onClick() {
                player.subtabs["tera"]["tabs"] = "trueTiers"
            },
            style() {
                let look = {width: "400px", minHeight: "50px", fontSize: "16px", color: "rgba(0,0,0,0.7)", background: "linear-gradient(135deg, #85ADE6, #5085D8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "17px 0 0 0"}
                if (!this.canClick()) {look.border = "3px solid rgba(255,255,255,0.5)";look.cursor = "default"}
                return look
            },
        },
        "upgrades": {
            title: "Upgrades",
            canClick() {return player.subtabs["tera"]["tabs"] != "upgrades"},
            unlocked: true,
            onClick() {
                player.subtabs["tera"]["tabs"] = "upgrades"
            },
            style() {
                let look = {width: "400px", minHeight: "50px", fontSize: "16px", color: "rgba(0,0,0,0.7)", background: "linear-gradient(135deg, #85ADE6, #5085D8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0 17px 0 0"}
                if (!this.canClick()) {look.border = "3px solid rgba(255,255,255,0.5)";look.cursor = "default"}
                return look
            },
        },
        1: {
            title() {return false ? "<h3>True Base</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#ADE685", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        2: {
            title() {return false ? "<h3>True Rank</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#A5DB98", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        3: {
            title() {return false ? "<h3>True Tier</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#9DCFAC", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        4: {
            title() {return false ? "<h3>True Tetr</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#95C4BF", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        5: {
            title() {return false ? "<h3>True Pent</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#8DB8D3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        6: {
            title() {
                return this.canClick() ? "<h3>True Hex</h3><br>" + formatWhole(player.tera.trueHex) + "<br><small>[Req: " + formatWhole(player.tera.trueHexReq) + " Power]" : "<h3>???</h3>"
            },
            canClick() {return player.tera.unsealed},
            unlocked: true,
            onClick() {
                player.subtabs["tera"]["stuff"] = "hex"
            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#85ADE6", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        7: {
            title() {return this.canClick() ? "<h3>True Hept</h3><br>" + formatWhole(player.tera.trueHept) + "<br><small>[Req: " + formatWhole(player.tera.trueHeptReq) + " Power]" : "<h3>???</h3>"},
            canClick() {return player.tera.unsealed},
            unlocked: true,
            onClick() {
                player.subtabs["tera"]["stuff"] = "hept"
            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#95A6DD", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        8: {
            title() {return false ? "<h3>True Oct</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#A5A0D3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        9: {
            title() {return false ? "<h3>True Enne</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#B699CA", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        10: {
            title() {return false ? "<h3>True Dect</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#C692C0", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        11: {
            title() {return false ? "<h3>True Undect</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#D68CB7", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        12: {
            title() {return false ? "<h3>True Dodect</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#E685AD", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        106: {
            title() {return true ? "<h2>CURRENTLY SEALED</h2><br><h3>[Perhaps a virtuous power could break this seal?]</h3>" : player.h.stage.neq(6) ? (Decimal.gt(player.tera.clickables[106], 0) ? "<h2>Are you sure?</h2><br><h3>[Resets ALL previous Uni-α content]</h3>" : "<h2>Switch to Hex Universe</h2><br><h3>[Resets ALL previous Uni-α content]</h3>") : "<h2>Switch to Hex Universe</h2><br><h3>[ALREADY IN HEX UNIVERSE]</h3>"},
            canClick() {return player.h.stage.neq(6) && false},
            unlocked: true,
            onClick() {
                if (Decimal.lte(player.tera.clickables[106], 0)) {
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(6)
                    player.tera.clickables[106] = new Decimal(2)
                } else {
                    player.tera.clickables[106] = new Decimal(0)

                }
            },
            style() {
                let look = {width: "500px", minHeight: "60px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        107: {
            title() {return player.h.stage.neq(7) ? (Decimal.gt(player.tera.clickables[107], 0) ? "<h2>Are you sure?</h2><br><h3>[Resets ALL previous Uni-α content]</h3>" : "<h2>Switch to Hept Universe</h2><br><h3>[Resets ALL previous Uni-α content]</h3>") : "<h2>Switch to Hept Universe</h2><br><h3>[ALREADY IN HEPT UNIVERSE]</h3>"},
            canClick() {return player.h.stage.neq(7)},
            unlocked: true,
            onClick() {
                if (Decimal.lte(player.tera.clickables[107], 0)) {
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                    player.tera.clickables[107] = new Decimal(2)
                } else {
                    player.tera.clickables[107] = new Decimal(0)

                }
            },
            style() {
                let look = {width: "500px", minHeight: "60px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "hexReset": {
            title() {
                let str = "<h2>Reset ALL previous content for true hexes</h2><br>"
                if (player.h.stage.eq(6)) str = str.concat("<h3>Req: " + formatWhole(player.tera.trueHexReq) + " Power</h3>")
                else str = str.concat("<h3>[ONLY POSSIBLE WHEN Uni-α IS HEX]</h3>")
                if (player.tera.trueHex.eq(0)) str = str.concat("<br>At true hex 1, unlock true hex content.") // ADDED
                if (player.tera.trueHex.eq(1)) str = str.concat("<br>At true hex 2, unlock the second set of spell buyables.") // ADDED
                if (player.tera.trueHex.eq(2)) str = str.concat("<br>At true hex 3, unlock a new hex spell.")
                if (player.tera.trueHex.eq(3)) str = str.concat("<br>At true hex 4, unlock a hex essence effect.") // ADDED
                if (player.tera.trueHex.eq(4)) str = str.concat("<br>At true hex 5, double chronotachysis duration.") // ADDED
                if (player.tera.trueHex.eq(5)) str = str.concat("<br>At true hex 6, unlock a true hex effect.") // ADDED
                if (player.tera.trueHex.gte(6) && player.tera.trueHex.lt(9)) str = str.concat("<br>At true hex 9, unlock the third set of spell buyables.") // ADDED
                if (player.tera.trueHex.gte(9) && player.tera.trueHex.lt(12)) str = str.concat("<br>At true hex 12, unlock a new hex spell.")
                if (player.tera.trueHex.gte(12) && player.tera.trueHex.lt(15)) str = str.concat("<br>At true hex 15, improve piosity spell formula.") // ADDED
                if (player.tera.trueHex.gte(15) && player.tera.trueHex.lt(18)) str = str.concat("<br>At true hex 18, unlock a new hex spell.")
                return str
            },
            canClick() {return player.h.stage.eq(6) && player.hpw.power.gte(player.tera.trueHexReq)},
            unlocked: true,
            onClick() {
                player.tera.trueHex = player.tera.trueHex.add(player.tera.trueHexGain)

                layers.tera.teraReset()
            },
            style() {
                let look = {width: "400px", minHeight: "120px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        "heptReset": {
            title() {
                let str = "<h2>Reset ALL previous content for true hepts</h2><br>"
                if (player.h.stage.eq(7)) str = str.concat("<h3>Req: " + formatWhole(player.tera.trueHeptReq) + " Power</h3>")
                else str = str.concat("<h3>[ONLY POSSIBLE WHEN Uni-α IS HEPT]</h3>")
                if (player.tera.trueHept.eq(0)) str = str.concat("<br>At true hept 1, unlock true hept content.")
                return str
            },
            canClick() {return player.h.stage.eq(7) && player.hpw.power.gte(player.tera.trueHeptReq)},
            unlocked: true,
            onClick() {
                player.tera.trueHept = player.tera.trueHept.add(player.tera.trueHeptGain)

                layers.tera.teraReset()
            },
            style() {
                let look = {width: "400px", minHeight: "120px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        "piositySpell": {
            title() {return "<h3>Piosity</h3><br>Increases blessings during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>" + formatSimple(Decimal.sub(6, buyableEffect("tera", "piosityCost"))) + " Hex-Energy"},
            canClick() {return player.tera.hexEnergy.gte(Decimal.sub(6, buyableEffect("tera", "piosityCost")))},
            unlocked: true,
            onClick() {
                player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.sub(6, buyableEffect("tera", "piosityCost")))
                if (player.tera.trueHex.gte(15)) player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1)).add(1).mul(buyableEffect("tera", "piosityBuff").sub(1)).add(1)
                else player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1)).pow(1/0.9).add(1).pow(0.9).mul(buyableEffect("tera", "piosityBuff").sub(1)).add(1)
            },
            style() {
                let look = {width: "180px", minHeight: "110px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "radial-gradient(#cc9900, #ffbf00)" : look.background = "#bf8f8f"
                return look
            },
        },
        "piosityPin": {
            title() {return player.tera.clickables["piosityPin"] ? "Unpin from tree" : "Pin to tree"},
            canClick: true,
            unlocked: true,
            onClick() {
                if (player.tera.clickables["piosityPin"]) {
                    player.tera.clickables["piosityPin"] = false
                } else {
                    player.tera.clickables["piosityPin"] = true
                }
            },
            style() {
                let look = {width: "180px", minHeight: "50px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["piosityPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
        "bewitchSpell": {
            title() {
                let str = "<h3>Bewitch</h3><br>Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " free Δ-jinxes<br>"
                if (getBuyableAmount("tera", "bewitchEnhance").gte(1)) str = str.concat("Improve B-jinx by " + formatSimple(buyableEffect("tera", "bewitchBuff").mul(5)) + "%<br>")
                if (getBuyableAmount("tera", "bewitchEnhance").gte(2)) str = str.concat("Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " effective vexes<br>")
                return str.concat("<br>" + formatSimple(Decimal.div(6, buyableEffect("tera", "bewitchCost"))) + " Hex-Energy per minute")
            },
            canClick() {return player.tera.hexEnergy.gt(0)},
            unlocked: true,
            onClick() {
                if (player.tera.clickables["bewitchSpell"]) {
                    player.tera.clickables["bewitchSpell"] = false
                } else {
                    player.tera.clickables["bewitchSpell"] = true
                }
            },
            style() {
                let look = {width: "180px", minHeight: "110px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !this.canClick() ? look.background = "#bf8f8f" : player.tera.clickables["bewitchSpell"] ? look.background = "linear-gradient(30deg, #7fbebe, #d4e9e9, #7fbebe)" : look.background = "#7c9797"
                return look
            },
        },
        "bewitchPin": {
            title() {return player.tera.clickables["bewitchPin"] ? "Unpin from tree" : "Pin to tree"},
            canClick: true,
            unlocked: true,
            onClick() {
                if (player.tera.clickables["bewitchPin"]) {
                    player.tera.clickables["bewitchPin"] = false
                } else {
                    player.tera.clickables["bewitchPin"] = true
                }
            },
            style() {
                let look = {width: "180px", minHeight: "50px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["bewitchPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
        "chronotachysisSpell": {
            title() {return "<h3>Chronotachysis</h3><br>Increases uni-alpha tickspeed by x" + formatSimple(Decimal.mul(2, buyableEffect("tera", "chronotachysisBuff"))) + " for " + formatTime(Decimal.add(60, buyableEffect("tera", "chronotachysisDuration").sub(1))) + "<br>Currently: " + formatTime(player.tera.chronotachysisSpell[0]) + "<br><br>" + formatSimple(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost"))) + " Hex-Energy"},
            canClick() {return player.tera.hexEnergy.gte(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost")))},
            unlocked: true,
            onClick() {
                player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.sub(11, buyableEffect("tera", "chronotachysisCost")))
                let duration = player.tera.chronotachysisSpell[0]
            duration = duration.add(buyableEffect("tera", "chronotachysisDuration").sub(1).add(60).mul(player.tera.trueHex.gte(5) ? new Decimal(2) : new Decimal(1)))
                player.tera.chronotachysisSpell = [duration, Decimal.mul(2, buyableEffect("tera", "chronotachysisBuff"))]
            },
            style() {
                let look = {width: "180px", minHeight: "110px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "linear-gradient(0deg, #0d66e1, #0098E5, #0d66e1)" : look.background = "#bf8f8f"
                return look
            },
        },
        "chronotachysisPin": {
            title() {return player.tera.clickables["chronotachysisPin"] ? "Unpin from tree" : "Pin to tree"},
            canClick: true,
            unlocked: true,
            onClick() {
                if (player.tera.clickables["chronotachysisPin"]) {
                    player.tera.clickables["chronotachysisPin"] = false
                } else {
                    player.tera.clickables["chronotachysisPin"] = true
                }
            },
            style() {
                let look = {width: "180px", minHeight: "50px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["chronotachysisPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
    },
    buyables: {
        "hexRed": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (Decimal.gte(amt, 196)) return this.costGrowth().pow(amt).pow(4).mul(this.costBase())
                if (Decimal.gte(amt, 128)) return this.costGrowth().pow(amt).pow(3).mul(this.costBase())
                if (Decimal.gte(amt, 64)) return this.costGrowth().pow(amt).pow(2).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Red Value</h3>\n\
                    [Multiplies base value]\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ff4444"
                return look
            },
        },
        "hexGreen": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (Decimal.gte(amt, 196)) return this.costGrowth().pow(amt).pow(4).mul(this.costBase())
                if (Decimal.gte(amt, 128)) return this.costGrowth().pow(amt).pow(3).mul(this.costBase())
                if (Decimal.gte(amt, 64)) return this.costGrowth().pow(amt).pow(2).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Green Value</h3>\n\
                    [Multiplies base exponent]\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#44ff44"
                return look
            },
        },
        "hexBlue": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (Decimal.gte(amt, 196)) return this.costGrowth().pow(amt).pow(4).mul(this.costBase())
                if (Decimal.gte(amt, 128)) return this.costGrowth().pow(amt).pow(3).mul(this.costBase())
                if (Decimal.gte(amt, 64)) return this.costGrowth().pow(amt).pow(2).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Blue Value</h3>\n\
                    [Multiplies final effect]\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#4444ff"
                return look
            },
        },
        "hexOpacity": {
            costBase() { return new Decimal(255) },
            costGrowth() { return new Decimal(256) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Opacity Value</h3>\n\
                    [Raises final effect]\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffffff"
                return look
            },
        },
        "hexEnergyBuff": {
            costBase() { return new Decimal(2).mul(buyableEffect("tera", "hexEnergyPrestige")) },
            costGrowth() { return new Decimal(0.4).mul(buyableEffect("tera", "hexEnergyPrestige").pow(0.5)) },
            purchaseLimit() { return new Decimal(90) },
            currency() { return player.tera.hexEnergy},
            pay(amt) { player.tera.hexEnergy = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(10).add(1).mul(Decimal.pow(10, getBuyableAmount("tera", "hexEnergyPrestige"))) },
            unlocked: true,
            cost(x) { return getBuyableAmount(this.layer, this.id).mul(this.costGrowth()).add(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Hex Energy Gain</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Hex Energy"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "150px", height: "110px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "hexEnergyCap": {
            costBase() { return new Decimal(5).mul(buyableEffect("tera", "hexEnergyPrestige")) },
            costGrowth() { return new Decimal(0.5).mul(buyableEffect("tera", "hexEnergyPrestige").pow(0.5)) },
            purchaseLimit() { return new Decimal(90) },
            currency() { return player.tera.hexEnergy},
            pay(amt) { player.tera.hexEnergy = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).add(Decimal.pow(10, getBuyableAmount("tera", "hexEnergyPrestige"))).mul(Decimal.pow(10, getBuyableAmount("tera", "hexEnergyPrestige"))) },
            unlocked: true,
            cost(x) { return getBuyableAmount(this.layer, this.id).mul(this.costGrowth()).add(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Hex Energy Cap</h3>\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Hex Energy"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "150px", height: "110px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "hexEnergyPrestige": {
            costBase() { return new Decimal(100) },
            costGrowth() {return new Decimal(10)},
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.tera.hexEnergy},
            pay(amt) { player.tera.hexEnergy = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(10, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "Reset hex energy buyables and increase their prices, but keep and improve hex energy buyable effects\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Energy"
            },
            buy() {
                this.pay(this.cost())
                player.tera.buyables["hexEnergyBuff"] = new Decimal(0)
                player.tera.buyables["hexEnergyCap"] = new Decimal(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "255px", height: "110px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0", padding: "10px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "piosityBuff": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(6) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Piosity Boost</h3>\n\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1).mul(100), 2) + "%\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "piosityCost": {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(20) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(10).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(2)},
            display() {
                if (player.tera.trueHex.lt(2)) return "???"
                return "<h3>Decrease Piosity Cost</h3>\n\
                    Currently: -" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + " HE\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                if (player.tera.trueHex.lt(2)) {look.fontSize = "20px"; look.background = "#425673"; look.color = "rgba(255,255,255,0.8)"}
                return look
            },
        },
        "piosityAuto": {
            costBase() { return new Decimal(216) },
            costGrowth() { return new Decimal(36) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.div(300, Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).sub(1))) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(9)},
            display() {
                if (player.tera.trueHex.lt(9)) return "???"
                if (getBuyableAmount(this.layer, this.id).eq(0)) {
                    return "<h3>Auto-cast Piosity</h3>\n\ \n\
                        Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
                }
                return "<h3>Auto-cast Piosity</h3>\n\
                    Currently every " + formatTime(tmp[this.layer].buyables[this.id].effect) + "\n\
                    [" + formatTime(player.tera.piosityAuto) + "]\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            tooltip() {return player.tera.trueHex.gte(9) ? "Auto-casts are free." : ""},
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                if (player.tera.trueHex.lt(9)) {look.fontSize = "20px"; look.background = "#425673"; look.color = "rgba(255,255,255,0.8)"}
                return look
            },
        },
        "bewitchBuff": {
            costBase() { return new Decimal(9) },
            costGrowth() { return new Decimal(9) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Improve Bewitch Effects</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#b2d8d8"
                return look
            },
        },
        "bewitchCost": {
            costBase() { return new Decimal(27) },
            costGrowth() { return new Decimal(27) },
            purchaseLimit() { return new Decimal(20) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(10).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(2)},
            display() {
                if (player.tera.trueHex.lt(2)) return "???"
                return "<h3>Reduce Bewitch Cost</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#b2d8d8"
                if (player.tera.trueHex.lt(2)) {look.fontSize = "20px"; look.background = "#425673"; look.color = "rgba(255,255,255,0.8)"}
                return look
            },
        },
        "bewitchEnhance": {
            costBase() { return new Decimal(59049) },
            costGrowth() { return new Decimal(59049) },
            purchaseLimit() { return new Decimal(2) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(9)},
            display() {
                if (player.tera.trueHex.lt(9)) return "???"
                if (getBuyableAmount(this.layer, this.id).gte(2)) {
                    return "<h3>Unlock new Bewitch Effect</h3>\n\
                        [MAXED]\n\ \n\
                        Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
                }
                if (getBuyableAmount(this.layer, this.id).gte(1)) {
                    return "<h3>Unlock new Bewitch Effect</h3>\n\
                        Next: Increase Effective Vexes\n\ \n\
                        Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
                }
                return "<h3>Unlock new Bewitch Effect</h3>\n\
                    Next: Improve B-Jinx Effect\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#b2d8d8"
                if (player.tera.trueHex.lt(9)) {look.fontSize = "20px"; look.background = "#425673"; look.color = "rgba(255,255,255,0.8)"}
                return look
            },
        },
        "chronotachysisBuff": {
            costBase() { return new Decimal(12) },
            costGrowth() { return new Decimal(12) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(20).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Improve Chronotachysis Multiplier</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#0098E5"
                return look
            },
        },
        "chronotachysisCost": {
            costBase() { return new Decimal(48) },
            costGrowth() { return new Decimal(48) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(10).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(2)},
            display() {
                if (player.tera.trueHex.lt(2)) return "???"
                return "<h3>Reduce Chronotachysis Cost</h3>\n\
                    Currently: -" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + " HE\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#0098E5"
                if (player.tera.trueHex.lt(2)) {look.fontSize = "20px"; look.background = "#425673"; look.color = "rgba(255,255,255,0.8)"}
                return look
            },
        },
        "chronotachysisDuration": {
            costBase() { return new Decimal(300) },
            costGrowth() { return new Decimal(30) },
            purchaseLimit() { return new Decimal(30) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).mul(15).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(9)},
            display() {
                if (player.tera.trueHex.lt(9)) return "???"
                return "<h3>Improve Chronotachysis Duration</h3>\n\
                    Currently: +" + formatTime(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "125px", height: "160px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#0098E5"
                if (player.tera.trueHex.lt(9)) {look.fontSize = "20px"; look.background = "#425673"; look.color = "rgba(255,255,255,0.8)"}
                return look
            },
        },
    },
    upgrades: {
        "hex1": {
            fullDisplay() {return "<h3>Realm Infusions</h3><br>Unlock new realm mights at the bottom of the might tree.<br><br>Cost: 1e60 Blessings<br><small>[REQ BEING IN HEX]</small>"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hbl.blessings.gte("1e60")},
            pay() {player.hbl.blessings = player.hbl.blessings.sub("1e60")},
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex2": {
            fullDisplay() {return "<h3>Cheaper Refining</h3><br>Refined fragments no longer cost lesser or greater fragments.<br><br>Cost: 180 Refinements<br><small>[REQ BEING IN HEX]</small>"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hre.refinement.gte(180)},
            pay() {player.hre.refinement = player.hre.refinement.sub(180)},
            style() {
                let look = {width: "125px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex3": {
            fullDisplay() {return "<h3>Surpassed Limits</h3><br>Increase realm challenge caps based on true hex.<br>Currently: +" + formatWhole(player.tera.trueHex) + "<br><br>Req: 2 Maxed Challenges<br><small>[REQ BEING IN HEX]</small>"},
            unlocked() {return player.tera.unsealed},
            canAfford() {
                let amt = 0
                for (let i = 11; i < 17; i++) {if (player.hrm.challenges[i] >= 30) amt++}
                return player.h.stage.eq(6) && amt >= 2
            },
            pay() {},
            style() {
                let look = {width: "125px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex4": {
            fullDisplay() {return "<h3>???</h3><br>???.<br><br>Cost: 60 Vexes<br><small>[REQ BEING IN HEX]</small>"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hve.vexTotal.gte(60)},
            pay() {
                player.hve.vexTotal = player.hve.vexTotal.sub(60)
                player.hve.vex = player.hve.vexTotal
                for (i = 0; i < 12; i++) {
                    player.hve.rowCurrent[i] = player.hve.rowCurrent[i] + player.hve.rowSpent[i]
                    player.hve.rowSpent[i] = 0
                }
                for (let i = 0; i < player.hve.upgrades.length; i++) {
                    player.hve.upgrades.splice(i, 1);
                    i--;
                }
            },
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex5": {
            fullDisplay() {return "<h3>Colorful Essences</h3><br>Boost realm essence gain based on hex essence.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 1e18 Realm Essence<br><small>[REQ BEING IN HEX]</small>"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hrm.realmEssence.gte("1e18")},
            pay() {player.hrm.realmEssence = player.hrm.realmEssence.sub("1e18")},
            effect() {return Decimal.pow(1.1, player.tera.hexEssence.add(1).log(6))},
            style() {
                let look = {width: "130px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex6": {
            fullDisplay() {return "<h3>???</h3><br>???.<br><br>Cost: 1e6 ζ-Provenance<br><small>[REQ BEING IN HEX]</small>"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hpr.rank[5].gte(1e6)},
            pay() {player.hpr.rank[5] = player.hpr.rank[5].sub(1e6)},
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex7": {
            fullDisplay() {return "<h3>Foundational Ranks</h3><br>Reduce provenance req's based on ranks.<br>Currently: /" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 6 Hex Essence"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(6)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(6)},
            effect() {return player.r.rank.add(1).log("1e1200").pow(0.6).div(36).add(1)},
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex8": {
            fullDisplay() {return "<h3>Essence Conversion</h3><br>Boost CB-Tickspeed based on hex essence.<br><small>[DOES NOT STACK WITH REALM ESSENCE]</small><br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 216 Hex Essence"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(216)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(216)},
            effect() {return player.tera.hexEssence.add(1).log(6).div(36).add(1)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex9": {
            fullDisplay() {return "<h3>Refined Refiner</h3><br>Increase refiner 4's first effect base by x1.3<br><br>Cost: 46,656 Hex Essence"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(46656)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(46656)},
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex10": {
            fullDisplay() {return "<h3>???</h3><br>???.<br><br>Cost: 6e7 Hex Essence"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(6e7)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(6e7)},
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex11": {
            fullDisplay() {return "<h3>Hexed Curses</h3><br>Boost curses based on hex essence.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 4.7e11 Hex Essence"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(4.7e11)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(4.7e11)},
            effect() {return Decimal.pow(1.5, player.tera.hexEssence.add(1).log(6))},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex12": {
            fullDisplay() {return "<h3>???</h3><br>???.<br><br>Cost: 2.2e16 Hex Essence"},
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(2.2e16)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(2.2e16)},
            style() {
                let look = {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        // ADD A HIVE BUFF

        // HEPT UPGRADES
        // Reduce external penalty based on equipped sins
        //
        //
        // Unlock dark OTFs
        // EXTERNAL UNLOCK/BUFF x2

        // Slightly reduce T2 provenance cost scaling
        // 
        //
        // EXTERNAL UNLOCK/BUFF x3

        // Unlock Rocket Parts (you can equip only one rocket part at a time at first, but there are three potential slots in total. You will start with just one that makes common pets not reset when sent up to space)
    },
    microtabs: {
        "hex": {
            "Color": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-row", [
                        ["raw-html", () => {
                            return "Your current color is<br>#" +
                            getBuyableAmount("tera", "hexRed").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexGreen").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexBlue").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexOpacity").toString(16).padStart(2, '0') +
                            "<br>Which generates +" + formatSimple(player.tera.hexEssencePerSecond, 2) + " HE/s"
                        }, () => {return {color: "white", fontSize: "16px", fontFamily: "monospace"}}],
                    ], {width: "400px", height: "60px", background: "#425673", border: "3px solid #85ade6", borderRadius: "15px"}],
                    ["blank", "15px"],
                    ["row", [
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Red", {color: "#633", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexRed"],
                        ], {width: "225px", height: "140px", backgroundColor: "#f88", border: "3px solid #844", borderRadius: "30px 0 0 0", marginRight: "5px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Green", {color: "#363", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexGreen"],
                        ], {width: "225px", height: "140px", backgroundColor: "#8f8", border: "3px solid #484", borderRadius: "0 30px 0 0"}],
                    ]],
                    ["blank", "5px"],
                    ["row", [
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Blue", {color: "#336", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexBlue"],
                        ], {width: "225px", height: "140px", backgroundColor: "#88f", border: "3px solid #448", borderRadius: "0 0 0 30px", marginRight: "5px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Opacity", {color: "#666", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexOpacity"],
                        ], {width: "225px", height: "140px", backgroundColor: "#fff", border: "3px solid #888", borderRadius: "0 0 30px 0"}],
                    ]],
                    ["blank", "20px"],
                ],
            },
            "Spells": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["bar", "hexEnergy"],
                    ["blank", "10px"],
                    ["style-row", [
                        ["buyable", "hexEnergyBuff"],
                        ["buyable", "hexEnergyCap"],
                        ["buyable", "hexEnergyPrestige"],
                    ], {border: "3px solid #85ade6"}],
                    ["style-row", [
                        ["column", [["clickable", "piositySpell"], ["clickable", "piosityPin"]]],
                        ["buyable", "piosityBuff"],
                        ["buyable", "piosityCost"],
                        ["buyable", "piosityAuto"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["style-row", [
                        ["column", [["clickable", "bewitchSpell"], ["clickable", "bewitchPin"]]],
                        ["buyable", "bewitchBuff"],
                        ["buyable", "bewitchCost"],
                        ["buyable", "bewitchEnhance"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["style-row", [
                        ["column", [["clickable", "chronotachysisSpell"], ["clickable", "chronotachysisPin"]]],
                        ["buyable", "chronotachysisBuff"],
                        ["buyable", "chronotachysisCost"],
                        ["buyable", "chronotachysisDuration"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["blank", "20px"],
                ],
            },
            "Realm Mastery": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["style-column", [
                            ["raw-html", "Realm Challenge Mastery", () => {return {color: "white", fontSize: "24px", fontFamily: "monospace"}}],
                        ], {width: "500px", height: "30px", borderBottom: "3px solid #85ade6"}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Creator Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises rank, tier, tetr, and pent effects by ^1.18<br>" +
                                    "Multiplies factor base by x120<br>" +
                                    "Multiplies check back xp by x" + formatSimple(upgradeEffect("hpw", 1013)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#c44", border: "3px solid #800", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[0]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Higher Plane Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises prestige points gain by ^1.36<br>" +
                                    "Raises tree gain by ^1.24<br>" +
                                    "Multiplies crystals and steel by x" + formatSimple(upgradeEffect("hpw", 1023)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#c84", border: "3px solid #840", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[1]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Death Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises grass gain by ^1.18<br>" +
                                    "Raises golden grass gain by ^1.06<br>" +
                                    "Multiplies pollinators by x" + formatSimple(upgradeEffect("hpw", 1033)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#cc4", border: "3px solid #880", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[2]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Dimension Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises grasshopper gain by ^1.1<br>" +
                                    "Raises mod gain by ^1.1<br>" +
                                    "Multiplies infinity dimensions by x" + formatSimple(upgradeEffect("hpw", 1043)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#4c4", border: "3px solid #080", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[3]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Dream Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises AD and antimatter by ^1.05<br>" +
                                    "Multiplies NIP by x100<br>" +
                                    "Raises mastery point effects by ^" + formatSimple(upgradeEffect("hpw", 1053), 2) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#44c", border: "3px solid #008", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[4]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Void Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Increases crate roll chance by +25%<br>" +
                                    "Triples replicanti multiplier<br>" +
                                    "Multiplies infinity points by x" + formatSimple(upgradeEffect("hpw", 1063)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],

                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#84c", border: "3px solid #408", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[5]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                        ], {width: "500px", height: "540px", background: "#1a222e"}],
                        ["style-column", [
                            ["raw-html", "Obtaining realm mastery requires you to reach 30 clears.<br>Realm mastery effects do not stack with realm mights.<br>Realm mastery is kept on Tera resets.", () => {return {color: "white", fontSize: "14px", fontFamily: "monospace"}}],
                        ], {width: "500px", height: "60px", borderTop: "3px solid #85ade6"}],
                    ], {width: "500px", height: "636px", background: "#425673", border: "3px solid #85ade6", borderRadius: "15px"}],
                    ["blank", "20px"],
                ],
            },
        },
        "stuff": {
            "hex": {
                unlocked: true,
                content: [
                    ["always-scroll-column", [
                        ["blank", "25px"],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "True Hex"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
                            ], {width: "500px", height: "47px", borderBottom: "3px solid #85ade6"}],
                            ["clickable", 106],
                            ["style-column", [
                                ["raw-html", "Hex Universe Exclusives<hr>", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                                ["blank", "5px"],
                                ["raw-html", "Hex of Realms", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "No Tier Backlashes", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "500px", height: "87px", borderTop: "3px solid #85ade6"}]
                        ], {width: "500px", height: "200px", backgroundColor: "#425673", border: "3px solid #85ADE6", borderRadius: "20px"}],
                        ["blank", "10px"],
                        ["row", [
                            ["raw-html", () => {return "You are at <h3>" + formatWhole(player.tera.trueHex) + "</h3> true hex."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatWhole(player.tera.trueHexGain) + ")"}, () => {
                                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.trueHexGain.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                            //["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                        ]],
                        ["raw-html", () => {return player.tera.trueHex.gte(6) ? "Boosts uni-alpha tickspeed by x" + formatSimple(player.tera.trueHexEffect, 2) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ["blank", "10px"],
                        ["clickable", "hexReset"],
                        ["blank", "10px"],
                        ["tooltip-row", [
                            ["raw-html", () => {return "You have <h3>" + formatSimple(player.tera.hexEssence) + "</h3> hex essence."}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatSimple(player.tera.hexEssencePerSecond, 2) + "/s)"}, () => {
                                let look = {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.hexEssencePerSecond.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                            ["raw-html", () => {return "<div class='bottomTooltip'>Formula<hr><small>(((6*Red)<sup>(True Hex*Green)-1</sup>)*Blue/60)<sup>Opacity</sup></small></div>"}],
                        ]],
                        ["raw-html", () => {return player.tera.trueHex.gte(4) ? "Boosts hex energy gain by x" + formatSimple(player.tera.hexEssenceEffect, 2) : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["blank", "10px"],
                        ["microtabs", "hex", {borderWidth: "0px"}],

                        /*
                        It is going to revolve around using hex essence (gained based on your true hex) to buy three resources with different mechanics that work together.
                        First is Hex (color), which will be upgrades themed on hex colors.
                        Second is Hex (number), which is hexadecimal themed buffs towards the formula to gain hex essence.
                        Third is Hex (spell), which are active abilities to boost both hex essence gain and uni-alpha resource gain.
                        */
                        // Three increasing resources (in the style of neutrons from matter dimensions). All named hex with paranthesis with the 3 meanings of hex (color, number, spell)
                    ], {width: "597px", height: "720px", background: "#273345"}],
                ],
            },
            "hept": {
                unlocked() {return player.tera.unsealed},
                content: [
                    ["always-scroll-column", [
                        ["blank", "25px"],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "True Hept"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
                            ], {width: "500px", height: "47px", borderBottom: "3px solid #95A6DD"}],
                            ["clickable", 107],
                            ["style-column", [
                                ["raw-html", "Hept Universe Exclusives<hr>", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                                ["blank", "5px"],
                                ["raw-html", "Hept of Sins", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "3 Tier Backlashes", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div>[External, Pre-Power, Power]</div>", {color: "white", fontSize: "12px", fontFamily: "monospace",}],
                            ], {width: "500px", height: "87px", borderTop: "3px solid #95A6DD"}]
                        ], {width: "500px", height: "200px", backgroundColor: "#4a536e", border: "3px solid #95A6DD", borderRadius: "20px"}],
                        ["blank", "10px"],
                        ["row", [
                            ["raw-html", () => {return "You are at <h3>" + formatWhole(player.tera.trueHept) + "</h3> true hept."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatWhole(player.tera.trueHeptGain) + ")"}, () => {
                                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.trueHeptGain.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                            //["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                        ]],
                        ["blank", "10px"],
                        ["clickable", "heptReset"],
                        ["blank", "5px"],
                    ], {width: "597px", height: "720px", background: "#2c3142"}],
                ],
            },
            // Upgrade grid of 5x5 for pent perhaps? (in the vein of tree game rewritten)
            // Keep Project Claustrophoia's double compacted boxes in mind
            // Absolute button simulator for hept+ maybe?
            // Circular 9 grid of buyables should be used
            // Keep kaizo incremental in mind as a simple minigame here
        },
        "tabs": {
            "trueTiers": {
                unlocked: true,
                content: [
                    ["style-row", [
                        ["style-column", [
                            ["clickable", 1], ["clickable", 2], ["clickable", 3], ["clickable", 4], ["clickable", 5], ["clickable", 6],
                            ["clickable", 7], ["clickable", 8], ["clickable", 9], ["clickable", 10], ["clickable", 11], ["clickable", 12],
                        ], {width: "200px", height: "720px"}],
                        ["style-column", [
                            ["buttonless-microtabs", "stuff", {borderWidth: "0"}],
                        ], {width: "597px", height: "720px", borderLeft: "3px solid #5085d8"}],
                    ], {width: "800px", height: "720px", border: "3px solid #5085D8"}],
                ],
            },
            "upgrades": {
                unlocked: true,
                content: [
                    ["always-scroll-column", [
                        ["style-column", [
                            ["raw-html", "Any upgrades effecting Uni-Alpha are counted as external effects.", {color: "rgba(255,255,255,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "800px", height: "30px", background: "linear-gradient(to right, #425673, #4a536e)", borderTop: "3px solid #273345", borderLeft: "3px solid #273345", borderRight: "3px solid #273345", boxSizing: "border-box"}],
                        ["style-column", [
                            ["raw-html", "Uni-Alpha: Hex", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "800px", height: "40px", background: "#85ADE6", borderTop: "3px solid #273345", borderBottom: "3px solid #273345"}],
                        ["style-row", [
                            ["upgrade", "hex1"], ["upgrade", "hex2"], ["upgrade", "hex3"], ["upgrade", "hex4"], ["upgrade", "hex5"], ["upgrade", "hex6"],
                            ["upgrade", "hex7"], ["upgrade", "hex8"], ["upgrade", "hex9"], ["upgrade", "hex10"], ["upgrade", "hex11"], ["upgrade", "hex12"],
                        ], {width: "785px", height: "250px", background: "repeating-linear-gradient(135deg, #5d79a1 0px, #5d79a1 20px, #425673 20px, #425673 40px)", paddingRight: "15px"}],
                        ["style-column", [
                            ["raw-html", "Uni-Alpha: Hept", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "800px", height: "40px", background: "#95A6DD", borderTop: "3px solid #2c3142", borderBottom: "3px solid #2c3142"}],
                        ["style-row", [

                        ], {width: "785px", height: "250px", background: "repeating-linear-gradient(135deg, #68749a 0px, #68749a 20px, #4a536e 20px, #4a536e 40px)", paddingRight: "15px", borderBottom: "3px solid #2c3142"}],
                    ], {width: "800px", height: "720px", background: "repeating-linear-gradient(135deg, #141b24 0px, #141b24 20px, #0d1117 20px, #0d1117 40px)", border: "3px solid #5085D8"}],
                ],
            },
        },
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["style-row", [["raw-html", () => {return layers.h.effects()}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}]], {lineHeight: "1"}],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "25px"],
        ["style-column", [
            ["style-row", [
                ["clickable", "trueTiers"], ["clickable", "upgrades"],
            ], {width: "800px", height: "50px", background: "#28426c", border: "3px solid #5085D8", borderRadius: "20px 20px 0 0", marginBottom: "-3px"}],
            ["buttonless-microtabs", "tabs", {borderWidth: "0"}],
            ["style-row", [], {width: "800px", height: "20px", background: "#28426c", border: "3px solid #5085D8", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
        ], () => {return player.tera.unsealed ? {} : {display: "none !important"}}],
        ["style-column", [
            ["row", [["clickable", "seal1"], ["blank", ["200px", "10px"]], ["clickable", "seal2"]]],
            ["style-row", [["style-row", [["clickable", "seal3"]], {width: "150px", height: "150px"}], ["blank", ["50px", "10px"]], ["clickable", "sealCenter"], ["blank", ["50px", "10px"]], ["style-row", [["clickable", "seal4"]], {width: "150px", height: "150px"}]], {height: "200px"}],
            ["row", [["clickable", "seal5"], ["blank", ["200px", "10px"]], ["clickable", "seal6"]]],
        ], () => {return !player.tera.unsealed ? {width: "700px", height: "700px", background: "radial-gradient(rgba(0,0,0,1), #13192200)", border: "10px solid #28426c88", borderRadius: "35%"} : {display: "none !important"}}],
    ],
    layerShown() { return getBuyableAmount("hpw", 7).gt(0) || player.tera.trueHex.gt(0) }, // Decides if this node is shown or not.
});
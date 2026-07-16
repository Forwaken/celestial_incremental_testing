addNode("piositySpell", {
    name() {return "<h2>🙏</h2>"},
    symbol() {return "🙏"},
    tooltip() {return "<h3>Piosity</h3><br>Increases blessings by +" + formatWhole(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))) + "x during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>" + formatSimple(player.tera.hexEnergy) + "/" + formatSimple(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement))) + " Hex-Energy"},
    tooltipLocked() {return "<h3>Piosity</h3><br>Increases blessings by +" + formatWhole(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))) + "x during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>" + formatSimple(player.tera.hexEnergy) + "/" + formatSimple(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement))) + " Hex-Energy"},
    canClick() {return player.tera.hexEnergy.gte(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))},
    layerShown() {return player.tera.clickables["piosityPin"]},
    onClick() {
        if (this.canClick()) {
            player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))
                if (player.tera.trueHex.gte(15)) player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).add(1).mul(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).add(1)
                else player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).pow(1/0.9).add(1).pow(0.9).mul(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).add(1)
        }
    },
    nodeStyle() {
        let look = {width: "60px !important", height: "60px !important", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "10px"}
        this.canClick() ? look.background = "radial-gradient(#b38600, #ffbf00)" : look.background = "#4c3900"
        return look
    },
})
addNode("bewitchSpell", {
    name() {return "<h2>🔮</h2>"},
    symbol() {return "🔮"},
    tooltip() {
        let str = "<h3>Bewitch</h3><br>Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " free Δ-jinxes<br>"
        if (getBuyableAmount("tera", "bewitchEnhance").gte(1)) str = str.concat("Improve B-jinx by " + formatSimple(buyableEffect("tera", "bewitchBuff").mul(5)) + "%<br>")
        if (getBuyableAmount("tera", "bewitchEnhance").gte(2)) str = str.concat("Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " effective vexes<br>")
        return str.concat("<br>" + formatSimple(Decimal.div(0.3, buyableEffect("tera", "bewitchCost")), 3) + " Hex-Energy per second")
    },
    tooltipLocked() {
        let str = "<h3>Bewitch</h3><br>Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " free Δ-jinxes<br>"
        if (getBuyableAmount("tera", "bewitchEnhance").gte(1)) str = str.concat("Improve B-jinx by " + formatSimple(buyableEffect("tera", "bewitchBuff").mul(5)) + "%<br>")
        if (getBuyableAmount("tera", "bewitchEnhance").gte(2)) str = str.concat("Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " effective vexes<br>")
        return str.concat("<br>" + formatSimple(Decimal.div(0.3, buyableEffect("tera", "bewitchCost")), 3) + " Hex-Energy per second")
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
    name() {return "<h2>⏳</h2>"},
    symbol() {return "⏳"},
    tooltip() {return "<h3>Chronotachysis</h3><br>Increases uni-alpha tickspeed by x" + formatSimple(buyableEffect("tera", "chronotachysisBuff").mul(Decimal.pow(12, player.tera.spellEnhancement))) + " for " + formatTime(Decimal.add(60, buyableEffect("tera", "chronotachysisDuration").sub(1))) + "<br>Currently: x" + formatSimple(buyableEffect("tera", "chronotachysisBuff").mul(Decimal.pow(12, player.tera.chronotachysisSpell[1]))) + " for " + formatTime(player.tera.chronotachysisSpell[0]) + "<br><br>" + formatSimple(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement))) + " Hex-Energy"},
    tooltipLocked() {return "<h3>Chronotachysis</h3><br>Increases uni-alpha tickspeed by x" + formatSimple(buyableEffect("tera", "chronotachysisBuff").mul(Decimal.pow(12, player.tera.spellEnhancement))) + " for " + formatTime(Decimal.add(60, buyableEffect("tera", "chronotachysisDuration").sub(1))) + "<br>Currently: x" + formatSimple(buyableEffect("tera", "chronotachysisBuff").mul(Decimal.pow(12, player.tera.chronotachysisSpell[1]))) + " for " + formatTime(player.tera.chronotachysisSpell[0]) + "<br><br>" + formatSimple(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement))) + " Hex-Energy"},
    canClick() {return player.tera.hexEnergy.gte(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))},
    layerShown() {return player.tera.clickables["chronotachysisPin"]},
    onClick() {
        if (this.canClick()) {
            player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))
            let duration = player.tera.chronotachysisSpell[0]
            duration = duration.mul(Decimal.pow(12, player.tera.chronotachysisSpell[1].sub(player.tera.spellEnhancement)))
            duration = duration.add(buyableEffect("tera", "chronotachysisDuration").sub(1).add(60))
            player.tera.chronotachysisSpell = [duration, player.tera.spellEnhancement]
        }
    },
    nodeStyle() {
        let look = {width: "60px !important", height: "60px !important", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "10px"}
        this.canClick() ? look.background = "linear-gradient(0deg, #0d66e1, #0098E5, #0d66e1)" : look.background = "#004c72"
        return look
    },
})
addLayer("tera", {
    name: "Tera, Celestial of Tiers",
    symbol: "目", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Tera, the Celestial of Tiers", // Decides the nodes tooltip
    color: "#6D9BE0", // Decides the nodes color.
    nodeStyle() {
        if (!player.tera.unsealed) return {background: "linear-gradient(135deg, #425673, #28426c)", borderColor: "#002355", color: "#002355"}
        return {background: "linear-gradient(135deg, #85ADE6, #5085D8)", borderColor: "#0046AA", color: "#0046AA"}
    }, // Decides the nodes style, in CSS format.
    branches: [], // Decides the nodes branches.
    startData() { return {
        sinceTera: new Decimal(0),

        // =- TRUE HEX -=
        trueHex: new Decimal(0),
        trueHexReq: new Decimal(1e60),
        trueHexGain: new Decimal(0),
        trueHexEffect: new Decimal(1),

        hexEssence: new Decimal(0),
        hexEssencePerSecond: new Decimal(0),
        hexEssenceSoftcap: new Decimal(1),
        hexEssenceEffect: new Decimal(1),

        hexEnergy: new Decimal(0),
        hexEnergyCap: new Decimal(10),
        hexEnergyGain: new Decimal(0),

        piositySpell: new Decimal(1),
        piosityAuto: new Decimal(0),
        chronotachysisSpell: [new Decimal(0), new Decimal(2)], // Duration / Multiplier
        spellEnhancement: new Decimal(0),

        realmMastery: [false, false, false, false, false, false],

        // =- TRUE HEPT -=
        trueHept: new Decimal(0),
        trueHeptReq: new Decimal(1e70),
        trueHeptGain: new Decimal(0),

        heptEssence: new Decimal(0),
        heptEssencePerSecond: new Decimal(0),

        virtue: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        virtueGain: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        virtueReq: {0: new Decimal(0), 1: new Decimal(0), 2: new Decimal(0), 3: new Decimal(0), 4: new Decimal(0), 5: new Decimal(0), 6: new Decimal(0)},
        virtueEssence: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        virtueEssenceGain: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        virtueEffects: [
            [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
            [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
            [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
            [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)]],
        virtueUnlocks: [false, false, false, false, false, false, false],

        sinMastery: [false, false, false, false, false, false, false],

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
        player.tera.trueHexEffect = player.tera.trueHex.gte(10) ? Decimal.pow(7/6, player.tera.trueHex.sub(5)) : new Decimal(1)

        player.tera.hexEssencePerSecond = player.tera.trueHex.gt(0) ? Decimal.pow(Decimal.mul(6, buyableEffect("tera", "hexRed")), player.tera.trueHex.mul(buyableEffect("tera", "hexGreen")).sub(1)).mul(buyableEffect("tera", "hexBlue")).div(60).add(1).pow(buyableEffect("tera", "hexOpacity")).sub(1) : new Decimal(0)

        let softcapStart = new Decimal(1e6)
        if (hasUpgrade("tera", "hex12")) softcapStart = softcapStart.mul(upgradeEffect("tera", "hex12"))
        player.tera.hexEssenceSoftcap = player.tera.hexEssencePerSecond.gte(softcapStart) ? Decimal.div(0.6, player.tera.hexEssencePerSecond.div(1e6).add(1).log(1e6).pow(0.6).max(1)) : new Decimal(1)
        if (player.tera.trueHex.gte(5) && player.tera.hexEssenceSoftcap.lt(1)) player.tera.hexEssenceSoftcap = Decimal.div(0.6, player.tera.hexEssencePerSecond.div(1e6).add(1).log(1e6).pow(0.3).max(1))
        player.tera.hexEssencePerSecond = player.tera.hexEssencePerSecond.div(softcapStart).pow(player.tera.hexEssenceSoftcap).mul(softcapStart)
        player.tera.hexEssence = player.tera.hexEssence.add(player.tera.hexEssencePerSecond.mul(delta))

        player.tera.hexEssenceEffect = player.tera.trueHex.gte(4) ? Decimal.pow(1.01, player.tera.hexEssence.add(1).log(6)) : new Decimal(1)

        player.tera.hexEnergyCap = new Decimal(9).add(buyableEffect("tera", "hexEnergyCap"))
        player.tera.hexEnergyGain = Decimal.pow(2, player.tera.trueHex.sub(1)).div(100).mul(buyableEffect("tera", "hexEnergyBuff")).mul(player.tera.hexEssenceEffect)
        if (hasUpgrade("tera", "hex8")) player.tera.hexEnergyGain = player.tera.hexEnergyGain.mul(upgradeEffect("tera", "hex8"))

        if (getBuyableAmount("tera", "piosityAuto").gt(0)) player.tera.piosityAuto = player.tera.piosityAuto.sub(delta)

        if (player.tera.piosityAuto.lte(0)) {
            player.tera.piosityAuto = buyableEffect("tera", "piosityAuto")
            player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement)).max(0.001)).pow(1/0.9).add(1).pow(0.9).mul(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement)).max(0.001)).add(1)
        }
        
        if (player.tera.clickables["bewitchSpell"]) player.tera.hexEnergyGain = player.tera.hexEnergyGain.sub(Decimal.div(0.3, buyableEffect("tera", "bewitchCost")))
        if (player.tera.trueHex.gte(1)) player.tera.hexEnergy = player.tera.hexEnergy.add(player.tera.hexEnergyGain.mul(delta)).min(player.tera.hexEnergyCap).max(0)

        if (player.tera.clickables["bewitchSpell"] && player.tera.hexEnergy.lte(0)) player.tera.clickables["bewitchSpell"] = false

        if (player.tera.chronotachysisSpell[1].modulo(1).neq(0)) player.tera.chronotachysisSpell[1] = new Decimal(0)
        if (player.tera.chronotachysisSpell[0].gt(0)) player.tera.chronotachysisSpell[0] = player.tera.chronotachysisSpell[0].sub(delta).max(0)
        
        // TRUE HEPT CONTENT
        player.tera.trueHeptReq = Decimal.pow(1e7, player.tera.trueHept).mul(1e70)
        player.tera.trueHeptGain = player.hpw.power.add(1).div(1e70).ln().div(Decimal.ln(1e7)).add(1).sub(player.tera.trueHept).floor().max(0)

        player.tera.heptEssencePerSecond = player.tera.trueHept.gt(0) ? Decimal.pow(7, player.tera.trueHept.sub(1)).div(7) : new Decimal(0)
        for (let i = 0; i < 7; i++) {
            player.tera.heptEssencePerSecond = player.tera.heptEssencePerSecond.mul(player.tera.virtueEffects[i][0])
        }
        if (hasUpgrade("tera", "hept8")) player.tera.heptEssencePerSecond = player.tera.heptEssencePerSecond.mul(upgradeEffect("tera", "hept8"))

        player.tera.heptEssence = player.tera.heptEssence.add(player.tera.heptEssencePerSecond.mul(delta))

        player.tera.virtueReq[0] = layers.h.hexReq(player.tera.virtue[0], 1, 1.7, new Decimal(1))
        player.tera.virtueGain[0] = layers.h.hexGain(player.tera.heptEssence, 1, 1.7, new Decimal(1)).sub(player.tera.virtue[0]).max(0)
        player.tera.virtueEssenceGain[0] = player.tera.virtue[0].div(7).pow(1.3)
        player.tera.virtueEffects[0][0] = player.tera.virtueEssence[0].gte(1) ? player.tera.virtueEssence[0].pow(0.35).div(10).add(1) : new Decimal(1)
        player.tera.virtueEffects[0][1] = player.tera.virtueEssence[0].gte(49) ? Decimal.pow(2, player.tera.virtueEssence[0].div(49).add(1).log(7).pow(0.7)) : new Decimal(1)
        if (!player.tera.virtueUnlocks[0] && player.tera.virtueEssence[0].gte(3500)) player.tera.virtueUnlocks[0] = true
        if (player.tera.trueHept.gte(2)) player.tera.virtue[0] = player.tera.virtue[0].add(player.tera.virtueGain[0])
        player.tera.virtueReq[1] = layers.h.hexReq(player.tera.virtue[1], 7, 1.5, new Decimal(1))
        player.tera.virtueGain[1] = layers.h.hexGain(player.tera.virtue[0], 7, 1.5, new Decimal(1)).sub(player.tera.virtue[1]).max(0)
        player.tera.virtueEssenceGain[1] = player.tera.virtue[1].div(6).pow(1.28)
        player.tera.virtueEffects[1][0] = player.tera.virtueEssence[1].gte(1) ? player.tera.virtueEssence[1].pow(0.38).div(9).add(1) : new Decimal(1)
        player.tera.virtueEffects[1][1] = player.tera.virtueEssence[1].gte(49) ? Decimal.pow(3, player.tera.virtueEssence[1].div(49).add(1).log(7).pow(0.7)) : new Decimal(1)
        if (!player.tera.virtueUnlocks[1] && player.tera.virtueEssence[1].gte(14000)) player.tera.virtueUnlocks[1] = true
        if (player.tera.trueHept.gte(4)) player.tera.virtue[1] = player.tera.virtue[1].add(player.tera.virtueGain[1])
        player.tera.virtueReq[2] = layers.h.hexReq(player.tera.virtue[2], 14, 1.45, new Decimal(1))
        player.tera.virtueGain[2] = layers.h.hexGain(player.tera.virtue[1], 14, 1.45, new Decimal(1)).sub(player.tera.virtue[2]).max(0)
        player.tera.virtueEssenceGain[2] = player.tera.virtue[2].div(5).pow(1.26)
        player.tera.virtueEffects[2][0] = player.tera.virtueEssence[2].gte(1) ? player.tera.virtueEssence[2].pow(0.41).div(8).add(1) : new Decimal(1)
        player.tera.virtueEffects[2][1] = player.tera.virtueEssence[2].gte(49) ? player.tera.virtueEssence[2].div(7).add(1).log(7).pow(0.7).floor() : new Decimal(0)
        if (!player.tera.virtueUnlocks[2] && player.tera.virtueEssence[2].gte(70000)) player.tera.virtueUnlocks[2] = true
        player.tera.virtueReq[3] = layers.h.hexReq(player.tera.virtue[3], 21, 1.4, new Decimal(1))
        player.tera.virtueGain[3] = layers.h.hexGain(player.tera.virtue[2], 21, 1.4, new Decimal(1)).sub(player.tera.virtue[3]).max(0)
        player.tera.virtueEssenceGain[3] = player.tera.virtue[3].div(4).pow(1.24)
        player.tera.virtueEffects[3][0] = player.tera.virtueEssence[3].gte(1) ? player.tera.virtueEssence[3].pow(0.44).div(7).add(1) : new Decimal(1)
        player.tera.virtueEffects[3][1] = player.tera.virtueEssence[3].gte(49) ? Decimal.pow(2.5, player.tera.virtueEssence[3].div(49).add(1).log(7).pow(0.7)) : new Decimal(1)
        if (!player.tera.virtueUnlocks[3] && player.tera.virtueEssence[3].gte(350000)) player.tera.virtueUnlocks[3] = true
        player.tera.virtueReq[4] = layers.h.hexReq(player.tera.virtue[4], 28, 1.35, new Decimal(1))
        player.tera.virtueGain[4] = layers.h.hexGain(player.tera.virtue[3], 28, 1.35, new Decimal(1)).sub(player.tera.virtue[4]).max(0)
        player.tera.virtueEssenceGain[4] = player.tera.virtue[4].div(3).pow(1.22)
        player.tera.virtueEffects[4][0] = player.tera.virtueEssence[4].gte(1) ? player.tera.virtueEssence[4].pow(0.47).div(6).add(1) : new Decimal(1)
        player.tera.virtueEffects[4][1] = player.tera.virtueEssence[4].gte(49) ? Decimal.pow(1.2, player.tera.virtueEssence[4].div(49).add(1).log(7).pow(0.7)) : new Decimal(1)
        player.tera.virtueReq[5] = layers.h.hexReq(player.tera.virtue[5], 35, 1.3, new Decimal(1))
        player.tera.virtueGain[5] = layers.h.hexGain(player.tera.virtue[4], 35, 1.3, new Decimal(1)).sub(player.tera.virtue[5]).max(0)
        player.tera.virtueEssenceGain[5] = player.tera.virtue[5].div(2).pow(1.2)
        player.tera.virtueEffects[5][0] = player.tera.virtueEssence[5].gte(1) ? player.tera.virtueEssence[5].pow(0.5).div(5).add(1) : new Decimal(1)
        player.tera.virtueEffects[5][1] = player.tera.virtueEssence[5].gte(49) ? Decimal.pow(1.5, player.tera.virtueEssence[5].div(49).add(1).log(7).pow(0.7)) : new Decimal(1)
        if (!player.tera.virtueUnlocks[5] && player.tera.virtueEssence[5].gte(7000000)) player.tera.virtueUnlocks[5] = true
        player.tera.virtueReq[6] = layers.h.hexReq(player.tera.virtue[6], 42, 1.25, new Decimal(1))
        player.tera.virtueGain[6] = layers.h.hexGain(player.tera.virtue[5], 42, 1.25, new Decimal(1)).sub(player.tera.virtue[6]).max(0)
        player.tera.virtueEssenceGain[6] = player.tera.virtue[6].pow(1.18)
        player.tera.virtueEffects[6][0] = player.tera.virtueEssence[6].gte(1) ? player.tera.virtueEssence[6].pow(0.53).div(4).add(1) : new Decimal(1)
        player.tera.virtueEffects[6][1] = player.tera.virtueEssence[6].gte(49) ? Decimal.pow(1.1, player.tera.virtueEssence[6].div(49).add(1).log(7).pow(0.7)) : new Decimal(1)

        for (let i = 0; i < 7; i++) {
            player.tera.virtueEssence[i] = player.tera.virtueEssence[i].add(player.tera.virtueEssenceGain[i].mul(delta))
        }
    },
    teraReset(type) {
        // TERA
        player.tera.sinceTera = new Decimal(0)
        player.tera.piositySpell = new Decimal(1)

        // SIN
        player.sins.envy = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.wrath = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.lust = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.gluttony = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.sloth = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.greed = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.pride = [new Decimal(1), new Decimal(1), new Decimal(1)]
        player.sins.sinUsed = [false, false, false, false, false, false, false]
        player.sins.clickables = {}

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
        if (player.hsa.autoSac >= 0) player.hsa.autoSac = -1

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
        player.hcu.jinxedJinx = new Decimal(0)
        player.hcu.jinxedJinxEffects = [new Decimal(1), new Decimal(1), new Decimal(0)]

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
            if (!(player.tera.virtueUnlocks[3] && Decimal.lte(+player.hre.milestones[i], player.tera.trueHept))) {
                player.hre.milestones.splice(i, 1);
                i--;
            }
        }
        
        // TEMPERING
        player.hte.temperer = new Decimal(0)
        player.hte.tempererPerSec = new Decimal(0)
        for (let i in player.hte.buyables) {
            player.hte.buyables[i] = new Decimal(0)
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
            width: 705,
            height: 40,
            progress() {
                return player.tera.hexEnergy.div(player.tera.hexEnergyCap)
            },
            baseStyle: {backgroundColor: "rgba(0,0,0,0.5)"},
            fillStyle: {backgroundColor: "#425673", borderRadius: "17px 17px 0 0"},
            borderStyle: {
                border: "3px solid #85ade6",
                borderRadius: "20px 20px 0 0",
            },
            display() {
                if (player.tera.hexEnergyGain.lt(0)) return formatSimple(player.tera.hexEnergy, 2) + "/" + formatSimple(player.tera.hexEnergyCap) + " Hex Energy<br><small>[-" + formatSimple(player.tera.hexEnergyGain.abs(), 2) + "/s]</small>"
                return formatSimple(player.tera.hexEnergy, 2) + "/" + formatSimple(player.tera.hexEnergyCap) + " Hex Energy<br><small>[" + formatSimple(player.tera.hexEnergyGain, 2) + "/s]</small>"
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
            onClick() {
                if (!hasAchievement("achievements", 1401)) completeAchievement("achievements", 1401)
                player.tera.unsealed = true
                player.tera.trueHex = player.tera.trueHex.add(1)
                layers.tera.teraReset()
                player.h.stage = new Decimal(7)
            },
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
            canClick: true,
            unlocked() {return false},
            onClick() {

            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#ADE685", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        2: {
            title() {return false ? "<h3>True Rank</h3>" : "<h3>???</h3>"},
            canClick: true,
            unlocked() {return false},
            onClick() {

            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#A5DB98", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        3: {
            title() {return false ? "<h3>True Tier</h3>" : "<h3>???</h3>"},
            canClick: true,
            unlocked() {return false},
            onClick() {

            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#9DCFAC", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        4: {
            title() {return false ? "<h3>True Tetr</h3>" : "<h3>???</h3>"},
            canClick: true,
            unlocked() {return false},
            onClick() {

            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#95C4BF", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        5: {
            title() {return false ? "<h3>True Pent</h3>" : "<h3>???</h3>"},
            canClick: true,
            unlocked() {return false},
            onClick() {

            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#8DB8D3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        6: {
            title() {
                return "<h3>True Hex</h3><br>" + formatWhole(player.tera.trueHex) + "<br><small>[Req: " + formatWhole(player.tera.trueHexReq) + " Power]"
            },
            canClick: true,
            unlocked() {return player.tera.unsealed},
            onClick() {
                player.subtabs["tera"]["stuff"] = "hex"
            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#85ADE6", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "20px", margin: "2px"},
        },
        7: {
            title() {return "<h3>True Hept</h3><br>" + formatWhole(player.tera.trueHept) + "<br><small>[Req: " + formatWhole(player.tera.trueHeptReq) + " Power]"},
            canClick: true,
            unlocked() {return player.tera.unsealed},
            onClick() {
                player.subtabs["tera"]["stuff"] = "hept"
            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#95A6DD", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "20px", margin: "2px"},
        },
        8: {
            title() {return false ? "<h3>True Oct</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked() {return false},
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
            unlocked() {return false},
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
            unlocked() {return false},
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
            unlocked() {return false},
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
            unlocked() {return false},
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#E685AD", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        106: {
            title() {return !player.tera.virtueUnlocks[0] ? "<h2>CURRENTLY SEALED</h2><br><h3>[Perhaps a virtuous power could break this seal?]</h3>" : player.h.stage.neq(6) ? (Decimal.gt(player.tera.clickables[106], 0) ? "<h2>Are you sure?</h2><br><h3>[Resets ALL previous Uni-α content]</h3>" : "<h2>Switch to Hex Universe</h2><br><h3>[Resets ALL previous Uni-α content]</h3>") : "<h2>Switch to Hex Universe</h2><br><h3>[ALREADY IN HEX UNIVERSE]</h3>"},
            canClick() {return player.h.stage.neq(6) && player.tera.virtueUnlocks[0]},
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
                let look = {width: "397px", minHeight: "60px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0 0 0 17px"}
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
                let look = {width: "397px", minHeight: "60px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0 0 0 17px"}
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
                if (player.tera.trueHex.eq(2)) str = str.concat("<br>At true hex 3, unlock spell enhancement.") // ADDED
                if (player.tera.trueHex.eq(3)) str = str.concat("<br>At true hex 4, unlock a hex essence effect.") // ADDED
                if (player.tera.trueHex.eq(4)) str = str.concat("<br>At true hex 5, reduce hex essence's softcap.") // ADDED
                if (player.tera.trueHex.eq(5)) str = str.concat("<br>At true hex 6, unlock bulk true hexing.") // ADDED
                if (player.tera.trueHex.eq(6)) str = str.concat("<br>At true hex 7, unlock the fourth hex spell.<br>[NOT IMPLEMENTED]")
                if (player.tera.trueHex.eq(7)) str = str.concat("<br>At true hex 8, unlock the third set of spell buyables.") // ADDED
                if (player.tera.trueHex.gte(8) && player.tera.trueHex.lt(10)) str = str.concat("<br>At true hex 10, unlock a true hex effect.") // ADDED
                if (player.tera.trueHex.gte(9) && player.tera.trueHex.lt(12)) str = str.concat("<br>At true hex 12, unlock the fifth new hex spell.<br>[NOT IMPLEMENTED]")
                if (player.tera.trueHex.gte(12) && player.tera.trueHex.lt(15)) str = str.concat("<br>At true hex 15, improve piosity's spell formula.") // ADDED
                if (player.tera.trueHex.gte(15) && player.tera.trueHex.lt(18)) str = str.concat("<br>At true hex 18, unlock the sixth hex spell.<br>[NOT IMPLEMENTED]")
                return str

                // Realm Essence Per Second (x20 gain per second)
            },
            canClick() {return player.h.stage.eq(6) && player.hpw.power.gte(player.tera.trueHexReq)},
            unlocked: true,
            onClick() {
                if (player.tera.trueHex.gte(6)) player.tera.trueHex = player.tera.trueHex.add(player.tera.trueHexGain)
                else player.tera.trueHex = player.tera.trueHex.add(1)

                layers.tera.teraReset()
            },
            style() {
                let look = {width: "550px", minHeight: "100px", lineHeight: "1.3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        "heptReset": {
            title() {
                let str = "<h2>Reset ALL previous content for true hepts</h2><br>"
                if (player.h.stage.eq(7)) str = str.concat("<h3>Req: " + formatWhole(player.tera.trueHeptReq) + " Power</h3>")
                else str = str.concat("<h3>[ONLY POSSIBLE WHEN Uni-α IS HEPT]</h3>")
                if (player.tera.trueHept.eq(0)) str = str.concat("<br>At true hept 1, unlock true hept content.") // ADDED
                if (player.tera.trueHept.eq(1)) str = str.concat("<br>At true hept 2, automate kindness gain.") // ADDED
                if (player.tera.trueHept.eq(2)) str = str.concat("<br>At true hept 3, essence of kindness is no longer reset.") // ADDED
                if (player.tera.trueHept.eq(3)) str = str.concat("<br>At true hept 4, automate patience gain.") // ADDED
                if (player.tera.trueHept.eq(6)) str = str.concat("<br>At true hept 7, unlock bulk true hepting.") // ADDED
                // Automate Chastity Gain
                // Automate Temperance Gain
                // Automate Diligence Gain
                // Automate Charity Gain
                // Automate Humility Gain
                return str
            },
            canClick() {return player.h.stage.eq(7) && player.hpw.power.gte(player.tera.trueHeptReq)},
            unlocked: true,
            onClick() {
                if (player.tera.trueHept.gte(7)) player.tera.trueHept = player.tera.trueHept.add(player.tera.trueHeptGain)
                else player.tera.trueHept = player.tera.trueHept.add(1)

                layers.tera.teraReset()
            },
            style() {
                let look = {width: "550px", minHeight: "100px", lineHeight: "1.3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        "piositySpell": {
            title() {return "<h3>Piosity</h3><br>Increases blessings by +" + formatWhole(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))) + "x during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>" + formatSimple(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement))) + " Hex-Energy"},
            tooltip: "Benefits slightly decay over increased use.",
            canClick() {return player.tera.hexEnergy.gte(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))},
            unlocked: true,
            onClick() {
                player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.div(5, buyableEffect("tera", "piosityCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))
                if (player.tera.trueHex.gte(15)) player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).add(1).mul(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).add(1)
                else player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).pow(1/0.9).add(1).pow(0.9).mul(buyableEffect("tera", "piosityBuff").sub(1).mul(Decimal.pow(12, player.tera.spellEnhancement))).add(1)
            },
            style() {
                let look = {width: "180px", minHeight: "120px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "radial-gradient(#cc9900, #ffbf00)" : look.background = "#bf8f8f"
                return look
            },
        },
        "piosityPin": {
            title() {return player.tera.clickables["piosityPin"] ? "<small>Unpin</small><br>📌" : "Pin<br>📌"},
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
                let look = {width: "51px", minHeight: "120px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["piosityPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
        "bewitchSpell": {
            title() {
                let str = "<h3>Bewitch</h3><br>Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " free Δ-jinxes<br>"
                if (getBuyableAmount("tera", "bewitchEnhance").gte(1)) str = str.concat("Improve B-jinx by " + formatSimple(buyableEffect("tera", "bewitchBuff").mul(5)) + "%<br>")
                if (getBuyableAmount("tera", "bewitchEnhance").gte(2)) str = str.concat("Gain " + formatWhole(buyableEffect("tera", "bewitchBuff")) + " effective vexes<br>")
                return str.concat("<br>" + formatSimple(Decimal.div(0.3, buyableEffect("tera", "bewitchCost")), 3) + " Hex-Energy per second")
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
                let look = {width: "180px", minHeight: "120px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !this.canClick() ? look.background = "#bf8f8f" : player.tera.clickables["bewitchSpell"] ? look.background = "linear-gradient(30deg, #7fbebe, #d4e9e9, #7fbebe)" : look.background = "#7c9797"
                return look
            },
        },
        "bewitchPin": {
            title() {return player.tera.clickables["bewitchPin"] ? "<small>Unpin</small><br>📌" : "Pin<br>📌"},
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
                let look = {width: "51px", minHeight: "120px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["bewitchPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
        "chronotachysisSpell": {
            title() {return "<h3>Chronotachysis</h3><br>Increases uni-alpha tickspeed by x" + formatSimple(buyableEffect("tera", "chronotachysisBuff").mul(Decimal.pow(12, player.tera.spellEnhancement))) + " for " + formatTime(Decimal.add(60, buyableEffect("tera", "chronotachysisDuration").sub(1))) + "<br>Currently: x" + formatSimple(buyableEffect("tera", "chronotachysisBuff").mul(Decimal.pow(12, player.tera.chronotachysisSpell[1]))) + " for " + formatTime(player.tera.chronotachysisSpell[0]) + "<br><br>" + formatSimple(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement))) + " Hex-Energy"},
            canClick() {return player.tera.hexEnergy.gte(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))},
            unlocked: true,
            onClick() {
                player.tera.hexEnergy = player.tera.hexEnergy.sub(Decimal.div(10, buyableEffect("tera", "chronotachysisCost")).mul(Decimal.pow10(player.tera.spellEnhancement)))
                let duration = player.tera.chronotachysisSpell[0]
                duration = duration.mul(Decimal.pow(12, player.tera.chronotachysisSpell[1].sub(player.tera.spellEnhancement)))
                duration = duration.add(buyableEffect("tera", "chronotachysisDuration").sub(1).add(60))
                player.tera.chronotachysisSpell = [duration, player.tera.spellEnhancement]
            },
            style() {
                let look = {width: "180px", minHeight: "120px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "linear-gradient(0deg, #0d66e1, #0098E5, #0d66e1)" : look.background = "#bf8f8f"
                return look
            },
        },
        "chronotachysisPin": {
            title() {return player.tera.clickables["chronotachysisPin"] ? "<small>Unpin</small><br>📌" : "Pin<br>📌"},
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
                let look = {width: "51px", minHeight: "120px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["chronotachysisPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
        "enhancementDown": {
            title: "-1",
            canClick() { return player.tera.spellEnhancement.gte(1)},
            unlocked: true,
            onClick() {
                player.tera.spellEnhancement = player.tera.spellEnhancement.sub(1)
            },
            style() {
                let look = {width: "60px", minHeight: "60px", fontSize: "14px", border: "3px solid rgba(0,0,0,0.5)", textShadow: "1px 1px 0 black, -1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black", borderRadius: "0"}
                if (this.canClick()) {look.color = "white"; look.backgroundColor = "#7F2626"}
                else {look.color = "gray"; look.backgroundColor = "#190707"}
                return look
            },
        },
        "enhancementUp": {
            title: "+1",
            canClick: true,
            unlocked: true,
            onClick() {
                player.tera.spellEnhancement = player.tera.spellEnhancement.add(1)
            },
            style: {width: "60px", minHeight: "60px", color: "white", fontSize: "14px", background: "#267F26", border: "3px solid rgba(0,0,0,0.5)", textShadow: "1px 1px 0 black, -1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black", borderRadius: "0 0 17px 0"},
        },
        "virtue1": {
            title() { return "Reset hept essence,<br>but gain kindness.<br><small>Req: " + formatSimple(player.tera.virtueReq[0]) + " Hept Essence</small>"},
            canClick() { return player.tera.virtueGain[0].gt(0) && player.tera.heptEssence.gt(0) && player.tera.trueHept.lt(2)},
            unlocked: true,
            onClick() {
                player.tera.virtue[0] = player.tera.virtue[0].add(player.tera.virtueGain[0])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                player.tera.trueHept.gte(2) ? look.background = "#77bf5f" : this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "virtue2": {
            title() { return "Reset previous true hept content,<br>but gain patience.<br><small>Req: " + formatSimple(player.tera.virtueReq[1]) + " Kindness</small>"},
            canClick() { return player.tera.virtueGain[1].gt(0) && player.tera.heptEssence.gt(0) && player.tera.trueHept.lt(4)},
            unlocked: true,
            onClick() {
                player.tera.virtue[1] = player.tera.virtue[1].add(player.tera.virtueGain[1])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
                player.tera.virtue[0] = new Decimal(0)
                player.tera.virtueGain[0] = new Decimal(0)
                if (player.tera.trueHept.lt(3)) {
                    player.tera.virtueEssence[0] = new Decimal(0)
                    player.tera.virtueEssenceGain[0] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                player.tera.trueHept.gte(4) ? look.background = "#77bf5f" : this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "virtue3": {
            title() { return "Reset previous true hept content,<br>but gain chastity.<br><small>Req: " + formatSimple(player.tera.virtueReq[2]) + " Patience</small>"},
            canClick() { return player.tera.virtueGain[2].gt(0) && player.tera.heptEssence.gt(0)},
            unlocked: true,
            onClick() {
                player.tera.virtue[2] = player.tera.virtue[2].add(player.tera.virtueGain[2])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
                for (let i = 0; i < 2; i++) {
                    player.tera.virtue[i] = new Decimal(0)
                    player.tera.virtueGain[i] = new Decimal(0)
                    if (i == 0 && player.tera.trueHept.gte(3)) continue
                    player.tera.virtueEssence[i] = new Decimal(0)
                    player.tera.virtueEssenceGain[i] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "virtue4": {
            title() { return "Reset previous true hept content,<br>but gain temperance.<br><small>Req: " + formatSimple(player.tera.virtueReq[3]) + " Chastity</small>"},
            canClick() { return player.tera.virtueGain[3].gt(0) && player.tera.heptEssence.gt(0)},
            unlocked: true,
            onClick() {
                player.tera.virtue[3] = player.tera.virtue[3].add(player.tera.virtueGain[3])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
                for (let i = 0; i < 3; i++) {
                    player.tera.virtue[i] = new Decimal(0)
                    player.tera.virtueGain[i] = new Decimal(0)
                    if (i == 0 && player.tera.trueHept.gte(3)) continue
                    player.tera.virtueEssence[i] = new Decimal(0)
                    player.tera.virtueEssenceGain[i] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "virtue5": {
            title() { return "Reset previous true hept content,<br>but gain diligence.<br><small>Req: " + formatSimple(player.tera.virtueReq[4]) + " Temperance</small>"},
            canClick() { return player.tera.virtueGain[4].gt(0) && player.tera.heptEssence.gt(0)},
            unlocked: true,
            onClick() {
                player.tera.virtue[4] = player.tera.virtue[4].add(player.tera.virtueGain[4])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
                for (let i = 0; i < 4; i++) {
                    player.tera.virtue[i] = new Decimal(0)
                    player.tera.virtueGain[i] = new Decimal(0)
                    if (i == 0 && player.tera.trueHept.gte(3)) continue
                    player.tera.virtueEssence[i] = new Decimal(0)
                    player.tera.virtueEssenceGain[i] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "virtue6": {
            title() { return "Reset previous true hept content,<br>but gain charity.<br><small>Req: " + formatSimple(player.tera.virtueReq[5]) + " Diligence</small>"},
            canClick() { return player.tera.virtueGain[5].gt(0) && player.tera.heptEssence.gt(0)},
            unlocked: true,
            onClick() {
                player.tera.virtue[5] = player.tera.virtue[5].add(player.tera.virtueGain[5])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
                for (let i = 0; i < 5; i++) {
                    player.tera.virtue[i] = new Decimal(0)
                    player.tera.virtueGain[i] = new Decimal(0)
                    if (i == 0 && player.tera.trueHept.gte(3)) continue
                    player.tera.virtueEssence[i] = new Decimal(0)
                    player.tera.virtueEssenceGain[i] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "virtue7": {
            title() { return "Reset previous true hept content,<br>but gain humility.<br><small>Req: " + formatSimple(player.tera.virtueReq[6]) + " Charity</small>"},
            canClick() { return player.tera.virtueGain[6].gt(0) && player.tera.heptEssence.gt(0)},
            unlocked: true,
            onClick() {
                player.tera.virtue[6] = player.tera.virtue[6].add(player.tera.virtueGain[6])

                player.tera.heptEssence = new Decimal(0)
                player.tera.heptEssencePerSecond = new Decimal(0)
                for (let i = 0; i < 6; i++) {
                    player.tera.virtue[i] = new Decimal(0)
                    player.tera.virtueGain[i] = new Decimal(0)
                    if (i == 0 && player.tera.trueHept.gte(3)) continue
                    player.tera.virtueEssence[i] = new Decimal(0)
                    player.tera.virtueEssenceGain[i] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "175px", minHeight: "100px", fontSize: "10px", lineHeight: "1.1", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
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
            effect(x) {
                if (getBuyableAmount(this.layer, this.id).gte(20)) return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).div(20).pow(0.6).mul(20))
                return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))
            },
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
            effect(x) {
                if (getBuyableAmount(this.layer, this.id).gte(20)) return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).div(20).pow(0.6).mul(20))
                return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))
            },
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
            effect(x) { return Decimal.pow(player.h.hexPoint.add(1).log(6).pow(0.5).div(300).add(1.05), getBuyableAmount(this.layer, this.id)) },
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
                    [Multiplies final effect based on " + player.h.stageName[1] + " points]\n\
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
            costGrowth() { return new Decimal(0.4).mul(buyableEffect("tera", "hexEnergyPrestige")) },
            purchaseLimit() { return new Decimal(90) },
            currency() { return player.tera.hexEnergy},
            pay(amt) { player.tera.hexEnergy = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(10).add(1).mul(Decimal.pow(10, getBuyableAmount("tera", "hexEnergyPrestige"))) },
            unlocked: true,
            cost(x) { return getBuyableAmount(this.layer, this.id).mul(this.costGrowth()).add(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Hex Energy Gain (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Hex Energy"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "110px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "hexEnergyCap": {
            costBase() { return new Decimal(5).mul(buyableEffect("tera", "hexEnergyPrestige")) },
            costGrowth() { return new Decimal(0.5).mul(buyableEffect("tera", "hexEnergyPrestige")) },
            purchaseLimit() { return new Decimal(90) },
            currency() { return player.tera.hexEnergy},
            pay(amt) { player.tera.hexEnergy = this.currency().sub(amt) },
            effect(x) {
                if (getBuyableAmount("tera", "hexEnergyPrestige").gt(0)) return getBuyableAmount(this.layer, this.id).add(9).mul(Decimal.pow(10, getBuyableAmount("tera", "hexEnergyPrestige"))).add(1)
                return getBuyableAmount(this.layer, this.id).add(1)
            },
            unlocked: true,
            cost(x) { return getBuyableAmount(this.layer, this.id).mul(this.costGrowth()).add(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Hex Energy Cap (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Hex Energy"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "110px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "hexEnergyPrestige": {
            costBase() { return new Decimal(100) },
            costGrowth() {return new Decimal(10)},
            purchaseLimit() { return new Decimal(100) },
            effect(x) { return Decimal.pow(10, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return player.tera.hexEnergy.gte(this.cost())},
            display() {
                return "<h3>Prestige Hex Energy Buyables (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Reset hex energy buyables and increase their prices, but keep and improve hex energy buyable effects\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Energy"
            },
            buy() {
                player.tera.buyables["hexEnergyBuff"] = new Decimal(0)
                player.tera.buyables["hexEnergyCap"] = new Decimal(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "305px", height: "110px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0", padding: "10px"}
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
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id).add(1)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Piosity Boost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1), 2) + "x\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffbf00"
                return look
            },
        },
        "piosityCost": {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(2)},
            display() {
                if (player.tera.trueHex.lt(2)) return "???"
                return "<h3>Decrease Piosity Cost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
                    return "<h3>Auto-cast Piosity (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\ \n\
                        Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
                }
                return "<h3>Auto-cast Piosity (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
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
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (amt.gte(10)) return this.costGrowth().pow(amt.div(10).pow(2).mul(10)).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Improve Bewitch Effects (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#b2d8d8"
                return look
            },
        },
        "bewitchCost": {
            costBase() { return new Decimal(27) },
            costGrowth() { return new Decimal(27) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(2)},
            display() {
                if (player.tera.trueHex.lt(2)) return "???"
                return "<h3>Reduce Bewitch Cost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
                    return "<h3>Unlock new Bewitch Effect (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                        [MAXED]\n\ \n\
                        Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
                }
                if (getBuyableAmount(this.layer, this.id).gte(1)) {
                    return "<h3>Unlock new Bewitch Effect (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                        Next: Increase Effective Vexes\n\ \n\
                        Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
                }
                return "<h3>Unlock new Bewitch Effect (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Next: Improve B-Jinx Effect\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
            effect(x) { return getBuyableAmount(this.layer, this.id).div(10).add(2) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Improve Chronotachysis Mult. (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
            effect(x) { return getBuyableAmount(this.layer, this.id).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && player.tera.trueHex.gte(2)},
            display() {
                if (player.tera.trueHex.lt(2)) return "???"
                return "<h3>Reduce Chronotachysis Cost (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
                return "<h3>Improve Chronotachysis Duration (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + ")</h3>\n\
                    Currently: +" + formatTime(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "158px", height: "120px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
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
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex2": {
            fullDisplay() {return "<h3>Hexed Hive</h3><br>Boost nests based on true hex.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 150 Refinements<br><small>[REQ BEING IN HEX]</small>"},
            tooltip: "1.1^(True Hex)",
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hre.refinement.gte(150)},
            pay() {player.hre.refinement = player.hre.refinement.sub(150)},
            effect() {return Decimal.pow(1.1, player.tera.trueHex)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
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
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex4": {
            fullDisplay() {return "<h3>Doomed Vexes</h3><br>Reduce point doom softcap's scaling based on highest vexes.<br>Currently: /" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 60 Vexes<br><small>[REQ BEING IN HEX]</small>"},
            tooltip: "(((Highest Vex)^0.7)/100)+1",
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
            effect() {return player.hve.vexHighest.pow(0.7).div(100).add(1)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex5": {
            fullDisplay() {return "<h3>Colorful Essences</h3><br>Boost realm essence gain based on hex essence.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 1e18 Realm Essence<br><small>[REQ BEING IN HEX]</small>"},
            tooltip: "1.1^(log6(Hex Essence+1))",
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.h.stage.eq(6) && player.hrm.realmEssence.gte("1e18")},
            pay() {player.hrm.realmEssence = player.hrm.realmEssence.sub("1e18")},
            effect() {return Decimal.pow(1.1, player.tera.hexEssence.add(1).log(6))},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
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
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex7": {
            fullDisplay() {return "<h3>Foundational Ranks</h3><br>Reduce provenance req's based on ranks.<br>Currently: /" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 6 Hex Essence"},
            tooltip: "((log1e1200(Rank+1)^0.6)/36)+1",
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(6)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(6)},
            effect() {return player.r.rank.add(1).log("1e1200").pow(0.6).div(36).add(1)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex8": {
            fullDisplay() {return "<h3>Fake Synergy</h3><br>Boost hex energy based on piosity buff.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 216 Hex Essence"},
            tooltip: "(log6(Piosity+1)/2)+1.5", 
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(216)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(216)},
            effect() {return player.tera.piositySpell.add(1).log(6).div(2).add(1.5)},
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
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex10": {
            fullDisplay() {return "<h3>Essence Conversion</h3><br>Boost CB-Tickspeed based on hex essence.<br><small>[DOES NOT STACK WITH REALM ESSENCE]</small><br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 1e12 Hex Essence"},
            tooltip: "((log6(Hex Essence+1))/36)+1",
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(1e12)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(1e12)},
            effect() {return player.tera.hexEssence.add(1).log(6).div(36).add(1)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex11": {
            fullDisplay() {return "<h3>Hexed Curses</h3><br>Boost curses based on hex essence.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 1e24 Hex Essence"},
            tooltip: "1.5^(log6(Hex Essence+1))", 
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(1e24)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(1e24)},
            effect() {return Decimal.pow(1.5, player.tera.hexEssence.add(1).log(6))},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hex12": {
            fullDisplay() {return "<h3>Hexed Softcap</h3><br>Delay hex essence softcap based on true hex.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 1e48 Hex Essence"},
            tooltip: "2^(True Hex)",
            unlocked() {return player.tera.unsealed},
            canAfford() { return player.tera.hexEssence.gte(1e48)},
            pay() {player.tera.hexEssence = player.tera.hexEssence.sub(1e48)},
            effect() {return Decimal.pow(2, player.tera.trueHex)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },

        "hept1": {
            fullDisplay() {return "<h3>Sinergy</h3><br>Boost external effects based on sins equipped<br>Currently: ^" + formatSimple(upgradeEffect(this.layer, this.id), 2) + "<br><br>Cost: 1e70 Blessings<br><small>[REQ BEING IN HEPT]</small>"},
            tooltip: "(Sins Equiped/50)+1",
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.h.stage.eq(7) && player.hbl.blessings.gte("1e70")},
            pay() {player.hbl.blessings = player.hbl.blessings.sub("1e70")},
            effect() {
                let amt = new Decimal(0)
                for (let i in player.sins.clickables) {
                    if (player.sins.clickables[i]) amt = amt.add(1)
                }
                return amt.div(50).add(1)
            },
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept2": {
            fullDisplay() {return "<h3>Cheaper Refining</h3><br>Refined fragments no longer cost lesser or greater fragments.<br><br>Cost: 1e21 Temperers<br><small>[REQ BEING IN HEPT]</small>"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.h.stage.eq(7) && player.hte.temperer.gte("1e21")},
            pay() {player.hte.temperer = player.hte.temperer.sub("1e21")},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept3": {
            fullDisplay() {return "<h3>Familiar Feeling</h3><br>Unlock Rage in " + player.h.stageName[0] + " of Power<br>[NOT IMPLEMENTED]<br><br>Req: 70 Purities<br><small>[REQ BEING IN HEPT]</small>"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.h.stage.eq(7) && player.hpu.totalPurity.add(player.hpu.keptPurity).gte(70)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept4": {
            fullDisplay() {return "<h3>???</h3><br>???<br><br>Cost: 70 η-Provenance<br><small>[REQ BEING IN HEPT]</small>"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.h.stage.eq(7) && player.hpr.rank[6].gte(70)},
            pay() {player.hpr.rank[6] = player.hpr.rank[6].sub(70)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept5": {
            fullDisplay() {return "<h3>???</h3><br>???<br><br>Cost: 1e35 Holy Power<br><small>[REQ BEING IN HEPT]</small>"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.h.stage.eq(7) && player.hsa.holyPower.gte("1e35")},
            pay() {player.hsa.holyPower = player.hsa.holyPower.sub("1e35")},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept6": {
            fullDisplay() {return "<h3>???</h3><br>???<br><br>Cost: 1e480 Curses<br><small>[REQ BEING IN HEPT]</small>"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.h.stage.eq(7) && player.hcu.curses.gte("1e480")},
            pay() {player.hcu.curses = player.hcu.curses.sub("1e480")},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept7": {
            fullDisplay() {return "<h3>Growing Muscles</h3><br>Boost power gain based on time in this power reset.<br>[CAPPED AT x7]<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 49 Hept Essence"},
            tooltip: "log7(Since Power+1)+1",
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.tera.heptEssence.gte(49)},
            pay() {player.tera.heptEssence = player.tera.heptEssence.sub(49)},
            effect() {return player.hpw.sincePower.add(1).log(7).add(1).min(7)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept8": {
            fullDisplay() {return "<h3>Partial Time</h3><br>Boost hept essence gain based on tickspeed.<br>Currently: x" + formatSimple(upgradeEffect(this.layer, this.id)) + "<br><br>Cost: 16,807 Hept Essence"},
            tooltip: "log7(Tickspeed)+1",
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.tera.heptEssence.gte(16807)},
            pay() {player.tera.heptEssence = player.tera.heptEssence.sub(16807)},
            effect() {return player.h.tickspeed.max(1).log(7).add(1)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept9": {
            fullDisplay() {return "<h3>Hepted Curses?</h3><br>Increase base of Κ-Jinx by +0.02.<br><br>Cost: 40,353,607 Hept Essence"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.tera.heptEssence.gte(40353607)},
            pay() {player.tera.heptEssence = player.tera.heptEssence.sub(40353607)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept10": {
            fullDisplay() {return "<h3>???</h3><br>???<br><br>Cost: 1e14 Hept Essence"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.tera.heptEssence.gte(1e14)},
            pay() {player.tera.heptEssence = player.tera.heptEssence.sub(1e14)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept11": {
            fullDisplay() {return "<h3>???</h3><br>???<br><br>Cost: 1e28 Hept Essence"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.tera.heptEssence.gte(1e28)},
            pay() {player.tera.heptEssence = player.tera.heptEssence.sub(1e28)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        "hept12": {
            fullDisplay() {return "<h3>???</h3><br>???<br><br>Cost: 1e56 Hept Essence"},
            unlocked() {return player.tera.unsealed && player.tera.trueHept.gte(1)},
            canAfford() { return player.tera.heptEssence.gte(1e56)},
            pay() {player.tera.heptEssence = player.tera.heptEssence.sub(1e56)},
            style() {
                let look = {width: "140px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.background = "#77bf5f" : !canAffordUpgrade(this.layer, this.id) ? look.background =  "#bf8f8f" : look.background = "#85ADE6"
                return look
            }
        },
        // HEPT UPGRADES
        // Reduce external penalty based on equipped sins
        // Unlock rage in power (In all universes, but a few unique buyables while in sins)
        // 
        // Unlock dark OTFs
        // EXTERNAL UNLOCK/BUFF x2

        // Slightly reduce T2 provenance cost scaling
        // 
        //
        // EXTERNAL UNLOCK/BUFF x3

        // Remove crystal effect hardcap
        // More Pent Milestones Maybe?
        // Unlock Rocket Parts (you can equip only one rocket part at a time at first, but there are three potential slots in total. You will start with just one that makes common pets not reset when sent up to space)
    },
    microtabs: {
        "hex": {
            "Color": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", () => {
                            return "Your current color is<br>#" +
                            getBuyableAmount("tera", "hexRed").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexGreen").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexBlue").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexOpacity").toString(16).padStart(2, '0') +
                            "<br>Which generates +" + formatSimple(player.tera.hexEssencePerSecond, 2) + " HE/s"
                        }, () => {return {color: "white", fontSize: "16px", fontFamily: "monospace"}}],
                        ["blank", "5px"],
                        ["row", [
                            ["style-column", [
                                ["style-row", [
                                    ["raw-html", "Red", {color: "#633", fontSize: "20px", fontFamily: "monospace"}],
                                ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                                ["buyable", "hexRed"],
                            ], {width: "225px", height: "140px", backgroundColor: "#f88", border: "3px solid #844", borderRadius: "30px 0 0 0"}],
                            ["style-column", [
                                ["style-row", [
                                    ["raw-html", "Green", {color: "#363", fontSize: "20px", fontFamily: "monospace"}],
                                ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                                ["buyable", "hexGreen"],
                            ], {width: "225px", height: "140px", backgroundColor: "#8f8", border: "3px solid #484", borderRadius: "0 30px 0 0"}],
                        ]],
                        ["row", [
                            ["style-column", [
                                ["style-row", [
                                    ["raw-html", "Blue", {color: "#336", fontSize: "20px", fontFamily: "monospace"}],
                                ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                                ["buyable", "hexBlue"],
                            ], {width: "225px", height: "140px", backgroundColor: "#88f", border: "3px solid #448", borderRadius: "0 0 0 30px"}],
                            ["style-column", [
                                ["style-row", [
                                    ["raw-html", "Opacity", {color: "#666", fontSize: "20px", fontFamily: "monospace"}],
                                ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                                ["buyable", "hexOpacity"],
                            ], {width: "225px", height: "140px", backgroundColor: "#fff", border: "3px solid #888", borderRadius: "0 0 30px 0"}],
                        ]],
                    ], {width: "480px", height: "370px", background: "#425673", border: "3px solid #85ade6", borderRadius: "15px"}],
                ],
            },
            "Spells": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["bar", "hexEnergy"],
                    ["style-row", [
                        ["buyable", "hexEnergyBuff"],
                        ["buyable", "hexEnergyCap"],
                        ["buyable", "hexEnergyPrestige"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["style-row", [
                        ["clickable", "piosityPin"],
                        ["clickable", "piositySpell"],
                        ["buyable", "piosityBuff"],
                        ["buyable", "piosityCost"],
                        ["buyable", "piosityAuto"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["style-row", [
                        ["clickable", "bewitchPin"],
                        ["clickable", "bewitchSpell"],
                        ["buyable", "bewitchBuff"],
                        ["buyable", "bewitchCost"],
                        ["buyable", "bewitchEnhance"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["style-row", [
                        ["clickable", "chronotachysisPin"],
                        ["clickable", "chronotachysisSpell"],
                        ["buyable", "chronotachysisBuff"],
                        ["buyable", "chronotachysisCost"],
                        ["buyable", "chronotachysisDuration"],
                    ], {border: "3px solid #85ade6", marginTop: "-3px"}],
                    ["style-row", [
                        ["style-column", [
                            ["raw-html", "Spell Enhancement", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", "Improves the power of instant spells", {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                        ], {width: "262px", height: "60px", lineHeight: "1", background: "#425673", borderRadius: "0 0 0 17px", borderRight: "3px solid #85ade6"}],
                        ["clickable", "enhancementDown"],
                        ["style-column", [
                            ["raw-html", () => {return "Enhancement Lv" + formatWhole(player.tera.spellEnhancement)}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "Increases spell power by x" + formatWhole(Decimal.pow(12, player.tera.spellEnhancement))}, {color: "white", fontSize: "12px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "Increases spell costs by x" + formatWhole(Decimal.pow10(player.tera.spellEnhancement))}, {color: "white", fontSize: "12px", fontFamily: "monospace"}],
                        ], {width: "314px", height: "60px", lineHeight: "1", borderLeft: "3px solid #85ade6", borderRight: "3px solid #85ade6"}],
                        ["clickable", "enhancementUp"],
                    ], () => {return player.tera.trueHex.gte(3) ? {width: "705px", height: "60px", background: "#273345", border: "3px solid #85ade6", marginTop: "-3px", borderRadius: "0 0 20px 20px"} : {display: "none !important"}}],
                    ["style-row", [], () => {return player.tera.trueHex.lt(3) ? {width: "705px", height: "20px", background: "#273345", border: "3px solid #85ade6", marginTop: "-3px", borderRadius: "0 0 20px 20px"} : {display: "none !important"}}],
                    ["blank", "20px"],
                ],
            },
            "Upgrades": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", "True Hex Upgrades", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "40px", background: "#85ADE6", border: "3px solid #273345", borderRadius: "20px 20px 0 0 "}],
                    ["style-row", [
                        ["style-row", [["upgrade", "hex1"], ["bt-upgrade", "hex2"], ["upgrade", "hex3"], ["bt-upgrade", "hex4"], ["bt-upgrade", "hex5"], ["upgrade", "hex6"]], {width: "300px"}],
                        ["blank", ["25px", "10px"]],
                        ["style-row", [["bt-upgrade", "hex7"], ["bt-upgrade", "hex8"], ["upgrade", "hex9"], ["bt-upgrade", "hex10"], ["bt-upgrade", "hex11"], ["bt-upgrade", "hex12"]], {width: "300px"}],
                    ], {width: "650px", height: "370px", background: "repeating-linear-gradient(135deg, #5d79a1 0px, #5d79a1 20px, #425673 20px, #425673 40px)", border: "3px solid #273345", marginTop: "-3px", marginBottom: "-3px"}],
                    ["style-column", [
                        ["raw-html", "Any upgrades effecting Uni-Alpha are counted as external effects.", {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "30px", background: "#85ADE6", border: "3px solid #273345", borderRadius: "0 0 20px 20px"}],
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
                        ], {width: "800px", height: "30px", borderBottom: "3px solid #85ade6"}],
                        ["style-row", [
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Creator Realm Challenge Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Raises rank, tier, tetr, and pent effects<br>by ^1.18<br>" +
                                    "Multiplies factor base by x120<br>" +
                                    "Multiplies check back xp by x" + formatSimple(upgradeEffect("hpw", 1013)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "100px", background: "#c44", border: "3px solid #800", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[0]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Higher Plane Challenge Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Raises prestige points gain by ^1.36<br>" +
                                    "Raises tree gain by ^1.24<br>" +
                                    "Multiplies crystals and steel by x" + formatSimple(upgradeEffect("hpw", 1023)) + "<br><small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "100px", background: "#c84", border: "3px solid #840", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[1]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Death Realm Challenge Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Raises grass gain by ^1.18<br>" +
                                    "Raises golden grass gain by ^1.06<br>" +
                                    "Multiplies pollinators by x" + formatSimple(upgradeEffect("hpw", 1033)) + "<br><small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "100px", background: "#cc4", border: "3px solid #880", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[2]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Dimension Realm Challenge Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Raises grasshopper gain by ^1.1<br>" +
                                    "Raises mod gain by ^1.1<br>" +
                                    "Multiplies infinity dimensions by x" + formatSimple(upgradeEffect("hpw", 1043)) + "<br><small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "100px", background: "#4c4", border: "3px solid #080", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[3]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Dream Realm Challenge Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Raises AD and antimatter by ^1.05<br>" +
                                    "Multiplies NIP by x100<br>" +
                                    "Raises mastery point effects by ^" + formatSimple(upgradeEffect("hpw", 1053), 2) + "<br><small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "100px", background: "#44c", border: "3px solid #008", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[4]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Void Realm Challenge Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Increases crate roll chance by +25%<br>" +
                                    "Triples replicanti multiplier<br>" +
                                    "Multiplies infinity points by x" + formatSimple(upgradeEffect("hpw", 1063)) + "<br><small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "100px", background: "#84c", border: "3px solid #408", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[5]) look.filter = "brightness(25%)"
                                return look
                            }],
                        ], {width: "800px", height: "340px", background: "#1a222e"}],
                        ["style-column", [
                            ["raw-html", "Obtaining realm mastery requires you to reach 30 clears.<br>Realm mastery effects do not stack with realm mights.<br>Realm mastery is kept on Tera resets.", () => {return {color: "white", fontSize: "14px", fontFamily: "monospace"}}],
                        ], {width: "800px", height: "60px", borderTop: "3px solid #85ade6", overflow: "hidden"}],
                    ], {width: "800px", height: "436px", background: "#425673", border: "3px solid #85ade6", borderRadius: "15px"}],
                    ["blank", "20px"],
                ],
            },
            "Effects": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", "True Hex Effects", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "40px", background: "#85ADE6", border: "3px solid #273345", borderRadius: "20px 20px 0 0"}],
                    ["top-column", [
                        ["blank", "5px"],
                        ["raw-html", "At true hex 1, unlock true hex content.", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(2) ? "At true hex 2, unlock the second set of spell buyables." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(3) ? "At true hex 3, unlock spell enhancement." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(4) ? "At true hex 4, unlock a hex essence effect." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(5) ? "At true hex 5, reduce hex essence's softcap." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(6) ? "At true hex 6, unlock bulk true hexing." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(7) ? "At true hex 7, unlock the fourth hex spell. [NOT IMPLEMENTED]" : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(8) ? "At true hex 8, unlock the third set of spell buyables." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(10) ? "At true hex 10, unlock a true hex effect." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(12) ? "At true hex 12, unlock the fifth hex spell. [NOT IMPLEMENTED]" : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(15) ? "At true hex 15, improve piosity's spell formula." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(18) ? "At true hex 18, unlock the sixth hex spell. [NOT IMPLEMENTED]" : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "250px", background: "#425673", border: "3px solid #273345", marginTop: "-3px", marginBottom: "-3px"}],
                    ["style-column", [], {width: "650px", height: "20px", background: "#85ADE6", border: "3px solid #273345", borderRadius: "0 0 20px 20px"}],
                ],
            },
        },
        "hept": {
            "Virtues": {
                buttonStyle() { return {borderColor: "#95A6DD", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "5px"],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Kindness", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[0])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[0]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue1"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[0]) + " Essence of Kindness (+" + formatSimple(player.tera.virtueEssenceGain[0], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>(Kindness/7)^1.3</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[0][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[0].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return player.h.stageName[0] + " Points: x" + formatSimple(player.tera.virtueEffects[0][1], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[0].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "3,500", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Unseal Uni-Alpha: Hex"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (!player.tera.virtueUnlocks[0] && player.tera.virtueEssence[0].lt(3500)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[0].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[0].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#719671"}],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Patience", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[1])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[1]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue2"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[1]) + " Essence of Patience (+" + formatSimple(player.tera.virtueEssenceGain[1], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>(Patience/6)^1.28</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[1][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[1].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Curses: x" + formatSimple(player.tera.virtueEffects[1][1], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[1].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "14,000", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Unlock the jinxed jinx"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (!player.tera.virtueUnlocks[1] && player.tera.virtueEssence[1].lt(14000)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[1].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[1].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#a06a6a", marginTop: "-3px"}],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Chastity", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[2])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[2]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue3"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[2]) + " Essence of Chastity (+" + formatSimple(player.tera.virtueEssenceGain[2], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>(Chastity/5)^1.26</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[2][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[2].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Purity Requirement: -" + formatWhole(player.tera.virtueEffects[2][1])}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[2].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "70,000", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Extend the purifier softcap by 1"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (!player.tera.virtueUnlocks[2] && player.tera.virtueEssence[2].lt(70000)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[2].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[2].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#c59aa1", marginTop: "-3px"}],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Temperance", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[3])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[3]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue4"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[3]) + " Essence of Temperance (+" + formatSimple(player.tera.virtueEssenceGain[3], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>(Temperance/4)^1.24</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[3][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[3].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Refinement Requirement: /" + formatSimple(player.tera.virtueEffects[3][1], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[3].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "350,000", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Keep a refinement milestone on tera reset per true hept"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", lineHeight: "0.75", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (!player.tera.virtueUnlocks[3] && player.tera.virtueEssence[3].lt(350000)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[3].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[3].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#c59c80", marginTop: "-3px"}],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Diligence", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[4])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[4]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue5"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[4]) + " Essence of Diligence (+" + formatSimple(player.tera.virtueEssenceGain[4], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>(Diligence/3)^1.22</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[4][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[4].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Uni-Alpha Tickspeed: x" + formatSimple(player.tera.virtueEffects[4][1], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[4].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1,400,000", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[4].lt(1.4e6)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[4].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[4].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#719696", marginTop: "-3px"}],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Charity", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[5])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[5]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue6"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[5]) + " Essence of Charity (+" + formatSimple(player.tera.virtueEssenceGain[5], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>(Charity/2)^1.2</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[5][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[5].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Blessings: x" + formatSimple(player.tera.virtueEffects[5][1], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[5].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "7,000,000", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Unlock hex of sacrifice in hex universe."}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", lineHeight: "0.75", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[5].lt(7e6) || player.tera.virtueUnlocks[5]) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[5].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[5].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#c5ba80", marginTop: "-3px"}],
                    ["style-row", [
                        ["top-column", [
                            ["style-column", [
                                ["raw-html", "Humilty", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "33px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["style-column", [
                                ["raw-html", () => {return formatWhole(player.tera.virtue[6])}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.tera.virtueGain[6]) + ")"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "169px", height: "43px", lineHeight: "1", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "175px", height: "3px", background: "#95A6DD"}],
                            ["clickable", "virtue7"],
                        ], {width: "175px", height: "194px"}],
                        ["top-column", [
                            ["tooltip-row", [
                                ["raw-html", () => {return formatSimple(player.tera.virtueEssence[6]) + " Essence of Humilty (+" + formatSimple(player.tera.virtueEssenceGain[6], 2) + "/s)"}, {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div class='bottomTooltip'>Base Formula<hr><small>Humilty^1.18</small></div>"],
                            ], {width: "392px", height: "33px", border: "3px solid rgba(0,0,0,0.5)"}],
                            ["style-column", [], {width: "398px", height: "3px", background: "#95A6DD"}],
                            ["style-row", [
                                ["style-row", [["raw-html", "1", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Hept Essence: x" + formatSimple(player.tera.virtueEffects[6][0], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)"};if (player.tera.virtueEssence[6].lt(1)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "49", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "Power: x" + formatSimple(player.tera.virtueEffects[6][1], 2)}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[6].lt(49)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "35,000,000", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[6].lt(3.5e7)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[6].lt(1e35)) {look.background = "#bf8f8f"};return look}],
                            ["style-row", [
                                ["style-row", [["raw-html", "???", {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "100px", height: "27px", borderRight: "3px solid rgba(0,0,0,0.5)"}],
                                ["style-row", [["raw-html", () => {return "???"}, {color: "rgba(0,0,0,0.7)", fontSize: "14px", fontFamily: "monospace"}]], {width: "289px", height: "27px"}],
                            ], () => {let look = {width: "392px", height: "27px", background: "#77bf5f", border: "3px solid rgba(0,0,0,0.5)", marginTop: "-3px"};if (player.tera.virtueEssence[6].lt(1e140)) {look.background = "#bf8f8f"};return look}],
                        ], {width: "398px", height: "194px", borderLeft: "3px solid #95A6DD", userSelect: "none"}],
                    ], {width: "576px", height: "194px", border: "3px solid #95A6DD", background: "#7e72a3", marginTop: "-3px"}],
                ],
            },
            "Upgrades": {
                buttonStyle() { return {borderColor: "#95A6DD", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", "True Hept Upgrades", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "40px", background: "#95A6DD", border: "3px solid #2c3142", borderRadius: "20px 20px 0 0 "}],
                    ["style-row", [
                        ["style-row", [["bt-upgrade", "hept1"], ["upgrade", "hept2"], ["upgrade", "hept3"], ["upgrade", "hept4"], ["upgrade", "hept5"], ["upgrade", "hept6"]], {width: "300px"}],
                        ["blank", ["25px", "10px"]],
                        ["style-row", [["bt-upgrade", "hept7"], ["bt-upgrade", "hept8"], ["upgrade", "hept9"], ["upgrade", "hept10"], ["upgrade", "hept11"], ["upgrade", "hept12"]], {width: "300px"}],
                    ], {width: "650px", height: "370px", background: "repeating-linear-gradient(135deg, #68749a 0px, #68749a 20px, #4a536e 20px, #4a536e 40px)", border: "3px solid #2c3142", marginTop: "-3px", marginBottom: "-3px"}],
                    ["style-column", [
                        ["raw-html", "Any upgrades effecting Uni-Alpha are counted as external effects.", {color: "rgba(0,0,0,0.7)", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "30px", background: "#95A6DD", border: "3px solid #2c3142", borderRadius: "0 0 20px 20px"}],
                ],
            },
            "Sin Mastery": {
                buttonStyle() { return {borderColor: "#95A6DD", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["style-column", [
                            ["raw-html", "Sin Mastery", () => {return {color: "white", fontSize: "24px", fontFamily: "monospace"}}],
                        ], {width: "800px", height: "30px", borderBottom: "3px solid #95A6DD"}],
                        ["style-row", [
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Envy Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts paradox fragment score by x" + formatSimple(player.sins.envy[1]) + "<br>" +
                                    "Boosts paradox pylon energy by x" + formatSimple(player.sins.envy[2]) + "<br>" +
                                    "[Based on Provenances]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#628B62", border: "3px solid #314531", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[0]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Wrath Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts radioactive fragment score by x" + formatSimple(player.sins.wrath[1]) + "<br>" +
                                    "Boosts radioactive pylon energy by x" + formatSimple(player.sins.wrath[2]) + "<br>" +
                                    "[Based on Curses]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#965A5A", border: "3px solid #4b2d2d", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[1]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Lust Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts natural fragment score by x" + formatSimple(player.sins.lust[1]) + "<br>" +
                                    "Boosts natural pylon energy by x" + formatSimple(player.sins.lust[2]) + "<br>" +
                                    "[Based on Purity]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#BF8F97", border: "3px solid #5f474b", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[2]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Gluttony Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts cosmic fragment score by x" + formatSimple(player.sins.gluttony[1]) + "<br>" +
                                    "Boosts cosmic pylon energy by x" + formatSimple(player.sins.gluttony[2]) + "<br>" +
                                    "[Based on Refinements]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#BF9172", border: "3px solid #5f4839", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[3]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Sloth Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts temporal fragment score by x" + formatSimple(player.sins.sloth[1]) + "<br>" +
                                    "Boosts temporal pylon energy by x" + formatSimple(player.sins.sloth[2]) + "<br>" +
                                    "[Based on " + player.h.stageName[0] + " Points]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#628B8B", border: "3px solid #314545", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[4]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Greed Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts technological fragment score by x" + formatSimple(player.sins.greed[1]) + "<br>" +
                                    "Boosts technological pylon energy by x" + formatSimple(player.sins.greed[2]) + "<br>" +
                                    "[Based on Blessings]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#BFB372", border: "3px solid #5f5939", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[5]) look.filter = "brightness(25%)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Pride Mastery</h3><hr style='border-color:black;width:350px'>" +
                                    "Boosts ancient fragment score by x" + formatSimple(player.sins.pride[1]) + "<br>" +
                                    "Boosts ancient pylon energy by x" + formatSimple(player.sins.pride[2]) + "<br>" +
                                    "[Based on Power Gain]"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "385px", height: "80px", background: "#706399", border: "3px solid #38314c", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.sinMastery[6]) look.filter = "brightness(25%)"
                                return look
                            }],
                        ], {width: "800px", height: "380px", background: "#1a222e", overflow: "hidden"}],
                        ["style-column", [
                            ["raw-html", "Obtaining sin mastery requires you to reach 1e70 power without using that sin in that tera run.<br>Sin mastery effects do not stack with sins.<br>Sin mastery is kept on Tera resets.", () => {return {color: "white", fontSize: "14px", fontFamily: "monospace"}}],
                        ], {width: "800px", height: "70px", borderTop: "3px solid #95A6DD"}],
                    ], {width: "800px", height: "486px", background: "#4a536e", border: "3px solid #95A6DD", borderRadius: "15px"}],
                    ["blank", "20px"],
                ],
            },
            "Effects": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["raw-html", "True Hept Effects", {color: "rgba(0,0,0,0.7)", fontSize: "20px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "40px", background: "#95A6DD", border: "3px solid #2c3142", borderRadius: "20px 20px 0 0"}],
                    ["top-column", [
                        ["blank", "5px"],
                        ["raw-html", "At true hept 1, unlock true hept content.", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHept.gte(2) ? "At true hept 2, automate kindness gain." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHept.gte(3) ? "At true hept 3, essence of kindness is no longer reset." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHept.gte(4) ? "At true hept 4, automate patience gain." : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHept.gte(7) ? "At true hept 7, unlock bulk true hepting" : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "650px", height: "250px", background: "#4a536e", border: "3px solid #2c3142", marginTop: "-3px", marginBottom: "-3px"}],
                    ["style-column", [], {width: "650px", height: "20px", background: "#95A6DD", border: "3px solid #2c3142", borderRadius: "0 0 20px 20px"}],
                ],
            },
        },
        "stuff": {
            "hex": {
                unlocked: true,
                content: [
                    ["style-row", [
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "True Hex"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
                            ], {width: "397px", height: "47px", borderBottom: "3px solid #85ade6"}],
                            ["clickable", 106],
                        ], {width: "397px", height: "110px", borderRight: "3px solid #85ade6"}],
                        ["style-column", [
                            ["raw-html", "Hex Universe Exclusives<hr>", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ["blank", "5px"],
                            ["raw-html", "Hex of Realms", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", "No Tier Backlashes", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "300px", height: "110px"}]
                    ], {width: "700px", height: "110px", backgroundColor: "#425673", border: "3px solid #85ADE6", borderRadius: "20px"}],
                    ["blank", "10px"],
                    ["row", [
                        ["raw-html", () => {return "You are at <h3>" + formatWhole(player.tera.trueHex) + "</h3> true hex."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHex.gte(6) ? "<span style='margin-left:10px'>(+" + formatWhole(player.tera.trueHexGain) + ")</span>" : ""}, () => {
                            let look = {color: "white", fontSize: "24px", fontFamily: "monospace"}
                            player.tera.trueHexGain.gt(0) ? look.color = "white" : look.color = "gray"
                            return look
                        }],
                        //["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                    ]],
                    ["raw-html", () => {return player.tera.trueHex.gte(10) ? "Boosts uni-alpha tickspeed by x" + formatSimple(player.tera.trueHexEffect, 2) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
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
                    ["raw-html", () => {
                        let softcapStart = hasUpgrade("tera", "hex12") ? Decimal.mul(1e6, upgradeEffect("tera", "hex12")) : new Decimal(1e6)
                        return player.tera.hexEssencePerSecond.gte(softcapStart) ? "UNAVOIDABLE SOFTCAP: Gain past " + formatShortSimple(softcapStart) + " is raised by ^" + formatSimple(player.tera.hexEssenceSoftcap, 3) : ""}, {color: "red", fontSize: "14px", fontFamily: "monospace"}],
                    ["raw-html", () => {return player.tera.trueHex.gte(4) ? "Boosts hex energy gain by x" + formatSimple(player.tera.hexEssenceEffect, 2) : ""}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ["blank", "10px"],
                    ["microtabs", "hex", {borderWidth: "0px"}],
                ],
            },
            "hept": {
                unlocked() {return player.tera.unsealed},
                content: [
                    ["style-row", [
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "True Hept"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
                            ], {width: "397px", height: "47px", borderBottom: "3px solid #95A6DD"}],
                            ["clickable", 107],
                        ], {width: "397px", height: "110px", borderRight: "3px solid #95A6DD"}],
                        ["style-column", [
                            ["raw-html", "Hept Universe Exclusives<hr>", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ["blank", "5px"],
                            ["raw-html", "Hept of Sins", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", "3 Tier Backlashes", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", "<div>[External, Pre-Power, Power]</div>", {color: "white", fontSize: "12px", fontFamily: "monospace",}],
                        ], {width: "300px", height: "110px"}]
                    ], {width: "700px", height: "110px", backgroundColor: "#4a536e", border: "3px solid #95A6DD", borderRadius: "20px"}],
                    
                    ["blank", "10px"],
                    ["row", [
                        ["raw-html", () => {return "You are at <h3>" + formatWhole(player.tera.trueHept) + "</h3> true hept."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.tera.trueHept.gte(7) ? "<span style='margin-left:10px'>(+" + formatWhole(player.tera.trueHeptGain) + ")</span>" : ""}, () => {
                            let look = {color: "white", fontSize: "24px", fontFamily: "monospace"}
                            player.tera.trueHeptGain.gt(0) ? look.color = "white" : look.color = "gray"
                            return look
                        }],
                        //["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                    ]],
                    ["blank", "10px"],
                    ["clickable", "heptReset"],
                    ["blank", "10px"],
                    ["style-column", [
                        ["tooltip-row", [
                            ["raw-html", () => {return "You have <h3>" + formatSimple(player.tera.heptEssence) + "</h3> hept essence."}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatSimple(player.tera.heptEssencePerSecond, 2) + "/s)"}, () => {
                                let look = {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.heptEssencePerSecond.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                            ["raw-html", () => {return "<div class='bottomTooltip'>Formula<hr><small>(7<sup>(True Hept)</sup>)/70</small></div>"}],
                        ]],
                        ["blank", "10px"],
                        ["microtabs", "hept", {borderWidth: "0px"}]
                    ], () => {return player.tera.trueHept.gt(0) ? {} : {display: "none !important"}}],
                ],
            },
            // Upgrade grid of 5x5 for pent perhaps? (in the vein of tree game rewritten)
            // Keep Project Claustrophoia's double compacted boxes in mind
            // Absolute button simulator for hept+ maybe?
            // Circular 9 grid of buyables should be used
            // Keep kaizo incremental in mind as a simple minigame here
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
        ["blank", "10px"],
        ["style-row", [
            ["clickable", 1], ["clickable", 2], ["clickable", 3], ["clickable", 4],
            ["clickable", 5], ["clickable", 6], ["clickable", 7], ["clickable", 8],
            ["clickable", 9], ["clickable", 10], ["clickable", 11], ["clickable", 12],
        ], {maxWidth: "100%", background: "#1a222e", border: "3px solid #85ADE6", borderRadius: "50px 50px 50px 50px / 20px 20px 20px 20px", maskImage: "linear-gradient(to right, transparent, transparent 5%, black 20%, black 80%, transparent 95%, transparent)"}],
        ["blank", "10px"],
        ["style-column", [
            ["buttonless-microtabs", "stuff", {borderWidth: "0"}],
        ], () => {return player.tera.unsealed ? {} : {display: "none !important"}}],
        ["style-column", [
            ["row", [["clickable", "seal1"], ["blank", ["200px", "10px"]], ["clickable", "seal2"]]],
            ["style-row", [["style-row", [["clickable", "seal3"]], {width: "150px", height: "150px"}], ["blank", ["50px", "10px"]], ["clickable", "sealCenter"], ["blank", ["50px", "10px"]], ["style-row", [["clickable", "seal4"]], {width: "150px", height: "150px"}]], {height: "200px"}],
            ["row", [["clickable", "seal5"], ["blank", ["200px", "10px"]], ["clickable", "seal6"]]],
        ], () => {return !player.tera.unsealed ? {width: "700px", height: "700px", background: "radial-gradient(rgba(0,0,0,1), #13192200)", border: "10px solid #28426c88", borderRadius: "35%"} : {display: "none !important"}}],
        ["blank", "25px"],
    ],
    layerShown() { return getBuyableAmount("hpw", 7).gt(0) || player.tera.trueHex.gt(0) }, // Decides if this node is shown or not.
});
const HEX_STAGES = [
    ["Null", "null"],
    ["Base", "base"],
    ["Rank", "rank"],
    ["Tier", "tier"],
    ["Tetr", "tetr"],
    ["Pent", "pent"],
    ["Hex", "hex"],
    ["Hept", "hept"],
    ["Oct", "oct"],
    ["Noct", "noct"],
    ["Dect", "dect"],
    ["Undect", "undect"],
    ["Dodect", "dodect"],
]

addLayer("h", {
    name() {return player.h.stageName[0]}, // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "UA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        // Hex Points
        hexPoint: new Decimal(0),
        hexPointGain: new Decimal(0),

        // Pre-Power Resources
        prePowerMult: new Decimal(1),

        stageName:["Hex", "hex"],
        stage: new Decimal(6),

        // Global Nerfs
        tickspeed: new Decimal(1),
        externalRaise: new Decimal(1),
        preNerf: new Decimal(1),
        powNerf: new Decimal(1),
        jinxDiv: new Decimal(1),
        purifierDiv: new Decimal(1),
    }},
    nodeStyle() { return {color: "white", backgroundColor: "black", borderColor: "#0061ff"}},
    glowColor: "rgba(0, 0, 0, 0)",
    tooltip() {return player.h.stageName[0]},
    color: "#d4d4d4",
    update(delta) {
        let onepersec = new Decimal(1)

        // UNIVERSE ALPHA STAGE STUFF
        if (Decimal.lte(player.h.stage, 0)) {
            player.h.stageName = ["Null", "null"]
        } else if (Decimal.lt(player.h.stage, HEX_STAGES.length)) {
            player.h.stageName = HEX_STAGES[player.h.stage]
        } else {
            player.h.stageName = ["???", "???"]
        }

        // GLOBAL NERFS
        player.h.tickspeed = new Decimal(1)
        if (player.tera.chronotachysisSpell[0].gt(0)) player.h.tickspeed = player.h.tickspeed.mul(player.tera.chronotachysisSpell[1])

        player.h.externalRaise = new Decimal(1)
        if (player.h.stage.neq(6)) player.h.externalRaise = Decimal.pow(0.5, player.h.stage.sub(6).abs())
        player.h.externalRaise = player.h.externalRaise.mul(player.hpu.purifiers[6].effect)

        player.h.preNerf = new Decimal(1)
        if (player.h.stage.neq(6)) player.h.preNerf = Decimal.pow(1000, player.h.stage.sub(6).abs())
        player.h.preNerf = player.h.preNerf.mul(player.hrm.challengeSoftcap)

        player.h.powNerf = new Decimal(1)
        if (player.h.stage.neq(6)) player.h.powNerf = Decimal.pow(1000, player.h.stage.sub(6).abs())

        player.h.jinxDiv = new Decimal(1)
        if (player.sins.clickables["wrath"]) player.h.jinxDiv = player.h.jinxDiv.mul(6)

        player.h.purifierDiv = new Decimal(1)
        if (player.sins.clickables["lust"]) player.h.purifierDiv = player.h.purifierDiv.mul(6)
        if (hasUpgrade("hpw", 37)) player.h.purifierDiv = player.h.purifierDiv.div(upgradeEffect("hpw", 37))

        // START OF HEX POINT GAIN
        player.h.hexPointGain = new Decimal(0)
        if (!hasChallenge("ip", 13) && layerShown("h")) player.h.hexPointGain = Decimal.mul(2, player.h.stage)
        if (hasChallenge("ip", 13)) {
            if (!hasMilestone("hre", 2)) {
                player.h.hexPointGain = player.points.add(1).log(player.h.stage.max(2)).mul(player.h.stage.max(1)).pow(Decimal.div(3.6, player.h.stage.max(4)))
            } else {
                player.h.hexPointGain = player.i.bestPoints.add(1).log(player.h.stage.max(2)).mul(player.h.stage.max(1)).pow(Decimal.div(3.6, player.h.stage.max(4)))
            }
        }
        for (let i = 0; i < 7; i++) {
            player.h.hexPointGain = player.h.hexPointGain.mul(player.hpr.rankEffect[i][1])
        }
        player.h.hexPointGain = player.h.hexPointGain.mul(player.hre.refinementEffect[0][0])
        player.h.hexPointGain = player.h.hexPointGain.mul(player.hbl.boosters[0].effect)
        player.h.hexPointGain = player.h.hexPointGain.mul(buyableEffect("hcu", 107))
        if (hasUpgrade("hbl", 2)) player.h.hexPointGain = player.h.hexPointGain.mul(upgradeEffect("hbl", 2))
        if (hasUpgrade("hbl", 5)) player.h.hexPointGain = player.h.hexPointGain.mul(upgradeEffect("hbl", 5))
        if (hasUpgrade("hpw", 2)) player.h.hexPointGain = player.h.hexPointGain.mul(upgradeEffect("hpw", 2))
        if (hasUpgrade("hve", 11)) player.h.hexPointGain = player.h.hexPointGain.mul(upgradeEffect("hve", 11))
        if (hasUpgrade("hve", 12)) player.h.hexPointGain = player.h.hexPointGain.mul(upgradeEffect("hve", 12))
        if (hasUpgrade("hve", 13)) player.h.hexPointGain = player.h.hexPointGain.mul(upgradeEffect("hve", 13))
        player.h.hexPointGain = player.h.hexPointGain.mul(player.h.prePowerMult)

        // EXTERNAL MODIFIERS
        let externalHex = new Decimal(1)
        externalHex = externalHex.mul(player.d.boosterEffects[14])
        externalHex = externalHex.mul(buyableEffect("cb", 11))
        externalHex = externalHex.mul(buyableEffect("ta", 48))
        if (player.pol.pollinatorEffects.ant.enabled) externalHex = externalHex.mul(player.pol.pollinatorEffects.ant.effects[2])
        externalHex = externalHex.mul(levelableEffect("pu", 209)[1])

        externalHex = externalHex.pow(player.h.externalRaise)
        player.h.hexPointGain = player.h.hexPointGain.mul(externalHex)

        // POWER
        if (hasUpgrade("hve", 61)) player.h.hexPointGain = player.h.hexPointGain.pow(1.03)

        // EXTERNAL POWER
        let externalPow = new Decimal(1)
        externalPow = externalPow.mul(levelableEffect("car", 304)[0])

        externalPow = externalPow.pow(player.h.externalRaise)
        player.h.hexPointGain = player.h.hexPointGain.pow(externalPow)

        // SOFTCAPS
        if (inChallenge("hrm", 14)) player.h.hexPointGain = player.h.hexPointGain.pow(Decimal.mul(0.1, player.hsa.sacredEffect).min(0.6))
        if (player.h.hexPointGain.gte(1e308)) player.h.hexPointGain = player.h.hexPointGain.div(1e308).pow(Decimal.mul(0.1, player.hsa.sacredEffect)).mul(1e308)

        // POST-SOFTCAP MULTIPLIERS
        player.h.hexPointGain = player.h.hexPointGain.mul(player.hsa.sacredEffect2)
        player.h.hexPointGain = player.h.hexPointGain.mul(buyableEffect("hrm", 4))

        // PER SECOND CALCULATIONS
        player.h.hexPointGain = player.h.hexPointGain.mul(player.h.tickspeed)
        if (inChallenge("hrm", 13)) player.h.hexPointGain = player.h.hexPointGain.sub(player.h.hexPoint.mul(0.05))
        if (player.h.hexPoint.add(player.h.hexPointGain.mul(delta)).gt(0)) player.h.hexPoint = player.h.hexPoint.add(player.h.hexPointGain.mul(delta))

        // PRE-POWER MULTIPLIER
        player.h.prePowerMult = new Decimal(1)
        player.h.prePowerMult = player.h.prePowerMult.mul(player.hrm.realmEssenceEffects[0])
        if (hasUpgrade("hpw", 121)) player.h.prePowerMult = player.h.prePowerMult.mul(3)
        if (hasUpgrade("hpw", 141)) player.h.prePowerMult = player.h.prePowerMult.mul(upgradeEffect("hpw", 141))
        player.h.prePowerMult = player.h.prePowerMult.mul(player.hre.refinementEffect[6][0])
        player.h.prePowerMult = player.h.prePowerMult.div(player.hrm.challengeSoftcap)
        player.h.prePowerMult = player.h.prePowerMult.div(player.h.preNerf)

        let externalPre = new Decimal(1)
        externalPre = externalPre.mul(levelableEffect("pu", 107)[1])
        externalPre = externalPre.mul(levelableEffect("pet", 1106)[0])
        externalPre = externalPre.mul(buyableEffect("al", 106))

        externalPre = externalPre.pow(player.h.externalRaise)
        player.h.prePowerMult = player.h.prePowerMult.mul(externalPre)
    },
    hexReq(value, base, scale, div = new Decimal(1), add = new Decimal(1)) {
        return value.add(add).pow(scale).mul(base).div(div).ceil()
    },
    hexGain(value, base, scale, div = new Decimal(1)) {
        return value.mul(div).div(base).pow(Decimal.div(1, scale)).floor()
    },
    effects() {
        let str = ""
        if (player.h.tickspeed.lt(1)) str = str.concat("Tickspeed is divided by /" + formatSimple(player.h.tickspeed) + "<br>")
        if (player.h.tickspeed.gt(1)) str = str.concat("<span style='color:#8f8'>Tickspeed is multiplied by x" + formatSimple(player.h.tickspeed) + "</span><br>")
        if (player.h.externalRaise.lt(1)) str = str.concat("External effects are raised by ^" + formatSimple(player.h.externalRaise, 3) + "<br>")
        if (player.h.externalRaise.gt(1)) str = str.concat("<span style='color:#8f8'>External effects are raised by ^" + formatSimple(player.h.externalRaise, 3) + "</span><br>")
        if (player.h.jinxDiv.gt(1)) str = str.concat("Jinx caps are divided by /" + formatSimple(player.h.jinxDiv) + "<br>")
        if (player.h.jinxDiv.lt(1)) str = str.concat("<span style='color:#8f8'>Jinx caps are multiplied by x" + formatSimple(player.h.jinxDiv) + "</span><br>")
        if (player.h.purifierDiv.gt(1)) str = str.concat("Purifier Efficiency are divided by /" + formatSimple(player.h.purifierDiv) + "<br>")
        if (player.h.purifierDiv.lt(1)) str = str.concat("<span style='color:#8f8'>Purifier Efficiency are multiplied by x" + formatSimple(player.h.purifierDiv) + "</span><br>")
        if (player.h.preNerf.neq(1)) str = str.concat("Pre-power resources are divided by /" + formatSimple(player.h.preNerf) + "<br>")
        if (player.h.powNerf.neq(1)) str = str.concat("Power is divided by /" + formatSimple(player.h.powNerf) + "<br>")
        return str
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["style-row", [["raw-html", () => {return layers.h.effects()}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}]], {lineHeight: "1"}],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["blank", "15px"],
    ],
    layerShown() { return player.startedGame == true && (inChallenge("ip", 13) || player.po.hex || hasUpgrade("s", 18)) && !player.cp.cantepocalypseActive && !player.sma.inStarmetalChallenge}
})
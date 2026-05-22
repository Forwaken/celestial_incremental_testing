addLayer("hbl", {
    name() {return player.h.stageName[0] + " of Blessings"},
    symbol: "Bl", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Blessings", // Decides the nodes tooltip
    nodeStyle: {background: "linear-gradient(140deg, #ffbf00 0%, #cc9800 100%)", backgroundOrigin: "borderBox", borderColor: "#7f5f00"},
    color: "#ffbf00", // Decides the nodes color.
    branches: ["hre"], // Decides the nodes branches.
    startData() { return {
        blessings: new Decimal(0),
        blessingsGain: new Decimal(0),
        blessingPerSec: new Decimal(0),
        boons: new Decimal(0),
        boonsGain: new Decimal(0),
        blessAutomation: false,
        minRefineInput: new Decimal(0),
        minRefine: new Decimal(1),

        boosters: {
            0: {
                level: new Decimal(0),
                xp: new Decimal(0),
                req: new Decimal(6),
                effect: new Decimal(1),
            },
            1: {
                level: new Decimal(0),
                xp: new Decimal(0),
                req: new Decimal(12),
                effect: new Decimal(1),
            },
            2: {
                level: new Decimal(0),
                xp: new Decimal(0),
                req: new Decimal(36),
                effect: new Decimal(1),
            },
            3: {
                level: new Decimal(0),
                xp: new Decimal(0),
                req: new Decimal(600),
                effect: new Decimal(1),
            },
            4: {
                level: new Decimal(0),
                xp: new Decimal(0),
                req: new Decimal(3600),
                effect: new Decimal(1),
            },
            5: {
                level: new Decimal(0),
                xp: new Decimal(0),
                req: new Decimal(21600),
                effect: new Decimal(0),
            },
        },
        boosterDeposit: 0.05,
    }},
    automate() {
        if (player.hbl.blessAutomation && player.hre.refinement.gte(player.hbl.minRefine)) {
            clickClickable("hbl", 1)
        }
    },
    update(delta) {
        player.hbl.blessingsGain = new Decimal(0)
        if (player.hre.refinement.gte(player.h.stage.mul(2))) player.hbl.blessingsGain = player.hre.refinement.sub(player.h.stage.mul(2).sub(1)).pow(Decimal.div(3.6, player.h.stage.max(4)).add(1))
        player.hbl.blessingsGain = player.hbl.blessingsGain.mul(player.hbl.boosters[4].effect)
        if (hasMilestone("hbl", 1)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(2)
        if (hasMilestone("hbl", 1) || inChallenge("hrm", 12)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(player.hpu.purifiers[1].effect)
        if (hasUpgrade("hpw", 1)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(upgradeEffect("hpw", 1))
        player.hbl.blessingsGain = player.hbl.blessingsGain.mul(player.hre.refinementEffect[4][0])
        if (hasMilestone("hpw", 3) && player.hbl.blessings.lt(6e5) && !inChallenge("hrm", 13)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(2)
        if (hasMilestone("hpw", 6) && player.hbl.blessings.lt(6e5) && !inChallenge("hrm", 13)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(2)
        if (hasUpgrade("hpw", 71)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(upgradeEffect("hpw", 71))
        if (hasUpgrade("hve", 31)) player.hbl.blessingsGain = player.hbl.blessingsGain.mul(3)
        player.hbl.blessingsGain = player.hbl.blessingsGain.mul(player.h.prePowerMult)

        // POWER AND AUTOMATION
        if (hasUpgrade("hve", 62)) player.hbl.blessingsGain = player.hbl.blessingsGain.pow(1.03)

        let bps = new Decimal(0)
        if (!inChallenge("hrm", 11)) bps = player.hpu.purifiers[4].effect
        if (hasMilestone("hre", 12) && !inChallenge("hrm", 11)) bps = bps.add(0.01)
        if (hasMilestone("s", 13) && !inChallenge("hrm", 11)) bps = bps.add(0.05)
        player.hbl.blessingPerSec = player.hbl.blessingsGain.mul(bps)
        if (inChallenge("hrm", 13)) player.hbl.blessingPerSec = player.hbl.blessingPerSec.sub(player.hbl.blessings.mul(0.05))
        if (player.hbl.blessings.add(player.hbl.blessingPerSec.mul(delta)).gt(0)) player.hbl.blessings = player.hbl.blessings.add(player.hbl.blessingPerSec.mul(delta))
        
        // BOON START
        player.hbl.boonsGain = player.hbl.blessings.pow(Decimal.div(3.6, player.h.stage.max(4)).add(1)).div(player.h.stage)
        player.hbl.boonsGain = player.hbl.boonsGain.mul(player.hbl.boosters[1].effect)
        player.hbl.boonsGain = player.hbl.boonsGain.mul(player.hre.refinementEffect[3][0])
        player.hbl.boonsGain = player.hbl.boonsGain.mul(buyableEffect("hcu", 108))
        if (hasMilestone("hbl", 4)) player.hbl.boonsGain = player.hbl.boonsGain.mul(2)
        if (hasMilestone("hbl", 4) || inChallenge("hrm", 12)) player.hbl.boonsGain = player.hbl.boonsGain.mul(player.hpu.purifiers[1].effect)
        player.hbl.boonsGain = player.hbl.boonsGain.mul(player.h.prePowerMult)

        // POWER AND AUTOMATION
        if (inChallenge("hrm", 12)) player.hbl.boonsGain = player.hbl.boonsGain.pow(Decimal.div(3.6, player.h.stage.max(4)))

        if (inChallenge("hrm", 13)) player.hbl.boonsGain = player.hbl.boonsGain.sub(player.hbl.boons.mul(0.05))
        if (player.hbl.boons.add(player.hbl.boonsGain.mul(delta)).gt(0)) player.hbl.boons = player.hbl.boons.add(player.hbl.boonsGain.mul(delta))
        if (!inChallenge("hrm", 15)) {
            let val = 0
            if (hasUpgrade("hpw", 52)) val += 0.1
            if (hasUpgrade("hpw", 51)) val *= 10
            if (hasUpgrade("hpw", 53)) val *= 10
            if (hasMilestone("s", 20)) val += 0.06
            for (let i in player.hbl.boosters) {
                player.hbl.boosters[i].xp = player.hbl.boosters[i].xp.add(player.hbl.boons.mul(val).mul(delta))
            }
        }

        player.hbl.boosters[0].req = Decimal.pow(player.h.stage, player.hbl.boosters[0].level)
        player.hbl.boosters[1].req = Decimal.pow(player.h.stage.mul(2), player.hbl.boosters[1].level.add(1))
        player.hbl.boosters[2].req = Decimal.pow(player.h.stage.mul(5), player.hbl.boosters[2].level.add(1))
        player.hbl.boosters[3].req = Decimal.pow(player.h.stage.mul(10), player.hbl.boosters[3].level.add(2))
        player.hbl.boosters[4].req = Decimal.pow(player.h.stage.mul(20), player.hbl.boosters[4].level.add(2))
        player.hbl.boosters[5].req = Decimal.pow(player.h.stage.mul(30), player.hbl.boosters[5].level.add(2))

        for (let i in player.hbl.boosters) {
            if (player.hbl.boosters[i].xp.gte(player.hbl.boosters[i].req.mul(0.99))) {
                player.hbl.boosters[i].xp = new Decimal(0)
                player.hbl.boosters[i].level = player.hbl.boosters[i].level.add(1)
            }
        }

        player.hbl.boosters[0].effect = Decimal.pow(Decimal.div(1.8, player.h.stage).add(1), player.hbl.boosters[0].level)
        if (hasMilestone("hre", 2)) player.hbl.boosters[0].effect = player.hbl.boosters[0].effect.mul(player.hbl.boosters[0].xp.div(player.hbl.boosters[0].req).mul(Decimal.div(0.9, player.h.stage)).add(1))
        if (player.hbl.boosters[0].effect.gte(Decimal.pow10(player.h.stage.mul(1.5)))) player.hbl.boosters[0].effect = player.hbl.boosters[0].effect.div(Decimal.pow10(player.h.stage.mul(1.5))).pow(Decimal.div(1.8, player.h.stage.max(2))).mul(Decimal.pow10(player.h.stage.mul(1.5)))
        if (!inChallenge("hrm", 12)) player.hbl.boosters[0].effect = player.hbl.boosters[0].effect.pow(player.hpu.purifiers[3].effect)
        
        player.hbl.boosters[1].effect = Decimal.pow(Decimal.div(3.6, player.h.stage).add(1), player.hbl.boosters[1].level)
        if (hasMilestone("hre", 2)) player.hbl.boosters[1].effect = player.hbl.boosters[1].effect.mul(player.hbl.boosters[1].xp.div(player.hbl.boosters[1].req).mul(Decimal.div(1.8, player.h.stage)).add(1))

        player.hbl.boosters[2].effect = Decimal.pow(Decimal.mul(Decimal.div(player.h.stage, 100), player.hbl.boosters[5].effect).add(1), player.hbl.boosters[2].level)
        if (hasMilestone("hre", 2)) player.hbl.boosters[2].effect = player.hbl.boosters[2].effect.mul(player.hbl.boosters[2].xp.div(player.hbl.boosters[2].req).mul(Decimal.mul(Decimal.div(player.h.stage, 100), player.hbl.boosters[5].effect)).add(1))
        if (player.hbl.boosters[2].effect.gte(Decimal.pow10(player.h.stage.mul(1.5)))) player.hbl.boosters[2].effect = player.hbl.boosters[2].effect.div(Decimal.pow10(player.h.stage.mul(1.5))).pow(Decimal.add(0.3, buyableEffect("hrm", 3))).mul(Decimal.pow10(player.h.stage.mul(1.5)))

        if (!hasUpgrade("hpw", 12)) player.hbl.boosters[3].effect = Decimal.pow(Decimal.div(6, player.h.stage).add(1), player.hbl.boosters[3].level)
        if (hasUpgrade("hpw", 12)) player.hbl.boosters[3].effect = Decimal.pow(Decimal.div(12, player.h.stage).add(1), player.hbl.boosters[3].level)
        if (hasMilestone("hre", 2)) {
            if (!hasUpgrade("hpw", 12)) player.hbl.boosters[3].effect = player.hbl.boosters[3].effect.mul(player.hbl.boosters[3].xp.div(player.hbl.boosters[3].req).mul(Decimal.div(3, player.h.stage)).add(1))
            if (hasUpgrade("hpw", 12)) player.hbl.boosters[3].effect = player.hbl.boosters[3].effect.mul(player.hbl.boosters[3].xp.div(player.hbl.boosters[3].req).add(Decimal.div(4.5, player.h.stage)))
        }
        if (player.hbl.boosters[3].effect.gte(Decimal.pow10(player.h.stage.mul(2)))) player.hbl.boosters[3].effect = player.hbl.boosters[3].effect.div(Decimal.pow10(player.h.stage.mul(2))).pow(0.3).mul(Decimal.pow10(player.h.stage.mul(2)))

        if (!hasUpgrade("hve", 32)) player.hbl.boosters[4].effect = Decimal.pow(Decimal.div(3, player.h.stage).add(1), player.hbl.boosters[4].level)
        if (hasUpgrade("hve", 32)) player.hbl.boosters[4].effect = Decimal.pow(Decimal.div(3, player.h.stage).add(1.1), player.hbl.boosters[4].level)
        if (hasMilestone("hre", 2)) {
            if (!hasUpgrade("hve", 32)) player.hbl.boosters[4].effect = player.hbl.boosters[4].effect.mul(player.hbl.boosters[4].xp.div(player.hbl.boosters[4].req).mul(Decimal.div(1.5, player.h.stage)).add(1))
            if (hasUpgrade("hve", 32)) player.hbl.boosters[4].effect = player.hbl.boosters[4].effect.mul(player.hbl.boosters[4].xp.div(player.hbl.boosters[4].req).mul(Decimal.div(1.5, player.h.stage).add(0.05)).add(1))
        }

        if (!hasMilestone("hbl", 2)) player.hbl.boosters[5].effect = Decimal.pow(Decimal.div(player.h.stage, 3), player.hbl.boosters[5].level)
        if (hasMilestone("hbl", 2)) player.hbl.boosters[5].effect = Decimal.pow(Decimal.div(player.h.stage, 3).mul(1.2), player.hbl.boosters[5].level)
        if (hasMilestone("hre", 2)) {
            if (!hasMilestone("hbl", 2)) player.hbl.boosters[5].effect = player.hbl.boosters[5].effect.mul(player.hbl.boosters[5].xp.div(player.hbl.boosters[5].req).mul(Decimal.div(player.h.stage, 6)).add(1))
            if (hasMilestone("hbl", 2)) player.hbl.boosters[5].effect = player.hbl.boosters[5].effect.mul(player.hbl.boosters[5].xp.div(player.hbl.boosters[5].req).mul(Decimal.div(player.h.stage, 6).mul(1.1)).add(1))
        }
        if (player.hbl.boosters[5].effect.gte(16)) player.hbl.boosters[5].effect = player.hbl.boosters[5].effect.log(2.4).mul(5)

        // AUTOMATION LIMIT
        if (player.hbl.minRefineInput.gte(1)) player.hbl.minRefine = player.hbl.minRefineInput.floor()
        if (player.hbl.minRefineInput.lt(1)) player.hbl.minRefine = new Decimal(1)
    },
    clickables: {
        1: {
            title() {
                if (inChallenge("hrm", 16)) return "<h2>Bless, but reset " + player.h.stageName[1] + " points and refinement.</h2><br><h3>Req: " + formatWhole(player.h.stage.mul(2)) + " Refinements.</h3>"
                return "<h2>Bless, but reset " + player.h.stageName[1] + " points, provenance, and refinement.</h2><br><h3>Req: " + formatWhole(player.h.stage.mul(2)) + " Refinements.</h3>"
            },
            canClick() {
                if (!inChallenge("hrm", 11)) return player.hre.refinement.gte(player.h.stage.mul(2))
                if (inChallenge("hrm", 11)) return player.hre.refinement.gte(player.h.stage.mul(2)) && player.hrm.blessLimit.lt(player.h.stage)
            },
            unlocked: true,
            onClick() {
                if (!hasAchievement("achievements", 121)) completeAchievement("achievements", 121)
                player.hbl.blessings = player.hbl.blessings.add(player.hbl.blessingsGain)
                if (inChallenge("hrm", 11)) player.hrm.blessLimit = player.hrm.blessLimit.add(1)

                // RESET CODE
                player.hre.refinement = new Decimal(0)
                player.hre.refinementGain = new Decimal(0)
                player.hre.refinementEffect = [[new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)]]
                for (let i = 0; i < 6; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style: {width: "400px", minHeight: "100px", border: "2px solid black", borderRadius: "15px"},
        },
        2: {
            title() {
                let str = "<h3>" + player.h.stageName[0] + " Point Booster <small>Lv." + formatWhole(player.hbl.boosters[0].level) + "</small></h3><br>(" + formatWhole(player.hbl.boosters[0].xp) + "/" + formatWhole(player.hbl.boosters[0].req) + ")<br>x" + format(player.hbl.boosters[0].effect) + " " + player.h.stageName[0] + " Points<br><small>(Hold to deposit boons)</small>"
                if (player.hbl.boosters[0].effect.pow(Decimal.div(1, player.hpu.purifiers[3].effect)).gte(Decimal.pow10(player.h.stage.mul(1.5)))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick: true,
            unlocked: true,
            onClick() {this.onHold()},
            onHold() {
                let amt = player.hbl.boosters[0].req.mul(player.hbl.boosterDeposit).min(player.hbl.boosters[0].req.sub(player.hbl.boosters[0].xp))
                if (player.hbl.boons.gte(amt)) {
                    player.hbl.boosters[0].xp = player.hbl.boosters[0].xp.add(amt)
                    player.hbl.boons = player.hbl.boons.sub(amt)
                    if (player.hbl.boosters[0].xp.gte(player.hbl.boosters[0].req.mul(0.99))) {
                        player.hbl.boosters[0].xp = new Decimal(0)
                        player.hbl.boosters[0].level = player.hbl.boosters[0].level.add(1)
                        player.hbl.boosters[0].req = Decimal.pow(player.h.stage, player.hbl.boosters[0].level)
                    }
                }
            },
            style() {
                return {background: `linear-gradient(to right, #ffbf00 ${format(player.hbl.boosters[0].xp.div(player.hbl.boosters[0].req).mul(100).min(100))}%, #cc9800 ${format(player.hbl.boosters[0].xp.div(player.hbl.boosters[0].req).mul(100).add(0.25).min(100))}%)`, width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "10px", margin: "3px"}
            },
        },
        3: {
            title() { return "<h3>Boon Booster <small>Lv." + formatWhole(player.hbl.boosters[1].level) + "</small></h3><br>(" + formatWhole(player.hbl.boosters[1].xp) + "/" + formatWhole(player.hbl.boosters[1].req) + ")<br>x" + format(player.hbl.boosters[1].effect) + " Boons<br><small>(Hold to deposit boons)</small>" },
            canClick: true,
            unlocked: true,
            onClick() {this.onHold()},
            onHold() {
                let amt = player.hbl.boosters[1].req.mul(player.hbl.boosterDeposit).min(player.hbl.boosters[1].req.sub(player.hbl.boosters[1].xp))
                if (player.hbl.boons.gte(amt)) {
                    player.hbl.boosters[1].xp = player.hbl.boosters[1].xp.add(amt)
                    player.hbl.boons = player.hbl.boons.sub(amt)
                    if (player.hbl.boosters[1].xp.gte(player.hbl.boosters[1].req.mul(0.99))) {
                        player.hbl.boosters[1].xp = new Decimal(0)
                        player.hbl.boosters[1].level = player.hbl.boosters[1].level.add(1)
                        player.hbl.boosters[1].req = Decimal.pow(player.h.stage.mul(2), player.hbl.boosters[1].level.add(1))
                    }
                }
            },
            style() {
                return {background: `linear-gradient(to right, #ffbf00 ${format(player.hbl.boosters[1].xp.div(player.hbl.boosters[1].req).mul(100).min(100))}%, #cc9800 ${format(player.hbl.boosters[1].xp.div(player.hbl.boosters[1].req).mul(100).add(0.25).min(100))}%)`, width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "10px", margin: "3px"}
            },
        },
        4: {
            title() {
                let str = "<h3>IP Booster <small>Lv." + formatWhole(player.hbl.boosters[2].level) + "</small></h3><br>(" + formatWhole(player.hbl.boosters[2].xp) + "/" + formatWhole(player.hbl.boosters[2].req) + ")<br>x" + format(player.hbl.boosters[2].effect) + " Infinity Points<br><small>(Hold to deposit boons)</small>"
                if (player.hbl.boosters[2].effect.gte(Decimal.pow10(player.h.stage.mul(1.5)))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick: true,
            unlocked: true,
            tooltip() {return "Works outside of " + player.h.stageName[1] + "."},
            onClick() {this.onHold()},
            onHold() {
                let amt = player.hbl.boosters[2].req.mul(player.hbl.boosterDeposit).min(player.hbl.boosters[2].req.sub(player.hbl.boosters[2].xp))
                if (player.hbl.boons.gte(amt)) {
                    player.hbl.boosters[2].xp = player.hbl.boosters[2].xp.add(amt)
                    player.hbl.boons = player.hbl.boons.sub(amt)
                    if (player.hbl.boosters[2].xp.gte(player.hbl.boosters[2].req.mul(0.99))) {
                        player.hbl.boosters[2].xp = new Decimal(0)
                        player.hbl.boosters[2].level = player.hbl.boosters[2].level.add(1)
                        player.hbl.boosters[2].req = Decimal.pow(player.h.stage.mul(5), player.hbl.boosters[2].level.add(1))
                    }
                }
            },
            style() {
                return {background: `linear-gradient(to right, #ffbf00 ${format(player.hbl.boosters[2].xp.div(player.hbl.boosters[2].req).mul(100).min(100))}%, #cc9800 ${format(player.hbl.boosters[2].xp.div(player.hbl.boosters[2].req).mul(100).add(0.25).min(100))}%)`, width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "10px", margin: "3px"}
            },
        },
        5: {
            title() {
                let str = "<h3>Refiner Req Booster <small>Lv." + formatWhole(player.hbl.boosters[3].level) + "</small></h3><br>(" + formatWhole(player.hbl.boosters[3].xp) + "/" + formatWhole(player.hbl.boosters[3].req) + ")<br>/" + format(player.hbl.boosters[3].effect) + " Refinement Req<br><small>(Hold to deposit boons)</small>"
                if (player.hbl.boosters[3].effect.gte(Decimal.pow10(player.h.stage.mul(2)))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick: true,
            unlocked() {return hasUpgrade("ta", 15)},
            onClick() {this.onHold()},
            onHold() {
                let amt = player.hbl.boosters[3].req.mul(player.hbl.boosterDeposit).min(player.hbl.boosters[3].req.sub(player.hbl.boosters[3].xp))
                if (player.hbl.boons.gte(amt)) {
                    player.hbl.boosters[3].xp = player.hbl.boosters[3].xp.add(amt)
                    player.hbl.boons = player.hbl.boons.sub(amt)
                    if (player.hbl.boosters[3].xp.gte(player.hbl.boosters[3].req.mul(0.99))) {
                        player.hbl.boosters[3].xp = new Decimal(0)
                        player.hbl.boosters[3].level = player.hbl.boosters[3].level.add(1)
                        player.hbl.boosters[3].req = Decimal.pow(player.h.stage.mul(10), player.hbl.boosters[3].level.add(2))
                    }
                }
            },
            style() {
                return {background: `linear-gradient(to right, #ffbf00 ${format(player.hbl.boosters[3].xp.div(player.hbl.boosters[3].req).mul(100).min(100))}%, #cc9800 ${format(player.hbl.boosters[3].xp.div(player.hbl.boosters[3].req).mul(100).add(0.25).min(100))}%)`, width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "10px", margin: "3px"}
            },
        },
        6: {
            title() { return "<h3>Blessing Booster <small>Lv." + formatWhole(player.hbl.boosters[4].level) + "</small></h3><br>(" + formatWhole(player.hbl.boosters[4].xp) + "/" + formatWhole(player.hbl.boosters[4].req) + ")<br>x" + format(player.hbl.boosters[4].effect) + " Blessings<br><small>(Hold to deposit boons)</small>" },
            canClick: true,
            unlocked() {return hasUpgrade("ta", 15)},
            onClick() {this.onHold()},
            onHold() {
                let amt = player.hbl.boosters[4].req.mul(player.hbl.boosterDeposit).min(player.hbl.boosters[4].req.sub(player.hbl.boosters[4].xp))
                if (player.hbl.boons.gte(amt)) {
                    player.hbl.boosters[4].xp = player.hbl.boosters[4].xp.add(amt)
                    player.hbl.boons = player.hbl.boons.sub(amt)
                    if (player.hbl.boosters[4].xp.gte(player.hbl.boosters[4].req.mul(0.99))) {
                        player.hbl.boosters[4].xp = new Decimal(0)
                        player.hbl.boosters[4].level = player.hbl.boosters[4].level.add(1)
                        player.hbl.boosters[4].req = Decimal.pow(player.h.stage.mul(20), player.hbl.boosters[4].level.add(2))
                    }
                }
            },
            style() {
                return {background: `linear-gradient(to right, #ffbf00 ${format(player.hbl.boosters[4].xp.div(player.hbl.boosters[4].req).mul(100).min(100))}%, #cc9800 ${format(player.hbl.boosters[4].xp.div(player.hbl.boosters[4].req).mul(100).add(0.25).min(100))}%)`, width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "10px", margin: "3px"}
            },
        },
        7: {
            title() {
                let str = "<h3>IP Booster Booster <small>Lv." + formatWhole(player.hbl.boosters[5].level) + "</small></h3><br>(" + formatWhole(player.hbl.boosters[5].xp) + "/" + formatWhole(player.hbl.boosters[5].req) + ")<br>x" + format(player.hbl.boosters[5].effect) + " IP Booster Base<br><small>(Hold to deposit boons)</small>"
                if (player.hbl.boosters[5].effect.gte(16)) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick: true,
            unlocked() {return hasUpgrade("ta", 15)},
            onClick() {this.onHold()},
            onHold() {
                let amt = player.hbl.boosters[5].req.mul(player.hbl.boosterDeposit).min(player.hbl.boosters[5].req.sub(player.hbl.boosters[5].xp))
                if (player.hbl.boons.gte(amt)) {
                    player.hbl.boosters[5].xp = player.hbl.boosters[5].xp.add(amt)
                    player.hbl.boons = player.hbl.boons.sub(amt)
                    if (player.hbl.boosters[5].xp.gte(player.hbl.boosters[5].req.mul(0.99))) {
                        player.hbl.boosters[5].xp = new Decimal(0)
                        player.hbl.boosters[5].level = player.hbl.boosters[5].level.add(1)
                        player.hbl.boosters[5].req = Decimal.pow(player.h.stage.mul(30), player.hbl.boosters[5].level.add(2))
                    }
                }
            },
            style() {
                return {background: `linear-gradient(to right, #ffbf00 ${format(player.hbl.boosters[5].xp.div(player.hbl.boosters[5].req).mul(100).min(100))}%, #cc9800 ${format(player.hbl.boosters[5].xp.div(player.hbl.boosters[5].req).mul(100).add(0.25).min(100))}%)`, width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "10px", margin: "3px"}
            },
        },
        101: {
            title() {
                if (player.hbl.blessAutomation) return "<h2>Automatically click the bless button</h2><br><h3>[ON]</h3>"
                return "<h2>Automatically click the bless button</h2><br><h3>[OFF]</h3>"
            },
            canClick: true,
            unlocked: true,
            onClick() {
                if (player.hbl.blessAutomation) {
                    player.hbl.blessAutomation = false
                } else {
                    player.hbl.blessAutomation = true
                }
            },
            style() {
                let look = {width: "300px", minHeight: "100px", border: "0px", padding: "10px", borderRadius: "0 0 0 13px"}
                if (player.hbl.blessAutomation) look.backgroundColor = "#ffbf00"
                if (!player.hbl.blessAutomation) look.backgroundColor = "#cc9800"
                return look
            }
        },
        102: {
            title: "5%",
            canClick() { return player.hbl.boosterDeposit != 0.05},
            unlocked() { return hasMilestone("hre", 7)},
            onClick() {
                player.hbl.boosterDeposit = 0.05
            },
            style: {width: "50px", minHeight: "40px", borderRadius: "0px"},
        },
        103: {
            title: "25%",
            canClick() { return player.hbl.boosterDeposit != 0.25},
            unlocked() { return hasMilestone("hre", 7)},
            onClick() {
                player.hbl.boosterDeposit = 0.25
            },
            style: {width: "50px", minHeight: "40px", borderRadius: "0px"},
        },
        104: {
            title: "100%",
            canClick() { return player.hbl.boosterDeposit != 1},
            unlocked() { return hasMilestone("hre", 7)},
            onClick() {
                player.hbl.boosterDeposit = 1
            },
            style: {width: "50px", minHeight: "40px", borderRadius: "0 13px 13px 0"},
        },
    },
    upgrades: {
        1: {
            title: "Grace I",
            unlocked() {return tmp.hbl.microtabs.blessing.Graces.unlocked},
            description: "Increase jinx cap based on NIP.",
            cost() {return player.h.stage.pow(2).mul(player.h.stage.sub(1)).div(player.h.stage.div(2))},
            currencyLocation() { return player.hbl },
            currencyDisplayName: "Blessings",
            currencyInternalName: "blessings",
            effect() {
                let eff = player.ta.negativeInfinityPoints.add(1).log(player.h.stage.max(2)).pow(Decimal.div(3.6, player.h.stage.max(4))).ceil()
                if (inChallenge("hrm", 12)) eff = eff.pow(Decimal.div(1.8, player.h.stage.max(2))).ceil()
                if (eff.gte(player.h.stage.mul(1.5))) eff = eff.div(player.h.stage.mul(1.5)).pow(Decimal.div(1.8, player.h.stage.max(2))).mul(player.h.stage.mul(1.5)).ceil().min(player.h.stage.mul(3))
                return eff
            },
            effectDisplay() {
                if (upgradeEffect(this.layer, this.id).lt(player.h.stage.mul(1.5))) return "+" + formatWhole(upgradeEffect(this.layer, this.id))
                if (upgradeEffect(this.layer, this.id).lt(player.h.stage.mul(3))) return "+" + formatWhole(upgradeEffect(this.layer, this.id)) + "<br><small style='color:red'>[SOFTCAPPED]</small>"
                return "+" + formatWhole(upgradeEffect(this.layer, this.id)) + "<br><small style='color:red'>[HARDCAPPED]</small>"
            }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        2: {
            title: "Grace II",
            unlocked() {return tmp.hbl.microtabs.blessing.Graces.unlocked},
            description() {return "IP boosts " + player.h.stageName[1] + " point gain."},
            cost() {return player.h.stage.pow(2).mul(player.h.stage.sub(1))},
            currencyLocation() { return player.hbl },
            currencyDisplayName: "Blessings",
            currencyInternalName: "blessings",
            effect() {
                let eff = player.in.infinityPoints.add(1).log(player.h.stage.max(2)).pow(Decimal.div(3.6, player.h.stage.max(4))).add(1)
                if (inChallenge("hrm", 12)) eff = eff.pow(Decimal.div(1.8, player.h.stage.max(2)))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        3: {
            title: "Grace III",
            unlocked() {return tmp.hbl.microtabs.blessing.Graces.unlocked},
            description: "Infinities reduce refinement req.",
            cost() {return player.h.stage.pow(3).mul(player.h.stage.sub(1)).div(player.h.stage.div(2))},
            currencyLocation() { return player.hbl },
            currencyDisplayName: "Blessings",
            currencyInternalName: "blessings",
            effect() {
                let eff = player.in.infinities.add(1).log(player.h.stage.div(2).max(2)).pow(Decimal.div(3.6, player.h.stage.max(4))).add(1)
                if (inChallenge("hrm", 12)) eff = eff.pow(Decimal.div(1.8, player.h.stage.max(2)))
                return eff
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        4: {
            title: "Grace IV",
            unlocked() { return hasUpgrade("bi", 12) },
            description: "Infinitums boost curse gain.",
            cost() {return player.h.stage.pow(3).mul(player.h.stage.sub(1).mul(2)).div(player.h.stage.div(2))},
            currencyLocation() { return player.hbl },
            currencyDisplayName: "Blessings",
            currencyInternalName: "blessings",
            effect() {
                let eff = player.tad.infinitum.add(1).log(player.h.stage.max(2)).pow(Decimal.div(18, player.h.stage).add(1)).add(1).pow(player.hpu.purifiers[5].effect)
                if (inChallenge("hrm", 12)) eff = eff.pow(Decimal.div(1.8, player.h.stage.max(2)))
                return eff
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        5: {
            title: "Grace V",
            unlocked() { return hasUpgrade("bi", 12) },
            description() {return "Highest Rocket fuel boosts " + player.h.stageName[1] + " point gain."},
            cost() {return player.h.stage.pow(4).mul(player.h.stage.sub(1).mul(2)).div(player.h.stage.div(2).pow(2))},
            currencyLocation() { return player.hbl },
            currencyDisplayName: "Blessings",
            currencyInternalName: "blessings",
            effect() {
                let eff = player.ta.highestRocketFuel.add(1).log(player.h.stage.max(2)).pow(Decimal.div(3.6, player.h.stage.max(4))).add(1)
                if (inChallenge("hrm", 12)) eff = eff.pow(Decimal.div(1.8, player.h.stage.max(2)))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        6: {
            title: "Grace VI",
            unlocked() { return hasUpgrade("bi", 12) },
            description() {
                if (inChallenge("hrm", 16)) return "Highest Dice Points boosts refiner 1 effects."
                return "Highest Dice Points boosts provenance effects."
            },
            cost() {return player.h.stage.pow(4).mul(player.h.stage.sub(1).mul(4)).div(player.h.stage.div(2).pow(2))},
            currencyLocation() { return player.hbl },
            currencyDisplayName: "Blessings",
            currencyInternalName: "blessings",
            effect() {
                let eff = player.ta.highestDicePoints.add(1).log(player.h.stage.max(1).mul(10)).pow(0.1).mul(Decimal.div(3.6, player.h.stage)).add(1)
                if (inChallenge("hrm", 12)) eff = eff.pow(Decimal.div(1.8, player.h.stage.max(2)))
                if (inChallenge("hrm", 16)) eff = eff.pow(0.5).sub(1).min(0.5)
                return eff
            },
            effectDisplay() {
                if (inChallenge("hrm", 16)) {
                    if (upgradeEffect(this.layer, this.id).gte(0.5)) return "+^" + format(upgradeEffect(this.layer, this.id)) + " <small style='color:red'>[HARDCAPPED]</small>"
                    return "+^" + format(upgradeEffect(this.layer, this.id))
                }
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
    },
    milestones: {
        1: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(4).mul(player.h.stage.sub(1).pow(2)).div(player.h.stage.div(2).pow(2))) + " Blessings"},
            effectDescription() { return "x" + format(new Decimal(2).mul(player.hpu.purifiers[1].effect)) + " Blessings."},
            done() { return player.hbl.blessings.gte(player.h.stage.pow(4).mul(player.h.stage.sub(1).pow(2)).div(player.h.stage.div(2).pow(2))) && tmp.hbl.microtabs.blessing.Miracles.unlocked},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        2: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(4).mul(player.h.stage.sub(1).pow(3)).div(player.h.stage.div(2).pow(3))) + " Blessings"},
            effectDescription: "Increase base of IP Booster Booster by x1.2.",
            done() { return player.hbl.blessings.gte(player.h.stage.pow(4).mul(player.h.stage.sub(1).pow(3)).div(player.h.stage.div(2).pow(3))) && tmp.hbl.microtabs.blessing.Miracles.unlocked},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        3: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(5).mul(player.h.stage.sub(1).pow(3)).div(player.h.stage.div(2).pow(4))) + " Blessings"},
            effectDescription() {return "Increase jinx cap by " + formatWhole(player.h.stage) + "."},
            done() { return player.hbl.blessings.gte(player.h.stage.pow(5).mul(player.h.stage.sub(1).pow(3)).div(player.h.stage.div(2).pow(4))) && tmp.hbl.microtabs.blessing.Miracles.unlocked},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        4: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(5).mul(player.h.stage.sub(1).pow(3)).div(player.h.stage.div(2).pow(3))) + " Blessings"},
            effectDescription() { return "x" + format(new Decimal(2).mul(player.hpu.purifiers[1].effect)) + " Boons."},
            done() { return player.hbl.blessings.gte(player.h.stage.pow(5).mul(player.h.stage.sub(1).pow(3)).div(player.h.stage.div(2).pow(3))) && tmp.hbl.microtabs.blessing.Miracles.unlocked},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        5: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(6).mul(player.h.stage.sub(1).pow(4)).div(player.h.stage.div(2).pow(5))) + " Blessings"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Boost refiner 1 effects by +^" + formatSimple(player.h.stage.min(20).div(20)) + "."
                return "Boost provenance effects by x" + formatSimple(player.h.stage.min(20).div(20).add(1), 2) + "."
            },
            done() { return player.hbl.blessings.gte(player.h.stage.pow(6).mul(player.h.stage.sub(1).pow(4)).div(player.h.stage.div(2).pow(5))) && tmp.hbl.microtabs.blessing.Miracles.unlocked},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        6: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(7).mul(player.h.stage.sub(1).pow(4)).div(player.h.stage.div(2).pow(5).mul(2))) + " Blessings"},
            effectDescription: "Increase base of Λ-Jinx by +0.02.",
            done() { return player.hbl.blessings.gte(player.h.stage.pow(7).mul(player.h.stage.sub(1).pow(4)).div(player.h.stage.div(2).pow(5).mul(2))) && tmp.hbl.microtabs.blessing.Miracles.unlocked},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
    },
    microtabs: {
        blessing: {
            "Boons": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "5px"],
                    ["row", [
                        ["raw-html", () => {return "You have <h3>" + format(player.hbl.boons) + "</h3> boons." }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", () => {return player.hbl.boonsGain.eq(0) ? "" : player.hbl.boonsGain.gt(0) ? "(+" + format(player.hbl.boonsGain) + "/s)" : "<span style='color:red'>(" + format(player.hbl.boonsGain) + "/s)</span>" }, {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                        ["raw-html", () => {return inChallenge("hrm", 12) && player.hbl.boonsGain.gt(0) ? "<small>[SOFTCAPPED]</small>" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                    ]],
                    ["blank", "10px"],
                    ["row", [["clickable", 2], ["clickable", 3], ["clickable", 4]]],
                    ["row", [["clickable", 5], ["clickable", 6], ["clickable", 7]]],
                    ["blank", "10px"],
                    ["style-row", [
                        ["style-row", [
                            ["raw-html", "Deposit Rate", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "98px", height: "40px", borderRight: "2px solid black"}],
                        ["clickable", 102], ["clickable", 103], ["clickable", 104]
                    ], () => {
                        if (hasMilestone("hre", 7)) return {width: "250px", height: "40px", backgroundColor: "#332600", border: "2px solid black", borderRadius: "15px"}
                        return {display: "none !important"}
                    }],
                ]
            },
            "Graces": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked() { return hasUpgrade("ta", 18) || hasUpgrade("bi", 12)},
                content: [
                    ["blank", "5px"],
                    ["row", [["upgrade", 1], ["upgrade", 2], ["upgrade", 3]]],
                    ["row", [["upgrade", 4], ["upgrade", 5], ["upgrade", 6]]],
                ]
            },
            "Miracles": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked() { return hasUpgrade("bi", 103) && !inChallenge("hrm", 12)},
                content: [
                    ["blank", "5px"],
                    ["milestone", 1],
                    ["milestone", 2],
                    ["milestone", 3],
                    ["milestone", 4],
                    ["milestone", 5],
                    ["milestone", 6],
                ]
            },
            "Autoclicker": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked() {return hasMilestone("hre", 5) && !inChallenge("hrm", 15)},
                content: [
                    ["blank", "10px"],
                    ["row", [
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Autoclicker", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ], {width: "300px", height: "48px", borderBottom: "2px solid white"}],
                            ["clickable", 101],
                        ], {width: "300px", height: "150px", backgroundColor: "#332600", border: "2px solid white", borderRadius: "15px 0 0 15px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Min. Refinement", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ], {width: "300px", height: "48px", borderBottom: "2px solid white"}],
                            ["style-column", [
                                ["raw-html", () => { return "Current minimum: " + formatWhole(player.hbl.minRefine)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                                ["blank", "10px"],
                                ["text-input", "minRefineInput", {backgroundColor: "#191300", color: "white", width: "180px", padding: "0 10px", textAlign: "left", fontSize: "28px", border: "2px solid black"}],
                            ], {width: "300px", height: "100px"}],
                        ], {width: "300px", height: "150px", backgroundColor: "#332600", border: "2px solid white", borderLeft: "0px", borderRadius: "0 15px 15px 0"}],
                    ]],
                ]
            },
        },
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return player.h.stageName[0] + " of Blessings"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#4c3900", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["tooltip-row", [
            ["raw-html", () => {return "You have <h3>" + format(player.hbl.blessings) + "</h3> blessings." }, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return "(+" + format(player.hbl.blessingsGain) + ")" }, () => {
                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hre.refinement.gte(player.h.stage.mul(2)) ? look.color = "white" : look.color = "gray"
                return look
            }],
            ["raw-html", () => {return player.hbl.blessingPerSec.eq(0) ? "" : player.hbl.blessingPerSec.gt(0) ? "(+" + format(player.hbl.blessingPerSec) + "/s)" : "<span style='color:red'>(" + format(player.hbl.blessingPerSec) + "/s)</span>" }, {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return "<div class='bottomTooltip'>Base Formula<hr><small>(Refinements-" + formatWhole(player.h.stage.mul(2).sub(1)) + ")^" + formatSimple(Decimal.div(3.6, player.h.stage.add(1)), 2) + "</small></div>"}],
        ]],
        ["raw-html", () => {return inChallenge("hrm", 11) ? "Bless resets used: " + formatWhole(player.hrm.blessLimit) + "/" + formatWhole(player.h.stage) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "5px"],
        ["microtabs", "blessing", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return hasChallenge("ip", 13) }, // Decides if this node is shown or not.
});
addLayer("hpu", {
    name() {return player.h.stageName[0] + " of Purity"},
    symbol: "Pu", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Purity", // Decides the nodes tooltip
    nodeStyle: {background: "linear-gradient(140deg, #e0d4ad 0%, #b3a98a 100%)", backgroundOrigin: "borderBox", borderColor: "#706a56"},
    color: "#e0d4ad", // Decides the nodes color.
    branches: ["hre"], // Decides the nodes branches.
    startData() { return {
        purity: new Decimal(0),
        totalPurity: new Decimal(0),
        puritySpent: new Decimal(0),
        purityReq: new Decimal(42),
        purityGain: new Decimal(0),
        purifierSoftcap: new Decimal(5),
        purifiers: {
            0: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            1: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            2: {
                amount: new Decimal(0),
                effect: new Decimal(0),
            },
            3: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            4: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            5: {
                amount: new Decimal(0),
                effect: new Decimal(0),
            },
            6: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            7: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            8: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            9: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            10: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
            11: {
                amount: new Decimal(0),
                effect: new Decimal(1),
            },
        },
        keptPurity: new Decimal(0),
        purifierAssign: 1,
    }},
    update(delta) {
        player.hpu.totalPurity = player.hpu.purity.add(player.hpu.puritySpent)
        let purityMade = player.hpu.totalPurity.sub(player.hpu.keptPurity)

        let requirementSub = new Decimal(0)
        requirementSub = requirementSub.add(buyableEffect("hcu", 114).sub(1))
        if (hasUpgrade("hpw", 35)) requirementSub = requirementSub.add(upgradeEffect("hpw", 35).sub(1))
        if (hasUpgrade("hbl", 105)) requirementSub = requirementSub.add(upgradeEffect("hbl", 105).sub(1))
        requirementSub = requirementSub.add(buyableEffect("hpw", 12).sub(1))
        requirementSub = requirementSub.add(player.tera.virtueEffects[2][1])

        player.hpu.purityReq = purityMade.mul(player.h.stage).add(player.h.stage.mul(7)).sub(requirementSub).ceil()
        player.hpu.purityGain = player.hre.refinement.add(requirementSub).sub(player.h.stage.mul(7)).div(player.h.stage).add(1).sub(purityMade).floor()

        if (inChallenge("hrm", 12)) {
            let connect = new Decimal(15).mul(player.h.stage.div(1.5)).sub(new Decimal(10).mul(player.h.stage))
            if (purityMade.lt(10)) player.hpu.purityReq = purityMade.add(5).mul(player.h.stage.div(1.5)).sub(requirementSub).ceil()
            if (purityMade.gte(10)) player.hpu.purityReq = purityMade.mul(player.h.stage).sub(requirementSub).add(connect).ceil()
            if (player.hre.refinement.lt(player.h.stage.div(1.5).mul(15))) player.hpu.purityGain = player.hre.refinement.add(requirementSub).div(player.h.stage.div(1.5)).sub(4).sub(purityMade).floor()
            if (player.hre.refinement.gte(player.h.stage.div(1.5).mul(15))) player.hpu.purityGain = player.hre.refinement.add(requirementSub).sub(connect).div(player.h.stage).add(1).sub(purityMade).floor()
        }

        if (player.hpu.purityGain.lt(1)) player.hpu.purityGain = new Decimal(0)

        if (hasMilestone("hre", 14) && !inChallenge("hrm", 15)) {
            player.hpu.purity = player.hpu.purity.add(player.hpu.purityGain)
        }

        let extra = new Decimal(0)
        if (hasUpgrade("hpw", 41)) extra = extra.add(1)
        if (hasUpgrade("hve", 33)) extra = extra.add(1)

        if (hasUpgrade("hpw", 1101)) player.hpu.purifiers[0].amount = player.hpu.totalPurity
        if (hasUpgrade("hpw", 1102)) player.hpu.purifiers[1].amount = player.hpu.totalPurity.add(extra)
        if (hasUpgrade("hpw", 1103)) player.hpu.purifiers[2].amount = player.hpu.totalPurity
        if (hasUpgrade("hpw", 1104)) player.hpu.purifiers[3].amount = player.hpu.totalPurity
        if (hasUpgrade("hpw", 1105)) player.hpu.purifiers[4].amount = player.hpu.totalPurity.add(extra)
        if (hasUpgrade("hpw", 1106)) player.hpu.purifiers[5].amount = player.hpu.totalPurity
        if (hasUpgrade("hpw", 1107)) player.hpu.purifiers[6].amount = player.hpu.totalPurity

        player.hpu.purifierSoftcap = new Decimal(5)
        if (hasUpgrade("hpw", 34)) player.hpu.purifierSoftcap = player.hpu.purifierSoftcap.add(upgradeEffect("hpw", 34).sub(1))
        if (player.tera.virtueUnlocks[2]) player.hpu.purifierSoftcap = player.hpu.purifierSoftcap.add(1)
        let softcap1 = Decimal.div(player.hpu.purifierSoftcap, 10).add(1)
        let softcap2 = Decimal.pow(1.5, player.hpu.purifierSoftcap)
        let softcap3 = Decimal.pow(2, player.hpu.purifierSoftcap.sub(1)).div(5)
        let softcap4 = Decimal.mul(player.hpu.purifierSoftcap, 0.15).add(1)
        let softcap5 = Decimal.div(player.hpu.purifierSoftcap, 50).add(1)

        player.hpu.purifiers[0].effect = player.hpu.purifiers[0].amount.div(player.h.purifierDiv).div(10).add(1)
        if (player.hpu.purifiers[0].effect.gt(softcap1)) player.hpu.purifiers[0].effect = player.hpu.purifiers[0].effect.div(softcap1).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap1)
        if (inChallenge("hrm", 16) && player.hpu.purifiers[0].effect.gt(3)) player.hpu.purifiers[0].effect = new Decimal(3)

        player.hpu.purifiers[1].effect = Decimal.pow(1.5, player.hpu.purifiers[1].amount.div(player.h.purifierDiv))
        if (player.hpu.purifiers[1].effect.gt(softcap2)) player.hpu.purifiers[1].effect = player.hpu.purifiers[1].effect.div(softcap2).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap2)

        player.hpu.purifiers[2].effect = player.hpu.purifiers[2].amount.div(player.h.purifierDiv).div(10).add(1)
        if (player.hpu.purifiers[2].effect.gt(softcap1)) player.hpu.purifiers[2].effect = player.hpu.purifiers[2].effect.div(softcap1).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap1)

        player.hpu.purifiers[3].effect = player.hpu.purifiers[3].amount.div(player.h.purifierDiv).div(10).add(1)
        if (player.hpu.purifiers[3].effect.gt(softcap1)) player.hpu.purifiers[3].effect = player.hpu.purifiers[3].effect.div(softcap1).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap1)

        player.hpu.purifiers[4].effect = new Decimal(0)
        if (player.hpu.purifiers[4].amount.gt(0) && !inChallenge("hrm", 11)) player.hpu.purifiers[4].effect = Decimal.pow(2, player.hpu.purifiers[4].amount.div(player.h.purifierDiv).sub(1)).div(5)
        if (player.hpu.purifiers[4].effect.gt(softcap3) && !hasUpgrade("hpw", 61)) player.hpu.purifiers[4].effect = player.hpu.purifiers[4].effect.div(softcap3).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap3)
        if (player.hpu.purifiers[4].effect.gt(softcap3) && hasUpgrade("hpw", 61)) player.hpu.purifiers[4].effect = player.hpu.purifiers[4].effect.div(softcap3).pow(Decimal.div(4.2, player.h.stage.max(4))).mul(softcap3)
        if (hasUpgrade("hpw", 1102)) player.hpu.purifiers[4].effect = player.hpu.purifiers[4].effect.pow(0.85)

        if (!inChallenge("hrm", 12)) {
            player.hpu.purifiers[5].effect = player.hpu.purifiers[5].amount.div(player.h.purifierDiv).mul(0.15).add(1)
            if (player.hpu.purifiers[5].effect.gt(softcap4)) player.hpu.purifiers[5].effect = player.hpu.purifiers[5].effect.div(softcap4).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap4)
        }
        if (inChallenge("hrm", 12)) {
            player.hpu.purifiers[5].effect = player.hpu.purifiers[5].amount.div(player.h.purifierDiv).mul(0.1).add(1)
            if (player.hpu.purifiers[5].effect.gt(softcap1)) player.hpu.purifiers[5].effect = player.hpu.purifiers[5].effect.div(softcap1).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(softcap1)
        }

        player.hpu.purifiers[6].effect = player.hpu.purifiers[6].amount.div(player.h.purifierDiv).div(50).add(1)
        if (player.hpu.purifiers[6].effect.gt(softcap5)) player.hpu.purifiers[6].effect = player.hpu.purifiers[6].effect.div(softcap5).pow(Decimal.div(1.4, player.h.stage.max(2))).mul(softcap5)

        let addPure = new Decimal(0)
        if (hasUpgrade("hpw", 21)) addPure = addPure.add(1)
        if (hasUpgrade("hve", 52)) addPure = addPure.add(2)
        if (hasUpgrade("hpw", 111)) addPure = addPure.add(3)
        if (hasUpgrade("hpw", 152)) addPure = addPure.add(upgradeEffect("hpw", 152))
        if (addPure.gt(player.hpu.keptPurity) && player.hpu.purity.add(player.hpu.puritySpent).lt(player.hpu.totalPurity.sub(player.hpu.keptPurity).add(addPure))) {
            player.hpu.purity = player.hpu.purity.add(addPure.sub(player.hpu.keptPurity))
            player.hpu.keptPurity = addPure
        }
    },
    clickables: {
        1: {
            title() {
                if (inChallenge("hrm", 16)) return "<h2>Purify, but reset " + player.h.stageName[1] + " points and refinement.</h2><br><h3>Req: " + formatWhole(player.hre.refinement) + "/" + formatWhole(player.hpu.purityReq) + " Refinements</h3>"
                if (inChallenge("hrm", 12) && player.hpu.totalPurity.sub(player.hpu.keptPurity).gte(10)) return "<h2>Purify, but reset " + player.h.stageName[1] + " points, provenance, and refinement.</h2><br><h3>Req: " + formatWhole(player.hre.refinement) + "/" + formatWhole(player.hpu.purityReq) + " Refinements</h3><br><small style='color:darkred'>[SOFTCAPPED]</small>"
                return "<h2>Purify, but reset " + player.h.stageName[1] + " points, provenance, and refinement.</h2><br><h3>Req: " + formatWhole(player.hre.refinement) + "/" + formatWhole(player.hpu.purityReq) + " Refinements</h3>"
            },
            canClick() { return player.hre.refinement.gt(0) && player.hpu.purityGain.gte(1) && (!hasMilestone("hre", 14) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                let amt = player.hpu.purityGain
                player.hpu.purity = player.hpu.purity.add(amt)

                // RESET CODE
                player.hre.refinement = new Decimal(0)
                player.hre.refinementGain = new Decimal(0)
                for (let i = 0; i < 12; i++) {
                    player.hre.refinementEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                for (let i = 0; i < 12; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    if (i < 6) player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                    else player.hpr.rankEffect[i] = [new Decimal(0), new Decimal(0)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "400px", minHeight: "100px", border: "2px solid black", borderRadius: "15px"}
                if (hasMilestone("hre", 14) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        2: {
            title() { return "Respec your purifiers<br><small style='font-size:11px'>(Doesn't reset content)</small>"},
            canClick() { return player.hpu.totalPurity.gt(player.hpu.purity)},
            unlocked: true,
            onClick() {
                player.hpu.purity = player.hpu.totalPurity
                player.hpu.puritySpent = new Decimal(0)
                for (let i in player.hpu.purifiers) {
                    player.hpu.purifiers[i].amount = new Decimal(0)
                }

                let extra = new Decimal(0)
                if (hasUpgrade("hpw", 41)) extra = extra.add(1)
                if (hasUpgrade("hve", 33)) extra = extra.add(1)
                player.hpu.purifiers[1].amount = extra
                player.hpu.purifiers[4].amount = extra
            },
            style: {width: "250px", minHeight: "40px", lineHeight: "0.9", border: "2px solid black", borderRadius: "15px"},
        },
        3: {
            title() {
                let str = "<h3>Purified Provenances</h3><br>Lv." + formatWhole(player.hpu.purifiers[0].amount) + "<br>^" + format(player.hpu.purifiers[0].effect) + " Refiner 2's Effects"
                if (player.hpu.purifiers[0].effect.gt(Decimal.div(player.hpu.purifierSoftcap, 10).add(1))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick() {return player.hpu.purity.gte(1) && !hasUpgrade("hpw", 1101)},
            unlocked: true,
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[0].amount = player.hpu.purifiers[0].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1101)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                return look
            },
        },
        4: {
            title() {
                let str = "<h3>Multiplied Miracles</h3><br>Lv." + formatWhole(player.hpu.purifiers[1].amount) + "<br>x" + format(player.hpu.purifiers[1].effect) + " 1st & 4th Miracles"
                if (inChallenge("hrm", 12)) str = "<h3>Multiplied Miracles</h3><br>Lv." + formatWhole(player.hpu.purifiers[1].amount) + "<br>x" + format(player.hpu.purifiers[1].effect) + " Blessings and Boons"
                if (player.hpu.purifiers[1].effect.gt(Decimal.pow(1.5, player.hpu.purifierSoftcap))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            tooltip() {
                if (!inChallenge("hrm", 12)) return "[Reminder]<br>1st Miracle buffs blessings, 4th Miracle buffs boons"
                return ""
            },
            canClick() {return player.hpu.purity.gte(1) && !hasUpgrade("hpw", 1102)},
            unlocked: true,
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[1].amount = player.hpu.purifiers[1].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1102)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                return look
            },
        },
        5: {
            title() {
                let str = "<h3>Elevated Exponent</h3><br>Lv." + formatWhole(player.hpu.purifiers[2].amount) + "<br>^" + format(player.hpu.purifiers[2].effect) + " Non-" + player.h.stageName[0] + " Refiner Effects"
                if (player.hpu.purifiers[2].effect.gt(Decimal.div(player.hpu.purifierSoftcap, 10).add(1))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick() {return player.hpu.purity.gte(1) && !hasUpgrade("hpw", 1103)},
            unlocked: true,
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[2].amount = player.hpu.purifiers[2].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1103)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                return look
            },
        },
        6: {
            title() {
                let str = "<h3>Healed Hexes</h3><br>Lv." + formatWhole(player.hpu.purifiers[3].amount) + "<br>^" + format(player.hpu.purifiers[3].effect) + " " + player.h.stageName[0] + " Point Booster"
                if (inChallenge("hrm", 12)) str = "<h3>Healed Hexes</h3><br>Lv." + formatWhole(player.hpu.purifiers[3].amount) + "<br>^" + format(player.hpu.purifiers[3].effect) + " 1st Refiners Effects"
                if (player.hpu.purifiers[3].effect.gt(Decimal.div(player.hpu.purifierSoftcap, 10).add(1))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick() {return player.hpu.purity.gte(1) && !hasUpgrade("hpw", 1104)},
            unlocked() { return hasUpgrade("hpw", 31) },
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[3].amount = player.hpu.purifiers[3].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1104)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                return look
            },
        },
        7: {
            title() {
                let str = "<h3>Amended Automation</h3><br>Lv." + formatWhole(player.hpu.purifiers[4].amount) + "<br>+" + formatWhole(player.hpu.purifiers[4].effect.mul(100)) + "% blessings/s"
                str = str.concat("<br><small>(" + format(player.hbl.blessingsGain.mul(player.hpu.purifiers[4].effect)) + "/s)</small>")
                if (player.hpu.purifiers[4].effect.gt(Decimal.pow(2, player.hpu.purifierSoftcap.sub(1)).div(5))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                if (inChallenge("hrm", 11)) str = str.concat("<br><small style='color:red'>[DISABLED BY CREATOR REALM]</small>")
                return str
            },
            canClick() {return player.hpu.purity.gte(1) && !inChallenge("hrm", 11) && !hasUpgrade("hpw", 1105)},
            unlocked() { return hasUpgrade("hpw", 31) },
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[4].amount = player.hpu.purifiers[4].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1105)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                if (inChallenge("hrm", 11)) look.opacity = "0.5"
                return look
            },
        },
        8: {
            title() {
                let str = "<h3>Cleansed Curses</h3><br>Lv." + formatWhole(player.hpu.purifiers[5].amount) + "<br>^" + format(player.hpu.purifiers[5].effect) + " Grace 4's Effect"
                if (inChallenge("hrm", 12)) str = "<h3>Cleansed Curses</h3><br>Lv." + formatWhole(player.hpu.purifiers[5].amount) + "<br>^" + format(player.hpu.purifiers[5].effect) + " Base Α-Jinx Effect"
                if (player.hpu.purifiers[5].effect.gt(Decimal.mul(player.hpu.purifierSoftcap, 0.15).add(1)) || (inChallenge("hrm", 12) && player.hpu.purifiers[5].effect.gt(Decimal.div(player.hpu.purifierSoftcap, 10).add(1)))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick() {return player.hpu.purity.gte(1) && !hasUpgrade("hpw", 1106)},
            unlocked() { return hasUpgrade("hpw", 31) },
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[5].amount = player.hpu.purifiers[5].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1106)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                return look
            },
        },
        9: {
            title() {
                let str = "<h3>External Expansion</h3><br>Lv." + formatWhole(player.hpu.purifiers[6].amount) + "<br>^" + format(player.hpu.purifiers[6].effect) + " External Effects"
                if (player.hpu.purifiers[6].effect.gt(Decimal.div(player.hpu.purifierSoftcap, 50).add(1))) str = str.concat("<br><small style='color:darkred'>[SOFTCAPPED]</small>")
                return str
            },
            canClick() {return player.hpu.purity.gte(1) && !hasUpgrade("hpw", 1107)},
            unlocked() { return hasUpgrade("hpw", 36) },
            onClick() {
                let amt = player.hpu.purity.min(player.hpu.purifierAssign)
                player.hpu.puritySpent = player.hpu.puritySpent.add(amt)
                player.hpu.purity = player.hpu.purity.sub(amt)
                player.hpu.purifiers[6].amount = player.hpu.purifiers[6].amount.add(amt)
            },
            style() {
                let look = {width: "250px", minHeight: "100px", border: "2px solid black", borderRadius: "15px", margin: "3px"}
                if (hasUpgrade("hpw", 1107)) {
                    look.backgroundColor = "#77bf5f"
                    look.cursor = "default !important"
                }
                return look
            },
        },
        // Slightly boosts power, with no softcap
        101: {
            title: "1",
            canClick() { return player.hpu.purifierAssign != 1},
            unlocked() { return true},
            onClick() {
                player.hpu.purifierAssign = 1
            },
            style: {width: "50px", minHeight: "40px", borderRadius: "0px"},
        },
        102: {
            title: "5",
            canClick() { return player.hpu.purifierAssign != 5},
            unlocked() { return true},
            onClick() {
                player.hpu.purifierAssign = 5
            },
            style: {width: "50px", minHeight: "40px", borderRadius: "0px"},
        },
        103: {
            title: "25",
            canClick() { return player.hpu.purifierAssign != 25},
            unlocked() { return true},
            onClick() {
                player.hpu.purifierAssign = 25
            },
            style: {width: "50px", minHeight: "40px", borderRadius: "0 13px 13px 0"},
        },
    },
    microtabs: {
        purity: {
            "Purifiers": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["clickable", 2],
                    ["blank", "10px"],
                    ["row", [["clickable", 3], ["clickable", 4], ["clickable", 5]]],
                    ["row", [["clickable", 6], ["clickable", 7], ["clickable", 8]]],
                    ["row", [["clickable", 9]]],
                    ["blank", "10px"],
                    ["style-row", [
                        ["style-row", [
                            ["raw-html", "Level Amount", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "98px", height: "40px", borderRight: "2px solid black"}],
                        ["clickable", 101], ["clickable", 102], ["clickable", 103]
                    ], {width: "250px", height: "40px", backgroundColor: "#2c2a22", border: "2px solid black", borderRadius: "15px"}],
                ]
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
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return player.h.stageName[0] + " of Purity"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#433f33", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["row", [
            ["raw-html", () => {return "You have <h3>" + formatWhole(player.hpu.purity) + "</h3> purity." }, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return "(+" + formatWhole(player.hpu.purityGain) + ")"}, () => {
                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hpu.purityGain.gt(0) ? look.color = "white" : look.color = "gray"
                return look
            }],
        ]],
        ["raw-html", () => {
            if (player.hpu.keptPurity.eq(0)) return "(You have <h3>" + formatWhole(player.hpu.totalPurity.sub(player.hpu.keptPurity)) + "</h3> total purity)"
            return "(You have <h3>" + formatWhole(player.hpu.totalPurity.sub(player.hpu.keptPurity)) + "+" + formatWhole(player.hpu.keptPurity) + "</h3> total purity)"
        }, {color: "#ddd", fontSize: "16px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "5px"],
        ["microtabs", "purity", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return hasUpgrade("i", 29) }, // Decides if this node is shown or not.
    hotkeys: [
        {
            key: "p", 
            description: "Purify",
            onPress() {
                clickClickable(this.layer, 1)
            },
        }
	]
});
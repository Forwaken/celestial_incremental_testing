addLayer("hpw", {
    name() {return player.h.stageName[0] + " of Power"},
    symbol: "Pw", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Power", // Decides the nodes tooltip
    color: "#ff5555", // Decides the nodes color.
    nodeStyle: {borderColor: "#5e0000"}, // Decides the nodes style, in CSS format.
    branches: ["hbl"], // Decides the nodes branches.
    startData() { return {
        power: new Decimal(0),
        totalPower: new Decimal(0),
        powerGain: new Decimal(0),
        upgScale: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        upgTotal: new Decimal(0),
        vigor: 0,
        sincePower: new Decimal(0),
        softcap: new Decimal(1),
    }},
    update(delta) {
        player.hpw.powerGain = Decimal.pow(2, player.hbl.blessings.add(1).div(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage)).log(player.h.stage)).div(Decimal.pow(2, player.h.stage.sub(6).abs()))
        if (hasUpgrade("hpw", 11)) player.hpw.powerGain = player.hpw.powerGain.mul(2)
        player.hpw.powerGain = player.hpw.powerGain.mul(player.hre.refinementEffect[5][0])
        player.hpw.powerGain = player.hpw.powerGain.mul(player.hrm.realmEffect)
        if (hasUpgrade("hpw", 72)) player.hpw.powerGain = player.hpw.powerGain.mul(2)
        if (hasUpgrade("hpw", 131)) player.hpw.powerGain = player.hpw.powerGain.mul(2)
        player.hpw.powerGain = player.hpw.powerGain.div(player.h.powNerf)
        if (player.sins.clickables["envy"]) player.hpw.powerGain = player.hpw.powerGain.mul(player.sins.envy[0])
        if (player.sins.clickables["wrath"]) player.hpw.powerGain = player.hpw.powerGain.mul(player.sins.wrath[0])
        if (player.sins.clickables["lust"]) player.hpw.powerGain = player.hpw.powerGain.mul(player.sins.lust[0])
        if (player.sins.clickables["gluttony"]) player.hpw.powerGain = player.hpw.powerGain.mul(player.sins.gluttony[0])
        if (player.sins.clickables["sloth"]) player.hpw.powerGain = player.hpw.powerGain.mul(player.sins.sloth[0])
        if (hasUpgrade("hve", 72)) player.hpw.powerGain = player.hpw.powerGain.mul(upgradeEffect("hve", 72))
        player.hpw.powerGain = player.hpw.powerGain.mul(buyableEffect("hve", 14))
        player.hpw.powerGain = player.hpw.powerGain.mul(player.tera.virtueEffects[6][1])

        let external = new Decimal(1)
        if (hasUpgrade("cs", 202)) external = external.mul(2)
        external = external.mul(levelableEffect("pu", 203)[2])
        external = external.mul(levelableEffect("pet", 1106)[1])
        external = external.mul(buyableEffect("sme", 144))
        external = external.mul(buyableEffect("al", 206))
        if (player.alephsChamber.milestone[25] > 0) external = external.mul(36)
        if (hasUpgrade("tera", "hept7")) external = external.mul(upgradeEffect("tera", "hept7"))

        external = external.pow(player.h.externalRaise)
        player.hpw.powerGain = player.hpw.powerGain.mul(external)

        // POWER MODIFIERS
        if (player.sins.clickables["greed"]) player.hpw.powerGain = player.hpw.powerGain.pow(player.sins.greed[0])
        if (player.sins.clickables["pride"]) player.hpw.powerGain = player.hpw.powerGain.pow(player.sins.pride[0])
        let externalPow = new Decimal(1)
        externalPow = externalPow.mul(levelableEffect("pu", 210)[1])
        externalPow = externalPow.mul(player.n.pylonPassiveEffect)
        externalPow = externalPow.mul(levelableEffect("car", 305)[0])
        externalPow = externalPow.mul(buyableEffect("zd", 22))

        externalPow = externalPow.pow(player.h.externalRaise)
        player.hpw.powerGain = player.hpw.powerGain.pow(externalPow)

        // POWER SOFTCAP
        player.hpw.softcap = player.hpw.power.gte(Decimal.pow10(player.h.stage.mul(10))) ? player.hpw.power.div(Decimal.pow10(player.h.stage.mul(10))).pow(0.3).div(player.h.stage).add(1) : new Decimal(1)
        player.hpw.powerGain = player.hpw.powerGain.div(player.hpw.softcap)

        if (hasUpgrade("hpw", 106)) player.hpw.power = player.hpw.power.add(player.hpw.powerGain.div(100).mul(player.h.tickspeed).mul(delta))
        player.hpw.powerGain = player.hpw.powerGain.floor().max(1) // To keep power to whole numbers

        player.hpw.upgTotal = new Decimal(0).add(player.hpw.upgrades.length)
        for (let i = 1; i < 7; i++) {
            player.hpw.upgTotal = player.hpw.upgTotal.add(getBuyableAmount("hpw", i))
        }

        let sinceGain = new Decimal(1)
        if (hasUpgrade("hpw", 104)) sinceGain = sinceGain.mul(upgradeEffect("hpw", 104))
        player.hpw.sincePower = player.hpw.sincePower.add(Decimal.mul(delta, sinceGain.mul(player.h.tickspeed)))
    },
    powerReset(type) {
        if (player.h.stage.eq(7) && player.hpw.powerGain.gte(1e70)) {
            for (let i = 0; i < 7; i++) {
                if (!player.sins.sinUsed[i]) player.tera.sinMastery[i] = true
            }
        }
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

        for (let i = 0; i < player.hsa.upgrades.length; i++) {
            player.hsa.upgrades.splice(i, 1);
            i--;
        }

        for (let i in player.hsa.buyables) {
            if (i > 10) player.hsa.buyables[i] = new Decimal(0)
        }
        
        // TEMP REALM
        player.hrm.blessLimit = new Decimal(0)
        player.hrm.dreamTimer = new Decimal(60)
        
        // TEMP POWER
        player.hpw.sincePower = new Decimal(0)

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
        
        let extra = new Decimal(0)
        if (hasUpgrade("hpw", 41)) extra = extra.add(1)
        if (type == 2 && hasUpgrade("hve", 33)) extra = extra.add(1)
        player.hpu.purifiers[1].amount = extra
        player.hpu.purifiers[4].amount = extra

        // CURSES
        player.hcu.curses = new Decimal(0)
        player.hcu.cursesGain = new Decimal(0)
        for (let i = 101; i < 109; i++) {
            player.hcu.buyables[i] = new Decimal(0)
        }
        if (!hasMilestone("hpw", 4)) player.hcu.buyables[109] = new Decimal(0)
        player.hcu.buyables[110] = new Decimal(0)
        player.hcu.buyables[111] = new Decimal(0)
        if (!hasMilestone("hpw", 4)) player.hcu.buyables[112] = new Decimal(0)
        for (let i = 113; i < 115; i++) {
            player.hcu.buyables[i] = new Decimal(0)
        }

        player.hcu.jinxedJinx = new Decimal(0)
        player.hcu.jinxedJinxEffects = [new Decimal(1), new Decimal(1), new Decimal(0)]

        // VEXES
        if (type != 2) {
            player.hve.vex = new Decimal(0)
            player.hve.vexTotal = new Decimal(0)
            player.hve.vexGain = new Decimal(0)
            player.hve.rowCurrent = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            player.hve.rowSpent = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            player.hve.vexEffects = [new Decimal(0), new Decimal(1), new Decimal(1), new Decimal(1)]
            for (let i = 0; i < player.hve.upgrades.length; i++) {
                player.hve.upgrades.splice(i, 1);
                i--;
            }
            for (let i = 11; i < 15; i++) {
                player.hve.buyables[i] = new Decimal(0)
            }
        }

        // BLESSINGS
        player.hbl.blessings = new Decimal(0)
        player.hbl.blessingsGain = new Decimal(0)
        player.hbl.blessingPerSec = new Decimal(0)
        player.hbl.boons = new Decimal(0)
        player.hbl.boonsGain = new Decimal(0)
        player.hbl.blessAutomation = false
        for (let i in player.hbl.boosters) {
            if (hasMilestone("hpw", 2) && (i == "2" || i == "5")) continue;
            player.hbl.boosters[i].level = new Decimal(0)
            player.hbl.boosters[i].xp = new Decimal(0)
            if (i != "5") player.hbl.boosters[i].effect = new Decimal(1)
        }
        for (let i = 0; i < player.hbl.upgrades.length; i++) {
            if ((type != 1 || hasMilestone("s", 20)) && +player.hbl.upgrades[i] > player.hpw.vigor) {
                player.hbl.upgrades.splice(i, 1);
                i--;
            }
            if (type == 1 && !hasMilestone("s", 20)) {
                player.hbl.upgrades.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < player.hbl.milestones.length; i++) {
            if (+player.hbl.milestones[i] > getBuyableAmount("hrm", 2) && !(hasMilestone("hpw", 7) && +player.hbl.milestones[i] <= player.hpw.vigor)) {
                player.hbl.milestones.splice(i, 1);
                i--;
            }
        }

        // REFINEMENT
        player.hre.refinement = new Decimal(0)
        player.hre.refinementGain = new Decimal(0)
        for (let i = 0; i < 12; i++) {
            player.hre.refinementEffect[i] = [new Decimal(1), new Decimal(1)]
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
    clickables: {
        1: {
            title() { return "<h2>Amplify Power, but reset previous " + player.h.stageName[1] + " content.</h2><br><h3>Req: " + formatWhole(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage)) + " Blessings</h3>"},
            canClick() { return player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))},
            unlocked: true,
            onClick() {
                player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                layers.hpw.powerReset(0)
            },
            style: {width: "400px", minHeight: "100px", border: "2px solid black", borderRadius: "15px"},
        },
        2: {
            title() { return "Respec your mights<br><small style='font-size:11px'>(Does a power reset)</small>"},
            canClick() { return hasUpgrade("hpw", 1) || hasUpgrade("hpw", 2)},
            unlocked: true,
            onClick() {
                if (confirm("Are you sure you want to do a power reset?")) {
                    if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                        player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                        player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                    }

                    player.hpw.power = player.hpw.totalPower
                    for (let i = 0; i < player.hpw.upgrades.length; i++) {
                        player.hpw.upgrades.splice(i, 1);
                        i--;
                    }
                    for (let i = 0; i < player.hpw.upgScale.length; i++) {
                        player.hpw.upgScale[i] = 1
                    }
                    setTimeout(() => {layers.hpw.powerReset(0)}, 500)
                }
            },
            style: {width: "250px", minHeight: "40px", lineHeight: "0.9", border: "2px solid black", borderRadius: "15px"},
        },
    },
    upgrades: {
        1: {
            title: "Might 1:1",
            unlocked: true,
            description: "Boost blessings based on power.",
            tooltip() {
                if (hasUpgrade("hpw", 105)) return "(log" + formatSimple(player.h.stage.div(2).max(1.5)) + "(Power+1)+1)*((log" + formatWhole(player.h.stage.max(2)) + "(Time in Power+1)/10)+2)"
                return "(log" + formatWhole(player.h.stage.max(2)) + "(Power+1)+1)*2"
            },
            cost() {return new Decimal(1).pow(player.hpw.upgScale[0]).floor()},
            onPurchase() {player.hpw.upgScale[0] = player.hpw.upgScale[0] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (hasUpgrade("hpw", 105)) return player.hpw.power.add(1).log(player.h.stage.div(2).max(1.5)).add(1).mul(player.hpw.sincePower.add(1).log(player.h.stage).div(10).add(2))
                return player.hpw.power.add(1).log(player.h.stage.max(2)).add(1).mul(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2: {
            title: "Might 1:2",
            unlocked: true,
            description() {return "Boost " + player.h.stageName[1] + " points based on power."},
            tooltip() {
                if (hasUpgrade("hpw", 32)) return "(log1.6((Power+1)^" + formatSimple(Decimal.div(12, player.h.stage).add(1)) + ")+1)*" + formatWhole(Decimal.div(30, player.h.stage).add(1))
                return "(log2(Power+1)+1)*" + formatWhole(Decimal.div(12, player.h.stage).add(1))
            },
            cost() {return new Decimal(1).pow(player.hpw.upgScale[0]).floor()},
            onPurchase() {player.hpw.upgScale[0] = player.hpw.upgScale[0] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (hasUpgrade("hpw", 32)) return player.hpw.power.add(1).pow(Decimal.div(12, player.h.stage).add(1)).log(1.6).add(1).mul(player.h.stage)
                return player.hpw.power.add(1).log(2).add(1).mul(Decimal.div(12, player.h.stage).add(1))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        11: {
            title: "Might 2:1",
            unlocked: true,
            description: "Double power gain.",
            branches: [12],
            cost() {return new Decimal(player.h.stage.div(3)).pow(player.hpw.upgScale[1]).floor()},
            canAfford() { return hasUpgrade("hpw", 12)},
            onPurchase() {player.hpw.upgScale[1] = player.hpw.upgScale[1] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        12: {
            title: "Might 2:2",
            unlocked: true,
            description: "Increase the base of Refiner Req Booster by 50%.",
            branches: [1, 2],
            cost() {return new Decimal(player.h.stage.div(2)).pow(player.hpw.upgScale[1]).floor()},
            canAfford() { return hasUpgrade("hpw", 1) || hasUpgrade("hpw", 2)},
            onPurchase() {player.hpw.upgScale[1] = player.hpw.upgScale[1] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        13: {
            title: "Might α:1",
            unlocked() {return player.h.stage.neq(6)},
            description: "Increase blessing gain based on blessing resets in this power run.",
            tooltip() {
                if (hasUpgrade("hpw", 15)) return "(Resets^" + formatSimple(Decimal.div(5, player.h.stage), 2) + ")+1"
                return "2^(log" + formatWhole(player.h.stage.max(2)) + "(Resets+1))"
            },
            branches: [12],
            cost() {return player.h.stage.pow(4).floor()},
            canAfford() { return hasUpgrade("hpw", 12)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (hasUpgrade("hpw", 15)) return player.hrm.blessLimit.pow(Decimal.div(5, player.h.stage)).add(1)
                return Decimal.pow(2, player.hrm.blessLimit.add(1).log(player.h.stage.max(2)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        14: {
            title: "Might α:2",
            unlocked() {return player.h.stage.neq(6)},
            description: "Passively gain blessing resets based on blessings.",
            tooltip() {return "log" + formatWhole(player.h.stage) + "(Blessings+1)"},
            branches: [13],
            cost() {return player.h.stage.pow(10).floor()},
            canAfford() { return hasUpgrade("hpw", 13)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hbl.blessings.add(1).log(player.h.stage).mul(player.h.tickspeed)
            },
            effectDisplay() { return "+" + formatSimple(upgradeEffect(this.layer, this.id)) + "/s" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        15: {
            title: "Might α:3",
            unlocked() {return player.h.stage.neq(6)},
            description: "Improve Might α:1's effect.",
            tooltip() {return "2^(log" + formatWhole(player.h.stage.max(2)) + "(Resets+1))<br>↓<br>(Resets^" + formatSimple(Decimal.div(5, player.h.stage), 2) + ")+1"},
            branches: [14],
            cost() {return player.h.stage.pow(16).floor()},
            canAfford() { return hasUpgrade("hpw", 14)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        16: {
            title: "Might α:4",
            unlocked() {return player.h.stage.neq(6)},
            description: "Multiply blessing reset gain based on power.",
            tooltip() {return "log" + formatWhole(player.h.stage.pow(3)) + "(Power+1)+1"},
            branches: [15],
            cost() {return player.h.stage.pow(24).floor()},
            canAfford() { return hasUpgrade("hpw", 15)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.power.add(1).log(player.h.stage.pow(3)).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        21: {
            title: "Might 3:1",
            unlocked: true,
            description: "Gain 1 free purity.",
            branches: [12],
            cost() {return new Decimal(player.h.stage.div(2).pow(2)).pow(player.hpw.upgScale[2]).floor()},
            canAfford() { return hasUpgrade("hpw", 12)},
            onPurchase() {player.hpw.upgScale[2] = player.hpw.upgScale[2] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        22: {
            title: "Might 3:2",
            unlocked: true,
            description: "Boost curse gain based on refinement.",
            tooltip() {
                if (hasUpgrade("hpw", 45)) return formatSimple(Decimal.div(30, player.h.stage).add(1)) + "^(Refinement/" + formatWhole(player.h.stage) + ")"
                return formatSimple(Decimal.div(30, player.h.stage).add(1)) + "^((Refinement/" + formatWhole(player.h.stage) + ")^" + formatSimple(Decimal.div(3.96, player.h.stage.max(4))) + ")"
            },
            branches: [12],
            cost() {return new Decimal(player.h.stage.div(2).pow(2)).pow(player.hpw.upgScale[2]).floor()},
            canAfford() { return hasUpgrade("hpw", 12)},
            onPurchase() {player.hpw.upgScale[2] = player.hpw.upgScale[2] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (hasUpgrade("hpw", 45)) return Decimal.pow(Decimal.div(30, player.h.stage).add(1), player.hre.refinement.div(player.h.stage))
                return Decimal.pow(Decimal.div(30, player.h.stage).add(1), player.hre.refinement.div(player.h.stage).pow(Decimal.div(3.96, player.h.stage.max(4))))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        31: {
            title: "Might 4:1",
            unlocked: true,
            description: "Unlock 3 new purifiers.",
            branches: [21],
            cost() {return new Decimal(player.h.stage.div(2).pow(3)).pow(player.hpw.upgScale[3]).floor()},
            canAfford() { return hasUpgrade("hpw", 21)},
            onPurchase() {player.hpw.upgScale[3] = player.hpw.upgScale[3] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        32: {
            title: "Might 4:2",
            unlocked: true,
            description: "Improve Might 1:2's effect.",
            tooltip() {return "(log2(Power+1)+1)*" + formatWhole(Decimal.div(12, player.h.stage).add(1)) + "<br>↓<br>(log1.6((Power+1)^" + formatSimple(Decimal.div(12, player.h.stage).add(1)) + ")+1)*" + formatWhole(Decimal.div(30, player.h.stage).add(1))},
            branches: [31, 33],
            cost() {return new Decimal(player.h.stage).pow(player.hpw.upgScale[3]).floor()},
            canAfford() { return hasUpgrade("hpw", 31) && hasUpgrade("hpw", 33)},
            onPurchase() {player.hpw.upgScale[3] = player.hpw.upgScale[3] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        33: {
            title: "Might 4:3",
            unlocked: true,
            description: "Boost jinx cap based on jinx score.",
            tooltip() {
                return "Floor(log" + formatWhole(player.h.stage.max(2)) + "((Jinx Total^" + formatSimple(Decimal.div(3.6, player.h.stage).add(1)) + ")+1))"
            },
            branches: [22],
            cost() {return new Decimal(player.h.stage.div(2).pow(3)).pow(player.hpw.upgScale[3]).floor()},
            canAfford() { return hasUpgrade("hpw", 22)},
            onPurchase() {player.hpw.upgScale[3] = player.hpw.upgScale[3] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hcu.jinxTotal.pow(Decimal.div(3.6, player.h.stage).add(1)).add(1).log(player.h.stage.max(2)).floor()
            },
            effectDisplay() { return "+" + formatWhole(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        34: {
            title: "Might β:1",
            unlocked() {return player.h.stage.neq(6)},
            description: "Extend the purifier softcap based on purity.",
            tooltip() {
                return "Purity/5"
            },
            branches: [31],
            cost() {return player.h.stage.pow(6).floor()},
            canAfford() { return hasUpgrade("hpw", 31)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpu.totalPurity.div(5).add(1)
            },
            effectDisplay() { return "+" + formatSimple(upgradeEffect(this.layer, this.id).sub(1)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        35: {
            title: "Might β:2",
            unlocked() {return player.h.stage.neq(6)},
            description: "Reduce purity requirement based on jinx cap boosts.",
            tooltip() {
                return "Floor(Cap Boost^0.5)"
            },
            branches: [34],
            cost() {return player.h.stage.pow(15).floor()},
            canAfford() { return hasUpgrade("hpw", 34)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hcu.jinxAddCap.pow(0.5).add(1).floor()
            },
            effectDisplay() { return "-" + formatSimple(upgradeEffect(this.layer, this.id).sub(1)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        36: {
            title: "Might β:3",
            unlocked() {return player.h.stage.neq(6)},
            description: "Unlock a new purifier.",
            branches: [35],
            cost() {return player.h.stage.pow(27).floor()},
            canAfford() { return hasUpgrade("hpw", 35)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        37: {
            title: "Might β:4",
            unlocked() {return player.h.stage.neq(6)},
            description: "Boost purifier efficiency based on refinements.",
            tooltip() {
                return "((Refinements^" + formatSimple(Decimal.div(3.5, player.h.stage.max(4))) + ")/50)+1"
            },
            branches: [36],
            cost() {return player.h.stage.pow(42).floor()},
            canAfford() { return hasUpgrade("hpw", 36)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hre.refinement.pow(Decimal.div(3.5, player.h.stage.max(4))).div(50).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        41: {
            title: "Might 5:1",
            unlocked: true,
            description: "Multiplied Miracles and Amended Automation gain a free level.",
            branches: [31],
            cost() {return new Decimal(player.h.stage.div(2).pow(5)).pow(player.hpw.upgScale[4]).floor()},
            canAfford() { return hasUpgrade("hpw", 31)},
            onPurchase() {
                player.hpw.upgScale[4] = player.hpw.upgScale[4] + 1
                player.hpu.purifiers[1].amount = player.hpu.purifiers[1].amount.add(1)
                player.hpu.purifiers[4].amount = player.hpu.purifiers[4].amount.add(1)
            },
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        42: {
            title: "Might 5:2",
            unlocked: true,
            description() {return "Unlock " + player.h.stageName[0] + " of Vexes."},
            branches: [33],
            cost() {return new Decimal(player.h.stage.div(2).pow(5)).pow(player.hpw.upgScale[4]).floor()},
            canAfford() { return hasUpgrade("hpw", 33)},
            onPurchase() {player.hpw.upgScale[4] = player.hpw.upgScale[4] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        43: {
            title: "Might γ:1",
            unlocked() {return player.h.stage.neq(6)},
            description: "Reduce jinx cost based on potential power gains.",
            tooltip() {
                return "1.5^(log" + formatWhole(player.h.stage) + "(Power Gain+1))"
            },
            branches: [42],
            cost() {return player.h.stage.pow(8).floor()},
            canAfford() { return hasUpgrade("hpw", 42)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return Decimal.pow(1.5, player.hpw.powerGain.add(1).log(player.h.stage))
            },
            effectDisplay() { return "/" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        44: {
            title: "Might γ:2",
            unlocked() {return player.h.stage.neq(6)},
            description: "Reduce Vex requirement based on jinx score.",
            tooltip() {
                return "Jinx Score+1"
            },
            branches: [43],
            cost() {return player.h.stage.pow(20).floor()},
            canAfford() { return hasUpgrade("hpw", 43)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hcu.jinxTotal.add(1)
            },
            effectDisplay() { return "/" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        45: {
            title: "Might γ:3",
            unlocked() {return player.h.stage.neq(6)},
            description: "Improve Might 3:2's effect.",
            tooltip() { return formatSimple(Decimal.div(30, player.h.stage).add(1)) + "^((Refinement/" + formatWhole(player.h.stage) + ")^" + formatSimple(Decimal.div(3.96, player.h.stage.max(4))) + ")<br>↓<br>" + formatSimple(Decimal.div(30, player.h.stage).add(1)) + "^(Refinement/" + formatWhole(player.h.stage) + ")"},
            branches: [44],
            cost() {return player.h.stage.pow(36).floor()},
            canAfford() { return hasUpgrade("hpw", 44)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        46: {
            title: "Might γ:4",
            unlocked() {return player.h.stage.neq(6)},
            description: "Boost Jinx cap based on boons.",
            tooltip() {
                return "(((log" + formatWhole(player.h.stage.pow(2)) + "(Boons+1))^" + formatSimple(Decimal.div(3.5, player.h.stage.max(4)), 2) + ")/50)+1"
            },
            branches: [45],
            cost() {return player.h.stage.pow(56).floor()},
            canAfford() { return hasUpgrade("hpw", 45)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hbl.boons.add(1).log(player.h.stage.pow(2)).pow(Decimal.div(3.5, player.h.stage.max(4))).div(50).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        51: {
            title: "Might 6:1",
            unlocked: true,
            description: "Multiply Might 6:2's effect by x10.",
            branches: [52],
            cost() {return new Decimal(player.h.stage.pow(3)).pow(player.hpw.upgScale[5]).floor()},
            canAfford() { return hasUpgrade("hpw", 52)},
            onPurchase() {player.hpw.upgScale[5] = player.hpw.upgScale[5] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        52: {
            title: "Might 6:2",
            unlocked: true,
            description() {
                return "Deposit " + formatSimple(upgradeEffect(this.layer, this.id).sub(1).mul(100)) + "% of boons per second."
            },
            branches: [41, 42],
            cost() {return new Decimal(player.h.stage.div(2).pow(7)).pow(player.hpw.upgScale[5]).floor()},
            canAfford() { return hasUpgrade("hpw", 41) || hasUpgrade("hpw", 42)},
            onPurchase() {player.hpw.upgScale[5] = player.hpw.upgScale[5] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                let eff = new Decimal(0.1).mul(buyableEffect("hte", 43))
                if (hasUpgrade("hpw", 51)) eff = eff.mul(10)
                if (hasUpgrade("hpw", 53)) eff = eff.mul(10)
                return eff.add(1)
            },
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        53: {
            title: "Might 6:3",
            unlocked: true,
            description: "Multiply Might 6:2's effect by x10.",
            branches: [52],
            cost() {return new Decimal(player.h.stage.pow(3)).pow(player.hpw.upgScale[5]).floor()},
            canAfford() { return hasUpgrade("hpw", 52)},
            onPurchase() {player.hpw.upgScale[5] = player.hpw.upgScale[5] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        61: {
            title: "Might 7:1",
            unlocked: true,
            description: "Reduce the softcap on Amended Automation.",
            branches: [52],
            cost() {return new Decimal(player.h.stage.div(2).pow(9)).pow(player.hpw.upgScale[6]).floor()},
            canAfford() { return hasUpgrade("hpw", 52)},
            onPurchase() {player.hpw.upgScale[6] = player.hpw.upgScale[6] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        62: {
            title: "Might 7:2",
            unlocked: true,
            description() {return "Add a new effect that buffs jinx total to " + player.h.stageName[0] + " of Vexes."},
            branches: [52],
            cost() {return new Decimal(player.h.stage.div(2).pow(9)).pow(player.hpw.upgScale[6]).floor()},
            canAfford() { return hasUpgrade("hpw", 52)},
            onPurchase() {player.hpw.upgScale[6] = player.hpw.upgScale[6] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        71: {
            title: "Might 8:1",
            unlocked: true,
            description() {
                if (hasUpgrade("hpw", 164)) return "Boost pre-power resources based on mights."
                return "Boost blessings based on mights."
            },
            tooltip() {return "(Mights/5)+1"},
            branches: [61, 62],
            cost() {return new Decimal(player.h.stage.div(2).pow(11)).pow(player.hpw.upgScale[7]).floor()},
            canAfford() { return hasUpgrade("hpw", 61) || hasUpgrade("hpw", 62)},
            onPurchase() {player.hpw.upgScale[7] = player.hpw.upgScale[7] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return new Decimal(0.2).mul(player.hpw.upgTotal).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id), 1) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        72: {
            title: "Might 8:2",
            unlocked: true,
            description: "Double power gain.",
            branches: [71],
            cost() {return new Decimal(player.h.stage.div(2).pow(6)).pow(player.hpw.upgScale[7]).floor()},
            canAfford() { return hasUpgrade("hpw", 71)},
            onPurchase() {player.hpw.upgScale[7] = player.hpw.upgScale[7] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        73: {
            title: "Might δ:1",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Increase base of " + player.h.stageName[1] + " point booster by x1.2."},
            branches: [71],
            cost() {return player.h.stage.pow(10).floor()},
            canAfford() { return hasUpgrade("hpw", 71)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        74: {
            title: "Might δ:2",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Reduce the cost scaling of provenances past ζ by 25%."}, // MAKE IT CHANGE TO JUST REDUCING PROVENANCE SCALING WHEN BELOW HEX
            branches: [73],
            cost() {return player.h.stage.pow(30).floor()},
            canAfford() { return hasUpgrade("hpw", 73)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        75: {
            title: "Might δ:3",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Unlock " + player.h.stageName[1] + " of sacrifice."},
            branches: [74],
            cost() {return player.h.stage.pow(60).floor()},
            canAfford() { return hasUpgrade("hpw", 74)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        76: {
            title: "Might δ:4",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Boost provenance efficiency based on curses."},
            tooltip() {return "(((log" + formatWhole(player.h.stage.pow(3)) + "(Curses+1))^" + formatSimple(Decimal.div(3.5, player.h.stage.max(4)), 2) + ")/50)+1"},
            branches: [75],
            cost() {return player.h.stage.pow(110).floor()},
            canAfford() { return hasUpgrade("hpw", 75)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hcu.curses.add(1).log(player.h.stage.pow(3)).pow(Decimal.div(3.5, player.h.stage.max(4))).div(50).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        81: {
            title: "Might 9:1",
            unlocked: true,
            description: "Increase Refiner 1's 1st effect base by 50%.",
            branches: [71],
            cost() {return new Decimal(player.h.stage.div(2).pow(12.5)).pow(player.hpw.upgScale[8]).floor()},
            canAfford() { return hasUpgrade("hpw", 71)},
            onPurchase() {player.hpw.upgScale[8] = player.hpw.upgScale[8] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        91: {
            title: "Might 10:1",
            unlocked: true,
            description: "Double Refiner 5's 1st effect base.",
            branches: [81],
            cost() {return new Decimal(player.h.stage.div(2).pow(14)).pow(player.hpw.upgScale[9]).floor()},
            canAfford() { return hasUpgrade("hpw", 81)},
            onPurchase() {player.hpw.upgScale[9] = player.hpw.upgScale[9] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        92: {
            title: "Might 10:2",
            unlocked: true,
            description() {return "Add a new effect that buffs blessings to " + player.h.stageName[0] + " of Vexes."},
            branches: [81],
            cost() {return new Decimal(player.h.stage.div(2).pow(14)).pow(player.hpw.upgScale[9]).floor()},
            canAfford() { return hasUpgrade("hpw", 81)},
            onPurchase() {player.hpw.upgScale[9] = player.hpw.upgScale[9] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        101: {
            title: "Might 11:1",
            unlocked: true,
            description() {
                if (inChallenge("hrm", 16)) return "Boost refiner 1 effects based on boons."
                return "Boost provenance effects based on boons."
            },
            tooltip() {
                if (inChallenge("hrm", 16)) return "(1.05^(log" + formatSimple(Decimal.pow10(player.h.stage)) + "(Boons+1)))-1"
                return "1.1^(log" + formatSimple(Decimal.pow10(player.h.stage)) + "(Boons+1))"
            },
            branches: [91],
            cost() {return new Decimal(player.h.stage.div(2).pow(15)).pow(player.hpw.upgScale[10]).floor()},
            canAfford() { return hasUpgrade("hpw", 91)},
            onPurchase() {player.hpw.upgScale[10] = player.hpw.upgScale[10] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (inChallenge("hrm", 16)) return Decimal.pow(1.05, player.hbl.boons.add(1).log(Decimal.pow10(player.h.stage))).sub(1).min(1.5)
                return Decimal.pow(1.1, player.hbl.boons.add(1).log(Decimal.pow10(player.h.stage)))
            },
            effectDisplay() {
                if (inChallenge("hrm", 16)) {
                    if (upgradeEffect(this.layer, this.id).gte(1.5)) return "^+" + format(upgradeEffect(this.layer, this.id)) + " <small style='color:red'>[HARDCAPPED]</small>"
                    return "^+" + format(upgradeEffect(this.layer, this.id))
                }
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        102: {
            title: "Might 11:2",
            unlocked: true,
            description: "Raise curse gain based on jinx score.",
            tooltip() {return "((log10((Jinx Total/10)+1))/100)+1"},
            branches: [92],
            cost() {return new Decimal(player.h.stage.div(2).pow(15)).pow(player.hpw.upgScale[10]).floor()},
            canAfford() { return hasUpgrade("hpw", 92)},
            onPurchase() {player.hpw.upgScale[10] = player.hpw.upgScale[10] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hcu.jinxTotal.div(10).add(1).log(10).div(100).add(1).min(1.1)
            },
            effectDisplay() {
                let str = "^" + format(upgradeEffect(this.layer, this.id), 3)
                if (upgradeEffect(this.layer, this.id).gte(1.1)) str = str.concat("<small style='color:red'>[HARDCAPPED]</small>")
                return str
            },
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        103: {
            title: "Might ε:1",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Boost Uni-Alpha tickspeed based on time spent in this power reset."},
            tooltip() {return "((Since Power^0.3)/" + formatSimple(player.h.stage.div(2)) + ")+1"},
            branches: [102],
            cost() {return player.h.stage.pow(15).floor()},
            canAfford() { return hasUpgrade("hpw", 102)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.sincePower.pow(0.3).div(player.h.stage.div(2)).add(1)
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id), 1) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        104: {
            title: "Might ε:2",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Boost time spent in this power reset. (decays based on time in this power reset)"},
            tooltip() {return "(9/((log" + formatWhole(player.h.stage) + "(Since Power+1)/10))+1)+1"},
            branches: [103],
            cost() {return player.h.stage.pow(45).floor()},
            canAfford() { return hasUpgrade("hpw", 103)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return Decimal.div(9, player.hpw.sincePower.add(1).log(player.h.stage).div(10).add(1)).add(1)
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id), 1) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        105: {
            title: "Might ε:3",
            unlocked() {return player.h.stage.neq(6)},
            description: "Improve Might 1:1's effect.",
            tooltip() {return "(log" + formatWhole(player.h.stage.max(2)) + "(Power+1)+1)*2<br>↓<br>(log" + formatSimple(player.h.stage.div(2).max(1.5)) + "(Power+1)+1)*((log" + formatWhole(player.h.stage.max(2)) + "(Time in Power+1)/10)+2)"},
            branches: [104],
            cost() {return player.h.stage.pow(90).floor()},
            canAfford() { return hasUpgrade("hpw", 104)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        106: {
            title: "Might ε:4",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Gain 1% of power gain per second."},
            branches: [105],
            cost() {return player.h.stage.pow(150).floor()},
            canAfford() { return hasUpgrade("hpw", 105)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        111: {
            title: "Might 12:1",
            unlocked: true,
            description: "Gain 3 free purities.",
            branches: [101],
            cost() {return new Decimal(player.h.stage.div(2).pow(16)).pow(player.hpw.upgScale[11]).floor()},
            canAfford() { return hasUpgrade("hpw", 101)},
            onPurchase() {player.hpw.upgScale[11] = player.hpw.upgScale[11] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        112: {
            title: "Might 12:2",
            unlocked: true,
            description() {return "Divide vex requirement by /" + formatShortestWhole(Decimal.pow10(player.h.stage)) + "."},
            branches: [102],
            cost() {return new Decimal(player.h.stage.div(2).pow(16)).pow(player.hpw.upgScale[11]).floor()},
            canAfford() { return hasUpgrade("hpw", 102)},
            onPurchase() {player.hpw.upgScale[11] = player.hpw.upgScale[11] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        121: {
            title: "Might 13:1",
            unlocked: true,
            description: "Triple pre-power resources.",
            branches: [111, 112],
            cost() {return new Decimal(player.h.stage.div(2).pow(17)).pow(player.hpw.upgScale[12]).floor()},
            canAfford() { return hasUpgrade("hpw", 111) || hasUpgrade("hpw", 112)},
            onPurchase() {player.hpw.upgScale[12] = player.hpw.upgScale[12] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        131: {
            title: "Might 14:1",
            unlocked: true,
            description: "Double power gain.",
            branches: [132],
            cost() {return new Decimal(player.h.stage.div(2).pow(9.5)).pow(player.hpw.upgScale[13]).floor()},
            canAfford() { return hasUpgrade("hpw", 132)},
            onPurchase() {player.hpw.upgScale[13] = player.hpw.upgScale[13] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        132: {
            title: "Might 14:2",
            unlocked: true,
            description() {
                if (inChallenge("hrm", 16)) return "Boost refiner 1 effects by ^+0.5"
                return "Divide provenance req's by /1.5."
            },
            branches: [121],
            cost() {return new Decimal(player.h.stage.div(2).pow(18.5)).pow(player.hpw.upgScale[13]).floor()},
            canAfford() { return hasUpgrade("hpw", 121)},
            onPurchase() {player.hpw.upgScale[13] = player.hpw.upgScale[13] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        133: {
            title: "Might ζ:1",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Boost refiner 1's first effect based on boons."},
            tooltip() {return "(log" + formatSimple(Decimal.pow10(player.h.stage)) + "(Boons+1)/20)+1"},
            branches: [132],
            cost() {return player.h.stage.pow(20).floor()},
            canAfford() { return hasUpgrade("hpw", 132)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hbl.boons.add(1).log(Decimal.pow10(player.h.stage)).div(20).add(1)
            },
            effectDisplay() { return "^" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        134: {
            title: "Might ζ:2",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Divide refinement requirements based on purities."},
            tooltip() {return formatSimple(player.h.stage.div(2)) + "^Purities"},
            branches: [133],
            cost() {return player.h.stage.pow(60).floor()},
            canAfford() { return hasUpgrade("hpw", 133)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return Decimal.pow(player.h.stage.div(2), player.hpu.totalPurity)
            },
            effectDisplay() { return "/" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        135: {
            title: "Might ζ:3",
            unlocked() {return player.h.stage.neq(6)},
            description: "Improve refiner 6's first effect.",
            branches: [134],
            cost() {return player.h.stage.pow(120).floor()},
            canAfford() { return hasUpgrade("hpw", 134)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        136: {
            title: "Might ζ:4",
            unlocked() {return player.h.stage.neq(6)},
            description: "Unlock a vex effect that reduces refinement scaling.",
            branches: [135],
            cost() {return player.h.stage.pow(200).floor()},
            canAfford() { return hasUpgrade("hpw", 135)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        141: {
            title: "Might 15:1",
            unlocked: true,
            description: "Multiply pre-power resources based on power.",
            tooltip() {return "1.3^(log" + formatWhole(player.h.stage) + "((Power/" + formatSimple(Decimal.pow10(player.h.stage)) + ")+1)^0.9)"},
            branches: [132],
            cost() {return new Decimal(player.h.stage.div(2).pow(20)).pow(player.hpw.upgScale[14]).floor()},
            canAfford() { return hasUpgrade("hpw", 132)},
            onPurchase() {player.hpw.upgScale[14] = player.hpw.upgScale[14] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return Decimal.pow(1.3, player.hpw.power.div(Decimal.pow10(player.h.stage)).add(1).log(player.h.stage).pow(0.9))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id), 1) + "x" }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        151: {
            title: "Might 16:1",
            unlocked() {return player.h.stage.gte(7)},
            description() {return "Unlock " + player.h.stageName[0] + " of Tempering."},
            branches: [141],
            cost() {return new Decimal(player.h.stage.div(2).pow(22)).pow(player.hpw.upgScale[15]).floor()},
            canAfford() { return hasUpgrade("hpw", 141)},
            onPurchase() {player.hpw.upgScale[15] = player.hpw.upgScale[15] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        152: {
            title: "Might 16:2",
            unlocked() {return player.h.stage.gte(7)},
            description: "Gain free purities based on blessings.",
            tooltip() {return "Floor(log" + formatSimple(Decimal.pow10(player.h.stage.div(2))) + "(Blessings+1)^0.5)"},
            branches: [141],
            cost() {return new Decimal(player.h.stage.div(2).pow(22)).pow(player.hpw.upgScale[15]).floor()},
            canAfford() { return hasUpgrade("hpw", 141)},
            onPurchase() {player.hpw.upgScale[15] = player.hpw.upgScale[15] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hbl.blessings.add(1).log(Decimal.pow10(player.h.stage.div(2))).pow(0.5).floor()
            },
            effectDisplay() { return "+" + formatWhole(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        153: {
            title: "Might 16:3",
            unlocked() {return player.h.stage.gte(7)},
            description: "Increase the effective of vexes on vex effects by ^1.2.",
            branches: [141],
            cost() {return new Decimal(player.h.stage.div(2).pow(22)).pow(player.hpw.upgScale[15]).floor()},
            canAfford() { return hasUpgrade("hpw", 141)},
            onPurchase() {player.hpw.upgScale[15] = player.hpw.upgScale[15] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        154: {
            title: "Might 16:4",
            unlocked() {return player.h.stage.gte(7)},
            description: "Raise external effects based on α-provenance.",
            tooltip() {
                return "(log" + formatWhole(player.h.stage) + "(α-Provenance+1)/100)+1"
            },
            branches: [141],
            cost() {return new Decimal(player.h.stage.div(2).pow(22)).pow(player.hpw.upgScale[15]).floor()},
            canAfford() { return hasUpgrade("hpw", 141)},
            onPurchase() {player.hpw.upgScale[15] = player.hpw.upgScale[15] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                let eff = player.hpr.rank[0].add(1).log(player.h.stage).div(100).add(1)
                if (eff.gt(1.1)) eff = player.hpr.rank[0].add(1).log(player.h.stage).pow(Decimal.div(3.5, player.h.stage)).div(100).add(1.068)
                return eff
            },
            effectDisplay() { return "^" + formatSimple(upgradeEffect(this.layer, this.id), 3) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        161: {
            title: "Might 17:1",
            unlocked() {return player.h.stage.gte(7)},
            description() {return "Divide provenance req's based on " + player.h.stageName[1] + " points."},
            tooltip() {return "((log" + formatWhole(player.h.stage) + "(" + player.h.stageName[0] + " Points+1)^0.7)/100)+1"},
            branches: [151],
            cost() {return new Decimal(player.h.stage.div(2).pow(24)).pow(player.hpw.upgScale[16]).floor()},
            canAfford() { return hasUpgrade("hpw", 151)},
            onPurchase() {player.hpw.upgScale[16] = player.hpw.upgScale[16] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.h.hexPoint.add(1).log(player.h.stage).pow(0.7).div(100).add(1)
            },
            effectDisplay() { return "/" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        162: {
            title: "Might 17:2",
            unlocked() {return player.h.stage.gte(7)},
            description: "Unlock new graces.",
            branches: [152],
            cost() {return new Decimal(player.h.stage.div(2).pow(24)).pow(player.hpw.upgScale[16]).floor()},
            canAfford() { return hasUpgrade("hpw", 152)},
            onPurchase() {player.hpw.upgScale[16] = player.hpw.upgScale[16] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        163: {
            title: "Might 17:3",
            unlocked() {return player.h.stage.gte(7)},
            description: "Improve Γ-Jinx formula.",
            branches: [153],
            cost() {return new Decimal(player.h.stage.div(2).pow(24)).pow(player.hpw.upgScale[16]).floor()},
            canAfford() { return hasUpgrade("hpw", 153)},
            onPurchase() {player.hpw.upgScale[16] = player.hpw.upgScale[16] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        164: {
            title: "Might 17:4",
            unlocked() {return player.h.stage.gte(7)},
            description: "Replace 8:1's effect with one that boosts pre-power resources.",
            branches: [154],
            cost() {return new Decimal(player.h.stage.div(2).pow(24)).pow(player.hpw.upgScale[16]).floor()},
            canAfford() { return hasUpgrade("hpw", 154)},
            onPurchase() {player.hpw.upgScale[16] = player.hpw.upgScale[16] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        165: {
            title: "Might η:1",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Raise " + player.h.stageName[1] + " points by ^1.05."},
            branches: [161],
            cost() {return player.h.stage.pow(30).floor()},
            canAfford() { return hasUpgrade("hpw", 161)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        166: {
            title: "Might η:2",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Re-unlock sacred energies first effect."},
            branches: [165],
            cost() {return player.h.stage.pow(90).floor()},
            canAfford() { return hasUpgrade("hpw", 165)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        167: {
            title: "Might η:3",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Improve base holy power formula."},
            branches: [166],
            cost() {return player.h.stage.pow(180).floor()},
            canAfford() { return hasUpgrade("hpw", 166)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px", borderRadius: "15px"},
        },
        168: {
            title: "Might η:4",
            unlocked() {return player.h.stage.neq(6)},
            description() {return "Boost holy power gain based on purity."},
            tooltip() {return "((Purities^" + formatSimple(Decimal.div(3.5, player.h.stage)) + ")/2)+1"},
            branches: [167],
            cost() {return player.h.stage.pow(300).floor()},
            canAfford() { return hasUpgrade("hpw", 167)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpu.totalPurity.pow(Decimal.div(3.5, player.h.stage)).div(2).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        171: {
            title: "Might 18:1",
            unlocked() {return player.h.stage.gte(7)},
            description: "Boost refiner 3's first effect.",
            branches: [161],
            cost() {return new Decimal(player.h.stage.div(2).pow(26)).pow(player.hpw.upgScale[17]).floor()},
            canAfford() { return hasUpgrade("hpw", 161)},
            onPurchase() {player.hpw.upgScale[17] = player.hpw.upgScale[17] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        172: {
            title: "Might 18:2",
            unlocked() {return player.h.stage.gte(7)},
            description: "Boost blessings based on time spent in this tera reset.",
            tooltip() {return "((Since Tera^0.4)/" + formatSimple(player.h.stage.div(2)) + ")+1"},
            branches: [162],
            cost() {return new Decimal(player.h.stage.div(2).pow(26)).pow(player.hpw.upgScale[17]).floor()},
            canAfford() { return hasUpgrade("hpw", 162)},
            onPurchase() {player.hpw.upgScale[17] = player.hpw.upgScale[17] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.tera.sinceTera.pow(0.4).div(player.h.stage.div(2)).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        173: {
            title: "Might 18:3",
            unlocked() {return player.h.stage.gte(7)},
            description: "Unlock vex buyables.",
            branches: [163],
            cost() {return new Decimal(player.h.stage.div(2).pow(26)).pow(player.hpw.upgScale[17]).floor()},
            canAfford() { return hasUpgrade("hpw", 163)},
            onPurchase() {player.hpw.upgScale[17] = player.hpw.upgScale[17] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        174: {
            title: "Might 18:4",
            unlocked() {return player.h.stage.gte(7)},
            description: "Triple Uni-Alpha tickspeed.",
            branches: [164],
            cost() {return new Decimal(player.h.stage.div(2).pow(26)).pow(player.hpw.upgScale[17]).floor()},
            canAfford() { return hasUpgrade("hpw", 164)},
            onPurchase() {player.hpw.upgScale[17] = player.hpw.upgScale[17] + 1},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },

        1001: {
            title: "Might A:0",
            unlocked() { return layers.hrm.layerShown() },
            description: "Unlock the Creator Realm challenge.",
            branches: [12],
            cost() {return new Decimal(player.h.stage.pow(2)).floor()},
            canAfford() { return hasUpgrade("hpw", 12)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f00"},
        },
        1002: {
            title: "Might B:0",
            unlocked() { return layers.hrm.layerShown() },
            description: "Unlock the Higher Plane challenge.",
            branches: [31],
            cost() {return new Decimal(player.h.stage.pow(3)).floor()},
            canAfford() { return hasUpgrade("hpw", 31)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f80"},
        },
        1003: {
            title: "Might C:0",
            unlocked() { return layers.hrm.layerShown() },
            description: "Unlock the Death Realm challenge.",
            branches: [42],
            cost() {return new Decimal(player.h.stage.pow(4)).floor()},
            canAfford() { return hasUpgrade("hpw", 42)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #ff0"},
        },
        1004: {
            title: "Might D:0",
            unlocked() { return layers.hrm.layerShown() },
            description: "Unlock the Dimensional Realm challenge.",
            branches: [71],
            cost() {return new Decimal(player.h.stage.pow(7)).floor()},
            canAfford() { return hasUpgrade("hpw", 71)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #0f0"},
        },
        1005: {
            title: "Might E:0",
            unlocked() { return layers.hrm.layerShown() },
            description: "Unlock the Dream Realm challenge.",
            branches: [102],
            cost() {return new Decimal(player.h.stage.pow(9)).floor()},
            canAfford() { return hasUpgrade("hpw", 102)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #00f"},
        },
        1006: {
            title: "Might F:0",
            unlocked() { return layers.hrm.layerShown() },
            description: "Unlock the Void Realm challenge.",
            branches: [132],
            cost() {return new Decimal(player.h.stage.pow(12)).floor()},
            canAfford() { return hasUpgrade("hpw", 132)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #80f"},
        },
        1011: {
            title: "Might A:1",
            unlocked() {return challengeCompletions("hrm", 11) >= 1 && layers.hrm.layerShown()},
            description: "Raise rank, tier, tetr, and pent effects by ^1.18.",
            tooltip() {return "Realm mights work outside of " + player.h.stageName[1] + "."},
            branches: [1001],
            cost() {return new Decimal(player.h.stage).floor()},
            canAfford() { return hasUpgrade("hpw", 1001)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f00"},
        },
        1012: {
            title: "Might A:2",
            unlocked() {return challengeCompletions("hrm", 11) >= 2 && layers.hrm.layerShown()},
            description: "Multiply factor base by x120.",
            branches: [1001],
            cost() {return new Decimal(player.h.stage.pow(2)).floor()},
            canAfford() { return hasUpgrade("hpw", 1001)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f00"},
        },
        1013: {
            title: "Might A:3",
            unlocked() {return challengeCompletions("hrm", 11) >= 3 && layers.hrm.layerShown()},
            description: "Boost check back xp based on power.",
            tooltip() {
                if (buyableEffect("hrm", 5).gt(1)) return "((log10(Power+1)/20)+1)^" + formatSimple(buyableEffect("hrm", 5))
                return "(log10(Power+1)/20)+1"
            },
            branches: [1001],
            cost() {return new Decimal(player.h.stage.pow(3)).floor()},
            canAfford() { return hasUpgrade("hpw", 1001)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.power.add(1).log(10).div(20).add(1).min(5).pow(buyableEffect("hrm", 5))
            },
            effectDisplay() {
                if (player.hpw.power.gte(1e80)) return "x" + format(upgradeEffect(this.layer, this.id)) + " <small style='color:red'>[HARDCAPPED]</small>"
                return "x" + format(upgradeEffect(this.layer, this.id))
            }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f00"},
        },
        1021: {
            title: "Might B:1",
            unlocked() {return challengeCompletions("hrm", 12) >= 1 && layers.hrm.layerShown()},
            description: "Raise prestige points gain by ^1.36.",
            branches: [1002],
            cost() {return new Decimal(player.h.stage.pow(2)).floor()},
            canAfford() { return hasUpgrade("hpw", 1002)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f80"},
        },
        1022: {
            title: "Might B:2",
            unlocked() {return challengeCompletions("hrm", 12) >= 2 && layers.hrm.layerShown()},
            description: "Raise tree gain by ^1.24.",
            branches: [1002],
            cost() {return new Decimal(player.h.stage.pow(3)).floor()},
            canAfford() { return hasUpgrade("hpw", 1002)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f80"},
        },
        1023: {
            title: "Might B:3",
            unlocked() {return challengeCompletions("hrm", 12) >= 3 && layers.hrm.layerShown()},
            description: "Boost crystals and steel based on power.",
            tooltip() {
                if (buyableEffect("hrm", 5).gt(1)) return "((Power^0.2)+1)^" + formatSimple(buyableEffect("hrm", 5))
                return "(Power^0.2)+1"
            },
            branches: [1002],
            cost() {return new Decimal(player.h.stage.pow(4)).floor()},
            canAfford() { return hasUpgrade("hpw", 1002)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.power.pow(0.2).add(1).pow(buyableEffect("hrm", 5))
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #f80"},
        },
        1031: {
            title: "Might C:1",
            unlocked() {return challengeCompletions("hrm", 13) >= 1 && layers.hrm.layerShown()},
            description: "Raise grass gain by ^1.18.",
            branches: [1003],
            cost() {return new Decimal(player.h.stage.pow(3)).floor()},
            canAfford() { return hasUpgrade("hpw", 1003)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #ff0"},
        },
        1032: {
            title: "Might C:2",
            unlocked() {return challengeCompletions("hrm", 13) >= 2 && layers.hrm.layerShown()},
            description: "Raise golden grass gain by ^1.06.",
            branches: [1003],
            cost() {return new Decimal(player.h.stage.pow(4)).floor()},
            canAfford() { return hasUpgrade("hpw", 1003)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #ff0"},
        },
        1033: {
            title: "Might C:3",
            unlocked() {return challengeCompletions("hrm", 13) >= 3 && layers.hrm.layerShown()},
            description: "Boost pollinators based on power.",
            tooltip() {
                if (buyableEffect("hrm", 5).gt(1)) return "((Power^0.15)+1)^" + formatSimple(buyableEffect("hrm", 5))
                return "(Power^0.15)+1"
            },
            branches: [1003],
            cost() {return new Decimal(player.h.stage.pow(5)).floor()},
            canAfford() { return hasUpgrade("hpw", 1003)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.power.pow(0.15).add(1).pow(buyableEffect("hrm", 5))
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #ff0"},
        },
        1041: {
            title: "Might D:1",
            unlocked() {return challengeCompletions("hrm", 14) >= 1 && layers.hrm.layerShown()},
            description: "Raise grasshopper gain by ^1.1.",
            branches: [1004],
            cost() {return new Decimal(player.h.stage.pow(6)).floor()},
            canAfford() { return hasUpgrade("hpw", 1004)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #0f0"},
        },
        1042: {
            title: "Might D:2",
            unlocked() {return challengeCompletions("hrm", 14) >= 2 && layers.hrm.layerShown()},
            description: "Raise mod gain by ^1.1.",
            branches: [1004],
            cost() {return new Decimal(player.h.stage.pow(7)).floor()},
            canAfford() { return hasUpgrade("hpw", 1004)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #0f0"},
        },
        1043: {
            title: "Might D:3",
            unlocked() {return challengeCompletions("hrm", 14) >= 3 && layers.hrm.layerShown()},
            description: "Boost infinity dimensions based on power.",
            tooltip() {
                if (buyableEffect("hrm", 5).gt(1)) return "((Power^0.3)+1)^" + formatSimple(buyableEffect("hrm", 5))
                return "(Power^0.3)+1"
            },
            branches: [1004],
            cost() {return new Decimal(player.h.stage.pow(8)).floor()},
            canAfford() { return hasUpgrade("hpw", 1004)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.power.pow(0.3).add(1).pow(buyableEffect("hrm", 5))
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #0f0"},
        },
        1051: {
            title: "Might E:1",
            unlocked() {return challengeCompletions("hrm", 15) >= 1 && layers.hrm.layerShown()},
            description: "Raise AD and antimatter by ^1.05.",
            branches: [1005],
            cost() {return new Decimal(player.h.stage.pow(8)).floor()},
            canAfford() { return hasUpgrade("hpw", 1005)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #00f"},
        },
        1052: {
            title: "Might E:2",
            unlocked() {return challengeCompletions("hrm", 15) >= 2 && layers.hrm.layerShown()},
            description: "Multiply NIP by x100.",
            branches: [1005],
            cost() {return new Decimal(player.h.stage.pow(9)).floor()},
            canAfford() { return hasUpgrade("hpw", 1005)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #00f"},
        },
        1053: {
            title: "Might E:3",
            unlocked() {return challengeCompletions("hrm", 15) >= 3 && layers.hrm.layerShown()},
            description: "Boost mastery point effects based on power.",
            tooltip() {
                if (buyableEffect("hrm", 5).gt(1)) {
                    if (Decimal.pow(1.06, player.hpw.power.add(1).log(6)).gte(5)) return"((log6(Power+1))/5.5)^" + formatSimple(buyableEffect("hrm", 5))
                    return "(1.06^(log6(Power+1)))^" + formatSimple(buyableEffect("hrm", 5))
                } else {
                    if (Decimal.pow(1.06, player.hpw.power.add(1).log(6)).gte(5)) return "(log6(Power+1))/5.5"
                    return "1.06^(log6(Power+1))"
                }
            },
            branches: [1005],
            cost() {return new Decimal(player.h.stage.pow(10)).floor()},
            canAfford() { return hasUpgrade("hpw", 1005)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                let eff = Decimal.pow(1.06, player.hpw.power.add(1).log(6))
                if (eff.gte(5)) eff = player.hpw.power.add(1).log(6).div(5.5).min(10)
                eff = eff.pow(buyableEffect("hrm", 5))
                return eff
            },
            effectDisplay() {
                if (Decimal.pow(1.06, player.hpw.power.add(1).log(6)).gte(10)) return "^" + format(upgradeEffect(this.layer, this.id)) + " <small style='color:darkred'>[HARDCAPPED]</small>"
                if (Decimal.pow(1.06, player.hpw.power.add(1).log(6)).gte(5)) return "^" + format(upgradeEffect(this.layer, this.id)) + " <small style='color:darkred'>[SOFTCAPPED]</small>"
                return "^" + format(upgradeEffect(this.layer, this.id))
            }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #00f"},
        },
        1061: {
            title: "Might F:1",
            unlocked() {return challengeCompletions("hrm", 16) >= 1 && layers.hrm.layerShown()},
            description: "+25% crate roll multiplier.",
            branches: [1006],
            cost() {return new Decimal(player.h.stage.pow(11)).floor()},
            canAfford() { return hasUpgrade("hpw", 1006)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #80f"},
        },
        1062: {
            title: "Might F:2",
            unlocked() {return challengeCompletions("hrm", 16) >= 2 && layers.hrm.layerShown()},
            description: "Triple replicanti mult.",
            branches: [1006],
            cost() {return new Decimal(player.h.stage.pow(12)).floor()},
            canAfford() { return hasUpgrade("hpw", 1006)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #80f"},
        },
        1063: {
            title: "Might F:3",
            unlocked() {return challengeCompletions("hrm", 16) >= 3 && layers.hrm.layerShown()},
            description: "Boost infinity points based on power.",
            tooltip() {
                if (buyableEffect("hrm", 5).gt(1)) return "((Power^0.25)+1)^" + formatSimple(buyableEffect("hrm", 5))
                return "(Power^0.25)+1"
            },
            branches: [1006],
            cost() {return new Decimal(player.h.stage.pow(13)).floor()},
            canAfford() { return hasUpgrade("hpw", 1006)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                return player.hpw.power.pow(0.25).add(1).pow(buyableEffect("hrm", 5))
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", margin: "10px", borderRadius: "15px", border: "3px solid #80f"},
        },

        1101: {
            title: "Might 𝕡:1",
            unlocked: true,
            description: "Automate Purified Provenances.",
            branches: [1102],
            cost() {return new Decimal(player.h.stage.pow(27)).floor()},
            canAfford() { return hasUpgrade("hpw", 1102)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "40px 30px 0 10px", borderRadius: "15px"},
        },
        1102: {
            title: "Might 𝕡:2",
            unlocked: true,
            description: "Automate Multiplied Miracles, but nerf Amended Automation.",
            branches: [101],
            cost() {return new Decimal(player.h.stage.pow(25)).floor()},
            canAfford() { return hasUpgrade("hpw", 101)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "130px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px 10px 20px 0", borderRadius: "15px"},
        },
        1103: {
            title: "Might 𝕡:3",
            unlocked: true,
            description: "Automate Elevated Exponent.",
            branches: [1102],
            cost() {return new Decimal(player.h.stage.pow(26)).floor()},
            canAfford() { return hasUpgrade("hpw", 1102)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "0 30px 40px 10px", borderRadius: "15px"},
        },
        1104: {
            title: "Might 𝕡:4",
            unlocked: true,
            description: "Automate Healed Hexes.",
            branches: [1101],
            cost() {return new Decimal(player.h.stage.pow(30)).floor()},
            canAfford() { return hasUpgrade("hpw", 1101)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "40px 10px 0 30px", borderRadius: "15px"},
        },
        1105: {
            title: "Might 𝕡:5",
            unlocked: true,
            description: "Automate Amended Automation.",
            branches: [1102],
            cost() {return new Decimal(player.h.stage.pow(28)).floor()},
            canAfford() { return hasUpgrade("hpw", 1102)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "20px 35px 20px 5px", borderRadius: "15px"},
        },
        1106: {
            title: "Might 𝕡:6",
            unlocked: true,
            description: "Automate Cleansed Curses.",
            branches: [1103],
            cost() {return new Decimal(player.h.stage.pow(29)).floor()},
            canAfford() { return hasUpgrade("hpw", 1103)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "0 10px 40px 30px", borderRadius: "15px"},
        },
        1107: {
            title: "Might 𝕡:7",
            unlocked() {return player.h.stage.gte(7)},
            description: "Automate External Expansion.",
            branches: [1104],
            cost() {return new Decimal(player.h.stage.pow(50)).floor()},
            canAfford() { return hasUpgrade("hpw", 1104)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {width: "100px", minHeight: "100px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "40px 20px 0 20px", borderRadius: "15px"},
        },
        2001: {
            title: "Might S:1",
            unlocked() {return player.h.stage.eq(7)},
            description() {return "Reduce envy's penalty by /" + formatSimple(upgradeEffect(this.layer, this.id)) + "."},
            branches: [11],
            cost() {return new Decimal(35000)},
            canAfford() { return hasUpgrade("hpw", 11)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (hasUpgrade("hpw", 2009)) return new Decimal(2)
                return new Decimal(1.5)
            },
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2002: {
            title: "Might S:2",
            unlocked() {return player.h.stage.eq(7)},
            description() {return "Reduce wrath's penalty by /" + formatSimple(upgradeEffect(this.layer, this.id)) + "."},
            branches: [11],
            cost() {return new Decimal(1.4e7)},
            canAfford() { return hasUpgrade("hpw", 11)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {
                if (hasUpgrade("hpw", 2009)) return new Decimal(2)
                return new Decimal(1.5)
            },
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2003: {
            title: "Might S:(",
            unlocked() {return player.h.stage.eq(7)},
            description: "Improve envy and wrath's power effect formulas.<br>[NOT IMPLEMENTED]",
            branches: [2001, 2002],
            cost() {return Decimal.pow10(player.h.stage.mul(15))},
            canAfford() { return hasUpgrade("hpw", 2001) && hasUpgrade("hpw", 2002)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2004: {
            title: "Might S:3",
            unlocked() {return player.h.stage.eq(7)},
            description() {return "Reduce lust's penalty by /" + formatSimple(upgradeEffect(this.layer, this.id)) + "."},
            branches: [72],
            cost() {return new Decimal(7e11)},
            canAfford() { return hasUpgrade("hpw", 72)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {return new Decimal(1.5)},
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2005: {
            title: "Might S:4",
            unlocked() {return player.h.stage.eq(7)},
            description() {return "Reduce gluttony's penalty by /" + formatSimple(upgradeEffect(this.layer, this.id)) + "."},
            branches: [72],
            cost() {return new Decimal(3.5e14)},
            canAfford() { return hasUpgrade("hpw", 72)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {return new Decimal(1.5)},
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2006: {
            title: "Might S:{",
            unlocked() {return player.h.stage.eq(7)},
            description: "Improve lust and gluttony's power effect formulas.<br>[NOT IMPLEMENTED]",
            branches: [2004, 2005],
            cost() {return Decimal.pow10(player.h.stage.mul(20))},
            canAfford() { return hasUpgrade("hpw", 2004) && hasUpgrade("hpw", 2005)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2007: {
            title: "Might S:5",
            unlocked() {return player.h.stage.eq(7)},
            description() {return "Reduce sloth's penalty by /" + formatSimple(upgradeEffect(this.layer, this.id)) + "."},
            branches: [131],
            cost() {return new Decimal(7e17)},
            canAfford() { return hasUpgrade("hpw", 131)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {return new Decimal(2)},
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2008: {
            title: "Might S:6",
            unlocked() {return player.h.stage.eq(7)},
            description() {return "Reduce greed's penalty by /" + formatSimple(upgradeEffect(this.layer, this.id)) + "."},
            branches: [131],
            cost() {return new Decimal(1.4e21)},
            canAfford() { return hasUpgrade("hpw", 131)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            effect() {return new Decimal(2)},
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
        2009: {
            title: "Might S:[",
            unlocked() {return player.h.stage.eq(7)},
            description: "Improve sloth's power effect formula and boost S:1 and S:2.<br>[NOT IMPLEMENTED]",
            branches: [2007, 2008],
            cost() {return Decimal.pow10(player.h.stage.mul(25))},
            canAfford() { return hasUpgrade("hpw", 2007) && hasUpgrade("hpw", 2008)},
            currencyLocation() { return player.hpw },
            currencyDisplayName: "Power",
            currencyInternalName: "power",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "10px", borderRadius: "15px"},
        },
    },
    buyables: {
        0: {
            style: {width: "0px", height: "0px", border: "0px", padding: "0px", marginLeft: "-70px"},
        },
        1: {
            costBase() { return new Decimal(1e10) },
            costGrowth() { return new Decimal(6) },
            purchaseLimit() { return new Decimal(27) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && hasUpgrade("hpw", 141)},
            branches: [0],
            display() {
                return "<h3>Might α</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/27)\n\
                    Increase \n\ Creator Realm Completion Cap.\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        2: {
            costBase() { return new Decimal(1e11) },
            costGrowth() { return new Decimal(12) },
            purchaseLimit() { return new Decimal(27) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 1).gte(1)},
            branches: [1],
            display() {
                return "<h3>Might β</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/27)\n\
                    Increase \n\ Higher Plane Completion Cap.\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        3: {
            costBase() { return new Decimal(1e13) },
            costGrowth() { return new Decimal(24) },
            purchaseLimit() { return new Decimal(27) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 2).gte(1)},
            branches: [2],
            display() {
                return "<h3>Might γ</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/27)\n\
                    Increase \n\ Death Realm Completion Cap.\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        4: {
            costBase() { return new Decimal(1e16) },
            costGrowth() { return new Decimal(48) },
            purchaseLimit() { return new Decimal(27) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 3).gte(1)},
            branches: [3],
            display() {
                return "<h3>Might δ</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/27)\n\
                    Increase \n\ Dimensional Realm Completion Cap.\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        5: {
            costBase() { return new Decimal(1e20) },
            costGrowth() { return new Decimal(96) },
            purchaseLimit() { return new Decimal(27) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 4).gte(1)},
            branches: [4],
            display() {
                return "<h3>Might ε</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/27)\n\
                    Increase \n\ Dream Realm Completion Cap.\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        6: {
            costBase() { return new Decimal(1e25) },
            costGrowth() { return new Decimal(192) },
            purchaseLimit() { return new Decimal(27) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 5).gte(1)},
            branches: [5],
            display() {
                return "<h3>Might ζ</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/27)\n\
                    Increase \n\ Void Realm Completion Cap.\n\
                    Currently: +" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy(mult) {
                if (mult != true) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        7: {
            costBase() { return new Decimal(1e60) },
            costGrowth() { return new Decimal("1e600") },
            purchaseLimit() { return new Decimal(1) },
            currency() { return player.hpw.power},
            effect(x) { return getBuyableAmount(this.layer, this.id) },
            unlocked() { return layers.hrm.layerShown() },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 6).gte(1)},
            branches: [6],
            display() {
                if (getBuyableAmount("hpw", 7).gt(0)){
                    return "<h3>Might 目</h3>\n\
                    Access the seal.\n\ \n\
                    Req: " + formatWhole(1e60) + " Power"
                }
                return "<h3>Might 目</h3>\n\
                    Access the seal.\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy(mult) {
                if (mult != true) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        11: {
            costBase() { return new Decimal(1e60) },
            costGrowth() { return new Decimal(36) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hpw.power},
            pay(amt) { player.hpw.power = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
            unlocked() { return hasUpgrade("tera", "hex1") },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 1).gte(1)},
            branches: [1],
            display() {
                return "<h3>Might EX-α</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Boost blessing gain.\n\
                    Currently: x" + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        12: {
            costBase() { return new Decimal(1e70) },
            costGrowth() { return new Decimal(216) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hpw.power},
            pay(amt) { player.hpw.power = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return hasUpgrade("tera", "hex1") },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 2).gte(1)},
            branches: [2],
            display() {
                return "<h3>Might EX-β</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Reduce purity requirement.\n\
                    Currently: -" + formatWhole(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        13: {
            costBase() { return new Decimal(1e80) },
            costGrowth() { return new Decimal(1296) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hpw.power},
            pay(amt) { player.hpw.power = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.9).div(100).add(1)},
            unlocked() { return hasUpgrade("tera", "hex1") },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 3).gte(1)},
            branches: [3],
            display() {
                return "<h3>Might EX-γ</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Boost curse gain.\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        14: {
            costBase() { return new Decimal(1e90) },
            costGrowth() { return new Decimal(7776) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hpw.power},
            pay(amt) { player.hpw.power = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(1.1).div(100).add(1)},
            unlocked() { return hasUpgrade("tera", "hex1") },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 4).gte(1)},
            branches: [4],
            display() {
                return "<h3>Might EX-δ</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Boost " + player.h.stageName[1] + " point gain.\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        15: {
            costBase() { return new Decimal(1e100) },
            costGrowth() { return new Decimal(46656) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hpw.power},
            pay(amt) { player.hpw.power = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))},
            unlocked() { return hasUpgrade("tera", "hex1") },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 5).gte(1)},
            branches: [5],
            display() {
                return "<h3>Might EX-ε</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Boost pre power resource gain.\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
        16: {
            costBase() { return new Decimal(1e110) },
            costGrowth() { return new Decimal(279936) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hpw.power},
            pay(amt) { player.hpw.power = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))},
            unlocked() { return hasUpgrade("tera", "hex1") },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && getBuyableAmount("hpw", 6).gte(1)},
            branches: [6],
            display() {
                return "<h3>Might EX-ζ</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Boost uni-alpha tickspeed gain.\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Req: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Power"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "10px"},
        },
    },
    milestones: {
        1: {
            requirementDescription: "<h3>1 Total Power",
            effectDescription() {return hasMilestone("hpw", 7) ? "Keep a grace and miracle on power reset per vigor." : "Keep a grace on power reset per vigor."},
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.hpw.totalPower.gte(1)},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        2: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage) + " Total Power"},
            effectDescription: "Keep IP related boosters on power resets.",
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.hpw.totalPower.gte(player.h.stage)},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        3: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(2)) + " Total Power"},
            effectDescription: "Double blessing gain below power requirement.",
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.hpw.totalPower.gte(player.h.stage.pow(2))},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        4: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(3)) + " Total Power"},
            effectDescription: "Keep NIP related jinxes on power resets.",
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.hpw.totalPower.gte(player.h.stage.pow(3))},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        5: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(4)) + " Total Power"},
            effectDescription: "Buying jinxes no longer spends curses.",
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.hpw.totalPower.gte(player.h.stage.pow(4))},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        6: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(5)) + " Total Power"},
            effectDescription: "Double blessing gain below power requirement again.",
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.hpw.totalPower.gte(player.h.stage.pow(5))},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        7: {
            unlocked() {return player.h.stage.gte(7)},
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.pow(6)) + " Total Power"},
            effectDescription: "1st vigor now also keeps miracles.",
            onComplete() { player.hpw.vigor = player.hpw.vigor + 1 },
            done() { return player.h.stage.gte(7) && player.hpw.totalPower.gte(player.h.stage.pow(6))},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
    },
    microtabs: {
        power: {
            "Mights": {
                buttonStyle() { return {borderColor: "#5e0000", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "5px"],
                    ["raw-html", "<i>Mights increase cost of other mights on the same row.</i>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ["blank", "5px"],
                    ["clickable", 2],
                    ["row", [
                        ["style-row", [["upgrade", 2001]], {width: "140px", height: "140px"}],
                        ["bt-upgrade", 1],
                        ["bt-upgrade", 2],
                        ["style-row", [["upgrade", 1011], ["bt-upgrade", 14]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 2003]], {width: "140px", height: "140px"}],
                        ["upgrade", 11],
                        ["upgrade", 12],
                        ["style-row", [["upgrade", 1001], ["bt-upgrade", 13]], {width: "140px", height: "140px"}],
                        ["style-row", [["upgrade", 1012], ["bt-upgrade", 15]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 2002]], {width: "140px", height: "140px"}],
                        ["upgrade", 21],
                        ["bt-upgrade", 22],
                        ["style-row", [["bt-upgrade", 1013], ["bt-upgrade", 16]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 1021], ["bt-upgrade", 37]], {width: "140px", height: "140px"}],
                        ["upgrade", 31],
                        ["bt-upgrade", 32],
                        ["bt-upgrade", 33],
                        ["style-row", [["upgrade", 1031], ["bt-upgrade", 44]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 1022], ["upgrade", 36]], {width: "140px", height: "140px"}],
                        ["style-row", [["upgrade", 1002], ["bt-upgrade", 34]], {width: "140px", height: "140px"}],
                        ["upgrade", 41],
                        ["upgrade", 42],
                        ["style-row", [["upgrade", 1003], ["bt-upgrade", 43]], {width: "140px", height: "140px"}],
                        ["style-row", [["upgrade", 1032], ["bt-upgrade", 45]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["bt-upgrade", 1023], ["bt-upgrade", 35]], {width: "140px", height: "140px"}],
                        ["upgrade", 51],
                        ["upgrade", 52],
                        ["upgrade", 53],
                        ["style-row", [["bt-upgrade", 1033], ["bt-upgrade", 46]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 1041], ["bt-upgrade", 76]], {width: "140px", height: "140px"}],
                        ["upgrade", 61],
                        ["upgrade", 62],
                        ["style-row", [["upgrade", 2004]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 1042], ["upgrade", 75]], {width: "140px", height: "140px"}],
                        ["style-row", [["upgrade", 1004], ["upgrade", 73]], {width: "140px", height: "140px"}],
                        ["bt-upgrade", 71],
                        ["upgrade", 72],
                        ["style-row", [["upgrade", 2006]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 1107]], {width: "140px", height: "140px"}],
                        ["style-row", [["bt-upgrade", 1043], ["upgrade", 74]], {width: "140px", height: "140px"}],
                        ["blank", ["70px", "140px"]],
                        ["upgrade", 81],
                        ["style-row", [["upgrade", 2005]], {width: "140px", height: "140px", marginLeft: "70px"}],
                        ["blank", ["140px", "140px"]],

                    ]],
                    ["row", [
                        ["upgrade", 1104],
                        ["upgrade", 1101],
                        ["upgrade", 91],
                        ["upgrade", 92],
                        ["blank", ["70px", "140px"]],
                        ["style-row", [["upgrade", 1051], ["bt-upgrade", 104]], {width: "140px", height: "140px"}],
                        ["blank", ["70px", "140px"]],
                    ]],
                    ["row", [
                        ["upgrade", 1105],
                        ["upgrade", 1102],
                        ["bt-upgrade", 101],
                        ["bt-upgrade", 102],
                        ["style-row", [["upgrade", 1005], ["bt-upgrade", 103]], {width: "140px", height: "140px"}],
                        ["style-row", [["upgrade", 1052], ["bt-upgrade", 105]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["upgrade", 1106],
                        ["upgrade", 1103],
                        ["upgrade", 111],
                        ["upgrade", 112],
                        ["blank", ["70px", "140px"]],
                        ["style-row", [["bt-upgrade", 1053], ["upgrade", 106]], {width: "140px", height: "140px"}],
                        ["blank", ["70px", "140px"]],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 2007]], {width: "140px", height: "140px", marginRight: "70px"}],
                        ["upgrade", 121],
                        ["blank", ["70px", "140px"]],
                        ["style-row", [["upgrade", 1061], ["upgrade", 136]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 2009]], {width: "140px", height: "140px"}],
                        ["upgrade", 131],
                        ["upgrade", 132],
                        ["style-row", [["upgrade", 1006], ["bt-upgrade", 133]], {width: "140px", height: "140px"}],
                        ["style-row", [["upgrade", 1062], ["upgrade", 135]], {width: "140px", height: "140px"}],
                    ]],
                    ["row", [
                        ["style-row", [["upgrade", 2008]], {width: "140px", height: "140px", marginRight: "70px"}],
                        ["style-row", [["bt-upgrade", 141], ["buyable", 0]], {width: "140px", height: "140px"}],
                        ["blank", ["70px", "140px"]],
                        ["style-row", [["bt-upgrade", 1063], ["bt-upgrade", 134]], {width: "140px", height: "140px"}],
                    ]],
                    ["style-column", [
                        ["row", [
                            ["style-row", [["buyable", 16]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 6]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 1]], {width: "140px", height: "140px"}],
                            ["style-row", [
                                ["buyable", 11],
                                ["style-column", [
                                    ["raw-html", "Kept on singularity<br>First purchase keeps the respective realm challenge on singularity", {color: "rgba(0,0,0,0.6)", userSelect: "none", fontSize: "14px", fontFamily: "monospace"}],
                                ], () => {return player.ir.iriditeDefeated ? {display: "none !important"} : {width: "180px", height: "110px", backgroundColor: "#933", border: "5px solid rgba(0,0,0,0.5)", marginLeft: "50px", borderRadius: "25px"}}],
                            ], {width: "140px", height: "140px"}],
                        ]],
                        ["row", [
                            ["style-row", [["buyable", 15]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 5]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 7]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 2]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 12]], {width: "140px", height: "140px"}],
                        ]],
                        ["row", [
                            ["style-row", [["buyable", 14]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 4]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 3]], {width: "140px", height: "140px"}],
                            ["style-row", [["buyable", 13]], {width: "140px", height: "140px"}],
                        ]],
                    ], () => {return player.h.stage.eq(6) && layers.hrm.layerShown() ? {} : {display: "none !important"}}],
                    ["style-column", [
                        ["row", [
                            ["style-row", [["upgrade", 166]], {width: "140px", height: "140px", marginLeft: "35px", marginRight: "35px"}],
                            ["upgrade", 151],
                            ["bt-upgrade", 152],
                            ["upgrade", 153],
                            ["bt-upgrade", 154],
                        ]],
                        ["row", [
                            ["style-row", [["upgrade", 167]], {width: "105px", height: "140px"}],
                            ["style-row", [["upgrade", 165]], {width: "105px", height: "140px"}],
                            ["bt-upgrade", 161],
                            ["upgrade", 162],
                            ["upgrade", 163],
                            ["upgrade", 164],
                        ]],
                        ["row", [
                            ["style-row", [["bt-upgrade", 168]], {width: "140px", height: "140px", marginLeft: "35px", marginRight: "35px"}],
                            ["upgrade", 171],
                            ["bt-upgrade", 172],
                            ["upgrade", 173],
                            ["upgrade", 174],
                        ]],
                    ], () => {return player.h.stage.gte(7) ? {} : {display: "none !important"}}],
                ],
            },
            "Vigors": {
                buttonStyle() { return {borderColor: "#5e0000", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["raw-html", () => {return "You have <h3>" + formatWhole(player.hpw.totalPower) + "</h3> total power." }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                    ["blank", "10px"],
                    ["milestone", 1],
                    ["milestone", 2],
                    ["milestone", 3],
                    ["milestone", 4],
                    ["milestone", 5],
                    ["milestone", 6],
                    ["milestone", 7],
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
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return player.h.stageName[0] + " of Power"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#4c1919", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["tooltip-row", [
            ["raw-html", () => {return "You have <h3>" + formatWhole(player.hpw.power) + "</h3> Power." }, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return "(+" + formatWhole(player.hpw.powerGain) + ")"}, () => {
                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage)) ? look.color = "white" : look.color = "gray"
                return look
            }],
            ["raw-html", () => {
                let str = "<div class='bottomTooltip'>Base Formula<hr><small>2^(log" + formatWhole(player.h.stage) + "(Blessings/" + formatWhole(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage)) + "))/" + formatSimple(Decimal.pow(2, player.h.stage.sub(6).abs())) + "</small>"
                if (player.h.stage.eq(6)) str = "<div class='bottomTooltip'>Base Formula<hr><small>2^(log" + formatWhole(player.h.stage) + "(Blessings/" + formatWhole(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage)) + "))</small>"
                if (player.hpw.softcap.gt(1)) str = str.concat("<br><small>[SOFTCAP: (((Power/" + formatWhole(Decimal.pow10(player.h.stage.mul(10))) + ")^0.3)/" + formatWhole(player.h.stage) + ")+1]</small>")
                return str.concat("</div>")
            }],
        ]],
        ["raw-html", () => {return player.hpw.softcap.gt(1) ? "UNAVOIDABLE SOFTCAP: /" + format(player.hpw.softcap) + " to gain." : ""}, {color: "red", fontSize: "16px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "5px"],
        ["microtabs", "power", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return hasUpgrade("i", 30) }, // Decides if this node is shown or not.
    hotkeys: [
        {
            key: "w", 
            description: "Amplify Power",
            onPress() {
                clickClickable(this.layer, 1)
            },
        }
	]
});
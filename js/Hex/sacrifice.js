addLayer("hsa", {
    name() {return player.h.stageName[0] + " of Sacrifice"},
    symbol: "Sa", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Sacrifice", // Decides the nodes tooltip
    color: "#fffdd0", // Decides the nodes color.
    nodeStyle: {background: "linear-gradient(180deg, #fffdd0, #fdfff6)", borderColor: "#7F7E68"}, // Decides the nodes style, in CSS format.
    branches: ["hpr"], // Decides the nodes branches.
    startData() { return {
        autoSac: -1,
        holyPower: new Decimal(0),
        holyPowerGain: new Decimal(0),
        dimensionAmounts: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        dimensionsPerSecond: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],

        sacredEnergy: new Decimal(0),
        sacredEnergyPerSecond: new Decimal(0),
        sacredEffect: new Decimal(0),
        sacredEffect2: new Decimal(1),

        prayerTime: new Decimal(0),
        prayerMult: new Decimal(1),
        prayerDecay: new Decimal(0),
        praying: false,
        prayTimeCheck: new Decimal(0),
        prayPercent: new Decimal(0),

        dimMax: false,
    }},
    update(delta) {
        let step = Decimal.div(1, player.h.stage.pow(2))
        player.hsa.holyPowerGain = new Decimal(0)
        if (player.hpr.rank[0].gt(0)) player.hsa.holyPowerGain = player.hpr.rank[0].pow(0.5).div(10)
        if (player.hpr.rank[1].gt(0)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(player.hpr.rank[1].pow(Decimal.add(0.5, step)).div(5).add(1))
        if (player.hpr.rank[2].gt(0)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(player.hpr.rank[2].pow(Decimal.add(0.5, step.mul(2))).div(2).add(1))
        if (player.hpr.rank[3].gt(0)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(player.hpr.rank[3].pow(Decimal.add(0.5, step.mul(3))).add(1))
        if (player.hpr.rank[4].gt(0)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(player.hpr.rank[4].pow(Decimal.add(0.5, step.mul(4))).mul(2).add(1))
        if (player.hpr.rank[5].gt(0)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(player.hpr.rank[5].pow(Decimal.add(0.5, step.mul(5))).mul(4).add(1))
        if (hasUpgrade("hsa", 11)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(2)
        if (hasUpgrade("hsa", 16)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.mul(upgradeEffect("hsa", 16))

        if (hasUpgrade("hsa", 13)) player.hsa.holyPowerGain = player.hsa.holyPowerGain.pow(upgradeEffect("hsa", 13))

        player.hsa.holyPower = player.hsa.holyPower.add(player.hsa.holyPowerGain.mul(buyableEffect("hsa", 2).sub(1)).mul(delta))

        if (player.hsa.autoSac == true) {
            player.hsa.holyPower = player.hsa.holyPower.add(player.hsa.holyPowerGain)

            // RESET CODE
            for (let i = 0; i < 6; i++) {
                player.hpr.rank[i] = new Decimal(0)
                player.hpr.rankGain[i] = new Decimal(0)
                player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
            }
            player.h.hexPointGain = new Decimal(0)
            player.h.hexPoint = new Decimal(0)
        }

        // SACRED ENERGY
        player.hsa.sacredEnergyPerSecond = player.hsa.dimensionAmounts[0]
            .mul(buyableEffect("hsa", 11))
            .mul(player.hsa.prayerMult)
        if (hasUpgrade("hsa", 12)) player.hsa.sacredEnergyPerSecond = player.hsa.sacredEnergyPerSecond.mul(upgradeEffect("hsa", 12))
        if (hasUpgrade("hsa", 21)) player.hsa.sacredEnergyPerSecond = player.hsa.sacredEnergyPerSecond.mul(upgradeEffect("hsa", 21))

        player.hsa.sacredEnergy = player.hsa.sacredEnergy.add(player.hsa.sacredEnergyPerSecond.mul(delta))

        // Dimension Gain
        for (let i = 0; i < player.hsa.dimensionAmounts.length-1; i++) {
            player.hsa.dimensionsPerSecond[i] = player.hsa.dimensionAmounts[i+1]
            .mul(buyableEffect("hsa", i+12))
            .mul(player.hsa.prayerMult)

            // Dimension Softcap
            if (player.hsa.dimensionsPerSecond[i].gt(1e300)) player.hsa.dimensionsPerSecond[i] = player.hsa.dimensionsPerSecond[i].div(1e300).pow(0.95).mul(1e300)
        }
        if (hasUpgrade("hsa", 22)) player.hsa.dimensionsPerSecond[0] = player.hsa.dimensionsPerSecond[0].mul(upgradeEffect("hsa", 22))
        if (hasUpgrade("hsa", 23)) player.hsa.dimensionsPerSecond[1] = player.hsa.dimensionsPerSecond[1].mul(upgradeEffect("hsa", 23))
        if (hasUpgrade("hsa", 24)) player.hsa.dimensionsPerSecond[2] = player.hsa.dimensionsPerSecond[2].mul(upgradeEffect("hsa", 24))
        if (hasUpgrade("hsa", 25)) player.hsa.dimensionsPerSecond[3] = player.hsa.dimensionsPerSecond[3].mul(upgradeEffect("hsa", 25))
        if (hasUpgrade("hsa", 26)) player.hsa.dimensionsPerSecond[4] = player.hsa.dimensionsPerSecond[4].mul(upgradeEffect("hsa", 26))

        // Dimension Per Second Calc
        for (let i = 0; i < player.hsa.dimensionAmounts.length; i++) {
            player.hsa.dimensionAmounts[i] = player.hsa.dimensionAmounts[i].add(player.hsa.dimensionsPerSecond[i].mul(delta))
        }

        player.hsa.sacredEffect = player.hsa.sacredEnergy.add(1).log(player.h.stage).div(10).add(1).min(6)
        if (player.hsa.sacredEffect.gt(2)) player.hsa.sacredEffect = player.hsa.sacredEffect.sub(2).div(2).add(2).min(6)
        if (player.hsa.sacredEffect.gt(3)) player.hsa.sacredEffect = player.hsa.sacredEffect.sub(3).div(2).add(3).min(6)
        if (player.hsa.sacredEffect.gt(4)) player.hsa.sacredEffect = player.hsa.sacredEffect.sub(4).div(2).add(4).min(6)
        if (player.hsa.sacredEffect.gt(5)) player.hsa.sacredEffect = player.hsa.sacredEffect.sub(5).div(2).add(5).min(6)

        player.hsa.sacredEffect2 = Decimal.pow(1.5, player.hsa.sacredEnergy.add(1).log(player.h.stage))

        if (player.hsa.prayTimeCheck.gt(0)) {
            player.hsa.praying = true
            player.hsa.prayTimeCheck = player.hsa.prayTimeCheck.sub(delta)
        } else {
            player.hsa.praying = false
        }

        player.hsa.prayerTime = player.hsa.prayerTime.add(buyableEffect("hsa", 1).sub(1).mul(delta))
        if (player.hsa.praying) {
            player.hsa.prayerTime = player.hsa.prayerTime.add(delta)
        } else if (player.hsa.prayerTime.gt(0)) {
            player.hsa.prayerTime = player.hsa.prayerTime.sub(player.hsa.prayerDecay.mul(delta)).max(0)
        }

        let prayDist = player.h.stage
        if (hasUpgrade("hsa", 14)) prayDist = prayDist.sub(1).div(upgradeEffect("hsa", 14)).add(1)

        player.hsa.prayerMult = Decimal.affordArithmeticSeries(player.hsa.prayerTime, prayDist, prayDist, 0).div(3).add(1)
        player.hsa.prayerDecay = Decimal.affordArithmeticSeries(player.hsa.prayerTime, prayDist, prayDist, 0).pow(0.7).div(20).add(0.05)
        player.hsa.prayPercent = player.hsa.prayerTime.sub(Decimal.sumArithmeticSeries(Decimal.affordArithmeticSeries(player.hsa.prayerTime, prayDist, prayDist, 0), prayDist, prayDist, 0)).div(Decimal.sumArithmeticSeries(1, prayDist, prayDist, Decimal.affordArithmeticSeries(player.hsa.prayerTime, prayDist, prayDist, 0)))
    },
    clickables: {
        1: {
            title: "<h2>Sacrifice your provenances for holy power.</h2><br><h3>Req: 1 β-Provenance</h3>",
            canClick() { return player.hpr.rank[1].gte(1)},
            unlocked: true,
            onClick() {
                player.hsa.holyPower = player.hsa.holyPower.add(player.hsa.holyPowerGain)

                // RESET CODE
                for (let i = 0; i < 6; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style: {width: "400px", minHeight: "100px", color: "rgba(0,0,0,0.6)", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "15px"},
        },
        2: {
            title() { return "Buy Max On" },
            canClick() { return player.hsa.dimMax == false },
            unlocked() { return true },
            onClick() {
                player.hsa.dimMax = true
            },
            style: {width: "80px", minHeight: "50px", color: "rgba(0,0,0,0.6)", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "10px 0 0 10px"},
        },
        3: {
            title() { return "Buy Max Off" },
            canClick() { return player.hsa.dimMax == true},
            unlocked() { return true },
            onClick() {
                player.hsa.dimMax = false
            },
            style: {width: "80px", minHeight: "50px", color: "rgba(0,0,0,0.6)", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "0px", margin: "-2px"},
        },
        4: {
            title() { return "Max All" },
            canClick() { return true },
            unlocked() { return true },
            onClick() {
                player.hsa.dimMax = true
                buyBuyable("hsa", 11)
                buyBuyable("hsa", 12)
                buyBuyable("hsa", 13)
                buyBuyable("hsa", 14)
                buyBuyable("hsa", 15)
                buyBuyable("hsa", 16)
            },
            style: {width: "125px", minHeight: "50px", color: "rgba(0,0,0,0.6)", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "0px 10px 10px 0px"},
        },
        5: {
            title() {return player.hsa.autoSac == -1 ? "<h3>Unlock Auto Sacrifice</h3><br>Costs: " + formatWhole(player.h.stage.pow(3)) + " Holy Power" : player.hsa.autoSac ? "<h3>Auto Sacrifice</h3><br>[ENABLED]" : "<h3>Auto Sacrifice</h3><br>[DISABLED]"},
            canClick() {return player.hsa.autoSac == -1 ? player.hsa.holyPower.gte(player.h.stage.pow(3)) : true},
            unlocked: true,
            tooltip: "Automatically sacrifices when possible.",
            onClick() {
                if (player.hsa.autoSac == -1) {
                    player.hsa.holyPower = player.hsa.holyPower.sub(player.h.stage.pow(3))
                    player.hsa.autoSac = false
                } else if (player.hsa.autoSac) {
                    player.hsa.autoSac = false
                } else {
                    player.hsa.autoSac = true
                }
            },
            style() {
                let look = {width: "300px", minHeight: "80px", color: "rgba(0,0,0,0.6)", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "15px"}
                look.background = !this.canClick() ? "#bf8f8f" : player.hsa.autoSac ? "#fffdd0" : "#cccaa6"
                return look
            },
        },
        100: {
            title() {
                let curTime = buyableEffect("hsa", 1).sub(1)
                if (player.hsa.praying) curTime = curTime.add(1)
                if (!player.hsa.praying && player.hsa.prayerTime.gt(0)) curTime = curTime.sub(player.hsa.prayerDecay)
                let str = "<h3>Pray to speed up holy dimensions</h3><br>x" + formatSimple(player.hsa.prayerMult) + " holy dimension tickspeed<br>Prayer Time: " + formatTime(player.hsa.prayerTime)
                if (curTime.gt(0.01)) str = str.concat("<small style='color:rgba(0,100,0,0.6)'> (+" + formatTime(curTime) + ")</small>")
                if (curTime.lt(-0.01)) str = str.concat("<small style='color:rgba(100,0,0,0.6)'> (-" + formatTime(curTime.mul(-1)) + ")</small>")
                return str
            },
            canClick: true,
            unlocked: true,
            onClick() {player.hsa.prayTimeCheck = new Decimal(0.5)},
            onHold() {player.hsa.prayTimeCheck = new Decimal(0.5)},
            style() {
                return {background: `linear-gradient(to right, #fffdd0 ${format(player.hsa.prayPercent.mul(100).min(100))}%, #cccaa6 ${format(player.hsa.prayPercent.mul(100).add(0.25).min(100))}%)`, width: "400px", minHeight: "80px", color: "rgba(0,0,0,0.6)", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "15px"}
            },
        },
    },
    upgrades: {
        11: {
            title: "Simplicity",
            unlocked: true,
            description() {return "Double holy power gain."},
            cost() {return player.h.stage.div(2).pow(2)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        12: {
            title: "Clarity",
            unlocked: true,
            description: "Total holy upgrades buff sacred energy gain.",
            cost() {return player.h.stage.div(2).pow(3)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return Decimal.pow(1.3, player.hsa.upgrades.length)
            },
            effectDisplay() {return "x" + formatSimple(upgradeEffect(this.layer, this.id)) },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        13: {
            title: "Coherence",
            unlocked: true,
            description() {return "Sacred energy buffs holy power gain"},
            cost() {return player.h.stage.div(2).pow(5)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hsa.sacredEnergy.add(1).log(player.h.stage).div(player.h.stage.pow(3)).add(1)
            },
            effectDisplay() {return "^" + formatSimple(upgradeEffect(this.layer, this.id), 3) },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        14: {
            title: "Perspicuity",
            unlocked: true,
            description() {return "Reduce base prayer requirement based on holy power"},
            cost() {return player.h.stage.div(2).pow(10)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return Decimal.pow(1.1, player.hsa.holyPower.add(1).log(player.h.stage).sub(5).max(0))
            },
            effectDisplay() {return "/" + formatSimple(upgradeEffect(this.layer, this.id)) },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        15: {
            title: "Directness",
            unlocked: true,
            description() {return "Improve the base of sacred energies 2nd effect by 20%"},
            cost() {return player.h.stage.div(2).pow(16)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        16: {
            title: "Lucidity",
            unlocked: true,
            description() {return "Holy power is boosted based on power"},
            cost() {return player.h.stage.div(2).pow(24)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hpw.power.add(1).pow(0.06)
            },
            effectDisplay() {return "x" + formatSimple(upgradeEffect(this.layer, this.id)) },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        21: {
            title: "Aware",
            unlocked: true,
            description() {return "α Provenance boosts the 1st holy dimension."},
            cost() {return player.h.stage.mul(player.h.stage.div(2))},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hpr.rank[0].pow(Decimal.div(1, player.h.stage)).max(1)
            },
            effectDisplay() {return "x" + formatSimple(upgradeEffect(this.layer, this.id))},
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        22: {
            title: "Alert",
            unlocked: true,
            description: "Refinements boost the 2nd holy dimension.",
            cost() {return player.h.stage.pow(2).mul(player.h.stage.div(2))},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hre.refinement.div(player.h.stage).add(1)
            },
            effectDisplay() {return "x" + formatSimple(upgradeEffect(this.layer, this.id))},
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        23: {
            title: "Cognizant",
            unlocked: true,
            description: "Blessings boost the 3rd holy dimension.",
            cost() {return player.h.stage.pow(5)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hbl.blessings.add(1).log(player.h.stage).div(player.h.stage.div(2)).add(1)
            },
            effectDisplay() {return "x" + formatSimple(upgradeEffect(this.layer, this.id))},
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        24: {
            title: "Attentive",
            unlocked: true,
            description: "Jinx score boosts the 4th holy dimension.",
            cost() {return player.h.stage.pow(8)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hcu.jinxTotal.pow(0.5).div(player.h.stage.pow(2)).add(1)
            },
            effectDisplay() {return "x" + formatSimple(upgradeEffect(this.layer, this.id)) },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        25: {
            title: "Mindful",
            unlocked: true,
            description() {return "Purities boost the 5th holy dimension"},
            cost() {return player.h.stage.pow(12)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return player.hpu.totalPurity.div(player.h.stage).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        26: {
            title: "Conscious",
            unlocked: true,
            description() {return "Total mights above " + formatWhole(player.h.stage.pow(2)) + " boosts the 6th holy dimension."},
            cost() {return player.h.stage.pow(20)},
            currencyLocation() { return player.hsa },
            currencyDisplayName: "Holy Power",
            currencyInternalName: "holyPower",
            effect() {
                return Decimal.sub(player.hpw.upgTotal.max(player.h.stage.pow(2)), player.h.stage.pow(2)).div(5).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            style: {color: "rgba(0,0,0,0.6)", borderColor: "rgba(0,0,0,0.6)", borderRadius: "15px", margin: "2px"},
        },
        // Top: Regular buffs to resources
        // Bottom: Buff to each dimension's gains based on external resources
    },
    buyables: {
        1: {
            costBase() { return player.h.stage.pow(4) },
            costGrowth() { return player.h.stage },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Auto Pray"
            },
            display() {
                return "which are granting you +" + formatTime(tmp[this.layer].buyables[this.id].effect.sub(1)) + " pray time per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Holy Power"
            },
            buy(mult) {
                if (mult != true ) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: { width: '275px', height: '150px', backgroundOrigin: "border-box"},
        },
        2: {
            costBase() { return player.h.stage.pow(8) },
            costGrowth() { return player.h.stage.pow(2) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(25).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Holy Gains"
            },
            display() {
                return "which are granting you +" + formatWhole(tmp[this.layer].buyables[this.id].effect.sub(1).mul(100)) + "% holy power per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Holy Power"
            },
            buy(mult) {
                if (mult != true ) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: { width: '275px', height: '150px', backgroundOrigin: "border-box"},
        },
        11: {
            costBase() { return new Decimal(1) },
            costGrowth() { return player.h.stage.div(2) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " HP"
            },
            buy() {
                if (player.hsa.dimMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.hsa.dimensionAmounts[0] = player.hsa.dimensionAmounts[0].add(1)
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.hsa.dimensionAmounts[0] = player.hsa.dimensionAmounts[0].add(max)
                }
            },
            style: {width: "175px", height: "50px", color: "rgba(0,0,0,0.6)", borderRadius: "10px"},
        },
        12: {
            costBase() { return player.h.stage },
            costGrowth() { return player.h.stage.div(2).pow(2) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " HP"
            },
            buy() {
                if (player.hsa.dimMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.hsa.dimensionAmounts[1] = player.hsa.dimensionAmounts[1].add(1)
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.hsa.dimensionAmounts[1] = player.hsa.dimensionAmounts[1].add(max)
                }
            },
            style: {width: "175px", height: "50px", color: "rgba(0,0,0,0.6)", borderRadius: "10px"},
        },
        13: {
            costBase() { return player.h.stage.pow(3) },
            costGrowth() { return player.h.stage.div(2).pow(3) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " HP"
            },
            buy() {
                if (player.hsa.dimMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.hsa.dimensionAmounts[2] = player.hsa.dimensionAmounts[2].add(1)
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.hsa.dimensionAmounts[2] = player.hsa.dimensionAmounts[2].add(max)
                }
            },
            style: {width: "175px", height: "50px", color: "rgba(0,0,0,0.6)", borderRadius: "10px"},
        },
        14: {
            costBase() { return player.h.stage.pow(6) },
            costGrowth() { return player.h.stage.div(2).pow(4) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " HP"
            },
            buy() {
                if (player.hsa.dimMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.hsa.dimensionAmounts[3] = player.hsa.dimensionAmounts[3].add(1)
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.hsa.dimensionAmounts[3] = player.hsa.dimensionAmounts[3].add(max)
                }
            },
            style: {width: "175px", height: "50px", color: "rgba(0,0,0,0.6)", borderRadius: "10px"},
        },
        15: {
            costBase() { return player.h.stage.pow(10) },
            costGrowth() { return player.h.stage.div(2).pow(5) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " HP"
            },
            buy() {
                if (player.hsa.dimMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.hsa.dimensionAmounts[4] = player.hsa.dimensionAmounts[4].add(1)
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.hsa.dimensionAmounts[4] = player.hsa.dimensionAmounts[4].add(max)
                }
            },
            style: {width: "175px", height: "50px", color: "rgba(0,0,0,0.6)", borderRadius: "10px"},
        },
        16: {
            costBase() { return player.h.stage.pow(15) },
            costGrowth() { return player.h.stage.div(2).pow(6) },
            currency() { return player.hsa.holyPower},
            pay(amt) { player.hsa.holyPower = this.currency().sub(amt) },
            effect(x) { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " HP"
            },
            buy() {
                if (player.hsa.dimMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.hsa.dimensionAmounts[5] = player.hsa.dimensionAmounts[5].add(1)
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.hsa.dimensionAmounts[5] = player.hsa.dimensionAmounts[5].add(max)
                }
            },
            style: {width: "175px", height: "50px", color: "rgba(0,0,0,0.6)", borderRadius: "10px"},
        },
    },
    microtabs: {
        stuff: {
            "Holy Dimensions": {
                buttonStyle() {return {color: "#fffdd0", background: "rgba(0,0,0,0.3)", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["row", [
                        ["raw-html", () => {return "You have <h3>" + format(player.hsa.sacredEnergy) + "</h3> sacred energy." }, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(+" + format(player.hsa.sacredEnergyPerSecond) + "/s)" }, () => {
                            let look = {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                            player.hsa.sacredEnergyPerSecond.gt(0) ? look.color = "rgba(0,0,0,0.6)" : look.color = "rgba(100,100,100,0.6)"
                            return look
                        }],
                    ]],
                    ["row", [
                        ["raw-html", () => {return "Boosts " + player.h.stageName[1] + " point softcap exponent by x" + format(player.hsa.sacredEffect, 3) }, {color: "rgba(0,0,0,0.6)", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            return player.hsa.sacredEffect.gte(6) ? "[HARDCAPPED]" :
                            player.hsa.sacredEffect.gte(5) ? "[SOFTCAPPED<sup>4</sup>]" :
                            player.hsa.sacredEffect.gte(4) ? "[SOFTCAPPED<sup>3</sup>]" :
                            player.hsa.sacredEffect.gte(3) ? "[SOFTCAPPED<sup>2</sup>]" :
                            player.hsa.sacredEffect.gte(2) ? "[SOFTCAPPED]" :
                            ""
                        }, {color: "rgba(255,0,0,0.6)", fontSize: "16px", fontFamily: "monospace", marginLeft: "10px"}],
                    ]],
                    ["row", [
                        ["raw-html", () => {return "Boosts " + player.h.stageName[1] + " point gain after softcap by x" + formatSimple(player.hsa.sacredEffect2) }, {color: "rgba(0,0,0,0.6)", fontSize: "16px", fontFamily: "monospace"}],
                        //["raw-html", () => {return player.hsa.sacredEffect.gte(0.6) ? "[HARDCAPPED]" : player.hsa.sacredEffect.gte(0.5) ? "[SOFTCAPPED<sup>2</sup>]" : player.hsa.sacredEffect.gte(0.3) ? "[SOFTCAPPED]" : "" }, {color: "rgba(255,0,0,0.6)", fontSize: "16px", fontFamily: "monospace", marginLeft: "10px"}],
                    ]],
                    ["blank", "10px"],
                    ["clickable", 100],
                    ["blank", "10px"],
                    ["row", [["clickable", 2], ["clickable", 3], ["clickable", 4]]],
                    ["blank", "10px"],
                    ["row", [
                        ["style-row", [
                            ["raw-html", () => {return "1st dimension (" + format(buyableEffect("hsa", 11)) + "x): " + format(player.hsa.dimensionAmounts[0]) + " (+" + format(player.hsa.dimensionsPerSecond[0]) + "/s)"}, { color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace" }]
                        ], {width: "700px"}], 
                        ["buyable", 11],
                    ]],
                    ["row", [
                        ["style-row", [
                            ["raw-html", () => {return "2nd dimension (" + format(buyableEffect("hsa", 12)) + "x): " + format(player.hsa.dimensionAmounts[1]) + " (+" + format(player.hsa.dimensionsPerSecond[1]) + "/s)"}, { color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace" }]
                        ], {width: "700px"}], 
                        ["buyable", 12],
                    ]],
                    ["row", [
                        ["style-row", [
                            ["raw-html", () => {return "3rd dimension (" + format(buyableEffect("hsa", 13)) + "x): " + format(player.hsa.dimensionAmounts[2]) + " (+" + format(player.hsa.dimensionsPerSecond[2]) + "/s)"}, { color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace" }]
                        ], {width: "700px"}], 
                        ["buyable", 13],
                    ]],
                    ["row", [
                        ["style-row", [
                            ["raw-html", () => {return "4th dimension (" + format(buyableEffect("hsa", 14)) + "x): " + format(player.hsa.dimensionAmounts[3]) + " (+" + format(player.hsa.dimensionsPerSecond[3]) + "/s)"}, { color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace" }]
                        ], {width: "700px"}], 
                        ["buyable", 14],
                    ]],
                    ["row", [
                        ["style-row", [
                            ["raw-html", () => {return "5th dimension (" + format(buyableEffect("hsa", 15)) + "x): " + format(player.hsa.dimensionAmounts[4]) + " (+" + format(player.hsa.dimensionsPerSecond[4]) + "/s)"}, { color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace" }]
                        ], {width: "700px"}], 
                        ["buyable", 15],
                    ]],
                    ["row", [
                        ["style-row", [
                            ["raw-html", () => {return "6th dimension (" + format(buyableEffect("hsa", 16)) + "x): " + format(player.hsa.dimensionAmounts[5]) + " (+" + format(player.hsa.dimensionsPerSecond[5]) + "/s)"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace" }]
                        ], {width: "700px"}], 
                        ["buyable", 16],
                    ]],
                ],
            },
            "Holy Upgrades": {
                buttonStyle() {return {color: "#fffdd0", background: "rgba(0,0,0,0.3)", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-row", [
                        ["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15], ["upgrade", 16],
                        ["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24], ["upgrade", 25], ["upgrade", 26],
                    ], {maxWidth: "800px"}],
                ],
            },
            "Automation": {
                buttonStyle() {return {color: "#fffdd0", background: "rgba(0,0,0,0.3)", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["clickable", 5],
                    ["blank", "25px"],
                    ["row", [["ex-buyable", 1], ["blank", ["10px", "10px"]], ["ex-buyable", 2]]],
                    ["blank", "25px"],
                    ["style-row", [
                        ["raw-html", "Automation is kept on power resets", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                    ], {width: "450px", height: "40px", background: "#cccaa6", border: "2px solid rgba(0,0,0,0.6)", borderRadius: "20px"}],
                ],
            },
        },
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "rgba(255,0,0,0.6)", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return player.h.stageName[0] + " of Sacrifice"}, {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", background: "linear-gradient(90deg, #fffdd0, #fdfff6)", border: "3px solid #ccc", borderRadius: "20px"}],
        ["blank", "10px"],
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.hsa.holyPower) + "</h3> holy power." }, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return "(+" + format(player.hsa.holyPowerGain) + ")" }, () => {
                let look = {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hpr.rank[1].gt(0) ? look.color = "rgba(0,0,0,0.6)" : look.color = "rgba(100,100,100,0.6)"
                return look
            }],
        ]],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "10px"],
        ["microtabs", "stuff", { 'border-width': '0px' }],
        ["blank", "25px"],
    ],
    layerShown() { return inChallenge("hrm", 14)}, // Decides if this node is shown or not.
});
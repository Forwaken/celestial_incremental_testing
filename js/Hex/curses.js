addLayer("hcu", {
    name() {return HEX_STAGES[player.h.stage][0] + " of Curses"},
    symbol: "Cu", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Curses", // Decides the nodes tooltip
    nodeStyle: {background: "linear-gradient(140deg, #b2d8d8 0%, #8eacac 100%)", backgroundOrigin: "borderBox", borderColor: "#596c6c"},
    color: "#b2d8d8", // Decides the nodes color.
    branches: ["hbl"], // Decides the nodes branches.
    startData() { return {
        curses: new Decimal(0),
        cursesGain: new Decimal(0),
        jinxTotal: new Decimal(0),
        jinxAddCap: new Decimal(0),
        jinxDiv: new Decimal(1),
    }},
    automate() {
        if (hasMilestone("hre", 13) && !inChallenge("hrm", 15)) {
            for (let i = 101; i < 113; i++) {
                buyMaxExBuyable("hcu", i)
            }
        }
    },
    update(delta) {
        player.hcu.cursesGain = new Decimal(0)
        if (hasUpgrade("ta", 16)) player.hcu.cursesGain = player.hbl.blessings.add(1).log(player.h.stage)
        if (hasUpgrade("ta", 16) && inChallenge("hrm", 13)) player.hcu.cursesGain = Decimal.pow(player.hve.vexTotal.mul(0.2).add(player.h.stage.mul(3)), player.hbl.blessings.add(1).log(player.h.stage)).sub(1).min(Decimal.pow(10, player.h.stage.mul(5)))
        if (hasUpgrade("ta", 16) && hasMilestone("hre", 9)) player.hcu.cursesGain = player.hcu.cursesGain.add(player.h.stage.div(10))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("hcu", 101))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("hcu", 103))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("hcu", 105))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("ta", 49))
        if (hasUpgrade("hbl", 4)) player.hcu.cursesGain = player.hcu.cursesGain.mul(upgradeEffect("hbl", 4))
        if (hasUpgrade("hpw", 22)) player.hcu.cursesGain = player.hcu.cursesGain.mul(upgradeEffect("hpw", 22))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("g", 27))
        if (hasUpgrade("ep2", 17)) player.hcu.cursesGain = player.hcu.cursesGain.mul(upgradeEffect("ep2", 17))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(player.h.prePowerMult)

        // CURSE EXPONENT
        player.hcu.cursesGain = player.hcu.cursesGain.pow(buyableEffect("hcu", 106))
        if (hasUpgrade("hve", 63)) player.hcu.cursesGain = player.hcu.cursesGain.pow(1.03)
        if (hasUpgrade("hpw", 102)) player.hcu.cursesGain = player.hcu.cursesGain.pow(upgradeEffect("hpw", 102))

        // SOFTCAPS AND PER SECOND
        if (inChallenge("hrm", 12)) player.hcu.cursesGain = player.hcu.cursesGain.pow(Decimal.div(3.6, player.h.stage))
        if (player.hcu.cursesGain.gte(Decimal.pow(10, player.h.stage.mul(2)))) player.hcu.cursesGain = player.hcu.cursesGain.div(Decimal.pow(10, player.h.stage.mul(2))).pow(Decimal.div(3.6, player.h.stage)).mul(Decimal.pow(10, player.h.stage.mul(2)))
        if (player.hcu.cursesGain.gte(Decimal.pow(1e100, player.h.stage.mul(2)))) player.hcu.cursesGain = player.hcu.cursesGain.div(Decimal.pow(1e100, player.h.stage.mul(2))).pow(0.1).mul(Decimal.pow(1e100, player.h.stage.mul(2)))
        player.hcu.curses = player.hcu.curses.add(player.hcu.cursesGain.mul(delta))

        // JINX TOTAL
        player.hcu.jinxTotal = new Decimal(0)
        for (let i = 101; i < 113; i++) {
            player.hcu.jinxTotal = player.hcu.jinxTotal.add(getBuyableAmount("hcu", i))
            if (tmp["hcu"].buyables[i].extraAmount != null) player.hcu.jinxTotal = player.hcu.jinxTotal.add(tmp["hcu"].buyables[i].extraAmount)
        }
        player.hcu.jinxTotal = player.hcu.jinxTotal.mul(player.hve.vexEffects[1])
        player.hcu.jinxTotal = player.hcu.jinxTotal.mul(levelableEffect("pet", 109)[1])
        if (hasUpgrade("hsa", 25)) player.hcu.jinxTotal = player.hcu.jinxTotal.mul(2)

        // JINX ADD CAP
        player.hcu.jinxAddCap = new Decimal(0)
        if (hasUpgrade("hbl", 1)) player.hcu.jinxAddCap = player.hcu.jinxAddCap.add(upgradeEffect("hbl", 1))
        if (hasMilestone("hbl", 3)) player.hcu.jinxAddCap = player.hcu.jinxAddCap.add(player.h.stage)
        if (hasUpgrade("hpw", 33)) player.hcu.jinxAddCap = player.hcu.jinxAddCap.add(upgradeEffect("hpw", 33))
        player.hcu.jinxAddCap = player.hcu.jinxAddCap.add(player.hve.vexEffects[0])
        if (inChallenge("hrm", 15)) player.hcu.jinxAddCap = player.hcu.jinxAddCap.div(2)

        // JINX DIVIDER
        player.hcu.jinxDiv = new Decimal(1)
        player.hcu.jinxDiv = player.hcu.jinxDiv.mul(buyableEffect("hcu", 104))
    },
    clickables: {
        1: {
            title: "<h3>Buy Max Jinxes</h3>",
            canClick() {
                let can = false
                for (let i = 101; i < 113; i++) {
                    if (canBuyBuyable("hcu", i)) can = true
                }
                return can
            },
            unlocked: true,
            onClick() {
                for (let i = 101; i < 113; i++) {
                    buyMaxExBuyable("hcu", i)
                }
            },
            style: {width: "200px", minHeight: "40px", borderRadius: "15px"},
        },
    },
    buyables: {
        101: {
            purchaseLimit() { return new Decimal(player.h.stage.mul(5)).add(player.hcu.jinxAddCap) },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 21)) amt = amt.add(3)
                return amt
            },
            effectBase() {
                let base = new Decimal(2).add(buyableEffect("hcu", 102))
                if (inChallenge("hrm", 12)) base = base.pow(player.hpu.purifiers[5].effect)
                return base
            },
            effect(x) { return Decimal.pow(this.effectBase(), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)) },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(5))) {
                    return Decimal.pow(player.h.stage, x).mul(player.h.stage).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(10))) {
                    return Decimal.pow(player.h.stage.pow(2), x).mul(Decimal.pow(player.h.stage, player.h.stage.mul(5).sub(1)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(player.h.stage.pow(3), x).mul(Decimal.pow(player.h.stage.pow(2), player.h.stage.mul(7.5).sub(0.5)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Α-Jinx" },
            display() { return "Curses are multiplied by " + format(this.effectBase()) },
            total() { return "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)" },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(player.h.stage, player.hcu.jinxDiv), player.h.stage, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(player.h.stage, player.hcu.jinxDiv), player.h.stage, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(5))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(player.h.stage, player.h.stage.mul(5).sub(1)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(2), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(player.h.stage, player.h.stage.mul(5).sub(1)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(2), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(10))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(player.h.stage.pow(2), player.h.stage.mul(7.5).sub(0.5)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(3), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(player.h.stage.pow(2), player.h.stage.mul(7.5).sub(0.5)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(3), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        102: {
            purchaseLimit() { return new Decimal(player.h.stage.mul(5)).add(player.hcu.jinxAddCap) },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 22)) amt = amt.add(9)
                return amt
            },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (amt.gte(100)) return Decimal.mul(0.01, amt).add(9)
                return Decimal.mul(0.1, amt)
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(5))) {
                    return Decimal.pow(player.h.stage.mul(2), x).mul(player.h.stage.mul(2)).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(10))) {
                    return Decimal.pow(player.h.stage.mul(2).pow(2), x).mul(Decimal.pow(player.h.stage.mul(2), player.h.stage.mul(5).sub(1)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(player.h.stage.mul(2).pow(3), x).mul(Decimal.pow(player.h.stage.mul(2).pow(2), player.h.stage.mul(7.5).sub(0.5)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Β-Jinx" },
            display() {
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (amt.gte(100)) return "Increase Α-Jinx's effect by +0.01x<br><small style='color:red'>[SOFTCAPPED]</small>"
                return "Increase Α-Jinx's effect by +0.1x"
            },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)" },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(player.h.stage.mul(2), player.hcu.jinxDiv), player.h.stage.mul(2), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(player.h.stage.mul(2), player.hcu.jinxDiv), player.h.stage.mul(2), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(5))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(player.h.stage.mul(2), player.h.stage.mul(5).sub(1)).recip().div(player.hcu.jinxDiv), player.h.stage.mul(2).pow(2), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(player.h.stage.mul(2), player.h.stage.mul(5).sub(1)).recip().div(player.hcu.jinxDiv), player.h.stage.mul(2).pow(2), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(10))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(player.h.stage.mul(2).pow(2), player.h.stage.mul(7.5).sub(0.5)).recip().div(player.hcu.jinxDiv), player.h.stage.mul(2).pow(3), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(player.h.stage.mul(2).pow(2), player.h.stage.mul(7.5).sub(0.5)).recip().div(player.hcu.jinxDiv), player.h.stage.mul(2).pow(3), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        103: {
            purchaseLimit() { return new Decimal(player.h.stage.mul(4)).add(player.hcu.jinxAddCap.div(1.25)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 23)) amt = amt.add(4)
                return amt
            },
            effect(x) { return Decimal.pow(player.hcu.curses.div(player.h.stage).add(1).log(player.h.stage).add(1).pow(Decimal.div(1.8, player.h.stage)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)) },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(4))) {
                    return Decimal.pow(player.h.stage.pow(2), x).mul(player.h.stage.pow(8)).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(8))) {
                    return Decimal.pow(player.h.stage.pow(4), x).mul(Decimal.pow(player.h.stage.pow(2), player.h.stage.mul(4).sub(4)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(player.h.stage.pow(6), x).mul(Decimal.pow(player.h.stage.pow(4), player.h.stage.mul(6).sub(2)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Γ-Jinx" },
            display() { return "Curses are multiplied by " + format(player.hcu.curses.div(player.h.stage).add(1).log(player.h.stage).add(1).pow(Decimal.div(1.8, player.h.stage))) + " (based on curses)" },
            total() { return "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(player.h.stage.pow(8), player.hcu.jinxDiv), player.h.stage.pow(2), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(player.h.stage.pow(8), player.hcu.jinxDiv), player.h.stage.pow(2), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(4))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(player.h.stage.pow(2), player.h.stage.mul(4).sub(4)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(4), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(player.h.stage.pow(2), player.h.stage.mul(4).sub(4)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(4), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(8))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(player.h.stage.pow(4), player.h.stage.mul(6).sub(2)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(6), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(player.h.stage.pow(4), player.h.stage.mul(6).sub(2)).recip().div(player.hcu.jinxDiv), player.h.stage.pow(6), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        104: {
            purchaseLimit() { return new Decimal(18).add(player.hcu.jinxAddCap.mul(2).div(3)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 53)) amt = amt.add(3)
                return amt
            },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))},
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(18)) {
                    return Decimal.pow(1e2, x).mul(1e8).div(player.hcu.jinxDiv)
                } else if (x.lt(36)) {
                    return Decimal.pow(1e4, x).mul(Decimal.pow(1e2, 14).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e6, x).mul(Decimal.pow(1e4, 25).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Δ-Jinx" },
            display() { return "All jinxes are 2x cheaper"},
            total() { return "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e8, player.hcu.jinxDiv), 1e2, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e8, player.hcu.jinxDiv), 1e2, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(18)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e2, 14).recip().div(player.hcu.jinxDiv), 1e4, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e2, 14).recip().div(player.hcu.jinxDiv), 1e4, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(36)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e4, 25).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e4, 25).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        105: {
            purchaseLimit() { return new Decimal(12).add(player.hcu.jinxAddCap.div(2.5)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            effectBase() {
                let base = player.hcu.jinxTotal.mul(0.01).add(1)
                if (base.gte(6)) base = base.div(6).pow(0.6).mul(6)
                return base
            },
            effect(x) { return Decimal.pow(this.effectBase(), getBuyableAmount(this.layer, this.id)) },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(12)) {
                    return Decimal.pow(1e3, x).mul(1e12).div(player.hcu.jinxDiv)
                } else if (x.lt(24)) {
                    return Decimal.pow(1e6, x).mul(Decimal.pow(1e3, 8).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e9, x).mul(Decimal.pow(1e6, 16).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Ε-Jinx" },
            display() {
                let str = "Curses are multiplied by " + format(this.effectBase()) + " (based on jinx score)"
                if (tmp[this.layer].buyables[this.id].effectBase.gte(6)) str = str.concat("<br><small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            total() {return "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e12, player.hcu.jinxDiv), 1e3, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e12, player.hcu.jinxDiv), 1e3, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(12)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e3, 8).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e3, 8).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(24)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e6, 16).recip().div(player.hcu.jinxDiv), 1e9, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e6, 16).recip().div(player.hcu.jinxDiv), 1e9, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        106: {
            purchaseLimit() {
                return new Decimal(6).add(player.hcu.jinxAddCap.div(5)).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            effect(x) {
                if (getBuyableAmount(this.layer, this.id).gte(100)) return getBuyableAmount(this.layer, this.id).mul(0.01).add(1.7)
                return Decimal.pow(1.01, getBuyableAmount(this.layer, this.id)) },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(6)) {
                    return Decimal.pow(1e6, x).mul(1e18).div(player.hcu.jinxDiv)
                } else if (x.lt(12)) {
                    return Decimal.pow(1e12, x).mul(Decimal.pow(1e6, 3).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e18, x).mul(Decimal.pow(1e12, 7.5).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Ζ-Jinx" },
            display() {
                let str = "Curses are raised to the power of 1.01"
                if (getBuyableAmount(this.layer, this.id).gte(100)) str = str.concat("<br><small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            total() { return "(Total: ^" + format(tmp[this.layer].buyables[this.id].effect) + ")"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e18, player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e18, player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(6)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e6, 3).recip().div(player.hcu.jinxDiv), 1e12, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e6, 3).recip().div(player.hcu.jinxDiv), 1e12, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(12)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e12, 7.5).recip().div(player.hcu.jinxDiv), 1e18, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e12, 7.5).recip().div(player.hcu.jinxDiv), 1e18, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        107: {
            purchaseLimit() { return new Decimal(30).add(player.hcu.jinxAddCap) },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                return amt
            },
            effect(x) {
                let eff = Decimal.pow(Decimal.add(1.1, buyableEffect("hcu", 110)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                if (eff.gte(1e6)) eff = eff.div(1e6).pow(0.3).mul(1e6)
                return eff
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(30)) {
                    return Decimal.pow(10, x).mul(1e4).div(player.hcu.jinxDiv)
                } else if (x.lt(60)) {
                    return Decimal.pow(100, x).mul(Decimal.pow(10, 26).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1000, x).mul(Decimal.pow(100, 44).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Η-Jinx" },
            display() { return HEX_STAGES[player.h.stage][0] + " Points are multiplied by " + format(buyableEffect("hcu", 110).add(1.1)) },
            total() {
                let str = "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"
                if (tmp[this.layer].buyables[this.id].effect.gte(1e6)) str = str.concat(" <small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e4, player.hcu.jinxDiv), 10, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e4, player.hcu.jinxDiv), 10, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(30)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(10, 26).recip().div(player.hcu.jinxDiv), 100, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(10, 26).recip().div(player.hcu.jinxDiv), 100, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(60)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(100, 44).recip().div(player.hcu.jinxDiv), 1000, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(100, 44).recip().div(player.hcu.jinxDiv), 1000, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        108: {
            purchaseLimit() { return new Decimal(18).add(player.hcu.jinxAddCap.mul(2).div(3)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                return amt
            },
            effect(x) {
                let eff = Decimal.pow(Decimal.add(1.1, buyableEffect("hcu", 111)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                if (eff.gte(1e6)) eff = eff.div(1e6).pow(0.3).mul(1e6)
                return eff
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(18)) {
                    return Decimal.pow(1e2, x).mul(1e6).div(player.hcu.jinxDiv)
                } else if (x.lt(36)) {
                    return Decimal.pow(1e4, x).mul(Decimal.pow(1e2, 15).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e6, x).mul(Decimal.pow(1e4, 25.5).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Θ-Jinx" },
            display() { return "Boons are multiplied by " + format(buyableEffect("hcu", 111).add(1.1)) },
            total() {
                let str = "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"
                if (tmp[this.layer].buyables[this.id].effect.gte(1e6)) str = str.concat(" <small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e6, player.hcu.jinxDiv), 1e2, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e6, player.hcu.jinxDiv), 1e2, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(18)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e2, 15).recip().div(player.hcu.jinxDiv), 1e4, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e2, 15).recip().div(player.hcu.jinxDiv), 1e4, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(36)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e4, 25.5).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e4, 25.5).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        109: {
            purchaseLimit() { return new Decimal(12).add(player.hcu.jinxAddCap.div(2.5)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            tooltip() {return "Works outside of " + HEX_STAGES[player.h.stage][1] + "."},
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                return amt
            },
            effect(x) {
                let eff = Decimal.pow(Decimal.add(1.2, buyableEffect("hcu", 112)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                if (eff.gte(1e9)) eff = eff.div(1e9).pow(0.3).mul(1e9)
                return eff
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(12)) {
                    return Decimal.pow(1e3, x).mul(1e9).div(player.hcu.jinxDiv)
                } else if (x.lt(24)) {
                    return Decimal.pow(1e6, x).mul(Decimal.pow(1e3, 9).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e9, x).mul(Decimal.pow(1e6, 16.5).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) && !player.hrm.activeChallenge},
            title() { return "Ι-Jinx" },
            display() {
                let str = "Negative infinity points are multiplied by " + format(buyableEffect("hcu", 112).add(1.2))
                if (player.hrm.activeChallenge) str = str.concat("<br><small style='color:red'>[UNBUYABLE IN REALM CHALLENGES]</small>")
                return str },
            total() {
                let str = "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"
                if (tmp[this.layer].buyables[this.id].effect.gte(1e9)) str = str.concat(" <small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e9, player.hcu.jinxDiv), 1e3, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e9, player.hcu.jinxDiv), 1e3, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(12)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e3, 9).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e3, 9).recip().div(player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(24)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e6, 16.5).recip().div(player.hcu.jinxDiv), 1e9, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e6, 16.5).recip().div(player.hcu.jinxDiv), 1e9, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: '200px', height: '125px', fontSize: "12px"}
                if (player.hrm.activeChallenge) look.opacity = 0.5
                return look
            },
        },
        110: {
            costBase() { return new Decimal(1e48).div(player.hcu.jinxDiv) },
            costGrowth() { return new Decimal(1e8)},
            purchaseLimit() { return new Decimal(6).add(player.hcu.jinxAddCap.div(5)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                return amt
            },
            effect(x) { return Decimal.mul(0.03, getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)) },
            unlocked() { return hasUpgrade("bi", 13) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(6)) {
                    return Decimal.pow(1e8, x).mul(1e48).div(player.hcu.jinxDiv)
                } else if (x.lt(12)) {
                    return Decimal.pow(1e16, x).div(player.hcu.jinxDiv)
                } else {
                    return Decimal.pow(1e24, x).mul(Decimal.pow(1e16, 6).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Κ-Jinx" },
            display() { return "Increase Η-Jinx's effect by +0.03x" },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e48, player.hcu.jinxDiv), 1e8, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e48, player.hcu.jinxDiv), 1e8, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(6)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1, player.hcu.jinxDiv), 1e16, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.div(1, player.hcu.jinxDiv), 1e16, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(12)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e16, 6).recip().div(player.hcu.jinxDiv), 1e24, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e16, 6).recip().div(player.hcu.jinxDiv), 1e24, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        111: {
            costBase() { return new Decimal(1e42).div(player.hcu.jinxDiv) },
            costGrowth() { return new Decimal(1e6)},
            purchaseLimit() { return new Decimal(9).add(player.hcu.jinxAddCap.div(10).mul(3)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                return amt
            },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (hasMilestone("hbl", 6)) return Decimal.mul(0.05, amt)
                return Decimal.mul(0.03, amt) },
            unlocked() { return hasUpgrade("bi", 13) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(9)) {
                    return Decimal.pow(1e6, x).mul(1e42).div(player.hcu.jinxDiv)
                } else if (x.lt(18)) {
                    return Decimal.pow(1e12, x).mul(Decimal.pow(1e6, 2).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e18, x).mul(Decimal.pow(1e12, 10).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Λ-Jinx" },
            display() { return hasMilestone("hbl", 6) ? "Increase Θ-Jinx's effect by +0.05x" : "Increase Θ-Jinx's effect by +0.03x" },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e42, player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e42, player.hcu.jinxDiv), 1e6, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(9)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e6, 2).recip().div(player.hcu.jinxDiv), 1e12, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e6, 2).recip().div(player.hcu.jinxDiv), 1e12, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(18)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e12, 10).recip().div(player.hcu.jinxDiv), 1e18, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e12, 10).recip().div(player.hcu.jinxDiv), 1e18, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        112: {
            costBase() { return new Decimal(1e36).div(player.hcu.jinxDiv) },
            costGrowth() { return new Decimal(1e4)},
            purchaseLimit() { return new Decimal(12).add(player.hcu.jinxAddCap.div(2.5)).floor() },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                return amt
            },
            effect(x) { return Decimal.mul(0.1, getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)) },
            unlocked() { return hasUpgrade("bi", 13) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(12)) {
                    return Decimal.pow(1e4, x).mul(1e36).div(player.hcu.jinxDiv)
                } else if (x.lt(24)) {
                    return Decimal.pow(1e8, x).mul(Decimal.pow(1e4, 3).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(1e12, x).mul(Decimal.pow(1e8, 13.5).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) && !player.hrm.activeChallenge},
            title() { return "Μ-Jinx" },
            display() {
                let str = "Increase Ι-Jinx's effect by +0.1x"
                if (player.hrm.activeChallenge) str = str.concat("<br><small style='color:red'>[UNBUYABLE IN REALM CHALLENGES]</small>")
                return str
            },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1e36, player.hcu.jinxDiv), 1e4, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(1e36, player.hcu.jinxDiv), 1e4, getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(12)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e4, 3).recip().div(player.hcu.jinxDiv), 1e8, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e4, 3).recip().div(player.hcu.jinxDiv), 1e8, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(24)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(1e8, 13.5).recip().div(player.hcu.jinxDiv), 1e12, getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(1e8, 13.5).recip().div(player.hcu.jinxDiv), 1e12, getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 13)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: '200px', height: '125px', fontSize: "12px"}
                if (player.hrm.activeChallenge) look.opacity = 0.5
                return look
            },
        },
    },
    microtabs: {
        curse: {
            "Cursed Jinxes": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "5px"],
                    ["row", [["jinx-buyable", 101], ["jinx-buyable", 102], ["jinx-buyable", 103]]],
                    ["row", [["jinx-buyable", 104], ["jinx-buyable", 105], ["jinx-buyable", 106]]],
                    ["blank", "10px"],
                    ["style-row", [
                        ["style-row", [
                            ["raw-html", "Jinx Score", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "148px", height: "35px", borderRight: "2px solid black"}],
                        ["style-row", [
                            ["raw-html", () => {return formatWhole(player.hcu.jinxTotal)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "100px", height: "35px", backgroundColor: "#232b2b", borderRadius: "0 15px 15px 0"}],
                    ], {width: "250px", height: "35px", backgroundColor: "#354040", border: "2px solid black", borderRadius: "15px"}],
                ],
            },
            "Hexed Jinxes": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "5px"],
                    ["row", [["jinx-buyable", 107], ["jinx-buyable", 108], ["jinx-buyable", 109]]],
                    ["row", [["jinx-buyable", 110], ["jinx-buyable", 111], ["jinx-buyable", 112]]],
                    ["blank", "10px"],
                    ["style-row", [
                        ["style-row", [
                            ["raw-html", "Jinx Score", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "148px", height: "35px", borderRight: "2px solid black"}],
                        ["style-row", [
                            ["raw-html", () => {return formatWhole(player.hcu.jinxTotal)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "100px", height: "35px", backgroundColor: "#232b2b", borderRadius: "0 15px 15px 0"}],
                    ], {width: "250px", height: "35px", backgroundColor: "#354040", border: "2px solid black", borderRadius: "15px"}],
                ],
            },
        },
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + HEX_STAGES[player.h.stage][1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return HEX_STAGES[player.h.stage][0] + " of Curses"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#354040", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["tooltip-row", [
            ["raw-html", () => {return "You have <h3>" + format(player.hcu.curses) + "</h3> Curses." }, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return "(+" + format(player.hcu.cursesGain) + "/s)" }, () => {
                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hcu.cursesGain.gt(0) ? look.color = "white" : look.color = "gray"
                return look
            }],
            ["raw-html", () => {return (player.hcu.cursesGain.gte(Decimal.pow(10, player.h.stage.mul(2))) && inChallenge("hrm", 12)) || player.hcu.cursesGain.gte(Decimal.pow(1e100, player.h.stage.mul(2))) ? "<small>[SOFTCAPPED<sup>2</sup>]</small>" :
                player.hcu.cursesGain.gte(Decimal.pow(10, player.h.stage.mul(2))) || inChallenge("hrm", 12) ? "<small>[SOFTCAPPED]</small>" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return "<div class='bottomTooltip'>Base Formula<hr><small>log" + formatWhole(player.h.stage) + "(Blessings)</small></div>"}],
        ]],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "5px"],
        ["microtabs", "curse", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return hasUpgrade("ta", 16) }, // Decides if this node is shown or not.
});
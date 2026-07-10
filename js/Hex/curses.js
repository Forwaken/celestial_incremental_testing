addLayer("hcu", {
    name() {return player.h.stageName[0] + " of Curses"},
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
        jinxTot: new Decimal(0),

        jinxedJinx: new Decimal(0),
        jinxedJinxReq: new Decimal(500),
        jinxedJinxEffects: [new Decimal(1), new Decimal(1), new Decimal(0)],
    }},
    automate() {
        if (hasMilestone("hre", 12) && !inChallenge("hrm", 15)) {
            for (let i = 101; i < 115; i++) {
                buyMaxExBuyable("hcu", i)
            }
        }
    },
    update(delta) {
        player.hcu.cursesGain = new Decimal(0)
        if (hasUpgrade("ta", 16)) player.hcu.cursesGain = player.hbl.blessings.add(1).log(player.h.stage.max(2).sub(1).div(buyableEffect("hre", 51)).add(1)).mul(buyableEffect("hre", 52)).pow(buyableEffect("hre", 53))
        if (hasUpgrade("ta", 16) && inChallenge("hrm", 13)) player.hcu.cursesGain = Decimal.pow(player.hve.vexTotal.mul(0.2).add(player.h.stage.mul(3).div(10)), player.hbl.blessings.add(1).log(player.h.stage.max(2).sub(buyableEffect("hre", 51).sub(1)))).sub(1).mul(buyableEffect("hre", 52)).pow(buyableEffect("hre", 53))
        if (hasUpgrade("ta", 16) && hasMilestone("hre", 10)) player.hcu.cursesGain = player.hcu.cursesGain.add(player.h.stage.div(10))
        if (player.hcu.cursesGain.gte(Decimal.pow10(player.h.stage.mul(5)))) player.hcu.cursesGain = player.hcu.cursesGain.div(Decimal.pow10(player.h.stage.mul(5))).pow(0.3).mul(Decimal.pow10(player.h.stage.mul(5)))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("hcu", 101))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("hcu", 103))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(buyableEffect("hcu", 105))
        if (hasUpgrade("hbl", 4)) player.hcu.cursesGain = player.hcu.cursesGain.mul(upgradeEffect("hbl", 4))
        if (hasUpgrade("hpw", 22)) player.hcu.cursesGain = player.hcu.cursesGain.mul(upgradeEffect("hpw", 22))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(player.h.prePowerMult)
        if (hasUpgrade("hbl", 103)) player.hcu.cursesGain = player.hcu.cursesGain.mul(upgradeEffect("hbl", 103))
        player.hcu.cursesGain = player.hcu.cursesGain.mul(player.hcu.jinxedJinxEffects[0])

        let externalCur = new Decimal(1)
        externalCur = externalCur.mul(buyableEffect("ta", 49))
        externalCur = externalCur.mul(buyableEffect("g", 27))
        if (hasUpgrade("ep2", 17)) externalCur = externalCur.mul(upgradeEffect("ep2", 17))
        if (hasUpgrade("zd", 23)) externalCur = externalCur.mul(upgradeEffect("zd", 23))
        if (hasUpgrade("tera", "hex11")) externalCur = externalCur.mul(upgradeEffect("tera", "hex11"))

        externalCur = externalCur.pow(player.h.externalRaise)
        player.hcu.cursesGain = player.hcu.cursesGain.mul(externalCur)

        // CURSE EXPONENT
        player.hcu.cursesGain = player.hcu.cursesGain.pow(buyableEffect("hcu", 106))
        if (hasUpgrade("hve", 63)) player.hcu.cursesGain = player.hcu.cursesGain.pow(1.03)
        if (hasUpgrade("hpw", 102)) player.hcu.cursesGain = player.hcu.cursesGain.pow(upgradeEffect("hpw", 102))
        player.hcu.cursesGain = player.hcu.cursesGain.pow(buyableEffect("hve", 13))
        player.hcu.cursesGain = player.hcu.cursesGain.pow(buyableEffect("hpw", 13))

        // SOFTCAPS AND PER SECOND
        if (inChallenge("hrm", 12)) player.hcu.cursesGain = player.hcu.cursesGain.pow(Decimal.div(3.6, player.h.stage.max(4)))
        if (player.hcu.cursesGain.gte(Decimal.pow10(player.h.stage.mul(2)))) player.hcu.cursesGain = player.hcu.cursesGain.div(Decimal.pow10(player.h.stage.mul(2))).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(Decimal.pow10(player.h.stage.mul(2)))
        if (player.hcu.cursesGain.gte(1.79e308)) player.hcu.cursesGain = player.hcu.cursesGain.div(1.79e308).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(1.79e308)
        player.hcu.cursesGain = player.hcu.cursesGain.mul(player.h.tickspeed)
        player.hcu.curses = player.hcu.curses.add(player.hcu.cursesGain.mul(delta))

        // JINX TOTAL
        player.hcu.jinxTotal = new Decimal(0)
        for (let i = 101; i < 115; i++) {
            player.hcu.jinxTotal = player.hcu.jinxTotal.add(getBuyableAmount("hcu", i))
            if (tmp["hcu"].buyables[i].extraAmount != null) player.hcu.jinxTotal = player.hcu.jinxTotal.add(tmp["hcu"].buyables[i].extraAmount)
        }
        player.hcu.jinxTotal = player.hcu.jinxTotal.add(player.hcu.jinxedJinx)
        player.hcu.jinxTot = player.hcu.jinxTotal
        player.hcu.jinxTotal = player.hcu.jinxTotal.mul(player.hve.vexEffects[1])
        if (hasUpgrade("hbl", 7)) player.hcu.jinxTotal = player.hcu.jinxTotal.mul(upgradeEffect("hbl", 7))
        player.hcu.jinxTotal = player.hcu.jinxTotal.mul(levelableEffect("pet", 109)[1].pow(player.h.externalRaise))

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
        if (hasUpgrade("hpw", 43)) player.hcu.jinxDiv = player.hcu.jinxDiv.mul(upgradeEffect("hpw", 43))

        // JINXED JINX
        player.hcu.jinxedJinxReq = player.hcu.jinxedJinx.mul(100).add(500)
        if (player.hcu.jinxedJinx.gte(2)) player.hcu.jinxedJinxReq = player.hcu.jinxedJinxReq.add(Decimal.pow(2, player.hcu.jinxedJinx.sub(2)).mul(10))
        player.hcu.jinxedJinxEffects[0] = player.hcu.jinxTot.pow(player.hcu.jinxedJinx.div(5).add(1)).div(100).pow(player.hcu.jinxedJinx)
        player.hcu.jinxedJinxEffects[1] = player.hcu.jinxedJinx.div(20).add(1)
        player.hcu.jinxedJinxEffects[2] = player.hcu.jinxedJinx
    },
    clickables: {
        1: {
            title: "<h3>Buy Max Jinxes</h3>",
            canClick() {
                let can = false
                for (let i = 101; i < 115; i++) {
                    if (canBuyBuyable("hcu", i)) can = true
                }
                return can
            },
            unlocked: true,
            onClick() {
                for (let i = 101; i < 115; i++) {
                    buyMaxExBuyable("hcu", i)
                }
            },
            style: {width: "200px", minHeight: "40px", borderRadius: "15px"},
        },
        100: {
            title() {
                return "<div style='display:flex;align-items:center;justify-content:center;width:250px;height:40px;background:rgba(0,0,0,0.2);border-radius:15px;font-size:20px;margin-top:15px;margin-bottom:10px'>" + formatWhole(player.hcu.jinxedJinx) + " Jinxed Jinx</div>" +
                "<div style='display:flex;align-items:center;justify-content:center;width:350px;height:80px;background:rgba(0,0,0,0.2);border-radius:15px;font-size:16px;margin-bottom:10px'>Gain a jinxed jinx, but reset curse content.</h2><br>Req: " + formatWhole(player.hcu.jinxTot) + "/" + formatWhole(player.hcu.jinxedJinxReq) + " Jinxes</div>" +
                "<div style='display:flex;align-items:center;justify-content:center;width:350px;height:120px;background:rgba(0,0,0,0.2);border-radius:15px;font-size:16px'>Effects:<br>x" + formatSimple(player.hcu.jinxedJinxEffects[0]) + " Curses<br>(Based on total jinxes)<br>x" + formatSimple(player.hcu.jinxedJinxEffects[1], 2) + " Jinx Cap<br>+" + formatWhole(player.hcu.jinxedJinxEffects[2]) + " free hexed jinxes</div>"
            },
            canClick() { return player.hcu.curses.gt(0) && player.hcu.jinxTot.gte(player.hcu.jinxedJinxReq)},
            unlocked: true,
            onClick() {
                player.hcu.jinxedJinx = player.hcu.jinxedJinx.add(1)

                // RESET CODE
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
            },
            style() {
                let look = {width: "400px", minHeight: "300px", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                return look
            },
        },
    },
    buyables: {
        101: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(5)).add(player.hcu.jinxAddCap).div(player.h.jinxDiv).floor()
            },
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
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
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
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        102: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(5)).add(player.hcu.jinxAddCap).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 22)) amt = amt.add(9)
                return amt
            },
            subEffect(x) {
                let eff = new Decimal(0.1)
                if (player.tera.clickables["bewitchSpell"] && getBuyableAmount("tera", "bewitchEnhance").gte(1)) eff = eff.mul(buyableEffect("tera", "bewitchBuff").div(20).add(1))
                if (getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount).gte(100)) eff = eff.div(10)
                return eff
            },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (amt.gte(100)) return Decimal.mul(tmp[this.layer].buyables[this.id].subEffect, amt.sub(100)).add(Decimal.mul(tmp[this.layer].buyables[this.id].subEffect, 1000))
                return Decimal.mul(tmp[this.layer].buyables[this.id].subEffect, amt)
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
                if (tmp[this.layer].buyables[this.id].subEffect.eq(0.1)) return "Increase Α-Jinx's effect by +0.1x"
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (amt.gte(100)) return "Increase Α-Jinx's effect by +" + format(tmp[this.layer].buyables[this.id].subEffect, 3) + "x<br><small style='color:red'>[SOFTCAPPED]</small>"
                return "Increase Α-Jinx's effect by +" + format(tmp[this.layer].buyables[this.id].subEffect, 3) + "x"
            },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)" },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
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
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        103: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(4)).add(player.hcu.jinxAddCap.div(1.25)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 23)) amt = amt.add(4)
                return amt
            },
            effect(x) {
                if (hasUpgrade("hpw", 163)) return Decimal.pow(player.hcu.curses.div(player.h.stage).add(1).log(2).add(1).pow(Decimal.div(2.4, player.h.stage.max(2))), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                return Decimal.pow(player.hcu.curses.div(player.h.stage).add(1).log(2).add(1).pow(Decimal.div(1.8, player.h.stage.max(2))), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
            },
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
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
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
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        104: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(3)).add(player.hcu.jinxAddCap.mul(2).div(3)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 53)) amt = amt.add(3)
                if (player.tera.clickables["bewitchSpell"]) amt = amt.add(buyableEffect("tera", "bewitchBuff"))
                return amt
            },
            effect(x) { return Decimal.pow(Decimal.mul(2, buyableEffect("hcu", 113)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))},
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(3))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(3)), x).mul(Decimal.pow10(player.h.stage.div(0.75))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(6))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(3).sub(4)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(4.5).sub(2)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Δ-Jinx" },
            display() { return "All jinxes are " + formatSimple(Decimal.mul(2, buyableEffect("hcu", 113)), 2) + "x cheaper"},
            total() { return "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.div(0.75)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(3)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.div(0.75)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(3)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(3))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(3).sub(4)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(1.5)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(3).sub(4)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(1.5)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(6))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(4.5).sub(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(4.5).sub(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        105: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(2)).add(player.hcu.jinxAddCap.div(2.5)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            effectBase() {
                let base = player.hcu.jinxTotal.mul(0.01).add(1)
                if (base.gte(player.h.stage)) base = base.div(player.h.stage).pow(Decimal.div(3.6, player.h.stage.max(4))).mul(player.h.stage)
                return base
            },
            effect(x) { return Decimal.pow(this.effectBase(), getBuyableAmount(this.layer, this.id)) },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(2)), x).mul(Decimal.pow10(player.h.stage.mul(2))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(4))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage), x).mul(Decimal.pow(1e3, player.h.stage.mul(2).sub(4)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(1.5)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(3).sub(2)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Ε-Jinx" },
            display() {
                let str = "Curses are multiplied by " + format(this.effectBase()) + " (based on jinx score)"
                if (tmp[this.layer].buyables[this.id].effectBase.gte(player.h.stage)) str = str.concat("<br><small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            total() {return "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(2)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(2)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(2)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(2)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(2)), player.h.stage.mul(2).sub(4)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(2)), player.h.stage.mul(2).sub(4)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(4))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(3).sub(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(1.5)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(3).sub(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(1.5)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        106: {
            purchaseLimit() {
                return new Decimal(player.h.stage).add(player.hcu.jinxAddCap.div(5)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(100).add(1) },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage)) {
                    return Decimal.pow(Decimal.pow10(player.h.stage), x).mul(Decimal.pow10(player.h.stage.mul(3))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.sub(3)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(3)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.mul(3)), player.h.stage.sub(1)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Ζ-Jinx" },
            display() {return "Curses are raised to the power of 1.01"},
            total() { return "(Total: ^" + format(tmp[this.layer].buyables[this.id].effect) + ")"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(3)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(3)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.mul(3)), player.h.stage.sub(1)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(3)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.mul(3)), player.h.stage.sub(1)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(3)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        107: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(5)).add(player.hcu.jinxAddCap).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) {
                let eff = Decimal.pow(Decimal.add(1.1, buyableEffect("hcu", 110)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                if (eff.gte(Decimal.pow10(player.h.stage))) eff = eff.div(Decimal.pow10(player.h.stage)).pow(Decimal.div(1.8, player.h.stage.max(2))).mul(Decimal.pow10(player.h.stage))
                return eff
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(5))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(6)), x).mul(Decimal.pow10(player.h.stage.div(1.5))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(10))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(3)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(6)), player.h.stage.mul(5).sub(4)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(2)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(7.5).sub(2)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Η-Jinx" },
            display() { return player.h.stageName[0] + " Points are multiplied by " + format(buyableEffect("hcu", 110).add(1.1)) },
            total() {
                let str = "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"
                if (tmp[this.layer].buyables[this.id].effect.gte(Decimal.pow10(player.h.stage))) str = str.concat(" <small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.div(1.5)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(6)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.div(1.5)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(6)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(5))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(6)), player.h.stage.mul(5).sub(4)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(3)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(6)), player.h.stage.mul(5).sub(4)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(3)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(10))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(7.5).sub(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(2)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(7.5).sub(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(2)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        108: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(3)).add(player.hcu.jinxAddCap.mul(2).div(3)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) {
                let eff = Decimal.pow(Decimal.add(1.1, buyableEffect("hcu", 111)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                if (eff.gte(Decimal.pow10(player.h.stage))) eff = eff.div(Decimal.pow10(player.h.stage)).pow(Decimal.div(1.8, player.h.stage.max(2))).mul(Decimal.pow10(player.h.stage))
                return eff
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(3))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(3)), x).mul(Decimal.pow10(player.h.stage)).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(6))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), x).mul(Decimal.pow(1e2, player.h.stage.mul(3).sub(3)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(4.5).sub(1.5)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Θ-Jinx" },
            display() { return "Boons are multiplied by " + format(buyableEffect("hcu", 111).add(1.1)) },
            total() {
                let str = "(Total: " + format(tmp[this.layer].buyables[this.id].effect) + "x)"
                if (tmp[this.layer].buyables[this.id].effect.gte(Decimal.pow10(player.h.stage))) str = str.concat(" <small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(3)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(3)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(3))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(3).sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(1.5)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(3)), player.h.stage.mul(3).sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(1.5)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(6))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(4.5).sub(1.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(4.5).sub(1.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        109: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(2)).add(player.hcu.jinxAddCap.div(2.5)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            tooltip() {return "Works outside of " + player.h.stageName[1] + "."},
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) {
                let eff = Decimal.pow(Decimal.add(1.2, buyableEffect("hcu", 112)), getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount))
                if (eff.gte(Decimal.pow10(player.h.stage.mul(1.5)))) eff = eff.div(Decimal.pow10(player.h.stage.mul(1.5))).pow(Decimal.div(player.h.stage, 20)).mul(Decimal.pow10(player.h.stage.mul(1.5)))
                return eff
            },
            unlocked() { return true },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(2)), x).mul(Decimal.pow10(player.h.stage.mul(1.5))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(4))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(2)), player.h.stage.mul(2).sub(3)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(1.5)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(3).sub(1.5)).recip().div(player.hcu.jinxDiv))
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
                if (tmp[this.layer].buyables[this.id].effect.gte(Decimal.pow10(player.h.stage.mul(1.5)))) str = str.concat(" <small style='color:red'>[SOFTCAPPED]</small>")
                return str
            },
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(1.5)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(2)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(1.5)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(2)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(2)), player.h.stage.mul(2).sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(2)), player.h.stage.mul(2).sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(4))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(3).sub(1.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(1.5)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(3).sub(1.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(1.5)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

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
            purchaseLimit() {
                return new Decimal(player.h.stage).add(player.hcu.jinxAddCap.div(5)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (hasUpgrade("tera", "hept9")) return Decimal.mul(0.05, amt)
                return Decimal.mul(0.03, amt)
            },
            unlocked() { return hasUpgrade("bi", 13) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage)) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(0.75)), x).mul(Decimal.pow10(player.h.stage.mul(8))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(0.375)), x).div(player.hcu.jinxDiv)
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(4)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(0.375)), player.h.stage.mul(1.5).sub(3)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Κ-Jinx" },
            display() {
                return hasUpgrade("tera", "hept9") ? "Increase Η-Jinx's effect by +0.05x" : "Increase Η-Jinx's effect by +0.03x"
            },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(8)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(0.75)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(8)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(0.75)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1, player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(0.375)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.div(1, player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(0.375)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(0.375)), player.h.stage.mul(1.5).sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(4)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(0.375)), player.h.stage.mul(1.5).sub(3)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(4)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        111: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(1.5)).add(player.hcu.jinxAddCap.div(10).mul(3)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)
                if (hasMilestone("hbl", 6)) return Decimal.mul(0.05, amt)
                return Decimal.mul(0.03, amt) },
            unlocked() { return hasUpgrade("bi", 13) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(1.5))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage), x).mul(Decimal.pow10(player.h.stage.mul(7))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(3))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(1.5).sub(7)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(3)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), player.h.stage.mul(2.25).sub(3.5)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return this.currency().gte(this.cost()) },
            title() { return "Λ-Jinx" },
            display() { return hasMilestone("hbl", 6) ? "Increase Θ-Jinx's effect by +0.05x" : "Increase Θ-Jinx's effect by +0.03x" },
            total() { return "(Total: +" + format(tmp[this.layer].buyables[this.id].effect) + "x)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(7)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(7)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(1.5))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(1.5).sub(7)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(1.5).sub(7)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(3))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), player.h.stage.mul(2.25).sub(3.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(3)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), player.h.stage.mul(2.25).sub(3.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(3)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        112: {
            purchaseLimit() {
                return new Decimal(player.h.stage.mul(2)).add(player.hcu.jinxAddCap.div(2.5)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) { return Decimal.mul(0.1, getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount)) },
            unlocked() { return hasUpgrade("bi", 13) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.mul(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), x).mul(Decimal.pow10(player.h.stage.mul(6))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage.mul(4))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.div(0.75)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(2).sub(9)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage.div(0.75)), player.h.stage.mul(3).sub(4.5)).recip().div(player.hcu.jinxDiv))
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
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(6)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(1.5)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(6)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(1.5)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(2).sub(9)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(0.75)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(1.5)), player.h.stage.mul(2).sub(9)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.div(0.75)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.mul(4))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage.div(0.75)), player.h.stage.mul(3).sub(4.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage.div(0.75)), player.h.stage.mul(3).sub(4.5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: '200px', height: '125px', fontSize: "12px"}
                if (player.hrm.activeChallenge) look.opacity = 0.5
                return look
            },
        },
        113: {
            purchaseLimit() {
                return new Decimal(player.h.stage.div(2)).add(player.hcu.jinxAddCap.div(10)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(50).add(1)},
            unlocked() { return player.h.stage.gte(7) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.div(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(2)), x).mul(Decimal.pow10(player.h.stage.mul(6))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage)) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(4)), x).div(player.hcu.jinxDiv)
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(6)), x).mul(Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(2)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return player.h.stage.gte(7) && this.currency().gte(this.cost()) },
            title() { return "Ν-Jinx" },
            display() {
                let str = "Increase Δ-Jinx's effect by 2%"
                return str
            },
            total() { return "(Total: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1).mul(100)) + "%)"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(6)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(6)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(2)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.div(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(1, player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(4)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.div(1, player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(4)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(6)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow(Decimal.pow10(player.h.stage), player.h.stage.mul(2)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(6)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
        },
        114: {
            purchaseLimit() {
                return new Decimal(player.h.stage.div(2)).add(player.hcu.jinxAddCap.div(10)).div(player.h.jinxDiv).floor()
            },
            currency() { return player.hcu.curses},
            pay(amt) { player.hcu.curses = this.currency().sub(amt).max(0) },
            extraAmount() {
                let amt = new Decimal(0)
                if (hasUpgrade("hve", 51)) amt = amt.add(1)
                amt = amt.add(player.hcu.jinxedJinxEffects[2])
                return amt
            },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(tmp[this.layer].buyables[this.id].extraAmount).add(1)},
            unlocked() { return player.h.stage.gte(7) },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                if (x.lt(player.h.stage.div(2))) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(5)), x).mul(Decimal.pow10(player.h.stage.mul(10))).div(player.hcu.jinxDiv)
                } else if (x.lt(player.h.stage)) {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(10)), x).mul(Decimal.pow10(player.h.stage.mul(5)).recip().div(player.hcu.jinxDiv))
                } else {
                    return Decimal.pow(Decimal.pow10(player.h.stage.mul(15)), x).mul(Decimal.pow10(player.h.stage.mul(35)).recip().div(player.hcu.jinxDiv))
                }
            },
            canAfford() { return player.h.stage.gte(7) && this.currency().gte(this.cost()) },
            title() { return "Ξ-Jinx" },
            display() {
                let str = "Reduce purity requirement by 1 refinement"
                return str
            },
            total() { return "(Total: -" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + ")"},
            buy(mult) {
                if (mult != true) {
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), Decimal.div(Decimal.pow10(player.h.stage.mul(10)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(5)), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, Decimal.div(Decimal.pow10(player.h.stage.mul(10)), player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(5)), getBuyableAmount(this.layer, this.id))
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage.div(2))) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow10(player.h.stage.mul(5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(10)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow10(player.h.stage.mul(5)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(10)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.add(getBuyableAmount(this.layer, this.id)).gte(player.h.stage)) {
                        max = Decimal.affordGeometricSeries(this.currency(), Decimal.pow10(player.h.stage.mul(35)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(15)), getBuyableAmount(this.layer, this.id))
                        cost = Decimal.sumGeometricSeries(max, Decimal.pow10(player.h.stage.mul(35)).recip().div(player.hcu.jinxDiv), Decimal.pow10(player.h.stage.mul(15)), getBuyableAmount(this.layer, this.id))
                    }
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    if (!hasMilestone("hpw", 5) && !hasMilestone("hre", 12)) this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style: {width: '200px', height: '125px', fontSize: "12px"},
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
                    ["row", [["jinx-buyable", 113]]],
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
                    ["row", [["jinx-buyable", 114]]],
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
            "Jinxed Jinx": {
                buttonStyle() {return {borderRadius: "5px"}},
                unlocked() {return player.tera.virtueUnlocks[1]},
                content: [
                    ["blank", "20px"],
                    ["clickable", 100],
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
            ["raw-html", () => {return player.h.stageName[0] + " of Curses"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#354040", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["tooltip-row", [
            ["raw-html", () => {return "You have <h3>" + format(player.hcu.curses) + "</h3> Curses." }, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return "(+" + format(player.hcu.cursesGain) + "/s)" }, () => {
                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hcu.cursesGain.gt(0) ? look.color = "white" : look.color = "gray"
                return look
            }],
            ["raw-html", () => {return (player.hcu.cursesGain.gte(Decimal.pow10(player.h.stage.mul(2))) && inChallenge("hrm", 12)) || player.hcu.cursesGain.gte(1.79e308) ? "<small>[SOFTCAPPED<sup>2</sup>]</small>" :
                player.hcu.cursesGain.gte(Decimal.pow10(player.h.stage.mul(2))) || inChallenge("hrm", 12) ? "<small>[SOFTCAPPED]</small>" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {
                let str = "<div class='bottomTooltip'>Base Formula<hr><small>log" + formatWhole(player.h.stage.max(2).sub(buyableEffect("hre", 51).sub(1))) + "(Blessings)"
                if (buyableEffect("hre", 52).gt(1)) str = str.concat("x" + formatSimple(buyableEffect("hre", 52)))
                if (buyableEffect("hre", 53).gt(1)) str = str.concat("^" + formatSimple(buyableEffect("hre", 53), 2))
                if (hasMilestone("hre", 10)) str = str.concat("+" + formatSimple(player.h.stage.div(10)))
                return str + "</small></div>"
            }],
        ]],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "5px"],
        ["microtabs", "curse", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return hasUpgrade("ta", 16) }, // Decides if this node is shown or not.
    hotkeys: [
        {
            key: "j", 
            description: "Buy Max Jinxes",
            onPress() {
                clickClickable(this.layer, 1)
            },
        }
	]
});
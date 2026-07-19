addLayer("hte", {
    name() {return player.h.stageName[0] + " of Tempering"},
    symbol: "Te", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Tempering", // Decides the nodes tooltip
    color: "#A86929", // Decides the nodes color.
    nodeStyle: {background: "linear-gradient(135deg, #A86929, #865420, #A86929)", borderColor: "rgba(0,0,0,0.5)", color: "rgba(0,0,0,0.5)"}, // Decides the nodes style, in CSS format.
    branches: ["hre", "hpw"], // Decides the nodes branches.
    startData() { return {
        temperer: new Decimal(0),
        tempererPerSec: new Decimal(0),

        buyMax: false,
    }},
    update (delta) {
        player.hte.tempererPerSec = new Decimal(0)
        if (hasUpgrade("hpw", 151)) {
            player.hte.tempererPerSec = Decimal.pow(Decimal.mul(1.2, buyableEffect("hte", 22)), player.hre.refinement.sub(player.h.stage.mul(10).sub(buyableEffect("hte", 21).sub(1))).add(1).max(0)).sub(1).mul(buyableEffect("hte", 23))
            if (player.hte.tempererPerSec.gte(1e10)) player.hte.tempererPerSec = player.hte.tempererPerSec.div(1e10).pow(Decimal.div(3.5, player.h.stage.max(4))).mul(1e10)
            player.hte.tempererPerSec = player.hte.tempererPerSec.mul(player.tera.virtueEffects[3][2])
            player.hte.tempererPerSec = player.hte.tempererPerSec.mul(player.h.tickspeed)
            player.hte.temperer = player.hte.temperer.add(player.hte.tempererPerSec.mul(delta))
        }
    },
    clickables: {
        1: {
            title() { return "Buy Max On" },
            canClick() { return player.hte.buyMax == false },
            unlocked() { return true },
            onClick() {
                player.hte.buyMax = true
            },
            style: {width: "80px", minHeight: "50px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px 0px 0px 15px"},
        },
        2: {
            title() { return "Buy Max Off" },
            canClick() { return player.hte.buyMax == true  },
            unlocked() { return true },
            onClick() {
                player.hte.buyMax = false
            },
            style: {width: "80px", minHeight: "50px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0 15px 15px 0"},
        },
    },
    buyables: {
        11: {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(100) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(5).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Reduce Log</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            tooltip: "Divides starting at 1.",
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        12: {
            costBase() { return new Decimal(2) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id).pow(0.85)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        13: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        21: {
            costBase() { return new Decimal(20) },
            costGrowth() { return new Decimal(20) },
            purchaseLimit() { return player.h.stage.mul(5).pow(1.15).floor() },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Decrease Req.</h3>\n\
                    Currently: -" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        22: {
            costBase() { return new Decimal(200) },
            costGrowth() { return new Decimal(200) },
            purchaseLimit() { return new Decimal(45) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(200).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Base</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        23: {
            costBase() { return new Decimal(4) },
            costGrowth() { return new Decimal(4) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id).pow(0.85)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        31: {
            costBase() { return new Decimal(40) },
            costGrowth() { return new Decimal(40) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Add to Base</h3>\n\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        32: {
            costBase() { return new Decimal(8) },
            costGrowth() { return new Decimal(8) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id).pow(0.85)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        33: {
            costBase() { return new Decimal(400) },
            costGrowth() { return new Decimal(400) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        41: {
            costBase() { return new Decimal(800) },
            costGrowth() { return new Decimal(800) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        42: {
            costBase() { return new Decimal(16) },
            costGrowth() { return new Decimal(16) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).pow(0.85)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        43: {
            costBase() { return new Decimal(80) },
            costGrowth() { return new Decimal(80) },
            purchaseLimit() { return new Decimal(200) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).pow(0.85)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Improve Deposit</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        51: {
            costBase() { return new Decimal(1600) },
            costGrowth() { return new Decimal(1600) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(5).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Reduce Log</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            tooltip: "Divides starting at 1.",
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        52: {
            costBase() { return new Decimal(32) },
            costGrowth() { return new Decimal(32) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).pow(0.85)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
        53: {
            costBase() { return new Decimal(160) },
            costGrowth() { return new Decimal(160) },
            purchaseLimit() { return new Decimal(200) },
            currency() { return player.hte.temperer},
            pay(amt) { player.hte.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).pow(0.85).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                if (player.hte.buyMax == false) {
                    let buyonecost = new Decimal(this.costGrowth()).pow(getBuyableAmount(this.layer, this.id)).mul(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordGeometricSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
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
            ["raw-html", () => {return player.h.stageName[0] + " of Tempering"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#543414", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["style-row", [["clickable", 1], ["clickable", 2]], {width: "160px", height: "50px", border: "3px solid #836546", borderRadius: "18px"}],
        ["blank", "10px"],
        ["style-column", [
            ["tooltip-row", [
                ["raw-html", () => {return "You have " + formatSimple(player.hte.temperer, 2) + " temperers"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ["raw-html", () => {return player.hte.tempererPerSec.eq(0) ? "<span style='color:gray'>(+0/s)</span>" : player.hte.tempererPerSec.gt(0) ? "(+" + formatSimple(player.hte.tempererPerSec, 2) + "/s)" : "<span style='color:red'>(" + format(player.hte.tempererPerSec) + "/s)</span>" }, {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                ["raw-html", () => {return player.hte.tempererPerSec.gte(1e10) ? "<small style='margin-left:10px'>[SOFTCAPPED]</small>" : ""}, {color: "red", fontSize: "20px", fontFamily: "monospace"}],
                ["raw-html", () => {
                    let str = "<div class='bottomTooltip'>Base Formula<hr><small>(" + formatSimple(Decimal.mul(1.2, buyableEffect("hte", 22)), 2) + "^(Refinements-" + formatWhole(player.h.stage.mul(10).sub(1).sub(buyableEffect("hte", 21).sub(1))) + ")-1)"
                    if (buyableEffect("hte", 23).gte(1)) str = str.concat("x" + formatSimple(buyableEffect("hte", 23)))
                    if (player.hte.tempererPerSec.gte(1e10)) str = str.concat("<br>[SOFTCAP: /1e10 ^" + formatSimple(Decimal.div(3.5, player.h.stage.max(4))) + " *1e10]")
                    return str + "</small></div>"
                }],
            ]],
            ["raw-html", () => {return "<i>Temperer production requires at least " + formatSimple(Decimal.sub(70, buyableEffect("hte", 21).sub(1))) + " refinements</i>"}, {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
        ], {width: "740px", height: "60px", background: "#321f0c", border: "3px solid #836546", borderRadius: "20px 20px 0 0"}],
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return player.h.stageName[0] + " Points"}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ["raw-html", "<i>Based on Celestial Points</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
            ], {width: "200px", height: "120px"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "Log" + formatSimple(player.h.stage.max(2).sub(1).div(buyableEffect("hte", 11)).add(1))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 11],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "x" + formatSimple(Decimal.mul(player.h.stage.max(1), buyableEffect("hte", 12)))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 12],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "^" + formatSimple(Decimal.div(3.6, player.h.stage.max(4)).mul(buyableEffect("hte", 13)), 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 13],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
        ], {width: "740px", height: "120px", background: "#000e26", border: "3px solid #836546", marginTop: "-3px"}],
        ["style-row", [
            ["style-column", [
                ["raw-html", "Temperers", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ["raw-html", "<i>Based on Refinements</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
            ], {width: "200px", height: "120px"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "-" + formatSimple(player.h.stage.mul(10).sub(1).sub(buyableEffect("hte", 21).sub(1)))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 21],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return formatSimple(Decimal.mul(1.2, buyableEffect("hte", 22)), 3) + "^"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 22],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "x" + formatSimple(buyableEffect("hte", 23))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 23],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
        ], {width: "740px", height: "120px", background: "#321f0c", border: "3px solid #836546", marginTop: "-3px"}],
        ["style-row", [
            ["style-column", [
                ["raw-html", "Blessings", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ["raw-html", "<i>Based on Refinements</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
            ], {width: "200px", height: "120px"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {
                        let eff = Decimal.sub(buyableEffect("hte", 31).sub(1), player.h.stage.mul(2).sub(1))
                        if (eff.gte(0)) return "+" + formatSimple(eff)
                        return formatSimple(eff)
                    }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 31],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "x" + formatSimple(buyableEffect("hte", 32))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 32],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "^" + formatSimple(Decimal.div(3.6, player.h.stage.max(4)).add(1).mul(buyableEffect("hte", 33)), 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 33],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
        ], {width: "740px", height: "120px", background: "#261c00", border: "3px solid #836546", marginTop: "-3px"}],
        ["style-row", [
            ["style-column", [
                ["raw-html", "Boons", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ["raw-html", "<i>Based on Blessings</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
            ], {width: "200px", height: "120px"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "^" + formatSimple(Decimal.div(3.6, player.h.stage.max(4)).add(1).mul(buyableEffect("hte", 41)), 2)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 41],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {
                        let eff = Decimal.div(buyableEffect("hte", 42), player.h.stage)
                        if (eff.gte(1)) return "x" + formatSimple(eff)
                        return "/" + formatSimple(Decimal.div(1, eff))
                    }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 42],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return formatSimple(upgradeEffect("hpw", 52).sub(1).mul(100)) + "% Deposited/s"}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 43],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
        ], {width: "740px", height: "120px", background: "#1e1600", border: "3px solid #836546", marginTop: "-3px"}],
        ["style-row", [
            ["style-column", [
                ["raw-html", "Curses", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ["raw-html", "<i>Based on Blessings</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
            ], {width: "200px", height: "120px"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "Log" + formatSimple(player.h.stage.max(2).sub(1).div(buyableEffect("hte", 51)).add(1))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 51],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "x" + formatSimple(buyableEffect("hte", 52))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 52],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
            ["style-column", [
                ["style-row", [
                    ["raw-html", () => {return "^" + formatSimple(buyableEffect("hte", 53), 2)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "177px", height: "37px", borderBottom: "3px solid #836546"}],
                ["style-row", [
                    ["buyable", 53],
                ], {width: "177px", height: "80px"}],
            ], {width: "177px", height: "120px", borderLeft: "3px solid #836546"}],
        ], {width: "740px", height: "120px", background: "#232b2b", border: "3px solid #836546", marginTop: "-3px"}],
        ["style-column", [
            ["raw-html", "<i>Buyables are in the same order as formula operators</i>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
            ["raw-html", "<i>Tempering only resets on power level resets and above</i>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
        ], {width: "740px", height: "45px", background: "#321f0c", lineHeight: "1.2", border: "3px solid #836546", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
        ["blank", "25px"],
    ],
    layerShown() { return hasUpgrade("hpw", 151) }, // Decides if this node is shown or not.
});
addLayer("hre", {
    name() {return player.h.stageName[0] + " of Refinement"},
    symbol: "Rf", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Refinement", // Decides the nodes tooltip
    color: "#444", // Decides the nodes color.
    nodeStyle: {backgroundColor: "black", borderColor: "#ccc", color: "#ccc"}, // Decides the nodes style, in CSS format.
    branches: ["hpr", "hbl"], // Decides the nodes branches.
    startData() { return {
        refinement: new Decimal(0),
        refinementReq: new Decimal(0),
        refinementGain: new Decimal(0),
        refinementDiv: new Decimal(1),
        refinementEffect: [[new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)],
            [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)]],
        temperer: new Decimal(0),
        tempererPerSec: new Decimal(0),
    }},
    update (delta) {
        player.hre.refinementDiv = new Decimal(1)
        player.hre.refinementDiv = player.hre.refinementDiv.mul(player.hbl.boosters[3].effect)
        if (hasUpgrade("hbl", 3)) player.hre.refinementDiv = player.hre.refinementDiv.mul(upgradeEffect("hbl", 3))
        if (inChallenge("hrm", 16)) player.hre.refinementDiv = player.hre.refinementDiv.mul(player.hre.refinementEffect[1][0])
        player.hre.refinementDiv = player.hre.refinementDiv.mul(player.h.prePowerMult)
        if (hasUpgrade("hpw", 134)) player.hre.refinementDiv = player.hre.refinementDiv.mul(upgradeEffect("hpw", 134))

        let externalDiv = new Decimal(1)
        externalDiv = externalDiv.mul(player.rf.abilityEffects[7])
        externalDiv = externalDiv.mul(buyableEffect("ta", 47))
        externalDiv = externalDiv.mul(levelableEffect("pet", 210)[1])

        externalDiv = externalDiv.pow(player.h.externalRaise)
        player.hre.refinementDiv = player.hre.refinementDiv.mul(externalDiv)

        let reqSoftcapPoints1 = Decimal.pow(player.h.stage.max(2).mul(player.h.refinementScale), player.h.stage.mul(10)).mul(Decimal.pow10(player.h.stage)).div(player.hre.refinementDiv)
        let reqSoftcapConnector1 = Decimal.sub(player.h.stage.mul(10), reqSoftcapPoints1.add(1).mul(player.hre.refinementDiv).ln().div(new Decimal(player.h.stage.max(2).pow(3).mul(player.h.refinementScale)).ln()).add(1))
        let reqSoftcapPoints2 = Decimal.pow(player.h.stage.max(2).pow(3).mul(player.h.refinementScale), player.h.stage.mul(15).sub(reqSoftcapConnector1)).div(player.hre.refinementDiv)
        let reqSoftcapConnector2 = Decimal.sub(player.h.stage.mul(15), reqSoftcapPoints2.add(1).mul(player.hre.refinementDiv).ln().div(new Decimal(player.h.stage.max(2).pow(6).mul(player.h.refinementScale)).ln()).add(1))

        if (player.hre.refinement.lt(player.h.stage.mul(10))) player.hre.refinementReq = Decimal.pow(player.h.stage.max(2).mul(player.h.refinementScale), player.hre.refinement).mul(Decimal.pow10(player.h.stage)).div(player.hre.refinementDiv)
        if (player.hre.refinement.lt(player.h.stage.mul(15)) && player.hre.refinement.gte(player.h.stage.mul(10))) player.hre.refinementReq = Decimal.pow(player.h.stage.max(2).pow(3).mul(player.h.refinementScale), player.hre.refinement.sub(reqSoftcapConnector1)).div(player.hre.refinementDiv)
        if (player.hre.refinement.gte(player.h.stage.mul(15))) player.hre.refinementReq = Decimal.pow(player.h.stage.max(2).pow(6).mul(player.h.refinementScale), player.hre.refinement.sub(reqSoftcapConnector2)).div(player.hre.refinementDiv)
        
        if (player.h.hexPoint.lt(reqSoftcapPoints1)) player.hre.refinementGain = player.h.hexPoint.add(1).div(Decimal.pow10(player.h.stage)).mul(player.hre.refinementDiv).ln().div(new Decimal(player.h.stage.max(2).mul(player.h.refinementScale)).ln()).add(1).sub(player.hre.refinement).floor()
        if (player.h.hexPoint.lt(reqSoftcapPoints2) && player.h.hexPoint.gte(reqSoftcapPoints1)) player.hre.refinementGain = player.h.hexPoint.add(1).mul(player.hre.refinementDiv).ln().div(new Decimal(player.h.stage.max(2).pow(3).mul(player.h.refinementScale)).ln()).add(1).add(reqSoftcapConnector1).sub(player.hre.refinement).floor()
        if (player.h.hexPoint.gte(reqSoftcapPoints2)) player.hre.refinementGain = player.h.hexPoint.add(1).mul(player.hre.refinementDiv).ln().div(new Decimal(player.h.stage.max(2).pow(6).mul(player.h.refinementScale)).ln()).add(1).add(reqSoftcapConnector2).sub(player.hre.refinement).floor()
        
        if (player.hre.refinementGain.lt(1)) player.hre.refinementGain = new Decimal(0)

        if (hasMilestone("hre", 6) && !inChallenge("hrm", 15)) player.hre.refinement = player.hre.refinement.add(player.hre.refinementGain)

        player.hre.refinementEffect = [[new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)],
            [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)]]

        if (player.hre.refinement.gte(1) || hasMilestone("hre", 3)) {
            if (!hasUpgrade("hpw", 81)) player.hre.refinementEffect[0][0] = Decimal.pow(Decimal.div(2, player.h.stage).add(1), player.hre.refinement.pow(Decimal.div(4.8, player.h.stage.max(5)))).mul(2)
            if (hasUpgrade("hpw", 81)) player.hre.refinementEffect[0][0] = Decimal.pow(Decimal.div(3, player.h.stage).add(1), player.hre.refinement.pow(Decimal.div(4.8, player.h.stage.max(5)))).mul(3)
            player.hre.refinementEffect[0][0] = player.hre.refinementEffect[0][0].mul(Decimal.pow(Decimal.div(1.5, player.h.stage).add(1), player.hre.refinement.min(player.h.stage.mul(2))))
            player.hre.refinementEffect[0][1] = Decimal.pow(player.h.stage.div(2), player.hre.refinement).mul(player.h.stage.div(2))
        }
        if (hasUpgrade("hpw", 133)) player.hre.refinementEffect[0][0] = player.hre.refinementEffect[0][0].pow(upgradeEffect("hpw", 133))
        if (inChallenge("hrm", 12)) {
            player.hre.refinementEffect[0][0] = player.hre.refinementEffect[0][0].pow(player.hpu.purifiers[3].effect)
            player.hre.refinementEffect[0][1] = player.hre.refinementEffect[0][1].pow(player.hpu.purifiers[3].effect)
        }
        if (inChallenge("hrm", 16)) {
            let effPow = player.hre.refinementEffect[2][0]
            if (hasUpgrade("hbl", 6)) effPow = effPow.add(upgradeEffect("hbl", 6))
            if (hasMilestone("hbl", 5)) effPow = effPow.add(player.h.stage.div(20))
            if (hasUpgrade("hpw", 101)) effPow = effPow.add(upgradeEffect("hpw", 101))
            if (hasUpgrade("hpw", 132)) effPow = effPow.add(0.5)
            player.hre.refinementEffect[0][0] = player.hre.refinementEffect[0][0].pow(effPow)
            player.hre.refinementEffect[0][1] = player.hre.refinementEffect[0][1].pow(effPow)
        }

        if (player.hre.refinement.gte(player.h.stage.div(2).floor())) player.hre.refinementEffect[1][0] = Decimal.pow(Decimal.div(0.9, player.h.stage).add(1), player.hre.refinement.sub(player.h.stage.div(2).floor().sub(1)).pow(Decimal.div(3.6, player.h.stage.max(4))))
        if (player.hre.refinementEffect[1][0].gte(Decimal.div(30, player.h.stage.min(15)))) player.hre.refinementEffect[1][0] = player.hre.refinementEffect[1][0].div(Decimal.div(30, player.h.stage.min(15))).pow(Decimal.div(1.8, player.h.stage.max(2))).mul(Decimal.div(30, player.h.stage.min(15)))
        player.hre.refinementEffect[1][0] = player.hre.refinementEffect[1][0].pow(player.hpu.purifiers[0].effect)
        if (inChallenge("hrm", 16)) player.hre.refinementEffect[1][0] = Decimal.pow(Decimal.div(2.16, player.h.stage).add(1), player.hre.refinement.sub(player.h.stage.div(2).floor().sub(1)).pow(Decimal.div(4.8, player.h.stage.max(5)))).pow(player.hpu.purifiers[0].effect)
        if (player.hre.refinement.gte(player.h.stage.div(2).floor())) player.hre.refinementEffect[1][1] = Decimal.pow(player.h.stage.div(2.15), player.hre.refinement.sub(player.h.stage.div(2).floor().sub(1))).pow(player.hpu.purifiers[0].effect)

        if (player.hre.refinement.gte(player.h.stage.mul(1.5).floor())) {
            let buff = hasUpgrade("hpw", 171) ? 2 : 1
            player.hre.refinementEffect[2][0] = Decimal.pow(Decimal.div(0.5*buff, player.h.stage).add(1), player.hre.refinement.sub(player.h.stage.mul(0.75).ceil()).pow(Decimal.div(3.6, player.h.stage.max(4))))
            if (inChallenge("hrm", 16)) player.hre.refinementEffect[2][0] = Decimal.pow(Decimal.div(0.36*buff, player.h.stage).add(1), player.hre.refinement.sub(player.h.stage.mul(0.75).floor()).pow(Decimal.div(3.6, player.h.stage.max(4))))
        }
        if (player.hre.refinement.gte(player.h.stage.mul(1.5).floor())) player.hre.refinementEffect[2][1] = Decimal.pow(player.h.stage.div(2.4), player.hre.refinement.sub(player.h.stage.mul(0.75).floor()))

        if (player.hre.refinement.gte(player.h.stage.mul(4))) player.hre.refinementEffect[3][0] = Decimal.pow(Decimal.div(3.6, player.h.stage).add(1).mul(hasUpgrade("tera", "hex9") ? Decimal.pow(1.3, player.h.externalRaise) : 1), player.hre.refinement.sub(player.h.stage.mul(4).sub(1)).pow(Decimal.div(3.6, player.h.stage.max(4))))
        if (player.hre.refinement.gte(player.h.stage.mul(4))) player.hre.refinementEffect[3][1] = Decimal.pow(player.h.stage.div(2.65), player.hre.refinement.sub(player.h.stage.mul(2)))

        if (player.hre.refinement.gte(player.h.stage.mul(8)) && !hasUpgrade("hpw", 91)) player.hre.refinementEffect[4][0] = Decimal.pow(Decimal.div(1.8, player.h.stage).add(1), player.hre.refinement.sub(player.h.stage.mul(8).sub(1)).pow(Decimal.div(3.6, player.h.stage.max(4))))
        if (player.hre.refinement.gte(player.h.stage.mul(8)) && hasUpgrade("hpw", 91)) player.hre.refinementEffect[4][0] = Decimal.pow(Decimal.div(3.6, player.h.stage).add(1), player.hre.refinement.sub(player.h.stage.mul(8).sub(1)).pow(Decimal.div(3.6, player.h.stage.max(4))))
        if (player.hre.refinement.gte(player.h.stage.mul(8))) player.hre.refinementEffect[4][1] = Decimal.pow(player.h.stage.div(3), player.hre.refinement.sub(player.h.stage.mul(4)))

        if (!hasUpgrade("hpw", 135) && player.hre.refinement.gte(player.h.stage.mul(12))) player.hre.refinementEffect[5][0] = player.hre.refinement.sub(player.h.stage.mul(12).sub(1)).pow(Decimal.div(4.8, player.h.stage.max(5))).div(player.h.stage).add(1)
        if (hasUpgrade("hpw", 135) && player.hre.refinement.gte(player.h.stage.mul(12))) player.hre.refinementEffect[5][0] = player.hre.refinement.sub(player.h.stage.mul(12).sub(1)).div(player.h.stage).add(1)
        if (player.hre.refinement.gte(player.h.stage.mul(12))) player.hre.refinementEffect[5][1] = Decimal.pow(player.h.stage.div(4), player.hre.refinement.sub(player.h.stage.mul(6)).pow(0.8))

        if (player.h.stage.gte(7) && player.hre.refinement.gte(player.h.stage.mul(16))) player.hre.refinementEffect[6][0] = player.hre.refinement.sub(player.h.stage.mul(16).sub(1)).pow(Decimal.div(10, player.h.stage)).div(player.h.stage).add(1)
        if (player.h.stage.gte(7) && player.hre.refinement.gte(player.h.stage.mul(16))) player.hre.refinementEffect[6][1] = Decimal.pow(player.h.stage.div(5), player.hre.refinement.sub(player.h.stage.mul(8)).pow(0.8))

        for (let i = 0; i < 6; i++) {
            player.hre.refinementEffect[i][1] = player.hre.refinementEffect[i][1].pow(player.hpu.purifiers[2].effect)
        }

        player.hre.tempererPerSec = new Decimal(0)
        if (hasUpgrade("hpw", 151)) {
            player.hre.tempererPerSec = Decimal.pow(Decimal.mul(1.2, buyableEffect("hre", 22)), player.hre.refinement.sub(player.h.stage.mul(10).sub(buyableEffect("hre", 21).sub(1))).add(1).max(0)).sub(1).mul(buyableEffect("hre", 23)).mul(player.h.tickspeed)
            player.hre.temperer = player.hre.temperer.add(player.hre.tempererPerSec.mul(delta))
        }
    },
    clickables: {
        1: {
            title() {
                if (inChallenge("hrm", 16)) return "<h2>Refine, but reset " + player.h.stageName[1] + " points.</h2><br><h3>Req: " + format(player.hre.refinementReq) + " " + player.h.stageName[0] + " Points</h3>"
                return "<h2>Refine, but reset " + player.h.stageName[1] + " points and provenance.</h2><br><h3>Req: " + format(player.hre.refinementReq) + " " + player.h.stageName[0] + " Points</h3>"
            },
            canClick() { return player.h.hexPoint.gt(0) && player.hre.refinementGain.gte(1) && (!hasMilestone("hre", 6) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                if (!hasMilestone("hre", 1)) player.hre.refinement = player.hre.refinement.add(1)
                if (hasMilestone("hre", 1)) player.hre.refinement = player.hre.refinement.add(player.hre.refinementGain)

                // RESET CODE
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
                let look = {width: "400px", minHeight: "100px", border: "2px solid white", borderRadius: "15px"}
                if (hasMilestone("hre", 6) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                this.canClick() ? look.color = "white" : look.color = "black"
                return look
            },
        },
    },
    buyables: {
        11: {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(100) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(5).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Reduce Log</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(150) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return player.h.stage.mul(5) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Decrease Req.</h3>\n\
                    Currently: -" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(200).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Base</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(150) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
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
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(150) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(150) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Improve Deposit</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(5).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Reduce Log</h3>\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(150) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Mult.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.hre.temperer},
            pay(amt) { player.hre.temperer = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(50).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Exp.</h3>\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + " Temperers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "177px", height: "80px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#aaa"
                return look
            },
        },
    },
    milestones: {
        1: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage) + " Refinements"},
            effectDescription: "Unlocks buy max refinements.",
            done() { return player.hre.refinement.gte(player.h.stage)},
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        2: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(2)) + " Refinements"},
            effectDescription() {return player.h.stageName[0] + " point formula now uses best celestial points."},
            done() { return player.hre.refinement.gte(player.h.stage.mul(2))},
            unlocked() { return hasMilestone("hre", 1) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        3: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(3)) + " Refinements"},
            effectDescription: "1st refiner no longer requires a refinement.",
            done() { return player.hre.refinement.gte(player.h.stage.mul(3))},
            unlocked() { return hasMilestone("hre", 2) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        4: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(4)) + " Refinements"},
            effectDescription: "Booster progress slightly boosts Booster effect.",
            done() { return player.hre.refinement.gte(player.h.stage.mul(4))},
            unlocked() { return hasMilestone("hre", 3) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        5: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(5)) + " Refinements"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Automate █-██████████ gain."
                return "Automate α-Provenance gain."
            },
            done() { return player.hre.refinement.gte(player.h.stage.mul(5))},
            unlocked() { return hasMilestone("hre", 4) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        6: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(6)) + " Refinements"},
            effectDescription: "Automate refinement gain.",
            done() { return player.hre.refinement.gte(player.h.stage.mul(6))},
            unlocked() { return hasMilestone("hre", 5) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        7: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(7)) + " Refinements"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Automate █-██████████ gain."
                return "Automate β-Provenance gain."
            },
            done() { return player.hre.refinement.gte(player.h.stage.mul(7))},
            unlocked() { return hasMilestone("hre", 6) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        8: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(8)) + " Refinements"},
            effectDescription: "Unlock blessing autoclicker.",
            done() { return player.hre.refinement.gte(player.h.stage.mul(8))},
            unlocked() { return hasMilestone("hre", 7) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        9: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(9)) + " Refinements"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Automate █-██████████ gain."
                return "Automate γ-Provenance gain."
            },
            done() { return player.hre.refinement.gte(player.h.stage.mul(9))},
            unlocked() { return hasMilestone("hre", 8) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        10: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(10)) + " Refinements"},
            effectDescription() {return "+" + formatSimple(player.h.stage.div(10)) + " base curse gain."},
            done() { return player.hre.refinement.gte(player.h.stage.mul(10))},
            unlocked() { return hasMilestone("hre", 9) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        11: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(12)) + " Refinements"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Automate █-██████████ gain."
                return "Automate δ-Provenance gain."
            },
            done() { return player.hre.refinement.gte(player.h.stage.mul(12))},
            unlocked() { return hasMilestone("hre", 10) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        12: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(14)) + " Refinements"},
            effectDescription: "Automate jinxes.",
            done() { return player.hre.refinement.gte(player.h.stage.mul(14))},
            unlocked() { return hasMilestone("hre", 11) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        13: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(16)) + " Refinements"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Automate █-██████████ gain."
                return "Automate ε-Provenance gain."
            },
            done() { return player.hre.refinement.gte(player.h.stage.mul(16))},
            unlocked() { return hasMilestone("hre", 12) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        14: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(18)) + " Refinements"},
            effectDescription: "Automate purity gain.",
            done() { return player.hre.refinement.gte(player.h.stage.mul(18))},
            unlocked() { return hasMilestone("hre", 13) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
        15: {
            requirementDescription() {return "<h3>" + formatWhole(player.h.stage.mul(20)) + " Refinements"},
            effectDescription() {
                if (inChallenge("hrm", 16)) return "Automate █-██████████ gain."
                return "Automate ζ-Provenance gain."
            },
            done() { return player.hre.refinement.gte(player.h.stage.mul(20))},
            unlocked() { return hasMilestone("hre", 14) },
            style: {width: "500px", height: "50px", color: "rgba(0,0,0,0.5)", border: "5px solid rgba(0,0,0,0.5)", borderRadius: "10px", margin: "-2.5px"},
        },
    },
    microtabs: {
        refine: {
            "Refiners": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "5px"],
                    ["row", [
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 1", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[0][0]) + "<br>" + player.h.stageName[0] + " Points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(1) || hasMilestone("hre", 3) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[0][1]) + "<br>Factor Power"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(1) || hasMilestone("hre", 3) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(1, player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(1) && !hasMilestone("hre", 3) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.hre.refinement.gte(1) || hasMilestone("hre", 3) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 2", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return inChallenge("hrm", 16) ? "/" + format(player.hre.refinementEffect[1][0]) + "<br>Refinement Req" : "/" + format(player.hre.refinementEffect[1][0]) + "<br>Provenance Req's"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.div(2).floor()) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[1][1]) + "<br>Prestige Points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.div(2).floor()) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(player.h.stage.div(2).floor(), player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(player.h.stage.div(2).floor()) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.hre.refinement.gte(player.h.stage.div(2).floor()) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 3", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return inChallenge("hrm", 16) ? "^" + format(player.hre.refinementEffect[2][0]) + "<br>Refiner 1 Effects" : "x" + format(player.hre.refinementEffect[2][0]) + "<br>Provenance Effects"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(1.5).floor()) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[2][1]) + "<br>Trees"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(1.5).floor()) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(player.h.stage.mul(1.5).floor(), player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(player.h.stage.mul(1.5).floor()) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.hre.refinement.gte(player.h.stage.mul(1.5).floor()) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 4", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[3][0]) + "<br>Boons"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(4)) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[3][1]) + "<br>Grass"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(4)) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(player.h.stage.mul(4), player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(player.h.stage.mul(4)) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.hre.refinement.gte(player.h.stage.mul(4)) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                    ]],
                    ["row", [
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 5", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[4][0]) + "<br>Blessings"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(8)) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[4][1]) + "<br>Grasshoppers"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(8)) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(player.h.stage.mul(8), player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(player.h.stage.mul(8)) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.hre.refinement.gte(player.h.stage.mul(8)) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 6", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[5][0]) + "<br>Power"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(12)) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[5][1]) + "<br>Pre-OTF"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(12)) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(player.h.stage.mul(12), player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(player.h.stage.mul(12)) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.hre.refinement.gte(player.h.stage.mul(12)) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", "Refiner 7", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "150px", height: "36px", backgroundColor: "#333", borderBottom: "2px solid white", borderRadius: "10px 10px 0px 0px"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[6][0]) + "<br>Pre-Power SPVs"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(16)) ? {width: "150px", height: "40px", borderBottom: "2px solid white"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + format(player.hre.refinementEffect[6][1]) + "<br>Post-OTF"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.gte(player.h.stage.mul(16)) ? {width: "150px", height: "40px"} : {display: "none !important"}}],
                            ["style-column", [
                                ["raw-html", () => {
                                    let amt = Decimal.sub(player.h.stage.mul(16), player.hre.refinement)
                                    return amt.eq(1) ? "Unlocked in " + formatWhole(amt) + " refinement" : "Unlocked in " + formatWhole(amt) + " refinements"
                                }, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {return player.hre.refinement.lt(player.h.stage.mul(16)) ? {width: "150px", height: "82px"} : {display: "none !important"}}],
                        ], () => {return player.h.stage.lt(7) ? {display: "none !important"} : player.hre.refinement.gte(player.h.stage.mul(16)) ? {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {width: "150px", height: "120px", backgroundColor: "#222", border: "2px solid white", margin: "5px", borderRadius: "10px", filter: "brightness(50%)", userSelect: "none"}}],
                    ]],
                ]
            },
            "Tempering": {
                buttonStyle() {return {borderRadius: "5px"}},
                unlocked() {return hasUpgrade("hpw", 151)},
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["tooltip-row", [
                            ["raw-html", () => {return "You have " + formatSimple(player.hre.temperer, 2) + " temperers"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ["raw-html", () => {return player.hre.tempererPerSec.eq(0) ? "<span style='color:gray'>(+0/s)</span>" : player.hre.tempererPerSec.gt(0) ? "(+" + formatSimple(player.hre.tempererPerSec, 2) + "/s)" : "<span style='color:red'>(" + format(player.hre.tempererPerSec) + "/s)</span>" }, {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                            ["raw-html", () => {
                                let str = "<div class='bottomTooltip'>Base Formula<hr><small>(" + formatSimple(Decimal.mul(1.2, buyableEffect("hre", 22)), 2) + "^(Refinements-" + formatWhole(player.h.stage.mul(10).sub(1).sub(buyableEffect("hre", 21).sub(1))) + ")-1)"
                                if (buyableEffect("hre", 23).gte(1)) str = str.concat("x" + formatSimple(buyableEffect("hre", 23)))
                                return str + "</small></div>"
                            }],
                        ]],
                        ["raw-html", () => {return "<i>Temperer production requires at least " + formatSimple(Decimal.sub(70, buyableEffect("hre", 21).sub(1))) + " refinements</i>"}, {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "740px", height: "60px", background: "#444", border: "3px solid white", borderRadius: "20px 20px 0 0"}],
                    ["style-row", [
                        ["style-column", [
                            ["raw-html", () => {return player.h.stageName[0] + " Points"}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", "<i>Based on Celestial Points</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "200px", height: "120px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "Log" + formatSimple(player.h.stage.max(2).sub(1).div(buyableEffect("hre", 11)).add(1))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 11],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "x" + formatSimple(Decimal.mul(player.h.stage.max(1), buyableEffect("hre", 12)))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 12],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "^" + formatSimple(Decimal.div(3.6, player.h.stage.max(4)).mul(buyableEffect("hre", 13)), 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 13],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                    ], {width: "740px", height: "120px", background: "#000e26", border: "3px solid white", marginTop: "-3px"}],
                    ["style-row", [
                        ["style-column", [
                            ["raw-html", "Temperers", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", "<i>Based on Refinements</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "200px", height: "120px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "-" + formatSimple(player.h.stage.mul(10).sub(1).sub(buyableEffect("hre", 21).sub(1)))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 21],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return formatSimple(Decimal.mul(1.2, buyableEffect("hre", 22)), 3) + "^"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 22],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "x" + formatSimple(buyableEffect("hre", 23))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 23],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                    ], {width: "740px", height: "120px", background: "#222", border: "3px solid white", marginTop: "-3px"}],
                    ["style-row", [
                        ["style-column", [
                            ["raw-html", "Blessings", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", "<i>Based on Refinements</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "200px", height: "120px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {
                                    let eff = Decimal.sub(buyableEffect("hre", 31).sub(1), player.h.stage.mul(2).sub(1))
                                    if (eff.gte(0)) return "+" + formatSimple(eff)
                                    return formatSimple(eff)
                                }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 31],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "x" + formatSimple(buyableEffect("hre", 32))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 32],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "^" + formatSimple(Decimal.div(3.6, player.h.stage.max(4)).add(1).mul(buyableEffect("hre", 33)), 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 33],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                    ], {width: "740px", height: "120px", background: "#261c00", border: "3px solid white", marginTop: "-3px"}],
                    ["style-row", [
                        ["style-column", [
                            ["raw-html", "Boons", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", "<i>Based on Blessings</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "200px", height: "120px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "^" + formatSimple(Decimal.div(3.6, player.h.stage.max(4)).add(1).mul(buyableEffect("hre", 41)), 2)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 41],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {
                                    let eff = Decimal.div(buyableEffect("hre", 42), player.h.stage)
                                    if (eff.gte(1)) return "x" + formatSimple(eff)
                                    return "/" + formatSimple(Decimal.div(1, eff))
                                }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 42],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return formatSimple(upgradeEffect("hpw", 52).sub(1).mul(100)) + "% Deposited/s"}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 43],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                    ], {width: "740px", height: "120px", background: "#1e1600", border: "3px solid white", marginTop: "-3px"}],
                    ["style-row", [
                        ["style-column", [
                            ["raw-html", "Curses", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", "<i>Based on Blessings</i>", {color: "#ccc", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "200px", height: "120px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "Log" + formatSimple(player.h.stage.max(2).sub(1).div(buyableEffect("hre", 51)).add(1))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 51],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "x" + formatSimple(buyableEffect("hre", 52))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 52],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", () => {return "^" + formatSimple(buyableEffect("hre", 53), 2)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "177px", height: "37px", borderBottom: "3px solid white"}],
                            ["style-row", [
                                ["buyable", 53],
                            ], {width: "177px", height: "80px"}],
                        ], {width: "177px", height: "120px", borderLeft: "3px solid white"}],
                    ], {width: "740px", height: "120px", background: "#232b2b", border: "3px solid white", marginTop: "-3px"}],
                    ["style-column", [
                        ["raw-html", "<i>Buyables are in the same order as formula operators</i>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", "<i>Tempering only resets on power level resets and above</i>", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ], {width: "740px", height: "45px", background: "#444", lineHeight: "1.2", border: "3px solid white", borderRadius: "0 0 20px 20px", marginTop: "-3px"}]
                ],
            },
            "Milestones": {
                buttonStyle() { return {borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["raw-html", "Milestones kept on later resets.", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                    ["blank", "5px"],
                    ["milestone", 1],
                    ["milestone", 2],
                    ["milestone", 3],
                    ["milestone", 4],
                    ["milestone", 5],
                    ["milestone", 6],
                    ["milestone", 7],
                    ["milestone", 8],
                    ["milestone", 9],
                    ["milestone", 10],
                    ["milestone", 11],
                    ["milestone", 12],
                    ["milestone", 13],
                    ["milestone", 14],
                    ["milestone", 15],
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
        ["style-row", [["raw-html", () => {return layers.h.effects()}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}]], {lineHeight: "1"}],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return player.h.stageName[0] + " of Refinement"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#333", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["row", [
            ["raw-html", () => {return player.hre.refinement.neq(1) ? "You are at <h3>" + formatWhole(player.hre.refinement) + "</h3> refinements." : "You are at <h3>" + formatWhole(player.hre.refinement) + "</h3> refinement." }, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return hasMilestone("hre", 1) ? "(+" + formatWhole(player.hre.refinementGain) + ")" : "" }, () => {
                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                player.hre.refinementGain.gt(0) ? look.color = "white" : look.color = "gray"
                return look
            }],
            ["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["blank", "10px"],
        ["clickable", 1],
        ["blank", "5px"],
        ["microtabs", "refine", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return true }, // Decides if this node is shown or not.
});
addLayer("mse", {
    name: "Source Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SE", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        ki: new Decimal(0),
        kiPerSec: new Decimal(0),
        kiMult: new Decimal(1),

        miasma: new Decimal(0),
        tempMiasma: new Decimal(0),
        miasmaCap: new Decimal(5),
        storedMiasma: new Decimal(0),

        sourceEnergy: new Decimal(0),
        sourceEnergyGain: new Decimal(0),

        zoom: 1,
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#87d2d0, #5ab28c)",
            backgroundOrigin: "border-box",
            borderColor: "rgba(0,0,0,0.6)",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Source Energy",
    branches: [],
    color: "#be6eec",
    update(delta) {
        let onepersec = new Decimal(1)

        player.mse.kiPerSec = new Decimal(0.1)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mdb.focusEffect)
        if (player.mdb.active.gt(0)) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mdb.focusActive)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[1].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[2].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[5].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[6].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[9].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[10].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[11].effect)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mme.meridian[12].effect)

        player.mse.kiPerSec = player.mse.kiPerSec.pow(player.mme.meridian[0].effect[1])

        if (player.sma.inStarmetalChallenge && player.dotf.miasmata) player.mse.ki = player.mse.ki.add(player.mse.kiPerSec.mul(delta))

        player.mse.sourceEnergyBase = player.mse.miasma.add(1).log(10).div(10)
        player.mse.kiMult = Decimal.pow(1.1, player.mse.ki.add(1).log(10))

        player.mse.sourceEnergyGain = player.mse.sourceEnergyBase
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mse.kiMult)
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridianEffect)
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridian[0].effect[0])

        player.mse.miasmaCap = new Decimal(5)
        if (player.mse.tempMiasma.gt(0) && player.mdb.active.lte(0)) {
            player.mse.tempMiasma = player.mse.tempMiasma.sub(player.mse.tempMiasma.div(10).max(0.1).mul(delta)).max(0)

        }
    },
    resetCheck() {
        if (player.mse.miasma.add(player.mse.tempMiasma).gte(player.mse.miasmaCap)) {
            // Re-Calc Source Energy Gain
            player.mse.sourceEnergyGain = player.mse.sourceEnergyBase
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mse.kiMult)
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridianEffect)
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridian[0].effect[0])

            // Gain Special Resources
            player.mse.sourceEnergy = player.mse.sourceEnergy.add(player.mse.sourceEnergyGain)
            player.mse.storedMiasma = player.mse.storedMiasma.add(player.mse.miasma)

            // Reset
            player.mse.sourceEnergyGain = player.mse.sourceEnergyBase
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            player.mse.miasma = new Decimal(0)
            
            for (let i = 0; i < 21; i++) {
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
                if (i != 0) player.mme.meridian[i].effect = new Decimal(1)
                else player.mme.meridian[i].effect = [new Decimal(1), new Decimal(1)]
            }
            player.mse.meridianSelect = 0
            
            return true
        } else return false
    },
    effects() {
        let str = ""
        str = "You have <h3>" + formatSimple(player.mse.ki) + "</h3> Ki"
        if (player.mse.kiPerSec.gt(0)) str = str.concat("<br><small>(+" + formatSimple(player.mse.kiPerSec) + "/s)</small>")
        if (player.mse.kiPerSec.lt(0)) str = str.concat("<br><small>(" + formatSimple(player.mse.kiPerSec) + "/s)</small>")
        return str
    },
    clickables: {
        1: {
            title: "Upgrades",
            canClick() {return player.subtabs.mse["stuff"] != "Upgrades"},
            unlocked() {return true},
            onClick() {
                player.subtabs.mse["stuff"] = "Upgrades"
            },
            style() {
                let look = {width: "265px", minHeight: "37px", fontSize: "12px", color: "white", border: "3px solid #3e7c62", borderRadius: "0px"}
                if (this.canClick()) {look.backgroundColor = "#2d5946"} else {look.backgroundColor = "#1b352a"}
                return look
            },
        },
        2: {
            title: "Milestones",
            canClick() {return player.subtabs.mse["stuff"] != "Milestones"},
            unlocked: true,
            onClick() {
                player.subtabs.mse["stuff"] = "Milestones"
            },
            style() {
                let look = {width: "264px", minHeight: "37px", fontSize: "12px", color: "white", border: "3px solid #3e7c62", borderRadius: "0px"}
                if (this.canClick()) {look.backgroundColor = "#2d5946"} else {look.backgroundColor = "#1b352a"}
                return look
            },
        },
        3: {
            title: "Stats",
            canClick() {return player.subtabs.mse["stuff"] != "Stats"},
            unlocked: true,
            onClick() {
                player.subtabs.mse["stuff"] = "Stats"
            },
            style() {
                let look = {width: "265px", minHeight: "37px", fontSize: "12px", color: "white", border: "3px solid #3e7c62", borderRadius: "0px"}
                if (this.canClick()) {look.backgroundColor = "#2d5946"} else {look.backgroundColor = "#1b352a"}
                return look
            },
        },
    },
    bars: {
        miasmaBar: {
            unlocked: true,
            direction: RIGHT,
            width: 350,
            height: 40,
            progress() {
                return player.mse.miasma.add(player.mse.tempMiasma).div(player.mse.miasmaCap)
            },
            borderStyle: {border: "3px solid #602424", borderLeftWidth: "2px", borderRadius: "0 20px 20px 0"},
            baseStyle: {backgroundColor: "#1b0808"},
            fillStyle() {return {background: `linear-gradient(to right, #361010 ${format(player.mse.miasma.div(player.mse.miasmaCap).mul(100).min(100))}%, 
                #4d1d1d ${format(player.mse.miasma.div(player.mse.miasmaCap).mul(100).add(0.25).min(100))}%, 
                #4d1d1d ${format(player.mse.miasma.add(player.mse.tempMiasma).div(player.mse.miasmaCap).mul(100).add(0.25).min(100))}%, 
                #00000000 ${format(player.mse.miasma.add(player.mse.tempMiasma).div(player.mse.miasmaCap).mul(100).add(0.5).min(100))}%)`}},
            textStyle: {color: "white", fontSize: "20px", lineHeight: "0.8", fontFamily: "monospace"},
            display() {
                if (player.mse.tempMiasma.gt(0)) return formatSimple(player.mse.miasma) + " + " + formatSimple(player.mse.tempMiasma) + "/" + formatSimple(player.mse.miasmaCap) + " Miasma"
                return formatSimple(player.mse.miasma) + "/" + formatSimple(player.mse.miasmaCap) + " Miasma"
            },
        },
    },
    buyables: {
        111: {
            costBase() { return new Decimal(1e8) },
            costGrowth() { return new Decimal(30) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(300), getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Improve Lu:P effect based on Lu:P Level\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "<br>" +
                    "Next: ^" + formatSimple(Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(300), getBuyableAmount(this.layer, this.id).add(1)).add(1), 3) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "1740px", top: "760px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        112: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(500) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Lu:P Requirement by 2%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.02, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "1760px", top: "610px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        113: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Lu:P Penalty by 5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "1780px", top: "460px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        121: {
            costBase() { return new Decimal(1e10) },
            costGrowth() { return new Decimal(30) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(350), getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Improve He:P effect based on He:P Level\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "<br>" +
                    "Next: ^" + formatSimple(Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(350), getBuyableAmount(this.layer, this.id).add(1)).add(1), 3) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "1990px", top: "890px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        122: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(500) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce He:P Requirement by 2%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.02, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2120px", top: "760px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        123: {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce He:P Penalty by 5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2250px", top: "630px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        131: {
            costBase() { return new Decimal(1e12) },
            costGrowth() { return new Decimal(30) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(400), getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Improve Pe:P effect based on Pe:P Level\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "<br>" +
                    "Next: ^" + formatSimple(Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(400), getBuyableAmount(this.layer, this.id).add(1)).add(1), 3) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2120px", top: "1140px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        132: {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(500) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Pe:P Requirement by 2%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.02, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2270px", top: "1120px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        133: {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Pe:P Penalty by 5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2420px", top: "1100px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        141: {
            costBase() { return new Decimal(1e14) },
            costGrowth() { return new Decimal(30) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(450), getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Improve YaL:V effect based on YaL:V Level\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "<br>" +
                    "Next: ^" + formatSimple(Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(450), getBuyableAmount(this.layer, this.id).add(1)).add(1), 3) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "1960px", top: "660px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        142: {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(500) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce YaL:V Requirement by 2%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.02, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2020px", top: "510px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        143: {
            costBase() { return new Decimal(10000) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce YaL:V Penalty by 5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2080px", top: "360px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        151: {
            costBase() { return new Decimal(1e16) },
            costGrowth() { return new Decimal(30) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(500), getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Improve YaH:V effect based on YaH:V Level\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 3) + "<br>" +
                    "Next: ^" + formatSimple(Decimal.mul(player.mme.meridian[1].level.add(1).log(10).pow(0.3).div(500), getBuyableAmount(this.layer, this.id).add(1)).add(1), 3) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2220px", top: "920px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        152: {
            costBase() { return new Decimal(10000) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(500) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce YaH:V Requirement by 2%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.02, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2370px", top: "860px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        153: {
            costBase() { return new Decimal(100000) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce YaH:V Penalty by 5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
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
            style() {
                let look = {position: "absolute", left: "2520px", top: "800px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
    },
    milestones: {
        11: {
            requirementDescription: "5 Stored Miasma",
            effectDescription() { return "???" },
            done() { return player.mse.storedMiasma.gte(5) },
            style() {
                let look = {width: "687px", minHeight: "75px", color: "white", border: "3px solid #4d1d1d", borderTop: "0px", borderRadius: "0px"}
                if (hasMilestone("mse", this.id)) {look.backgroundColor = "#1a3b0f"} else {look.backgroundColor = "#361e1e"}
                return look
            },
        },
    },
    microtabs: {
        stuff: {
            "Upgrades": {
                buttonStyle() { return { border: "2px solid #5ab28c", borderRadius: "10px" } },
                unlocked() { return true },
                content: [
                    ["centered-draggable-scroll-row", [
                        ["style-row", [
                            ["buyable", 111], ["buyable", 112], ["buyable", 113],
                            ["buyable", 121], ["buyable", 122], ["buyable", 123],
                            ["buyable", 131], ["buyable", 132], ["buyable", 133],
                            ["buyable", 141], ["buyable", 142], ["buyable", 143],
                            ["buyable", 151], ["buyable", 152], ["buyable", 153],
                        ], () => {return {position: "relative", background: "repeating-linear-gradient(135deg, #87d2d022 0 15px, #87d2d033 0 30px)", width: "3000px", height: "3000px", zoom: player.mse.zoom}}],
                    ], {border: "3px solid #5ab28c", width: "800px", height: "700px", flexFlow: "column"}],
                ]
            },
            "Milestones": {
                buttonStyle() { return { border: "2px solid #5ab28c", borderRadius: "10px" } },
                unlocked() { return true },
                content: [
                    ["style-column", [
                        ["always-scroll-column", [
                            ["style-row", [
                                ["raw-html", () => {return "You have " + formatSimple(player.mse.storedMiasma) + " stored miasma"}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ], {backgroundColor: "#361010", borderBottom: "3px solid #4d1d1d", borderRight: "3px solid #4d1d1d", width: "776px", height: "40px"}],
                            ["style-row", [
                                ["style-column", [
                                    ["raw-html", "5", {color: "white", fontSize: "32px", fontFamily: "monospace"}],
                                ], {backgroundColor: "#361010", borderBottom: "3px solid #4d1d1d", borderRight: "0px", borderTop: "0px", borderRadius: "0px", width: "75px", height: "75px"}],
                                ["titleless-milestone", 11],
                            ]],
                        ], {width: "794px", height: "694px", background: "#111", border: "3px solid #4d1d1d"}],
                    ], {border: "3px solid #5ab28c", width: "800px", height: "700px"}],
                ]
            },
            "Stats": {
                buttonStyle() { return { border: "2px solid #5ab28c", borderRadius: "10px" } },
                unlocked() { return true },
                content: [
                    ["top-column", [
                        ["style-row", [
                            ["style-column", [
                                ["raw-html", "Base Source Energy Gain<br>(Based on Miasma)", {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "200px", height: "40px", lineHeight: "0.8", background: "#1b352a", borderRight: "3px solid #5ab28c"}],
                            ["style-column", [
                                ["raw-html", () => {return formatSimple(player.mse.sourceEnergyBase)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "597px", height: "40px", background: "#12231c"}],
                        ], {width: "800px", height: "40px", background: "#1b352a", borderBottom: "3px solid #5ab28c"}],
                        ["style-row", [
                            ["style-column", [
                                ["raw-html", "Ki Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "200px", height: "40px", lineHeight: "0.8", background: "#1b352a", borderRight: "3px solid #5ab28c"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + formatSimple(player.mse.kiMult, 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "597px", height: "40px", background: "#12231c"}],
                        ], {width: "800px", height: "40px", background: "#1b352a", borderBottom: "3px solid #5ab28c"}],
                        ["style-row", [
                            ["style-column", [
                                ["raw-html", "Meridian Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "200px", height: "40px", lineHeight: "0.8", background: "#1b352a", borderRight: "3px solid #5ab28c"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + formatSimple(player.mme.meridianEffect, 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "597px", height: "40px", background: "#12231c"}],
                        ], {width: "800px", height: "40px", background: "#1b352a", borderBottom: "3px solid #5ab28c"}],
                        ["style-row", [
                            ["style-column", [
                                ["raw-html", "Hara Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "200px", height: "40px", lineHeight: "0.8", background: "#1b352a", borderRight: "3px solid #5ab28c"}],
                            ["style-column", [
                                ["raw-html", () => {return "x" + formatSimple(player.mme.meridian[0].effect[0], 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "597px", height: "40px", background: "#12231c"}],
                        ], {width: "800px", height: "40px", background: "#1b352a", borderBottom: "3px solid #5ab28c"}],
                    ], {background: "#09110e88", border: "3px solid #5ab28c", width: "800px", height: "700px"}],
                ]
            },
        },
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["bar", "miasmaBar"],
        ], {width: "710px", height: "46px"}],
        ["blank", "25px"],
        ["style-row", [
            ["raw-html", () => {return "You have " + formatSimple(player.mse.sourceEnergy, 2) + " Source Energy (+" + formatSimple(player.mse.sourceEnergyGain, 2) + ")"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ], {width: "800px", height: "37px", background: "#87d2d044", border: "3px solid #5ab28c", borderRadius: "20px 20px 0 0"}],
        ["style-row", [
            ["clickable", 1], ["style-row", [], {width: "3px", height: "37px", background: "#5ab28c"}], ["clickable", 2], ["style-row", [], {width: "3px", height: "37px", background: "#5ab28c"}], ["clickable", 3]
        ], {width: "800px", height: "37px", background: "#87d2d022", borderLeft: "3px solid #5ab28c", borderRight: "3px solid #5ab28c"}],
        ["buttonless-microtabs", "stuff", { 'border-width': '0px' }],
        ["style-row", [
            ["style-row", [["raw-html", "Zoom<br>Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}]], {width: "100px", height: "37px", lineHeight: "1", borderLeft: "3px solid #5ab28c"}],
            ["text-input", "zoom", {backgroundColor: "#12231c", color: "white", width: "230px", height: "37px", padding: "0 10px", textAlign: "left", fontSize: "28px", border: "0px", borderLeft: "3px solid #5ab28c", borderRight: "3px solid #5ab28c"}],
        ], {width: "800px", height: "37px", background: "#87d2d044", border: "3px solid #5ab28c", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
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
        highestKi: new Decimal(0),

        miasma: new Decimal(0),
        tempMiasma: new Decimal(0),
        miasmaCap: new Decimal(5),

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

        player.mse.kiPerSec = new Decimal(0.2)
        player.mse.kiPerSec = player.mse.kiPerSec.add(buyableEffect("mse", 1).sub(1))
        if (hasMilestone("mci", 11)) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mci.flowEffects[0])
        if (hasUpgrade("mcu", 12)) player.mse.kiPerSec = player.mse.kiPerSec.mul(upgradeEffect("mcu", 12))
        if (player.mcu.mantraSelected == 11) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mcu.mantraEffects[11])
        if (player.mcu.mantraSelected == 12) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mcu.mantraEffects[12])
        if (hasUpgrade("mcu", 15)) player.mse.kiPerSec = player.mse.kiPerSec.mul(upgradeEffect("mcu", 15))
        if (getBuyableAmount("mse", 0).gt(0)) player.mse.kiPerSec = player.mse.kiPerSec.mul(1.5)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(buyableEffect("mse", 2))
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

        player.mse.kiPerSec = player.mse.kiPerSec.pow(Decimal.pow(1.01, player.mme.meridian[0].level))

        if (player.sma.inStarmetalChallenge && player.dotf.miasmata) player.mse.ki = player.mse.ki.add(player.mse.kiPerSec.mul(delta))
        if (player.mse.ki.gt(player.mse.highestKi)) player.mse.highestKi = player.mse.ki

        player.mse.sourceEnergyBase = player.mse.miasma.div(5)

        player.mse.sourceEnergyGain = player.mse.sourceEnergyBase
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(buyableEffect("mse", 21))
        //player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridianEffect)
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(Decimal.pow(1.5, player.mme.meridian[0].level))

        player.mse.miasmaCap = new Decimal(5)
        if (getBuyableAmount("mse", 0).gt(0)) player.mse.miasmaCap = player.mse.miasmaCap.add(3)
        player.mse.miasmaCap = player.mse.miasmaCap.add(buyableEffect("mse", 11).sub(1))
        if (hasMilestone("mci", 15)) player.mse.miasmaCap = player.mse.miasmaCap.add(player.mci.flowEffects[4])
        player.mse.miasmaCap = player.mse.miasmaCap.mul(buyableEffect("mse", 12))

        if (player.mse.tempMiasma.gt(0) && player.mdb.active.lte(0)) {
            player.mse.tempMiasma = player.mse.tempMiasma.sub(player.mse.tempMiasma.div(10).max(0.1).mul(delta)).max(0)

        }
    },
    resetCheck() {
        if (player.mse.miasma.add(player.mse.tempMiasma).gte(player.mse.miasmaCap)) {
            // Cap Miasma
            player.mse.miasma = player.mse.miasma.min(player.mse.miasmaCap)

            // Re-Calc Source Energy Gain
            player.mse.sourceEnergyGain = player.mse.miasma.max(1).log(5)
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(buyableEffect("mse", 21))
            //player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridianEffect)
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(Decimal.pow(1.5, player.mme.meridian[0].level))

            // Gain Special Resources
            player.mse.sourceEnergy = player.mse.sourceEnergy.add(player.mse.sourceEnergyGain)

            // Reset
            player.tab = "mcu"
            player.mse.sourceEnergyGain = player.mse.sourceEnergyBase
            player.mse.ki = new Decimal(0)
            player.mse.highestKi = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            player.mse.miasma = new Decimal(0)

            // Cultivation
            player.subtabs["mcu"]["stuff"] = "Upgrades"
            player.mcu.upgrades.splice(0, player.mcu.upgrades.length)
            player.mcu.mantraSelected = 0
            
            // Circulation
            player.mci.circAmt = new Decimal(0)
            player.mci.circCurrent = new Decimal(0)
            player.mci.circSpeed = new Decimal(1)
            player.mci.circMax = new Decimal(5)
            
            player.mci.concentrateLow = 40
            player.mci.concentrateHigh = 60
            player.mci.concentrateBuff = new Decimal(1)
            
            player.mci.flow = new Decimal(0)
            player.mci.flowGain = new Decimal(0)
            for (let i in player.mci.flowEffects) {
                player.mci.flowEffects[i] = new Decimal(1)
            }

            player.mci.milestones.splice(0, player.mci.milestones.length)

            // Meridian
            for (let i = 0; i < 21; i++) {
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0); player.mme.meridian[i].cap = new Decimal(1)
                if (i != 0) player.mme.meridian[i].effect = new Decimal(1)
                else player.mme.meridian[i].effect = [new Decimal(1), new Decimal(1)]
            }
            player.mse.meridianSelect = 0

            // Deep Breathing
            player.mdb.focus = new Decimal(0)
            player.mdb.focusGain = new Decimal(0)
            player.mdb.focusPerSec = new Decimal(0)
            player.mdb.focusActive = new Decimal(1)
            player.mdb.focusEffect = new Decimal(1)

            player.mdb.active = new Decimal(0)

            player.mdb.upgrades.splice(0, player.mdb.upgrades.length)
            
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
        0: {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(1) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    Boost ki gain by +50% and miasma cap by +3\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(new Decimal(1))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "2440px", top: "2440px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        1: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(16) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(20).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables[1], 0)},
            branches: [0],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase base Ki gain by +0.05\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1), 2) + "<br>" +
                    "Next: +" + formatSimple(getBuyableAmount(this.layer, this.id).add(1).div(20), 2) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
                    let buyonecost = new Decimal(this.costGrowth()).mul(getBuyableAmount(this.layer, this.id)).add(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordArithmeticSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    let cost = Decimal.sumArithmeticSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {position: "absolute", left: "2370px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        2: {
            costBase() { return new Decimal(3) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(4).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            branches: [1],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Boost Ki gain by +25%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).div(4).add(1.25), 2) + "\n\
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
                let look = {position: "absolute", left: "2230px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        3: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            branches: [2],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase exponent on \"Concentrated Gains\" effect by +0.2\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: ^" + formatSimple(getBuyableAmount(this.layer, this.id).add(1.2)) + "\n\
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
                let look = {position: "absolute", left: "2090px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        4: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    TEMP\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).add(2)) + "\n\
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
                let look = {position: "absolute", left: "2300px", top: "1880px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        11: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(1) },
            purchaseLimit() { return new Decimal(7) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            branches: [0],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase miasma cap by +1\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "<br>" +
                    "Next: +" + formatSimple(getBuyableAmount(this.layer, this.id).add(1)) + "\n\
                    </span></div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                if (mult != true) {
                    let buyonecost = new Decimal(this.costGrowth()).mul(getBuyableAmount(this.layer, this.id)).add(this.costBase())
                    this.pay(buyonecost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                } else {
                    let max = Decimal.affordArithmeticSeries(this.currency(), this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    if (max.gt(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))) { max = this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)) }
                    let cost = Decimal.sumArithmeticSeries(max, this.costBase(), this.costGrowth(), getBuyableAmount(this.layer, this.id))
                    this.pay(cost)

                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                let look = {position: "absolute", left: "2510px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#260e0e"
                return look
            }
        },
        12: {
            costBase() { return new Decimal(3) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            branches: [11],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase miasma cap by +20%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).div(5).add(1.2)) + "\n\
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
                let look = {position: "absolute", left: "2650px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#260e0e"
                return look
            }
        },
        13: {
            costBase() { return new Decimal(5) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    TEMP\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).add(2)) + "\n\
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
                let look = {position: "absolute", left: "2580px", top: "1880px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#260e0e"
                return look
            }
        },
        21: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id)
                if (amt.gt(0)) return Decimal.pow(amt.div(20).add(1), player.mse.highestKi.add(1).log(10))
                else return new Decimal(1)
                return getBuyableAmount(this.layer, this.id).add(1)
            },
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            branches: [2],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Boost source energy gain based on highest ki in this SE reset\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(getBuyableAmount(this.layer, this.id).div(20).add(1.05), player.mse.highestKi.add(1).log(10)), 2) + "\n\
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
                let look = {position: "absolute", left: "2090px", top: "2160px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #2d5946", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#12231c"
                return look
            }
        },
        22: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    TEMP\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).add(2)) + "\n\
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
                let look = {position: "absolute", left: "2440px", top: "1985px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #2d5946", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#12231c"
                return look
            }
        },
        23: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    TEMP\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).add(2)) + "\n\
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
                let look = {position: "absolute", left: "2440px", top: "1775px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #2d5946", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#12231c"
                return look
            }
        },
        /*
        2: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(15) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Unlock new Meridian nodes\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: +" + formatSimple(getBuyableAmount(this.layer, this.id).add(1)) + "\n\
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
                let look = {position: "absolute", left: "1580px", top: "1300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        3: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Unlock Deep Breathing, boost focus gain by 10%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(1.1, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
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
                let look = {position: "absolute", left: "1600px", top: "1440px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #555566", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#19191e"
                return look
            }
        },
        4: {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Unlock Cleansing, boost cleanse gain by 10%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(1.1, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
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
                let look = {position: "absolute", left: "1580px", top: "1580px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #512800", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#140a00"
                return look
            }
        },
        */
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
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Lu:P Requirement by 5%\
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
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Pe:P Requirement by 5%\
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
        ["centered-draggable-scroll-row", [
            ["style-row", [
                ["buyable", 0],
                ["buyable", 1], ["buyable", 2], ["buyable", 3], ["buyable", 4],
                ["buyable", 21], ["buyable", 22], ["buyable", 23],
                ["buyable", 11], ["buyable", 12], ["buyable", 13], ["buyable", 14],
                ["buyable", 111], ["buyable", 112], ["buyable", 113],
                ["buyable", 121], ["buyable", 122], ["buyable", 123],
                ["buyable", 131], ["buyable", 132], ["buyable", 133],
                ["buyable", 141], ["buyable", 142], ["buyable", 143],
                ["buyable", 151], ["buyable", 152], ["buyable", 153],
            ], () => {return {position: "relative", background: "repeating-linear-gradient(135deg, #87d2d022 0 15px, #87d2d033 0 30px)", width: "5000px", height: "5000px", zoom: player.mse.zoom}}],
        ], {border: "3px solid #5ab28c", width: "800px", height: "700px", flexFlow: "column", marginTop: "-3px"}],
        ["style-row", [
            ["style-row", [["raw-html", "Zoom<br>Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}]], {width: "100px", height: "37px", lineHeight: "1", borderLeft: "3px solid #5ab28c"}],
            ["text-input", "zoom", {backgroundColor: "#12231c", color: "white", width: "230px", height: "37px", padding: "0 10px", textAlign: "left", fontSize: "28px", border: "0px", borderLeft: "3px solid #5ab28c", borderRight: "3px solid #5ab28c"}],
        ], {width: "800px", height: "37px", background: "#87d2d044", border: "3px solid #5ab28c", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
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
        totalSourceEnergy: new Decimal(0),
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
        player.mse.kiPerSec = player.mse.kiPerSec.add(buyableEffect("mse", "ki1").sub(1))
        if (hasMilestone("mci", 11)) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mci.flowEffects[0])
        if (player.mcu.mantraSelected[0] == 1) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mcu.mantraEffects[11])
        if (player.mcu.mantraSelected[0] == 2) player.mse.kiPerSec = player.mse.kiPerSec.mul(player.mcu.mantraEffects[12])
        if (hasUpgrade("mcu", 15)) player.mse.kiPerSec = player.mse.kiPerSec.mul(upgradeEffect("mcu", 15))
        if (getBuyableAmount("mse", "gen1").gt(0)) player.mse.kiPerSec = player.mse.kiPerSec.mul(2)
        player.mse.kiPerSec = player.mse.kiPerSec.mul(buyableEffect("mse", "ki2"))
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

        if (player.sma.inStarmetalChallenge && player.dotf.miasmata) player.mse.ki = player.mse.ki.add(player.mse.kiPerSec.mul(delta))
        if (player.mse.ki.gt(player.mse.highestKi)) player.mse.highestKi = player.mse.ki

        player.mse.sourceEnergyGain = player.mse.miasma.div(5).pow(buyableEffect("mse", "se2"))
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(buyableEffect("mse", "se1"))
        //player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridianEffect)
        player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(Decimal.pow(1.5, player.mme.meridian[0].level))

        player.mse.miasmaCap = new Decimal(5)
        if (getBuyableAmount("mse", "gen2").gt(0)) player.mse.miasmaCap = player.mse.miasmaCap.add(3)
        player.mse.miasmaCap = player.mse.miasmaCap.add(buyableEffect("mse", "mia1").sub(1))
        player.mse.miasmaCap = player.mse.miasmaCap.add(buyableEffect("mse", "mia3").sub(1))
        if (hasMilestone("mci", 15)) player.mse.miasmaCap = player.mse.miasmaCap.add(player.mci.flowEffects[4].sub(1))
        player.mse.miasmaCap = player.mse.miasmaCap.mul(buyableEffect("mse", "mia2"))
        player.mse.miasmaCap = player.mse.miasmaCap.mul(buyableEffect("mse", "mia4"))

        if (player.mse.tempMiasma.gt(0) && player.mdb.active.lte(0)) {
            player.mse.tempMiasma = player.mse.tempMiasma.sub(player.mse.tempMiasma.div(10).max(0.1).mul(delta)).max(0)

        }
    },
    resetCheck(forced = false) {
        if (forced || (player.mse.miasma.add(player.mse.tempMiasma).gte(player.mse.miasmaCap))) {
            // Cap Miasma
            player.mse.miasma = player.mse.miasma.min(player.mse.miasmaCap)

            // Re-Calc Source Energy Gain
            player.mse.sourceEnergyGain = player.mse.miasma.div(5).pow(buyableEffect("mse", "se2"))
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(buyableEffect("mse", "se1"))
            //player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(player.mme.meridianEffect)
            player.mse.sourceEnergyGain = player.mse.sourceEnergyGain.mul(Decimal.pow(1.5, player.mme.meridian[0].level))

            // Gain Special Resources
            player.mse.sourceEnergy = player.mse.sourceEnergy.add(player.mse.sourceEnergyGain)
            player.mse.totalSourceEnergy = player.mse.totalSourceEnergy.add(player.mse.sourceEnergyGain)

            // Reset
            player.tab = "mcu"
            player.mse.sourceEnergyGain = new Decimal(0)
            player.mse.ki = new Decimal(0)
            player.mse.highestKi = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            player.mse.miasma = new Decimal(0)

            // Cultivation
            player.subtabs["mcu"]["stuff"] = "Upgrades"
            player.mcu.upgrades.splice(0, player.mcu.upgrades.length)
            player.mcu.mantraSelected = [0, 0, 0, 0, 0]
            
            // Circulation
            player.mci.circAmt = new Decimal(0)
            player.mci.circCurrent = new Decimal(0)
            player.mci.circSpeed = new Decimal(1)
            player.mci.circMax = new Decimal(5)
            
            player.mci.concentrateLow = 40
            player.mci.concentrateHigh = 60
            player.mci.concentrateBuff = new Decimal(0)
            
            player.mci.flow = new Decimal(0)
            player.mci.flowGain = new Decimal(0)
            for (let i in player.mci.flowEffects) {
                player.mci.flowEffects[i] = new Decimal(1)
                player.mci.flowEffects2[i] = new Decimal(1)
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
    clickables: {
        11: {
            title() { return "Condense your progress into " + formatSimple(player.mse.sourceEnergyGain) + " source energy<br><small>Requires 5 Miasma</small>" },
            canClick() { return player.mse.miasma.gte(5) },
            unlocked() { return player.mse.totalSourceEnergy.gt(0) },
            onClick() {
                layers.mse.resetCheck(true)
            },
            style() {
                let look = {width: "190px", minHeight: "46px", fontSize: "8px", lineHeight: "1", color: "white", border: "3px solid #735307", borderLeftWidth: "2px", borderRightWidth: "2px", borderRadius: "0px"}
                !this.canClick() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "black"
                return look
            }
        },
    },
    bars: {
        miasmaBar: {
            unlocked: true,
            direction: RIGHT,
            width: 300,
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
        "gen1": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(1) },
            canAfford() { return this.currency().gte(this.cost()) },
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    Boost ki gain by +100%\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "2720px", top: "2160px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "gen2": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(1) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen1"], 0)},
            branches: ["gen1"],
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    Boost miasma cap by +3\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "3000px", top: "2160px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "gen3": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(3) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen2"], 0)},
            branches: ["gen2"],
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    Boost flow gain and circulation speed by +30%\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "3140px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "gen4": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(8) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen3"], 0)},
            branches: ["gen3"],
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    Reduce meridian penalty by -20% and meridian requirements by -10%\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "3140px", top: "2580px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "gen5": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(100) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen4"], 0)},
            branches: ["gen4"],
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    [PUT SOME BOOST RELATING TO DEEP BREATHING HERE]\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "3000px", top: "2720px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "gen6": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(1000) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen5"], 0)},
            branches: ["gen5"],
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    [PUT SOME BOOST RELATING TO CLEANSING HERE]\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "2720px", top: "2720px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "gen7": {
            purchaseLimit: new Decimal(1),
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id)},
            unlocked: true,
            cost(x) { return new Decimal(10000) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen6"], 0)},
            branches: ["gen6"],
            display() {
                return "<div class='innerContainer' style='width:100px;height:74px;border-bottom:1px solid white;padding:3px'>\
                    Unlock the wasteland\
                    </div><div class='innerContainer' style='width:106px;height:30px'>\
                    Cost: " + formatSimple(tmp[this.layer].buyables[this.id].cost) + "<br>Source Energy\
                    </div>"
            },
            buy(mult) {
                    this.pay(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {position: "absolute", left: "2580px", top: "2440px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(1) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "ki1": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(8) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(10).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen1"], 0)},
            branches: ["gen1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase base Ki gain by +0.1\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1), 2) + "<br>" +
                    "Next: +" + formatSimple(getBuyableAmount(this.layer, this.id).add(1).div(10), 2) + "\n\
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
                let look = {position: "absolute", left: "2720px", top: "2020px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "ki2": {
            costBase() { return new Decimal(3) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(4).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ki1"], 0)},
            branches: ["ki1"],
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
                let look = {position: "absolute", left: "2720px", top: "1880px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "ki3": {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(50).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ki2"], 0)},
            branches: ["ki2"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase \"Cultivating\" upgrades base by +0.02\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "<br>" +
                    "Next: +" + formatSimple(getBuyableAmount(this.layer, this.id).add(1).div(50)) + "\n\
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
                let look = {position: "absolute", left: "2720px", top: "1740px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "ki4": {
            costBase() { return new Decimal(150) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ki3"], 0)},
            branches: ["ki3"],
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
                let look = {position: "absolute", left: "2720px", top: "1600px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #436968", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#1b2a29"
                return look
            }
        },
        "se1": {
            costBase() { return new Decimal(15) },
            costGrowth() { return new Decimal(3) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {
                let amt = getBuyableAmount(this.layer, this.id)
                if (amt.gt(0)) return player.mse.highestKi.add(1).log(10).div(20).mul(getBuyableAmount(this.layer, this.id)).add(1)
                else return new Decimal(1)
                return getBuyableAmount(this.layer, this.id).add(1)
            },
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ki2"], 0)},
            branches: ["ki2"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Boost source energy gain based on highest ki in this SE reset\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: x" + formatSimple(player.mse.highestKi.add(1).log(10).div(20).mul(getBuyableAmount(this.layer, this.id).add(1)).add(1), 2) + "\n\
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
                let look = {position: "absolute", left: "2580px", top: "1740px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #2d5946", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#12231c"
                return look
            }
        },
        "mia1": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(1.2) },
            purchaseLimit() { return new Decimal(7) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen2"], 0)},
            branches: ["gen2"],
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
                let look = {position: "absolute", left: "3000px", top: "2020px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#130707"
                return look
            }
        },
        "mia2": {
            costBase() { return new Decimal(3) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mia1"], 0)},
            branches: ["mia1"],
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
                let look = {position: "absolute", left: "3000px", top: "1880px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#130707"
                return look
            }
        },
        "mia3": {
            costBase() { return new Decimal(20) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return player.mse.highestKi.add(1).log(10).mul(getBuyableAmount(this.layer, this.id)).floor().div(10).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mia2"], 0)},
            branches: ["mia2"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase miasma cap based on highest ki\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "<br>" +
                    "Next: +" + formatSimple(player.mse.highestKi.add(1).log(10).mul(getBuyableAmount(this.layer, this.id).add(1)).floor().div(10)) + "\n\
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
                let look = {position: "absolute", left: "3000px", top: "1740px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#130707"
                return look
            }
        },
        "mia4": {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(3) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return player.mse.totalSourceEnergy.add(1).log(2).div(50).mul(getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mia3"], 0)},
            branches: ["mia3"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Boost miasma based on total source energy\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(player.mse.totalSourceEnergy.add(1).log(2).div(50).mul(getBuyableAmount(this.layer, this.id).add(1)).add(1)) + "\n\
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
                let look = {position: "absolute", left: "3000px", top: "1600px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #602424", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#130707"
                return look
            }
        },
        "se2": {
            costBase() { return new Decimal(50) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(10).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mia3"], 0)},
            branches: ["mia3"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Boost source energies base formula\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: ^" + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(1.1), 2) + "\n\
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
                let look = {position: "absolute", left: "3140px", top: "1600px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #2d5946", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#12231c"
                return look
            }
        },
        "ci1": {
            costBase() { return new Decimal(2) },
            costGrowth() { return new Decimal(1.3) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen3"], 0)},
            branches: ["gen3"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase circulation speed by 20%\
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
                let look = {position: "absolute", left: "3280px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #446346", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#0d130e"
                return look
            }
        },
        "ci2": {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(10).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ci1"], 0)},
            branches: ["ci1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase concentration gain by 10%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: x" + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(1.1)) + "\n\
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
                let look = {position: "absolute", left: "3420px", top: "2160px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #446346", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#0d130e"
                return look
            }
        },
        "ci3": {
            costBase() { return new Decimal(5) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ci1"], 0)},
            branches: ["ci1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase flow gain by 20%\
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
                let look = {position: "absolute", left: "3420px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #446346", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#0d130e"
                return look
            }
        },
        "ci4": {
            costBase() { return new Decimal(75) },
            costGrowth() { return new Decimal(3) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(10).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ci2"], 0)},
            branches: ["ci2"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Gain +0.1 concentration per second\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "/s<br>" +
                    "Next: +" + formatSimple(getBuyableAmount(this.layer, this.id).add(1).div(10)) + "/s\n\
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
                let look = {position: "absolute", left: "3420px", top: "2020px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #446346", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#0d130e"
                return look
            }
        },
        "ci5": {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(10).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ci2"], 0)},
            branches: ["ci2"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce circulation speed decay by -10%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "<br>" +
                    "Next: /" + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(1.1)) + "\n\
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
                let look = {position: "absolute", left: "3560px", top: "2160px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #446346", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#0d130e"
                return look
            }
        },
        "ci6": {
            costBase() { return new Decimal(50) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(10) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.div(player.mci.milestones.length, 25).mul(getBuyableAmount(this.layer, this.id)).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["ci3"], 0)},
            branches: ["ci3"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Boost flow gain based on circulation milestones\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: x" + formatSimple(Decimal.div(player.mci.milestones.length, 25).mul(getBuyableAmount(this.layer, this.id).add(1)).add(1), 2) + "\n\
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
                let look = {position: "absolute", left: "3560px", top: "2300px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #446346", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#0d130e"
                return look
            }
        },
        "me1": {
            costBase() { return new Decimal(5) },
            costGrowth() { return new Decimal(1.3) },
            purchaseLimit() { return new Decimal(8) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(4).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["gen4"], 0)},
            branches: ["gen4"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce meridian ki costs by -25%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(getBuyableAmount(this.layer, this.id).div(4).add(1.25), 2) + "\n\
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
                let look = {position: "absolute", left: "3280px", top: "2580px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "me2": {
            costBase() { return new Decimal(20) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(20).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["me1"], 0)},
            branches: ["me1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce meridian penalties by -5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(getBuyableAmount(this.layer, this.id).div(20).add(1.05), 2) + "\n\
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
                let look = {position: "absolute", left: "3420px", top: "2580px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "me3": {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(5) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(20).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["me2"], 0)},
            branches: ["me2"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce meridian requirements by -5%\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(getBuyableAmount(this.layer, this.id).div(20).add(1.05), 2) + "\n\
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
                let look = {position: "absolute", left: "3560px", top: "2580px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "me4": {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(100) },
            purchaseLimit() { return new Decimal(3) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["me3"], 0)},
            branches: ["me3"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase meridian caps by +1\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1)) + "<br>" +
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
                let look = {position: "absolute", left: "3700px", top: "2580px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "mea1": {
            costBase() { return new Decimal(4) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["me1"], 0)},
            branches: ["me1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Lu:P Requirement by /1.2\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.2, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
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
                let look = {position: "absolute", left: "3420px", top: "2720px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "mea2": {
            costBase() { return new Decimal(40) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mea1"], 0)},
            branches: ["mea1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase Lu:P's cap and automate up to that amount\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(Decimal.pow(player.mme.baseCap, tmp[this.layer].buyables[this.id].effect.sub(1))) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(player.mme.baseCap, getBuyableAmount(this.layer, this.id).add(1))) + "\n\
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
                let look = {position: "absolute", left: "3280px", top: "2720px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "meb1": {
            costBase() { return new Decimal(8) },
            costGrowth() { return new Decimal(2.1) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mea1"], 0)},
            branches: ["mea1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce He:P Requirement by /1.05\
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
                let look = {position: "absolute", left: "3420px", top: "2860px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "meb2": {
            costBase() { return new Decimal(80) },
            costGrowth() { return new Decimal(11) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["meb1"], 0)},
            branches: ["meb1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase He:P's cap and automate up to that amount\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(Decimal.pow(player.mme.baseCap, tmp[this.layer].buyables[this.id].effect.sub(1))) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(player.mme.baseCap, getBuyableAmount(this.layer, this.id).add(1))) + "\n\
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
                let look = {position: "absolute", left: "3280px", top: "2860px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "mec1": {
            costBase() { return new Decimal(12) },
            costGrowth() { return new Decimal(2.2) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["meb1"], 0)},
            branches: ["meb1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce Pe:P Requirement by /1.2\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "<br>" +
                    "Next: /" + formatSimple(Decimal.pow(1.2, getBuyableAmount(this.layer, this.id).add(1)), 2) + "\n\
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
                let look = {position: "absolute", left: "3420px", top: "3000px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "mec2": {
            costBase() { return new Decimal(120) },
            costGrowth() { return new Decimal(12) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mec1"], 0)},
            branches: ["mec1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase Pe:P's cap and automate up to that amount\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(Decimal.pow(player.mme.baseCap, tmp[this.layer].buyables[this.id].effect.sub(1))) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(player.mme.baseCap, getBuyableAmount(this.layer, this.id).add(1))) + "\n\
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
                let look = {position: "absolute", left: "3280px", top: "3000px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "med1": {
            costBase() { return new Decimal(20) },
            costGrowth() { return new Decimal(2.3) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["mec1"], 0)},
            branches: ["mec1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Reduce TB:P Requirement by /1.05\
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
                let look = {position: "absolute", left: "3420px", top: "3140px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        "med2": {
            costBase() { return new Decimal(200) },
            costGrowth() { return new Decimal(13) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.mse.sourceEnergy},
            pay(amt) { player.mse.sourceEnergy = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) && Decimal.gt(player.mse.buyables["med1"], 0)},
            branches: ["med1"],
            display() {
                return "<div class='innerContainer' style='width:106px;height:50px;border-bottom:1px solid white'>\
                    Increase TB:P's cap and automate up to that amount\
                    <div style='width:1px;height:calc(100% - 3px);background:white;margin-top:3px'></div><h3 style='padding:2px;margin:2px'>" + formatShortWhole(getBuyableAmount(this.layer, this.id)) + "<hr style='width:20px'>" + formatShortWhole(this.purchaseLimit()) + "</h3></div><div class='innerContainer' style='width:106px;height:30px;border-bottom:1px solid white'><span>\
                    Currently: x" + formatSimple(Decimal.pow(player.mme.baseCap, tmp[this.layer].buyables[this.id].effect.sub(1))) + "<br>" +
                    "Next: x" + formatSimple(Decimal.pow(player.mme.baseCap, getBuyableAmount(this.layer, this.id).add(1))) + "\n\
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
                let look = {position: "absolute", left: "3280px", top: "3140px", width: '120px', height: '120px', lineHeight: "0.9", color: "white", padding: "0", border: "4px solid #4c2c5e", outline: "3px solid #5ab28c", borderRadius: "20px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.backgroundColor = "#1a3b0f" : !this.canAfford() ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#171e24"
                return look
            }
        },
        /*
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
    },
    tabFormat: [
        ["row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
            ], {width: "300px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["clickable", 11],
            ["bar", "miasmaBar"],
        ]],
        ["blank", "25px"],
        ["style-row", [
            ["raw-html", () => {return "You have " + formatSimple(player.mse.sourceEnergy, 2) + " Source Energy (+" + formatSimple(player.mse.sourceEnergyGain, 2) + ")"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ], {width: "800px", height: "37px", background: "#87d2d044", border: "3px solid #5ab28c", borderRadius: "20px 20px 0 0"}],
        ["centered-draggable-scroll-row", [
            ["style-row", [
                ["buyable", "gen1"], ["buyable", "gen2"], ["buyable", "gen3"], ["buyable", "gen4"],
                ["buyable", "gen5"], ["buyable", "gen6"], ["buyable", "gen7"],
                ["buyable", "ki1"], ["buyable", "ki2"], ["buyable", "ki3"], ["buyable", "ki4"],
                ["buyable", "mia1"], ["buyable", "mia2"], ["buyable", "mia3"], ["buyable", "mia4"],
                ["buyable", "ci1"], ["buyable", "ci2"], ["buyable", "ci3"], ["buyable", "ci4"], ["buyable", "ci5"], ["buyable", "ci6"],
                ["buyable", "me1"], ["buyable", "me2"], ["buyable", "me3"], ["buyable", "me4"],
                ["buyable", "mea1"], ["buyable", "mea2"], ["buyable", "meb1"], ["buyable", "meb2"],
                ["buyable", "mec1"], ["buyable", "mec2"], ["buyable", "med1"], ["buyable", "med2"],
                ["buyable", "se1"], ["buyable", "se2"], ["buyable", "se3"], ["buyable", "se4"],
            ], () => {return {position: "relative", background: "no-repeat 0% 0% / 49.8% 100% repeating-linear-gradient(45deg, #60242466 0 15px, #60242499 0 30px), no-repeat 50% 0% / 0.4% 100% linear-gradient(#5ab28c88), no-repeat 100% 0% / 49.8% 100% repeating-linear-gradient(135deg, #87d2d022 0 15px, #87d2d033 0 30px)", width: "5000px", height: "5000px", zoom: player.mse.zoom}}],
        ], {border: "3px solid #5ab28c", width: "800px", height: "700px", flexFlow: "column", marginTop: "-3px"}],
        ["style-row", [
            ["style-row", [["raw-html", "Zoom<br>Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}]], {width: "100px", height: "37px", lineHeight: "1", borderLeft: "3px solid #5ab28c"}],
            ["style-column", [
                ["blank", "5px"],
                ["raw-html", () => {return "x" + formatSimple(player.mse.zoom)}, {color: "var(--textColor)", fontSize: "16px", fontFamily: "monospace"}],
                ["slider", ["zoom", 0.2, 2, 0.2]],
            ], {width: "203px", height: "37px", backgroundColor: "#12231c", color: "white", borderLeft: "3px solid #5ab28c", borderRight: "3px solid #5ab28c"}],
        ], {width: "800px", height: "37px", background: "#87d2d044", border: "3px solid #5ab28c", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
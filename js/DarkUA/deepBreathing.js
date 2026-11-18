addLayer("mdb", {
    name: "Deep Breathing", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DB", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        inhalation: new Decimal(0),
        inhalationGain: new Decimal(1),

        exhalation: new Decimal(0),
        exhalationGain: new Decimal(1),

        breath: new Decimal(0),
        breathCap: new Decimal(10),
        decayRate: new Decimal(0.9),
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#9999aa, #888899)",
            backgroundOrigin: "border-box",
            borderColor: "#555566",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Deep Breathing",
    branches: [["mcu", "#4d1d1d"]],
    color: "#555566",
    update(delta) {
        // Gain code
        player.mdb.inhalationGain = new Decimal(1)
        player.mdb.inhalationGain = player.mdb.inhalationGain.mul(buyableEffect("mdb", 11))
        player.mdb.inhalationGain = player.mdb.inhalationGain.mul(buyableEffect("mdb", 22))
        if (getBuyableAmount("mse", "gen5")) player.mdb.inhalationGain = player.mdb.inhalationGain.mul(1.5)
        if (player.mcu.mantraSelected[3] == 1) player.mdb.inhalationGain = player.mdb.inhalationGain.mul(player.mcu.mantraEffects[41])
            
        player.mdb.inhalationGain = player.mdb.inhalationGain.pow(buyableEffect("mdb", 13))

        player.mdb.exhalationGain = new Decimal(1)
        player.mdb.exhalationGain = player.mdb.exhalationGain.mul(buyableEffect("mdb", 12))
        player.mdb.exhalationGain = player.mdb.exhalationGain.mul(buyableEffect("mdb", 21))
        if (getBuyableAmount("mse", "gen5")) player.mdb.exhalationGain = player.mdb.exhalationGain.mul(1.5)
        if (player.mcu.mantraSelected[3] == 2) player.mdb.exhalationGain = player.mdb.exhalationGain.mul(player.mcu.mantraEffects[42])
            
        player.mdb.exhalationGain = player.mdb.exhalationGain.pow(buyableEffect("mdb", 13))

        player.mdb.decayRate = new Decimal(0.9)
        player.mdb.decayRate = player.mdb.decayRate.mul(buyableEffect("mdb", 23))
        if (hasUpgrade("mcu", 24)) player.mdb.decayRate = player.mdb.decayRate.div(1.1)

        player.mdb.breathCap = new Decimal(10)

        // Breath calculation code
        if (hasUpgrade("mcu", 21)) {
            let prev = player.mdb.breath
            player.mdb.breath = player.mdb.breath.add(delta)

            let cyclesPast = Decimal.div(delta, player.mdb.breathCap).floor()
            player.mdb.breath = player.mdb.breath.sub(cyclesPast.mul(player.mdb.breathCap))

            // Temporary variables to prevent weird conflicts
            let currChange = [new Decimal(0), new Decimal(0)]

            if (Decimal.gte(cyclesPast, 1)) {
                let half = player.mdb.breathCap.div(2)
                currChange[0] = currChange[0].add(player.mdb.inhalationGain.mul(cyclesPast).mul(half).mul(Decimal.sub(1, player.mdb.decayRate)))
                currChange[1] = currChange[1].add(player.mdb.exhalationGain.mul(cyclesPast).mul(half).mul(Decimal.sub(1, player.mdb.decayRate)))
            }

            if (Decimal.gt(cyclesPast, 0)) {
                let firstSeg = layers.mdb.remainderCheck(Decimal.modulo(prev, player.mdb.breathCap), player.mdb.breathCap)
                let secondSeg = layers.mdb.remainderCheck(new Decimal(0), Decimal.modulo(player.mdb.breath, player.mdb.breathCap))
                currChange[0] = currChange[0].add(firstSeg[0]).add(secondSeg[0])
                currChange[1] = currChange[1].add(firstSeg[1]).add(secondSeg[1])
            } else {
                let seg = layers.mdb.remainderCheck(Decimal.modulo(prev, player.mdb.breathCap), Decimal.modulo(player.mdb.breath, player.mdb.breathCap))
                currChange[0] = currChange[0].add(seg[0])
                currChange[1] = currChange[1].add(seg[1])
            }

            player.mdb.inhalation = player.mdb.inhalation.add(currChange[0]).max(0)
            player.mdb.exhalation = player.mdb.exhalation.add(currChange[1]).max(0)
            if (player.mdb.breath.gt(player.mdb.breathCap)) player.mdb.breath = new Decimal(0)
        }
    },
    remainderCheck(start, end) {
        let half = player.mdb.breathCap.div(2)
        let changes = [new Decimal(0), new Decimal(0)]

        // Inhale
        if (Decimal.lt(start, half)) {
            let inhaleTime = Decimal.min(end, half).sub(start)
            changes[0] = changes[0].add(player.mdb.inhalationGain.mul(inhaleTime))
            changes[1] = changes[1].sub(player.mdb.exhalationGain.mul(inhaleTime).mul(player.mdb.decayRate))
        }

        // Exhale
        if (Decimal.gt(end, half)) {
            let exhaleTime = Decimal.sub(end, Decimal.max(start, half))
            changes[1] = changes[1].add(player.mdb.exhalationGain.mul(exhaleTime))
            changes[0] = changes[0].sub(player.mdb.inhalationGain.mul(exhaleTime).mul(player.mdb.decayRate))
        }

        return changes
    },
    bars: {
        breath: {
            unlocked: true,
            direction: RIGHT,
            width: 700,
            height: 50,
            progress() {
                let cycleTime = player.mdb.breath.modulo(player.mdb.breathCap)
                let half = player.mdb.breathCap.div(2)
                if (Decimal.lt(cycleTime, half)) {
                    return Decimal.div(cycleTime, half)
                } else {
                    return Decimal.sub(1, cycleTime.sub(half).div(half))
                }
            },
            borderStyle: {border: "0px", borderRadius: "0"},
            baseStyle: {background: "#4218"},
            fillStyle: {background: "#3348"},
            textStyle: {color: "white", fontSize: "20px", lineHeight: "0.8", fontFamily: "monospace"},
            display() {
                let halfCap = player.mdb.breathCap.div(2)
                let str = formatTime(player.mdb.breath.modulo(halfCap)) + "/" + formatTime(halfCap)
                return player.mdb.breath.lt(halfCap) ? str.concat("<br><small>[Breathing In]</small>") : str.concat("<br><small>[Breathing Out]</small>")
            },

        },
    },
    clickables: {
        1: {
            title() { return "Inhalation" },
            canClick() { return player.subtabs["mdb"]["stuff"] != "Inhalation"},
            unlocked: true,
            onClick() {
                player.subtabs["mdb"]["stuff"] = "Inhalation"
            },
            style() {
                let look = {width: "349px", minHeight: "40px", color: "white", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (this.canClick()) {look.background = "#445"} else {look.background = "#223"}
                return look
            },
        },
        2: {
            title() { return "Exhalation" },
            canClick() { return player.subtabs["mdb"]["stuff"] != "Exhalation"},
            unlocked: true,
            onClick() {
                player.subtabs["mdb"]["stuff"] = "Exhalation"
            },
            style() {
                let look = {width: "348px", minHeight: "40px", color: "white", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (this.canClick()) {look.background = "#532"} else {look.background = "#421"}
                return look
            },
        },
    },
    buyables: {
        11: {
            costBase() { return new Decimal(4) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mdb.inhalation},
            pay(amt) { player.mdb.inhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(4).add(1).mul(Decimal.pow(1.08, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Inhalation 1:1"
            },
            display() {
                return "Multiplies inhalation gain by x" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Inhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(0.1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(10).add(0.1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#334', color: 'white'}
        },
        12: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.mdb.inhalation},
            pay(amt) { player.mdb.inhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1).mul(Decimal.pow(1.03, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Inhalation 1:2"
            },
            display() {
                return "Multiplies exhalation gain by x" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Inhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(5).add(0.2)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(5).add(0.2))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#334', color: 'white'}
        },
        13: {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(100) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mdb.inhalation},
            pay(amt) { player.mdb.inhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(50).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Inhalation 1:3"
            },
            display() {
                return "Raise breath currency gain by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Inhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).add(1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).add(1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#334', color: 'white'}
        },
        14: {
            costBase() { return new Decimal(3) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mdb.inhalation},
            pay(amt) { player.mdb.inhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(12.5).mul(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id))).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Inhalation 2:1"
            },
            display() {
                return "Boosts base ki gain by +" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Inhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(0.1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(10).add(0.1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#334', color: 'white'}
        },
        15: {
            costBase() { return new Decimal(20) },
            costGrowth() { return new Decimal(4) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.mdb.inhalation},
            pay(amt) { player.mdb.inhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(15).add(1).mul(Decimal.pow(1.04, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Inhalation 2:2"
            },
            display() {
                return "Reduces circulation req by /" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Inhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(5).add(0.2)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(5).add(0.2))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#334', color: 'white'}
        },
        16: {
            costBase() { return new Decimal(500) },
            costGrowth() { return new Decimal(50) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mdb.inhalation},
            pay(amt) { player.mdb.inhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Inhalation 2:3"
            },
            display() {
                return "Boosts concentration cap by +" + formatWhole(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Inhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).add(1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).add(1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#334', color: 'white'}
        },
        21: {
            costBase() { return new Decimal(4) },
            costGrowth() { return new Decimal(1.5) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mdb.exhalation},
            pay(amt) { player.mdb.exhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(4).add(1).mul(Decimal.pow(1.08, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Exhalation 1:1"
            },
            display() {
                return "Multiplies exhalation gain by x" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Exhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(0.1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(10).add(0.1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#421', color: 'white'}
        },
        22: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.mdb.exhalation},
            pay(amt) { player.mdb.exhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(5).add(1).mul(Decimal.pow(1.03, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Exhalation 1:2"
            },
            display() {
                return "Multiplies inhalation gain by x" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Exhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(5).add(0.2)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(5).add(0.2))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#421', color: 'white'}
        },
        23: {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(100) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mdb.exhalation},
            pay(amt) { player.mdb.exhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(50).add(1)},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Exhalation 1:3"
            },
            display() {
                return "Reduce breath currency decay by /" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Exhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).add(1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).add(1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#421', color: 'white'}
        },
        24: {
            costBase() { return new Decimal(3) },
            costGrowth() { return new Decimal(1.4) },
            purchaseLimit() { return new Decimal(250) },
            currency() { return player.mdb.exhalation},
            pay(amt) { player.mdb.exhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(15).add(1).mul(Decimal.pow(1.04, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Exhalation 2:1"
            },
            display() {
                return "Boosts ki gain by x" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Exhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(10).add(0.1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(10).add(0.1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#421', color: 'white'}
        },
        25: {
            costBase() { return new Decimal(20) },
            costGrowth() { return new Decimal(4) },
            purchaseLimit() { return new Decimal(100) },
            currency() { return player.mdb.exhalation},
            pay(amt) { player.mdb.exhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(15).add(1).mul(Decimal.pow(1.04, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Exhalation 2:2"
            },
            display() {
                return "Boosts circulation speed by x" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Exhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).div(5).add(0.2)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).div(5).add(0.2))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#421', color: 'white'}
        },
        26: {
            costBase() { return new Decimal(400) },
            costGrowth() { return new Decimal(40) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.mdb.exhalation},
            pay(amt) { player.mdb.exhalation = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(12.5).add(1).mul(Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)))},
            unlocked() { return true },
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost()) },
            title() {
                return "Exhalation 2:3"
            },
            display() {
                return "Boosts flow gain by x" + formatWhole(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Exhalation\n\
                    Penalty: " + formatSimple(getBuyableAmount(this.layer, this.id).add(1)) + " Temp Miasma"
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
                player.mse.tempMiasma = player.mse.tempMiasma.add(getBuyableAmount(this.layer, this.id).add(1))
                layers.mse.resetCheck()
            },
            style: { width: '225px', height: '150px', backgroundColor: '#421', color: 'white'}
        },
    },
    microtabs: {
        stuff: {
            "Inhalation": {
                content: [
                    ["style-row", [
                        ["dark-buyable", 11], ["dark-buyable", 12], ["dark-buyable", 13],
                        ["dark-buyable", 14], ["dark-buyable", 15], ["dark-buyable", 16],
                    ], {width: "700px", background: "#3346", border: "3px solid #555566", padding: "10px 0", marginTop: "-3px"}],
                ],
            },
            "Exhalation": {
                content: [
                    ["style-row", [
                        ["dark-buyable", 21], ["dark-buyable", 22], ["dark-buyable", 23],
                        ["dark-buyable", 24], ["dark-buyable", 25], ["dark-buyable", 26],
                    ], {width: "700px", background: "#4216", border: "3px solid #555566", padding: "10px 0", marginTop: "-3px"}],
                ],
            },
        },
    },
    tabFormat: [
        ["layer-proxy", ["mse", [
            ["row", [
                ["style-column", [
                    ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                ], {width: "300px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
                ["clickable", 11],
                ["bar", "miasmaBar"],
            ]],
        ]]],
        ["blank", "25px"],
        ["style-column", [
            ["style-row", [
                    ["style-column", [
                        ["raw-html", () => {return "You Have " + formatSimple(player.mdb.inhalation) + " Inhalation"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            let currGain = player.mdb.breath.lt(player.mdb.breathCap.div(2)) ? player.mdb.inhalationGain : player.mdb.inhalationGain.mul(player.mdb.decayRate).mul(-1)
                            return currGain.gt(0) ? "(+" + formatSimple(currGain) + "/s)" : "(" + formatSimple(currGain) + "/s)"
                        }, () => {let look = {color: "white", fontSize: "18px", fontFamily: "monospace"};if (player.mdb.breath.gt(player.mdb.breathCap.div(2))) look.color = "#fbb";return look}],
                    ], {width: "348px", height: "77px", borderRight: "3px solid #556"}],
                    ["style-column", [
                        ["raw-html", () => {return "You Have " + formatSimple(player.mdb.exhalation) + " Exhalation"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            let currGain = player.mdb.breath.gt(player.mdb.breathCap.div(2)) ? player.mdb.exhalationGain : player.mdb.exhalationGain.mul(player.mdb.decayRate).mul(-1)
                            return currGain.gt(0) ? "(+" + formatSimple(currGain) + "/s)" : "(" + formatSimple(currGain) + "/s)"
                        }, () => {let look = {color: "white", fontSize: "18px", fontFamily: "monospace"};if (player.mdb.breath.lt(player.mdb.breathCap.div(2))) look.color = "#fbb";return look}],
                    ], {width: "349px", height: "77px"}],
            ], {width: "700px", height: "77px", background: "#5566", borderBottom: "3px solid #556", borderRadius: "17px 17px 0 0"}],
            ["bar", "breath"],
        ], {width: "700px", height: "130px", border: "3px solid #556", borderRadius: "20px 20px 0 0"}],
        ["style-row", [["clickable", 1], ["style-row", [], {width: "3px", height: "40px", background: "#556"}], ["clickable", 2]], {width: "700px", height: "40px", border: "3px solid #556", marginTop: "-3px"}],
        ["buttonless-microtabs", "stuff", { 'border-width': '0px' }],
        ["style-row", [
            ["raw-html", "<i>Penalty is applied once, even when buying max", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
        ], {width: "700px", height: "30px", background: "#5566", border: "3px solid #556", borderRadius: "0 0 20px 20px", marginTop: "-3px"}],
    ],
    layerShown() { return hasUpgrade("mcu", 21) ? true : 'ghost' },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
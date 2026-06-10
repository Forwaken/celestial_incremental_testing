addLayer("tera", {
    name() {return "Tera"},
    symbol: "目", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Tera", // Decides the nodes tooltip
    color: "#6D9BE0", // Decides the nodes color.
    nodeStyle: {background: "linear-gradient(135deg, #85ADE6, #5085D8)", borderColor: "#0046AA", color: "#0046AA"}, // Decides the nodes style, in CSS format.
    branches: [], // Decides the nodes branches.
    startData() { return {
        trueHex: new Decimal(0),
        trueHexReq: new Decimal(1e60),
        trueHexGain: new Decimal(0),

        hexEssence: new Decimal(0),
        hexEssencePerSecond: new Decimal(0),

        hexEnergy: new Decimal(0),
        hexEnergyCap: new Decimal(10),
        hexEnergyGain: new Decimal(0),

        piositySpell: new Decimal(1),
        chronotachysisSpell: new Decimal(0),

        realmMastery: [false, false, false, false, false, false],

        trueHept: new Decimal(0),
        trueHeptReq: new Decimal(1e70),
        trueHeptGain: new Decimal(0),
    }},
    update (delta) {
        for (let i = 101; i < 113; i++) {
            if (player.tera.clickables[i] && Decimal.gt(player.tera.clickables[i], 0)) player.tera.clickables[i] = Decimal.sub(player.tera.clickables[i], delta)
        }

        player.tera.trueHexReq = Decimal.pow(1e6, player.tera.trueHex).mul(1e60)
        player.tera.trueHexGain = player.hpw.power.add(1).div(1e60).ln().div(Decimal.ln(1e6)).add(1).sub(player.tera.trueHex).floor().max(0)

        player.tera.hexEssencePerSecond = player.tera.trueHex.gt(0) ? Decimal.pow(Decimal.mul(6, buyableEffect("tera", "hexRed")), player.tera.trueHex.mul(buyableEffect("tera", "hexGreen")).sub(1)).mul(buyableEffect("tera", "hexBlue")).div(60).pow(buyableEffect("tera", "hexOpacity")) : new Decimal(0)

        player.tera.hexEssence = player.tera.hexEssence.add(player.tera.hexEssencePerSecond.mul(delta))
        
        player.tera.trueHeptReq = Decimal.pow(1e7, player.tera.trueHept).mul(1e70)
        player.tera.trueHeptGain = player.hpw.power.add(1).div(1e70).ln().div(Decimal.ln(1e7)).add(1).sub(player.tera.trueHept).floor().max(0)
    },
    teraReset(type) {
        // POWER
        player.hpw.totalPower = new Decimal(0)
        player.hpw.power = new Decimal(0)
        player.hpw.powerGain = new Decimal(0)
        for (let i = 0; i < player.hpw.upgScale.length; i++) {
            player.hpw.upgScale[i] = 1
        }
        player.hpw.vigor = 0

        player.hpw.upgrades.splice(0, player.hpw.upgrades.length)
        player.hpw.milestones.splice(0, player.hpw.milestones.length)
        for (let i in player.hpw.buyables) {
            player.hpw.buyables[i] = new Decimal(0)
        }

        // SACRIFICE
        player.hsa.holyPower = new Decimal(0)
        player.hsa.holyPowerGain = new Decimal(0)
        player.hsa.sacredEnergy = new Decimal(0)
        player.hsa.sacredEnergyPerSecond = new Decimal(0)
        player.hsa.sacredEffect = new Decimal(0)
        player.hsa.sacredEffect2 = new Decimal(1)
        player.hsa.dimensionAmounts = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        player.hsa.dimensionsPerSecond = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        player.hsa.prayerTime = new Decimal(0)
        player.hsa.prayerMult = new Decimal(1)
        player.hsa.prayTimeCheck = new Decimal(0)
        player.hsa.praying = false
        if (player.hsa.autoSac >= 0) player.hsa.autoSac = false

        player.hsa.upgrades.splice(0, player.hsa.upgrades.length)

        for (let i in player.hsa.buyables) {
            player.hsa.buyables[i] = new Decimal(0)
        }
        
        // REALM
        for (let i in player.hrm.challenges) {
            player.hrm.challenges[i] = new Decimal(0)
        }
        player.hrm.activeChallenge = null
        for (let i in player.hrm.buyables) {
            player.hrm.buyables[i] = new Decimal(0)
        }
        player.hrm.realmCompletions = new Decimal(0)
        player.hrm.realmEffect = new Decimal(1)
        player.hrm.blessLimit = new Decimal(0)
        player.hrm.dreamTimer = new Decimal(60)
        player.hrm.realmEssence = new Decimal(0)
        player.hrm.totalRealmEssence = new Decimal(0)
        player.hrm.realmEssenceGain = new Decimal(0)
        player.hrm.realmEssenceEffects = [new Decimal(1), new Decimal(1)]

        // PURITY
        player.hpu.purity = new Decimal(0)
        player.hpu.totalPurity = new Decimal(0)
        player.hpu.purityGain = new Decimal(0)
        for (let i in player.hpu.purifiers) {
            player.hpu.purifiers[i].amount = new Decimal(0)
            if (i != "2" || i != "5") player.hpu.purifiers[i].effect = new Decimal(1)
        }
        
        // CURSES
        player.hcu.curses = new Decimal(0)
        player.hcu.cursesGain = new Decimal(0)
        for (let i = 101; i < 115; i++) {
            player.hcu.buyables[i] = new Decimal(0)
        }

        // VEXES
        player.hve.vex = new Decimal(0)
        player.hve.vexTotal = new Decimal(0)
        player.hve.vexGain = new Decimal(0)
        player.hve.rowCurrent = [0, 0, 0, 0, 0, 0]
        player.hve.rowSpent = [0, 0, 0, 0, 0, 0]
        for (let i = 0; i < player.hve.upgrades.length; i++) {
            player.hve.upgrades.splice(i, 1);
            i--;
        }

        // BLESSINGS
        player.hbl.blessings = new Decimal(0)
        player.hbl.blessingsGain = new Decimal(0)
        player.hbl.blessingPerSec = new Decimal(0)
        player.hbl.boons = new Decimal(0)
        player.hbl.boonsGain = new Decimal(0)
        player.hbl.blessAutomation = false
        for (let i in player.hbl.boosters) {
            player.hbl.boosters[i].level = new Decimal(0)
            player.hbl.boosters[i].xp = new Decimal(0)
            if (i != "5") player.hbl.boosters[i].effect = new Decimal(1)
        }
        for (let i = 0; i < player.hbl.upgrades.length; i++) {
            player.hbl.upgrades.splice(i, 1);
            i--;
        }
        for (let i = 0; i < player.hbl.milestones.length; i++) {
            player.hbl.milestones.splice(i, 1);
            i--;
        }

        // REFINEMENT
        player.hre.refinement = new Decimal(0)
        player.hre.refinementGain = new Decimal(0)
        for (let i = 0; i < 12; i++) {
            player.hre.refinementEffect[i] = [new Decimal(1), new Decimal(1)]
        }
        for (let i = 0; i < player.hre.milestones.length; i++) {
            player.hre.milestones.splice(i, 1);
            i--;
        }
        
        // RANK
        for (let i = 0; i < 12; i++) {
            player.hpr.rank[i] = new Decimal(0)
            player.hpr.rankGain[i] = new Decimal(0)
            player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
        }

        // HEX POINTS
        player.h.hexPointGain = new Decimal(0)
        player.h.hexPoint = new Decimal(0)
    },
    bars: {
        hexEnergy: {
            unlocked: true,
            direction: RIGHT,
            width: 300,
            height: 40,
            progress() {
                return player.tera.hexEnergy.div(player.tera.hexEnergyCap)
            },
            baseStyle: {backgroundColor: "rgba(0,0,0,0.5)"},
            fillStyle: {backgroundColor: "#48C353"},
            borderStyle: {
                border: "3px solid rgba(0,0,0,0.5)",
                borderRadius: "10px",
            },
            display() {
                return formatSimple(player.tera.hexEnergy) + "/" + formatSimple(player.tera.hexEnergyCap) + " Hex Energy<br><small>[" + formatSimple(player.tera.hexEnergyGain) + "/s]</small>"
            },
        },
    },
    clickables: {
        1: {
            title() {return false ? "<h3>True Base</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#ADE685", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        2: {
            title() {return false ? "<h3>True Rank</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#A5DB98", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        3: {
            title() {return false ? "<h3>True Tier</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#9DCFAC", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        4: {
            title() {return false ? "<h3>True Tetr</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#95C4BF", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        5: {
            title() {return false ? "<h3>True Pent</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#8DB8D3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        6: {
            title() {return "<h3>True Hex</h3><br>" + formatWhole(player.tera.trueHex) + "<br><small>[Req: " + formatWhole(player.tera.trueHexReq) + " Power]"},
            canClick: true,
            unlocked: true,
            onClick() {
                player.subtabs["tera"]["stuff"] = "hex"
            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#85ADE6", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        7: {
            title() {return "<h3>True Hept</h3><br>" + formatWhole(player.tera.trueHept) + "<br><small>[Req: " + formatWhole(player.tera.trueHeptReq) + " Power]"},
            canClick: true,
            unlocked: true,
            onClick() {
                player.subtabs["tera"]["stuff"] = "hept"
            },
            style: {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#95A6DD", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"},
        },
        8: {
            title() {return false ? "<h3>True Oct</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#A5A0D3", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        9: {
            title() {return false ? "<h3>True Enne</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#B699CA", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        10: {
            title() {return false ? "<h3>True Dect</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#C692C0", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        11: {
            title() {return false ? "<h3>True Undect</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#D68CB7", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        12: {
            title() {return false ? "<h3>True Dodect</h3>" : "<h3>???</h3>"},
            canClick() {return false},
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "200px", minHeight: "60px", lineHeight: "1", color: "rgba(0,0,0,0.7)", background: "#E685AD", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                if (!this.canClick()) look.filter = "brightness(50%)"
                return look
            },
        },
        106: {
            title() {return player.h.stage.neq(6) ? (Decimal.gt(player.tera.clickables[106], 0) ? "<h2>Are you sure?</h2><br><h3>[Resets ALL previous Uni-α content]</h3>" : "<h2>Switch to Hex Universe</h2><br><h3>[Resets ALL previous Uni-α content]</h3>") : "<h2>Switch to Hex Universe</h2><br><h3>[ALREADY IN HEX UNIVERSE]</h3>"},
            canClick() {return player.h.stage.neq(6)},
            unlocked: true,
            onClick() {
                if (Decimal.lte(player.tera.clickables[106], 0)) {
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(6)
                    player.tera.clickables[106] = new Decimal(2)
                } else {
                    player.tera.clickables[106] = new Decimal(0)

                }
            },
            style() {
                let look = {width: "500px", minHeight: "60px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        107: {
            title() {return player.h.stage.neq(7) ? (Decimal.gt(player.tera.clickables[107], 0) ? "<h2>Are you sure?</h2><br><h3>[Resets ALL previous Uni-α content]</h3>" : "<h2>Switch to Hept Universe</h2><br><h3>[Resets ALL previous Uni-α content]</h3>") : "<h2>Switch to Hept Universe</h2><br><h3>[ALREADY IN HEPT UNIVERSE]</h3>"},
            canClick() {return player.h.stage.neq(7)},
            unlocked: true,
            onClick() {
                if (Decimal.lte(player.tera.clickables[107], 0)) {
                    layers.tera.teraReset()
                    player.h.stage = new Decimal(7)
                    player.tera.clickables[107] = new Decimal(2)
                } else {
                    player.tera.clickables[107] = new Decimal(0)

                }
            },
            style() {
                let look = {width: "500px", minHeight: "60px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#95A6DD" : look.background = "#bf8f8f"
                return look
            },
        },
        "hexReset": {
            title() {return player.h.stage.eq(6) ? "<h2>Reset ALL previous content for true hexes</h2><br><h3>Req: " + formatWhole(player.tera.trueHexReq) + " Power</h3>" : "<h2>Reset ALL previous content for true hexes</h2><br>[ONLY POSSIBLE WHEN Uni-α IS HEX]"},
            canClick() {return player.h.stage.eq(6) && player.hpw.power.gte(player.tera.trueHexReq)},
            unlocked: true,
            onClick() {
                player.tera.trueHex = player.tera.trueHex.add(player.tera.trueHexGain)

                layers.tera.teraReset()
            },
            style() {
                let look = {width: "400px", minHeight: "100px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        "heptReset": {
            title() {return player.h.stage.eq(7) ? "<h2>Reset ALL previous content for true hepts</h2><br><h3>Req: " + formatWhole(player.tera.trueHeptReq) + " Power</h3>" : "<h2>Reset ALL previous content for true hepts</h2><br>[ONLY POSSIBLE WHEN Uni-α IS HEPT]"},
            canClick() {return player.h.stage.eq(7) && player.hpw.power.gte(player.tera.trueHeptReq)},
            unlocked: true,
            onClick() {
                player.tera.trueHept = player.tera.trueHept.add(player.tera.trueHeptGain)

                layers.tera.teraReset()
            },
            style() {
                let look = {width: "400px", minHeight: "100px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
        "piositySpell": {
            title() {return "<h3>Piosity</h3><br>Increases blessings during this tera run<br>Currently: x" + formatSimple(player.tera.piositySpell) + " Blessings<br><br>Cost: 5 Hex-Energy"},
            canClick() {return player.tera.hexEnergy.gte(5)},
            unlocked: true,
            onClick() {
                player.tera.hexEnergy.sub(5)
                player.tera.piositySpell = Decimal.sub(player.tera.piositySpell, 1).div(1.2).pow(2).add(1).pow(0.5).mul(1.2).add(1)
            },
            style() {
                let look = {width: "180px", minHeight: "100px", fontSize: "8px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                this.canClick() ? look.background = "#ffbf00" : look.background = "#bf8f8f"
                return look
            },
        },
        "piosityPin": {
            title() {return player.tera.clickables["piosityPin"] ? "Unpin from tree" : "Pin to tree"},
            canClick: true,
            unlocked: true,
            onClick() {
                if (player.tera.clickables["piosityPin"]) {
                    player.tera.clickables["piosityPin"] = false
                } else {
                    player.tera.clickables["piosityPin"] = true
                }
            },
            style() {
                let look = {width: "180px", minHeight: "50px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0"}
                !player.tera.clickables["piosityPin"] ? look.background = "white" : look.background = "gray"
                return look
            },
        },
    },
    buyables: {
        "hexRed": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (Decimal.gte(amt, 196)) return this.costGrowth().pow(amt).pow(4).mul(this.costBase())
                if (Decimal.gte(amt, 128)) return this.costGrowth().pow(amt).pow(3).mul(this.costBase())
                if (Decimal.gte(amt, 64)) return this.costGrowth().pow(amt).pow(2).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Red Value</h3>\n\
                    [Multiplies base value]\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ff4444"
                return look
            },
        },
        "hexGreen": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (Decimal.gte(amt, 196)) return this.costGrowth().pow(amt).pow(4).mul(this.costBase())
                if (Decimal.gte(amt, 128)) return this.costGrowth().pow(amt).pow(3).mul(this.costBase())
                if (Decimal.gte(amt, 64)) return this.costGrowth().pow(amt).pow(2).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Green Value</h3>\n\
                    [Multiplies base exponent]\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#44ff44"
                return look
            },
        },
        "hexBlue": {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.05, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) {
                let amt = x || getBuyableAmount(this.layer, this.id)
                if (Decimal.gte(amt, 196)) return this.costGrowth().pow(amt).pow(4).mul(this.costBase())
                if (Decimal.gte(amt, 128)) return this.costGrowth().pow(amt).pow(3).mul(this.costBase())
                if (Decimal.gte(amt, 64)) return this.costGrowth().pow(amt).pow(2).mul(this.costBase())
                return this.costGrowth().pow(amt).mul(this.costBase())
            },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Blue Value</h3>\n\
                    [Multiplies final effect]\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#4444ff"
                return look
            },
        },
        "hexOpacity": {
            costBase() { return new Decimal(255) },
            costGrowth() { return new Decimal(256) },
            purchaseLimit() { return new Decimal(255) },
            currency() { return player.tera.hexEssence},
            pay(amt) { player.tera.hexEssence = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.02, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>Increase Opacity Value</h3>\n\
                    [Raises final effect]\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Hex Essence\n\
                    <small style='color:darkred'>[Resets previous colors]</small>"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount("tera", "hexRed", new Decimal(0))
                setBuyableAmount("tera", "hexGreen", new Decimal(0))
                setBuyableAmount("tera", "hexBlue", new Decimal(0))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "200px", height: "100px", fontSize: "12px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "#ffffff"
                return look
            },
        },
    },
    microtabs: {
        "hex": {
            "Color": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-row", [
                        ["raw-html", () => {
                            return "Your current color is<br>#" +
                            getBuyableAmount("tera", "hexRed").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexGreen").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexBlue").toString(16).padStart(2, '0') +
                            getBuyableAmount("tera", "hexOpacity").toString(16).padStart(2, '0') +
                            "<br>Which generates +" + formatSimple(player.tera.hexEssencePerSecond, 2) + " HE/s"
                        }, () => {return {color: "white", fontSize: "16px", fontFamily: "monospace"}}],
                    ], {width: "400px", height: "60px", background: "#425673", border: "3px solid #85ade6", borderRadius: "15px"}],
                    ["blank", "15px"],
                    ["row", [
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Red", {color: "#633", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexRed"],
                        ], {width: "225px", height: "140px", backgroundColor: "#f88", border: "3px solid #844", borderRadius: "30px 0 0 0", marginRight: "5px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Green", {color: "#363", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexGreen"],
                        ], {width: "225px", height: "140px", backgroundColor: "#8f8", border: "3px solid #484", borderRadius: "0 30px 0 0"}],
                    ]],
                    ["blank", "5px"],
                    ["row", [
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Blue", {color: "#336", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexBlue"],
                        ], {width: "225px", height: "140px", backgroundColor: "#88f", border: "3px solid #448", borderRadius: "0 0 0 30px", marginRight: "5px"}],
                        ["style-column", [
                            ["style-row", [
                                ["raw-html", "Opacity", {color: "#666", fontSize: "20px", fontFamily: "monospace"}],
                            ], {width: "225px", height: "25px", paddingBottom: "5px"}],
                            ["buyable", "hexOpacity"],
                        ], {width: "225px", height: "140px", backgroundColor: "#fff", border: "3px solid #888", borderRadius: "0 0 30px 0"}],
                    ]],
                    ["blank", "20px"],
                ],
            },
            "Spells": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["bar", "hexEnergy"],
                    ["blank", "10px"],
                    ["column", [["clickable", "piositySpell"], ["clickable", "piosityPin"]]],
                ],
            },
            "Realm Mastery": {
                buttonStyle() { return {borderColor: "#85ade6", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "10px"],
                    ["style-column", [
                        ["style-column", [
                            ["raw-html", "Realm Challenge Mastery", () => {return {color: "white", fontSize: "24px", fontFamily: "monospace"}}],
                        ], {width: "500px", height: "30px", borderBottom: "3px solid #85ade6"}],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Creator Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises rank, tier, tetr, and pent effects by ^1.18<br>" +
                                    "Multiplies factor base by x120<br>" +
                                    "Multiplies check back xp by x" + formatSimple(upgradeEffect("hpw", 1013)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#c44", border: "3px solid #800", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[0]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Higher Plane Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises prestige points gain by ^1.36<br>" +
                                    "Raises tree gain by ^1.24<br>" +
                                    "Multiplies crystals and steel by x" + formatSimple(upgradeEffect("hpw", 1023)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#c84", border: "3px solid #840", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[1]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Death Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises grass gain by ^1.18<br>" +
                                    "Raises golden grass gain by ^1.06<br>" +
                                    "Multiplies pollinators by x" + formatSimple(upgradeEffect("hpw", 1033)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#cc4", border: "3px solid #880", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[2]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Dimension Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises grasshopper gain by ^1.1<br>" +
                                    "Raises mod gain by ^1.1<br>" +
                                    "Multiplies infinity dimensions by x" + formatSimple(upgradeEffect("hpw", 1043)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#4c4", border: "3px solid #080", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[3]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Dream Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Raises AD and antimatter by ^1.05<br>" +
                                    "Multiplies NIP by x100<br>" +
                                    "Raises mastery point effects by ^" + formatSimple(upgradeEffect("hpw", 1053), 2) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],
                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#44c", border: "3px solid #008", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[4]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                            ["style-column", [
                                ["raw-html", () => {
                                    return "<div style='line-height:1.2'><h3>Void Realm Challenge Mastery</h3><hr style='border-color:black;width:450px'>" +
                                    "Increases crate roll chance by +25%<br>" +
                                    "Triples replicanti multiplier<br>" +
                                    "Multiplies infinity points by x" + formatSimple(upgradeEffect("hpw", 1063)) + " <small>[Based on power]</small></div>"
                                }, {color: "rgba(0,0,0,0.8)", fontSize: "14px", fontFamily: "monospace"}],

                            ], () => {
                                let look = {width: "485px", height: "80px", background: "#84c", border: "3px solid #408", borderRadius: "10px", margin: "3px", userSelect: "none"}
                                if (!player.tera.realmMastery[5]) look.filter = "brightness(25%) blur(10px)"
                                return look
                            }],
                        ], {width: "500px", height: "540px", background: "#1a222e"}],
                        ["style-column", [
                            ["raw-html", "Obtaining realm mastery requires you to reach 30 clears.<br>Realm mastery effects do not stack with realm mights.<br>Realm mastery is kept on Tera resets.", () => {return {color: "white", fontSize: "14px", fontFamily: "monospace"}}],
                        ], {width: "500px", height: "60px", borderTop: "3px solid #85ade6"}],
                    ], {width: "500px", height: "636px", background: "#425673", border: "3px solid #85ade6", borderRadius: "15px"}],
                    ["blank", "20px"],
                ],
            },
        },
        "stuff": {
            "hex": {
                unlocked: true,
                content: [
                    ["always-scroll-column", [
                        ["blank", "25px"],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "True Hex"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
                            ], {width: "500px", height: "47px", borderBottom: "3px solid #85ade6"}],
                            ["clickable", 106],
                            ["style-column", [
                                ["raw-html", "Hex Universe Exclusives<hr>", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                                ["blank", "5px"],
                                ["raw-html", "Hex of Realms", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "No Tier Backlashes", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "500px", height: "87px", borderTop: "3px solid #85ade6"}]
                        ], {width: "500px", height: "200px", backgroundColor: "#425673", border: "3px solid #85ADE6", borderRadius: "20px"}],
                        ["blank", "10px"],
                        ["row", [
                            ["raw-html", () => {return "You are at <h3>" + formatWhole(player.tera.trueHex) + "</h3> true hex."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatWhole(player.tera.trueHexGain) + ")"}, () => {
                                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.trueHexGain.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                            //["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                        ]],
                        ["blank", "10px"],
                        ["clickable", "hexReset"],
                        ["blank", "10px"],
                        ["row", [
                            ["raw-html", () => {return "You have <h3>" + formatSimple(player.tera.hexEssence) + "</h3> hex essence."}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatSimple(player.tera.hexEssencePerSecond, 2) + "/s)"}, () => {
                                let look = {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.hexEssencePerSecond.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                        ]],
                        ["blank", "10px"],
                        ["microtabs", "hex", {borderWidth: "0px"}],

                        /*
                        It is going to revolve around using hex essence (gained based on your true hex) to buy three resources with different mechanics that work together.
                        First is Hex (color), which will be upgrades themed on hex colors.
                        Second is Hex (number), which is hexadecimal themed buffs towards the formula to gain hex essence.
                        Third is Hex (spell), which are active abilities to boost both hex essence gain and uni-alpha resource gain.
                        */
                        // Three increasing resources (in the style of neutrons from matter dimensions). All named hex with paranthesis with the 3 meanings of hex (color, number, spell)
                    ], {width: "597px", height: "800px", background: "#273345"}],
                ],
            },
            "hept": {
                unlocked: true,
                content: [
                    ["always-scroll-column", [
                        ["blank", "25px"],
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "True Hept"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
                            ], {width: "500px", height: "47px", borderBottom: "3px solid #95A6DD"}],
                            ["clickable", 107],
                            ["style-column", [
                                ["raw-html", "Hept Universe Exclusives<hr>", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                                ["blank", "5px"],
                                ["raw-html", "Hept of Sins", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "3 Tier Backlashes", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", "<div>[External, Pre-Power, Power]</div>", {color: "white", fontSize: "12px", fontFamily: "monospace",}],
                            ], {width: "500px", height: "87px", borderTop: "3px solid #95A6DD"}]
                        ], {width: "500px", height: "200px", backgroundColor: "#4a536e", border: "3px solid #95A6DD", borderRadius: "20px"}],
                        ["blank", "10px"],
                        ["row", [
                            ["raw-html", () => {return "You are at <h3>" + formatWhole(player.tera.trueHept) + "</h3> true hept."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatWhole(player.tera.trueHeptGain) + ")"}, () => {
                                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                                player.tera.trueHeptGain.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                            //["raw-html", () => {return player.hre.refinement.gte(player.h.stage.mul(15)) ? "[SOFTCAPPED<sup>2</sup>]" : player.hre.refinement.gte(player.h.stage.mul(10)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}],
                        ]],
                        ["blank", "10px"],
                        ["clickable", "heptReset"],
                        ["blank", "5px"],
                    ], {width: "597px", height: "800px", background: "#2c3142"}],
                ],
            },
            // Upgrade grid of 5x5 for pent perhaps? (in the vein of tree game rewritten)
            // Absolute button simulator for hept+ maybe?
            // Circular 9 grid of buyables should be used
            // Keep kaizo incremental in mind as a simple minigame here
        },
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["raw-html", () => {return layers.h.effects()}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "25px"],
        ["style-row", [
            ["style-column", [
                ["style-row", [], {width: "200px", height: "37px", background: "#28426c", borderBottom: "3px solid #5085d8", borderRadius: "17px 0 0 0"}],
                ["style-column", [
                    ["clickable", 1], ["clickable", 2], ["clickable", 3], ["clickable", 4], ["clickable", 5], ["clickable", 6],
                    ["clickable", 7], ["clickable", 8], ["clickable", 9], ["clickable", 10], ["clickable", 11], ["clickable", 12],
                ], {width: "200px", height: "720px"}],
                ["style-row", [], {width: "200px", height: "37px", background: "#28426c", borderTop: "3px solid #5085d8", borderRadius: "0 0 0 17px"}],
            ], {width: "200px", height: "800px", borderRight: "3px solid #5085d8"}],
            ["style-column", [
                ["buttonless-microtabs", "stuff", {borderWidth: "0"}],
            ], {width: "597px", height: "800px", }],
        ], {width: "800px", height: "800px", border: "3px solid #5085D8", borderRadius: "20px 0 0 20px"}],
    ],
    layerShown() { return true }, // Decides if this node is shown or not.
});
addLayer("hrm", {
    name() {return player.h.stageName[0] + " of Realms"},
    symbol: "Re", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Realms", // Decides the nodes tooltip
    color: "white", // Decides the nodes color.
    nodeStyle: {color: "#ccc", background: "linear-gradient(180deg, #770000, #775400, #747700, #147700, #00772A, #007769, #004677, #000877, #330077, #710077)", borderColor: "#0061ff"}, // Decides the nodes style, in CSS format.
    branches: ["hpw"], // Decides the nodes branches.
    startData() { return {
        realmCompletions: new Decimal(0),
        realmEffect: new Decimal(1),
        blessLimit: new Decimal(0),
        dreamTimer: new Decimal(60),
        challengeSoftcap: new Decimal(1),

        realmEssence: new Decimal(0),
        totalRealmEssence: new Decimal(0),
        realmEssenceGain: new Decimal(0),
        realmEssenceEffects: [new Decimal(1), new Decimal(1)],
    }},
    update(delta) {
        player.hrm.realmCompletions = new Decimal(0)
        for (let i in player.hrm.challenges) {
            let amt = new Decimal(challengeCompletions("hrm", i))
            if (amt.gt(3)) amt = amt.sub(3).mul(2/3).add(3)
            if (amt.gt(5)) amt = amt.sub(5).div(2).add(5)
            player.hrm.realmCompletions = player.hrm.realmCompletions.add(amt)
        }

        player.hrm.realmEffect = Decimal.pow(1.5, player.hrm.realmCompletions)

        player.hrm.realmEssenceGain = Decimal.pow(1.35, player.hrm.realmCompletions).sub(1)
        player.hrm.realmEssenceGain = player.hrm.realmEssenceGain.mul(buyableEffect("hrm", 6))
        let ext = new Decimal(1)
        ext = ext.mul(levelableEffect("pet", 1106)[2])
        if (hasUpgrade("depth3", 6)) ext = ext.mul(upgradeEffect("depth3", 6))
        if (hasUpgrade("tera", "hex5")) ext = ext.mul(upgradeEffect("tera", "hex5"))
        ext = ext.pow(player.h.externalRaise)
        player.hrm.realmEssenceGain = player.hrm.realmEssenceGain.mul(ext)

        player.hrm.realmEssenceEffects = [new Decimal(1), new Decimal(1)]
        player.hrm.realmEssenceEffects[0] = Decimal.pow(2.5, player.hrm.realmEssence.add(1).log(player.h.stage)).min(1e10)
        player.hrm.realmEssenceEffects[1] = player.hrm.realmEssence.add(1).log(player.h.stage).mul(0.05).add(1).min(3)

        if (player.hrm.realmEssence.gte(player.h.stage.pow(5))) player.hrm.realmEssenceEffects[0] = Decimal.pow(1.5, player.hrm.realmEssence.div(player.h.stage.pow(5)).log(player.h.stage)).mul(98).min(1e10)
        if (player.hrm.realmEssence.gte(player.h.stage.pow(10))) player.hrm.realmEssenceEffects[1] = player.hrm.realmEssence.div(player.h.stage.pow(10)).log(player.h.stage).mul(0.01).add(1.5).min(3)

        if (inChallenge("hrm", 15)) {
            player.hrm.dreamTimer = player.hrm.dreamTimer.sub(delta)
            if (player.hrm.dreamTimer.lte(0)) {
                completeChallenge("hrm", 15)
            }
        }

        player.hrm.challengeSoftcap = new Decimal(1)
        if (player.hrm.activeChallenge) {
            if (player.hrm.challenges[player.hrm.activeChallenge] > player.h.stage.sub(1).toNumber()) {
                player.hrm.challengeSoftcap = Decimal.pow(3, player.hrm.challenges[player.hrm.activeChallenge] - player.h.stage.sub(1).toNumber())
            }
        }
    },
    clickables: {
        1: {
            title() { return "Respec Upgrades<br><small style='font-size:11px'>(Does a power reset)</small>"},
            canClick() {return player.hrm.realmEssence.lt(player.hrm.totalRealmEssence)},
            unlocked: true,
            onClick() {
                if (confirm("Are you sure you want to do a power reset?")) {
                    player.hrm.realmEssence = player.hrm.totalRealmEssence
                    for (let i = 1; i < 7; i++) {
                        player.hrm.buyables[i] = new Decimal(0)
                    }
                    layers.hpw.powerReset(0)
                }
            },
            style() {
                let look = {width: "250px", minHeight: "40px", color: "black", lineHeight: "0.9", border: "2px solid black", borderRadius: "15px"}
                this.canClick() ? look.background = "linear-gradient(90deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)" : look.background = "#bf8f8f"
                return look
            },
        },
    },
    buyables: {
        1: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(player.h.stage) },
            purchaseLimit() { return new Decimal(player.h.stage.mul(2).floor()) },
            currency() { return player.hrm.realmEssence},
            pay(amt) { player.hrm.realmEssence = this.currency().sub(amt) },
            effect(x) {
                if (getBuyableAmount(this.layer, this.id).lt(1)) return new Decimal(0)
                return Decimal.pow(player.h.stage, getBuyableAmount(this.layer, this.id))
            },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>RE-1</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(player.h.stage.mul(2).floor()) + ")\n\
                    Keep some power on singularity resets\n\
                    Currently: " + formatWhole(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Realm Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "linear-gradient(180deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)"
                return look
            },
        },
        2: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(player.h.stage.div(2)) },
            purchaseLimit() { return new Decimal(player.h.stage.min(12)) },
            currency() { return player.hrm.realmEssence},
            pay(amt) { player.hrm.realmEssence = this.currency().sub(amt) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>RE-2</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(player.h.stage.min(12)) + ")\n\
                    Keep some miracles on resets.\n\
                    Currently: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Realm Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "linear-gradient(180deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)"
                return look
            },
        },
        3: {
            costBase() { return new Decimal(100) },
            costGrowth() { return new Decimal(player.h.stage) },
            purchaseLimit() { return new Decimal(player.h.stage.pow(2).sub(1).floor()) },
            currency() { return player.hrm.realmEssence},
            pay(amt) { player.hrm.realmEssence = this.currency().sub(amt) },
            effect(x) {
                return getBuyableAmount(this.layer, this.id).mul(0.02)
            },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>RE-3</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(player.h.stage.pow(2).sub(1).floor()) + ")\n\
                    Increase IP Booster softcap exponent.\n\
                    Currently: +" + format(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Realm Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "linear-gradient(180deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)"
                return look
            },
        },
        4: {
            costBase() { return new Decimal(1000) },
            costGrowth() { return new Decimal(player.h.stage.mul(2)) },
            purchaseLimit() { return new Decimal(player.h.stage.mul(10).floor()) },
            currency() { return player.hrm.realmEssence},
            pay(amt) { player.hrm.realmEssence = this.currency().sub(amt) },
            effect(x) {
                return Decimal.pow(2, getBuyableAmount(this.layer, this.id))
            },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>RE-4</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(player.h.stage.mul(10).floor()) + ")\n\
                    Multiply " + player.h.stageName[1] + " points by x2<br><small>(ignoring softcaps)</small>\n\
                    Currently: x" + format(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Realm Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "linear-gradient(180deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)"
                return look
            },
        },
        5: {
            costBase() { return new Decimal(10000) },
            costGrowth() { return new Decimal(player.h.stage.mul(4)) },
            purchaseLimit() { return new Decimal(player.h.stage.div(3).mul(10).floor()) },
            currency() { return player.hrm.realmEssence},
            pay(amt) { player.hrm.realmEssence = this.currency().sub(amt) },
            effect(x) {
                return getBuyableAmount(this.layer, this.id).mul(0.05).add(1)
            },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>RE-5</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(player.h.stage.div(3).mul(10).floor()) + ")\n\
                    Raise all third realm might effects.\n\
                    Currently: ^" + format(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Realm Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "linear-gradient(180deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)"
                return look
            },
        },
        6: {
            costBase() { return new Decimal(100000) },
            costGrowth() { return new Decimal(player.h.stage.mul(10)) },
            purchaseLimit() { return new Decimal(player.h.stage.mul(5).floor()) },
            currency() { return player.hrm.realmEssence},
            pay(amt) { player.hrm.realmEssence = this.currency().sub(amt) },
            effect(x) {
                return Decimal.pow(2, getBuyableAmount(this.layer, this.id))
            },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()) },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>RE-6</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(player.h.stage.mul(5).floor()) + ")\n\
                    Double realm essence.\n\
                    Currently: x" + format(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Realm Essence"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#77bf5f" : !this.canAfford() ? look.background =  "#bf8f8f" : look.background = "linear-gradient(180deg, #c88, #ca8, #cca, #8c8, #8cc, #88c, #a8c)"
                return look
            },
        },
    },
    challenges: {
        11: {
            name() { return "Creator Realm (" + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit() + ")"},
            completionLimit() {return buyableEffect("hpw", 1).add(player.h.stage.div(2).floor()).add(hasUpgrade("tera", "hex3") ? player.tera.trueHex.pow(player.h.externalRaise).floor() : 0)},
            marked: false,
            goal() {return Decimal.pow(Decimal.pow10(player.h.stage.div(6)), challengeCompletions(this.layer, this.id)).mul(Decimal.pow10(player.h.stage.div(1.5)))},
            fullDisplay() {
                let str = "<h4>You can only reset blessing " + formatWhole(player.h.stage) + " times. Passive blessing gain is also disabled.</h4>"
                if (Decimal.lt(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>Goal: " + formatShortWhole(this.goal()) + " Blessings")
                if (Decimal.gte(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>COMPLETED")
                return str
            },
            canComplete() {
                let clear = player.hbl.blessings.div(Decimal.pow10(player.h.stage.div(1.5))).add(1).ln().div(Decimal.ln(Decimal.pow10(player.h.stage.div(6)))).add(1).sub(challengeCompletions(this.layer, this.id))
                return clear.gt(0) ? clear.pow(0.8).floor().toNumber() : 0
            },
            unlocked() { return hasUpgrade("hpw", 1001) || challengeCompletions(this.layer, this.id) > 0 },
            canClick() { return hasUpgrade("hpw", 1001) },
            onEnter() {
                layers.hpw.powerReset(1)
            },
            onExit() {
                layers.hpw.powerReset(1)
            },
            onComplete() {if (player[this.layer].challenges[this.id] >= 30) player.tera.realmMastery[0] = true},
            style: {width: '250px', height: '204px', backgroundColor: "#c44", border: "6px solid #800", borderRadius: "13px"},
            buttonStyle() {
                let look = {height: "40px", marginTop: "5px", marginBottom: "5px", borderRadius: "20px"}
                if (this.canComplete() && inChallenge(this.layer, this.id)) look.border = "4px solid #77bf5f"
                if (!this.canClick()) look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        12: {
            name() { return "Higher Plane (" + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit() + ")"},
            completionLimit() {return buyableEffect("hpw", 2).add(player.h.stage.div(2).floor()).add(hasUpgrade("tera", "hex3") ? player.tera.trueHex.pow(player.h.externalRaise).floor() : 0)},
            marked: false,
            goal() {return Decimal.pow(player.h.stage.mul(5), challengeCompletions(this.layer, this.id)).mul(Decimal.pow10(player.h.stage))},
            fullDisplay() {
                let str = "<h4>Blessing and curse features are nerfed. Purity features are heavily buffed.</h4>"
                if (Decimal.lt(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>Goal: " + formatShortWhole(this.goal()) + " Blessings")
                if (Decimal.gte(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>COMPLETED")
                return str
            },
            canComplete() {
                let clear = player.hbl.blessings.div(Decimal.pow10(player.h.stage)).add(1).ln().div(Decimal.ln(player.h.stage.mul(5))).add(1).sub(challengeCompletions(this.layer, this.id))
                return clear.gt(0) ? clear.pow(0.8).floor().toNumber() : 0
            },
            unlocked() { return hasUpgrade("hpw", 1002) || challengeCompletions(this.layer, this.id) > 0 },
            canClick() { return hasUpgrade("hpw", 1002) },
            onEnter() {
                layers.hpw.powerReset(1)
            },
            onExit() {
                layers.hpw.powerReset(1)
            },
            onComplete() {if (player[this.layer].challenges[this.id] >= 30) player.tera.realmMastery[1] = true},
            style: {width: '250px', height: '204px', backgroundColor: "#c84", border: "6px solid #840", borderRadius: "13px"},
            buttonStyle() {
                let look = {height: "40px", marginTop: "5px", marginBottom: "5px", borderRadius: "20px"}
                if (this.canComplete() && inChallenge(this.layer, this.id)) look.border = "4px solid #77bf5f"
                if (!this.canClick()) look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        13: {
            name() { return "Death Realm (" + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit() + ")"},
            completionLimit() {return buyableEffect("hpw", 3).add(player.h.stage.div(2).floor()).add(hasUpgrade("tera", "hex3") ? player.tera.trueHex.pow(player.h.externalRaise).floor() : 0)},
            marked: false,
            goal() {return Decimal.pow(Decimal.pow10(player.h.stage.mul(3)), challengeCompletions(this.layer, this.id)).mul(Decimal.pow10(player.h.stage.mul(12)))},
            fullDisplay() {
                let str = "<h4>" + player.h.stageName[0] + " points, blessings, and boons now decay. Base curse formula is buffed.</h4>"
                if (Decimal.lt(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>Goal: " + formatShortWhole(this.goal()) + " Curses")
                if (Decimal.gte(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>COMPLETED")
                return str
            },
            canComplete() {
                let clear = player.hcu.curses.div(Decimal.pow10(player.h.stage.mul(12))).add(1).ln().div(Decimal.ln(Decimal.pow10(player.h.stage.mul(3)))).add(1).sub(challengeCompletions(this.layer, this.id))
                return clear.gt(0) ? clear.pow(0.8).floor().toNumber() : 0
            },
            unlocked() { return hasUpgrade("hpw", 1003) || challengeCompletions(this.layer, this.id) > 0 },
            canClick() { return hasUpgrade("hpw", 1003) },
            onEnter() {
                layers.hpw.powerReset(1)
            },
            onExit() {
                layers.hpw.powerReset(1)
            },
            onComplete() {if (player[this.layer].challenges[this.id] >= 30) player.tera.realmMastery[2] = true},
            style: {width: '250px', height: '204px', backgroundColor: "#cc4", border: "6px solid #880", borderRadius: "13px"},
            buttonStyle() {
                let look = {height: "40px", marginTop: "5px", marginBottom: "5px", borderRadius: "20px"}
                if (this.canComplete() && inChallenge(this.layer, this.id)) look.border = "4px solid #77bf5f"
                if (!this.canClick()) look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        14: {
            name() { return "Dimensional Realm (" + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit() + ")"},
            completionLimit() {return buyableEffect("hpw", 4).add(player.h.stage.div(2).floor()).add(hasUpgrade("tera", "hex3") ? player.tera.trueHex.pow(player.h.externalRaise).floor() : 0)},
            marked: false,
            goal() {return Decimal.pow(1e5, challengeCompletions(this.layer, this.id)).mul(1e10)},
            fullDisplay() {
                let str = "<h4>" + player.h.stageName[0] + " points are heavily softcapped, but unlock " + player.h.stageName[0] + " of Sacrifice.</h4>"
                if (Decimal.lt(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>Goal: " + formatShortWhole(this.goal()) + " Hex Points")
                if (Decimal.gte(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>COMPLETED")
                return str
            },
            canComplete() {
                let clear = player.h.hexPoint.div(1e10).add(1).ln().div(Decimal.ln(1e5)).add(1).sub(challengeCompletions(this.layer, this.id))
                return clear.gt(0) ? clear.pow(0.8).floor().toNumber() : 0
            },
            unlocked() { return hasUpgrade("hpw", 1004) || challengeCompletions(this.layer, this.id) > 0 },
            canClick() { return hasUpgrade("hpw", 1004) },
            onEnter() {
                layers.hpw.powerReset(1)
            },
            onExit() {
                layers.hpw.powerReset(1)
            },
            onComplete() {if (player[this.layer].challenges[this.id] >= 30) player.tera.realmMastery[3] = true},
            style: {width: '250px', height: '204px', backgroundColor: "#4c4", border: "6px solid #080", borderRadius: "13px"},
            buttonStyle() {
                let look = {height: "40px", marginTop: "5px", marginBottom: "5px", borderRadius: "20px"}
                if (this.canComplete() && inChallenge(this.layer, this.id)) look.border = "4px solid #77bf5f"
                if (!this.canClick()) look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        15: {
            name() { return "Dream Realm (" + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit() + ")"},
            completionLimit() {return buyableEffect("hpw", 5).add(player.h.stage.div(2).floor()).add(hasUpgrade("tera", "hex3") ? player.tera.trueHex.pow(player.h.externalRaise).floor() : 0)},
            marked: false,
            goal() {return Decimal.pow(Decimal.pow10(player.h.stage.div(6)), challengeCompletions(this.layer, this.id)).mul(Decimal.pow10(player.h.stage).mul(player.h.stage))},
            fullDisplay() {
                let str = "<h4>Challenge ends after 60 seconds. Most automation is turned off.</h4>"
                if (Decimal.lt(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>Goal: " + formatShortWhole(this.goal()) + " Blessings")
                if (Decimal.gte(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>COMPLETED")
                return str
            },
            canComplete() {
                let clear = player.hbl.blessings.div(Decimal.pow10(player.h.stage).mul(player.h.stage)).add(1).ln().div(Decimal.mul(Decimal.ln(10), player.h.stage.div(6))).add(1).sub(challengeCompletions(this.layer, this.id))
                return clear.gt(0) ? clear.pow(0.8).floor().toNumber() : 0
            },
            unlocked() { return hasUpgrade("hpw", 1005) || challengeCompletions(this.layer, this.id) > 0 },
            canClick() { return hasUpgrade("hpw", 1005) },
            onEnter() {
                if (player.subtabs["hbl"]['stuff'] == 'blessing') player.subtabs["hbl"]['blessing'] = 'Boons'
                layers.hpw.powerReset(1)
            },
            onExit() {
                layers.hpw.powerReset(1)
            },
            onComplete() {if (player[this.layer].challenges[this.id] >= 30) player.tera.realmMastery[4] = true},
            style: {width: '250px', height: '204px', backgroundColor: "#44c", border: "6px solid #008", borderRadius: "13px"},
            buttonStyle() {
                let look = {height: "40px", marginTop: "5px", marginBottom: "5px", borderRadius: "20px"}
                if (this.canComplete() && inChallenge(this.layer, this.id)) look.border = "4px solid #77bf5f"
                if (!this.canClick()) look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        16: {
            name() { return "Void Realm (" + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit() + ")"},
            completionLimit() {return buyableEffect("hpw", 6).add(player.h.stage.div(2).floor()).add(hasUpgrade("tera", "hex3") ? player.tera.trueHex.pow(player.h.externalRaise).floor() : 0)},
            marked: false,
            goal() {return Decimal.mul(player.h.stage.div(2), challengeCompletions(this.layer, this.id)).add(player.h.stage.mul(12.5))},
            fullDisplay() {
                let str = "<h4>The void has made you forget the concept of provenances.</h4>"
                if (inChallenge("hrm", 16)) str = "<h4>The void has made you forget the concept of ███████████.</h4>"
                if (Decimal.lt(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>Goal: " + formatShortWhole(this.goal()) + " Refinements")
                if (Decimal.gte(challengeCompletions(this.layer, this.id), this.completionLimit())) str = str.concat("<br>COMPLETED")
                return str
            },
            canComplete() {
                let clear = player.hre.refinement.sub(player.h.stage.mul(12.5)).div(player.h.stage.div(2)).add(1).sub(challengeCompletions(this.layer, this.id))
                return clear.gt(0) ? clear.pow(0.8).floor().toNumber() : 0
            },
            unlocked() { return hasUpgrade("hpw", 1006) || challengeCompletions(this.layer, this.id) > 0 },
            canClick() { return hasUpgrade("hpw", 1006) },
            onEnter() {
                layers.hpw.powerReset(1)
            },
            onExit() {
                layers.hpw.powerReset(1)
            },
            onComplete() {if (player[this.layer].challenges[this.id] >= 30) player.tera.realmMastery[5] = true},
            style: {width: '250px', height: '204px', backgroundColor: "#84c", border: "6px solid #408", borderRadius: "13px"},
            buttonStyle() {
                let look = {height: "40px", marginTop: "5px", marginBottom: "5px", borderRadius: "20px"}
                if (this.canComplete() && inChallenge(this.layer, this.id)) look.border = "4px solid #77bf5f"
                if (!this.canClick()) look.backgroundColor = "#bf8f8f"
                return look
            },
        },
    },
    microtabs: {
        realm: {
            "Challenges": {
                buttonStyle() { return {borderColor: "#ccc", borderRadius: "5px"}},
                unlocked: true,
                content: [
                    ["blank", "25px"],
                    ["style-column", [
                        ["style-row", [
                            ["raw-html", () => { return "Realm Completion Bonus: x" + format(new Decimal(player.hrm.realmEffect), 1) + " Power" }, {color: "white", fontSize: "22px", fontFamily: "monospace"}],
                        ], {width: "800px", height: "47px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderBottom: "3px solid white", borderRadius: "17px 17px 0px 0px"}],
                        ["style-row", [
                            ["style-row", [["challenge", 11]], {width: "250px", height: "204px", backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid white", margin: "5px", borderRadius: "15px"}],
                            ["style-row", [["challenge", 12]], {width: "250px", height: "204px", backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid white", margin: "5px", borderRadius: "15px"}],
                            ["style-row", [["challenge", 13]], {width: "250px", height: "204px", backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid white", margin: "5px", borderRadius: "15px"}],
                        ], {width: "800px", height: "220px", backgroundColor: "rgba(0, 0, 0, 0.75)", paddingTop: "5px"}],
                        ["style-row", [
                            ["style-row", [["challenge", 14]], {width: "250px", height: "204px", backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid white", margin: "5px", borderRadius: "15px"}],
                            ["style-row", [["challenge", 15]], {width: "250px", height: "204px", backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid white", margin: "5px", borderRadius: "15px"}],
                            ["style-row", [["challenge", 16]], {width: "250px", height: "204px", backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid white", margin: "5px", borderRadius: "15px"}],
                        ], {width: "800px", height: "220px", backgroundColor: "rgba(0, 0, 0, 0.75)", paddingBottom: "5px"}],
                        ["style-row", [
                            ["raw-html", "Unlock new realm challenges through mights", {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ], {width: "800px", height: "37px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderTop: "3px solid white", borderRadius: "0px 0px 17px 17px"}],
                    ], () => {
                        let look = {width: "800px", height: "540px", background: "linear-gradient(90deg, #770000, #775400, #747700, #147700, #00772A, #007769, #004677, #000877, #330077, #710077)", border: "3px solid white", borderRadius: "20px"}
                        if (!hasUpgrade("bi", 27)) {look.opacity = "0.3";look.userSelect = "none"}
                        return look
                    }],
                    ["blank", "25px"],
                    ["style-row", [
                        ["raw-html", () => {return "<span style='color:#f44'>CHALLENGE SOFTCAP</span><br>/" + formatWhole(player.hrm.challengeSoftcap) + " Pre-Power Resources"}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                    ], () => {return player.hrm.challengeSoftcap.gt(1) ? {width: "600px", height: "50px", background: "linear-gradient(90deg, #530000, #533a00, #515300, #0e5300, #00531d, #005349, #004677, #003153, #230053, #4f0053)", border: "3px solid white", borderRadius: "20px"} : {display: "none !important"}}],
                ],
            },
            "Essence": {
                buttonStyle() { return {borderColor: "#ccc", borderRadius: "5px"}},
                unlocked() {return layerShown("s")},
                content: [
                    ["blank", "25px"],
                    ["style-column", [
                        ["row", [
                            ["raw-html", () => {return "You have <h3>" + formatShort(player.hrm.realmEssence) + "</h3> Realm Essence."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                            ["raw-html", () => {return "(+" + formatShort(player.hrm.realmEssenceGain) + ")"}, () => {
                                let look = {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}
                                player.hrm.realmEssenceGain.gt(0) ? look.color = "white" : look.color = "gray"
                                return look
                            }],
                        ]],
                        ["row", [
                            ["raw-html", () => {return "Boosts Pre-Power resources by x" + format(player.hrm.realmEssenceEffects[0])}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", () => {return player.hrm.realmEssenceEffects[0].gte(1e10) ? "[HARDCAPPED]" : player.hrm.realmEssence.gte(player.h.stage.pow(5)) ? "[SOFTCAPPED]" : ""}, {color: "red", fontSize: "14px", fontFamily: "monospace", marginLeft: "8px"}],
                        ]],
                        ["row", [
                            ["raw-html", () => {return "Boosts Checkback Tickspeed by x" + format(player.hrm.realmEssenceEffects[1])}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", () => {return player.hrm.realmEssenceEffects[1].gte(3) ? "[HARDCAPPED]" : player.hrm.realmEssence.gte(player.h.stage.pow(10)) ? "[SOFTCAPPED]" : ""}, {color: "red", fontSize: "14px", fontFamily: "monospace", marginLeft: "8px"}],
                        ]],
                    ], {width: "600px", height: "75px", background: "linear-gradient(90deg, #530000, #533a00, #515300, #0e5300, #00531d, #005349, #004677, #003153, #230053, #4f0053)", borderTop: "3px solid white", borderLeft: "3px solid white", borderRight: "3px solid white", borderRadius: "20px 20px 0px 0px"}],
                    ["style-column", [
                        ["clickable", 1],
                        ["blank", "5px"],
                        ["row", [["buyable", 1], ["buyable", 2], ["buyable", 3], ["buyable", 4], ["buyable", 5], ["buyable", 6]]],
                    ], {width: "760px", height: "180px", background: "linear-gradient(90deg, #2f0000, #2f2100, #2e2f00, #082f00, #002f10, #002f2a, #004677, #001c2f, #14002f, #2d002f)", border: "3px solid white", borderRadius: "20px"}],
                    ["style-column", [
                        ["raw-html", "Realm essence gain is based on realm challenge clears,<br>and is gained on singularity reset.", {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ], {width: "600px", height: "50px", background: "linear-gradient(90deg, #530000, #533a00, #515300, #0e5300, #00531d, #005349, #004677, #003153, #230053, #4f0053)", borderBottom: "3px solid white", borderLeft: "3px solid white", borderRight: "3px solid white", borderRadius: "0 0 20px 20px"}],
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
            ["raw-html", () => {return player.h.stageName[0] + " of Realms"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", background: "linear-gradient(90deg, #770000, #775400, #747700, #147700, #00772A, #007769, #004677, #000877, #330077, #710077)", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "5px"],
        ["microtabs", "realm", {borderWidth: "0px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.h.stage.eq(6) && (hasUpgrade("bi", 27) || hasMilestone("s", 11))}, // Decides if this node is shown or not.
});
addLayer("gwaTemple", {
    name: "Gwa Temple", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='resources/gwa.png' style='width:50px;height:50px;border-radius:25px;margin:-25px;transform:translate(0, -12px)'></img>", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "CB",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        gwaPoints: new Decimal(0),
        gwaPointsGain: new Decimal(0),
        gwaPointsEffect: new Decimal(1),

        worship: false,
        gwaWorshipTime: new Decimal(0),
        gwaWorshipCooldown: new Decimal(0),
        gwaWorshipCooldownMax: new Decimal(10),
        timeSinceGwarship: new Decimal(0),
        gwarshipAmt: new Decimal(0),

        gwagradeAmt: 0,

        gwank: new Decimal(0),
        gwankGet: new Decimal(1),
        gwankReq: new Decimal(2500),
        highestGwank: new Decimal(0),
        gwankEffect: new Decimal(1),

        gwanker: new Decimal(0),
        gwankerGet: new Decimal(1),
        gwankerReq: new Decimal(10),
        highestGwanker: new Decimal(0),
        gwankerEffect: new Decimal(1),
        gwankerEffect2: new Decimal(0),

        gwankest: new Decimal(0),
        gwankestGet: new Decimal(1),
        gwankestReq: new Decimal(5),
        highestGwankest: new Decimal(0),
        gwankestEffect: new Decimal(1),
        gwankestEffect2: new Decimal(0),

        gwark: new Decimal(0),
        highestGwark: new Decimal(0),
        gwarkGain: new Decimal(1),
        gwarkReq: new Decimal(1e25),
        gwarkEffect: new Decimal(1),

        firstSoftcap: new Decimal(0.5),
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "#ffb",
            backgroundOrigin: "border-box",
            borderColor: "#996",
        };
    },
    tooltip: "Gwa Temple",
    color: "#ffb",
    branches: ["cb"],
    update(delta) {
        let onepersec = new Decimal(1)

        // GWA POINTS
        player.gwaTemple.gwaPointsGain = getLevelableAmount("pet", 2101)
        if (hasUpgrade("gwaTemple", 16)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.pow(1.3)

        if (hasUpgrade("gwaTemple", 1)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(2)
        if (hasUpgrade("gwaTemple", 3)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(upgradeEffect("gwaTemple", 3))
        if (hasUpgrade("gwaTemple", 4)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(upgradeEffect("gwaTemple", 4))
        if (hasUpgrade("gwaTemple", 6)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(4)
        if (hasUpgrade("gwaTemple", 11)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(4)
        player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(player.gwaTemple.gwankEffect)
        if (hasUpgrade("gwaTemple", 20)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(upgradeEffect("gwaTemple", 20))
        if (hasUpgrade("gwaTemple", 22)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(4)
        player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(buyableEffect("gwaTemple", 11))
        if (hasUpgrade("gwaTemple", 28)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(10)
        if (hasUpgrade("gwaTemple", 29)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(upgradeEffect("gwaTemple", 29))
        if (hasUpgrade("gwaTemple", 102)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(3)
        if (hasUpgrade("gwaTemple", 105)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(upgradeEffect("gwaTemple", 105))
        if (hasUpgrade("gwaTemple", 31)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.mul(3)

        player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.pow(player.gwaTemple.gwarkEffect)

        player.gwaTemple.firstSoftcap = Decimal.div(0.5, player.gwaTemple.gwaPointsGain.div(1e100).add(1).log(1e100).div(100).add(1))
        if (player.gwaTemple.gwaPointsGain.gte(1e100)) player.gwaTemple.gwaPointsGain = player.gwaTemple.gwaPointsGain.div(1e100).pow(player.gwaTemple.firstSoftcap).mul(1e100)

        player.gwaTemple.gwaPointsEffect = hasUpgrade("gwaTemple", 5) ? player.gwaTemple.gwaPoints.add(1).log(10).pow(0.5).div(20).add(1) : new Decimal(1)

        // GWAGRADE AMT
        player.gwaTemple.gwagradeAmt = 0
        for (let i in player.gwaTemple.upgrades) {
            if (player.gwaTemple.upgrades[i] < 100) player.gwaTemple.gwagradeAmt++
        }

        // GWANK
        let gwankDiv = new Decimal(1)
        gwankDiv = gwankDiv.mul(buyableEffect("gwaTemple", 12))
        if (hasUpgrade("gwaTemple", 22)) gwankDiv = gwankDiv.div(2)

        if (player.gwaTemple.gwank.lt(10000)) {player.gwaTemple.gwankReq = layers.h.hexReq(player.gwaTemple.gwank, 2500, 1.5, gwankDiv)
        } else {
            player.gwaTemple.gwankReq = player.gwaTemple.gwank.sub(7088).pow(player.gwaTemple.gwank.div(1000).log(10).div(2).add(1.5)).mul(2500).div(gwankDiv).ceil()
        }
        
        if (!hasUpgrade("gwaTemple", 15) && !hasUpgrade("gwaTemple", 104)) {player.gwaTemple.gwankGet = new Decimal(1)
        } else if (player.gwaTemple.gwaPoints.lt(Decimal.div(2.5e9, gwankDiv))) {player.gwaTemple.gwankGet = layers.h.hexGain(player.gwaTemple.gwaPoints, 2500, 1.5, gwankDiv).sub(player.gwaTemple.gwank).max(0)
        } else {
            player.gwaTemple.gwankGet = Decimal.pow(10, player.gwaTemple.gwaPoints.mul(gwankDiv).div(2500).log(10).pow(0.5).mul(Decimal.pow(2, 0.5))).floor().add(7089).sub(player.gwaTemple.gwank).max(0)
        }

        player.gwaTemple.gwankEffect = player.gwaTemple.gwank.add(player.gwaTemple.gwankerEffect2).div(2).add(1).pow(1.05).pow(player.gwaTemple.gwankerEffect)

        if (hasUpgrade("gwaTemple", 104)) player.gwaTemple.gwank = player.gwaTemple.gwank.add(player.gwaTemple.gwankGet)

        // GWANKER
        let gwankerDiv = new Decimal(1)
        gwankerDiv = gwankerDiv.mul(buyableEffect("gwaTemple", 14))
        if (hasUpgrade("gwaTemple", 19)) gwankerDiv = gwankerDiv.mul(upgradeEffect("gwaTemple", 19))

        player.gwaTemple.gwankerReq = layers.h.hexReq(player.gwaTemple.gwanker, 10, 1.45, gwankerDiv)
        player.gwaTemple.gwankerGet = hasUpgrade("gwaTemple", 24) ? layers.h.hexGain(player.gwaTemple.gwank, 10, 1.45, gwankerDiv).sub(player.gwaTemple.gwanker).max(0) : new Decimal(1)

        player.gwaTemple.gwankerEffect = player.gwaTemple.gwanker.add(player.gwaTemple.gwankestEffect2).add(1).log(2).div(2).add(1).pow(0.3).pow(player.gwaTemple.gwankestEffect)
        if (player.gwaTemple.gwankerEffect.gte(10)) player.gwaTemple.gwankerEffect = player.gwaTemple.gwankerEffect.div(10).pow(0.3).mul(10)
        player.gwaTemple.gwankerEffect2 = player.gwaTemple.gwanker.add(player.gwaTemple.gwankestEffect2).pow(player.gwaTemple.gwankestEffect).floor()

        // GWANKEST
        let gwankestDiv = new Decimal(1)
        gwankestDiv = gwankestDiv.mul(buyableEffect("gwaTemple", 16))
        player.gwaTemple.gwankestReq = Decimal.pow(2, player.gwaTemple.gwankest).mul(1000).div(gwankestDiv)
        player.gwaTemple.gwankestGet = hasUpgrade("gwaTemple", 107) ? player.gwaTemple.gwanker.add(1).div(1000).mul(gwankestDiv).ln().div(new Decimal(2).ln()).add(1).sub(player.gwaTemple.gwankest).floor().max(0) : new Decimal(1)

        player.gwaTemple.gwankestEffect = player.gwaTemple.gwankest.add(1).log(2).div(2).add(1).pow(0.2)
        if (player.gwaTemple.gwankestEffect.gte(2)) player.gwaTemple.gwankestEffect = player.gwaTemple.gwankestEffect.div(2).pow(0.3).mul(2)
        player.gwaTemple.gwankestEffect2 = player.gwaTemple.gwankest.mul(10).pow(1.5).floor()

        // GWARK
        let gwarkDiv = new Decimal(1)
        player.gwaTemple.gwarkReq = Decimal.pow(1e5, player.gwaTemple.gwark).mul(1e25).div(gwarkDiv)
        player.gwaTemple.gwarkGain = player.gwaTemple.gwaPoints.add(1).div(1e25).mul(gwarkDiv).ln().div(new Decimal(1e5).ln()).add(1).sub(player.gwaTemple.gwark).floor().max(0)
        player.gwaTemple.gwarkEffect = player.gwaTemple.highestGwark.add(1).log(2).div(10).add(1)

        // GWARSHIP
        let effGwarshipTime = new Decimal(1)
        if (hasUpgrade("gwaTemple", 101)) effGwarshipTime = effGwarshipTime.mul(5)
        if (hasUpgrade("gwaTemple", 32)) effGwarshipTime = effGwarshipTime.mul(2)
        if (hasUpgrade("gwaTemple", 35)) effGwarshipTime = effGwarshipTime.mul(upgradeEffect("gwaTemple", 35))
        effGwarshipTime = effGwarshipTime.mul(buyableEffect("gwaTemple", 18))
        
        player.gwaTemple.timeSinceGwarship = player.gwaTemple.timeSinceGwarship.add(delta)
        if (player.gwaTemple.worship) {
            player.gwaTemple.gwaWorshipTime = player.gwaTemple.gwaWorshipTime.add(Decimal.mul(delta, effGwarshipTime))
            player.gwaTemple.gwaWorshipCooldown = player.gwaTemple.gwaWorshipCooldown.add(delta)
        } else if (hasUpgrade("gwaTemple", 101)) {
            let eff = 0.25
            player.gwaTemple.gwaWorshipTime = player.gwaTemple.gwaWorshipTime.add(Decimal.mul(delta, eff).mul(effGwarshipTime))
            player.gwaTemple.gwaWorshipCooldown = player.gwaTemple.gwaWorshipCooldown.add(Decimal.mul(delta, eff))
        }

        player.gwaTemple.gwaWorshipCooldownMax = new Decimal(10)
        if (hasUpgrade("gwaTemple", 2)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.div(1.25)
        if (hasUpgrade("gwaTemple", 8)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.div(1.6)
        if (hasUpgrade("gwaTemple", 11)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.mul(1.5)
        if (hasUpgrade("gwaTemple", 14)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.div(2)
        if (hasUpgrade("gwaTemple", 23)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.div(upgradeEffect("gwaTemple", 23))
        player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.div(buyableEffect("gwaTemple", 13))
        if (hasUpgrade("gwaTemple", 26)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.mul(2)
        if (hasUpgrade("gwaTemple", 32)) player.gwaTemple.gwaWorshipCooldownMax = player.gwaTemple.gwaWorshipCooldownMax.div(1.5)

        let effGwarshipGain = new Decimal(1)
        if (hasUpgrade("gwaTemple", 31)) effGwarshipGain = effGwarshipGain.mul(10)
        effGwarshipGain = effGwarshipGain.mul(buyableEffect("gwaTemple", 17))

        if (player.gwaTemple.gwaWorshipCooldown.gte(player.gwaTemple.gwaWorshipCooldownMax)) {
            player.gwaTemple.gwaWorshipCooldown = new Decimal(0)
            player.gwaTemple.timeSinceGwarship = new Decimal(0)
            player.gwaTemple.gwarshipAmt = player.gwaTemple.gwarshipAmt.add(effGwarshipGain)
            let gwamble = 0
            let gain = player.gwaTemple.gwaPointsGain
            let chance = 0.1
            chance = chance + buyableEffect("gwaTemple", 15).sub(1).toNumber()
            let mult = new Decimal(10)
            if (hasUpgrade("gwaTemple", 25)) mult = new Decimal(25)
            if (hasUpgrade("gwaTemple", 7) && Math.random() < chance) {
                gain = gain.mul(mult); gwamble = 1
                if (hasUpgrade("gwaTemple", 33) && Math.random() < 0.1) {gain = gain.mul(mult); gwamble = 2}
            }
            player.gwaTemple.gwaPoints = player.gwaTemple.gwaPoints.add(gain)
            if (player.tab == "gwaTemple" && gain.gt(0)) {
                if (gwamble == 2) makeParticles(BIG_COOKIE_NUMBER, 1, `normal`, {x: mouseX-80+(Math.random()*10), text: "+" + formatSimple(gain) + "<br>[SUPER GWAMBLE]", style: {color: "#ff4"}})
                if (gwamble == 1) makeParticles(BIG_COOKIE_NUMBER, 1, `normal`, {x: mouseX-80+(Math.random()*10), text: "+" + formatSimple(gain) + "<br>[GWAMBLE]", style: {color: "#ff8"}})
                else makeParticles(BIG_COOKIE_NUMBER, 1, `normal`, {x: mouseX-80+(Math.random()*10), text: "+" + formatSimple(gain), style: {color: "#ffb"}})
            }
        }
    },
    clickables: {
        11: {
            title() {return "Reset previous gwagress, but gwank up.<br><small>Req: " + formatSimple(player.gwaTemple.gwankReq) + " Gwa Points</small>"},
            canClick() { return player.gwaTemple.gwaPoints.gte(player.gwaTemple.gwankReq) },
            unlocked() { return true },
            onClick() {
                player.gwaTemple.gwank = player.gwaTemple.gwank.add(player.gwaTemple.gwankGet)

                if (player.gwaTemple.gwank.gt(player.gwaTemple.highestGwank)) player.gwaTemple.highestGwank = player.gwaTemple.gwank

                player.gwaTemple.gwaPoints = new Decimal(0)
                player.gwaTemple.gwaPointsGain = new Decimal(0)
                player.gwaTemple.gwaWorshipCooldown = new Decimal(0)
                player.gwaTemple.timeSinceGwarship = new Decimal(0)
                for (let i = 0; i < player.gwaTemple.upgrades.length; i++) {
                    let upg = +player.gwaTemple.upgrades[i]
                    if (upg < 100) {
                        if (upg == 12 || upg == 15 || upg == 18 || upg == 21 || upg == 24 || upg == 27 || upg == 30) continue
                        player.gwaTemple.upgrades.splice(i, 1);
                        i--;
                    }
                }
            },
            onHold() { clickClickable(this.layer, this.id) },
            style() {
                let look = {width: "150px", minHeight: "75px", borderRadius: "0px 17px 17px 0px", color: "black", border: "3px solid rgba(0,0,0,0.3)", fontSize: "8px"}
                this.canClick() ? look.backgroundColor = "#bb9" : look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        12: {
            title() {return "Reset previous gwagress, but gwanker up.<br><small>Req: " + formatSimple(player.gwaTemple.gwankerReq) + " Gwanks</small>"},
            canClick() { return player.gwaTemple.gwank.gte(player.gwaTemple.gwankerReq) },
            unlocked() { return true },
            onClick() {
                player.gwaTemple.gwanker = player.gwaTemple.gwanker.add(player.gwaTemple.gwankerGet)

                if (player.gwaTemple.gwanker.gt(player.gwaTemple.highestGwanker)) player.gwaTemple.highestGwanker = player.gwaTemple.gwanker

                player.gwaTemple.gwaPoints = new Decimal(0)
                player.gwaTemple.gwaPointsGain = new Decimal(0)
                player.gwaTemple.gwaWorshipCooldown = new Decimal(0)
                player.gwaTemple.timeSinceGwarship = new Decimal(0)
                for (let i = 0; i < player.gwaTemple.upgrades.length; i++) {
                    let upg = +player.gwaTemple.upgrades[i]
                    if (upg < 100) {
                        if (upg == 12 || upg == 15 || upg == 18 || upg == 21 || upg == 24 || upg == 27 || upg == 30) continue
                        player.gwaTemple.upgrades.splice(i, 1);
                        i--;
                    }
                }
                player.gwaTemple.gwank = new Decimal(0)
                player.gwaTemple.gwankGet = new Decimal(0)
                player.gwaTemple.gwankEffect = new Decimal(1)
            },
            onHold() { clickClickable(this.layer, this.id) },
            style() {
                let look = {width: "150px", minHeight: "75px", borderRadius: "0px 17px 17px 0px", color: "black", border: "3px solid rgba(0,0,0,0.3)", fontSize: "8px"}
                this.canClick() ? look.backgroundColor = "#bb9" : look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        13: {
            title() {return "Reset previous gwagress, but gwankest up.<br><small>Req: " + formatSimple(player.gwaTemple.gwankestReq) + " Gwankers</small>"},
            canClick() { return player.gwaTemple.gwanker.gte(player.gwaTemple.gwankestReq) },
            unlocked() { return true },
            onClick() {
                player.gwaTemple.gwankest = player.gwaTemple.gwankest.add(player.gwaTemple.gwankestGet)

                if (player.gwaTemple.gwankest.gt(player.gwaTemple.highestGwankest)) player.gwaTemple.highestGwankest = player.gwaTemple.gwankest

                player.gwaTemple.gwaPoints = new Decimal(0)
                player.gwaTemple.gwaPointsGain = new Decimal(0)
                player.gwaTemple.gwaWorshipCooldown = new Decimal(0)
                player.gwaTemple.timeSinceGwarship = new Decimal(0)
                for (let i = 0; i < player.gwaTemple.upgrades.length; i++) {
                    let upg = +player.gwaTemple.upgrades[i]
                    if (upg < 100) {
                        if (upg == 12 || upg == 15 || upg == 18 || upg == 21 || upg == 24 || upg == 27 || upg == 30) continue
                        player.gwaTemple.upgrades.splice(i, 1);
                        i--;
                    }
                }
                player.gwaTemple.gwank = new Decimal(0)
                player.gwaTemple.gwankGet = new Decimal(0)
                player.gwaTemple.gwankEffect = new Decimal(1)
                player.gwaTemple.gwanker = new Decimal(0)
                player.gwaTemple.gwankerGet = new Decimal(0)
                player.gwaTemple.gwankerEffect = new Decimal(1)
                player.gwaTemple.gwankerEffect2 = new Decimal(1)
            },
            onHold() { clickClickable(this.layer, this.id) },
            style() {
                let look = {width: "150px", minHeight: "75px", borderRadius: "0px 17px 17px 0px", color: "black", border: "3px solid rgba(0,0,0,0.3)", fontSize: "8px"}
                this.canClick() ? look.backgroundColor = "#bb9" : look.backgroundColor = "#bf8f8f"
                return look
            },
        },
        21: {
            title() {
                return "<h3>Gain a gwark, but reset all previous gwagress.</h3><br>Req: " + format(player.gwaTemple.gwarkReq) + " Gwa Points"
            },
            canClick() { return player.gwaTemple.gwarkGain.gte(1)},
            unlocked: true,
            onClick() {
                player.gwaTemple.gwark = player.gwaTemple.gwark.add(player.gwaTemple.gwarkGain)
                if (player.gwaTemple.highestGwark.lt(player.gwaTemple.gwark)) player.gwaTemple.highestGwark = player.gwaTemple.gwark

                // RESET CODE
                player.gwaTemple.gwaPoints = new Decimal(0)
                player.gwaTemple.gwaPointsGain = new Decimal(0)
                player.gwaTemple.gwarshipAmt = new Decimal(0)
                player.gwaTemple.gwaWorshipCooldown = new Decimal(0)
                player.gwaTemple.timeSinceGwarship = new Decimal(0)
                player.gwaTemple.gwaWorshipTime = new Decimal(0)
                for (let i = 0; i < player.gwaTemple.upgrades.length; i++) {
                    let upg = +player.gwaTemple.upgrades[i]
                    if (upg < 100) {
                        if (upg == 30) continue
                        player.gwaTemple.upgrades.splice(i, 1);
                        i--;
                    }
                }
                player.gwaTemple.gwank = new Decimal(0)
                player.gwaTemple.gwankGet = new Decimal(0)
                player.gwaTemple.gwankEffect = new Decimal(1)
                player.gwaTemple.gwanker = new Decimal(0)
                player.gwaTemple.gwankerGet = new Decimal(0)
                player.gwaTemple.gwankerEffect = new Decimal(1)
                player.gwaTemple.gwankerEffect2 = new Decimal(1)
                player.gwaTemple.gwankest = new Decimal(0)
                player.gwaTemple.gwankestGet = new Decimal(0)
                player.gwaTemple.gwankestEffect = new Decimal(1)
                player.gwaTemple.gwankestEffect2 = new Decimal(1)

                for (let i = 11; i < 20; i++) {
                    player.gwaTemple.buyables[i] = new Decimal(0)
                }
            },
            style() {
                let look = {width: "794px", minHeight: "50px", color: "black", border: "3px solid rgba(0,0,0,0.3)", borderRadius: "0"}
                return look
            },

        },
    },
    upgrades: {
        1: {
            title: "Gwanset",
            unlocked: true,
            description: "Double gwa point gain.",
            cost() {return new Decimal(0.5)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        2: {
            title: "Untrained Gwarshipper",
            unlocked: true,
            description: "Reduce gwarship time by /1.25.",
            cost() {return new Decimal(1.2)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        3: {
            title: "Gwantifiable",
            unlocked: true,
            description: "Multiply Gwa Points based on amount of Gwagrades.",
            cost() {return new Decimal(1.5)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                let raise = new Decimal(1)
                if (hasUpgrade("gwaTemple", 34)) raise = raise.mul(upgradeEffect("gwaTemple", 34))
                if (hasUpgrade("gwaTemple", 9)) return Decimal.div(player.gwaTemple.gwagradeAmt, 4).add(1).pow(raise)
                return Decimal.div(player.gwaTemple.gwagradeAmt, 5).add(1).pow(raise)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        4: {
            title: "Gwanception",
            unlocked: true,
            description: "Gwa points effect gwa point gain.",
            cost() {return new Decimal(3)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                if (hasUpgrade("gwaTemple", 13)) return player.gwaTemple.gwaPoints.add(1).log(3).add(1)
                return player.gwaTemple.gwaPoints.add(1).log(10).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        5: {
            title: "Heard Gwayers",
            unlocked: true,
            description: "Unlock a gwa point effect.",
            cost() {return new Decimal(6)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        6: {
            title: "Gwad Gains",
            unlocked: true,
            description: "Gwad gwa point gain.",
            cost() {return new Decimal(15)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        7: {
            title: "Gwambling",
            unlocked: true,
            description() {
                let mult = new Decimal(10).mul(buyableEffect("gwaTemple", 19))
                if (hasUpgrade("gwaTemple", 25)) mult = mult.mul(2.5)
                return "Gain a " + formatWhole(buyableEffect("gwaTemple", 15).sub(1).mul(100).add(10)) + "% chance to gain x" + formatSimple(mult) + " gwa points when gwarshipping"
            },
            cost() {return new Decimal(77)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        8: {
            title: "Novice Gwarshipper",
            unlocked: true,
            description: "Reduce gwarship time by /1.6.",
            cost() {return new Decimal(200)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        9: {
            title: "Gwaint Improvement",
            unlocked: true,
            description: "Slightly improve \"Gwantifiable\"'s effect.",
            cost() {return new Decimal(300)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        10: {
            title: "Crate Gwance",
            unlocked: true,
            description: "Increase crate roll chance by +10%.",
            cost() {return new Decimal(600)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        11: {
            title: "Charged Gwarship",
            unlocked: true,
            description: "Increase gwarship time by x1.5, but gwadruple gwa point gain.",
            cost() {return new Decimal(1200)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        12: {
            title: "Gwankup",
            unlocked: true,
            description: "Unlock gwanks.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(2500)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        13: {
            title: "Gwaditional",
            unlocked: true,
            description: "Improve \"Gwanception\".",
            cost() {return new Decimal(7500)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        14: {
            title: "Apprentice Gwarshiper",
            unlocked: true,
            description: "Halve gwarship time.",
            cost() {return new Decimal(15000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        15: {
            title: "Bulk Gwanking",
            unlocked: true,
            description: "Unlock bulk gwanking.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(25000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        16: {
            title: "Gwanterfit",
            unlocked: true,
            description: "Raise base gwa point gain by ^1.3.",
            cost() {return new Decimal(40000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        17: {
            title: "Parallel Gwayers",
            unlocked: true,
            description() {return "Boost pet points based on the gwa point effect.<br>Currently: x" + formatSimple(player.gwaTemple.gwaPointsEffect, 2)},
            cost() {return new Decimal(60000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        18: {
            title: "Gwankerup",
            unlocked: true,
            description: "Unlock gwankers.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(80000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        19: {
            title: "Gwaked Gwankers",
            unlocked: true,
            description: "Reduce gwanker cost based on gwa points",
            cost() {return new Decimal(160000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                return player.gwaTemple.gwaPoints.add(1).log(10).div(20).add(1)
            },
            effectDisplay() { return "/" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        20: {
            title: "Gwarshipped Gains",
            unlocked: true,
            description: "Boost gwa points based on total gwarship time",
            cost() {return new Decimal(400000)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                if (hasUpgrade("gwaTemple", 26)) return player.gwaTemple.gwaWorshipTime.pow(0.5).div(10).add(1)
                return player.gwaTemple.gwaWorshipTime.add(1).log(2).div(10).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        21: {
            title: "Gwankables",
            unlocked: true,
            description: "Unlock gwankables.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(1e6)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        22: {
            title: "Gwa Gwarrels",
            unlocked: true,
            description: "Gwadruple gwa points, but double gwank requirement",
            cost() {return new Decimal(1e8)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        23: {
            title: "Delayed Gwarship",
            unlocked: true,
            description: "Gwarship time decreases based on time since last gwarship",
            cost() {return new Decimal(1e10)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                return player.gwaTemple.timeSinceGwarship.add(1).log(2).div(10).add(1)
            },
            effectDisplay() { return "/" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", lineHeight: "1", margin: "2px", borderRadius: "15px"},
        },
        24: {
            title: "Bulk Gwankering",
            unlocked: true,
            description: "Unlock bulk gwankering.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(1e12)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        25: {
            title: "Higher Gwager",
            unlocked: true,
            description: "Increase the gwambling multiplier by x2.5",
            cost() {return new Decimal(1e14)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        26: {
            title: "Gwaffering",
            unlocked: true,
            description: "Improve \"Gwarshipped Gains\", but double gwarship time",
            cost() {return new Decimal(1e16)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        27: {
            title: "Gwankestup",
            unlocked: true,
            description: "Unlock gwankests.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(1e18)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        28: {
            title: "Gwagnitude",
            unlocked: true,
            description: "Decuple gwa point gain",
            cost() {return new Decimal(1e20)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        29: {
            title: "Blessed Gwankables",
            unlocked: true,
            description: "Buff gwa points based on Gwankable I-GWA-3",
            cost() {return new Decimal(1e22)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                return buyableEffect("gwaTemple", 13)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        30: {
            title: "Gwarks",
            unlocked: true,
            description: "Unlock gwarks.<br><small>[Kept on Resets]</small>",
            cost() {return new Decimal(1e24)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        31: {
            title: "Powered Gwarshipping",
            unlocked() {return hasUpgrade("gwaTemple", 108)},
            description: "Triple gwa point gain and decuple gwarship gain",
            cost() {return new Decimal(1e40)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        32: {
            title: "Journeyman Gwarshipper",
            unlocked() {return hasUpgrade("gwaTemple", 108)},
            description: "Reduce gwarship time by /1.5 and double effective gwarship time",
            cost() {return new Decimal(1e45)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        33: {
            title: "Super Gwambling",
            unlocked() {return hasUpgrade("gwaTemple", 108)},
            description: "Gain a 10% chance for your gwambling multiplier to be squared",
            cost() {return new Decimal(1e50)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        34: {
            title: "Beyond Gwantifiable",
            unlocked() {return hasUpgrade("gwaTemple", 108)},
            description: "Raise gwantifiable effect based on gwagrades past 30",
            cost() {return new Decimal(1e55)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                return Decimal.sub(player.gwaTemple.gwagradeAmt, 30).max(0).div(10).add(1)
            },
            effectDisplay() { return "^" + formatSimple(upgradeEffect(this.layer, this.id), 3) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        35: {
            title: "Gwarshipest",
            unlocked() {return hasUpgrade("gwaTemple", 108)},
            description: "Boost effective gwarship time based on gwankests",
            cost() {return new Decimal(1e60)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            effect() {
                return player.gwaTemple.gwankest.pow(0.5).add(1)
            },
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        36: {
            title: "???",
            unlocked() {return hasUpgrade("gwaTemple", 108)},
            description: "Unlock ???",
            cost() {return new Decimal(1e65)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwa Points",
            currencyInternalName: "gwaPoints",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },

        // Boost effective gwarship time based on times gwarshipped

        101: {
            title: "Ceaseless Gwarship",
            unlocked: true,
            description: "Passively gwarship at 25% efficiency and quintuple effective gwarship time",
            cost() {return new Decimal(1)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        102: {
            title: "Gwassic Buff",
            unlocked: true,
            description: "Triple gwa point gain",
            cost() {return new Decimal(1)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        103: {
            title: "Gwality Stones",
            unlocked: true,
            description: "Boost moonstone value based on gwark effect",
            cost() {return new Decimal(1)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            effect() {return player.gwaTemple.gwarkEffect.pow(0.5)},
            effectDisplay() { return "^" + formatSimple(upgradeEffect(this.layer, this.id), 3) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        104: {
            title: "Gwanstant Gwanks",
            unlocked: true,
            description: "Automate gwank gain",
            cost() {return new Decimal(2)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        105: {
            title: "Honing Gwarship",
            unlocked: true,
            description: "Boost gwa points based on times gwarshipped this gwark reset",
            cost() {return new Decimal(2)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            effect() {return player.gwaTemple.gwarshipAmt.div(100).add(1)},
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        106: {
            title: "Gwaced Space",
            unlocked: true,
            description: "Boost space pet xp based on gwarks",
            cost() {return new Decimal(2)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            effect() {return player.gwaTemple.gwark.pow(0.5).div(100).add(1)},
            effectDisplay() { return "x" + formatSimple(upgradeEffect(this.layer, this.id), 2) }, // Add formatting to the effect
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        107: {
            title: "Bulk Gwankesting",
            unlocked: true,
            description: "Unlock bulk gwankesting",
            cost() {return new Decimal(4)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        108: {
            title: "Gwagrades 2.0",
            unlocked: true,
            description: "Unlock new gwagrades",
            cost() {return new Decimal(4)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
        109: {
            title: "Gwastery",
            unlocked: true,
            description: "Unlock gwa temple mastery points in OTF mastery",
            cost() {return new Decimal(4)},
            currencyLocation() { return player.gwaTemple },
            currencyDisplayName: "Gwark",
            currencyInternalName: "gwark",
            style: {color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", margin: "2px", borderRadius: "15px"},
        },
    },
    buyables: {
        11: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.gwaTemple.gwank},
            pay(amt) { player.gwaTemple.gwank = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>I-GWA-1</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Multiply gwa point gain by x1.2\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwanks"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        12: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.gwaTemple.gwank},
            pay(amt) { player.gwaTemple.gwank = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>I-GWA-4</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Divide gwank requirement by /1.1\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwanks"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        13: {
            costBase() { return new Decimal(2) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.gwaTemple.gwanker},
            pay(amt) { player.gwaTemple.gwanker = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>I-GWA-2</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Divide gwarship time by /1.1\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        14: {
            costBase() { return new Decimal(5) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.gwaTemple.gwanker},
            pay(amt) { player.gwaTemple.gwanker = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>I-GWA-5</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Divide gwanker requirement by /1.1\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        15: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(1) },
            purchaseLimit() { return new Decimal(18) },
            currency() { return player.gwaTemple.gwankest},
            pay(amt) { player.gwaTemple.gwankest = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(20).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                if (player.gwaTemple.highestGwankest.lte(0) && !hasUpgrade("gwaTemple", 27)) return "<h3>I-GWA-3</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/18)\n\
                    Increase \"Gwambler\" chance by 5%\n\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1).mul(100)) + "%\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " ???"
                return "<h3>I-GWA-3</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/18)\n\
                    Increase \"Gwambler\" chance by 5%\n\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect.sub(1).mul(100)) + "%\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankests"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        16: {
            costBase() { return new Decimal(2) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.gwaTemple.gwankest},
            pay(amt) { player.gwaTemple.gwankest = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                if (player.gwaTemple.highestGwankest.lte(0) && !hasUpgrade("gwaTemple", 27)) return "<h3>I-GWA-6</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Divide ??? requirement by /1.1\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " ???"
                return "<h3>I-GWA-6</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Divide gwankest requirement by /1.1\n\
                    Currently: /" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankests"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        17: {
            costBase() { return new Decimal(1e15) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.gwaTemple.gwank},
            pay(amt) { player.gwaTemple.gwank = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>I-GWA-7</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/99)\n\
                    Multiply gwarship gain by x1.2\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwanks"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        18: {
            costBase() { return new Decimal(1e10) },
            costGrowth() { return new Decimal(10) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.gwaTemple.gwanker},
            pay(amt) { player.gwaTemple.gwanker = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.2, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>I-GWA-8</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/99)\n\
                    Multiply effective gwarship time by x1.2\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        19: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(99) },
            currency() { return player.gwaTemple.gwankest},
            pay(amt) { player.gwaTemple.gwankest = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                if (player.gwaTemple.highestGwankest.lte(0) && !hasUpgrade("gwaTemple", 27)) return "<h3>I-GWA-9</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/99)\n\
                    Multiply \"Gwambler\" mult by x1.1\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " ???"
                return "<h3>I-GWA-9</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/99)\n\
                    Multiply \"Gwambler\" mult by x1.1\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankests"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },

        21: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.gwaTemple.gwank},
            pay(amt) { player.gwaTemple.gwank = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(10, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>O-GWA-1</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Increase universe 1 tickspeed\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwanks"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        22: {
            costBase() { return new Decimal(25) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.gwaTemple.gwank},
            pay(amt) { player.gwaTemple.gwank = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>O-GWA-4</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Raise point gain\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwanks"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        23: {
            costBase() { return new Decimal(2) },
            costGrowth() { return new Decimal(2) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.gwaTemple.gwanker},
            pay(amt) { player.gwaTemple.gwanker = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(5, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>O-GWA-2</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Increase universe 2 tickspeed\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        24: {
            costBase() { return new Decimal(5) },
            costGrowth() { return new Decimal(5) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.gwaTemple.gwanker},
            pay(amt) { player.gwaTemple.gwanker = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                return "<h3>O-GWA-5</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Raise infinity point gain\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankers"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        25: {
            costBase() { return new Decimal(1) },
            costGrowth() { return new Decimal(1.05) },
            purchaseLimit() { return new Decimal(50) },
            currency() { return player.gwaTemple.gwankest},
            pay(amt) { player.gwaTemple.gwankest = this.currency().sub(amt) },
            effect(x) { return Decimal.pow(1.1, getBuyableAmount(this.layer, this.id)) },
            unlocked: true,
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                if (player.gwaTemple.highestGwankest.lte(0) && !hasUpgrade("gwaTemple", 27)) return "<h3>O-GWA-3</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Increase universe 3 tickspeed\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " ???"
                return "<h3>O-GWA-3</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/50)\n\
                    Increase universe 3 tickspeed\n\
                    Currently: x" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankests"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
        26: {
            costBase() { return new Decimal(2) },
            costGrowth() { return new Decimal(1.1) },
            purchaseLimit() { return new Decimal(25) },
            currency() { return player.gwaTemple.gwankest},
            pay(amt) { player.gwaTemple.gwankest = this.currency().sub(amt) },
            effect(x) { return getBuyableAmount(this.layer, this.id).div(100).add(1) },
            unlocked: true,
            cost(x) { return this.costGrowth().mul(x || getBuyableAmount(this.layer, this.id)).add(this.costBase()).floor() },
            canAfford() { return this.currency().gte(this.cost())},
            display() {
                if (player.gwaTemple.highestGwankest.lte(0) && !hasUpgrade("gwaTemple", 27)) return "<h3>O-GWA-6</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Raise singularity point gain\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " ???"
                return "<h3>O-GWA-6</h3>\n\
                    (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/25)\n\
                    Raise singularity point gain\n\
                    Currently: ^" + formatSimple(tmp[this.layer].buyables[this.id].effect, 2) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " Gwankests"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {width: "125px", height: "120px", color: "rgba(0,0,0,0.8)", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"},
        },
    },
    microtabs: {
        Tabs: {
            "Gwagrades": {
                buttonStyle() { return { color: "#ffb", borderRadius: "5px" } },
                unlocked() { return true },
                content: [
                    ["always-scroll-column", [
                        ["blank", "2px"],
                        ["row", [
                            ["upgrade", 1], ["upgrade", 2], ["upgrade", 3], ["upgrade", 4], ["upgrade", 5], ["upgrade", 6],
                            ["upgrade", 7], ["upgrade", 8], ["upgrade", 9], ["upgrade", 10], ["upgrade", 11], ["upgrade", 12],
                            ["upgrade", 13], ["upgrade", 14], ["upgrade", 15], ["upgrade", 16], ["upgrade", 17], ["upgrade", 18],
                            ["upgrade", 19], ["upgrade", 20], ["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24],
                            ["upgrade", 25], ["upgrade", 26], ["upgrade", 27], ["upgrade", 28], ["upgrade", 29], ["upgrade", 30],
                            ["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34], ["upgrade", 35], ["upgrade", 36],
                        ]],
                        ["blank", "2px"],
                    ], {width: "794px", height: "480px"}],
                ]
            },
            "Gwankables": {
                buttonStyle() { return { color: "#ffb", borderRadius: "5px" } },
                unlocked() { return hasUpgrade("gwaTemple", 21) },
                content: [
                    ["style-column", [
                        ["style-row", [
                            ["top-column", [
                                ["style-column", [
                                    ["raw-html", "Inner Gwa", {color: "#ffb", fontSize: "24px", fontFamily: "monospace"}],
                                ], {width: "395px", height: "40px", background: "#393924", borderBottom: "3px solid #29291a"}],
                                ["style-row", [
                                    ["buyable", 11], ["buyable", 13], ["buyable", 15],
                                    ["buyable", 12], ["buyable", 14], ["buyable", 16],
                                    ["buyable", 17], ["buyable", 18], ["buyable", 19],
                                ], {width: "395px", paddingTop: "2px"}],
                            ], {width: "395px", height: "437px"}],
                            ["top-column", [
                                ["style-column", [
                                    ["raw-html", "Outer Gwa", {color: "#ffb", fontSize: "24px", fontFamily: "monospace"}],
                                ], {width: "396px", height: "40px", background: "#393924", borderBottom: "3px solid #29291a"}],
                                ["style-row", [
                                    ["buyable", 21], ["buyable", 23], ["buyable", 25],
                                    ["buyable", 22], ["buyable", 24], ["buyable", 26],
                                ], {width: "396px", paddingTop: "2px"}],
                            ], {width: "396px", height: "437px", borderLeft: "3px solid #29291a"}],
                        ], {width: "794px", height: "437px", borderBottom: "3px solid #29291a"}],
                        ["style-column", [
                            ["raw-html", "Gwankables do not reset<br>on gwank type resets", {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}],
                        ], {width: "794px", height: "40px", background: "#393924", borderRadius: "0 0 0 17px"}],
                    ], {width: "794px", height: "480px"}],
                ]
            },
            "Gwarks": {
                buttonStyle() { return { color: "#ffb", borderRadius: "5px" } },
                unlocked() { return hasUpgrade("gwaTemple", 30) },
                content: [
                    ["top-column", [
                        ["style-column", [
                            ["row", [
                                ["raw-html", () => {return player.gwaTemple.gwark.neq(1) ? "You have <h3>" + formatWhole(player.gwaTemple.gwark) + "</h3> gwarks." : "You have <h3>" + formatWhole(player.gwaTemple.gwark) + "</h3> gwark." }, {color: "#ffb", fontSize: "20px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "(+" + formatWhole(player.gwaTemple.gwarkGain) + ")"}, () => {
                                    let look = {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}
                                    player.gwaTemple.gwarkGain.gt(0) ? look.color = "#ffb" : look.color = "#886"
                                    return look
                                }],
                            ]],
                            ["tooltip-row", [
                                ["raw-html", () => {return "Boosts gwa points by ^" + formatSimple(player.gwaTemple.gwarkEffect, 2)}, {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "<div class='bottomTooltip'>Base Formula<hr><small>(log2(Highest Gwarks+1)/10)+1<br>Highest Gwarks: " + formatSimple(player.gwaTemple.highestGwark) + "</small></div>"}],
                            ]],
                        ], {width: "794px", height: "60px", borderBottom: "3px solid #29291a"}],
                        ["clickable", 21],
                        ["top-column", [
                            ["blank", "2px"],
                            ["row", [
                                ["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104], ["upgrade", 105], ["upgrade", 106],
                                ["upgrade", 107], ["upgrade", 108], ["upgrade", 109], ["upgrade", 110], ["upgrade", 111], ["upgrade", 112],
                            ]],
                        ], {width: "794px", height: "365px", background: "#393924", borderTop: "3px solid #29291a", borderRadius: "0 0 0 17px"}],
                    ], {width: "794px", height: "480px"}],
                ]
            },
        },
    },
    tabFormat: [
        ["style-column", [
            ["row", [
                ["raw-html", () => { return "You have <h3>" + format(player.gwaTemple.gwaPoints) + "</h3> gwa points" }, {color: "#ffb", fontSize: "24px", fontFamily: "monospace" }],
                ["raw-html", () => { return player.gwaTemple.gwaPointsGain.gt(0) ? "(+" + format(player.gwaTemple.gwaPointsGain) + ")" : ""}, {color: "#ffb", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ]],
            ["raw-html", () => {return hasUpgrade("gwaTemple", 5) ? "Boosts gwa pet effects by ^" + formatSimple(player.gwaTemple.gwaPointsEffect, 3) : ""}, {color: "#ffb", fontSize: "20px", fontFamily: "monospace"}],
            ["raw-html", () => { return player.gwaTemple.gwaPoints.gte(1e100) ? "UNAVOIDABLE SOFTCAP: Gain past 1e100 is raised by ^" + formatShortSimple(player.gwaTemple.firstSoftcap, 3) : ""}, {color: "red", fontSize: "16px", fontFamily: "monospace"}],
        ], {height: "80px", marginBottom: "10px"}],
        ["style-row", [
            ["style-row", [
                ["raw-html", "<button id='bigCookie' class='bigCookie gwa' onmousedown='player.gwaTemple.worship=true;event.preventDefault()' onmouseup='player.gwaTemple.worship=false' onmouseleave='player.gwaTemple.worship=false' ontouchstart='player.gwaTemple.worship=true' ontouchend='player.gwaTemple.worship=false' ontouchcancel='player.gwaTemple.worship=false' onclick=''>"],
                ["raw-html", () => {return player.gwaTemple.highestGwark.gte(1) || hasUpgrade("gwaTemple", 20) ? "You have gwarshipped for " + formatTime(player.gwaTemple.gwaWorshipTime) : ""}, {width: "200px", position: "absolute", left: "calc(50% - 100px)", top: "10px", color: "#29291a", fontSize: "16px", fontFamily: "monospace", userSelect: "none"}],
                ["raw-html", () => {return hasUpgrade("gwaTemple", 105) ? "You have gwarshipped " + formatShortSimple(player.gwaTemple.gwarshipAmt) + " times" : ""}, {width: "200px", position: "absolute", left: "calc(50% - 100px)", bottom: "10px", color: "#29291a", fontSize: "16px", fontFamily: "monospace", userSelect: "none"}],
            ], () => {return {position: "relative", width: "344px", height: "244px", lineHeight: "1", background: `linear-gradient(to right, #ffb ${format(player.gwaTemple.gwaWorshipCooldown.div(player.gwaTemple.gwaWorshipCooldownMax).mul(100).min(100))}%, #bb9 ${format(player.gwaTemple.gwaWorshipCooldown.div(player.gwaTemple.gwaWorshipCooldownMax).mul(100).add(0.25).min(100))}%)`, border: "3px solid #29291a", borderRadius: "20px", margin: "5px"}}],
            ["style-column", [
                ["style-row", [
                    ["style-column", [
                        ["row", [
                            ["raw-html", () => {return "Gwank " + formatShortSimple(player.gwaTemple.gwank)}, {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", () => {return hasUpgrade("gwaTemple", 15) || hasUpgrade("gwaTemple", 104) ? "<small style='margin-left:10px'>(+" + formatShortSimple(player.gwaTemple.gwankGet) + ")</small>" : ""}, () => {
                                let look = {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}
                                player.gwaTemple.gwankGet.gt(0) ? look.color = "#ffb" : look.color = "#886"
                                return look
                            }],
                        ]],
                        ["raw-html", () => { return "x" + formatShortSimple(player.gwaTemple.gwankEffect) + " Gwa Points" }, {color: "#ffb", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "247px", height: "75px", borderRight: "3px solid #29291a"}],
                    ["clickable", 11],
                ], () => {return hasUpgrade("gwaTemple", 12) || player.gwaTemple.highestGwank.gt(0) ? {width: "400px", height: "75px", background: "#525234", border: "3px solid #29291a", borderRadius: "20px", margin: "5px"}: {display: "none !important"}}],
                ["style-row", [
                    ["style-column", [
                        ["row", [
                            ["raw-html", () => {return "Gwanker " + formatShortSimple(player.gwaTemple.gwanker)}, {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", () => {return hasUpgrade("gwaTemple", 24) ? "<small style='margin-left:10px'>(+" + formatShortSimple(player.gwaTemple.gwankerGet) + ")</small>" : ""}, () => {
                                let look = {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}
                                player.gwaTemple.gwankerGet.gt(0) ? look.color = "#ffb" : look.color = "#886"
                                return look
                            }],
                        ]],
                        ["raw-html", () => { return "^" + formatSimple(player.gwaTemple.gwankerEffect, 2) + " Gwank Effect" }, {color: "#ffb", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => { return "+" + formatSimple(player.gwaTemple.gwankerEffect2) + " Eff. Gwanks" }, {color: "#ffb", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "247px", height: "75px", borderRight: "3px solid #29291a"}],
                    ["clickable", 12],
                ], () => {return hasUpgrade("gwaTemple", 18) || player.gwaTemple.highestGwanker.gt(0) ? {width: "400px", height: "75px", background: "#525234", border: "3px solid #29291a", borderRadius: "20px", margin: "5px"}: {display: "none !important"}}],
                ["style-row", [
                    ["style-column", [
                        ["row", [
                            ["raw-html", () => {return "Gwankest " + formatShortSimple(player.gwaTemple.gwankest)}, {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}],
                            ["raw-html", () => {return hasUpgrade("gwaTemple", 107) ? "<small style='margin-left:10px'>(+" + formatShortSimple(player.gwaTemple.gwankestGet) + ")</small>" : ""}, () => {
                                let look = {color: "#ffb", fontSize: "16px", fontFamily: "monospace"}
                                player.gwaTemple.gwankestGet.gt(0) ? look.color = "#ffb" : look.color = "#886"
                                return look
                            }],
                        ]],
                        ["raw-html", () => { return "^" + formatSimple(player.gwaTemple.gwankestEffect, 2) + " Gwanker Effects" }, {color: "#ffb", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => { return "+" + formatSimple(player.gwaTemple.gwankestEffect2) + " Eff. Gwankers" }, {color: "#ffb", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "247px", height: "75px", borderRight: "3px solid #29291a"}],
                    ["clickable", 13],
                ], () => {return hasUpgrade("gwaTemple", 27) || player.gwaTemple.highestGwankest.gt(0) ? {width: "400px", height: "75px", background: "#525234", border: "3px solid #29291a", borderRadius: "20px", margin: "5px"}: {display: "none !important"}}],
            ]],
        ], {width: "794px", height: "275px"}],
        ["top-column", [
            ["style-row", [
                ["category-button", [() => {return "Gwagrades"}, "Tabs", "Gwagrades"], {width: "263px", height: "40px", background: "#414129", borderRadius: "17px 0 0 0"}],
                ["style-row", [], {width: "3px", height: "40px", backgroundColor: "#29291a"}],
                ["category-button", [() => {return "Gwankables"}, "Tabs", "Gwankables", () => {return !hasUpgrade("gwaTemple", 21)}], {width: "262px", height: "40px", background: "#414129"}],
                ["style-row", [], {width: "3px", height: "40px", backgroundColor: "#29291a"}],
                ["category-button", [() => {return "Gwarks"}, "Tabs", "Gwarks", () => {return !hasUpgrade("gwaTemple", 30)}], {width: "263px", height: "40px", background: "#414129", borderRadius: "0 17px 0 0"}],
            ], {width: "794px", height: "40px", borderBottom: "3px solid #29291a"}],
            ["buttonless-microtabs", "Tabs", { 'border-width': '0px' }],
        ], {width: "794px", height: "524px", background: "#525234", border: "3px solid #29291a", borderRadius: "20px 20px 0 20px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.startedGame && player.po.gwaTemple },
})
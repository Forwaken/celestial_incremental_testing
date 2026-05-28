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

            },
            style() {
                let look = {width: "400px", minHeight: "100px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.background = "#85ADE6" : look.background = "#bf8f8f"
                return look
            },
        },
    },
    microtabs: {
        "stuff": {
            "hex": {
                unlocked: true,
                content: [
                    ["top-column", [
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
                        ["blank", "5px"],
                        /*
                        It is going to revolve around using hex essence (gained based on your true hex) to buy three resources with different mechanics that work together.
                        First is Hex (color), which will be upgrades themed on hex colors.
                        Second is Hex (number), which is hexadecimal themed buffs towards the formula to gain hex essence.
                        Third is Hex (spell), which are active abilities to boost both hex essence gain and uni-alpha resource gain.
                        */
                        // Three increasing resources (in the style of neutrons from matter dimensions). All named hex with paranthesis with the 3 meanings of hex (color, number, spell)
                    ], {width: "597px", height: "800px", background: "#273345", borderRadius: "0 17px 17px 0"}],
                ],
            },
            "hept": {
                unlocked: true,
                content: [
                    ["top-column", [
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
                    ], {width: "597px", height: "800px", background: "#2c3142", borderRadius: "0 17px 17px 0"}],
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
        ["raw-html", () => {return player.h.externalRaise.neq(1) ? "External effects are raised by ^" + formatSimple(player.h.externalRaise, 3) : ""}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}],
        ["raw-html", () => {return player.h.preNerf.neq(1) ? "Pre-power resources are divided by /" + formatSimple(player.h.preNerf) : ""}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}],
        ["raw-html", () => {return player.h.powNerf.neq(1) ? "Power is divided by /" + formatSimple(player.h.powNerf) : ""}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}],
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
        ], {width: "800px", height: "800px", border: "3px solid #5085D8", borderRadius: "20px"}],
    ],
    layerShown() { return true }, // Decides if this node is shown or not.
});
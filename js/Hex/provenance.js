addLayer("hpr", {
    name() {return player.h.stageName[0] + " of Provenance"},
    symbol: "Pr", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Provenance", // Decides the nodes tooltip
    nodeStyle: {background: "linear-gradient(140deg, #0061ff 0%, #004dcc 100%)", backgroundOrigin: "borderBox", borderColor: "#00307f"},
    color: "#0061ff", // Decides the nodes color.
    startData() { return {
        rank: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0),
            new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        rankReq: {
            0: new Decimal(36),
            1: new Decimal(6),
            2: new Decimal(36),
            3: new Decimal(216),
            4: new Decimal(1296),
            5: new Decimal(7776),
            6: new Decimal(7),
            7: new Decimal(64),
            8: new Decimal(729),
            9: new Decimal(10000),
            10: new Decimal(161051),
            11: new Decimal(2985984),
        },
        rankGain: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0),
            new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        rankEffect: [[new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)],
            [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)], [new Decimal(1), new Decimal(1)]],
        divider: new Decimal(1),
        effectMult: new Decimal(1),
    }},
    update(delta) {
        player.hpr.divider = player.hre.refinementEffect[1][0]
        if (hasUpgrade("hpw", 132)) player.hpr.divider = player.hpr.divider.mul(1.5)
        if (hasUpgrade("hpw", 161)) player.hpr.divider = player.hpr.divider.mul(upgradeEffect("hpw", 161))
        let ext = new Decimal(1)
        if (hasUpgrade("tera", "hex7")) ext = ext.mul(upgradeEffect("tera", "hex7"))
        ext = ext.pow(player.h.externalRaise)
        player.hpr.divider = player.hpr.divider.mul(ext)

        player.hpr.rankReq = {0: new Decimal(36), 1: new Decimal(6), 2: new Decimal(36), 3: new Decimal(216), 4: new Decimal(1296), 5: new Decimal(7776),
            6: new Decimal(7), 7: new Decimal(64), 8: new Decimal(729), 9: new Decimal(10000), 10: new Decimal(161051), 11: new Decimal(2985984)}

        let alphaDiv = new Decimal(1)
        if (hasAchievement("achievements", 121)) alphaDiv = alphaDiv.mul(Decimal.pow(2, player.h.externalRaise))

        player.hpr.rankReq[0] = player.hpr.rank[0].add(1).pow(player.hpr.rank[0].add(1).log(Decimal.div(30, player.h.stage).add(1))).mul(player.h.stage.pow(2)).div(player.hpr.divider.mul(alphaDiv))
        player.hpr.rankGain[0] = Decimal.pow(Decimal.div(30, player.h.stage).add(1), player.h.hexPoint.max(1).div(player.h.stage.pow(2)).mul(player.hpr.divider.mul(alphaDiv)).log(Decimal.div(30, player.h.stage).add(1)).pow(0.5)).floor().sub(player.hpr.rank[0])

        let betaDiv = new Decimal(1)
        if (hasAchievement("achievements", 110)) betaDiv = betaDiv.mul(Decimal.pow(1.2, player.h.externalRaise))

        player.hpr.rankReq[1] = layers.h.hexReq(player.hpr.rank[1], player.h.stage, Decimal.div(player.h.stage, 4.3), player.hpr.divider.mul(betaDiv))
        player.hpr.rankGain[1] = layers.h.hexGain(player.hpr.rank[0], player.h.stage, Decimal.div(player.h.stage, 4.3), player.hpr.divider.mul(betaDiv)).sub(player.hpr.rank[1])

        player.hpr.rankReq[2] = layers.h.hexReq(player.hpr.rank[2], player.h.stage.pow(2), Decimal.div(player.h.stage, 4.6), player.hpr.divider)
        player.hpr.rankGain[2] = layers.h.hexGain(player.hpr.rank[1], player.h.stage.pow(2), Decimal.div(player.h.stage, 4.6), player.hpr.divider).sub(player.hpr.rank[2])

        player.hpr.rankReq[3] = layers.h.hexReq(player.hpr.rank[3], player.h.stage.pow(3), Decimal.div(player.h.stage, 4.9), player.hpr.divider)
        player.hpr.rankGain[3] = layers.h.hexGain(player.hpr.rank[2], player.h.stage.pow(3), Decimal.div(player.h.stage, 4.9), player.hpr.divider).sub(player.hpr.rank[3])

        player.hpr.rankReq[4] = layers.h.hexReq(player.hpr.rank[4], player.h.stage.pow(4), Decimal.div(player.h.stage, 5.2), player.hpr.divider)
        player.hpr.rankGain[4] = layers.h.hexGain(player.hpr.rank[3], player.h.stage.pow(4), Decimal.div(player.h.stage, 5.2), player.hpr.divider).sub(player.hpr.rank[4])

        player.hpr.rankReq[5] = layers.h.hexReq(player.hpr.rank[5], player.h.stage.pow(5), Decimal.div(player.h.stage, 5.5), player.hpr.divider)
        player.hpr.rankGain[5] = layers.h.hexGain(player.hpr.rank[4], player.h.stage.pow(5), Decimal.div(player.h.stage, 5.5), player.hpr.divider).sub(player.hpr.rank[5])

        player.hpr.rankReq[6] = layers.h.hexReq(player.hpr.rank[6], player.h.stage.pow(player.h.stage).div(hasUpgrade("hpw", 74) ? 1.25 : 1), player.h.stage, player.hpr.divider)
        player.hpr.rankGain[6] = layers.h.hexGain(player.hpr.rank[0], player.h.stage.pow(player.h.stage).div(hasUpgrade("hpw", 74) ? 1.25 : 1), player.h.stage, player.hpr.divider).sub(player.hpr.rank[6])

        for (let i = 0; i < 12; i++) {
            if (player.hpr.rankGain[i].lt(0)) player.hpr.rankGain[i] = new Decimal(0)
        }

        if (!inChallenge("hrm", 15) && !inChallenge("hrm", 16)) {
            if (hasMilestone("hre", 5)) player.hpr.rank[0] = player.hpr.rank[0].add(player.hpr.rankGain[0])
            if (hasMilestone("hre", 7)) player.hpr.rank[1] = player.hpr.rank[1].add(player.hpr.rankGain[1])
            if (hasMilestone("hre", 9)) player.hpr.rank[2] = player.hpr.rank[2].add(player.hpr.rankGain[2])
            if (hasMilestone("hre", 11)) player.hpr.rank[3] = player.hpr.rank[3].add(player.hpr.rankGain[3])
            if (hasMilestone("hre", 13)) player.hpr.rank[4] = player.hpr.rank[4].add(player.hpr.rankGain[4])
            if (hasMilestone("hre", 15)) player.hpr.rank[5] = player.hpr.rank[5].add(player.hpr.rankGain[5])
            if (hasMilestone("hre", 17)) player.hpr.rank[6] = player.hpr.rank[6].add(player.hpr.rankGain[6])
        }

        player.hpr.effectMult = player.hre.refinementEffect[2][0]
        if (hasUpgrade("hbl", 6)) player.hpr.effectMult = player.hpr.effectMult.mul(upgradeEffect("hbl", 6))
        if (hasMilestone("hbl", 5)) player.hpr.effectMult = player.hpr.effectMult.mul(player.h.stage.div(20).add(1))
        if (hasUpgrade("hpw", 101)) player.hpr.effectMult = player.hpr.effectMult.mul(upgradeEffect("hpw", 101))
        player.hpr.effectMult = player.hpr.effectMult.mul(player.tera.virtueEffects[0][2])
        if (hasAchievement("achievements", 1406)) player.hpr.effectMult = player.hpr.effectMult.mul(Decimal.pow(1.2, player.h.externalRaise))

        // Disable effects
        if (inChallenge("hrm", 16)) player.hpr.effectMult = new Decimal(0)

        player.hpr.rankEffect[0][0] = player.hpr.rank[0].div(player.h.provenanceDiv).pow(player.h.stage.div(2.5)).mul(player.hpr.effectMult).add(1)
        player.hpr.rankEffect[0][1] = player.hpr.rank[0].div(player.h.provenanceDiv).pow(Decimal.add(1, Decimal.div(1, player.h.stage))).mul(Decimal.div(3, player.h.stage)).mul(player.hpr.effectMult).add(1)

        player.hpr.rankEffect[1][0] = player.hpr.rank[1].div(player.h.provenanceDiv).pow(player.h.stage.div(2)).mul(player.h.stage.div(2)).mul(player.hpr.effectMult).add(1)
        player.hpr.rankEffect[1][1] = player.hpr.rank[1].div(player.h.provenanceDiv).pow(Decimal.add(1, Decimal.div(2, player.h.stage))).mul(Decimal.div(9, player.h.stage)).mul(player.hpr.effectMult).add(1)

        player.hpr.rankEffect[2][0] = player.hpr.rank[2].div(player.h.provenanceDiv).pow(player.h.stage.div(1.75)).mul(player.h.stage).mul(player.hpr.effectMult).add(1)
        player.hpr.rankEffect[2][1] = player.hpr.rank[2].div(player.h.provenanceDiv).pow(Decimal.add(1, Decimal.div(4, player.h.stage))).mul(Decimal.div(12, player.h.stage)).mul(player.hpr.effectMult).add(1)

        player.hpr.rankEffect[3][0] = player.hpr.rank[3].div(player.h.provenanceDiv).pow(player.h.stage.div(1.5)).mul(player.h.stage.mul(2)).mul(player.hpr.effectMult).add(1)
        player.hpr.rankEffect[3][1] = player.hpr.rank[3].div(player.h.provenanceDiv).pow(Decimal.add(1, Decimal.div(6, player.h.stage))).mul(Decimal.div(18, player.h.stage)).mul(player.hpr.effectMult).add(1)

        player.hpr.rankEffect[4][0] = player.hpr.rank[4].div(player.h.provenanceDiv).pow(player.h.stage.div(1.25)).mul(player.h.stage.mul(4)).mul(player.hpr.effectMult).add(1)
        player.hpr.rankEffect[4][1] = player.hpr.rank[4].div(player.h.provenanceDiv).pow(Decimal.add(1, Decimal.div(9, player.h.stage))).mul(Decimal.div(24, player.h.stage)).mul(player.hpr.effectMult).add(1)

        player.hpr.rankEffect[5][0] = player.hpr.rank[5].div(player.h.provenanceDiv).pow(player.h.stage).mul(player.h.stage.mul(8)).mul(player.hpr.effectMult).add(1)
        player.hpr.rankEffect[5][1] = player.hpr.rank[5].div(player.h.provenanceDiv).pow(Decimal.add(1, Decimal.div(12, player.h.stage))).mul(Decimal.div(30, player.h.stage)).mul(player.hpr.effectMult).add(1)

        player.hpr.rankEffect[6][0] = player.hpr.rank[6].div(player.h.provenanceDiv).mul(player.hpr.effectMult).add(1).log(player.h.stage).div(150)
        player.hpr.rankEffect[6][1] = player.hpr.rank[6].div(player.h.provenanceDiv).mul(player.hpr.effectMult).add(1).log(player.h.stage).div(100)

        if (hasUpgrade("tad", 1001)) {
            for (let i = 0; i < 6; i++) {
                player.hpr.rankEffect[i][0] = player.hpr.rankEffect[i][0].pow(1.1)
            }
        }
    },
    clickables: {
        1: {
            title() { return "<h2>Reset " + player.h.stageName[1] + " points,<br>but gain α-Provenance.</h2><br><h3>Req: " + format(player.hpr.rankReq[0]) + " " + player.h.stageName[0] + " Points</h3>"},
            canClick() { return player.hpr.rankGain[0].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 5) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[0] = player.hpr.rank[0].add(player.hpr.rankGain[0])

                // RESET CODE
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 5) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        2: {
            title() { return "<h2>Reset prior provenances,<br>but gain β-Provenance.</h2><br><h3>Req: " + formatWhole(player.hpr.rankReq[1]) + " α-Provenance</h3>"},
            canClick() { return player.hpr.rankGain[1].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 7) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[1] = player.hpr.rank[1].add(player.hpr.rankGain[1])
                if (!hasAchievement("achievements", 110) && player.hpr.rank[1].gte(6)) completeAchievement("achievements", 110)

                // RESET CODE
                for (let i = 0; i < 1; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 7) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        3: {
            title() { return "<h2>Reset prior provenances,<br>but gain γ-Provenance.</h2><br><h3>Req: " + formatWhole(player.hpr.rankReq[2]) + " β-Provenance</h3>"},
            canClick() { return player.hpr.rankGain[2].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 9) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[2] = player.hpr.rank[2].add(player.hpr.rankGain[2])

                // RESET CODE
                for (let i = 0; i < 2; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 9) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        4: {
            title() { return "<h2>Reset prior provenances,<br>but gain δ-Provenance.</h2><br><h3>Req: " + formatWhole(player.hpr.rankReq[3]) + " γ-Provenance</h3>"},
            canClick() { return player.hpr.rankGain[3].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 11) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[3] = player.hpr.rank[3].add(player.hpr.rankGain[3])

                // RESET CODE
                for (let i = 0; i < 3; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 11) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        5: {
            title() { return "<h2>Reset prior provenances,<br>but gain ε-Provenance.</h2><br><h3>Req: " + formatWhole(player.hpr.rankReq[4]) + " δ-Provenance</h3>"},
            canClick() { return player.hpr.rankGain[4].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 13) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[4] = player.hpr.rank[4].add(player.hpr.rankGain[4])

                // RESET CODE
                for (let i = 0; i < 4; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 13) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        6: {
            title() { return "<h2>Reset prior provenances,<br>but gain ζ-Provenance.</h2><br><h3>Req: " + formatWhole(player.hpr.rankReq[5]) + " ε-Provenance</h3>"},
            canClick() { return player.hpr.rankGain[5].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 15) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[5] = player.hpr.rank[5].add(player.hpr.rankGain[5])

                // RESET CODE
                for (let i = 0; i < 5; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 15) && !inChallenge("hrm", 15)) look.cursor = "default !important"
                return look
            },
        },
        7: {
            title() { return "<h2>Reset prior provenances,<br>but gain η-Provenance.</h2><br><h3>Req: " + formatWhole(player.hpr.rankReq[6]) + " α-Provenance</h3>"},
            canClick() { return player.hpr.rankGain[6].gt(0) && player.h.hexPoint.gt(0) && (!hasMilestone("hre", 17) || inChallenge("hrm", 15))},
            unlocked: true,
            onClick() {
                player.hpr.rank[6] = player.hpr.rank[6].add(player.hpr.rankGain[6])
                if (!hasAchievement("achievements", 1402)) completeAchievement("achievements", 1402)
                if (!hasAchievement("achievements", 1406) && player.hpr.rank[6].gte(2)) completeAchievement("achievements", 1406)

                // RESET CODE
                for (let i = 0; i < 6; i++) {
                    player.hpr.rank[i] = new Decimal(0)
                    player.hpr.rankGain[i] = new Decimal(0)
                    player.hpr.rankEffect[i] = [new Decimal(1), new Decimal(1)]
                }
                player.h.hexPointGain = new Decimal(0)
                player.h.hexPoint = new Decimal(0)
            },
            style() {
                let look = {width: "250px", minHeight: "75px", fontSize: "7px", border: "0px", borderRadius: "0px 0px 8px 8px"}
                if (hasMilestone("hre", 17) && !inChallenge("hrm", 15)) look.cursor = "default !important"
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
            ["raw-html", () => {return player.h.stageName[0] + " of Provenance"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#001d4c", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
            ["row", [
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[0]) + " α-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[0]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[0].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[0][0]) + " celestial points<br>x" + format(player.hpr.rankEffect[0][1]) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 1],
            ], {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[1]) + " β-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[1]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[1].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[1][0]) + " celestial points<br>x" + format(player.hpr.rankEffect[1][1]) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 2],
            ], {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[2]) + " γ-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[2]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[2].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[2][0]) + " celestial points<br>x" + format(player.hpr.rankEffect[2][1]) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 3],
            ], {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
        ]],
        ["row", [
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[3]) + " δ-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[3]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[3].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[3][0]) + " celestial points<br>x" + format(player.hpr.rankEffect[3][1]) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 4],
            ], {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[4]) + " ε-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[4]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[4].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[4][0]) + " celestial points<br>x" + format(player.hpr.rankEffect[4][1]) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 5],
            ], {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[5]) + " ζ-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[5]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[5].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                   ["raw-html", () => {return "x" + format(player.hpr.rankEffect[5][0]) + " celestial points<br>x" + format(player.hpr.rankEffect[5][1]) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 6],
            ], {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
        ]],
        ["row", [
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return formatWhole(player.hpr.rank[6]) + " η-Provenance"}, {color: "white", fontSize: "18px", fontFamily: "monospace"}],
                    ["raw-html", () => {return "(+" + formatWhole(player.hpr.rankGain[6]) + ")"}, () => {
                        let look = {color: "white", fontSize: "16px", fontFamily: "monospace"}
                        player.hpr.rankGain[6].gt(0) ? look.color = "white" : look.color = "gray"
                        return look
                    }],
                ], {width: "250px", height: "50px", borderBottom: "2px solid white"}],
                ["style-column", [
                   ["raw-html", () => {return "+^" + formatSimple(player.hpr.rankEffect[6][0], 3) + " celestial points<br>+^" + formatSimple(player.hpr.rankEffect[6][1], 3) + " " + player.h.stageName[1] + " points"}, {color: "white", fontSize: "14px", fontFamily: "monospace"}],
                ], {width: "250px", height: "76px", borderBottom: "2px solid white"}],
                ["clickable", 7],
            ], () => {return player.h.stage.gte(7) ? {width: "250px", height: "205px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"} : {display: "none !important"}}],
        ]],
        ["row", [
            ["style-row", [
                ["style-row", [
                    ["raw-html", "Total Celestial Point Multiplier", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "200px", height: "40px", borderRight: "2px solid white"}],
                ["style-row", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[0][0].mul(player.hpr.rankEffect[1][0]).mul(player.hpr.rankEffect[2][0]).mul(player.hpr.rankEffect[3][0]).mul(player.hpr.rankEffect[4][0]).mul(player.hpr.rankEffect[5][0]))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "183px", height: "40px"}],
            ], {width: "385px", height: "40px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
            ["style-row", [
                ["style-row", [
                    ["raw-html", () => {return "Total " + player.h.stageName[0] + " Point Multiplier"}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "200px", height: "40px", borderRight: "2px solid white"}],
                ["style-row", [
                    ["raw-html", () => {return "x" + format(player.hpr.rankEffect[0][1].mul(player.hpr.rankEffect[1][1]).mul(player.hpr.rankEffect[2][1]).mul(player.hpr.rankEffect[3][1]).mul(player.hpr.rankEffect[4][1]).mul(player.hpr.rankEffect[5][1]))}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "178px", height: "40px"}],
            ], {width: "380px", height: "40px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
        ]],
        ["style-row", [
            ["style-row", [
                ["style-row", [
                    ["raw-html", "Total Celestial Point Exponent", {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "200px", height: "40px", borderRight: "2px solid white"}],
                ["style-row", [
                    ["raw-html", () => {return "^" + formatSimple(player.hpr.rankEffect[6][0].add(1), 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "183px", height: "40px"}],
            ], {width: "385px", height: "40px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
            ["style-row", [
                ["style-row", [
                    ["raw-html", () => {return "Total " + player.h.stageName[0] + " Point Exponent"}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "200px", height: "40px", borderRight: "2px solid white"}],
                ["style-row", [
                    ["raw-html", () => {return "^" + formatSimple(player.hpr.rankEffect[6][1].add(1), 3)}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "178px", height: "40px"}],
            ], {width: "380px", height: "40px", backgroundColor: "#001333", border: "2px solid white", margin: "5px", borderRadius: "10px"}],
        ], () => {return player.h.stage.gte(7) ? {} : {display: "none !important"}}],
        ["blank", "25px"],
    ],
    layerShown() { return !inChallenge("hrm", 16) }, // Decides if this node is shown or not.
    hotkeys: [
        {
            key: "1", 
            description: "Gain α provenance",
            onPress() {
                clickClickable(this.layer, 1)
            },
        },
        {
            key: "2", 
            description: "Gain β provenance",
            onPress() {
                clickClickable(this.layer, 2)
            },
        },
        {
            key: "3", 
            description: "Gain γ provenance",
            onPress() {
                clickClickable(this.layer, 3)
            },
        },
        {
            key: "4", 
            description: "Gain δ provenance",
            onPress() {
                clickClickable(this.layer, 4)
            },
        },
        {
            key: "5", 
            description: "Gain ε provenance",
            onPress() {
                clickClickable(this.layer, 5)
            },
        },
        {
            key: "6", 
            description: "Gain ζ provenance",
            onPress() {
                clickClickable(this.layer, 6)
            },
        },
        {
            key: "7", 
            description: "Gain η provenance",
            unlocked() {return player.h.stage.gte(7)},
            onPress() {
                clickClickable(this.layer, 7)
            },
        }
	]
});
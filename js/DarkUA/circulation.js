addLayer("mci", {
    name: "Circulation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ci", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        circAmt: new Decimal(0),
        circCurrent: new Decimal(0),
        circSpeed: new Decimal(1),
        circMax: new Decimal(5),

        concentrateLow: 40,
        concentrateHigh: 60,
        concentrateBuff: new Decimal(1),

        flow: new Decimal(0),
        flowGain: new Decimal(1),
        flowEffects: {
            0: new Decimal(1),
            1: new Decimal(1),
            2: new Decimal(1),
            3: new Decimal(1),
        },

        autoClick: false,
        clickTime: new Decimal(0),
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#a3f0a9, #9ae3a0, #89c98e)",
            backgroundOrigin: "border-box",
            borderColor: "#446346",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Circulation",
    branches: [["mcu", "#4d1d1d"]],
    color: "#446346",
    update(delta) {
        let onepersec = new Decimal(1)

        // Flow Gain
        player.mci.flowGain = new Decimal(1)
        if (hasMilestone("mci", 13)) player.mci.flowGain = player.mci.flowGain.mul(player.mci.flowEffects[2])

        // Concentrating
        if (player.mci.concentrateBuff.gt(1)) player.mci.concentrateBuff = player.mci.concentrateBuff.sub(player.mci.concentrateBuff.div(100).max(0.01).mul(delta))

        // Circulation Speed
        player.mci.circSpeed = new Decimal(1)
        player.mci.circSpeed = player.mci.circSpeed.mul(player.mci.concentrateBuff)
        if (player.mcu.mantraSelected == 21) player.mci.circSpeed = player.mci.circSpeed.mul(player.mcu.mantraEffects[21])

        if (hasUpgrade("mcu", 11)) player.mci.circCurrent = player.mci.circCurrent.add(Decimal.mul(player.mci.circSpeed, delta))

        // Circulation Trigger
        player.mci.circMax = new Decimal(5).add(player.mci.circAmt.div(10))
        if (player.mci.circCurrent.gte(player.mci.circMax)) {
            let mult = Decimal.affordArithmeticSeries(player.mci.circCurrent, 5, 0.1, player.mci.circAmt).floor().max(1)
            player.mci.circCurrent = player.mci.circCurrent.sub(Decimal.sumArithmeticSeries(mult, 5, 0.1, player.mci.circAmt)).max(0)
            player.mci.circAmt = player.mci.circAmt.add(mult)
            player.mci.flow = player.mci.flow.add(player.mci.flowGain.mul(mult))

            let start = (Math.random() * 70) + 5
            player.mci.concentrateLow = start
            player.mci.concentrateHigh = start + 20
        }

        // Flow Effects
        player.mci.flowEffects[0] = player.mci.flow.pow(0.5).div(2).add(1)
        player.mci.flowEffects[1] = player.mci.flow.add(1).pow(1.1)
        player.mci.flowEffects[2] = player.mci.flow.pow(0.3).div(10).add(1)
        player.mci.flowEffects[3] = player.mci.flow.add(1).log(10).div(10).add(1)

        // Autoclicker
        if (player.mci.autoClick) {
            player.mci.clickTime = Decimal.add(player.mci.clickTime, delta)
            if (Decimal.gte(player.mci.clickTime, 0.1)) {
                layers.mci.cookieClick()
                player.mci.clickTime = Decimal.sub(player.mci.clickTime, 0.1)
            }
        }

        if (player.tab != "mci") {
            player.mci.autoClick = false
        }
    },
    cookieClick() {
        let effectiveness = 0.015
        if (hasUpgrade("mcu", 14)) effectiveness *= 2
        if (player.mcu.mantraSelected == 22) effectiveness *= player.mcu.mantraEffects[22].toNumber()
        let currPercent = player.mci.circCurrent.div(player.mci.circMax).mul(100)
        if (currPercent.gte(player.mci.concentrateLow) && currPercent.lte(player.mci.concentrateHigh)) {
            player.mci.concentrateBuff = player.mci.concentrateBuff.add(effectiveness)
        } else {
            player.mci.concentrateBuff = player.mci.concentrateBuff.sub(effectiveness*2).max(1)
        }
    },
    milestones: {
        11: {
            requirementDescription: "1 Flow",
            effectDescription() { return "Boost ki gain based on flow<br>Currently: x" + format(player.mci.flowEffects[0]) + "." },
            done() { return player.mci.flow.gte(1) },
            style() {
                let look = {width: "562px", height: "50px", color: "white", border: "0", borderRadius: "0px"}
                if (hasMilestone("mci", this.id)) {look.backgroundColor = "#1a3b0f"} else {look.backgroundColor = "#361e1e"}
                return look
            },
        },
        12: {
            requirementDescription: "10 Flow",
            effectDescription() { return "Extend dark grass softcap based on flow<br>Currently: x" + format(player.mci.flowEffects[1]) + "." },
            done() { return player.mci.flow.gte(10) },
            style() {
                let look = {width: "562px", height: "50px", color: "white", border: "0", borderRadius: "0px"}
                if (hasMilestone("mci", this.id)) {look.backgroundColor = "#1a3b0f"} else {look.backgroundColor = "#361e1e"}
                return look
            },
        },
        13: {
            requirementDescription: "100 Flow",
            effectDescription() { return "Boost flow gain based on flow<br>Currently: x" + format(player.mci.flowEffects[2]) + "." },
            done() { return player.mci.flow.gte(100) },
            style() {
                let look = {width: "562px", height: "50px", color: "white", border: "0", borderRadius: "0px"}
                if (hasMilestone("mci", this.id)) {look.backgroundColor = "#1a3b0f"} else {look.backgroundColor = "#361e1e"}
                return look
            },
        },
        14: {
            requirementDescription: "1,000 Flow",
            effectDescription() { return "Boost miasma cap based on flow<br>Currently: x" + format(player.mci.flowEffects[3]) + "." },
            done() { return player.mci.flow.gte(1000) },
            style() {
                let look = {width: "562px", height: "50px", color: "white", border: "0", borderRadius: "0px"}
                if (hasMilestone("mci", this.id)) {look.backgroundColor = "#1a3b0f"} else {look.backgroundColor = "#361e1e"}
                return look
            },
        },
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["layer-proxy", ["mse", [["bar", "miasmaBar"]]]],
        ], {width: "710px", height: "46px"}],
        ["blank", "25px"],
        ["style-column", [
            ["style-column", [
                ["style-column", [
                    ["style-column", [], () => {
                        let firstVal = (player.mci.concentrateLow / 100) * 122
                        let secondVal = (player.mci.concentrateHigh / 100) * 122
                        return {width: "610px", height: "105px", margin: "40px 40px 0 40px", borderTopLeftRadius: "302px 102px", borderTopRightRadius: "302px 102px",
                        background: "conic-gradient(from 299deg at 50% 290%, #1b271b " + firstVal + "deg, #89c98e " + firstVal + "deg, #89c98e " + secondVal + "deg, #1b271b " + secondVal + "deg)"
                    }}],
                ], () => {return {width: "690px", height: "145px", marginTop: "5px", borderTopLeftRadius: "342px 142px", borderTopRightRadius: "342px 142px",
                    background: player.mci.circCurrent.lt(player.mci.circMax) ?
                    "conic-gradient(from 299deg at 50% 238%, #2f4531 " + (player.mci.circCurrent.div(player.mci.circMax)).min(1).max(0) * 122 + "deg, #101811 0deg)" : "#2f4531"
                }}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", () => {return formatSimple(player.mci.circCurrent.div(player.mci.circMax).min(1).max(0).mul(100), 0) + "%"}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {height: "53px"}],
                    ["raw-html", () => {return "<button class='concentrateButton' onmousedown='player.mci.autoClick=true;event.preventDefault()' onmouseup='player.mci.autoClick=false' onmouseleave='player.mci.autoClick=false' ontouchstart='player.mci.autoClick=true' ontouchend='player.mci.autoClick=false' ontouchcancel='player.mci.autoClick=false' onclick='layers.mci.cookieClick()'>" +
                        "<h3>Concentrate to speed up circulation</h3><br>[Currently: x" + format(player.mci.concentrateBuff) + " Circulation Speed]<br><small>(Click or hold while bar is at highlighted area)</small></button>"}],
                ], {position: "absolute", left: "0", top: "0", width: "700px", height: "150px"}],
            ], () => {
                let firstVal = (player.mci.concentrateLow / 100) * 122
                let secondVal = (player.mci.concentrateHigh / 100) * 122
                return {position: "relative", width: "700px", height: "150px", borderBottom: "3px solid #446346", borderTopLeftRadius: "347px 147px", borderTopRightRadius: "347px 147px",
                background: "conic-gradient(from 299deg at 50% 233%, #1b271b " + firstVal + "deg, #89c98e " + firstVal + "deg, #89c98e " + secondVal + "deg, #1b271b " + secondVal + "deg)"
            }}],
            ["style-column", [
                ["raw-html", () => {return "You have <h3>" + formatSimple(player.mci.flow) + "</h3> flow <small>(+" + formatSimple(player.mci.flowGain) + ")</small>"}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ], {width: "700px", height: "47px", background: "#1b271b", borderBottom: "3px solid #446346"}],
            ["top-column", [
                ["style-row", [
                    ["style-column", [
                        ["raw-html", "1", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {backgroundColor: "#253626", borderRight: "3px solid #446346", borderRadius: "0px", width: "125px", height: "50px"}],
                    ["titleless-milestone", 11],
                ], {borderBottom: "3px solid #446346"}],
                ["style-row", [
                    ["style-column", [
                        ["raw-html", "10", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {backgroundColor: "#253626", borderRight: "3px solid #446346", borderRadius: "0px", width: "125px", height: "50px"}],
                    ["titleless-milestone", 12],
                ], {borderBottom: "3px solid #446346"}],
                ["style-row", [
                    ["style-column", [
                        ["raw-html", "100", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {backgroundColor: "#253626", borderRight: "3px solid #446346", borderRadius: "0px", width: "125px", height: "50px"}],
                    ["titleless-milestone", 13],
                ], {borderBottom: "3px solid #446346"}],
                ["style-row", [
                    ["style-column", [
                        ["raw-html", "1,000", {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                    ], {backgroundColor: "#253626", borderRight: "3px solid #446346", borderRadius: "0px", width: "125px", height: "50px"}],
                    ["titleless-milestone", 14],
                ], {borderBottom: "3px solid #446346"}],
            ], {height: "470px", background: "#00000088"}],
            ["style-column", [], {width: "700px", height: "24px", background: "#1b271b", borderTop: "3px solid #446346", borderRadius: "0 0 17px 17px"}],
        ], {width: "700px", height: "700px", border: "3px solid #446346", borderRadius: "20px", borderTopLeftRadius: "350px 150px", borderTopRightRadius: "350px 150px"}],
    ],
    layerShown() { return hasUpgrade("mcu", 11) },
    deactivated() { return !player.sma.inStarmetalChallenge},
});
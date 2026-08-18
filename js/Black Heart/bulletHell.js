//bulletHell(700, 500, 12, 500, 275)
//bulletHellBlue({"bulletRain": {bulletPerSec: 8, bulletRadius: 12, enemySpeed: 4}}, {width:800, height:600, duration:15, gravity:0.2, jumpStrength:-12})
function bulletHellOld(actions, values = {}, exitAction = () => {}) {
    let info = {}
    info.width = values.width || 700
    info.height = values.height || 500
    info.duration = values.duration || 12
    info.actions = actions
    info.values = values
    info.exitAction = exitAction
    for (let i in info.actions) {
        if (BHB[i].codeFunc) info.actions[i].codeFunc = BHB[i].codeFunc
        if (BHB[i].moveFunc) info.actions[i].moveFunc = BHB[i].moveFunc
        info.actions[i].lastTime = false
    }
    info.centerX = values.centerX || window.innerWidth / 2
    info.centerY = values.centerY || window.innerHeight / 2
    info.timed = values.timed || false
    info.endTime = Date.now() + info.duration * 1000
    info.start = values.start || "center"
    info.cellSize = values.cellSize || false
    info.goalType = values.goal || false
    info.goalSize = values.goalSize || 50
    info.subArena = values.subArena || false
    info.subWidth = values.subWidth || 400
    info.subHeight = values.subHeight || 300
    info.subSpeed = values.subSpeed || 2.5
    info.subMove = values.subMove || "bounce"
    info.moveWithSub = values.moveWithSub || true
    info.active = true;
    if (info.values.saveContent) {
        let storedInfo = localStorage.getItem('bhState')
        if (storedInfo) {
            storedInfo = JSON.parse(storedInfo)
            if (storedInfo.px) {
                info.px = storedInfo.px
                info.py = storedInfo.py
            }
        }
        if (!info.px) info.values.saveContent = false
    }

    // Check if tabbed in, if not just deal a bunch of damage
    if ((options && options.bulletHellOff) || (player && player.tab && player.tab != "bh")) {
        if (player.bh.celestialite.health.lte(0)) return
        let amt = 0
        for (let i = 0; i < 3; i++) {if (player.bh.characters[i].id != "none" && Decimal.gt(player.bh.characters[i].health, 0)) amt++}
        bhAttack(Decimal.mul(player.bh.celestialite.damage, info.duration/3), 3, 0, "allPlayer")
        return
    }

    // Reset immortality frames at start
    window.lastDamageTime = Date.now();
    let running = true; // Prevent multiple animation loops
    info.full = options.fullscreen

    // Store state in localStorage so it persists across reloads
    info.startTime = Date.now();
    localStorage.setItem('bhState', JSON.stringify(info));

    // If already active, clear previous overlay and timer
    const bhState = info;
    bhState.active = true;
    
    const old = document.getElementById("bh-overlay")
    if (old) old.remove()

    if (player.subtabs["bh"]["stuff"] != "bullet") {
        if (player.bh.celestialite.health.lte(0)) return
        player.subtabs["bh"]["stuff"] = "bullet";
        pauseUniverseAll(["BH"], "pause", true)
        options.fullscreen = true
    }

    // Create a fullscreen overlay
    const overlay = document.createElement("div");
    overlay.id = "bh-overlay";
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.1)";
    overlay.style.zIndex = "99999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // Canvas for the boss (always full screen)
    const bossCanvas = document.createElement("canvas");
    bossCanvas.width = window.innerWidth;
    bossCanvas.height = window.innerHeight;
    bossCanvas.style.position = "fixed";
    bossCanvas.style.left = "0";
    bossCanvas.style.top = "0";
    bossCanvas.style.pointerEvents = "none";
    bossCanvas.style.zIndex = "100002";
    overlay.appendChild(bossCanvas);

    // Create the minigame canvas
    const gameCanvas = document.createElement("canvas");
    gameCanvas.width = info.width;
    gameCanvas.height = info.height;
    if (!info.values.transparent) {
        gameCanvas.style.background = "#111";
    } else {
        gameCanvas.style.background = "rgba(0,0,0,0)";
    }
    if (gameCanvas.width != window.innerWidth && gameCanvas.height != window.innerHeight) {
        gameCanvas.style.border = "2px solid #fff";
        gameCanvas.style.borderRadius = "16px";
    }
    if (!options.performanceMode) gameCanvas.style.boxShadow = "0 0 32px #000";
    gameCanvas.style.position = "absolute";
    gameCanvas.style.left = `calc(50vw - ${info.width / 2}px)`;
    gameCanvas.style.top = `calc(50vh - ${info.height / 2}px)`;
    gameCanvas.style.zIndex = "100001";
    overlay.appendChild(gameCanvas);

    document.body.appendChild(overlay);
    info.bossCtx = bossCanvas.getContext('2d');
    info.ctx = gameCanvas.getContext('2d');

    // Sub-Arena position state (top-left of small arena inside border)
    if (info.subArena) {
        if (info.subMove == "bounce") {
            info.subx = Math.random() * (info.width - info.subWidth);
            info.suby = Math.random() * (info.height - info.subHeight);
        } else if (info.subMove == "right") {
            info.subx = 0;
            info.suby = (info.height - info.subHeight) / 2;
        } else if (info.subMove == "bottom") {
            info.subx = (info.width - info.subWidth) / 2;
            info.suby = 0;
        } else {
            info.subx = (info.width - info.subWidth) / 2;
            info.suby = (info.height - info.subHeight) / 2;
        }
        let subAngle = 0
        if (info.subMove == "bounce") {
            subAngle = Math.random() * 2 * Math.PI;
        } else if (info.subMove == "right") {
            subAngle = 0
        } else if (info.subMove == "bottom") {
            subAngle = Math.PI / 2
        }
        info.subvx = Math.cos(subAngle) * info.subSpeed;
        info.subvy = Math.sin(subAngle) * info.subSpeed;
    }

    if (info.cellSize) {
        // Maze generation (recursive backtracker)
        info.cols = Math.floor(info.width / info.cellSize);
        info.rows = Math.floor(info.height / info.cellSize);
        info.maze = [];
        for (let y = 0; y < info.rows; y++) {
            info.maze[y] = [];
            for (let x = 0; x < info.cols; x++) {
                info.maze[y][x] = { x, y, visited: false, walls: [true, true, true, true] }; // top, right, bottom, left
            }
        }
        info.shuffle = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
        info.carve = (x, y) => {
            info.maze[y][x].visited = true;
            const dirs = info.shuffle([[0, -1, 0], [1, 0, 1], [0, 1, 2], [-1, 0, 3]]); // [dx, dy, wall]
            for (const [dx, dy, wall] of dirs) {
                const nx = x + dx, ny = y + dy;
                if (ny >= 0 && ny < info.rows && nx >= 0 && nx < info.cols && !info.maze[ny][nx].visited) {
                    info.maze[y][x].walls[wall] = false;
                    info.maze[ny][nx].walls[(wall + 2) % 4] = false;
                    info.carve(nx, ny);
                }
            }
        }
        info.carve(0, 0);
    }

    // Player Code (Red Diamond)
    if (info.values.saveContent) {
        // Lmao already done earlier
    } else if (info.start == "cell") {
        info.px = info.cellSize / 2
        info.py = info.cellSize / 2;
    } else {
        let playerX = 0
        let playerY = 0
        if (info.subArena) {
            playerX = info.subWidth / 2
            playerY = info.subHeight / 2
        } else {
            playerX = info.width / 2
            playerY = info.height / 2
        }
        if (info.start == "left") playerX = 50
        info.px = playerX
        info.py = playerY
    }
    // Blue-mode (platformer) settings
    info.blueMode = info.values.blueMode || false;
    if (info.blueMode) {
        info.gravity = info.values.gravity ?? 0.6;
        info.jumpStrength = info.values.jumpStrength ?? -12;
        info.vx = 0;
        info.vy = 0;
        info.onGround = true;
    }
    info.pr = 18;
    info.speed = 5.5;
    info.pos = {x: 0, y: 0}
    info.keys = {up: false, down: false, left: false, right: false}
    if (info.goalType) {
        if (info.goalType == "cell") {
            info.goal = {x: info.cols - 1, y: info.rows - 1, d: info.cellSize}
            info.goalRadius = info.cellSize / 2 - 6;
        } else if (info.goalType == "right") {
            info.goal = {x: info.width - (info.goalSize*2), y: info.height / 2, d: info.goalSize}
            info.goalRadius = info.goalSize / 2 - 6;
        }
    }

    
    // Black box position in global coordinates
    info.boxLeft = gameCanvas.getBoundingClientRect().left;
    info.boxTop = gameCanvas.getBoundingClientRect().top;

    // Bullets
    info.bullets = [];
 
    // Bullet Code
    for (let i in info.actions) {
        if (info.actions[i].codeFunc && (!info.actions[i].duration || Date.now() < info.startTime + (info.actions[i].duration*1000))) info = info.actions[i].codeFunc(info, i)
    }

    function updatePos(e, touch = false) {
        if (touch) e = e.touches[0]
        // Always track mouse position; in blueMode Y is used to set gravity/jump, but not direct vertical movement
        info.pos.x = e.clientX - info.boxLeft
        info.pos.y = e.clientY - info.boxTop
    }

    function updateKeys(e, isDown) {
        if (["ArrowUp", "w", "W"].includes(e.key)) info.keys.up = isDown;
        if (["ArrowDown", "s", "S"].includes(e.key)) info.keys.down = isDown;
        if (["ArrowLeft", "a", "A"].includes(e.key)) info.keys.left = isDown;
        if (["ArrowRight", "d", "D"].includes(e.key)) info.keys.right = isDown;
    }
    
    // Function to spawn a bullet that goes towards the player
    info.shootAtPlayer = (bx, by, id, speed = 5) => {
        // Calculate direction from boss to player (relative to the box)
        let playerGlobalX = info.boxLeft + info.px;
        let playerGlobalY = info.boxTop + info.py;
        if (info.subArena && info.moveWithSub) {
            playerGlobalX += info.subx
            playerGlobalY += info.suby
        }
        const dx = playerGlobalX - bx;
        const dy = playerGlobalY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const bulletRadius = info.actions[id].bulletRadius ?? 10
        if (dist === 0) return;
        info.bullets.push({
            x: bx,
            y: by,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            r: bulletRadius,
            draw(b, bossCtx) {
                bossCtx.beginPath();
                bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                bossCtx.fillStyle = "#fff";
                bossCtx.fill();
            },
        });
    }

    // Fire radial burst at coordinates
    info.fireRadialBurst = (bx, by, id) => {
        for (let i = 0; i < info.actions[id].bulletsPerBurst; i++) {
            const angle = (2 * Math.PI * i) / info.actions[id].bulletsPerBurst;
            info.bullets.push({
                x: bx,
                y: by,
                vx: Math.cos(angle) * info.actions[id].bulletSpeed,
                vy: Math.sin(angle) * info.actions[id].bulletSpeed,
                r: 12,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = "#fff";
                    bossCtx.fill();
                },
            });
        }
    }

    info.fireDiceSpikeRadialBurst = (bx, by, id) => {
        for (let i = 0; i < info.actions[id].bulletsPerBurst; i++) {
            const angle = (2 * Math.PI * i) / info.actions[id].bulletsPerBurst;
            info.bullets.push({
                x: bx,
                y: by,
                vx: Math.cos(angle) * info.actions[id].bulletSpeed,
                vy: Math.sin(angle) * info.actions[id].bulletSpeed,
                r: 30,
                // triangular spike that points along velocity
                color: Math.random() < 0.5 ? '#000' : '#fff',
                draw(b, bossCtx) {
                    const angle = Math.atan2(b.vy, b.vx);
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(angle);
                    // triangle
                    bossCtx.beginPath();
                    bossCtx.moveTo(b.r, 0);
                    bossCtx.lineTo(-b.r * 0.6, b.r * 0.7);
                    bossCtx.lineTo(-b.r * 0.6, -b.r * 0.7);
                    bossCtx.closePath();
                    bossCtx.fillStyle = b.color;
                    bossCtx.fill();
                    bossCtx.lineWidth = 2;
                    bossCtx.strokeStyle = (b.color === '#000') ? '#fff' : '#000';
                    bossCtx.stroke();
                    bossCtx.restore();
                }
            });
        }
    }

    // Shoot spread at coordinates
    info.shootSpreadAtPlayer = (bx, by, id) => {
        let dx = info.px - bx + info.boxLeft;
        let dy = info.py - by + info.boxTop;
        let baseAngle = Math.atan2(dy, dx);
        for (let i = 0; i < info.actions[id].spreadCount; i++) {
            let angle = baseAngle + (i - (info.actions[id].spreadCount - 1) / 2) * (info.actions[id].spreadAngle / (info.actions[id].spreadCount - 1));
            let vx = Math.cos(angle) * info.actions[id].bulletSpeed;
            let vy = Math.sin(angle) * info.actions[id].bulletSpeed;
            info.bullets.push({
                x: bx,
                y: by,
                r: 12,
                vx: vx,
                vy: vy,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = "#fff";
                    bossCtx.fill();
                }
            });
        }
    }

    // Shoot spiral from coordinates
    info.spawnSpiralProjectile = (bx, by, br, id) => {
        // Alternate between bullet and knife
        let isKnife = info.actions[id].spiralKnives && (!info.actions[id].spiralBullets || (Math.floor(info.actions[id].spiralAngle/(Math.PI*2)) % 2 === 0));
        let angle = info.actions[id].spiralAngle;
        let speed = info.actions[id].bulletSpeed;
        let x = bx + Math.cos(angle) * br;
        let y = by + Math.sin(angle) * br;
        if (isKnife) {
            let bname = "knife"
            if (info.actions[id].knifeLength >= 100 || info.actions[id].knifeWidth >= 25) bname = "bigKnife"
            info.bullets.push({
                name: bname,
                x: x,
                y: y,
                r: info.actions[id].knifeLength,
                width: info.actions[id].knifeWidth,
                angle: angle,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                draw(b, bossCtx) {
                    // Draw path line (red, thin)
                    bossCtx.save();
                    bossCtx.strokeStyle = '#f22';
                    bossCtx.lineWidth = 2;
                    bossCtx.beginPath();
                    bossCtx.moveTo(b.x, b.y);
                    // Draw line in the direction of the knife, long enough to cross the arena
                    let farX = b.x + Math.cos(b.angle) * (info.width + info.height);
                    let farY = b.y + Math.sin(b.angle) * (info.width + info.height);
                    bossCtx.lineTo(farX, farY);
                    bossCtx.stroke();
                    bossCtx.restore();
                    // Draw knife
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.beginPath();
                    bossCtx.moveTo(-b.r / 2, -b.width / 2);
                    bossCtx.lineTo(b.r / 2, 0);
                    bossCtx.lineTo(-b.r / 2, b.width / 2);
                    bossCtx.closePath();
                    bossCtx.fillStyle = '#ccc';
                    if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                    if (!options.performanceMode) bossCtx.shadowBlur = 6;
                    bossCtx.fill();
                    bossCtx.restore();
                },
            })
        } else {
            info.bullets.push({
                x: x,
                y: y,
                r: 12,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = "#fff";
                    bossCtx.fill();
                },
            })
        }
    }

    // Spawn knife
    info.spawnKnife = (id) => {
        // Pick a random edge and a random point on that edge
        const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        let bx, by, angle;
        if (edge === 0) { // top
            bx = Math.random() * info.width;
            by = -info.actions[id].knifeLength;
            angle = Math.random() * Math.PI + Math.PI / 2; // downwards, but can be angled
        } else if (edge === 1) { // right
            bx = info.width + info.actions[id].knifeLength;
            by = Math.random() * info.height;
            angle = Math.random() * Math.PI + Math.PI; // leftwards
        } else if (edge === 2) { // bottom
            bx = Math.random() * info.width;
            by = info.height + info.actions[id].knifeLength;
            angle = Math.random() * Math.PI - Math.PI / 2; // upwards
        } else { // left
            bx = -info.actions[id].knifeLength;
            by = Math.random() * info.height;
            angle = Math.random() * Math.PI; // rightwards
        }
        // Optionally, bias angle toward player
        if (Math.random() < 0.7) {
            let dx = info.px - bx;
            let dy = info.py - by;
            if (info.subArena && info.moveWithSub) {
                dx += info.subx
                dy += info.suby
            }
            angle = Math.atan2(dy, dx);
        }
        // Store initial spawn for path line
        let bname = "knife"
        if (info.actions[id].knifeLength >= 100 || info.actions[id].knifeWidth >= 25) bname = "bigKnife"
        info.bullets.push({
            name: bname,
            boxRender: true, // RENDER IN BOX
            x: bx,
            y: by,
            angle: angle,
            r: info.actions[id].knifeLength,
            width: info.actions[id].knifeWidth,
            vx: Math.cos(angle) * info.actions[id].enemySpeed,
            vy: Math.sin(angle) * info.actions[id].enemySpeed,
            draw(b, bossCtx) {
                // Draw path line (red, thin)
                bossCtx.save();
                bossCtx.strokeStyle = '#f22';
                bossCtx.lineWidth = 2;
                bossCtx.beginPath();
                bossCtx.moveTo(b.x, b.y);
                // Draw line in the direction of the knife, long enough to cross the arena
                let farX = b.x + Math.cos(b.angle) * (info.width + info.height);
                let farY = b.y + Math.sin(b.angle) * (info.width + info.height);
                bossCtx.lineTo(farX, farY);
                bossCtx.stroke();
                bossCtx.restore();
                // Draw knife
                bossCtx.save();
                bossCtx.translate(b.x, b.y);
                bossCtx.rotate(b.angle);
                bossCtx.beginPath();
                bossCtx.moveTo(-b.r / 2, -b.width / 2);
                bossCtx.lineTo(b.r / 2, 0);
                bossCtx.lineTo(-b.r / 2, b.width / 2);
                bossCtx.closePath();
                bossCtx.fillStyle = '#ccc';
                if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                if (!options.performanceMode) bossCtx.shadowBlur = 6;
                bossCtx.fill();
                bossCtx.restore();
            }
        })
    }

    // Fire aimed knife burst
    info.fireKnifeBurst = (id) => {
        // Knives are thrown from far outside the arena, all aimed at the current player position
        let centerX = info.px;
        let centerY = info.py;
        if (info.subArena && info.moveWithSub) {
            centerX += info.subx
            centerY += info.suby
        }
        const spawnRadius = Math.max(info.width, info.height) * 0.75 + 200; // farther than arena edge
        for (let i = 0; i < info.actions[id].bulletsPerBurst; i++) {
            const angle = (2 * Math.PI * i) / info.actions[id].bulletsPerBurst;
            // Spawn far away in a ring
            const spawnX = centerX + Math.cos(angle) * spawnRadius;
            const spawnY = centerY + Math.sin(angle) * spawnRadius;
            // Aim at the current player position
            const dx = centerX - spawnX;
            const dy = centerY - spawnY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const knifeAngle = Math.atan2(dy, dx);
            let bname = "knife"
            if (info.actions[id].knifeLength >= 100 || info.actions[id].knifeWidth >= 25) bname = "bigKnife"
            info.bullets.push({
                name: bname,
                boxRender: true, // RENDER IN BOX
                offScreen: true, // Bullets can be off screen
                x: spawnX,
                y: spawnY,
                angle: knifeAngle,
                r: info.actions[id].knifeLength,
                width: info.actions[id].knifeWidth,
                vx: (dx / dist) * info.actions[id].enemySpeed,
                vy: (dy / dist) * info.actions[id].enemySpeed,
                timer: Date.now() - 500,
                draw(b, bossCtx) {
                    // Draw path line (red, thin) if knife is on screen, or if it left within the last 500ms
                    let knifeOnScreen = (
                        b.x > 0 && b.x < info.width &&
                        b.y > 0 && b.y < info.height
                    );
                    if (knifeOnScreen) {
                        b.timer = Date.now();
                    }
                    if (Date.now() - b.timer < 500) {
                        // Draw path line (red, thin)
                        bossCtx.save();
                        bossCtx.strokeStyle = '#f22';
                        bossCtx.lineWidth = 2;
                        bossCtx.beginPath();
                        bossCtx.moveTo(b.x, b.y);
                        // Draw line in the direction of the knife, long enough to cover the screen
                        let farX = b.x + Math.cos(b.angle) * 5000;
                        let farY = b.y + Math.sin(b.angle) * 5000;
                        bossCtx.lineTo(farX, farY);
                        bossCtx.stroke();
                        bossCtx.restore();
                    }
                    // Draw knife
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.beginPath();
                    bossCtx.moveTo(-b.r / 2, -b.width / 2);
                    bossCtx.lineTo(b.r / 2, 0);
                    bossCtx.lineTo(-b.r / 2, b.width / 2);
                    bossCtx.closePath();
                    bossCtx.fillStyle = '#ccc';
                    if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                    if (!options.performanceMode) bossCtx.shadowBlur = 6;
                    bossCtx.fill();
                    bossCtx.restore();
                }
            });
        }
    }

    info.triangleArea = (x1, y1, x2, y2, x3, y3) => {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    }

    info.isPointInTriangle = (px, py, x1, y1, x2, y2, x3, y3) => {
        const originalArea = info.triangleArea(x1, y1, x2, y2, x3, y3);

        const area1 = info.triangleArea(px, py, x2, y2, x3, y3);
        const area2 = info.triangleArea(x1, y1, px, py, x3, y3);
        const area3 = info.triangleArea(x1, y1, x2, y2, px, py);

        return Math.abs(originalArea - (area1 + area2 + area3)) < 10;
    }

    info.pointToSegmentDist = (px, py, x1, y1, x2, y2) => {
        const vx = x2 - x1, vy = y2 - y1;
        const wx = px - x1, wy = py - y1;
        const c = (vx * wx + vy * wy) / (vx * vx + vy * vy || 1);
        const t = Math.max(0, Math.min(1, c));
        const qx = x1 + vx * t, qy = y1 + vy * t;
        const dx = px - qx, dy = py - qy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    info.pointToTriangleDistance = (px, py, x1, y1, x2, y2, x3, y3) => {
        if (info.isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3)) return 0;
        const d1 = info.pointToSegmentDist(px, py, x1, y1, x2, y2);
        const d2 = info.pointToSegmentDist(px, py, x2, y2, x3, y3);
        const d3 = info.pointToSegmentDist(px, py, x3, y3, x1, y1);
        return Math.min(d1, d2, d3);
    }


    // Pixel-perfect wall collision for smooth movement (DON'T USE WITH 'MOVE WITH SUBARENA')
    function canMoveTo(nx, ny) {
        // nx,ny: new player center (float, px)
        if (nx - info.pr < 0 || nx + info.pr > info.width || ny - info.pr < 0 || ny + info.pr > info.height) return false;
        // Find which cell the center is in
        let cx = Math.floor(nx / info.cellSize), cy = Math.floor(ny / info.cellSize);
        if (cx < 0 || cy < 0 || cx >= info.cols || cy >= info.rows) return false;
        const cell = info.maze[cy][cx];
        // Check each direction for wall collision
        // Top wall
        if (cell.walls[0] && ny - info.pr < cy * info.cellSize) return false;
        // Bottom wall
        if (cell.walls[2] && ny + info.pr > (cy + 1) * info.cellSize) return false;
        // Left wall
        if (cell.walls[3] && nx - info.pr < cx * info.cellSize) return false;
        // Right wall
        if (cell.walls[1] && nx + info.pr > (cx + 1) * info.cellSize) return false;
        // Also check adjacent cells if overlapping their walls
        // Up
        if (ny - info.pr < cy * info.cellSize && cy > 0) {
            const upCell = info.maze[cy - 1][cx];
            if (upCell.walls[2]) return false;
        }
        // Down
        if (ny + info.pr > (cy + 1) * info.cellSize && cy < info.rows - 1) {
            const downCell = info.maze[cy + 1][cx];
            if (downCell.walls[0]) return false;
        }
        // Left
        if (nx - info.pr < cx * info.cellSize && cx > 0) {
            const leftCell = info.maze[cy][cx - 1];
            if (leftCell.walls[1]) return false;
        }
        // Right
        if (nx + info.pr > (cx + 1) * info.cellSize && cx < info.cols - 1) {
            const rightCell = info.maze[cy][cx + 1];
            if (rightCell.walls[3]) return false;
        }
        return true;
    }


    // Does death is yes? (lmao)
    info.allCharactersDead = () => {
        if (!player || !player.bh || !player.bh.characters) return true;
        for (let i = 0; i < 3; i++) {
            if (player.bh.characters[i].id != "none" && Decimal.gt(player.bh.characters[i].health, 0)) return false
        }
        return true;
    }

    function animate(ts) {
        if (!info.active) return;
        // End early if celestialite is dead
        if (player.bh.celestialite.id == "none" || (player.bh.celestialite.health.lte(0) && !BHC[player.bh.celestialite.id].immortal)) {
            info.exitAction()
            if (!options.bhKeyboard) {
                window.removeEventListener("mousemove", mouseHandler);
                window.removeEventListener("touchmove", touchHandler);
            } else {
                window.removeEventListener("keydown", keydownHandler);
                window.removeEventListener("keyup", keyupHandler);
            }
            if (overlay.parentNode) overlay.remove();
            bhState.active = false;
            info.active = false;
            player.subtabs["bh"]["stuff"] = "battle";
            pauseUniverseAll(["BH"], "unpause", true)
            player.universe = "U3"
            options.fullscreen = info.full;
            localStorage.setItem('bhState', JSON.stringify(info));
        }
        // End early if all characters are dead
        if (info.allCharactersDead()) {
            info.exitAction()
            if (!options.bhKeyboard) {
                window.removeEventListener("mousemove", mouseHandler);
                window.removeEventListener("touchmove", touchHandler);
                window.removeEventListener("click", clickHandler);
            } else {
                window.removeEventListener("keydown", keydownHandler);
                window.removeEventListener("keyup", keyupHandler);
                window.removeEventListener("click", clickHandler);
            }
            if (overlay.parentNode) overlay.remove();
            bhState.active = false;
            info.active = false;
            player.subtabs["bh"]["stuff"] = "dead";
            pauseUniverseAll(["BH"], "unpause", true)
            player.universe = "U3"
            options.fullscreen = info.full;
            localStorage.setItem('bhState', JSON.stringify(info));
            if (bhState.timer) clearTimeout(bhState.timer)
            return;
        }

        // Move sub-arena (with DVD bounce logic)
        if (info.subArena) {
            info.subx += info.subvx;
            info.suby += info.subvy;
            if (info.subx <= 0) { info.subx = 0; info.subvx = Math.abs(info.subvx); }
            if (info.subx >= info.width - info.subWidth) { info.subx = info.width - info.subWidth; info.subvx = -Math.abs(info.subvx); }
            if (info.suby <= 0) { info.suby = 0; info.subvy = Math.abs(info.subvy); }
            if (info.suby >= info.height - info.subHeight) { info.suby = info.height - info.subHeight; info.subvy = -Math.abs(info.subvy); }
        }

        // Move Player (normal or blue-mode platformer)
        // If blueMode: compute jump height from vertical distance between mouse and diamond (gravity stays constant)
        if (info.blueMode) {
            // compute based on vertical distance (only consider mouse above the diamond for jump height)
            const dy = (info.py - (info.pos.y || info.py)); // positive if mouse is above
            const absdy = Math.max(0, Math.min(dy, info.height));
            const factor = info.height > 0 ? (absdy / info.height) : 0;
            const jMin = info.values.jumpMin ?? 40; // in pixels
            const jMax = info.values.jumpMax ?? 220; // in pixels
            info.computedJumpHeight = jMin + factor * (jMax - jMin); // desired jump apex height in px

            // Horizontal movement influenced by mouse X (info.pos.x) and keyboard arrows
            let targetX = info.pos.x || info.px;
            if (options.bhKeyboard) {
                if (info.keys.left) targetX = info.px - 6;
                if (info.keys.right) targetX = info.px + 6;
            }
            // Smooth horizontal movement plus velocity
            info.px += (targetX - info.px) * 0.035 + (info.vx || 0);

            // Apply gravity
            info.vy = (info.vy || 0) + (info.gravity || 0.6) * 0.65;
            info.py += info.vy;

            // Floor collision (respect subArena if used)
            let groundY = info.subArena && info.moveWithSub ? (info.subHeight - info.pr) : (info.height - info.pr);
            if (info.py >= groundY) {
                info.py = groundY;
                info.vy = 0;
                info.onGround = true;
            } else {
                info.onGround = false;
            }

            // Friction on horizontal velocity
            info.vx *= 0.9;

            // Clamp horizontal position
            if (info.subArena) {
                if (info.moveWithSub) {
                    info.px = Math.max(info.pr, Math.min(info.subWidth - info.pr, info.px));
                } else {
                    info.px = Math.max(info.pr + info.subx, Math.min(info.subWidth + info.subx - info.pr, info.px));
                }
            } else {
                info.px = Math.max(info.pr, Math.min(gameCanvas.width - info.pr, info.px));
            }
        } else {
            let dx = 0; let dy = 0
            if (!options.bhKeyboard) {
                dx = info.pos.x - info.px
                dy = info.pos.y - info.py
                if (info.subArena && info.moveWithSub) {
                    dx -= info.subx
                    dy -= info.suby
                }
            } else {
                if (info.keys.up) dy -= 5;
                if (info.keys.down) dy += 5;
                if (info.keys.left) dx -= 5;
                if (info.keys.right) dx += 5;
            }
            let angle = Math.atan2(dy, dx);
            if (dx < -3 || dx > 3 || dy < -3 || dy > 3) {
                if (info.cellSize) {
                    let npx = info.px + Math.cos(angle) * info.speed, npy = info.py + Math.sin(angle) * info.speed;
                    // Try moving in both axes, then x only, then y only
                    if (canMoveTo(npx, npy)) {
                        info.px = npx; info.py = npy
                    } else if (canMoveTo(npx, info.py)) {
                        info.px = npx;
                    } else if (canMoveTo(info.px, npy)) {
                        info.py = npy
                    }
                } else {
                    info.px += Math.cos(angle) * info.speed;
                    info.py += Math.sin(angle) * info.speed;
                }
                if (info.subArena) {
                    if (info.moveWithSub) {
                        info.px = Math.max(info.pr, Math.min(info.subWidth - info.pr, info.px));
                        info.py = Math.max(info.pr, Math.min(info.subHeight - info.pr, info.py));
                    } else {
                        info.px = Math.max(info.pr + info.subx, Math.min(info.subWidth + info.subx - info.pr, info.px));
                        info.py = Math.max(info.pr + info.suby, Math.min(info.subHeight + info.suby - info.pr, info.py));
                    }
                } else {
                    info.px = Math.max(info.pr, Math.min(gameCanvas.width - info.pr, info.px));
                    info.py = Math.max(info.pr, Math.min(gameCanvas.height - info.pr, info.py));
                }
            }
        }

        // Check for reaching goal
        if (info.goalType) {
            if (info.goalType == "cell") {
                info.distToGoal = Math.sqrt((info.px - (info.goal.x * info.goal.d + info.goal.d / 2)) ** 2 + (info.py - (info.goal.y * info.goal.d + info.goal.d / 2)) ** 2);
            } else {
                if (info.subArena) {
                    info.distToGoal = Math.sqrt((info.px + info.subx - info.goal.x) ** 2 + (info.py + info.suby - info.goal.y) ** 2);
                } else {
                    info.distToGoal = Math.sqrt((info.px - info.goal.x) ** 2 + (info.py - info.goal.y) ** 2);
                }
            }
            if (info.distToGoal < info.goalRadius) {
                info.exitAction()
                // End attack
                if (!options.bhKeyboard) {
                    window.removeEventListener("mousemove", mouseHandler);
                    window.removeEventListener("touchmove", touchHandler);
                    window.removeEventListener("click", clickHandler);
                } else {
                    window.removeEventListener("keydown", keydownHandler);
                    window.removeEventListener("keyup", keyupHandler);
                    window.removeEventListener("click", clickHandler);
                }
                if (overlay.parentNode) overlay.remove();
                bhState.active = false;
                info.active = false;
                player.subtabs["bh"]["stuff"] = "battle";
                pauseUniverseAll(["BH"], "unpause", true)
                player.universe = "U3"
                options.fullscreen = info.full;
                localStorage.setItem('bhState', JSON.stringify(info));
                if (bhState.timer) clearTimeout(bhState.timer)
                return;
            }
        }

        // Bullet movement/spawn code
        for (let i in info.actions) {
            if (info.actions[i].moveFunc && (!info.actions[i].duration || Date.now() < info.startTime + (info.actions[i].duration*1000))) info = info.actions[i].moveFunc(info, ts, i)
        }

        // Move bullets
        for (let b of info.bullets) {
            b.x += b.vx;
            b.y += b.vy;
            if (b.bouncy) {

            }
        }

        // Remove bullets that go off screen
        info.bullets = info.bullets.filter(b => {
            if (b.offScreen) {
                return b.x > info.boxLeft && b.x < info.boxLeft + info.width && b.y > info.boxTop && b.y < info.boxTop + info.height
            }
            if (b.name && (b.name == "bomb" || b.name == "minibomb") && b.exploded) return false
            if (b.name && (b.name == "knife" || b.name == "bigKnife")) {
                return b.x > -b.r && b.x < info.width + b.r && b.y > -b.r && b.y < info.height + b.r
            }
            return b.x > -b.r && b.x < window.innerWidth + b.r && b.y > -b.r && b.y < window.innerHeight + b.r
        });

        // Draw bullets (white circles) on bossCanvas
        info.bossCtx.clearRect(0, 0, bossCanvas.width, bossCanvas.height);
        info.bossCtx.save();
        if (!options.performanceMode) info.bossCtx.shadowColor = "#fff";
        if (!options.performanceMode) info.bossCtx.shadowBlur = 8;
        for (let b of info.bullets) {
            if (b.boxRender) continue
            b.draw(b, info.bossCtx)
        }
        info.bossCtx.restore();

        // Only call takeDamage once per frame if hit
        let playerHit = false;
        let hitByBigKnife = false;

        // Check collision between player and each bullet
        for (let b of info.bullets) {
            let playerX = info.px
            let playerY = info.py
            if (info.subArena && options.bhKeyboard) {playerX += info.subx; playerY += info.suby}
            if (b.name && b.name == "knife") {
                // Knife is a rectangle, check if player is within knife's rectangle (approximate as line segment + width)
                const cx = b.x + Math.cos(b.angle) * b.r / 2;
                const cy = b.y + Math.sin(b.angle) * b.r / 2;
                const dx = Math.cos(b.angle), dy = Math.sin(b.angle);
                // Project player onto knife axis
                const t = ((playerX - b.x) * dx + (playerY - b.y) * dy);
                if (t >= -b.r+info.pr && t <= b.r - info.pr) {
                    // Perpendicular distance
                    const perp = Math.abs((playerX - b.x) * dy - (playerY - b.y) * dx);
                    if (perp < info.pr + b.width / 2) {
                        playerHit = true;
                        break;
                    }
                }
            } else if (b.name && b.name == "bigKnife") {
                const playerGlobalX = info.boxLeft + playerX;
                const playerGlobalY = info.boxTop + playerY;
                const x1 = (Math.cos(b.angle) * (-(b.r + info.pr) / 2)) - (Math.sin(b.angle) * (-(b.width + info.pr) / 2)) + b.x;
                const y1 = (Math.sin(b.angle) * (-(b.r + info.pr) / 2)) + (Math.cos(b.angle) * (-(b.width + info.pr) / 2)) + b.y;
                const x2 = (Math.cos(b.angle) * ((b.r + info.pr) / 2)) + b.x;
                const y2 = (Math.sin(b.angle) * ((b.r + info.pr) / 2)) + b.y;
                const x3 = (Math.cos(b.angle) * (-(b.r + info.pr) / 2)) - (Math.sin(b.angle) * ((b.width + info.pr) / 2)) + b.x;
                const y3 = (Math.sin(b.angle) * (-(b.r + info.pr) / 2)) + (Math.cos(b.angle) * ((b.width + info.pr) / 2)) + b.y;
                const dist = info.pointToTriangleDistance(playerGlobalX, playerGlobalY, x1, y1, x2, y2, x3, y3);
                if (dist <= info.pr) {
                    playerHit = true;
                    hitByBigKnife = true;
                    break;
                }
            } else if (b.boxRender) {
                const dx = playerX - b.x;
                const dy = playerY - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= (info.pr + b.r)) {
                    playerHit = true;
                    break;
                }
            } else {
                const dx = (info.boxLeft + playerX) - b.x;
                const dy = (info.boxTop + playerY) - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= (info.pr + b.r)) {
                    playerHit = true;
                    break;
                }
            }
        }

        // Consider platform/spike hits set by attacks
        if (info.platformHit) {
            playerHit = true;
            info.platformHit = false;
        }

        // Take damage (only when in a BH stage)
        if (playerHit && player && player.bh && player.bh.currentStage && player.bh.currentStage != "none") {
            const now = Date.now();
            // Immortality frames: only allow damage every 100ms
            if (typeof window.lastDamageTime !== "number") window.lastDamageTime = Date.now();
                if (now - window.lastDamageTime > 100) {
                    window.lastDamageTime = now;
                    bhAttack(player.bh.celestialite.damage.mul(0.25), 3, 0, "randomPlayer")
                }
        }

        // Start draw
        info.ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        // SUB ARENA STUFF
        if (info.subArena) {
            // Draw the full arena border (large arena, dashed, glowing)
            info.ctx.save();
            info.ctx.strokeStyle = '#fff';
            info.ctx.lineWidth = 4;
            if (!options.performanceMode) info.ctx.shadowColor = '#fff';
            if (!options.performanceMode) info.ctx.shadowBlur = 12;
            info.ctx.setLineDash([16, 12]);
            info.ctx.strokeRect(0, 0, info.width, info.height);
            info.ctx.setLineDash([]);
            info.ctx.restore();

            // Draw the small arena (solid, glowing)
            info.ctx.save();
            info.ctx.strokeStyle = '#0ff';
            info.ctx.lineWidth = 4;
            if (!options.performanceMode) info.ctx.shadowColor = '#0ff';
            if (!options.performanceMode) info.ctx.shadowBlur = 16;
            info.ctx.strokeRect(info.subx, info.suby, info.subWidth, info.subHeight);
            info.ctx.restore();
        }

        // Draw maze
        if (info.cellSize) {
            info.ctx.save();
            info.ctx.strokeStyle = "#fff";
            info.ctx.lineWidth = 3;
            for (let y = 0; y < info.rows; y++) {
                for (let x = 0; x < info.cols; x++) {
                    const cell = info.maze[y][x];
                    const sx = x * info.cellSize, sy = y * info.cellSize;
                    if (cell.walls[0]) { // top
                        info.ctx.beginPath(); info.ctx.moveTo(sx, sy); info.ctx.lineTo(sx + info.cellSize, sy); info.ctx.stroke();
                    }
                    if (cell.walls[1]) { // right
                        info.ctx.beginPath(); info.ctx.moveTo(sx + info.cellSize, sy); info.ctx.lineTo(sx + info.cellSize, sy + info.cellSize); info.ctx.stroke();
                    }
                    if (cell.walls[2]) { // bottom
                        info.ctx.beginPath(); info.ctx.moveTo(sx + info.cellSize, sy + info.cellSize); info.ctx.lineTo(sx, sy + info.cellSize); info.ctx.stroke();
                    }
                    if (cell.walls[3]) { // left
                        info.ctx.beginPath(); info.ctx.moveTo(sx, sy + info.cellSize); info.ctx.lineTo(sx, sy); info.ctx.stroke();
                    }
                }
            }
        }
        // Draw Timer
        if (info.timed) {
            info.ctx.save();
            let now = Date.now();
            let timeLeft = Math.max(0, Math.ceil((info.endTime - now) / 1000));
            info.ctx.font = 'bold 32px monospace';
            info.ctx.textAlign = 'center';
            info.ctx.textBaseline = 'top';
            info.ctx.fillStyle = timeLeft <= 3 ? '#f44' : '#fff';
            if (!options.performanceMode) info.ctx.shadowColor = '#000';
            if (!options.performanceMode) info.ctx.shadowBlur = 6;
            info.ctx.fillText(`Time Left: ${timeLeft}s`, info.width / 2, 10);
            info.ctx.restore();
            info.ctx.restore();
        }
        // Draw Goal
        if (info.goalType) {
            if (info.goalType == "cell") {
                info.ctx.save();
                info.ctx.beginPath();
                info.ctx.arc(info.goal.x * info.goal.d + info.goal.d / 2, info.goal.y * info.goal.d + info.goal.d / 2, info.goalRadius, 0, 2 * Math.PI);
                info.ctx.fillStyle = "#2f4";
                if (!options.performanceMode) info.ctx.shadowColor = "#2f4";
                if (!options.performanceMode) info.ctx.shadowBlur = 16;
                info.ctx.fill();
                info.ctx.restore();
            } else {
                info.ctx.save();
                info.ctx.beginPath();
                info.ctx.arc(info.goal.x, info.goal.y, info.goalRadius, 0, 2 * Math.PI);
                info.ctx.fillStyle = "#2f4";
                if (!options.performanceMode) info.ctx.shadowColor = "#2f4";
                if (!options.performanceMode) info.ctx.shadowBlur = 16;
                info.ctx.fill();
                info.ctx.restore();
            }
        }

        // Draw bullets
        info.ctx.save();
        for (let b of info.bullets) {
            if (b.boxRender) {
                b.draw(b, info.ctx)
            }
        }

        // Draw sliding platforms and ground spikes if present
        if (info.platforms && info.platforms.length) {
            for (let p of info.platforms) {
                info.ctx.save();
                info.ctx.fillStyle = p.color || '#888';
                if (!options.performanceMode) {
                    info.ctx.shadowColor = '#000';
                    info.ctx.shadowBlur = 8;
                }
                info.ctx.fillRect(p.x, p.y, p.w, p.h);
                // Draw spikes on top of platform if present
                if (p.hasSpikes) {
                    info.ctx.fillStyle = p.spikeColor || '#ddd';
                    const spW = p.spikeW || 12;
                    const spH = p.spikeH || 12;
                    for (let sx = p.x; sx < p.x + p.w; sx += spW) {
                        info.ctx.beginPath();
                        info.ctx.moveTo(sx, p.y);
                        info.ctx.lineTo(Math.min(sx + spW / 2, p.x + p.w), p.y - spH);
                        info.ctx.lineTo(Math.min(sx + spW, p.x + p.w), p.y);
                        info.ctx.closePath();
                        info.ctx.fill();
                    }
                }
                info.ctx.restore();
            }
        }
        if (info.spikes && info.spikes.length) {
            info.ctx.save();
            info.ctx.fillStyle = '#ddd';
            for (let s of info.spikes) {
                const sx = s.x, sy = s.y, sw = s.w, sh = s.h;
                info.ctx.beginPath();
                info.ctx.moveTo(sx, sy + sh);
                info.ctx.lineTo(sx + sw / 2, sy);
                info.ctx.lineTo(sx + sw, sy + sh);
                info.ctx.closePath();
                info.ctx.fill();
            }
            info.ctx.restore();
        }
        // Draw player (red diamond) in the box
        if (info.subArena && info.moveWithSub) {
            info.ctx.translate(info.subx + info.px, info.suby + info.py);
        } else {
            info.ctx.translate(info.px, info.py);
        }
        if (Date.now() - window.lastDamageTime <= 200) info.ctx.scale(0.9, 0.9);
        info.ctx.rotate(Math.PI / 2);
        info.ctx.beginPath();
        info.ctx.moveTo(0, -info.pr);
        info.ctx.lineTo(info.pr, 0);
        info.ctx.lineTo(0, info.pr);
        info.ctx.lineTo(-info.pr, 0);
        info.ctx.closePath();
        // Blue-mode diamond color
        if (info.blueMode) {
            info.ctx.fillStyle = Date.now() - window.lastDamageTime > 200 ? "#22a" : "#116";
            if (!options.performanceMode) info.ctx.shadowColor = Date.now() - window.lastDamageTime > 200 ? "#22a" : "#116";
        } else {
            info.ctx.fillStyle = Date.now() - window.lastDamageTime > 200 ? "#e22" : "#811";
            if (!options.performanceMode) info.ctx.shadowColor = Date.now() - window.lastDamageTime > 200 ? "#e22" : "#811";
        }
        if (!options.performanceMode) info.ctx.shadowBlur = 8;
        info.ctx.fill();
        info.ctx.restore();

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    function mouseHandler(e) {
        updatePos(e);
        e.preventDefault();
    }
    function touchHandler(e) {
        updatePos(e, true);
        e.preventDefault();
    }
    function keydownHandler(e) {
        updateKeys(e, true);
        // If blueMode and space pressed, jump
        if (info.blueMode && (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar')) {
            if (info.onGround) {
                const height = info.computedJumpHeight || (Math.abs(info.jumpStrength) || (info.values.jumpMin ?? 40));
                const g = Math.abs(info.gravity) || (info.values.gravity ?? 0.6);
                const vy0 = Math.sqrt(2 * g * height);
                info.vy = -vy0;
                info.onGround = false;
            }
            e.preventDefault();
            return;
        }
        e.preventDefault();
    }
    function keyupHandler(e) {
        updateKeys(e, false);
        e.preventDefault();
    }
    function clickHandler(e) {
        // Clicking jumps toward clicked horizontal position when in blueMode
        if (info.blueMode) {
            const clickX = e.clientX - info.boxLeft;
            const clickY = e.clientY - info.boxTop;
            // vertical jump toward clicked Y using computed jump height
            if (info.onGround) {
                const dy = info.py - clickY; // positive if click is above
                const absdy = Math.max(0, Math.min(dy, info.height));
                const factor = info.height > 0 ? (absdy / info.height) : 0;
                const jMin = info.values.jumpMin ?? 40;
                const jMax = info.values.jumpMax ?? 220;
                const height = jMin + factor * (jMax - jMin);
                const g = Math.abs(info.gravity) || (info.values.gravity ?? 0.6);
                const vy0 = Math.sqrt(2 * g * height);
                info.vy = -vy0;
                info.onGround = false;
            }
            // nudge horizontal velocity toward click
            const dx = clickX - info.px;
            info.vx = (info.vx || 0) + dx * 0.08;
            e.preventDefault();
            return;
        }
        updatePos(e);
        e.preventDefault();
    }

    if (!options.bhKeyboard) {
        window.addEventListener("mousemove", mouseHandler);
        window.addEventListener("touchmove", touchHandler);
        window.addEventListener("click", clickHandler);
    } else {
        window.addEventListener("keydown", keydownHandler);
        window.addEventListener("keyup", keyupHandler);
        window.addEventListener("click", clickHandler);
    }

    // Save handlers and overlay for cleanup on reload
    bhState.overlay = overlay;
    bhState.bossCanvas = bossCanvas;
    bhState.mouseHandler = mouseHandler;
    bhState.touchHandler = touchHandler;
    bhState.clickHandler = clickHandler;

    // End the minigame after duration
    bhState.timer = setTimeout(() => {
        info.exitAction()
        if (!options.bhKeyboard) {
            window.removeEventListener("mousemove", mouseHandler);
            window.removeEventListener("touchmove", touchHandler);
            window.removeEventListener("click", clickHandler);
        } else {
            window.removeEventListener("keydown", keydownHandler);
            window.removeEventListener("keyup", keyupHandler);
            window.removeEventListener("click", clickHandler);

        }
        if (overlay.parentNode) overlay.remove();
        bhState.active = false;
        info.active = false;
        player.subtabs["bh"]["stuff"] = "battle";
        pauseUniverseAll(["BH"], "unpause", true)
        player.universe = "U3"
        options.fullscreen = info.full;
        if (info.timed) bhAttack(Decimal.mul(player.bh.celestialite.damage, 3), 3, 0, "allPlayer")
        localStorage.setItem('bhState', JSON.stringify(info));
    }, info.duration * 1000);
}

// --- AUTO-RESUME ON RELOAD ---
// Wrapper for a blue-diamond, platformer-style bulletHell
function bulletHellBlue(actions, values = {}, exitAction = () => {}) {
    values = values || {};
    values.blueMode = true;
    // sensible defaults for platformer feel
    if (typeof values.gravity === 'undefined') values.gravity = 0.6;
    if (typeof values.jumpStrength === 'undefined') values.jumpStrength = -12;
    return bulletHell(actions, values, exitAction);
}
// Ensure global accessibility
try { window.bulletHellBlue = bulletHellBlue } catch (e) { /* ignore in non-browser env */ }
let storedInfo = localStorage.getItem('bhState')
if (storedInfo && storedInfo != "") {
    storedInfo = JSON.parse(storedInfo)
    if (storedInfo.active) {
        const bhState = storedInfo;
        // Calculate remaining time
        const elapsed = (Date.now() - (bhState.startTime || Date.now())) / 1000;
        const remaining = Math.max(0.1, (bhState.duration || 12) - elapsed);
        let newValues = bhState.values
        newValues.duration = remaining
        newValues.saveContent = true
        if (remaining > 0.1) {
            setTimeout(() => {
                bulletHell(bhState.actions, newValues);
            }, 500)
        } else {
            // If time is up, clean up state            
            setTimeout(() => {
                if (storedInfo.exitAction) storedInfo.exitAction()
                player.subtabs["bh"]["stuff"] = "battle";
                pauseUniverseAll(["BH"], "unpause", true)
                player.universe = "U3"
                bhState.active = false;
                options.fullscreen = bhState.full;
                if (bhState.timed) bhAttack(Decimal.mul(player.bh.celestialite.damage, 3), 3, 0, "allPlayer")
                storedInfo.active = false
                localStorage.setItem('bhState', JSON.stringify(storedInfo));
            }, 500)
        }
    } else {
        setTimeout(() => {
            const bhState = storedInfo
            if (player && player.subtabs && player.subtabs["bh"]["stuff"] == "bullet") {
                if (storedInfo.exitAction) storedInfo.exitAction()
                player.subtabs["bh"]["stuff"] = "battle";
                pauseUniverseAll(["BH"], "unpause", true)
                player.universe = "U3"
                if (bhStage) {
                    bhState.active = false;
                    options.fullscreen = bhState.full;
                    if (bhState.timed) bhAttack(Decimal.mul(player.bh.celestialite.damage, 3), 3, 0, "allPlayer")
                } else {
                    options.fullscreen = false
                }
                storedInfo.active = false
                localStorage.setItem('bhState', JSON.stringify(storedInfo));
            }
        }, 1000)
    }
}

BHB.none = {}

BHB.diamondAttack = {
    //bulletHell({"diamondAttack": {diamondAmount: 2, intervalDiv: 1}}, {duration: 10})
    codeFunc() {
        const diamondRadius = bulletHellNeo.actions["diamondAttack"].diamondRadius ?? 40;
        for (let i = 0; i < bulletHellNeo.actions["diamondAttack"].diamondAmount; i++) {
            let angleOffset = (2 * Math.PI * i) / bulletHellNeo.actions["diamondAttack"].diamondAmount;
            bulletHellNeo.bullets.push({
                name: "diamond",
                x: bulletHellNeo.boxLeft + bulletHellNeo.px + 200 * Math.cos(angleOffset),
                y: bulletHellNeo.boxTop + bulletHellNeo.py + 200 * Math.sin(angleOffset),
                vx: 0,
                vy: 0,
                r: diamondRadius,
                orbitRadius: 200,
                orbitAngle: angleOffset,
                orbitSpeed: 0.015 + 0.003 * i, // slightly different speeds
                shootInterval: (500 + Math.floor(Math.random() * 600) + i * 150) / (bulletHellNeo.actions["diamondAttack"].intervalDiv || 1), // each diamond has a different interval
                lastShotTime: 0,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(Math.PI / 2); // 90deg
                    bossCtx.beginPath();
                    bossCtx.moveTo(0, -b.r);
                    bossCtx.lineTo(b.r, 0);
                    bossCtx.lineTo(0, b.r);
                    bossCtx.lineTo(-b.r, 0);
                    bossCtx.closePath();
                    bossCtx.fillStyle = "#fff";
                    if (!options.performanceMode) bossCtx.shadowColor = "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 16;
                    bossCtx.fill();
                    bossCtx.resetTransform()
                }
            });
        }
    },
    moveFunc() {
        // Update each diamond's orbit and position, and handle shooting
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "diamond") {
                b.orbitAngle += b.orbitSpeed;
                const playerGlobalX = bulletHellNeo.boxLeft + bulletHellNeo.px;
                const playerGlobalY = bulletHellNeo.boxTop + bulletHellNeo.py;
                const targetBx = playerGlobalX + b.orbitRadius * Math.cos(b.orbitAngle);
                const targetBy = playerGlobalY + b.orbitRadius * Math.sin(b.orbitAngle);
                // Smoothly move boss towards target position (lerp)
                const lerpFactor = 0.05;
                b.x += (targetBx - b.x) * lerpFactor * 60 * bulletHellNeo.delta;
                b.y += (targetBy - b.y) * lerpFactor * 60 * bulletHellNeo.delta;

                // Each diamond shoots at its own interval
                const speed = bulletHellNeo.actions["diamondAttack"].enemySpeed ?? 5
                if (!b.lastShotTime) b.lastShotTime = Date.now();
                if (Date.now() - b.lastShotTime > b.shootInterval) {
                    bulletHellNeo.shootAtPlayer(b.x, b.y, "diamondAttack", speed);
                    b.lastShotTime = Date.now();
                }
            }
        }
    },
}

BHB.rotatingCircleRadialBurst = {
    //bulletHell({"rotatingCircleRadialBurst": {locX: 250, locY: 250, circleAmount: 4, burstInterval: 1200, orbitSpeed: 0.015, orbitRadius: 400, bulletsPerBurst: 6, enemySpeed: 6, bulletSpeed: 5}}, {width: 500, duration: 12})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["rotatingCircleRadialBurst"].circleAmount; i++) {
            let angleOffset = (2 * Math.PI * i) / bulletHellNeo.actions["rotatingCircleRadialBurst"].circleAmount;
            bulletHellNeo.bullets.push({
                name: "circle",
                x: bulletHellNeo.boxLeft + bulletHellNeo.actions["rotatingCircleRadialBurst"].locX + 200 * Math.cos(angleOffset),
                y: bulletHellNeo.boxTop + bulletHellNeo.actions["rotatingCircleRadialBurst"].locY + 200 * Math.sin(angleOffset),
                vx: 0,
                vy: 0,
                r: 40,
                orbitRadius: bulletHellNeo.actions["rotatingCircleRadialBurst"].orbitRadius,
                orbitAngle: angleOffset,
                orbitSpeed: bulletHellNeo.actions["rotatingCircleRadialBurst"].orbitSpeed, // slightly different speeds
                lastBurstTime: 0,
                draw(b, ctx) {
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    ctx.fillStyle = "#eee";
                    if (!options.performanceMode) ctx.shadowColor = "#fff";
                    if (!options.performanceMode) ctx.shadowBlur = 12;
                    ctx.fill()
                }
            });
        }
    },
    moveFunc() {
        // Ensure sensible defaults so bursts actually spawn
        bulletHellNeo.actions["rotatingCircleRadialBurst"].bulletsPerBurst = bulletHellNeo.actions["rotatingCircleRadialBurst"].bulletsPerBurst || 12;
        bulletHellNeo.actions["rotatingCircleRadialBurst"].bulletSpeed = bulletHellNeo.actions["rotatingCircleRadialBurst"].bulletSpeed || 5;

        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "circle") {
                b.orbitAngle += b.orbitSpeed;
                const playerGlobalX = bulletHellNeo.boxLeft + bulletHellNeo.actions["rotatingCircleRadialBurst"].locX;
                const playerGlobalY = bulletHellNeo.boxTop + bulletHellNeo.actions["rotatingCircleRadialBurst"].locY;
                const targetBx = playerGlobalX + b.orbitRadius * Math.cos(b.orbitAngle);
                const targetBy = playerGlobalY + b.orbitRadius * Math.sin(b.orbitAngle);
                // Smoothly move boss towards target position (lerp)
                const lerpFactor = 0.05;
                b.x += (targetBx - b.x) * lerpFactor;
                b.y += (targetBy - b.y) * lerpFactor;

                // Burst
                if (!b.lastBurstTime) b.lastBurstTime = Date.now()
                if (Date.now() - b.lastBurstTime > bulletHellNeo.actions["rotatingCircleRadialBurst"].burstInterval) {
                    bulletHellNeo.fireRadialBurst(b.x, b.y, "rotatingCircleRadialBurst")
                    b.lastBurstTime = Date.now()
                }
            }
        }
    },
}

BHB.bulletRain = {
    //bulletHell({"bulletRain": {bulletPerSec: 10}}, {duration: 12})
    moveFunc() {
        // Rain Bullets
        const bulletRadius = bulletHellNeo.actions["bulletRain"].bulletRadius ?? 12;
        const bulletSpeed = bulletHellNeo.actions["bulletRain"].enemySpeed ?? 4;
        if (!bulletHellNeo.actions["bulletRain"].lastTime) bulletHellNeo.actions["bulletRain"].lastTime = Date.now();
        const bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["bulletRain"].lastTime) / 1000) * bulletHellNeo.actions["bulletRain"].bulletPerSec); // LAST NUMBER IS AMOUNT OF BULLETS PER SECOND
        for (let i = 0; i < bulletsToSpawn; i++) {
            let bx = Math.random() * bulletHellNeo.width + bulletHellNeo.boxLeft;
            let by = -bulletRadius;
            let bul = {x: bx, y: by, vx: 0, vy: bulletSpeed, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul);
        }
        if (bulletsToSpawn > 0) bulletHellNeo.actions["bulletRain"].lastTime = Date.now();
    },
}

BHB.inverseRain = {
    //bulletHell({"inverseRain": {bulletPerSec: 10}}, {duration: 12})
    moveFunc() {
        // Rain Bullets
        const bulletRadius = bulletHellNeo.actions["inverseRain"].bulletRadius ?? 12;
        const bulletSpeed = 4;
        if (!bulletHellNeo.actions["inverseRain"].lastTime) bulletHellNeo.actions["inverseRain"].lastTime = Date.now();
        const bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["inverseRain"].lastTime) / 1000) * bulletHellNeo.actions["inverseRain"].bulletPerSec); // LAST NUMBER IS AMOUNT OF BULLETS PER SECOND
        for (let i = 0; i < bulletsToSpawn; i++) {
            let bx = Math.random() * bulletHellNeo.width + bulletHellNeo.boxLeft;
            let by = window.innerHeight + bulletRadius;
            let bul = {x: bx, y: by, vx: 0, vy: -bulletSpeed, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul);
        }
        if (bulletsToSpawn > 0) bulletHellNeo.actions["inverseRain"].lastTime = Date.now();
    },
}

BHB.movingCircleRadialBurstAttack = {
    //bulletHell({"movingCircleRadialBurstAttack": {circleAmount: 1, burstInterval: 1200, bulletsPerBurst: 18, enemySpeed: 6, bulletSpeed: 5}}, {duration: 12})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["movingCircleRadialBurstAttack"].circleAmount; i++) {
            bulletHellNeo.bullets.push({
                name: "circle",
                x: Math.random() * (bulletHellNeo.width - 120) + 60 + bulletHellNeo.boxLeft,
                y: Math.random() * (bulletHellNeo.height - 120) + 60 + bulletHellNeo.boxTop,
                vx: (Math.random() - 0.5) * bulletHellNeo.actions["movingCircleRadialBurstAttack"].enemySpeed * 2,
                vy: (Math.random() - 0.5) * bulletHellNeo.actions["movingCircleRadialBurstAttack"].enemySpeed * 2,
                r: 40,
                lastBurstTime: 0,
                draw(b, ctx) {
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    ctx.fillStyle = "#eee";
                    if (!options.performanceMode) ctx.shadowColor = "#fff";
                    if (!options.performanceMode) ctx.shadowBlur = 12;
                    ctx.fill()
                }
            });
        }
    },
    moveFunc() {
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "circle") {
                // Bounce off walls
                if (b.x < b.r + bulletHellNeo.boxLeft) {b.x = b.r + bulletHellNeo.boxLeft; b.vx *= -1}
                if (b.x > bulletHellNeo.width - b.r + bulletHellNeo.boxLeft) {b.x = bulletHellNeo.width - b.r + bulletHellNeo.boxLeft; b.vx *= -1}
                if (b.y < b.r + bulletHellNeo.boxTop) {b.y = b.r + bulletHellNeo.boxTop; b.vy *= -1}
                if (b.y > bulletHellNeo.height - b.r + bulletHellNeo.boxTop) {b.y = bulletHellNeo.height - b.r + bulletHellNeo.boxTop; b.vy *= -1}

                // Burst
                if (!b.lastBurstTime) b.lastBurstTime = Date.now()
                if (Date.now() - b.lastBurstTime > bulletHellNeo.actions["movingCircleRadialBurstAttack"].burstInterval) {
                    bulletHellNeo.fireRadialBurst(b.x, b.y, "movingCircleRadialBurstAttack")
                    b.lastBurstTime = Date.now()
                }
            }
        }
    },
}

BHB.knifeThrow = {
    //bulletHell({"knifeThrow": {knifeLength: 64, knifeWidth: 16, enemySpeed: 6, knifePerSec: 1.2}}, {width: 500, height: 300, duration: 15})
    moveFunc() {
        // Spawn knives
        if (!bulletHellNeo.actions["knifeThrow"].lastTime) bulletHellNeo.actions["knifeThrow"].lastTime = Date.now();
        const knivesToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["knifeThrow"].lastTime) / 1000) * bulletHellNeo.actions["knifeThrow"].knifePerSec);
        for (let i = 0; i < knivesToSpawn; i++) {
            bulletHellNeo.spawnKnife("knifeThrow");
        }
        if (knivesToSpawn > 0) bulletHellNeo.actions["knifeThrow"].lastTime = Date.now();
    },
}

BHB.bouncingDiamond = {
    //bulletHell({"bouncingDiamond": {diamondCount: 6, enemySpeed: 3}}, {duration: 15})
    codeFunc() {
        const br = 25;
        for (let i = 0; i < bulletHellNeo.actions["bouncingDiamond"].diamondCount; i++) {
            // Random position, not too close to player
            let angle = Math.random() * 2 * Math.PI;
            let dist = Math.random() * (bulletHellNeo.width / 2 - br - bulletHellNeo.pr) + br + bulletHellNeo.pr + 10;
            let bx = bulletHellNeo.width / 2 + Math.cos(angle) * dist + bulletHellNeo.boxLeft;
            let by = bulletHellNeo.height / 2 + Math.sin(angle) * dist + bulletHellNeo.boxTop;
            // Random velocity
            let theta = Math.random() * 2 * Math.PI;
            let vx = Math.cos(theta) * bulletHellNeo.actions["bouncingDiamond"].enemySpeed;
            let vy = Math.sin(theta) * bulletHellNeo.actions["bouncingDiamond"].enemySpeed;
            bulletHellNeo.bullets.push({
                name: "diamond",
                x: bx,
                y: by,
                vx: vx,
                vy: vy,
                r: br,
                bouncy: true,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(Math.PI / 2); // 90deg
                    bossCtx.beginPath();
                    bossCtx.moveTo(0, -b.r);
                    bossCtx.lineTo(b.r, 0);
                    bossCtx.lineTo(0, b.r);
                    bossCtx.lineTo(-b.r, 0);
                    bossCtx.closePath();
                    bossCtx.fillStyle = "#fff";
                    if (!options.performanceMode) bossCtx.shadowColor = "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 16;
                    bossCtx.fill();
                    bossCtx.resetTransform()
                },
            });
        }
    },
}

BHB.radialKnifeBurstAttack = {
    //bulletHell({"radialKnifeBurstAttack": {knifeLength: 64, knifeWidth: 16, burstInterval: 1500, bulletsPerBurst: 5, enemySpeed: 8}}, {duration: 12, width: 500})
    moveFunc() {
        // Fire knife burst
        if (!bulletHellNeo.actions["radialKnifeBurstAttack"].lastTime) bulletHellNeo.actions["radialKnifeBurstAttack"].lastTime = Date.now();
        if (Date.now() - bulletHellNeo.actions["radialKnifeBurstAttack"].lastTime > bulletHellNeo.actions["radialKnifeBurstAttack"].burstInterval) {
            bulletHellNeo.fireKnifeBurst("radialKnifeBurstAttack");
            bulletHellNeo.actions["radialKnifeBurstAttack"].lastTime = Date.now();
        }
    },
}

//bulletHell({"bulletRain": {bulletPerSec: 10}, "knifeThrow": {knifeLength: 64, knifeWidth: 16, enemySpeed: 6, knifePerSec: 1.2}}, {duration: 15})

//bulletHell({}, {duration: 15, timed: true, cellSize: 50, start: "cell", goal: "cell"})
//bulletHell({"bouncingDiamond": {diamondCount: 6, enemySpeed: 3}}, {width: 1000, height: 700, duration: 60, timed: true, cellSize: 40, start: "cell", goal: "cell"})

//bulletHell({"knifeThrow": {knifeLength: 64, knifeWidth: 16, enemySpeed: 6, knifePerSec: 2}}, {width: 1000, height: 500, duration: 15, subArena: true, subWidth: 300})

BHB.bombAttack = {
    //bulletHell({"bombAttack": {bombsPerSecond: 1, bombFallSpeed: 4, miniBombCount: 3, miniBombSpeed: 5, miniBombDelay: 600, bulletCount: 5, bulletSpeed: 3}}, {duration: 15})
    moveFunc() {
        // Spawn bombs
        if (!bulletHellNeo.actions["bombAttack"].lastTime) bulletHellNeo.actions["bombAttack"].lastTime = Date.now();
        const bombsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["bombAttack"].lastTime) / 1000) * bulletHellNeo.actions["bombAttack"].bombsPerSecond);
        for (let i = 0; i < bombsToSpawn; i++) {
            let x = 60 + Math.random() * (bulletHellNeo.width - 120);
            bulletHellNeo.bullets.push({
                name: "bomb",
                boxRender: true, // RENDER IN BOX
                x: x,
                y: -24,
                r: 24,
                vx: 0,
                vy: bulletHellNeo.actions["bombAttack"].bombFallSpeed,
                exploded: false,
                explodeTime: null,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = '#fff';
                    if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                    if (!options.performanceMode) bossCtx.shadowBlur = 12;
                    bossCtx.fill();
                },
            });
        }
        if (bombsToSpawn > 0) bulletHellNeo.actions["bombAttack"].lastTime = Date.now();

        // Move bombs
        for (let b of bulletHellNeo.bullets) {
            if (b.name == "bomb" && !b.exploded && b.y > bulletHellNeo.height * 0.7) {
                b.exploded = true
                b.explodeTime = Date.now()
                // Spawn mini-bullets in a radial pattern
                for (let j = 0; j < bulletHellNeo.actions["bombAttack"].miniBombCount; j++) {
                    let angle = (2 * Math.PI * j) / bulletHellNeo.actions["bombAttack"].miniBombCount
                    bulletHellNeo.bullets.push({
                        name: "minibomb",
                        boxRender: true, // RENDER IN BOX
                        x: b.x,
                        y: b.y,
                        r: 12,
                        vx: Math.cos(angle) * bulletHellNeo.actions["bombAttack"].miniBombSpeed,
                        vy: Math.sin(angle) * bulletHellNeo.actions["bombAttack"].miniBombSpeed,
                        exploded: false,
                        explodeTime: Date.now() + bulletHellNeo.actions["bombAttack"].miniBombDelay,
                        draw(b, bossCtx) {
                            bossCtx.beginPath();
                            bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                            bossCtx.fillStyle = '#fff';
                            if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                            if (!options.performanceMode) bossCtx.shadowBlur = 8;
                            bossCtx.fill();
                        },
                    })
                }
            }
            if (b.name == "minibomb" && !b.exploded && Date.now() >= b.explodeTime) {
                b.exploded = true
                // Spawn bullets in a radial pattern
                for (let k = 0; k < bulletHellNeo.actions["bombAttack"].bulletCount; k++) {
                    let angle = (2 * Math.PI * k) / bulletHellNeo.actions["bombAttack"].bulletCount;
                    bulletHellNeo.bullets.push({
                        boxRender: true, // RENDER IN BOX
                        x: b.x,
                        y: b.y,
                        r: 8,
                        vx: Math.cos(angle) * bulletHellNeo.actions["bombAttack"].bulletSpeed,
                        vy: Math.sin(angle) * bulletHellNeo.actions["bombAttack"].bulletSpeed,
                        draw(b, bossCtx) {
                            bossCtx.beginPath();
                            bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                            bossCtx.fillStyle = '#fff';
                            if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                            if (!options.performanceMode) bossCtx.shadowBlur = 4;
                            bossCtx.fill();
                        },
                    });
                }
            }
        }
    },
}

//bulletHell({"bulletRain": {bulletPerSec: 18}, "knifeThrow": {knifeLength: 64, knifeWidth: 16, enemySpeed: 8, knifePerSec: 1.5}}, {width: window.innerWidth, height: window.innerHeight, duration: 15})

BHB.centerSpiralAttack = {
    //bulletHell({"centerSpiralAttack": {spiralAngle: 0, spiralRate: 0.325, spiralInterval: 30, radialStart: 64, bulletSpeed: 7, spiralKnives: true, knifeLength: 64, knifeWidth: 16}}, {width: window.innerWidth, height: window.innerHeight, duration: 15})
    moveFunc() {
        // Spiral fire
        if (!bulletHellNeo.actions["centerSpiralAttack"].lastTime) bulletHellNeo.actions["centerSpiralAttack"].lastTime = Date.now();
        if (Date.now() - bulletHellNeo.actions["centerSpiralAttack"].lastTime > bulletHellNeo.actions["centerSpiralAttack"].spiralInterval) {
            let spiX = bulletHellNeo.width / 2 + bulletHellNeo.boxLeft
            let spiY = bulletHellNeo.height / 2 + bulletHellNeo.boxTop
            if (bulletHellNeo.actions["centerSpiralAttack"].locX) spiX = bulletHellNeo.actions["centerSpiralAttack"].locX + bulletHellNeo.boxLeft
            if (bulletHellNeo.actions["centerSpiralAttack"].locY) spiY = bulletHellNeo.actions["centerSpiralAttack"].locY + bulletHellNeo.boxTop
            bulletHellNeo.spawnSpiralProjectile(spiX, spiY, bulletHellNeo.actions["centerSpiralAttack"].radialStart, "centerSpiralAttack")
            bulletHellNeo.actions["centerSpiralAttack"].spiralAngle += bulletHellNeo.actions["centerSpiralAttack"].spiralRate;
            bulletHellNeo.actions["centerSpiralAttack"].lastTime = Date.now();
        }
    },
}

BHB.centerSpreadAttack = {
    //bulletHell({"centerSpreadAttack": {bulletSpeed: 6, spreadInterval: 1000, spreadCount: 7, spreadAngle: Math.PI/3}}, {width: window.innerWidth, height: window.innerHeight, duration: 15})
    moveFunc() {
        if (!bulletHellNeo.actions["centerSpreadAttack"].lastTime) bulletHellNeo.actions["centerSpreadAttack"].lastTime = Date.now();
        if (Date.now() - bulletHellNeo.actions["centerSpreadAttack"].lastTime > bulletHellNeo.actions["centerSpreadAttack"].spreadInterval) {
            bulletHellNeo.shootSpreadAtPlayer(bulletHellNeo.width / 2 + bulletHellNeo.boxLeft, bulletHellNeo.height / 2 + bulletHellNeo.boxTop, "centerSpreadAttack");
            bulletHellNeo.actions["centerSpreadAttack"].lastTime = Date.now();
        }
    },
}

BHB.centerSingleAttack = {
    //bulletHell({"centerSingleAttack": {bulletSpeed: 6, shootInterval: 1000}}, {width: window.innerWidth, height: window.innerHeight, duration: 15})
    moveFunc() {
        if (!bulletHellNeo.actions["centerSingleAttack"].lastTime) bulletHellNeo.actions["centerSingleAttack"].lastTime = Date.now();
        if (Date.now() - bulletHellNeo.actions["centerSingleAttack"].lastTime > bulletHellNeo.actions["centerSingleAttack"].shootInterval) {
            bulletHellNeo.shootAtPlayer(bulletHellNeo.width / 2 + bulletHellNeo.boxLeft, bulletHellNeo.height / 2 + bulletHellNeo.boxTop, "centerSingleAttack", bulletHellNeo.actions["centerSingleAttack"].bulletSpeed);
            bulletHellNeo.actions["centerSingleAttack"].lastTime = Date.now();
        }
    },
}

BHB.centerIcon = {
    //bulletHell({"centerIcon": {radius: 64, fillColor: "#fff", strokeColor: "#e22", symbol: "⊘"}}, {width: window.innerWidth, height: window.innerHeight, duration: 15})
    codeFunc() {
        let curX = bulletHellNeo.width / 2 + bulletHellNeo.boxLeft
        let curY = bulletHellNeo.height / 2 + bulletHellNeo.boxTop
        if (bulletHellNeo.actions["centerIcon"].locX) curX = bulletHellNeo.actions["centerIcon"].locX
        if (bulletHellNeo.actions["centerIcon"].locY) curY = bulletHellNeo.actions["centerIcon"].locY
        bulletHellNeo.bullets.push({
            name: "symbol",
            boxRender: true,
            symbol: bulletHellNeo.actions["centerIcon"].symbol,
            fill: bulletHellNeo.actions["centerIcon"].fillColor,
            stroke: bulletHellNeo.actions["centerIcon"].strokeColor,
            angle: 0,
            x: curX,
            y: curY,
            vx: 0,
            vy: 0,
            r: bulletHellNeo.actions["centerIcon"].radius,
            draw(b, bossCtx) {
                // Draw big symbol (⊘)
                bossCtx.save();
                bossCtx.translate(b.x, b.y);
                bossCtx.font = 'bold ' + b.r*2 + 'px serif';
                bossCtx.textAlign = 'center';
                bossCtx.textBaseline = 'middle';
                bossCtx.globalAlpha = 0.92;
                if (!options.performanceMode) bossCtx.shadowColor = b.fillColor;
                if (!options.performanceMode) bossCtx.shadowBlur = 32;
                bossCtx.fillStyle = b.fill;
                bossCtx.fillText(b.symbol, 0, 0);
                bossCtx.globalAlpha = 1;
                if (!options.performanceMode) bossCtx.shadowBlur = 0;
                bossCtx.lineWidth = 6;
                bossCtx.strokeStyle = b.stroke;
                bossCtx.strokeText(b.symbol, 0, 0);
                bossCtx.restore();
                /*
                // Draw a spiral pattern inside
                bossCtx.save();
                bossCtx.translate(b.x, b.y - 5);
                bossCtx.rotate(b.angle);
                bossCtx.strokeStyle = b.stroke;
                bossCtx.lineWidth = 2;
                for (let i = 0; i < 8; i++) {
                    bossCtx.beginPath();
                    bossCtx.arc(0, 0, b.r, i * Math.PI / 4, i * Math.PI / 4 + Math.PI / 8);
                    bossCtx.stroke();
                }
                bossCtx.restore();
                */
            },
        })
    },
    moveFunc() {
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "symbol") {
                b.angle += 1.44
            }
        }
    },
}

//bulletHell({"centerSpiralAttack": {spiralAngle: 0, spiralRate: 0.325, spiralInterval: 30, radialStart: 64, bulletSpeed: 7, spiralKnives: true, knifeLength: 64, knifeWidth: 16}, "bouncingDiamond": {diamondCount: 3, enemySpeed: 4}, "centerSpreadAttack": {bulletSpeed: 6, spreadInterval: 1000, spreadCount: 7, spreadAngle: Math.PI/3}, "centerIcon": {radius: 64, fillColor: "#fff", strokeColor: "#e22", symbol: "⊘"}}, {width: window.innerWidth, height: window.innerHeight, duration: 15, transparent: true, saveContent: true})

BHB.finalMatosAttack = {
    //bulletHell({"finalMatosAttack": {radius: 64, fillColor: "#fff", strokeColor: "#e22", symbol: "⊘", burstBullets: 8, burstViolence: 0.5, lungeTimer: 0, lungeCooldown: 0, explosionBurstTimer: 0, explosionBurstCount: 0, lastTick: false}, "bulletRain": {bulletPerSec: 12, duration: 15}, "knifeThrow": {knifeLength: 64, knifeWidth: 16, enemySpeed: 8, knifePerSec: 1.2, duration: 15}}, {width: window.innerWidth, height: window.innerHeight, duration: 19, transparent: true, saveContent: true})
    codeFunc() {
        bulletHellNeo.bullets = bulletHellNeo.bullets.filter(b => {
            if (b.name && (b.name == "diamond" || b.name == "symbol")) return false
        });

        bulletHellNeo.bullets.push({
            name: "movingSymbol",
            boxRender: true,
            symbol: bulletHellNeo.actions["finalMatosAttack"].symbol,
            fill: bulletHellNeo.actions["finalMatosAttack"].fillColor,
            stroke: bulletHellNeo.actions["finalMatosAttack"].strokeColor,
            x: bulletHellNeo.width / 2,
            y: bulletHellNeo.height / 2,
            r: bulletHellNeo.actions["finalMatosAttack"].radius,
            vx: 0,
            vy: 0,
            pulse: 0,
            pulsingRed: false,
            visible: true,
            burst: false,
            startTime: Date.now(),
            draw(b, bossCtx) {
                if (b.visible) {
                    // Draw big symbol (⊘)
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    let pulseScale = 1 + 0.18 * Math.sin(b.pulse * 2);
                    bossCtx.scale(pulseScale, pulseScale);
                    bossCtx.font = 'bold ' + b.r*2 + 'px serif';
                    bossCtx.textAlign = 'center';
                    bossCtx.textBaseline = 'middle';
                    bossCtx.globalAlpha = 0.92;
                    if (!options.performanceMode) bossCtx.shadowColor = b.pulsingRed ? '#e22' : '#fff';
                    if (!options.performanceMode) bossCtx.shadowBlur = 32;
                    bossCtx.fillStyle = b.pulsingRed ? '#e22' : b.fill;
                    bossCtx.fillText(b.symbol, 0, 0);
                    bossCtx.globalAlpha = 1;
                    if (!options.performanceMode) bossCtx.shadowBlur = 0;
                    bossCtx.lineWidth = 6;
                    bossCtx.strokeStyle = b.pulsingRed ? '#fff' : b.stroke;
                    bossCtx.strokeText(b.symbol, 0, 0);
                    bossCtx.restore();
                }
            },
        })
    },
    moveFunc() {
        let dt = Date.now() - (bulletHellNeo.actions["finalMatosAttack"].lastTick || Date.now());
        bulletHellNeo.actions["finalMatosAttack"].lastTick = Date.now();
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "movingSymbol") {
                if (b.visible && Date.now() > b.startTime + 15000) {
                    b.visible = false
                }
                
                // Phase 4: Symbol lunges, pulses, shoots in bursts, throws knives
                if (b.visible) {
                    // Lunge logic
                    if (!b.pulsingRed && bulletHellNeo.actions["finalMatosAttack"].lungeCooldown <= 0) {
                        bulletHellNeo.actions["finalMatosAttack"].lungeTimer = 1200;
                        let dx = bulletHellNeo.px - b.x;
                        let dy = bulletHellNeo.py - b.y;
                        let dist = Math.hypot(dx, dy);
                        b.vx = (dx / dist) * 7;
                        b.vy = (dy / dist) * 7;
                        b.pulsingRed = true;
                    } else if (!b.pulsingRed) {
                        bulletHellNeo.actions["finalMatosAttack"].lungeCooldown -= dt;
                    }
                    if (b.pulsingRed) {
                        bulletHellNeo.actions["finalMatosAttack"].lungeTimer -= dt;
                        if (bulletHellNeo.actions["finalMatosAttack"].lungeTimer <= 0) {
                            b.vx = 0;
                            b.vy = 0;
                            b.pulsingRed = false;
                            bulletHellNeo.actions["finalMatosAttack"].lungeCooldown = 1200 + Math.random() * 800;
                        }
                    }

                    // Pulse
                    b.pulse += dt * 0.008

                    // Shoot burst at player
                    if (!bulletHellNeo.actions["finalMatosAttack"].lastTime) bulletHellNeo.actions["finalMatosAttack"].lastTime = Date.now();
                    if (Date.now() - bulletHellNeo.actions["finalMatosAttack"].lastTime > 650) {
                        let dx = bulletHellNeo.px - b.x;
                        let dy = bulletHellNeo.py - b.y;
                        let baseAngle = Math.atan2(dy, dx);
                        for (let i = 0; i < bulletHellNeo.actions["finalMatosAttack"].burstBullets; i++) {
                            let spread = (i - (bulletHellNeo.actions["finalMatosAttack"].burstBullets - 1) / 2) * bulletHellNeo.actions["finalMatosAttack"].burstViolence;
                            let angle = baseAngle + spread + (Math.random() - 0.5) * 0.18;
                            let vx = Math.cos(angle) * 8 * (0.9 + Math.random() * 0.3);
                            let vy = Math.sin(angle) * 8 * (0.9 + Math.random() * 0.3);
                            bulletHellNeo.bullets.push({x: b.x, y: b.y, r: 12, vx, vy, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}});
                        }
                        // Randomize next burst
                        bulletHellNeo.actions["finalMatosAttack"].burstBullets = 7 + Math.floor(Math.random() * 4);
                        bulletHellNeo.actions["finalMatosAttack"].burstViolence = 0.25 + Math.random() * 0.5;

                        bulletHellNeo.actions["finalMatosAttack"].lastTime = Date.now();
                    }
                } else {
                    if (!b.burst) {
                        bulletHellNeo.actions["finalMatosAttack"].explosionBurstTimer += dt;
                        if (bulletHellNeo.actions["finalMatosAttack"].explosionBurstCount < 4 && bulletHellNeo.actions["finalMatosAttack"].explosionBurstTimer > 220) {
                            let N = 32;
                            let baseAngle = Math.random() * Math.PI * 2;
                            for (let i = 0; i < N; i++) {
                                let angle = baseAngle + (2 * Math.PI * i) / N;
                                let vx = Math.cos(angle) * 8 * (1.1 + Math.random() * 0.3);
                                let vy = Math.sin(angle) * 8 * (1.1 + Math.random() * 0.3);
                                bulletHellNeo.bullets.push({x: b.x, y: b.y, r: 12, vx, vy, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}});
                            }
                            bulletHellNeo.actions["finalMatosAttack"].explosionBurstCount++;
                            bulletHellNeo.actions["finalMatosAttack"].explosionBurstTimer = 0;
                        }
                        if (bulletHellNeo.actions["finalMatosAttack"].explosionBurstCount >= 4) {
                            b.burst = true;
                        }
                    }
                }
            }
        }
    },
}

BHB.chargingIcon = {
    //bulletHell({"chargingIcon": {locX: 600, locY: 250, radius: 64, fillColor: "#0091DC", strokeColor: "#094394", symbol: "⧖", enemySpeed: 5, bulletSpeed: 5, shootInterval: 1, burstBullets: 3, burstViolence: 0.5, lungeTimer: 0, lungeCooldown: 0, lastTick: false}}, {duration: 12})
    codeFunc() {
        let curX = bulletHellNeo.width / 2 + bulletHellNeo.boxLeft
        let curY = bulletHellNeo.height / 2 + bulletHellNeo.boxTop
        if (bulletHellNeo.actions["chargingIcon"].locX) curX = bulletHellNeo.actions["chargingIcon"].locX
        if (bulletHellNeo.actions["chargingIcon"].locY) curY = bulletHellNeo.actions["chargingIcon"].locY
        bulletHellNeo.bullets.push({
            name: "symbol",
            boxRender: true,
            symbol: bulletHellNeo.actions["chargingIcon"].symbol,
            fill: bulletHellNeo.actions["chargingIcon"].fillColor,
            stroke: bulletHellNeo.actions["chargingIcon"].strokeColor,
            x: curX,
            y: curY,
            r: bulletHellNeo.actions["chargingIcon"].radius,
            vx: 0,
            vy: 0,
            pulse: 0,
            pulsingRed: false,
            draw(b, bossCtx) {
                // Draw big symbol (⊘)
                bossCtx.save();
                bossCtx.translate(b.x, b.y);
                let pulseScale = 1 + 0.18 * Math.sin(b.pulse * 2);
                bossCtx.scale(pulseScale, pulseScale);
                bossCtx.font = 'bold ' + b.r*2 + 'px serif';
                bossCtx.textAlign = 'center';
                bossCtx.textBaseline = 'middle';
                bossCtx.globalAlpha = 0.92;
                if (!options.performanceMode) bossCtx.shadowColor = b.pulsingRed ? '#e22' : '#fff';
                if (!options.performanceMode) bossCtx.shadowBlur = 32;
                bossCtx.fillStyle = b.pulsingRed ? '#e22' : b.fill;
                bossCtx.fillText(b.symbol, 0, 0);
                bossCtx.globalAlpha = 1;
                if (!options.performanceMode) bossCtx.shadowBlur = 0;
                bossCtx.lineWidth = 6;
                bossCtx.strokeStyle = b.pulsingRed ? '#fff' : b.stroke;
                bossCtx.strokeText(b.symbol, 0, 0);
                bossCtx.restore();
            },
        })
    },
    moveFunc() {
        let dt = Date.now() - (bulletHellNeo.actions["chargingIcon"].lastTick || Date.now());
        bulletHellNeo.actions["chargingIcon"].lastTick = Date.now();
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "symbol") {
                // Lunge logic
                if (!b.pulsingRed && bulletHellNeo.actions["chargingIcon"].lungeCooldown <= 0) {
                    bulletHellNeo.actions["chargingIcon"].lungeTimer = 1200;
                    let dx = bulletHellNeo.px - b.x;
                    let dy = bulletHellNeo.py - b.y;
                    let dist = Math.hypot(dx, dy);
                    b.vx = (dx / dist) * bulletHellNeo.actions["chargingIcon"].enemySpeed;
                    b.vy = (dy / dist) * bulletHellNeo.actions["chargingIcon"].enemySpeed;
                    b.pulsingRed = true;
                } else if (!b.pulsingRed) {
                    bulletHellNeo.actions["chargingIcon"].lungeCooldown -= dt;
                }
                if (b.pulsingRed) {
                    bulletHellNeo.actions["chargingIcon"].lungeTimer -= dt;
                    if (bulletHellNeo.actions["chargingIcon"].lungeTimer <= 0) {
                        b.vx = 0;
                        b.vy = 0;
                        b.pulsingRed = false;
                        bulletHellNeo.actions["chargingIcon"].lungeCooldown = 1200 + Math.random() * 800;
                    }
                }

                // Pulse
                b.pulse += dt * 0.008

                // Shoot burst at player
                let shootSpeed = 1000 / (bulletHellNeo.actions["chargingIcon"].shootInterval || 1.5)
                if (!bulletHellNeo.actions["chargingIcon"].lastTime) bulletHellNeo.actions["chargingIcon"].lastTime = Date.now();
                if (Date.now() - bulletHellNeo.actions["chargingIcon"].lastTime > shootSpeed) {
                    let dx = bulletHellNeo.px - b.x;
                    let dy = bulletHellNeo.py - b.y;
                    let baseAngle = Math.atan2(dy, dx);
                    let speed = bulletHellNeo.actions["chargingIcon"].bulletSpeed || 8
                    for (let i = 0; i < bulletHellNeo.actions["chargingIcon"].burstBullets; i++) {
                        let spread = (i - (bulletHellNeo.actions["chargingIcon"].burstBullets - 1) / 2) * bulletHellNeo.actions["chargingIcon"].burstViolence;
                        let angle = baseAngle + spread + (Math.random() - 0.5) * 0.18;
                        let vx = Math.cos(angle) * speed * (0.9 + Math.random() * 0.3);
                        let vy = Math.sin(angle) * speed * (0.9 + Math.random() * 0.3);
                        bulletHellNeo.bullets.push({x: b.x + bulletHellNeo.boxLeft, y: b.y + bulletHellNeo.boxTop, r: 12, vx, vy, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}});
                    }
                    // Randomize next burst
                    bulletHellNeo.actions["chargingIcon"].burstViolence = 0.25 + Math.random() * 0.5;

                    bulletHellNeo.actions["chargingIcon"].lastTime = Date.now();
                }
            }
        }
    },
}

BHB.bouncingIcon = {
    //bulletHell({"bouncingIcon": {locX: 600, locY: 250, radius: 64, fillColor: "#0091DC", strokeColor: "#094394", symbol: "⧖", enemySpeed: 6, shootInterval: 400}}, {duration: 12})
    codeFunc() {
        let curX = bulletHellNeo.width / 2 + bulletHellNeo.boxLeft
        let curY = bulletHellNeo.height / 2 + bulletHellNeo.boxTop
        if (bulletHellNeo.actions["bouncingIcon"].locX) curX = bulletHellNeo.actions["bouncingIcon"].locX
        if (bulletHellNeo.actions["bouncingIcon"].locY) curY = bulletHellNeo.actions["bouncingIcon"].locY
        // Random velocity
        let theta = Math.random() * 2 * Math.PI;
        let vx = Math.cos(theta) * bulletHellNeo.actions["bouncingIcon"].enemySpeed;
        let vy = Math.sin(theta) * bulletHellNeo.actions["bouncingIcon"].enemySpeed;
        bulletHellNeo.bullets.push({
            name: "symbol",
            boxRender: true,
            symbol: bulletHellNeo.actions["bouncingIcon"].symbol,
            fill: bulletHellNeo.actions["bouncingIcon"].fillColor,
            stroke: bulletHellNeo.actions["bouncingIcon"].strokeColor,
            x: curX,
            y: curY,
            r: bulletHellNeo.actions["bouncingIcon"].radius,
            vx: vx,
            vy: vy,
            bouncy: true,
            shootInterval: bulletHellNeo.actions["bouncingIcon"].shootInterval,
            lastShotTime: 0,
            draw(b, bossCtx) {
                // Draw big symbol (⊘)
                bossCtx.save();
                bossCtx.translate(b.x, b.y);
                bossCtx.font = 'bold ' + b.r*2 + 'px serif';
                bossCtx.textAlign = 'center';
                bossCtx.textBaseline = 'middle';
                bossCtx.globalAlpha = 0.92;
                if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                if (!options.performanceMode) bossCtx.shadowBlur = 32;
                bossCtx.fillStyle = b.fill;
                bossCtx.fillText(b.symbol, 0, 0);
                bossCtx.globalAlpha = 1;
                if (!options.performanceMode) bossCtx.shadowBlur = 0;
                bossCtx.lineWidth = 6;
                bossCtx.strokeStyle = b.stroke;
                bossCtx.strokeText(b.symbol, 0, 0);
                bossCtx.restore();
            },
        })
    },
    moveFunc() {
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "symbol") {
                // Shoot at player
                if (!b.lastShotTime) b.lastShotTime = Date.now();
                if (Date.now() - b.lastShotTime > b.shootInterval) {
                    bulletHellNeo.shootAtPlayer(b.x + bulletHellNeo.boxLeft, b.y + bulletHellNeo.boxTop, "bouncingIcon");
                    b.lastShotTime = Date.now();
                }
            }
        }
    },
}

BHB.chargingBee = {
    //bulletHell({"chargingBee": {beeAmount: 5, radius: 20, enemySpeed: 5, lastTick: false}}, {width: 300, height: 300, duration: 10})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["chargingBee"].beeAmount; i++) {
            bulletHellNeo.bullets.push({
                name: "chargeBee",
                boxRender: true,
                offScreen: true, // Bullets can be off screen
                angle: 0,
                x: Math.random() * bulletHellNeo.width,
                y: -50,
                r: bulletHellNeo.actions["chargingBee"].radius,
                vx: 0,
                vy: 0,
                pulsingRed: false,
                lungeTimer: 0,
                lungeCooldown: 0,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.strokeStyle = "#000";
                    bossCtx.lineWidth = b.r/10;
                    if (!options.performanceMode) bossCtx.shadowColor = b.pulsingRed ? '#e22' : "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 2;
                    // Wings
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, -b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, b.r/2, -b.r, 0, b.r/4)
                    bossCtx.arcTo(-b.r, 0, -b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.arcTo(0, 0, b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, b.r/2, b.r, 0, b.r/4)
                    bossCtx.arcTo(b.r, 0, b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = b.pulsingRed ? '#e22' : "#aaf";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Butt
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/4, b.r/4, b.r/4)
                    bossCtx.arcTo(b.r/4, b.r/4, b.r/2, (b.r*3)/4, b.r/4)
                    bossCtx.arcTo(b.r/2, (b.r*3)/4, 0, b.r+(b.r/2), b.r/3)
                    bossCtx.arcTo(0, b.r+(b.r/2), -b.r/2, (b.r*3)/4, b.r/3)
                    bossCtx.arcTo(-b.r/2, (b.r*3)/4, -b.r/4, b.r/4, b.r/3)
                    bossCtx.arcTo(-b.r/4, b.r/4, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Stripes
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(-b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(-b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(b.r/2-1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/3-1, b.r, 0, b.r)
                    bossCtx.moveTo(-b.r/2+1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/3+1, b.r, 0, b.r)
                    bossCtx.stroke()

                    // Head
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, -b.r, b.r/3)
                    bossCtx.arcTo(0, -b.r, -b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/3)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Antenna
                    bossCtx.beginPath()
                    bossCtx.moveTo(-b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/8, -(b.r+(b.r/4)), (-b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/8, -(b.r+(b.r/4)), (b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()

                    bossCtx.resetTransform()
                },
            })
        }
    },
    moveFunc() {
        let dt = Date.now() - (bulletHellNeo.actions["chargingBee"].lastTick || Date.now());
        bulletHellNeo.actions["chargingBee"].lastTick = Date.now();
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "chargeBee") {
                // Lunge logic
                if (!b.pulsingRed && b.lungeCooldown <= 0) {
                    b.lungeTimer = 750;
                    let dx = bulletHellNeo.px - b.x - 50 + (Math.random()*100);
                    let dy = bulletHellNeo.py - b.y - 50 + (Math.random()*100);
                    let dist = Math.hypot(dx, dy);
                    b.vx = (dx / dist) * bulletHellNeo.actions["chargingBee"].enemySpeed;
                    b.vy = (dy / dist) * bulletHellNeo.actions["chargingBee"].enemySpeed;
                    b.angle = Math.atan2(dy, dx) + Math.PI/2
                    b.pulsingRed = true;
                } else if (!b.pulsingRed) {
                    b.lungeCooldown -= dt;
                }
                if (b.pulsingRed) {
                    b.lungeTimer -= dt;
                    if (b.lungeTimer <= 0) {
                        b.vx = 0;
                        b.vy = 0;
                        b.pulsingRed = false;
                        b.lungeCooldown = 1200 + (Math.random() * 800);
                    }
                }
            }
        }
    },
}

BHB.shootBee = {
    //bulletHell({"shootBee": {beesPerSec: 2, radius: 20, enemySpeed: 5}}, {width: 400, height: 400, duration: 10})
    moveFunc() {
        // Spawn knives
        if (!bulletHellNeo.actions["shootBee"].lastTime) bulletHellNeo.actions["shootBee"].lastTime = Date.now();
        const beesToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["shootBee"].lastTime) / 1000) * bulletHellNeo.actions["shootBee"].beesPerSec);
        for (let i = 0; i < beesToSpawn; i++) {
            // Pick a random edge and a random point on that edge
            const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
            let bx, by, angle;
            if (edge === 0) { // top
                bx = Math.random() * bulletHellNeo.width;
                by = -bulletHellNeo.actions["shootBee"].radius;
            } else if (edge === 1) { // right
                bx = bulletHellNeo.width + bulletHellNeo.actions["shootBee"].radius;
                by = Math.random() * bulletHellNeo.height;
            } else if (edge === 2) { // bottom
                bx = Math.random() * bulletHellNeo.width;
                by = bulletHellNeo.height + bulletHellNeo.actions["shootBee"].radius;
            } else { // left
                bx = -bulletHellNeo.actions["shootBee"].radius;
                by = Math.random() * bulletHellNeo.height;
            }
            // Angle toward player
            let dx = bulletHellNeo.px - bx;
            let dy = bulletHellNeo.py - by;
            if (bulletHellNeo.subArena && options.bhKeyboard) {
                dx += bulletHellNeo.subx
                dy += bulletHellNeo.suby
            }
            angle = Math.atan2(dy, dx);
            // Store initial spawn for path line
            bulletHellNeo.bullets.push({
                name: "Bee",
                boxRender: true, // RENDER IN BOX
                x: bx,
                y: by,
                angle: angle + Math.PI/2,
                r: bulletHellNeo.actions["shootBee"].radius,
                vx: Math.cos(angle) * bulletHellNeo.actions["shootBee"].enemySpeed,
                vy: Math.sin(angle) * bulletHellNeo.actions["shootBee"].enemySpeed,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.strokeStyle = "#000";
                    bossCtx.lineWidth = b.r/10;
                    if (!options.performanceMode) bossCtx.shadowColor = "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 2;
                    // Wings
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, -b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, b.r/2, -b.r, 0, b.r/4)
                    bossCtx.arcTo(-b.r, 0, -b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.arcTo(0, 0, b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, b.r/2, b.r, 0, b.r/4)
                    bossCtx.arcTo(b.r, 0, b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#aaf";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Butt
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/4, b.r/4, b.r/4)
                    bossCtx.arcTo(b.r/4, b.r/4, b.r/2, (b.r*3)/4, b.r/4)
                    bossCtx.arcTo(b.r/2, (b.r*3)/4, 0, b.r+(b.r/2), b.r/3)
                    bossCtx.arcTo(0, b.r+(b.r/2), -b.r/2, (b.r*3)/4, b.r/3)
                    bossCtx.arcTo(-b.r/2, (b.r*3)/4, -b.r/4, b.r/4, b.r/3)
                    bossCtx.arcTo(-b.r/4, b.r/4, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Stripes
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(-b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(-b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(b.r/2-1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/3-1, b.r, 0, b.r)
                    bossCtx.moveTo(-b.r/2+1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/3+1, b.r, 0, b.r)
                    bossCtx.stroke()

                    // Head
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, -b.r, b.r/3)
                    bossCtx.arcTo(0, -b.r, -b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/3)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Antenna
                    bossCtx.beginPath()
                    bossCtx.moveTo(-b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/8, -(b.r+(b.r/4)), (-b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/8, -(b.r+(b.r/4)), (b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()

                    bossCtx.resetTransform()
                }
            })
        }
        if (beesToSpawn > 0) bulletHellNeo.actions["shootBee"].lastTime = Date.now();
    },
}

BHB.bouncingBees = {
    //bulletHell({"bouncingBees": {beeAmount: 10, radius: 20, enemySpeed: 3, chargeMult: 1.5, lastTick: false}}, {duration: 10})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["bouncingBees"].beeAmount; i++) {
            // Random position, not too close to player
            let angle = Math.random() * 2 * Math.PI;
            let dist = Math.random() * (bulletHellNeo.width / 2 - bulletHellNeo.actions["bouncingBees"].radius - bulletHellNeo.pr) + bulletHellNeo.actions["bouncingBees"].radius + bulletHellNeo.pr + 10;
            let bx = bulletHellNeo.width / 2 + Math.cos(angle) * dist + bulletHellNeo.boxLeft;
            let by = bulletHellNeo.height / 2 + Math.sin(angle) * dist + bulletHellNeo.boxTop;
            // Random velocity
            let theta = Math.random() * 2 * Math.PI;
            let vx = Math.cos(theta) * bulletHellNeo.actions["bouncingBees"].enemySpeed;
            let vy = Math.sin(theta) * bulletHellNeo.actions["bouncingBees"].enemySpeed;
            bulletHellNeo.bullets.push({
                name: "bounceBee",
                x: bx,
                y: by,
                vx: vx,
                vy: vy,
                angle: theta,
                r: bulletHellNeo.actions["bouncingBees"].radius,
                bouncy: true,
                pulsingRed: false,
                lungeTimer: 0,
                lungeCooldown: 1000,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle + Math.PI/2);
                    bossCtx.strokeStyle = "#000";
                    bossCtx.lineWidth = b.r/10;
                    if (!options.performanceMode) bossCtx.shadowColor = b.pulsingRed ? '#e22' : "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 2;
                    // Wings
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, -b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, b.r/2, -b.r, 0, b.r/4)
                    bossCtx.arcTo(-b.r, 0, -b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.arcTo(0, 0, b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, b.r/2, b.r, 0, b.r/4)
                    bossCtx.arcTo(b.r, 0, b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = b.pulsingRed ? '#e22' : "#aaf";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Butt
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/4, b.r/4, b.r/4)
                    bossCtx.arcTo(b.r/4, b.r/4, b.r/2, (b.r*3)/4, b.r/4)
                    bossCtx.arcTo(b.r/2, (b.r*3)/4, 0, b.r+(b.r/2), b.r/3)
                    bossCtx.arcTo(0, b.r+(b.r/2), -b.r/2, (b.r*3)/4, b.r/3)
                    bossCtx.arcTo(-b.r/2, (b.r*3)/4, -b.r/4, b.r/4, b.r/3)
                    bossCtx.arcTo(-b.r/4, b.r/4, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Stripes
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(-b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(-b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(b.r/2-1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/3-1, b.r, 0, b.r)
                    bossCtx.moveTo(-b.r/2+1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/3+1, b.r, 0, b.r)
                    bossCtx.stroke()

                    // Head
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, -b.r, b.r/3)
                    bossCtx.arcTo(0, -b.r, -b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/3)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Antenna
                    bossCtx.beginPath()
                    bossCtx.moveTo(-b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/8, -(b.r+(b.r/4)), (-b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/8, -(b.r+(b.r/4)), (b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()

                    bossCtx.resetTransform()
                },
            });
        }
    },
    moveFunc() {
        let dt = Date.now() - (bulletHellNeo.actions["bouncingBees"].lastTick || Date.now());
        bulletHellNeo.actions["bouncingBees"].lastTick = Date.now();
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "bounceBee") {
                // Lunge logic
                if (!b.pulsingRed && b.lungeCooldown <= 0) {
                    b.lungeTimer = 1000;
                    b.vx = b.vx * bulletHellNeo.actions["bouncingBees"].chargeMult;
                    b.vy = b.vy * bulletHellNeo.actions["bouncingBees"].chargeMult;
                    b.pulsingRed = true;
                } else if (!b.pulsingRed) {
                    b.lungeCooldown -= dt;
                }
                if (b.pulsingRed) {
                    b.lungeTimer -= dt;
                    if (b.lungeTimer <= 0) {
                        b.vx = b.vx / bulletHellNeo.actions["bouncingBees"].chargeMult;
                        b.vy = b.vy / bulletHellNeo.actions["bouncingBees"].chargeMult;
                        b.pulsingRed = false;
                        b.lungeCooldown = 1200 + (Math.random() * 800);
                    }
                }
            }
        }
    }
}

BHB.waveBees = {
    //bulletHell({"waveBees": {beeRate: 5, radius: 20, gapStart: 0, gap: 200, enemySpeed: 6, waveSpeed: 4}}, {duration: 10})
    moveFunc() {
        // Spawn bees
        let speedMod = 1.3 - (Math.abs(bulletHellNeo.actions["waveBees"].gapStart - ((bulletHellNeo.height-bulletHellNeo.actions["waveBees"].gap)/2))/((bulletHellNeo.height-bulletHellNeo.actions["waveBees"].gap)/2))
        bulletHellNeo.actions["waveBees"].gapStart = bulletHellNeo.actions["waveBees"].gapStart + (bulletHellNeo.actions["waveBees"].waveSpeed*speedMod)
        if (bulletHellNeo.actions["waveBees"].gapStart > bulletHellNeo.height-bulletHellNeo.actions["waveBees"].gap) {
            bulletHellNeo.actions["waveBees"].gapStart = bulletHellNeo.height-bulletHellNeo.actions["waveBees"].gap
            bulletHellNeo.actions["waveBees"].waveSpeed = bulletHellNeo.actions["waveBees"].waveSpeed * -1
        }
        if (bulletHellNeo.actions["waveBees"].gapStart < 0) {
            bulletHellNeo.actions["waveBees"].gapStart = 0
            bulletHellNeo.actions["waveBees"].waveSpeed = bulletHellNeo.actions["waveBees"].waveSpeed * -1
        }
        if (!bulletHellNeo.actions["waveBees"].lastTime) bulletHellNeo.actions["waveBees"].lastTime = Date.now();
        const beesToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["waveBees"].lastTime) / 1000) * bulletHellNeo.actions["waveBees"].beeRate)*2;
        for (let i = 0; i < beesToSpawn; i++) {
            bulletHellNeo.bullets.push({
                name: "Bee",
                boxRender: true, // RENDER IN BOX
                x: -bulletHellNeo.actions["waveBees"].radius,
                y: i%2 ? bulletHellNeo.actions["waveBees"].gapStart+bulletHellNeo.actions["waveBees"].gap : bulletHellNeo.actions["waveBees"].gapStart,
                angle: Math.PI/2,
                r: bulletHellNeo.actions["waveBees"].radius,
                vx: bulletHellNeo.actions["waveBees"].enemySpeed,
                vy: 0,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.strokeStyle = "#000";
                    bossCtx.lineWidth = b.r/10;
                    if (!options.performanceMode) bossCtx.shadowColor = "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 2;
                    // Wings
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, -b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, b.r/2, -b.r, 0, b.r/4)
                    bossCtx.arcTo(-b.r, 0, -b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.arcTo(0, 0, b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, b.r/2, b.r, 0, b.r/4)
                    bossCtx.arcTo(b.r, 0, b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#aaf";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Butt
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/4, b.r/4, b.r/4)
                    bossCtx.arcTo(b.r/4, b.r/4, b.r/2, (b.r*3)/4, b.r/4)
                    bossCtx.arcTo(b.r/2, (b.r*3)/4, 0, b.r+(b.r/2), b.r/3)
                    bossCtx.arcTo(0, b.r+(b.r/2), -b.r/2, (b.r*3)/4, b.r/3)
                    bossCtx.arcTo(-b.r/2, (b.r*3)/4, -b.r/4, b.r/4, b.r/3)
                    bossCtx.arcTo(-b.r/4, b.r/4, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Stripes
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(-b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(-b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(b.r/2-1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/3-1, b.r, 0, b.r)
                    bossCtx.moveTo(-b.r/2+1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/3+1, b.r, 0, b.r)
                    bossCtx.stroke()

                    // Head
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, -b.r, b.r/3)
                    bossCtx.arcTo(0, -b.r, -b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/3)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#E9AB17";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Antenna
                    bossCtx.beginPath()
                    bossCtx.moveTo(-b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/8, -(b.r+(b.r/4)), (-b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/8, -(b.r+(b.r/4)), (b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()

                    bossCtx.resetTransform()
                }
            })
        }
        if (beesToSpawn > 0) bulletHellNeo.actions["waveBees"].lastTime = Date.now();
    }
}

// A wave of bees on the top and bottom of the screen, requiring you to move up and down

BHB.firingBees = {
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["firingBees"].beeAmount; i++) {
            let angleOffset = (2 * Math.PI * i) / bulletHellNeo.actions["firingBees"].beeAmount;
            // Position
            let bx = bulletHellNeo.boxLeft + bulletHellNeo.px + 200 * Math.cos(angleOffset)
            let by = bulletHellNeo.boxTop + bulletHellNeo.py + 200 * Math.sin(angleOffset)

            // Angle toward player
            let dx = bulletHellNeo.boxLeft + bulletHellNeo.px - bx;
            let dy = bulletHellNeo.boxTop + bulletHellNeo.py - by;
            if (bulletHellNeo.subArena && options.bhKeyboard) {
                dx += bulletHellNeo.subx
                dy += bulletHellNeo.suby
            }
            bulletHellNeo.bullets.push({
                name: "firingBee",
                x: bx,
                y: by,
                vx: 0,
                vy: 0,
                angle: Math.atan2(dy, dx) + Math.PI/2,
                r: bulletHellNeo.actions["firingBees"].radius,
                orbitRadius: 200,
                orbitAngle: angleOffset,
                orbitSpeed: 0.015 + 0.003 * i, // slightly different speeds
                shootInterval: (500 + Math.floor(Math.random() * 600) + i * 150) / (bulletHellNeo.actions["firingBees"].intervalDiv || 1), // each bee has a different interval
                lastShotTime: 0,
                draw(b, bossCtx) {
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.strokeStyle = "#000";
                    bossCtx.lineWidth = b.r/10;
                    if (!options.performanceMode) bossCtx.shadowColor = "#fff";
                    if (!options.performanceMode) bossCtx.shadowBlur = 2;
                    // Wings
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, -b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, b.r/2, -b.r, 0, b.r/4)
                    bossCtx.arcTo(-b.r, 0, -b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.arcTo(0, 0, b.r/2, b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, b.r/2, b.r, 0, b.r/4)
                    bossCtx.arcTo(b.r, 0, b.r/2, -b.r/2, b.r/4)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#aaf";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Butt
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/4, b.r/4, b.r/4)
                    bossCtx.arcTo(b.r/4, b.r/4, b.r/2, (b.r*3)/4, b.r/4)
                    bossCtx.arcTo(b.r/2, (b.r*3)/4, 0, b.r+(b.r/2), b.r/3)
                    bossCtx.arcTo(0, b.r+(b.r/2), -b.r/2, (b.r*3)/4, b.r/3)
                    bossCtx.arcTo(-b.r/2, (b.r*3)/4, -b.r/4, b.r/4, b.r/3)
                    bossCtx.arcTo(-b.r/4, b.r/4, 0, 0, b.r/4)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#97804c";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Stripes
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(-b.r/4, b.r/4)
                    bossCtx.quadraticCurveTo(-b.r/4, b.r/2, 0, b.r/2)
                    bossCtx.moveTo(b.r/2-1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/3-1, b.r, 0, b.r)
                    bossCtx.moveTo(-b.r/2+1, (b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/3+1, b.r, 0, b.r)
                    bossCtx.stroke()

                    // Head
                    bossCtx.beginPath()
                    bossCtx.arcTo(0, 0, b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(b.r/2, -b.r/2, 0, -b.r, b.r/3)
                    bossCtx.arcTo(0, -b.r, -b.r/2, -b.r/2, b.r/3)
                    bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/3)
                    bossCtx.closePath()
                    bossCtx.fillStyle = "#97804c";
                    bossCtx.fill();
                    bossCtx.stroke()
                    // Antenna
                    bossCtx.beginPath()
                    bossCtx.moveTo(-b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(-b.r/8, -(b.r+(b.r/4)), (-b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()
                    bossCtx.beginPath()
                    bossCtx.moveTo(b.r/4, -(b.r*3)/4)
                    bossCtx.quadraticCurveTo(b.r/8, -(b.r+(b.r/4)), (b.r*3)/8, -(b.r+(b.r/8)))
                    bossCtx.stroke()

                    bossCtx.resetTransform()
                },
            });
        }
    },
    moveFunc() {
        // Update each bee's orbit and position, and handle shooting
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "firingBee") {
                b.orbitAngle += b.orbitSpeed;
                const playerGlobalX = bulletHellNeo.boxLeft + bulletHellNeo.px;
                const playerGlobalY = bulletHellNeo.boxTop + bulletHellNeo.py;
                const targetBx = playerGlobalX + b.orbitRadius * Math.cos(b.orbitAngle);
                const targetBy = playerGlobalY + b.orbitRadius * Math.sin(b.orbitAngle);
                // Smoothly move boss towards target position (lerp)
                const lerpFactor = 0.05;
                b.x += (targetBx - b.x) * lerpFactor * 60 * bulletHellNeo.delta;
                b.y += (targetBy - b.y) * lerpFactor * 60 * bulletHellNeo.delta;

                // Each bee shoots at its own interval
                const speed = bulletHellNeo.actions["firingBees"].enemySpeed ?? 5
                if (!b.lastShotTime) b.lastShotTime = Date.now();
                if (Date.now() - b.lastShotTime > b.shootInterval) {
                    bulletHellNeo.shootAtPlayer(b.x, b.y, "firingBees", speed, "spike");
                    b.lastShotTime = Date.now();
                }

                // Angle toward player
                let dx = bulletHellNeo.boxLeft + bulletHellNeo.px - b.x;
                let dy = bulletHellNeo.boxTop + bulletHellNeo.py - b.y;
                if (bulletHellNeo.subArena && options.bhKeyboard) {
                    dx += bulletHellNeo.subx
                    dy += bulletHellNeo.suby
                }
                b.angle = (Math.atan2(dy, dx) + Math.PI/2)
            }
        }
    },
}

BHB.singularBee = {
    codeFunc() {
        bulletHellNeo.bullets.push({
            name: "singularBee",
            boxRender: true,
            offScreen: true, // Bullets can be off screen
            angle: Math.PI/2,
            x: -bulletHellNeo.actions["singularBee"].radius,
            y: bulletHellNeo.height / 2,
            r: bulletHellNeo.actions["singularBee"].radius,
            vx: bulletHellNeo.actions["singularBee"].enemySpeed,
            vy: 0,
            shooting: bulletHellNeo.actions["singularBee"].shooting || false,
            lastShotTime: 0,
            draw(b, bossCtx) {
                bossCtx.translate(b.x, b.y);
                bossCtx.rotate(b.angle);
                bossCtx.strokeStyle = "#000";
                bossCtx.lineWidth = b.r/10;
                if (!options.performanceMode) bossCtx.shadowColor = "#fff";
                if (!options.performanceMode) bossCtx.shadowBlur = 2;
                // Wings
                bossCtx.beginPath()
                bossCtx.arcTo(0, 0, -b.r/2, b.r/2, b.r/4)
                bossCtx.arcTo(-b.r/2, b.r/2, -b.r, 0, b.r/4)
                bossCtx.arcTo(-b.r, 0, -b.r/2, -b.r/2, b.r/4)
                bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/4)
                bossCtx.arcTo(0, 0, b.r/2, b.r/2, b.r/4)
                bossCtx.arcTo(b.r/2, b.r/2, b.r, 0, b.r/4)
                bossCtx.arcTo(b.r, 0, b.r/2, -b.r/2, b.r/4)
                bossCtx.arcTo(b.r/2, -b.r/2, 0, 0, b.r/4)
                bossCtx.closePath()
                bossCtx.fillStyle = "#aaf";
                bossCtx.fill();
                bossCtx.stroke()
                // Butt
                bossCtx.beginPath()
                bossCtx.arcTo(0, 0, b.r/4, b.r/4, b.r/4)
                bossCtx.arcTo(b.r/4, b.r/4, b.r/2, (b.r*3)/4, b.r/4)
                bossCtx.arcTo(b.r/2, (b.r*3)/4, 0, b.r+(b.r/2), b.r/3)
                bossCtx.arcTo(0, b.r+(b.r/2), -b.r/2, (b.r*3)/4, b.r/3)
                bossCtx.arcTo(-b.r/2, (b.r*3)/4, -b.r/4, b.r/4, b.r/3)
                bossCtx.arcTo(-b.r/4, b.r/4, 0, 0, b.r/4)
                bossCtx.closePath()
                bossCtx.fillStyle = "#E9AB17";
                bossCtx.fill();
                bossCtx.stroke()
                // Stripes
                bossCtx.beginPath()
                bossCtx.moveTo(b.r/4, b.r/4)
                bossCtx.quadraticCurveTo(b.r/4, b.r/2, 0, b.r/2)
                bossCtx.moveTo(-b.r/4, b.r/4)
                bossCtx.quadraticCurveTo(-b.r/4, b.r/2, 0, b.r/2)
                bossCtx.moveTo(b.r/2-1, (b.r*3)/4)
                bossCtx.quadraticCurveTo(b.r/3-1, b.r, 0, b.r)
                bossCtx.moveTo(-b.r/2+1, (b.r*3)/4)
                bossCtx.quadraticCurveTo(-b.r/3+1, b.r, 0, b.r)
                bossCtx.stroke()

                // Head
                bossCtx.beginPath()
                bossCtx.arcTo(0, 0, b.r/2, -b.r/2, b.r/3)
                bossCtx.arcTo(b.r/2, -b.r/2, 0, -b.r, b.r/3)
                bossCtx.arcTo(0, -b.r, -b.r/2, -b.r/2, b.r/3)
                bossCtx.arcTo(-b.r/2, -b.r/2, 0, 0, b.r/3)
                bossCtx.closePath()
                bossCtx.fillStyle = "#E9AB17";
                bossCtx.fill();
                bossCtx.stroke()
                // Antenna
                bossCtx.beginPath()
                bossCtx.moveTo(-b.r/4, -(b.r*3)/4)
                bossCtx.quadraticCurveTo(-b.r/8, -(b.r+(b.r/4)), (-b.r*3)/8, -(b.r+(b.r/8)))
                bossCtx.stroke()
                bossCtx.beginPath()
                bossCtx.moveTo(b.r/4, -(b.r*3)/4)
                bossCtx.quadraticCurveTo(b.r/8, -(b.r+(b.r/4)), (b.r*3)/8, -(b.r+(b.r/8)))
                bossCtx.stroke()

                bossCtx.resetTransform()
            },
        })
    },
    moveFunc() {
        // Update each bee's orbit and position, and handle shooting
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "singularBee" && b.shooting) {
                // Bee shoots on an interval
                const speed = bulletHellNeo.actions["singularBee"].bulletSpeed ?? 5
                const interval = bulletHellNeo.actions["singularBee"].interval ?? 1000
                if (!b.lastShotTime) b.lastShotTime = Date.now();
                if (Date.now() - b.lastShotTime > 1000) {
                    bulletHellNeo.shootAtPlayer(b.x + bulletHellNeo.boxLeft + (b.r*0.9), b.y + bulletHellNeo.boxTop, "singularBee", speed, "spike");
                    b.lastShotTime = Date.now();
                }
            }
        }
    },
}


//ZAR

BHB.diceAttack = {
    //bulletHell({"diceAttack": {diceAmount: 2, intervalDiv: 1}}, {duration: 10})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["diceAttack"].diceAmount; i++) {
            let angleOffset = (2 * Math.PI * i) / bulletHellNeo.actions["diceAttack"].diceAmount;
            bulletHellNeo.bullets.push({
                name: "dice",
                x: bulletHellNeo.boxLeft + bulletHellNeo.px + 200 * Math.cos(angleOffset),
                y: bulletHellNeo.boxTop + bulletHellNeo.py + 200 * Math.sin(angleOffset),
                vx: 0,
                vy: 0,
                r: 20,
                orbitRadius: 200,
                orbitAngle: angleOffset,
                orbitSpeed: 0.005, // same speed
                shootInterval: (500 + Math.floor(Math.random() * 600) + i * 150) / (bulletHellNeo.actions["diceAttack"].intervalDiv || 1), // each dice has a different interval
                lastShotTime: 0,
                draw(b, bossCtx) {
                    const size = b.r * 2;
                    const cornerRadius = b.r * 0.2; // Adjust for roundness

                    bossCtx.translate(b.x, b.y);
                    // bossCtx.rotate(Math.PI / 2); // Optional: remove if you don't want it spinning 90deg

                    // 1. Draw the Die Body (Rounded Square)
                    bossCtx.beginPath();
                    bossCtx.roundRect(-b.r, -b.r, size, size, cornerRadius); 
                    bossCtx.fillStyle = "#fff";
    
                    if (!options.performanceMode) {
                        bossCtx.shadowColor = "#fff";
                        bossCtx.shadowBlur = 16;
                    }
                    bossCtx.fill();

                    // 2. Draw the Pips (Dots)
                    // Turning off shadow for the dots so they look like holes
                    bossCtx.shadowBlur = 0;
                    bossCtx.fillStyle = "#000"; // Black dots
    
                    const pipRadius = b.r * 0.2;
    
                    // Example: Drawing a "1" (Center Dot)
                    const offset = b.r * 0.5;
                    [[-offset, -offset], [offset, -offset], [-offset, offset], [offset, offset]].forEach(p => {
                        bossCtx.beginPath();
                        bossCtx.arc(p[0], p[1], pipRadius, 0, Math.PI * 2);
                        bossCtx.fill();
                    })
                    bossCtx.resetTransform();
                }
            });
        }
    },
    moveFunc() {
        // Update each dice's orbit and position, and handle shooting
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "dice") {
                b.orbitAngle += b.orbitSpeed;
                const playerGlobalX = bulletHellNeo.boxLeft + bulletHellNeo.px;
                const playerGlobalY = bulletHellNeo.boxTop + bulletHellNeo.py;
                const targetBx = playerGlobalX + b.orbitRadius * Math.cos(b.orbitAngle);
                const targetBy = playerGlobalY + b.orbitRadius * Math.sin(b.orbitAngle);
                // Smoothly move boss towards target position (lerp)
                const lerpFactor = 0.05;
                b.x += (targetBx - b.x) * lerpFactor;
                b.y += (targetBy - b.y) * lerpFactor;

                // Each dice shoots at its own interval
                if (!b.lastShotTime) b.lastShotTime = Date.now();
                if (Date.now() - b.lastShotTime > b.shootInterval) {
                    bulletHellNeo.shootAtPlayer(b.x, b.y, "diceAttack", 2);
                    b.lastShotTime = Date.now();
                }
            }
        }
    },
}
BHB.bouncingDice = {
    //bulletHell({"bouncingDice": {diceCount: 6, enemySpeed: 2}}, {duration: 15})
    codeFunc() {
        const br = 25;
        for (let i = 0; i < bulletHellNeo.actions["bouncingDice"].diceCount; i++) {
            // Random position, not too close to player
            let angle = Math.random() * 2 * Math.PI;
            let dist = Math.random() * (bulletHellNeo.width / 2 - br - bulletHellNeo.pr) + br + bulletHellNeo.pr + 10;
            let bx = bulletHellNeo.width / 2 + Math.cos(angle) * dist + bulletHellNeo.boxLeft;
            let by = bulletHellNeo.height / 2 + Math.sin(angle) * dist + bulletHellNeo.boxTop;
            // Random velocity
            let theta = Math.random() * 2 * Math.PI;
            let vx = Math.cos(theta) * bulletHellNeo.actions["bouncingDice"].enemySpeed;
            let vy = Math.sin(theta) * bulletHellNeo.actions["bouncingDice"].enemySpeed;
            bulletHellNeo.bullets.push({
                name: "dice",
                x: bx,
                y: by,
                vx: vx,
                vy: vy,
                r: br,
                bouncy: true,
                shootInterval: (500 + Math.floor(Math.random() * 600) + i * 100) / (bulletHellNeo.actions["bouncingDice"].intervalDiv || 1), // each dice has a different interval
                lastShotTime: 0,
                draw(b, bossCtx) {
                    const size = b.r * 2;
                    const cornerRadius = b.r * 0.2; // Adjust for roundness

                    bossCtx.translate(b.x, b.y);
                    // bossCtx.rotate(Math.PI / 2); // Optional: remove if you don't want it spinning 90deg

                    // 1. Draw the Die Body (Rounded Square)
                    bossCtx.beginPath();
                    bossCtx.roundRect(-b.r, -b.r, size, size, cornerRadius); 
                    bossCtx.fillStyle = "#fff";
    
                    if (!options.performanceMode) {
                        bossCtx.shadowColor = "#fff";
                        bossCtx.shadowBlur = 16;
                    }
                    bossCtx.fill();

                    // 2. Draw the Pips (Dots)
                    // Turning off shadow for the dots so they look like holes
                    bossCtx.shadowBlur = 0;
                    bossCtx.fillStyle = "#000"; // Black dots
    
                    const pipRadius = b.r * 0.2;
    
                    // Example: Drawing a "1" (Center Dot)
                    const offset = b.r*0.5;
                    [[-offset, -offset], [-offset, offset], [offset, offset], [offset, -offset]].forEach(p => {
                        bossCtx.beginPath();
                        bossCtx.arc(p[0], p[1], pipRadius, 0, Math.PI * 2);
                        bossCtx.fill();
                    })
                    bossCtx.resetTransform();
                }
            });
        }
    },
    moveFunc() {
        for (let b of bulletHellNeo.bullets) {
            // Each dice shoots at its own interval
            if (!b.lastShotTime) b.lastShotTime = Date.now();
            if (Date.now() - b.lastShotTime > b.shootInterval) {
                bulletHellNeo.shootAtPlayer(b.x, b.y, "bouncingDice", 3);
                b.lastShotTime = Date.now();
            }
        }
    }
}


BHB.diceAttackNoOrbit = {
    //bulletHell({"diceAttackNoOrbit": {diceAmount: 3, intervalDiv: 0.75}}, {duration: 10})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["diceAttackNoOrbit"].diceAmount; i++) {
            let angleOffset = (2 * Math.PI * i) / bulletHellNeo.actions["diceAttackNoOrbit"].diceAmount;
            bulletHellNeo.bullets.push({
                name: "dice",
                x: bulletHellNeo.boxLeft + bulletHellNeo.px + 200 * Math.cos(angleOffset),
                y: bulletHellNeo.boxTop + bulletHellNeo.py + 200 * Math.sin(angleOffset),
                vx: 0,
                vy: 0,
                r: 20,
                orbitRadius: 200,
                orbitAngle: angleOffset,
                orbitSpeed: 0, // same speed
                shootInterval: (500 + Math.floor(Math.random() * 600) + i * 150) / (bulletHellNeo.actions["diceAttackNoOrbit"].intervalDiv || 1), // each dice has a different interval
                lastShotTime: 0,
                draw(b, bossCtx) {
                    const size = b.r * 2;
                    const cornerRadius = b.r * 0.2; // Adjust for roundness

                    bossCtx.translate(b.x, b.y);
                    // bossCtx.rotate(Math.PI / 2); // Optional: remove if you don't want it spinning 90deg

                    // 1. Draw the Die Body (Rounded Square)
                    bossCtx.beginPath();
                    bossCtx.roundRect(-b.r, -b.r, size, size, cornerRadius); 
                    bossCtx.fillStyle = "#fff";
    
                    if (!options.performanceMode) {
                        bossCtx.shadowColor = "#fff";
                        bossCtx.shadowBlur = 16;
                    }
                    bossCtx.fill();

                    // 2. Draw the Pips (Dots)
                    // Turning off shadow for the dots so they look like holes
                    bossCtx.shadowBlur = 0;
                    bossCtx.fillStyle = "#000"; // Black dots
    
                    const pipRadius = b.r * 0.2;
    
                    // Example: Drawing a "1" (Center Dot)
                    const offset = 0;
                    [[offset, -offset]].forEach(p => {
                        bossCtx.beginPath();
                        bossCtx.arc(p[0], p[1], pipRadius, 0, Math.PI * 2);
                        bossCtx.fill();
                    })
                    bossCtx.resetTransform();
                }
            });
        }
    },
    moveFunc() {
        // Update each dice's orbit and position, and handle shooting
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "dice") {
                b.orbitAngle += b.orbitSpeed;
                const playerGlobalX = bulletHellNeo.boxLeft + bulletHellNeo.px;
                const playerGlobalY = bulletHellNeo.boxTop + bulletHellNeo.py;
                const targetBx = playerGlobalX + b.orbitRadius * Math.cos(b.orbitAngle);
                const targetBy = playerGlobalY + b.orbitRadius * Math.sin(b.orbitAngle);
                // Smoothly move boss towards target position (lerp)
                const lerpFactor = 0.05;
                b.x += (targetBx - b.x) * lerpFactor;
                b.y += (targetBy - b.y) * lerpFactor;

                // Each dice shoots at its own interval
                if (!b.lastShotTime) b.lastShotTime = Date.now();
                if (Date.now() - b.lastShotTime > b.shootInterval) {
                    bulletHellNeo.shootAtPlayer(b.x, b.y, "diceAttackNoOrbit", 4);
                    b.lastShotTime = Date.now();
                }
            }
        }
    },
}
BHB.pipRain = {
    //bulletHell({"pipRain": {bulletPerSec: 7}}, {duration: 12})
    moveFunc(id = "pipRain") {
        // Rain Bullets
        const bulletRadius = bulletHellNeo.actions[id].bulletRadius ?? 12;
        const bulletSpeed = bulletHellNeo.actions[id].bulletSpeed ?? 4;
        if (!bulletHellNeo.actions[id].lastTime) bulletHellNeo.actions[id].lastTime = Date.now();
        const bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions[id].lastTime) / 1000) * bulletHellNeo.actions[id].bulletPerSec); // LAST NUMBER IS AMOUNT OF BULLETS PER SECOND
        for (let i = 0; i < bulletsToSpawn; i++) {
            let bx = Math.random() * bulletHellNeo.width + bulletHellNeo.boxLeft;
            let by = -bulletRadius;
            let bul = {x: bx, y: by, vx: 0, vy: bulletSpeed, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul);
            let bx2 = Math.random() * bulletHellNeo.width + bulletHellNeo.boxLeft;
            let by2 = window.innerHeight + bulletRadius;
            let bul2 = {x: bx2, y: by2, vx: 0, vy: -bulletSpeed, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#000000";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul2);
        }
        if (bulletsToSpawn > 0) bulletHellNeo.actions[id].lastTime = Date.now(); // Rain Bullets
    },
}
BHB.pipRainHorizontal = {
    //bulletHell({"pipRainHorizontal": {bulletPerSec: 7}}, {duration: 12})
    moveFunc(id = "pipRainHorizontal") {
        // Rain Bullets
        const bulletRadius = bulletHellNeo.actions[id].bulletRadius ?? 12;
        const bulletSpeed = bulletHellNeo.actions[id].bulletSpeed ?? 4;
        if (!bulletHellNeo.actions[id].lastTime) bulletHellNeo.actions[id].lastTime = Date.now();
        const bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions[id].lastTime) / 1000) * bulletHellNeo.actions[id].bulletPerSec); // LAST NUMBER IS AMOUNT OF BULLETS PER SECOND
        for (let i = 0; i < bulletsToSpawn; i++) {
            let bx = window.innerWidth + bulletRadius;
            let by = Math.random() * bulletHellNeo.height + bulletHellNeo.boxTop
            let bul = {x: bx, y: by, vx: -bulletSpeed, vy: 0, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul);
            let bx2 = 0;
            let by2 = Math.random() * bulletHellNeo.height + bulletHellNeo.boxTop;
            let bul2 = {x: bx2, y: by2, vx: bulletSpeed, vy: 0, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#000000";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul2);
        }
        if (bulletsToSpawn > 0) bulletHellNeo.actions[id].lastTime = Date.now(); // Rain Bullets
    },
}
BHB.pipRainUltimate = {
    //bulletHell({"pipRainUltimate": {bulletPerSec: 3}}, {duration: 12})
    moveFunc() {
        // Rain Bullets
        const bulletRadius = bulletHellNeo.actions["pipRainUltimate"].bulletRadius ?? 12;
        const bulletSpeed = bulletHellNeo.actions["pipRainUltimate"].bulletSpeed ?? 4;
        if (!bulletHellNeo.actions["pipRainUltimate"].lastTime) bulletHellNeo.actions["pipRainUltimate"].lastTime = Date.now();
        const bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["pipRainUltimate"].lastTime) / 1000) * bulletHellNeo.actions["pipRainUltimate"].bulletPerSec); // LAST NUMBER IS AMOUNT OF BULLETS PER SECOND
        for (let i = 0; i < bulletsToSpawn; i++) {
            let bx = Math.random() * bulletHellNeo.width + bulletHellNeo.boxLeft;
            let by = -bulletRadius;
            let bul = {x: bx, y: by, vx: 0, vy: bulletSpeed, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul);
            let bx2 = Math.random() * bulletHellNeo.width + bulletHellNeo.boxLeft;
            let by2 = window.innerHeight + bulletRadius;
            let bul2 = {x: bx2, y: by2, vx: 0, vy: -bulletSpeed, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#000000";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul2);
            let bx3 = window.innerWidth + bulletRadius;
            let by3 = Math.random() * bulletHellNeo.height + bulletHellNeo.boxTop
            let bul3 = {x: bx3, y: by3, vx: -bulletSpeed, vy: 0, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#fff";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul3);
            let bx4 = 0;
            let by4 = Math.random() * bulletHellNeo.height + bulletHellNeo.boxTop;
            let bul4 = {x: bx4, y: by4, vx: bulletSpeed, vy: 0, r: bulletRadius, draw(b, bossCtx) {bossCtx.beginPath();bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);bossCtx.fillStyle = "#000000";bossCtx.fill()}}
            bulletHellNeo.bullets.push(bul4);
        }
        if (bulletsToSpawn > 0) bulletHellNeo.actions["pipRainUltimate"].lastTime = Date.now(); // Rain Bullets
    },
}
//bulletHellBlue({"bouncingDice": {diceCount: 4, enemySpeed: 2}}, {width:800, height:600, duration:15, jumpMin:6, jumpMax:150})

BHB.diceSpikes = {
    // bulletHell({"diceSpikes": {spawnPerSec: 6, bulletPerSec: 6, enemySpeed: 4, spikeSize: 28}}, {width: 1200, height: 600, duration: 12, transparent: false})
    // bulletHell({"diceSpikes": {spawnPerSec: 6, bulletPerSec: 6, enemySpeed: 4, bulletSpeed: 2, spikeSize: 28, rain: true}}, {width: 1200, height: 600, duration: 12, transparent: false})
    moveFunc(id = "diceSpikes") {
        const spikeSize = bulletHellNeo.actions[id].spikeSize ?? 28;
        const speed = bulletHellNeo.actions[id].enemySpeed ?? 6;
        const spawnPerSec = bulletHellNeo.actions[id].spawnPerSec ?? 2.2;
        const bulletPerSec = bulletHellNeo.actions[id].bulletPerSec ?? 6;

        if (!bulletHellNeo.actions[id].lastTime) bulletHellNeo.actions[id].lastTime = Date.now();
        const bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions[id].lastTime) / 1000) * spawnPerSec);

        // Allow `rain` to be specified on the action (bulletHellNeo.actions[id].rain)
        if ((bulletHellNeo.actions && bulletHellNeo.actions[id] && bulletHellNeo.actions[id].rain) || bulletHellNeo.rain) {
            // Reuse existing pipRain behavior so toggling `rain` matches pipRain effects.
            if (BHB && BHB.pipRain && typeof BHB.pipRain.moveFunc === 'function') {
                BHB.pipRain.moveFunc(id)
            }
            // Optionally spawn horizontal pip rain if configured
            if (bulletHellNeo.actions && bulletHellNeo.actions[id] && bulletHellNeo.actions[id].horizontalRain && BHB && BHB.pipRainHorizontal && typeof BHB.pipRainHorizontal.moveFunc === 'function') {
                BHB.pipRainHorizontal.moveFunc(id)
            }
        }

        for (let i = 0; i < bulletsToSpawn; i++) {
            // choose side: -1 = left, 1 = right
            const side = Math.random() < 0.5 ? -1 : 1;
            const x = side === -1 ? (bulletHellNeo.boxLeft - spikeSize) : (bulletHellNeo.boxLeft + bulletHellNeo.width + spikeSize);
            const y = Math.random() * bulletHellNeo.height + bulletHellNeo.boxTop;

            // velocity aimed roughly towards player with a small random offset
            const targetX = bulletHellNeo.px + bulletHellNeo.boxLeft ?? (bulletHellNeo.boxLeft + bulletHellNeo.width/2);
            const targetY = bulletHellNeo.py + bulletHellNeo.boxTop ?? (bulletHellNeo.boxTop + bulletHellNeo.height/2);
            const dx = (targetX + (Math.random() - 0.5) * 80) - x;
            const dy = (targetY + (Math.random() - 0.5) * 80) - y;
            const dist = Math.hypot(dx, dy) || 1;
            const vx = (dx / dist) * speed;
            const vy = (dy / dist) * speed;

            // triangular spike that points along velocity
            const color = Math.random() < 0.5 ? '#000' : '#fff';
            const bul = {
                x, y, vx, vy, r: spikeSize, color,
                draw(b, bossCtx) {
                    const angle = Math.atan2(b.vy, b.vx);
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(angle);
                    // triangle
                    bossCtx.beginPath();
                    bossCtx.moveTo(b.r, 0);
                    bossCtx.lineTo(-b.r * 0.6, b.r * 0.7);
                    bossCtx.lineTo(-b.r * 0.6, -b.r * 0.7);
                    bossCtx.closePath();
                    bossCtx.fillStyle = b.color;
                    bossCtx.fill();
                    bossCtx.lineWidth = 2;
                    bossCtx.strokeStyle = (b.color === '#000') ? '#fff' : '#000';
                    bossCtx.stroke();
                    bossCtx.restore();
                }
            };

            bulletHellNeo.bullets.push(bul);
        }

        if (bulletsToSpawn > 0) bulletHellNeo.actions[id].lastTime = Date.now();

        // update existing bullets' positions
        for (let b of bulletHellNeo.bullets) {
            if (b.vx !== undefined) {
                b.x += b.vx * 60 * bulletHellNeo.delta;
                b.y += b.vy * 60 * bulletHellNeo.delta;
            }
        }

        return bulletHellNeo;
    },
}
BHB.diceSpikesPlatformer = {
    // bulletHellBlue({"diceSpikesPlatformer": {bulletPerSec: 1.2, enemySpeed: 3, spikeHeight: 80, spikeWidth: 60}}, {width:800, height:300, duration:15, jumpMin:6, jumpMax:150, gravity: 0.2})
    moveFunc() {
        // Based on pipRainHorizontal: spawn groups of spikes sliding along bottom
        const spikeHeight = bulletHellNeo.actions["diceSpikesPlatformer"].spikeHeight ?? 64;
        const spikeWidth = bulletHellNeo.actions["diceSpikesPlatformer"].spikeWidth ?? 40;
        const bulletSpeed = bulletHellNeo.actions["diceSpikesPlatformer"].enemySpeed ?? 6;
        if (!bulletHellNeo.actions["diceSpikesPlatformer"].lastTime) bulletHellNeo.actions["diceSpikesPlatformer"].lastTime = Date.now();
        let bulletsToSpawn = Math.floor(((Date.now() - bulletHellNeo.actions["diceSpikesPlatformer"].lastTime) / 1000) * (bulletHellNeo.actions["diceSpikesPlatformer"].bulletPerSec ?? 1.2));
        if (!bulletHellNeo.actions["diceSpikesPlatformer"].__diceSpikesInit) { bulletHellNeo.actions["diceSpikesPlatformer"].__diceSpikesInit = true; bulletsToSpawn = Math.max(1, bulletsToSpawn); }

        for (let i = 0; i < bulletsToSpawn; i++) {
            const count = 1 + Math.floor(Math.random() * 4);
            if (!bulletHellNeo.actions["diceSpikesPlatformer"].noSkips && count === 4) continue
            const fromLeft = Math.random() < 0.5;
            let curSpikeHeight = spikeHeight;
            let curSpikeWidth = spikeWidth;
            if (bulletHellNeo.actions["diceSpikesPlatformer"].bigSpikes && count === 1) {
                curSpikeHeight = Math.round(spikeHeight * 1.6);
                curSpikeWidth = Math.round(spikeWidth * 1.5);
            }
            const spacing = curSpikeWidth * 1.15;

            // always place at bottom of the arena (center of spike sits curSpikeHeight/2 above bottom)
            const by = bulletHellNeo.boxTop + bulletHellNeo.height - curSpikeHeight / 2;

            if (fromLeft) {
                // shift group so the rightmost spike is just off-screen, preventing immediate culling
                const bxBase = bulletHellNeo.boxLeft - curSpikeWidth - 8 + (count - 1) * spacing;
                for (let k = 0; k < count; k++) {
                    const bx = bxBase - k * spacing;
                    bulletHellNeo.bullets.push({
                        name: "bigKnife",
                        x: bx,
                        y: by,
                        offScreen: true,
                        r: curSpikeHeight,
                        width: curSpikeWidth,
                        angle: -Math.PI/2,
                        vx: bulletSpeed,
                        vy: 0,
                        draw(b, bossCtx) {
                            bossCtx.save();
                            bossCtx.translate(b.x, b.y);
                            bossCtx.rotate(b.angle);
                            bossCtx.beginPath();
                            bossCtx.moveTo(-b.r / 2, -b.width / 2);
                            bossCtx.lineTo(b.r / 2, 0);
                            bossCtx.lineTo(-b.r / 2, b.width / 2);
                            bossCtx.closePath();

                                    bossCtx.fillStyle = b.color;
                                    if (!options.performanceMode) bossCtx.shadowColor = b.color;
                                    if (!options.performanceMode) bossCtx.shadowBlur = 8;
                                    bossCtx.fill();
                                    bossCtx.lineWidth = 2;
                                    bossCtx.strokeStyle = (b.color === '#000') ? '#fff' : '#000';
                                    bossCtx.stroke();

                            bossCtx.restore();
                        }
                    })
                }
            } else {
                // shift group so the leftmost spike is just off-screen on the right side
                const bxBase = bulletHellNeo.boxLeft + bulletHellNeo.width + curSpikeWidth + 8 - (count - 1) * spacing;
                for (let k = 0; k < count; k++) {
                    const bx = bxBase + k * spacing;
                    bulletHellNeo.bullets.push({
                        name: "bigKnife",
                        x: bx,
                        y: by,
                        offScreen: true,
                        r: curSpikeHeight,
                        width: curSpikeWidth,
                        angle: -Math.PI/2,
                        vx: -bulletSpeed,
                        vy: 0,
                        draw(b, bossCtx) {
                            bossCtx.save();
                            bossCtx.translate(b.x, b.y);
                            bossCtx.rotate(b.angle);
                            bossCtx.beginPath();
                            bossCtx.moveTo(-b.r / 2, -b.width / 2);
                            bossCtx.lineTo(b.r / 2, 0);
                            bossCtx.lineTo(-b.r / 2, b.width / 2);
                            bossCtx.closePath();
                            bossCtx.fillStyle = '#fff';
                            if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                            if (!options.performanceMode) bossCtx.shadowBlur = 8;
                            bossCtx.fill();
                            bossCtx.lineWidth = 2;
                            bossCtx.strokeStyle = '#000';
                            bossCtx.stroke();

                            // no pips for platformer spikes; color handled above
                            bossCtx.restore();
                        }
                    })
                }
            }
        }

        if (bulletsToSpawn > 0) bulletHellNeo.actions["diceSpikesPlatformer"].lastTime = Date.now();
    },
}

BHB.spikePlatformAttack = {
    //bulletHellBlue({"spikePlatformAttack": {spikeHeight: 50, spikeWidth: 28, platformCount: 4, platformSpikeChance: 0.4, platformSpeed: 1.5, platformMinW: 203, platformMaxW: 203}}, {width:800, height:600, duration:15, jumpMin:6, jumpMax:250, gravity: 0.2})
    //bulletHellBlue({"spikePlatformAttack": {spikeHeight: 50, spikeWidth: 28, platformCount: 4, platformSpikeChance: 0.4, platformSpeed: 1.5, platformMinW: 203, platformMaxW: 203, rain: true, bulletPerSec: 10}}, {width:800, height:600, duration:15, jumpMin:6, jumpMax:250, gravity: 0.2})
    codeFunc() {
        // Create spikes filling the entire ground
        const spikeH = bulletHellNeo.actions["spikePlatformAttack"].spikeHeight || 36;
        const spikeW = bulletHellNeo.actions["spikePlatformAttack"].spikeWidth || 28;
        bulletHellNeo.spikes = [];
        for (let x = 0; x < bulletHellNeo.width; x += spikeW) {
            bulletHellNeo.spikes.push({ x: x, y: bulletHellNeo.height - spikeH, w: spikeW, h: spikeH });
        }

        // Create sliding platforms slightly above the spikes
        const pCount = bulletHellNeo.actions["spikePlatformAttack"].platformCount || 4;
        bulletHellNeo.platforms = [];
        // determine vertical slots so only 1 platform can appear at each height
        const minAbove = bulletHellNeo.actions["spikePlatformAttack"].platformMinAbove || 40;
        const maxAbove = bulletHellNeo.actions["spikePlatformAttack"].platformMaxAbove || Math.max(120, Math.min(220, bulletHellNeo.height - spikeH - 60));
        let heights = [];
        if (pCount <= 1) {
            heights = [bulletHellNeo.height - spikeH - Math.floor((minAbove + maxAbove) / 2)];
        } else {
            for (let i = 0; i < pCount; i++) {
                const t = i / (pCount - 1);
                const above = Math.floor(minAbove + t * (maxAbove - minAbove));
                heights.push(bulletHellNeo.height - spikeH - above);
            }
        }
        // shuffle heights so order is not predictable
        for (let i = heights.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [heights[i], heights[j]] = [heights[j], heights[i]];
        }

        const spikeChance = typeof bulletHellNeo.actions["spikePlatformAttack"].platformSpikeChance !== 'undefined' ? bulletHellNeo.actions["spikePlatformAttack"].platformSpikeChance : (bulletHellNeo.actions["spikePlatformAttack"].spikeOnPlatformPercent || 0.25);

        for (let i = 0; i < pCount; i++) {
            const w = Math.floor((bulletHellNeo.actions["spikePlatformAttack"].platformMinW || 80) + Math.random() * (((bulletHellNeo.actions["spikePlatformAttack"].platformMaxW || 160)) - (bulletHellNeo.actions["spikePlatformAttack"].platformMinW || 80)));
            const h = 14;
            const y = heights[i % heights.length];
            // place platform ensuring an extra horizontal gap between platforms
            const extraGap = typeof bulletHellNeo.actions["spikePlatformAttack"].platformExtraGap !== 'undefined' ? bulletHellNeo.actions["spikePlatformAttack"].platformExtraGap : 50;
            let x = Math.random() * (bulletHellNeo.width - w);
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 60) {
                let ok = true;
                for (let q of bulletHellNeo.platforms) {
                    if (!(x + w + extraGap <= q.x || x >= q.x + q.w + extraGap)) { ok = false; break; }
                }
                if (ok) { placed = true; break; }
                x = Math.random() * (bulletHellNeo.width - w);
                attempts++;
            }
            if (!placed) {
                // fallback: scan for first fitting position
                for (let cx = 0; cx <= bulletHellNeo.width - w; cx += 4) {
                    let ok2 = true;
                    for (let q of bulletHellNeo.platforms) {
                        if (!(cx + w + extraGap <= q.x || cx >= q.x + q.w + extraGap)) { ok2 = false; break; }
                    }
                    if (ok2) { x = cx; placed = true; break; }
                }
            }
            // if still not placed, x remains random (may overlap)
            const speed = ((Math.random() < 0.5) ? -1 : 1) * (bulletHellNeo.actions["spikePlatformAttack"].platformSpeed || 2.5) * (0.6 + Math.random() * 1.4);
            const hasSpikes = Math.random() < spikeChance;
            const pSpikeW = Math.max(8, Math.min((bulletHellNeo.actions["spikePlatformAttack"].platformSpikeWidth || Math.floor(spikeW/1.6)), Math.floor(w/3)));
            const pSpikeH = Math.max(6, Math.min((bulletHellNeo.actions["spikePlatformAttack"].platformSpikeHeight || Math.floor(spikeH*0.6)), 24));
            bulletHellNeo.platforms.push({ x: x, y: y, w: w, h: h, vx: speed, color: bulletHellNeo.actions["spikePlatformAttack"].platformColor || '#9aa', hasSpikes: hasSpikes, spikeW: pSpikeW, spikeH: pSpikeH });
        }

        // timing for spike damage
        bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime = bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime || 0;
    },
    moveFunc() {
        // Update platforms positions
        if (bulletHellNeo.platforms) {
            for (let p of bulletHellNeo.platforms) {
                p.x += (p.vx * 60 * bulletHellNeo.delta);
                // wrap-around horizontally
                if (p.vx > 0 && p.x > bulletHellNeo.width) p.x = -p.w;
                if (p.vx < 0 && p.x + p.w < 0) p.x = bulletHellNeo.width;
            }
        }

        // Player support and spike damage checks (only relevant in blueMode/platformer)
        if (bulletHellNeo.soul == "blue") {
            let playerX = bulletHellNeo.px;
            let playerY = bulletHellNeo.py;
            if (bulletHellNeo.subArena && options.bhKeyboard) { playerX += bulletHellNeo.subx; playerY += bulletHellNeo.suby}

            // Platforms: allow standing on top
            if (bulletHellNeo.platforms) {
                for (let p of bulletHellNeo.platforms) {
                    // check horizontal overlap with a small tolerance
                    if (playerX + bulletHellNeo.pr > p.x && playerX - bulletHellNeo.pr < p.x + p.w) {
                        const feetY = playerY + bulletHellNeo.pr;
                        // If player's feet are touching or just below the platform top and falling, snap to platform
                        if (feetY >= p.y - 6 && feetY <= p.y + 10 && (bulletHellNeo.pvy || 0) >= -2) {
                            bulletHellNeo.py = p.y - bulletHellNeo.pr;
                            bulletHellNeo.pvy = 0;
                            bulletHellNeo.onGround = true;
                            if (p.hasSpikes) {
                                const now = Date.now();
                                if (!bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime) bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime = 0;
                                if (now - bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime > 0) {
                                    bulletHellNeo.platformHit = true;
                                    bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime = now;
                                }
                            }
                        }
                    }
                }
            }

            // Spikes: if player's feet intersect the spike band, deal damage periodically
            if (bulletHellNeo.spikes && bulletHellNeo.spikes.length) {
                const spikeTop = bulletHellNeo.height - (bulletHellNeo.actions["spikePlatformAttack"].spikeHeight || 36);
                const feetY = bulletHellNeo.py + bulletHellNeo.pr;
                if (feetY >= spikeTop) {
                    // if player's x overlaps any spike
                    for (let s of bulletHellNeo.spikes) {
                        if (bulletHellNeo.px + bulletHellNeo.pr > s.x && bulletHellNeo.px - bulletHellNeo.pr < s.x + s.w) {
                            const now = Date.now();
                            if (!bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime) bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime = 0;
                            if (now - bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime > 0) {
                                bulletHellNeo.platformHit = true; // reuse central damage handling
                                bulletHellNeo.actions["spikePlatformAttack"].lastSpikeDamageTime = now;
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Allow `rain` to be specified on the action (bulletHellNeo.actions["spikePlatformAttack"].rain)
        if ((bulletHellNeo.actions && bulletHellNeo.actions["spikePlatformAttack"] && bulletHellNeo.actions["spikePlatformAttack"].rain) || bulletHellNeo.rain) {
            // Reuse existing pipRain behavior so toggling `rain` matches pipRain effects.
            if (BHB && BHB.pipRain && typeof BHB.pipRain.moveFunc === 'function') {
                BHB.pipRain.moveFunc("spikePlatformAttack")
            }
            // Optionally spawn horizontal pip rain if configured
            if (bulletHellNeo.actions && bulletHellNeo.actions["spikePlatformAttack"] && bulletHellNeo.actions["spikePlatformAttack"].horizontalRain && BHB && BHB.pipRainHorizontal && typeof BHB.pipRainHorizontal.moveFunc === 'function') {
                BHB.pipRainHorizontal.moveFunc("spikePlatformAttack")
            }
        }
    },
}
//    bulletHellBlue({"spikePlatformAttack": {spikeHeight: 50, spikeWidth: 28, platformCount: 4, platformSpikeChance: 0.3, platformSpeed: 1.5, platformMinW: 203, platformMaxW: 203, rain: true, bulletPerSec: 3}}, {width:800, height:600, duration:15, jumpMin:6, jumpMax:250, gravity: 0.2})

BHB.dieBouncer = {
    //bulletHell({"dieBouncer": {dieAmount: 1, size: 50, enemySpeed: 3, chargeMult: 1.6, spikeSpeed:6, spikeRadius:36, lastTick:false}}, {width: 400, height: 400, duration: 10})
    codeFunc() {
        const amount = bulletHellNeo.actions["dieBouncer"].dieAmount || 1;
        for (let i = 0; i < amount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const speed = bulletHellNeo.actions["dieBouncer"].enemySpeed || 3;
            const bx = bulletHellNeo.width / 2 + Math.cos(theta) * (bulletHellNeo.width / 4) + bulletHellNeo.boxLeft;
            const by = bulletHellNeo.height / 2 + Math.sin(theta) * (bulletHellNeo.height / 4) + bulletHellNeo.boxTop;
            bulletHellNeo.bullets.push({
                name: "die",
                x: bx,
                y: by,
                vx: Math.cos(theta) * speed,
                vy: Math.sin(theta) * speed,
                r: bulletHellNeo.actions["dieBouncer"].size || 28,
                angle: theta,
                pulsingRed: false,
                lungeTimer: 0,
                bounceCooldown: 0,
                draw(b, bossCtx) {
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    // Die face
                    const s = b.r * 2;
                    bossCtx.fillStyle = b.pulsingRed ? '#f88' : '#fff';
                    bossCtx.strokeStyle = '#000';
                    bossCtx.lineWidth = Math.max(2, b.r/8);
                    bossCtx.fillRect(-b.r, -b.r, s, s);
                    bossCtx.strokeRect(-b.r, -b.r, s, s);
                    // Draw six pips (three left, three right)
                    bossCtx.fillStyle = '#000';
                    const pip = Math.max(1, Math.floor(b.r/6));
                    const ox = b.r * 0.6;
                    const oy = b.r * 0.45;
                    bossCtx.beginPath(); bossCtx.arc(-ox, -oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(-ox, 0, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(-ox, oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(ox, -oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(ox, 0, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(ox, oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.restore();
                }
            })
        }
    },
    moveFunc() {
        let dt = Date.now() - (bulletHellNeo.actions["dieBouncer"].lastTick || Date.now());
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "die") {
                let bounced = false;
                if (b.x < b.r + bulletHellNeo.boxLeft) { b.x = b.r + bulletHellNeo.boxLeft; b.vx *= -1; bounced = true; }
                if (b.x > bulletHellNeo.width - b.r + bulletHellNeo.boxLeft) { b.x = bulletHellNeo.width - b.r + bulletHellNeo.boxLeft; b.vx *= -1; bounced = true; }
                if (b.y < b.r + bulletHellNeo.boxTop) { b.y = b.r + bulletHellNeo.boxTop; b.vy *= -1; bounced = true; }
                if (b.y > bulletHellNeo.height - b.r + bulletHellNeo.boxTop) { b.y = bulletHellNeo.height - b.r + bulletHellNeo.boxTop; b.vy *= -1; bounced = true; }

                if (bounced && (!b._lastBounce || Date.now() - b._lastBounce > 60)) {
                    b._lastBounce = Date.now();
                    // Spawn 3 spikes aimed at player (centered + offsets)
                    let px = bulletHellNeo.px + (bulletHellNeo.subArena && options.bhKeyboard ? bulletHellNeo.subx : 0);
                    let py = bulletHellNeo.py + (bulletHellNeo.subArena && options.bhKeyboard ? bulletHellNeo.suby : 0);
                    let base = Math.atan2(py - b.y, px - b.x);
                    for (let s = -1; s <= 1; s++) {
                        // Use exact diceSpikes aiming: spawn off-screen and aim roughly at player with random offset
                        const spikeSize = (bulletHellNeo.actions['diceSpikes'] && bulletHellNeo.actions['diceSpikes'].spikeSize) || bulletHellNeo.actions["dieBouncer"].spikeSize || bulletHellNeo.actions["dieBouncer"].spikeRadius || 28;
                        const speed = (bulletHellNeo.actions['diceSpikes'] && bulletHellNeo.actions['diceSpikes'].enemySpeed) || bulletHellNeo.actions["dieBouncer"].spikeSpeed || 6;
                        // spawn at screen edges (not arena) and aim directly at player
                        const side = Math.random() < 0.5 ? -1 : 1;
                        const sx = side === -1 ? -spikeSize : (window.innerWidth + spikeSize);
                        const sy = Math.random() * window.innerHeight;
                        const playerGlobalX = bulletHellNeo.boxLeft + (bulletHellNeo.px || 0) + (bulletHellNeo.subArena && options.bhKeyboard ? bulletHellNeo.subx : 0);
                        const playerGlobalY = bulletHellNeo.boxTop + (bulletHellNeo.py || 0) + (bulletHellNeo.subArena && options.bhKeyboard ? bulletHellNeo.suby : 0);
                        const dx = playerGlobalX - sx;
                        const dy = playerGlobalY - sy;
                        const dist = Math.hypot(dx, dy) || 1;
                        const vx = (dx / dist) * speed;
                        const vy = (dy / dist) * speed;
                        const color = Math.random() < 0.5 ? '#000' : '#fff';
                        bulletHellNeo.bullets.push({
                            x: sx,
                            y: sy,
                            vx: vx,
                            vy: vy,
                            r: spikeSize,
                            color: color,
                            name: 'dieSpike',
                            draw(sb, bossCtx) {
                                const angle = Math.atan2(sb.vy, sb.vx);
                                bossCtx.save();
                                bossCtx.translate(sb.x, sb.y);
                                bossCtx.rotate(angle);
                                bossCtx.beginPath();
                                bossCtx.moveTo(sb.r, 0);
                                bossCtx.lineTo(-sb.r * 0.6, sb.r * 0.7);
                                bossCtx.lineTo(-sb.r * 0.6, -sb.r * 0.7);
                                bossCtx.closePath();
                                bossCtx.fillStyle = sb.color;
                                bossCtx.fill();
                                bossCtx.lineWidth = 2;
                                bossCtx.strokeStyle = (sb.color === '#000') ? '#fff' : '#000';
                                bossCtx.stroke();
                                bossCtx.restore();
                            }
                        })
                    }

                    // Charge briefly (speed up like charged bees)
                    if (!b.pulsingRed) {
                        b.vx *= (bulletHellNeo.actions["dieBouncer"].chargeMult || 1.6);
                        b.vy *= (bulletHellNeo.actions["dieBouncer"].chargeMult || 1.6);
                        b.pulsingRed = true;
                        b.lungeTimer = 700;
                    }
                }

                if (b.pulsingRed) {
                    b.lungeTimer -= dt;
                    if (b.lungeTimer <= 0) {
                        b.vx = b.vx / (bulletHellNeo.actions["dieBouncer"].chargeMult || 1.6);
                        b.vy = b.vy / (bulletHellNeo.actions["dieBouncer"].chargeMult || 1.6);
                        b.pulsingRed = false;
                    }
                }
            }
        }
        bulletHellNeo.actions["dieBouncer"].lastTick = Date.now();
    }
}

//bulletHellBlue({"dieBouncer": {dieAmount: 1, size: 50, enemySpeed: 3, chargeMult: 1.6, spikeSpeed:5, spikeRadius:30, lastTick:false}}, {width: 800, height: 600, duration: 10, jumpMin:6, jumpMax:250, gravity: 0.2})
//bulletHell({"dieBouncer": {dieAmount: 2, size: 50, enemySpeed: 3, chargeMult: 1.6, spikeSpeed:6, spikeRadius:30, lastTick:false}}, {width: 1200, height: 600, duration: 10})

BHB.movingDieRadialBurstAttack = {
    //bulletHell({"movingDieRadialBurstAttack": {circleAmount: 1, burstInterval: 1000, bulletsPerBurst: 7, enemySpeed: 1.5, bulletSpeed: 5}}, {duration: 12})
    codeFunc() {
        for (let i = 0; i < bulletHellNeo.actions["movingDieRadialBurstAttack"].circleAmount; i++) {
            bulletHellNeo.bullets.push({
                name: "circle",
                x: Math.random() * (bulletHellNeo.width - 120) + 60 + bulletHellNeo.boxLeft,
                y: bulletHellNeo.height + bulletHellNeo.boxTop,
                vx: bulletHellNeo.actions["movingDieRadialBurstAttack"].enemySpeed * 2,
                vy: 0,
                r: 40,
                lastBurstTime: 0,
                draw(b, bossCtx) {
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    // Die face
                    const s = b.r * 2;
                    bossCtx.fillStyle = b.pulsingRed ? '#f88' : '#fff';
                    bossCtx.strokeStyle = '#000';
                    bossCtx.lineWidth = Math.max(2, b.r/8);
                    bossCtx.fillRect(-b.r, -b.r, s, s);
                    bossCtx.strokeRect(-b.r, -b.r, s, s);
                    // Draw six pips (three left, three right)
                    bossCtx.fillStyle = '#000';
                    const pip = Math.max(1, Math.floor(b.r/6));
                    const ox = b.r * 0.6;
                    const oy = b.r * 0.45;
                    bossCtx.beginPath(); bossCtx.arc(-ox, -oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(-ox, 0, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(-ox, oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(ox, -oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(ox, 0, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.beginPath(); bossCtx.arc(ox, oy, pip, 0, Math.PI*2); bossCtx.fill();
                    bossCtx.restore();
                }
            });
        }
    },
    moveFunc() {
        for (let b of bulletHellNeo.bullets) {
            if (b.name && b.name == "circle") {
                // Bounce off walls
                if (b.x < b.r + bulletHellNeo.boxLeft) {b.x = b.r + bulletHellNeo.boxLeft; b.vx *= -1}
                if (b.x > bulletHellNeo.width - b.r + bulletHellNeo.boxLeft) {b.x = bulletHellNeo.width - b.r + bulletHellNeo.boxLeft; b.vx *= -1}
                if (b.y < b.r + bulletHellNeo.boxTop) {b.y = b.r + bulletHellNeo.boxTop; b.vy *= -1}
                if (b.y > bulletHellNeo.height - b.r + bulletHellNeo.boxTop) {b.y = bulletHellNeo.height - b.r + bulletHellNeo.boxTop; b.vy *= -1}

                // Burst
                if (!b.lastBurstTime) b.lastBurstTime = Date.now()
                if (Date.now() - b.lastBurstTime > bulletHellNeo.actions["movingDieRadialBurstAttack"].burstInterval) {
                    bulletHellNeo.fireDiceSpikeRadialBurst(b.x, b.y, "movingDieRadialBurstAttack")
                    b.lastBurstTime = Date.now()
                }
            }
        }
    },
    
}
//bulletHellBlue({"movingDieRadialBurstAttack": {circleAmount: 1, burstInterval: 800, bulletsPerBurst: 6, enemySpeed: 1.5, bulletSpeed: 5}}, {width:800, height:600, duration:15, jumpMin:6, jumpMax:250, gravity: 0.2})

//bulletHell({"pipRainUltimate": {bulletPerSec: 6}}, {width: window.innerWidth, height: window.innerHeight, duration: 19, transparent: true, saveContent: true,})
//bulletHell({"dieBouncer": {dieAmount: 4, size: 60, enemySpeed: 3, chargeMult: 1.6, spikeSpeed:6, spikeRadius:30, lastTick:false}}, {width: window.innerWidth, height: window.innerHeight, duration: 19, transparent: true, saveContent: true,})

BHB.zarUltimateAttack = {
//bulletHellBlue({"zarUltimateAttack": {spikeHeight: 50, spikeWidth: 28, platformCount: 6, spawnPerSec: 4, bulletPerSec: 6, enemySpeed: 3, spikeSize: 28, platformSpikeChance: 0.1, platformSpeed: 1.5, platformMinW: 203, platformMaxW: 203, diceSpikes: true, bulletPerSec: 10}}, {width: window.innerWidth, height: window.innerHeight, duration: 19, transparent: true, saveContent: true, jumpMin:6, jumpMax:350, gravity: 0.2})
    codeFunc() {
        // Create spikes filling the entire ground
        const spikeH = bulletHellNeo.actions["zarUltimateAttack"].spikeHeight || 36;
        const spikeW = bulletHellNeo.actions["zarUltimateAttack"].spikeWidth || 28;
        bulletHellNeo.spikes = [];
        for (let x = 0; x < bulletHellNeo.width; x += spikeW) {
            bulletHellNeo.spikes.push({ x: x, y: bulletHellNeo.height - spikeH, w: spikeW, h: spikeH });
        }

        // Create sliding platforms slightly above the spikes
        const pCount = bulletHellNeo.actions["zarUltimateAttack"].platformCount || 6;
        bulletHellNeo.platforms = [];
        // determine vertical slots so only 1 platform can appear at each height
        const minAbove = bulletHellNeo.actions["zarUltimateAttack"].platformMinAbove || 80;
        const maxAbove = bulletHellNeo.actions["zarUltimateAttack"].platformMaxAbove || Math.max(120, Math.min(220, bulletHellNeo.height - spikeH - 60)) * 2;
        let heights = [];
        if (pCount <= 1) {
            heights = [bulletHellNeo.height - spikeH - Math.floor((minAbove + maxAbove) / 2)];
        } else {
            for (let i = 0; i < pCount; i++) {
                const t = i / (pCount - 1);
                const above = Math.floor(minAbove + t * (maxAbove - minAbove));
                heights.push(bulletHellNeo.height - spikeH - above);
            }
        }
        // shuffle heights so order is not predictable
        for (let i = heights.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [heights[i], heights[j]] = [heights[j], heights[i]];
        }

        const spikeChance = typeof bulletHellNeo.actions["zarUltimateAttack"].platformSpikeChance !== 'undefined' ? bulletHellNeo.actions["zarUltimateAttack"].platformSpikeChance : (bulletHellNeo.actions["zarUltimateAttack"].spikeOnPlatformPercent || 0.25);

        for (let i = 0; i < pCount; i++) {
            const w = Math.floor((bulletHellNeo.actions["zarUltimateAttack"].platformMinW || 80) + Math.random() * (((bulletHellNeo.actions["zarUltimateAttack"].platformMaxW || 160)) - (bulletHellNeo.actions["zarUltimateAttack"].platformMinW || 80)));
            const h = 14;
            const y = heights[i % heights.length];
            // place platform ensuring an extra horizontal gap between platforms
            const extraGap = typeof bulletHellNeo.actions["zarUltimateAttack"].platformExtraGap !== 'undefined' ? bulletHellNeo.actions["zarUltimateAttack"].platformExtraGap : 50;
            let x = Math.random() * (bulletHellNeo.width - w);
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 60) {
                let ok = true;
                for (let q of bulletHellNeo.platforms) {
                    if (!(x + w + extraGap <= q.x || x >= q.x + q.w + extraGap)) { ok = false; break; }
                }
                if (ok) { placed = true; break; }
                x = Math.random() * (bulletHellNeo.width - w);
                attempts++;
            }
            if (!placed) {
                // fallback: scan for first fitting position
                for (let cx = 0; cx <= bulletHellNeo.width - w; cx += 4) {
                    let ok2 = true;
                    for (let q of bulletHellNeo.platforms) {
                        if (!(cx + w + extraGap <= q.x || cx >= q.x + q.w + extraGap)) { ok2 = false; break; }
                    }
                    if (ok2) { x = cx; placed = true; break; }
                }
            }
            // if still not placed, x remains random (may overlap)
            const speed = ((Math.random() < 0.5) ? -1 : 1) * (bulletHellNeo.actions["zarUltimateAttack"].platformSpeed || 2.5) * (0.6 + Math.random() * 1.4);
            const hasSpikes = Math.random() < spikeChance;
            const pSpikeW = Math.max(8, Math.min((bulletHellNeo.actions["zarUltimateAttack"].platformSpikeWidth || Math.floor(spikeW/1.6)), Math.floor(w/3)));
            const pSpikeH = Math.max(6, Math.min((bulletHellNeo.actions["zarUltimateAttack"].platformSpikeHeight || Math.floor(spikeH*0.6)), 24));
            bulletHellNeo.platforms.push({ x: x, y: y, w: w, h: h, vx: speed, color: bulletHellNeo.actions["zarUltimateAttack"].platformColor || '#9aa', hasSpikes: hasSpikes, spikeW: pSpikeW, spikeH: pSpikeH });
        }

        // timing for spike damage
        bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime = bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime || 0;
    },
    moveFunc() {
        // Update platforms positions
        if (bulletHellNeo.platforms) {
            for (let p of bulletHellNeo.platforms) {
                p.x += (p.vx * 60 * bulletHellNeo.delta);
                // wrap-around horizontally
                if (p.vx > 0 && p.x > bulletHellNeo.width) p.x = -p.w;
                if (p.vx < 0 && p.x + p.w < 0) p.x = bulletHellNeo.width;
            }
        }

        // Player support and spike damage checks (only relevant in blueMode/platformer)
        if (bulletHellNeo.soul == "blue") {
            let playerX = bulletHellNeo.px;
            let playerY = bulletHellNeo.py;
            if (bulletHellNeo.subArena && options.bhKeyboard) { playerX += bulletHellNeo.subx; playerY += bulletHellNeo.suby }

            // Platforms: allow standing on top
            if (bulletHellNeo.platforms) {
                for (let p of bulletHellNeo.platforms) {
                    // check horizontal overlap with a small tolerance
                    if (playerX + bulletHellNeo.pr > p.x && playerX - bulletHellNeo.pr < p.x + p.w) {
                        const feetY = playerY + bulletHellNeo.pr;
                        // If player's feet are touching or just below the platform top and falling, snap to platform
                        if (feetY >= p.y - 6 && feetY <= p.y + 10 && (bulletHellNeo.pvy || 0) >= -2) {
                            bulletHellNeo.py = p.y - bulletHellNeo.pr;
                            bulletHellNeo.pvy = 0;
                            bulletHellNeo.onGround = true;
                            if (p.hasSpikes) {
                                const now = Date.now();
                                if (!bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime) bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime = 0;
                                if (now - bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime > 0) {
                                    bulletHellNeo.platformHit = true;
                                    bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime = now;
                                }
                            }
                        }
                    }
                }
            }

            // Spikes: if player's feet intersect the spike band, deal damage periodically
            if (bulletHellNeo.spikes && bulletHellNeo.spikes.length) {
                const spikeTop = bulletHellNeo.height - (bulletHellNeo.actions["zarUltimateAttack"].spikeHeight || 36);
                const feetY = bulletHellNeo.py + bulletHellNeo.pr;
                if (feetY >= spikeTop) {
                    // if player's x overlaps any spike
                    for (let s of bulletHellNeo.spikes) {
                        if (bulletHellNeo.px + bulletHellNeo.pr > s.x && bulletHellNeo.px - bulletHellNeo.pr < s.x + s.w) {
                            const now = Date.now();
                            if (!bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime) bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime = 0;
                            if (now - bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime > 0) {
                                bulletHellNeo.platformHit = true; // reuse central damage handling
                                bulletHellNeo.actions["zarUltimateAttack"].lastSpikeDamageTime = now;
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Allow `rain` to be specified on the action (bulletHellNeo.actions["zarUltimateAttack"].rain)
        if ((bulletHellNeo.actions && bulletHellNeo.actions["zarUltimateAttack"] && bulletHellNeo.actions["zarUltimateAttack"].diceSpikes) || bulletHellNeo.diceSpikes) {
            // Reuse existing pipRain behavior so toggling `rain` matches pipRain effects.
            if (BHB && BHB.diceSpikes && typeof BHB.diceSpikes.moveFunc === 'function') {
                BHB.diceSpikes.moveFunc("zarUltimateAttack")
            }
        }
    },
}
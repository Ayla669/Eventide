let storm = null;
let meteorType = null;
let smallMeteorType = null;
let contentReady = false;

let meteorTimer = 0;
let smallMeteorTimer = 0;
let stormActive = false;

const meteorAngle = 300;

const firstMin = 60;
const firstMax = 120;
const spawnMin = 60;
const spawnMax = 120;
const smallMin = 10;
const smallMax = 20;

Events.run(Trigger.update, () => {
    if (!contentReady) {
        storm = Vars.content.getByName(ContentType.weather, "eventide-meteorshower");
        meteorType = Vars.content.getByName(ContentType.unit, "eventide-ev-rybek-meteor");
        smallMeteorType = Vars.content.getByName(ContentType.unit, "eventide-ev-large-rybek-meteor");

        if (storm == null || meteorType == null || smallMeteorType == null) return;

        contentReady = true;
    }

    if (Vars.state == null || Vars.headless || Vars.state.isPaused()) return;

    if (!storm.isActive()) {
        stormActive = false;
        return;
    }

    if (!stormActive) {
        stormActive = true;
        meteorTimer = Mathf.random(firstMin, firstMax);
        smallMeteorTimer = Mathf.random(smallMin, smallMax);

        Vars.ui.announce(Core.bundle.get("eventide-meteor-warning"), 5);
    }

    meteorTimer -= Time.delta;
    if (meteorTimer <= 0) {
        spawnMeteor(meteorType);
        meteorTimer = Mathf.random(spawnMin, spawnMax);
    }

    smallMeteorTimer -= Time.delta;
    if (smallMeteorTimer <= 0) {
        spawnMeteor(smallMeteorType);
        smallMeteorTimer = Mathf.random(smallMin, smallMax);
    }
});

function spawnMeteor(type) {
    const cameraX = Core.camera.position.x;
    const cameraY = Core.camera.position.y;
    const viewWidth = Core.camera.width;
    const viewHeight = Core.camera.height;

    const targetX = cameraX + (Math.random() - 0.5) * viewWidth;
    const targetY = cameraY + (Math.random() - 0.5) * viewHeight;

    const maxSize = Math.max(viewWidth, viewHeight);
    const distance = Mathf.random(maxSize * 0.8 + 100, maxSize * 1.8 + 300);

    const radians = meteorAngle * Math.PI / 180;
    const spawnX = targetX - Math.cos(radians) * distance;
    const spawnY = targetY - Math.sin(radians) * distance;

    type.spawn(Team.green, spawnX, spawnY, meteorAngle);
}

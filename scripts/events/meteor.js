var storm = null;
var meteorType = null;
var smallMeteorType = null;

var contentReady = false;
var lookupWarning = false;

var meteorTimer = 0;
var smallMeteorTimer = 0;
var stormActive = false;

var meteorAngle = 300;

var firstMin = 60;
var firstMax = 120;

var spawnMin = 60;
var spawnMax = 120;

var smallMin = 10;
var smallMax = 20;

Events.run(Trigger.update, () => {

    if (!contentReady) {

        storm = Vars.content.getByName(
            ContentType.weather,
            "eventide-meteorshower"
        );

        meteorType = Vars.content.getByName(
            ContentType.unit,
            "eventide-ev-rybek-meteor"
        );

        smallMeteorType = Vars.content.getByName(
            ContentType.unit,
            "eventide-ev-large-rybek-meteor"
        );

        if (storm == null || meteorType == null || smallMeteorType == null) {

            if (!lookupWarning) {
                print("[Eventide] Procurando conteúdos...");
                lookupWarning = true;
            }

            return;
        }

        contentReady = true;

        print("[Eventide] SISTEMA DE METEOROS PRONTO!");
    }


if (Vars.state == null || Vars.headless) return;
if (Vars.state.isPaused()) return;

    if (!storm.isActive()) {
        stormActive = false;
        return;
    }

    if (!stormActive) {
        stormActive = true;

        meteorTimer = Mathf.random(firstMin, firstMax);
        smallMeteorTimer = Mathf.random(smallMin, smallMax);

        Vars.ui.announce(
    Core.bundle.get("eventide-meteor-warning"),
    5
);
    }

    meteorTimer -= Time.delta;

    if (meteorTimer <= 0) {

        spawnMeteor(meteorType);

        meteorTimer = Mathf.random(
            spawnMin,
            spawnMax
        );
    }

    smallMeteorTimer -= Time.delta;

    if (smallMeteorTimer <= 0) {

        spawnMeteor(smallMeteorType);

        smallMeteorTimer = Mathf.random(
            smallMin,
            smallMax
        );
    }
});

function spawnMeteor(type) {

    var cameraX = Core.camera.position.x;
    var cameraY = Core.camera.position.y;

    var viewWidth = Core.camera.width;
    var viewHeight = Core.camera.height;

    var targetX = cameraX +
        (Math.random() - 0.5) * viewWidth;

    var targetY = cameraY +
        (Math.random() - 0.5) * viewHeight;

    var maxSize = Math.max(viewWidth, viewHeight);

    var distance = Mathf.random(
        maxSize * 0.8 + 100,
        maxSize * 1.8 + 300
    );

    var angle = meteorAngle;
    var radians = angle * Math.PI / 180;

    var spawnX = targetX - Math.cos(radians) * distance;
    var spawnY = targetY - Math.sin(radians) * distance;

    type.spawn(
        Team.green,
        spawnX,
        spawnY,
        angle
    );
}

let contaminationStatus = null;
let statusResolved = false;

const processedUnits = new Set();
const projectileTeams = new Map();

// Resolve the status effect once
Events.on(ClientLoadEvent, () => {
    Vars.content.statusEffects().each(status => {
        if (status.name === "eventide-ev-status-contamined") {
            contaminationStatus = status;
            statusResolved = true;
        }
    });
});

// Fallback lookup in case ClientLoadEvent already fired
Events.run(Trigger.update, () => {
    if (!statusResolved) {
        Vars.content.statusEffects().each(status => {
            if (status.name === "eventide-ev-status-contamined") {
                contaminationStatus = status;
                statusResolved = true;
            }
        });
        return;
    }

    if (Vars.net.client() || contaminationStatus == null) return;

    // Clean up entries for units that no longer exist (prevents unbounded growth)
    if (processedUnits.size > 64) {
        processedUnits.forEach(id => {
            if (Groups.unit.getByID(id) == null) {
                processedUnits.delete(id);
                projectileTeams.delete(id);
            }
        });
    }

    Groups.unit.each(unit => {
        if (!unit.hasEffect(contaminationStatus)) return;
        if (unit.health > 10) return;
        if (processedUnits.has(unit.id)) return;

        const team = projectileTeams.get(unit.id);
        if (team == null) return;

        const clone = unit.type.spawn(team, unit.x, unit.y, unit.rotation);
        if (clone == null) return;

        clone.clearStatuses();
        clone.health = clone.maxHealth;

        processedUnits.add(unit.id);
        projectileTeams.delete(unit.id);

        // Remove the original unit so we don't get double entities
        unit.destroy();
    });
});

// Record which team applied the contamination
Events.on(UnitDamageEvent, event => {
    if (Vars.net.client() || contaminationStatus == null) return;

    const unit = event.unit;
    const bullet = event.bullet;

    if (unit == null || bullet == null || bullet.type == null) return;
    if (bullet.type.status !== contaminationStatus) return;

    projectileTeams.set(unit.id, bullet.team);
});

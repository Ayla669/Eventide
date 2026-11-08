let contaminado = null;
let procurouStatus = false;

const processadas = new Set();
const timesDosProjeteis = new Map();

Events.run(Trigger.update, () => {

    if (!procurouStatus) {
        Vars.content.statusEffects().each(status => {
            if (status.name == "eventide-ev-status-contamined") {
                contaminado = status;
            }
        });

        if (contaminado != null) {
            procurouStatus = true;
            print("[Eventide] STATUS ENCONTRADO: " + contaminado.name);
        }

        return;
    }

    if (Vars.net.client()) return;

    Groups.unit.each(unidade => {

        if (!unidade.hasEffect(contaminado)) return;
        if (unidade.health > 10) return;

        const idUnidade = unidade.id;

        if (processadas.has(idUnidade)) return;

        const timeClone = timesDosProjeteis.get(idUnidade);

        if (timeClone == null) {
            print("[Eventide] SEM TIME REGISTRADO: " + idUnidade);
            return;
        }

        const clone = unidade.type.spawn(
            timeClone,
            unidade.x,
            unidade.y,
            unidade.rotation
        );

        if (clone == null) {
            print("[Eventide] ERRO: clone nao criado!");
            return;
        }

        clone.clearStatuses();
        clone.health = clone.maxHealth;

        processadas.add(idUnidade);
        timesDosProjeteis.delete(idUnidade);

        print("[Eventide] CLONE CRIADO!");
        print("[Eventide] TIPO: " + clone.type.name);
        print("[Eventide] TIME: " + clone.team.name);
        print("[Eventide] VIDA: " + clone.health + "/" + clone.maxHealth);
        print("[Eventide] CONTAMINADO: " +
              clone.hasEffect(contaminado));
    });
});

Events.on(UnitDamageEvent, evento => {

    if (Vars.net.client()) return;
    if (contaminado == null) return;

    const unidade = evento.unit;
    const projetil = evento.bullet;

    if (unidade == null || projetil == null) return;
    if (projetil.type == null) return;

    if (projetil.type.status != contaminado) return;

    timesDosProjeteis.set(unidade.id, projetil.team);

    print("[Eventide] TIME REGISTRADO!");
    print("[Eventide] UNIDADE ID: " + unidade.id);
    print("[Eventide] TIME DO PROJETIL: " + projetil.team.name);
});

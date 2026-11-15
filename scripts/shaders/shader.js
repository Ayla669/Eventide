Events.on(ClientLoadEvent, e => {
    const PLANET_NAME = "eventide-izanami";
    let tex = null;

    let mod = Vars.mods.locateMod("eventide");
    if(mod == null){
        Vars.mods.list().each(m => {
            if(m.name.toLowerCase() === "eventide") mod = m;
        });
    }

    if(mod != null){
        const file = mod.root.child("starz.png");
        if(file.exists()){
            tex = new Texture(file);
            tex.setFilter(Texture.TextureFilter.linear);
            tex.setWrap(Texture.TextureWrap.repeat);
            Log.info("[Eventide] starz.png carregada (" + tex.width + "x" + tex.height + ")");
        }
    }

    if(tex == null){
        Log.warn("[Eventide] starz.png não encontrada, usando fallback.");
        Core.assets.load("sprites/distortAlpha.png", Texture).loaded = t => {
            t.setFilter(Texture.TextureFilter.linear);
            t.setWrap(Texture.TextureWrap.repeat);
        };
    }

    Vars.renderer.addEnvRenderer(0, () => {
        let planet = Vars.state.rules.planet || Vars.state.planet;
        if(planet == null || planet.name != PLANET_NAME) return;

        let current = tex != null ? tex : Core.assets.get("sprites/distortAlpha.png", Texture);
        if(current == null) return;

        Draw.z(Layer.weather + 1);

        Weather.drawNoiseLayers(
            current,
            Color.valueOf("82FFF8"),
            250,
            0.45,
            0.2,
            1.3,
            0.3,
            -0.2,
            3,
            -1.2,
            0.7,
            0.8,
            0.9
        );

        Draw.reset();
    });
});
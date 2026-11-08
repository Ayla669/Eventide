Events.on(ClientLoadEvent, () => {
    Time.run(3, () => {
        try {
            const MenuRenderer = Packages.mindustry.graphics.MenuRenderer;
            const Reflect = Packages.arc.util.Reflect;
            const Draw = Packages.arc.graphics.g2d.Draw;
            const Core = Packages.arc.Core;
            const Color = Packages.arc.graphics.Color;
            const Mat = Packages.arc.math.Mat;

            const oldProjection = new Mat();

            const mobileBackgrounds = [
                Core.atlas.find("eventide-ev-background-mobile-1"),
                Core.atlas.find("eventide-ev-background-mobile-2"),
                Core.atlas.find("eventide-ev-background-mobile-3")
            ];

            const pcBackgrounds = [
                Core.atlas.find("eventide-ev-background-pc-1"),
                Core.atlas.find("eventide-ev-background-pc-2"),
                Core.atlas.find("eventide-ev-background-pc-3")
            ];

            const backgrounds = Vars.mobile
                ? mobileBackgrounds
                : pcBackgrounds;

            const randomIndex = Math.floor(
                Math.random() * backgrounds.length
            );

            const selectedBackground = backgrounds[randomIndex];

            print(
                "Eventide: background sorteado: " +
                (Vars.mobile ? "celular" : "PC") +
                " - imagem " + (randomIndex + 1)
            );
            
            const renderer = new JavaAdapter(MenuRenderer, {
                render: function() {
                    const width = Core.graphics.getWidth();
                    const height = Core.graphics.getHeight();

                    const region = selectedBackground;

                    const imageWidth = region.width;
                    const imageHeight = region.height;
                    const imageAspect = imageWidth / imageHeight;
                    const screenAspect = width / height;

                    let drawWidth;
                    let drawHeight;

                    if (imageAspect > screenAspect) {
                        drawHeight = height;
                        drawWidth = height * imageAspect;
                    } else {
                        drawWidth = width;
                        drawHeight = width / imageAspect;
                    }

                    Draw.flush();
                    oldProjection.set(Draw.proj());

                    try {
                        Draw.color(Color.white);

                        Draw.rect(
                            region,
                            width / 2,
                            height / 2,
                            drawWidth,
                            drawHeight
                        );

                        Draw.flush();
                    } finally {
                        Draw.color();
                        Draw.flush();
                        Draw.proj(oldProjection);
                    }
                }
            });

            Reflect.set(
                Vars.ui.menufrag.getClass(),
                Vars.ui.menufrag,
                "renderer",
                renderer
            );

            print("Eventide: fundo personalizado instalado.");

        } catch (e) {
            print("Eventide: erro no fundo do menu: " + e);
            print(e);
        }
    });
});

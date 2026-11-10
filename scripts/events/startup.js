Events.on(ClientLoadEvent, () => {
    const key = "eventide-v02-notice-shown";

    if (Core.settings.getBool(key, false)) return;

    const dialog = new BaseDialog("Eventide v0.3");

    dialog.cont.margin(15);
    dialog.cont.add(
        "[#424B99]Eventide[] is still in development.\n\n" +
        "This is version 0.3 Updates:\n>optimization\n>New layout for the sectors\n>New appearance for Izanami and the planetary ring\n>Among other changes\n\n" +
        "Content may still be incomplete or change in future updates."
    )
    .width(320)
    .wrap()
    .pad(4)
    .get()
    .setAlignment(Align.center, Align.center);

    dialog.buttons.button("Okay", () => {
        Core.settings.put(key, true);
        dialog.hide();
    }).size(110, 50).pad(4);

    dialog.setFillParent(false);
    dialog.show();
});

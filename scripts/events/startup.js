
Events.on(ClientLoadEvent, () => {
    const dialog = new BaseDialog("Warning");

    dialog.cont.margin(15);

    dialog.cont.add(
        "[#424B99]Eventide[] stills a demo\n\n" +
        "The mod is in development\n" +
        "Some resources could be incomplete or soffer changes along the time."
    )
    .width(300)
    .wrap()
    .pad(4)
    .get()
    .setAlignment(Align.center, Align.center);

    dialog.buttons.button("Okay", () => {
        dialog.hide();
    }).size(110, 50).pad(4);

    dialog.setFillParent(false);

    dialog.show();
});

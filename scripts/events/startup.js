
Events.on(ClientLoadEvent, () => {
    const dialog = new BaseDialog("v0.2");

    dialog.cont.margin(15);

    dialog.cont.add(
        "[#424B99]Eventide[] stills in development\n\n" +
        "This is the 0.2 version, some bugs are fixed, and the pt br language has added\n" +
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

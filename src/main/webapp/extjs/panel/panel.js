
Ext.create("Ext.Panel", {
    renderTo     : Ext.getBody(),
    title: "Main Panel",
    width: 400,
    height: 600,
    bodyPadding  : 5,
    items: [
        new Ext.Panel({
            title: "child A",
            html: "first child Panel<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>ssss",
            autoScroll: true,
            height: 200
        }),
        new Ext.Panel({
            title: "child B",
            html: "second child Panel",
            height: 200
        })
    ]
}
);




    

(function() {

    var selectedFile;

    $( "#dialog" ).dialog({
        position: {
            my: 'top left',
            at: 'top left',
            of: $("body")
        },
        modal: true,
        width: 700,
        height: 500,

        create: function() {

            Trifles.create(document.querySelector("[data-role='trifles']"), {
                onSelectFile: function(data) {
                    selectedFile = data.file;
                }
            });

        },

        buttons: {
            Select: function() {
                console.log("selected file", selectedFile);
                $(this).dialog( "close" );
            }
        }
    });

})();
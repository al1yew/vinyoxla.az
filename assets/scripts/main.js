toastr.options = {
    hideDuration: 300,
    timeOut: 2500,
    positionClass: "toast-bottom-right",
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "preventDuplicates": false,
    "onclick": null,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

$(document).ready(function () {

    //input toUpperCase

    $(document).on('keyup', '#vincodeinput', function () {
        let value = $(this).val().toUpperCase();

        $(this).val(value);
    });

    //sample fetch

    $(document).on('submit', '#vincodeform', function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let vinCode = formData.get('vincodeinput');

        //WAUDG74F25N111998
        //4T1BG22K9YU930834

        let obj = {
            carfax: {},
            autocheck: {}
        };

        fetchApi(vinCode)

        async function fetchApi(vinCode) {
            const response = await fetch(`https://api.allreports.tools/wp-json/v1/get_report_check/${vinCode}`);
            obj = await response.json();
            console.log(obj);
        }

        console.log('salam');

        //pochemu podrad ne reshayet !?!??!

    })

});


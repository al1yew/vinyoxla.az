// import axios from 'axios';

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

        $('.preloader').removeClass('d-none');
        $('#carfaxContainer').addClass('d-none');
        $('#autocheckContainer').addClass('d-none');
        $('#photosApiResult').addClass('d-none');

        const formData = new FormData(e.target);

        let vinCode = formData.get('vincodeinput');

        //WAUDG74F25N111998
        //4T1BG22K9YU930834

        axios.get(`https://api.allreports.tools/wp-json/v1/get_report_check/${vinCode}`)
            .then(function (res) {

                $('#autoNameCarfax').html(res?.data?.carfax?.vehicle)
                $('#recordsCountCarfax').html(res?.data?.carfax?.records)
                $('#vinCodeCarfax').html(res?.data?.carfax?.vin)
                $('#yearCarfax').html(res?.data?.carfax?.year)

                $('#autoNameAutocheck').html(res?.data?.autocheck?.vehicle)
                $('#recordsCountAutocheck').html(res?.data?.autocheck?.records)
                $('#vinCodeAutocheck').html(res?.data?.autocheck?.vin)
                $('#yearAutocheck').html(res?.data?.autocheck?.year)

                $('#carfaxContainer').removeClass('d-none')
                $('#autocheckContainer').removeClass('d-none')
                $('#photosApiResult').removeClass('d-none')

                $('.preloader').addClass('d-none');
            })

    })

});


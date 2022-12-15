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

    $('.preloaderdiv').addClass('d-none')

    if ($(document).width() < 576) {
        $('.mainbanner').attr('src', './assets/images/bannertel.jpg')
    }

    if ($(document).width() > 576) {
        $('#vincodeinput').focus()
    }

    //input toUpperCase

    $(document).on('input keyup', '#vincodeinput', function () {
        let value = $(this).val();
        $(this).val(value.toUpperCase());

        if (value.length > 0) {
            $('.copyspan').hide();
            $('.deleteinp').show();
        }
        else {
            $('.copyspan').show();
            $('.deleteinp').hide();
        }

        let regex = /\b[(A-H|J-N|P|R-Z|0-9)]{17}\b/

        if (regex.test(value.toUpperCase())) {
            $('#vincodebutton').removeClass('noClick')
        }
        else {
            $('#vincodebutton').addClass('noClick')
        }
    });

    //delete input value

    $(document).on('click', '.deleteinp', function () {
        $('#vincodeinput').val("");
        $('#vincodebutton').addClass('noClick');
        $('.copyspan').show();
        $('.deleteinp').hide();
    })


    //copy paste

    $(document).on('click pointerdown pointerup', '.copyspan', function () {

        navigator.clipboard.readText()
            .then((text) => {

                let regex = /\b[(A-H|J-N|P|R-Z|0-9)]{17}\b/

                if (regex.test(text.trim().toUpperCase())) {
                    $('#vincodeinput').val(text.trim().toUpperCase())
                    $('#vincodebutton').removeClass('noClick')
                    $('.copyspan').hide();
                    $('.deleteinp').show();
                }
            });
    })

    //fetch

    $(document).on('submit', '#vincodeform', function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        let vinCode = formData.get('vincodeinput');

        let regex = /\b[(A-H|J-N|P|R-Z|0-9)]{17}\b/

        if (!regex.test(vinCode.trim().toUpperCase())) {
            $('.errorp').removeClass('hideerrorp');
            $('.errorp').html("Daxil edilən VİN kodun strukturu səhvdir!");
            return;
        }

        $('.preloaderdiv').removeClass('d-none');
        $('#carfaxContainer').addClass('d-none');
        $('#autocheckContainer').addClass('d-none');
        $('#photosApiResult').addClass('d-none');

        //WAUDG74F25N111998
        //4T1BG22K9YU930834

        axios.get(`https://api.allreports.tools/wp-json/v1/get_report_check/${vinCode}`)
            .then(function (res) {

                if (res?.data?.carfax?.records > 0) {
                    $('#autoNameCarfax').html(res?.data?.carfax?.vehicle);
                    $('#recordsCountCarfax').html(res?.data?.carfax?.records);
                    $('#vinCodeCarfax').html(res?.data?.carfax?.vin);
                    $('#yearCarfax').html(res?.data?.carfax?.year);
                    $('#carfaxContainer').removeClass('d-none');
                }
                else {
                    $('.errorp').removeClass('hideerrorp');
                    $('.errorp').html("Daxil edilən VİN kod tapılmadı!");
                }

                if (res?.data?.autocheck?.records > 0) {
                    $('#autoNameAutocheck').html(res?.data?.autocheck?.vehicle);
                    $('#recordsCountAutocheck').html(res?.data?.autocheck?.records);
                    $('#vinCodeAutocheck').html(res?.data?.autocheck?.vin);
                    $('#yearAutocheck').html(res?.data?.autocheck?.year);
                    $('#autocheckContainer').removeClass('d-none');
                }
                else {
                    $('.errorp').removeClass('hideerrorp');
                    $('.errorp').html("Daxil edilən VİN kod tapılmadı!");
                }

                $('#photosApiResult').removeClass('d-none');
                $('.preloaderdiv').addClass('d-none');

                $(document).scrollTop(1000);

            })

    })

});


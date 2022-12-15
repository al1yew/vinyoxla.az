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

// if ($(document).width() < 576) {
//     $('.mainbanner').attr('src', './assets/images/bannertel.jpg')
// } else {
//     $('.mainbanner').attr('src', './assets/images/mashina-i-fon-vmeste.jpg')
// }

$(document).ready(function () {

    $('.preloaderdiv').addClass('d-none')

    if ($(document).width() > 576) {
        $('#vincodeinput').focus()
        $('#phoneno').focus()
    }

    // -------------------------- main page

    //#region input toUpperCase

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

    //#endregion input toUpperCase

    //#region delete input value

    $(document).on('click', '.deleteinp', function () {
        $('#vincodeinput').val("");
        $('#vincodebutton').addClass('noClick');
        $('.copyspan').show();
        $('.deleteinp').hide();
    })

    //#endregion delete input value

    //#region copy paste

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

    //#endregion copy paste

    //#region fetch

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
        $('.resultsContainer').addClass('d-none');
        $('#carfaxContainer').addClass('d-none');
        $('#autocheckContainer').addClass('d-none');
        $('#photosApiResult').addClass('d-none');

        //WAUDG74F25N111998
        //4T1BG22K9YU930834

        axios.get(`https://api.allreports.tools/wp-json/v1/get_report_check/${vinCode}`)
            .then(function (res) {

                $('.resultsContainer').removeClass('d-none')

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

    //#endregion fetch

    // -------------------------- main page

    // --------------------------

    // -------------------------- login page

    //#region login input focus on click on span

    $(document).on('click', '.kodstrani', function () {
        $('#phoneno').focus();
    })

    //#endregion login input focus on click on span

    //#region login input submit

    $(document).on('submit', '#loginform', function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let phoneno = formData.get('phoneno');
        let code = formData.get('code');

        if (phoneno.length && code.length) {
            console.log({ phoneno, code })

            //fetch to the action of controller where we send sms
        }
    })

    //open code input

    $(document).on('click', '#sendcode', function () {
        $('#sendcode').addClass('d-none');
        $('#kodgelennensonra').removeClass('d-none');
        $('#phoneno').prop('readonly', 'true');
    })

    //#endregion login input submit

    //#region login input prevent entering of nonnumeric

    $(document).on('input', '#phoneno, #code', function (e) {

        if (!/^[0-9]+$/.test($(this).val())) {
            $(this).val($(this).val().slice(0, -1))
        }
    })

    //#endregion login input prevent entering of nonnumeric

    //#region 

    $(document).on('input', '#phoneno, #code', function (e) {

    })

    //#endregion 


    // -------------------------- login page

});


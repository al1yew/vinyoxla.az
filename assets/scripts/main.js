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

    if ($(document).width() > 576) {
        $('#vincodeinput').focus()
        $('#phoneno').focus()
    } else {
        $('.reklamhref').attr('href', 'https://www.instagram.com/garantauto.az/?hl=en')
    }

    // -------------------------- main page

    //#region input toUpperCase in vincode input

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

    //#endregion input toUpperCase in vincode input

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
            toastr.error('Daxil edilən VİN kodun strukturu səhvdir!')
            return;
        }

        $('.preloaderdiv').removeClass('d-none');
        $('.resultsContainer').addClass('d-none');
        $('#carfaxContainer').addClass('d-none');
        $('#autocheckContainer').addClass('d-none');
        $('#photosApiResult').addClass('d-none');

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
                    toastr.error('Daxil edilən VİN kod tapılmadı!')
                }

                if (res?.data?.autocheck?.records > 0) {
                    $('#autoNameAutocheck').html(res?.data?.autocheck?.vehicle);
                    $('#recordsCountAutocheck').html(res?.data?.autocheck?.records);
                    $('#vinCodeAutocheck').html(res?.data?.autocheck?.vin);
                    $('#yearAutocheck').html(res?.data?.autocheck?.year);
                    $('#autocheckContainer').removeClass('d-none');
                }
                else {
                    toastr.error('Daxil edilən VİN kod tapılmadı!')
                }

                $('#photosApiResult').removeClass('d-none');
                $('.preloaderdiv').addClass('d-none');

                if ($(document).width() < 576) {
                    $(document).scrollTop(500)
                }
                else if ($(document).width() > 1200) {
                    $(document).scrollTop(1000);
                }
                else {
                    $('#resultscontainer')[0].scrollIntoView()
                }
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

        if (phoneno.length == 9 && code.length == 4) {
            console.log({ phoneno, code })

            //fetch to the action of controller where we send sms
        }
    })

    //open code input on ENTER press and on button click 

    $(document).on('click', '#sendcode', function () {
        if ($('#phoneno').val().length == 9) {
            $('#sendcode').addClass('d-none');
            $('#kodgelennensonra').removeClass('d-none');
            $('#phoneno').prop('readonly', 'true');
            $('#code').focus();
        }
    })

    $(document).on('keypress', function (e) {
        if (e.keyCode == 13) {
            if ($('#phoneno').val().length == 9) {
                $('#sendcode').addClass('d-none');
                $('#kodgelennensonra').removeClass('d-none');
                $('#phoneno').prop('readonly', 'true');
                $('#code').focus();
            }
        }
    })

    //#endregion login input submit

    //#region login input prevent entering of nonnumeric

    $(document).on('input', '#phoneno, #code', function (e) {

        if (!/^[0-9]+$/.test($(this).val())) {
            $(this).val($(this).val().slice(0, -1))
        }
    })

    //#endregion login input prevent entering of nonnumeric

    // -------------------------- login page

    // -------------------------- 

    // -------------------------- purchase page

    //#region purchase form

    $(document).on('submit', '#purchaseForm', function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let cardno = formData.get('cardno');
        let cardholder = formData.get('cardholder');
        let year = formData.get('year');
        let month = formData.get('month');
        let cvv = formData.get('cvv');

        let date = new Date;

        let cardDate = '01/' + month.trim() + '/' + year.trim();

        let convertedDate = new Date(cardDate)

        if (month.length > 2 || year.length > 4 || cvv.length > 3) {
            toastr.error('Məlumatlar səhvdir.');
            return;
        }

        if (!/^[a-zA-Z\s]*$/.test(cardholder)) {
            toastr.error('Ad soyad səhvdir.');
            return;
        }

        if (!/^[0-9]+$/.test(cardno) ||
            !/^[0-9]+$/.test(year) ||
            !/^[0-9]+$/.test(month) ||
            !/^[0-9]+$/.test(cvv)) {
            toastr.error('Məlumatlar səhvdir.');
            return;
        }

        if (month > 12) {
            toastr.error('Ay səhvdir.');
            return;
        }

        if (convertedDate.getTime() < date.getTime()) {
            toastr.error('Kartın son tarixi səhvdir.');
            return;
        }

        // burda uje vse, backend gebul edecek datalari ve birde yoxlayacag
    });

    //#endregion purchase form

    //#region prevent numeric in purchase page

    $(document).on('input', '#cardno, #year, #month, #cvv', function (e) {
        if (!/^[0-9]+$/.test($(this).val())) {
            $(this).val($(this).val().slice(0, -1))
        }
    })

    //#endregion prevent numeric in purchase page

    //#region input toUpperCase

    $(document).on('input keyup', '#cardholder', function () {
        let value = $(this).val();
        $(this).val(value.toUpperCase());

        let regex = /^[a-zA-Z\s]*$/;

        if (!regex.test(value)) {
            $(this).val($(this).val().slice(0, -1))
        }
    });

    //#endregion input toUpperCase

    //#region visa or mastercard

    $(document).on('input keyup', '#cardno', function () {
        let value = $(this).val();

        if (value.charAt(0) == 4) {
            $('.visabox').addClass('odu');
            $('.mastercardbox').removeClass('odu');
        }

        if (value.charAt(0) == 2 || value.charAt(0) == 5) {
            $('.mastercardbox').addClass('odu');
            $('.visabox').removeClass('odu');
        }

        if (value.length == 0) {
            $('.visabox').removeClass('odu');
            $('.mastercardbox').removeClass('odu');
        }
    });

    //#endregion visa or mastercard

});

    //WAUDG74F25N111998
    //4T1BG22K9YU930834
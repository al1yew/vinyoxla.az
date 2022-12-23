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
        $('#cardholder').focus()
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

    $(document).on('input', '#phoneno, #code, #phonenumber', function (e) {

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
        let phonenumber = formData.get('phonenumber');

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

        console.log({ phonenumber, cvv, cardno, cardholder, year, month });

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

    // -------------------------- purchase page

    // -------------------------- 

    // -------------------------- account page

    //#region input to uppercase

    $(document).on('input keyup', '#search', function () {
        let value = $(this).val();
        $(this).val(value.toUpperCase());
    });

    //#endregion input to uppercase

    //#region search input

    $(document).on('input', '#search', function () {
        let value = $(this).val();

        console.log(value);
    });

    //#endregion search input

    // -------------------------- account page

    // -------------------------- 

    // -------------------------- topup page

    //#region amount input prevent entering of nonnumeric

    $(document).on('input', '#amount', function (e) {

        if (!/^[0-9]+$/.test($(this).val())) {
            $(this).val($(this).val().slice(0, -1))
        }
    })

    //#endregion amount input prevent entering of nonnumeric

    //#region topup form submit

    $(document).on('submit', '#topupmain', function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let cardno = formData.get('cardno');
        let cardholder = formData.get('cardholder');
        let year = formData.get('year');
        let month = formData.get('month');
        let cvv = formData.get('cvv');
        let amount = formData.get('amount');

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

        console.log({ amount, cvv, cardno, cardholder, year, month });
    })

    //#endregion topup form submit

    // -------------------------- topup page

    // -------------------------- 

    // -------------------------- images page

    //#region slider in images page

    // $('.sliderimages').slick({
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: true,
    //     fade: true,
    //     prevArrow: $('.prevbtn'),
    //     nextArrow: $('.nextbtn'),
    //     asNavFor: '.miniimages'
    // });
    // $('.miniimages').slick({
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     asNavFor: '.sliderimages',
    //     dots: false,
    //     centerMode: true,
    //     focusOnSelect: true
    // });

    $('.sliderimages1').slick({
        dots: false,
        infinite: true,
        asNavFor: '.miniimages1',
        speed: 500,
        prevArrow: $('.prevbtn1'),
        nextArrow: $('.nextbtn1'),
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    });

    $('.miniimages1').slick({
        dots: false,
        infinite: true,
        focusOnSelect: true,
        asNavFor: '.sliderimages1',
        speed: 500,
        prevArrow: $('.prevbtn1'),
        nextArrow: $('.nextbtn1'),
        slidesToShow: 8,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    });

    $('.sliderimages2').slick({
        dots: false,
        infinite: true,
        speed: 500,
        prevArrow: $('.prevbtn2'),
        nextArrow: $('.nextbtn2'),
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    });

    $('.miniimages2').slick({
        dots: false,
        infinite: true,
        focusOnSelect: true,
        asNavFor: '.sliderimages2',
        speed: 500,
        prevArrow: $('.prevbtn2'),
        nextArrow: $('.nextbtn2'),
        slidesToShow: 8,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    });

    //#endregion slider in images page

    // -------------------------- images page

});


//WAUDG74F25N111998
//4T1BG22K9YU930834


const btn = document.getElementById('downloadImage');
const url = "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_thumb.jpg";

// btn.addEventListener('click', (e) => {
//     e.preventDefault();
//     downloadImage(url);
// })

function downloadImage(url) {
    fetch(url, {
        mode: 'cors',
    })
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = url.replace(/^.*[\\\/]/, '');
            a.href = blobUrl;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
}


var objArr = [
    {
        "win_amount": 1425,
        "currency": "USD",
        "date": "2021-02-12T07:40:50+00:00",
        "sold": false,
        "auction_lot_number": 29589213,
        "auction": "iaai",
        "odometer": {
            "value": 149163,
            "unit_of_measure": "mi",
            "status": "not_actual"
        },
        "status": "notsold",
        "primary_damage": "Left Front",
        "secondary_damage": "Left Side",
        "seller": {
            "name": "CA  Auto Sales",
            "insurance": false
        },
        "images": {
            "thumbs": [
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/2-847b85-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/3-801361-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/4-466418-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/5-2012f2-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/6-75a1ea-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/7-412ba3-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/8-c7dae5-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/9-6f6715-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/10-7394b9-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/11-9b5d99-lot_thumb.jpg"
            ],
            "previews": [
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/2-847b85-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/3-801361-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/4-466418-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/5-2012f2-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/6-75a1ea-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/7-412ba3-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/8-c7dae5-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/9-6f6715-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/10-7394b9-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/11-9b5d99-lot_preview.jpg"
            ]
        },
        "loss_type": "Collision"
    },
    {
        "win_amount": 1625,
        "currency": "USD",
        "date": "2021-02-19T07:40:50+00:00",
        "sold": false,
        "auction_lot_number": 29589213,
        "auction": "iaai",
        "odometer": {
            "value": 149163,
            "unit_of_measure": "mi",
            "status": "not_actual"
        },
        "status": "notsold",
        "primary_damage": "Left Front",
        "secondary_damage": "Left Side",
        "seller": {
            "name": "CA  Auto Sales",
            "insurance": false
        },
        "images": {
            "thumbs": [
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/2-847b85-lot_thumb.jpg", "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/3-801361-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/4-466418-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/5-2012f2-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/6-75a1ea-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/7-412ba3-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/8-c7dae5-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/9-6f6715-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/10-7394b9-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/11-9b5d99-lot_thumb.jpg"
            ],
            "previews": [
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/2-847b85-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/3-801361-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/4-466418-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/5-2012f2-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/6-75a1ea-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/7-412ba3-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/8-c7dae5-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/9-6f6715-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/10-7394b9-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/11-9b5d99-lot_preview.jpg"
            ]
        },
        "loss_type": "Collision"
    },
    {
        "win_amount": 1750,
        "currency": "USD",
        "date": "2021-02-26T07:40:50+00:00",
        "sold": true,
        "auction_lot_number": 29589213,
        "auction": "iaai",
        "odometer": {
            "value": 149163,
            "unit_of_measure": "mi",
            "status": "not_actual"
        },
        "status": "sold",
        "primary_damage": "Left Front",
        "secondary_damage": "Left Side",
        "seller": {
            "name": "CA  Auto Sales",
            "insurance": false
        },
        "images": {
            "thumbs": [
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/2-847b85-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/3-801361-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/4-466418-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/5-2012f2-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/6-75a1ea-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/7-412ba3-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/8-c7dae5-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/9-6f6715-lot_thumb.jpg", "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/10-7394b9-lot_thumb.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/11-9b5d99-lot_thumb.jpg"
            ],
            "previews": [
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/1-7145a6-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/2-847b85-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/3-801361-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/4-466418-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/5-2012f2-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/6-75a1ea-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/7-412ba3-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/8-c7dae5-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/9-6f6715-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/10-7394b9-lot_preview.jpg",
                "https://s.autoastat.com/images/iaai/2021/2/12/1HGCM56127A182028/11-9b5d99-lot_preview.jpg"
            ]
        },
        "loss_type": "Collision"
    }
]
function copyToClipboard(a) {
    var b, c, d, e = "_hiddenCopyText_",
        f = "INPUT" === a.tagName || "TEXTAREA" === a.tagName;
    if (f) g = a, b = a.selectionStart, c = a.selectionEnd;
    else {
        if (g = document.getElementById(e), !g) {
            var g = document.createElement("textarea");
            g.style.position = "absolute", g.style.left = "-9999px", g.style.top = "0", g.id = e, document.body.appendChild(g)
        }
        g.textContent = a.textContent
    }
    var h = document.activeElement;
    g.focus(), g.setSelectionRange(0, g.value.length);
    var i;
    try {
        i = document.execCommand("copy")
    } catch (j) {
        i = !1
    }
    h && "function" == typeof h.focus && h.focus(), f ? a.setSelectionRange(b, c) : g.textContent = "", $(g).addClass("copying"), d = setTimeout(function() {
        return $(g).removeClass("copying"), clearTimeout(d), i
    }, 1e3)
}
$(document).ready(function() {
    function a() {
        var a = $("#autocompleteSearch").val();
        a = a.split(' ').join('-');
        if ("" != a) {
            var b = $("#autocompleteSearch").attr("data-lang");
            "en" == b ? b = "www" : "pt" == b && (b = "br"), a = a.toLowerCase();
            var c = "http://" + b + ".vexels.com/graphics/" + a;
            console.log(c), window.location.href = c
        }
    }
    if ($("#home-header").length) {
        var b = document.querySelector("#home-header"),
            c = new Headroom(b, {
                offset: 380,
                classes: {
                    notTop: "v-header--collapsed"
                }
            });
        c.init(), $(".openoption").click(function(a) {
            a.preventDefault(), $(".cell__download-type").toggleClass("visible")
        })
    }
    $("#dinamic_credit_code").val($("#dinamic_code_holder").val()), $("#autocompleteSearch").autocomplete({
        serviceUrl: "/ajax/api-vectors/get-autocomplete/",
        minChars: 1,
        triggerSelectOnValidInput: !1,
        width: "auto",
        appendTo: $("#autocompleteSearch").parent(),
        onSelect: function(b) {
            a()
        }
    }), $("#autocompleteSearch").keypress(function(b) {
        13 == b.which && a()
    }), $("#search_form").submit(function(a) {
        a.preventDefault()
    }), $("#username").keypress(function(a) {
        13 == a.which && $("#modal_login_form").submit()
    }), $("#pass").keypress(function(a) {
        13 == a.which && $("#modal_login_form").submit()
    }), $(window).width() > 1024 && $("#menu").remove()
}), $(document).ready(function() {
    if ($("#home-header").length) {
        var a = document.querySelector("#home-header"),
            b = new Headroom(a, {
                offset: 380,
                classes: {
                    notTop: "v-header--collapsed"
                }
            });
        b.init()
    }
    if ($(".featured-list").length) try {
        console.log("Applying FlexImages to list");
        $(".featured-list").each(function() {
            $(this).flexImages({
                rowHeight: 260,
                truncate: 1,
                container: ".featured-list__item"
            })
        })
    } catch (c) {
        console.log("Error Applying FlexImages to list");
        console.log(c)
    }

    /*
    if ($(".shutter-list").length) try {
        $(".shutter-list").each(function() {
            $(this).flexImages({
                rowHeight: 120,
                truncate: 1,
                maxRows: 1,
                container: ".shutter-list__item"
            })
        })
    } catch (c) {
        console.log(c)
    }
    if ($(".shutter-list-single").length) try {
        $(".shutter-list-single").each(function() {
            $(this).flexImages({
                rowHeight: 120,
                truncate: 1,
                maxRows: 1,
                container: ".shutter-list-single__item"
            })
        })
    } catch (c) {
        console.log(c)
    }*/

    $(".openoption a").click(function(a) {
        a.preventDefault(), $(".cell__download-type").toggleClass("visible")
    }), $("#search_form").submit(function(a) {
        a.preventDefault()
    }), $(".blk__tags-list").each(function(a) {
        function b() {
            if (console.log("toggleVisible called"), c) {
                for (var b = 7; b < $(".tag", a).length; b += 1) $($(".tag", a)[b]).fadeOut();
                c = !1, $(".more-tags", a).html("+ more")
            } else $(".tag", a).fadeIn(), c = !0, $(".more-tags", a).html("- less")
        }
        console.info("TAGS LIST");
        var c = !0;
        return $(".tag", a).length <= 7 ? void $(".more-tags", a).hide() : ($(".more-tags", a).click(function(a) {
            console.log("more tags clicked"), a.preventDefault(), b()
        }), void b())
    }), $(window).width() > 1024 && $("#menu").remove(), $(".shutter-list").length && setInterval(function() {
        /*$(".shutter-list").each(function() {
            $(this).flexImages({
                rowHeight: 190,
                truncate: 1,
                container: ".shutter-list__item"
            })
        })*/
    }, 3e3)
});
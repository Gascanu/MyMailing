$(() => {
    var language = cfg.Translation[cfg.language]
    UpdateCfg(cfg.language)

    var activEmail = [
        dbid = 0,
        index = 0
    ]

    var deletedMails = 0
    var suffix = ''
    let errorCodes = [
        {label: language.errorCode1},
        {label: language.errorCode2},
        {label: language.errorCode3}
    ]

    document.addEventListener("keydown", Close);

    window.addEventListener('message', (event) => {
        if (event.data.type === 'open') {
            $('#suffix').text(event.data.suffix)
            suffix = event.data.suffix
            Open();
        } else if (event.data.type === 'registerAttempt') {
            if (event.data.LogIn) {
                var email = $('#text_email').text()
                $.post('http://myMailing/requestMails', JSON.stringify({emailAdress: email}));
                
                OpenLoadingscreen()
                
                var elem = document.getElementById("logo");
                elem.style.animation = "LogoMoveDown 3s 1"
                elem.style.top = "400px"
                elem.style.animationTimingFunction = "ease-in"
                
                var elem = document.getElementById("log_in");
                elem.style.animation = "InputMoveOut 3s 1"
                elem.style.animationTimingFunction = "ease-in"
                
                setTimeout(function(){ 
                    ShowHomePage()
                    ShowNotification('green', 'white', language.registerSuccess, language.registerSuccess_desc)
                }, 5000);
            } else {
                ShowNotification('red', 'white', language.registerFailed, language.registerFailed_desc)
            }
        } else if (event.data.type === 'loginAttempt') {
            if (event.data.LogIn) {
                
                var email = $('#text_email').text()
                $.post('http://myMailing/requestMails', JSON.stringify({emailAdress: email}));
                
                OpenLoadingscreen()
                
                var elem = document.getElementById("logo");
                elem.style.animation = "LogoMoveDown 3s 1"
                elem.style.top = "400px"
                
                var elem = document.getElementById("log_in");
                elem.style.animation = "InputMoveOut 3s 1"
                
                setTimeout(function(){ 
                    ShowHomePage()
                    // ShowNotification('green', 'white', 'Lerfolgreich!', 'Die Regestrierung war erfolgreich und du wurdest eingelogt!')
                }, 5000);
            } else {
                ShowNotification('red', 'white', language.LoginFailed, language.LoginFailed_desc)
            }
        } else if (event.data.type === 'getMails') {
            var inMails = event.data.incommingMails
            var outMails = event.data.sentMails

            $('#preview_inbox').html('')
            var newHtml = ''
            var index = 0
            inMails.forEach((v) => {
                if (v.isRead == 0) {
                    newHtml += `
                    <div class="single_preview" data-sender="${v.sender}" data-receiver="${v.receiver}" data-timestamp="${v.timestamp}" data-subject="${v.subject}" data-text="${v.content}" data-read="${v.isRead}" data-id="${index}" data-dbid="${v.id}" style="background-color: rgb(230, 240, 255); border-top: rgb(96, 160, 255) solid 1px; border-bottom: rgb(96, 160, 255) solid 1px;">
                        <h5><span id="preview_sender">${v.sender}</span></h5>
                        <h5 id="preview_date">${v.timestamp}</h5>
                        <h1>${v.subject}</h1>
                        <textarea maxlength="100" rows"3" disabled id="preview_text">${v.content.substring(0, 100)}...</textarea>
                    </div>`
                } else {
                    newHtml += `
                    <div class="single_preview" data-sender="${v.sender}" data-receiver="${v.receiver}" data-timestamp="${v.timestamp}" data-subject="${v.subject}" data-text="${v.content}" data-read="${v.isRead}" data-id="${index}" data-dbid="${v.id}">
                        <h5><span id="preview_sender">${v.sender}</span></h5>
                        <h5 id="preview_date">${v.timestamp}</h5>
                        <h1>${v.subject}</h1>
                        <textarea maxlength="100" rows"3" disabled id="preview_text">${v.content.substring(0, 100)}...</textarea>
                    </div>`
                }
                index+=1
            })
            $('#preview_inbox').html(newHtml)

            $('#preview_outbox').html('')
            var newHtml = ''
            outMails.forEach((v) => {
                newHtml += `
                <div class="single_preview" data-sender="${v.sender}" data-receiver="${v.receiver}" data-timestamp="${v.timestamp}" data-subject="${v.subject}" data-text="${v.content}" data-read="${v.isRead}" data-id="${index}" data-dbid="${v.id}">
                    <h5><span id="preview_sender">${v.receiver}</span></h5>
                    <h5 id="preview_date">${v.timestamp}</h5>
                    <h1>${v.subject}</h1>
                    <textarea maxlength="100" rows"3" disabled id="preview_text">${v.content.substring(0, 100)}...</textarea>
                </div>`
                index+=1
            })
            $('#preview_outbox').html(newHtml)
        }
    });

    $('#mail').hide();

    $('#toRegisterButton').click(() => {
        OpenRegisterMenu()
    });

    $('#toLogInButton').click(() => {
        CloseRegisterMenu()
    });

    $('#outbox_text').click(() => {
        ShowOutbox()
    });

    $('#inbox_text').click(() => {
        ShowInbox()
    });

    $('#sendmail').click(() => {
        ShowSendMail()
    });

    $('#delete').click(() => {
        DeleteMail()
    });

    $('#unread').click(() => {

        // $(this).css('border-top', 'none')
        // $(this).css('border-bottom', 'rgba(128, 128, 128, 0.5) solid 1px')
        // $(this).closest("#preview_text").css('backgroundcolor', 'white')

        var elems = document.getElementsByClassName("single_preview")
        elems[activEmail.index].style.backgroundColor = "rgb(230, 240, 255)"
        elems[activEmail.index].style.borderBottom = "rgb(96, 160, 255) solid 1px"
        elems[activEmail.index].style.borderTop  = "rgb(96, 160, 255) solid 1px"

        $.post('http://myMailing/setEmailAsUnRead', JSON.stringify({
            id: activEmail.dbid
        }));
    });

    $('#refresh').click(() => {
        $.post('http://myMailing/requestMails', JSON.stringify({emailAdress:  $('#text_email').text()}));
    });

    $('#SendIcon').click(() => {
        //data send to client; wait for the confirm
        ShowNotification('green', 'white', '', language.mailsent_desc1 + ' ' + document.getElementById("receiverEmail").value + language.mailsent_desc2)
        $.post('http://myMailing/SendNewMail', JSON.stringify({
            email: document.getElementById("receiverEmail").value,
            subject: document.getElementById("subjectEmail").value,
            text: document.getElementById("msgEmail").value,
            sender: $('#text_email').text(),
        }));
    });

    $('#logout').click(() => {
        HideHomePage()
    });

    $('#buttonRegister').click(() => {
        var email = document.getElementById("emailInput").value
        var pw = document.getElementById("passwordInput").value
        var pw2 = document.getElementById("passwordInputConfirm").value
        var pos = email.lastIndexOf("@", suffix.length);
        // console.log(pos)
        if (pos == -1) {
            if (email != '' && pw != '' && pw2 != '' && pw == pw2) {
                $('#text_email').text(email + suffix)
                $.post('http://myMailing/registerAttempt', JSON.stringify({
                    email: email,
                    password: pw
                }));
            } else {
                $('#failText').text(errorCodes[2].label)
            }
        } else {
            ShowNotification('red', 'white', language.registerFailed, language.errorCode4)
        }
    });

    $('#buttonLogIn').click(() => {
        var email = document.getElementById("emailInput").value
        var pw = document.getElementById("passwordInput").value
        if (email != '' && pw != '') {

            $('#text_email').text(email)

            $('#failText').text('')

            $.post('http://myMailing/loginAttempt', JSON.stringify({
                email: email,
                password: pw
            }));
        } else {
            $('#failText').text(errorCodes[2].label)
        }
    });

    $(document).on('click', '.single_preview', function() {
		ShowMail(
			$(this).attr('data-sender'),
			$(this).attr('data-timestamp'),
            $(this).attr('data-subject'),
            $(this).attr('data-text')
        );

        activEmail.dbid = $(this).attr('data-dbid')
        activEmail.index = $(this).attr('data-id')

        
        console.log($(this).attr('data-sender') + ' ' + $('#text_email').text() + ' ' + $(this).attr('data-receiver'))
        if ($(this).attr('data-read') == 0 && $(this).attr('data-receiver') == $('#text_email').text()) {
            // console.log($(this).attr('data-dbid') + ' ' + $(this).attr('data-id'))
            $(this).css('border-top', 'none')
            $(this).css('border-bottom', 'rgba(128, 128, 128, 0.5) solid 1px')
            $(this).closest("#preview_text").css('backgroundcolor', 'white')

            var elems = document.getElementsByClassName("single_preview")
            elems[$(this).attr('data-id')].style.backgroundColor = "white"

            $.post('http://myMailing/setEmailAsRead', JSON.stringify({
                id: $(this).attr('data-dbid')
            }));
        }
    });

    function ShowMail(sender, timestamp, subject, text) {
        $('#ShowMail').show()
        $('#from').text(sender)
        $('#ShowMail_date').text(timestamp)
        $('#ShowMail_subject_text').text(subject)
        $('#ShowMail_text').text(text)
    }

    function ShowHomePage() {
        $('#buttonRegister').hide() 
        $('#passwordInputConfirm').hide() 
        $('#toLogInText').hide() 

        var logo = document.getElementById("logo");
        logo.style.animation = "LogoMoveToFinalPosition 5s 1"

        var loading = document.getElementById("loading");
        loading.style.animation = "FadeOut 1s 1"

        var background = document.getElementById("Homepage_background");
        background.style.animation = "LeftToRight 5s 1"
        background.style.width = "1150px"

        var head = document.getElementById("Homepage_head");
        head.style.animation = "LeftToRightHead 5s 1"

        var left = document.getElementById("Homepage_left");
        left.style.animation = "LeftToRightHead 5s 1"

        // var right = document.getElementById("Homepage_right");
        // right.style.animation = "LeftToRightHead 5s 1"
        // right.style.animationTimingFunction = "ease"
        
        $('#Homepage_background').show()
        

        setTimeout(function(){ 
            $('#loading').hide()
        }, 1000);
        
        setTimeout(function(){ 
            var text = document.getElementById("Homepage_text");
            var inbox_text = document.getElementById("inbox_text");
            var outbox = document.getElementById("outbox_text");
            var send = document.getElementById("sendmail");
            var inbox = document.getElementById("inbox");

            $('#Homepage_text').show()
            $('#inbox').show()
            logo.style.top     = "180px"
            logo.style.left    = "180px"
            logo.style.width   = "130px"
            logo.style.height  = "130px"
            text.style.animation = "FadeIn 2s 1"
            inbox.style.animation = "FadeIn 2s 1"
            inbox_text.style.backgroundColor = "yellow"

            inbox.onmouseover = function() {DoNothing("inbox_text")};
            inbox.onmouseout = function() {DoNothing("inbox_text")};

            outbox.onmouseover = function() {Highlight("outbox_text", cfg.mainColor)};
            outbox.onmouseout = function() {DoNothing("outbox_text", cfg.mainColor)};

            send.onmouseover = function() {Highlight("sendmail", cfg.mainColor)};
            send.onmouseout = function() {DoNothing("sendmail", cfg.mainColor)};

            $('#log_in').hide()
            
            setTimeout(function(){ 
                inbox.style.animation = "none"
            }, 2000);
        }, 5000);
    }

    function HideHomePage() {
        var text = document.getElementById("Homepage_text");
        text.style.animation = "FadeOut 2s 1"

        var logo = document.getElementById("logo");
        logo.style.animation = "LogoMoveToFinalPositionReverse 5s 1"

        var background = document.getElementById("Homepage_background");
        background.style.animation = "LeftToRightReverse 5s 1"
        background.style.width = "1150px"

        var head = document.getElementById("Homepage_head");
        head.style.animation = "LeftToRightHeadReverse 5s 1"

        var left = document.getElementById("Homepage_left");
        left.style.animation = "LeftToRightHeadReverse 5s 1"

        var inbox = document.getElementById("inbox");
        inbox.style.animation = "FadeOut 2s 1"

        var outbox = document.getElementById("outbox");
        outbox.style.animation = "FadeOut 2s 1"

        var sendmail = document.getElementById("Send");
        sendmail.style.animation = "FadeOut 2s 1"

        var showmail = document.getElementById("ShowMail");
        showmail.style.animation = "FadeOut 2s 1"

        setTimeout(function(){ 
            logo.style.animation = "none"
            background.style.animation = "none"
            head.style.animation = "none"
            left.style.animation = "none"
            
            logo.style.top = "300px"
            logo.style.left = "50%"
            logo.style.width = "180px"
            logo.style.height = "180px"

            $('#Homepage_background').hide()
        }, 5000);
        
        setTimeout(function(){ 
            $('#Homepage_text').hide()
            $('#inbox').hide()
            $('#outbox').hide()
            $('#Send').hide()
            $('#ShowMail').hide()

            text.style.animation = "none"
            
            inbox.style.animation = "none"
            outbox.style.animation = "none"
            sendmail.style.animation = "none"
            showmail.style.animation = "none"

            var elem = document.getElementById("log_in");
            elem.style.animation = "InputMoveIn 3s 1"

            var elem = document.getElementById("buttonLogIn");
            elem.style.animation = "ButtonMoveIn 3s 1"
            elem.style.animationTimingFunction = "ease-in"

            var elem = document.getElementById("toRegisterText");
            elem.style.animation = "ButtonMoveIn 3s 1"
            elem.style.animationTimingFunction = "ease-in"

            $('#log_in').show()
            $('#buttonLogIn').show()
            $('#toRegisterText').show()
            $('#suffix').hide()
        }, 2000);
    }

    function OpenRegisterMenu() {
        var elem = document.getElementById("buttonLogIn");
        var toRegisterText = document.getElementById("toRegisterText");
        

        elem.style.animation = "ButtonMoveOut 3s 1"
        toRegisterText.style.animation = "ButtonMoveOut 3s 1"

        setTimeout(function(){ 
            $('#buttonLogIn').hide() 
            $('#toRegisterText').hide() 
            
            var button = document.getElementById("buttonRegister");
            var input = document.getElementById("passwordInputConfirm");
            var text = document.getElementById("toLogInText");
            var suffix_elem = document.getElementById("suffix");
            
            button.style.animation = "ButtonMoveIn 3s 1"
            input.style.animation = "ButtonMoveIn 3s 1"
            text.style.animation = "ButtonMoveIn 3s 1"
            suffix_elem.style.animation = "FadeIn 3s 1"

            input.style.animationTimingFunction = "ease-in"
            button.style.animationTimingFunction = "ease-in"
            text.style.animationTimingFunction = "ease-in"
            suffix_elem.style.animationTimingFunction = "ease-in"


            setTimeout(function(){ 
                $('#buttonRegister').show() 
                $('#passwordInputConfirm').show() 
                $('#toLogInText').show() 
                $('#suffix').show()
            }, 300);
        }, 3000);
    }

    function CloseRegisterMenu() {

        var button = document.getElementById("buttonRegister");
        var input = document.getElementById("passwordInputConfirm");
        var text = document.getElementById("toLogInText");

        button.style.animation = "ButtonMoveOut 3s 1"
        input.style.animation = "ButtonMoveOut 3s 1"
        text.style.animation = "ButtonMoveOut 3s 1"

        setTimeout(function(){ 
            $('#buttonRegister').hide() 
            $('#passwordInputConfirm').hide() 
            $('#toLogInText').hide() 
            $('#suffix').hide()

            var button = document.getElementById("buttonLogIn");
            var text = document.getElementById("toRegisterText");
            
            button.style.animation = "ButtonMoveIn 3s 1"
            text.style.animation = "ButtonMoveIn 3s 1"

            button.style.animationTimingFunction = "ease-in"
            text.style.animationTimingFunction = "ease-in"

            setTimeout(function(){ 
                $('#buttonLogIn').show() 
                $('#toRegisterText').show() 
            }, 300);
        }, 3000);
    }

    function DoNothing(id) {
        var elem = document.getElementById(id)
        elem.style.boxShadow = "none"
    }

    function Highlight(id, color) {
        var elem = document.getElementById(id)
        elem.style.cursor = "pointer"
        elem.style.boxShadow = "0px 0px 10px " + color
    }

    function ShowOutbox() {
        $('#Send').hide()
        $('#inbox').hide()
        $('#ShowMail').hide()

        $('#outbox').show()

        $('.fromToPrefix').text(language.fromToPrefixTo)
        
        var inbox = document.getElementById("inbox_text");
        inbox.style.backgroundColor = cfg.mainColor
        inbox.onmouseover = function() {Highlight("inbox_text", cfg.mainColor)};
        inbox.onmouseout = function() {DoNothing("inbox_text", cfg.mainColor)};

        var outbox = document.getElementById("outbox_text")
        outbox.style.backgroundColor = "yellow"
        outbox.onmouseover = function() {DoNothing("outbox_text")};
        outbox.onmouseout = function() {DoNothing("outbox_text")};

        var send = document.getElementById("sendmail")
        send.style.backgroundColor = cfg.mainColor
        send.onmouseover = function() {Highlight("sendmail", cfg.mainColor)};
        send.onmouseout = function() {DoNothing("sendmail", cfg.mainColor)};
    }
    
    function ShowInbox() {
        $('#Send').hide()
        $('#outbox').hide()
        $('#ShowMail').hide()

        $('#inbox').show()

        $('.fromToPrefix').text(language.fromToPrefixFrom)

        var inbox = document.getElementById("inbox_text");
        inbox.style.backgroundColor = "yellow"
        inbox.onmouseover = function() {DoNothing("inbox_text")};
        inbox.onmouseout = function() {DoNothing("inbox_text")};

        var outbox = document.getElementById("outbox_text")
        outbox.style.backgroundColor = cfg.mainColor
        outbox.onmouseover = function() {Highlight("outbox_text", cfg.mainColor)};
        outbox.onmouseout = function() {DoNothing("outbox_text", cfg.mainColor)};

        var send = document.getElementById("sendmail")
        send.style.backgroundColor = cfg.mainColor
        send.onmouseover = function() {Highlight("sendmail", cfg.mainColor)};
        send.onmouseout = function() {DoNothing("sendmail", cfg.mainColor)};
    }

    function ShowSendMail() {
        $('#Send').show()
        $('#ShowMail').hide()
        $('#outbox').hide()
        $('#inbox').hide()

        var inbox = document.getElementById("inbox_text");
        inbox.style.backgroundColor = cfg.mainColor
        inbox.onmouseover = function() {Highlight("inbox_text", cfg.mainColor)};
        inbox.onmouseout = function() {DoNothing("inbox_text", cfg.mainColor)};

        var send = document.getElementById("sendmail")
        send.style.backgroundColor = "yellow"
        send.onmouseover = function() {DoNothing("sendmail")};
        send.onmouseout = function() {DoNothing("sendmail")};

        var outbox = document.getElementById("outbox_text")
        outbox.style.backgroundColor = cfg.mainColor
        outbox.onmouseover = function() {Highlight("outbox_text", cfg.mainColor)};
        outbox.onmouseout = function() {DoNothing("outbox_text", cfg.mainColor)};
    }

    function ShowNotification(background, color, title, msg) {
        var elem = document.getElementById("notification");
        elem.style.backgroundColor = background
        elem.style.color = color

        $("#notification").animate({
            top: "200px",
            opacity: "1"
        },"3s");

        $('#notification').show()

        $('#notification_title').text(title)
        $('#notification_msg').text(msg)

        setTimeout(function(){ 
            $("#notification").animate({
                top: "0px",
                opacity: "0"
            },"3s");
        }, 6000);
    }

    function OpenLoadingscreen() {
        var elem = document.getElementById("loading");
        elem.style.animation = "FadeIn 3s 1"
        elem.style.animationTimingFunction = "ease-in"
    
        $('#mail').show();
        $('#loadingscreen').show();
        $('#loading').show();
        $('#log_in').hide()
        $('#Homepage_background').hide()
        $('#Homepage_text').hide()
        $('#Send').hide()
    }
    
    function Open() {
        $('#emailInput').val('')
        $('#passwordInput').val('')
        $('#passwordInputConfirm').val('')
        $('#receiverEmail').val('')
        $('#subjectEmail').val('')
        $('#msgEmail').val('')
        //$('#ShowMail_text').val('')

        var logo = document.getElementById("logo");
        logo.style.top = "300px"
        logo.style.left = "50%"
        logo.style.width = "180px"
        logo.style.height = "180px"
        logo.style.animation = "LogoMoveUp 3s 1"
        logo.style.top = "300px"
        
        var elem = document.getElementById("log_in");
        elem.style.animation = "InputMoveIn 3s 1"

        var elem = document.getElementById("buttonLogIn");
        elem.style.animation = "ButtonMoveIn 3s 1"
        elem.style.animationTimingFunction = "ease-in"

        var elem = document.getElementById("toRegisterText");
        elem.style.animation = "ButtonMoveIn 3s 1"
        elem.style.animationTimingFunction = "ease-in"
        
        $('#mail').show();
        $('#loadingscreen').show();
        $('#log_in').show()
        $('#buttonLogIn').show()
        $('#toRegisterText').show()

        $('#loading').hide()
        $('#buttonRegister').hide() 
        $('#passwordInputConfirm').hide() 
        $('#toLogInText').hide() 
        $('#Homepage_background').hide()
        $('#Homepage_text').hide()
        $('#Send').hide()
        $('#inbox').hide()
        $('#outbox').hide()
        $('#ShowMail').hide()
        $('#suffix').hide()
        
    }

    function Close(event) {
        if (event.keyCode === 27) {
            $('#mail').hide();
            $.post('http://myMailing/closeUI', JSON.stringify({}));
        }
    }

    function UpdateCfg() {
        var v = cfg.Translation[cfg.language]

        $('#buttonLogIn').text(v.buttonLogIn);
        $('#toRegisterText').html(`<p id="toRegisterText"> ` + v.toRegisterText + `<span id="toRegisterButton"> ` + v.toRegisterButton + `</span></p>`);
        $('#toLogInText').html(`<p id="toLogInText"> ` + v.toLogInText + `<span id="toLogInButton"> ` + v.toLogInButton + `</span></p>`);
        $('#buttonRegister').text(v.buttonRegister);
        $('#info').html(`<p id="info">` + v.info + ` <span id="text_email"></span></p>`);
        $('#logout').text(v.logout);
        $('#inbox_text').text(v.inbox_text);
        $('#outbox_text').text(v.outbox_text);
        $('#sendmail').text(v.sendmail);
        $('#prefixReceiver').text(v.prefixReceiver);
        $('#prefixSubject').text(v.prefixSubject);
        $('#prefixMessage').text(v.prefixMessage);
        $('.ShowMail_subject').text(v.prefixSubject);
        $('.ShowMail_msg').text(v.prefixMessage)
        $('.msgEmail').text(v.prefixMessage)
        $('#refresh').text(v.refresh)
        $('#receiverEmail').attr("placeholder", v.receiverEmail);
        $('#subjectEmail').attr("placeholder", v.subjectEmail);
        $('#emailInput').attr("placeholder", v.email);
        $('#passwordInput').attr("placeholder", v.password);
        $('#passwordInputConfirm').attr("placeholder", v.passwordrepeat);
        
        $('#buttonLogIn').css("background-color", cfg.mainColor)
        $("#buttonLogIn").hover(function(){
            $(this).css("box-shadow", "0px 0px 10px " + cfg.mainColor);
            }, function(){
            $(this).css("box-shadow", "none");
        });
        $('#toRegisterButton').css("color", cfg.mainColor)
        $('#buttonRegister').css("background-color", cfg.mainColor)
        $("#buttonRegister").hover(function(){
            $(this).css("box-shadow", "0px 0px 10px " + cfg.mainColor);
            }, function(){
            $(this).css("box-shadow", "none");
        });
        $('#toLogInButton').css("color", cfg.mainColor)
        $('#headline').css("color", cfg.mainColor)
        $('#text_email').css("color", cfg.mainColor)
        $('#inbox_text').css("background-color", cfg.mainColor)
        $('#outbox_text').css("background-color", cfg.mainColor)
        $('#sendmail').css("background-color", cfg.mainColor)
        $('#refresh').css("background-color", cfg.mainColor)
        $("#refresh").hover(function(){
            $(this).css("box-shadow", "0px 0px 10px " + cfg.mainColor);
            }, function(){
            $(this).css("box-shadow", "none");
        });
        $("#unread").hover(function(){
            $(this).css("color", cfg.mainColor);
            }, function(){
            $(this).css("color", "rgb(216, 216, 216)");
        });
    }

    function DeleteMail() {
        $.post('http://myMailing/deleteMail', JSON.stringify({
            id: activEmail.dbid
        }));    

        // console.log(activEmail.dbid + ' ' + activEmail.index + ' ' + activEmail.index-deletedMails)

        var elems = document.getElementsByClassName('single_preview')
        elems[activEmail.index-deletedMails].style.display = "none"
        $('#ShowMail').hide()
    }
});
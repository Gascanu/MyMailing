-- mail accounts
RegisterServerEvent('myMailing:registerNewMailAccount')
AddEventHandler('myMailing:registerNewMailAccount', function(mailaccount, password)
    local src = source
    exports.ghmattimysql:execute('SELECT mail FROM mail_accounts WHERE mail = @mail', {
        ['@mail'] = mailaccount,
    }, function(result)
        if #result > 0 then
            TriggerClientEvent('myMailing:receiveRegisterData', src, false)
        else
            exports.ghmattimysql:execute('INSERT INTO mail_accounts (mail, password, createdBy) VALUES (@mail, @password, @createdBy)', {
                    ['@mail'] = mailaccount, 
                    ['@password'] = password,
                    ['@createdBy'] = 'LICENSE',
                })
            TriggerClientEvent('myMailing:receiveRegisterData', src, true)
        end
    end)

end)

RegisterServerEvent('myMailing:checkMailaccount')
AddEventHandler('myMailing:checkMailaccount', function(mailaccount, password)
    local src = source
    exports.ghmattimysql:execute('SELECT mail, password FROM mail_accounts WHERE mail = @mail', {
        ['@mail'] = mailaccount,
    }, function(result)
        if #result > 0 then
            if password == result[1].password then
                TriggerClientEvent('myMailing:receiveLoginData', src, true)
            else
                TriggerClientEvent('myMailing:receiveLoginData', src, false)
            end
        else
            TriggerClientEvent('myMailing:receiveLoginData', src, false)
        end
    end)
end)


-- mail messages
RegisterServerEvent('myMailing:getMailsFromAdress')
AddEventHandler('myMailing:getMailsFromAdress', function(mailadress)
    local src = source

    local done = false
    local done2 = false
    local incommingMails = {}

    exports.ghmattimysql:execute('SELECT * FROM mail_messages WHERE receiver = @receiver ORDER BY id DESC',
    {
        ['@receiver'] = mailadress,
    }, 
    function(result)
        for i=1, #result, 1 do
            table.insert(incommingMails, result[i])
        end
        done = true
    end)

    local sentMails = {}

    exports.ghmattimysql:execute('SELECT * FROM mail_messages WHERE sender = @sender ORDER BY id DESC',
    {
        ['@sender'] = mailadress,
    }, 
    function(result)
        for i=1, #result, 1 do
            table.insert(sentMails, result[i])
        end
        done2 = false
    end)

    while (done ~= true and done2 ~= true) do
        Wait(10)
    end
    TriggerClientEvent('myMailing:receiveMailData', src, incommingMails, sentMails)
end)


RegisterServerEvent('myMailing:sendMail')
AddEventHandler('myMailing:sendMail', function(sender, receiver, subject, content, sendBy)
    exports.ghmattimysql:execute('INSERT INTO mail_messages (timestamp, sender, receiver, subject, content, isRead, sendBy) VALUES (@timestamp, @sender, @receiver, @subject, @content, @isRead, @sendBy)', {
            ['@timestamp'] = os.date(), 
            ['@sender'] = sender,
            ['@receiver'] = receiver,
            ['@subject'] = subject,
            ['@content'] = content,
            ['isRead'] = 0,
            ['@sendBy'] = sendBy,   
        })
end)

RegisterServerEvent('myMailing:setAsRead')
AddEventHandler('myMailing:setAsRead', function(mailID, state)
    exports.ghmattimysql:execute('UPDATE mail_messages SET isRead = @read WHERE id = @id ', {
        ['@read'] = state, 
        ['@id'] = mailID,
    })
end)

RegisterServerEvent('myMailing:deleteMail')
AddEventHandler('myMailing:deleteMail', function(mailID)
    exports.ghmattimysql:execute('DELETE FROM mail_messages WHERE id = @id LIMIT 1', {
            ['@id'] = mailID})
end)
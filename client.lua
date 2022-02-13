local isTabletActive = false
local isNearComputer = false
local isAtComputer = false
local currentComputer 

Citizen.CreateThread(function()
	while true do

		isAtComputer = false
		isNearComputer = false


		for k, v in pairs(Config.computers) do
			local playerPed = PlayerPedId()
			local playerCoords = GetEntityCoords(playerPed)

			local distance = #(playerCoords- vec3(v.x, v.y, v.z))
			if distance < 20.0 then
				currentComputer = v
				isNearComputer = true
			end

			if distance < 1.5 then
				isAtComputer = true
			end
		end

		Citizen.Wait(400)
	end
end)


Citizen.CreateThread(function()
	while true do
		if isNearComputer then
			
			if Config.useMarker then
				DrawMarker(27, currentComputer.x, currentComputer.y, currentComputer.z - 0.98, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0*1.0, 1.0*1.0, 1.0, 0, 0, 136, 75, false, false, 2, false, false, false, false)
			end

			if isAtComputer then
				showInfobar(Config.ComputerInfobar)
				if IsControlJustReleased(0, 38) then
					if isTabletActive then
						SetNuiFocus(false, false)
						-- CLOSE
						isTabletActive = false
					else
						SetNuiFocus(true, true)
						SendNUIMessage({type = 'open', suffix = Config.MailSuffix})
						isTabletActive = true
					end
				end
			end
		end
		Citizen.Wait(1)
	end
end)


if Config.openWithKey then
	Citizen.CreateThread(function()
		Citizen.Wait(1000)
		--SetNuiFocus(false, false)
		-- SendNUIMessage({type = 'open'})

		while true do
			
			if IsControlJustReleased(0, Config.Key) then
				if isTabletActive then
					stopAnim()
					SetNuiFocus(false, false)
					-- CLOSE
					isTabletActive = false
				else
					startAnim()
					SetNuiFocus(true, true)
					SendNUIMessage({type = 'open', suffix = Config.MailSuffix})
					isTabletActive = true
				end
			end

			Citizen.Wait(1)
		end
	end)
end

RegisterNetEvent('myMailing:open')
AddEventHandler('myMailing:open', function()

	SetNuiFocus(true, true)
	SendNUIMessage({type = 'open', suffix = Config.MailSuffix})
	isTabletActive = true

end)
-- TriggerServerEvent('myMailing:getMailsFromAdress', MAILADRESS)

RegisterNetEvent('myMailing:receiveMailData')
AddEventHandler('myMailing:receiveMailData', function(incommingMails, sentMails)
	SendNUIMessage({type = 'getMails', incommingMails = incommingMails, sentMails = sentMails})
end)

RegisterNetEvent('myMailing:receiveLoginData')
AddEventHandler('myMailing:receiveLoginData', function(bool)
	SendNUIMessage({type = 'loginAttempt', LogIn = bool})
end)

RegisterNetEvent('myMailing:receiveRegisterData')
AddEventHandler('myMailing:receiveRegisterData', function(bool)
	SendNUIMessage({type = 'registerAttempt', LogIn = bool})
end)

RegisterNUICallback('SendNewMail', function(data, cb) 
	TriggerServerEvent('myMailing:sendMail', data.sender, data.email, data.subject, data.text, '0df5301d7eff5d04fc01eee8371c1dd983d904b8')
end)

RegisterNUICallback('requestMails', function(data, cb) 
	TriggerServerEvent('myMailing:getMailsFromAdress', data.emailAdress)
end)

RegisterNUICallback('loginAttempt', function(data, cb) 
	TriggerServerEvent('myMailing:checkMailaccount', data.email, data.password)
end)

RegisterNUICallback('registerAttempt', function(data, cb) 
	TriggerServerEvent('myMailing:registerNewMailAccount', data.email .. Config.MailSuffix, data.password)
end)

RegisterNUICallback('setEmailAsRead', function(data, cb) 
	TriggerServerEvent('myMailing:setAsRead', tonumber(data.id), 1)
end)

RegisterNUICallback('deleteMail', function(data, cb)
	TriggerServerEvent('myMailing:deleteMail', tonumber(data.id))
end)

RegisterNUICallback('setEmailAsUnRead', function(data, cb)
	TriggerServerEvent('myMailing:setAsRead', tonumber(data.id), 0)
end)

RegisterNUICallback('closeUI', function(data, cb) 
	stopAnim()
	SetNuiFocus(false, false)
	-- CLOSE
	isTabletActive = false
end)

function startAnim()
	Citizen.CreateThread(function()
		RequestAnimDict("amb@world_human_seat_wall_tablet@female@base")
		while not HasAnimDictLoaded("amb@world_human_seat_wall_tablet@female@base") do
			Citizen.Wait(0)
		end
		attachObject()
		TaskPlayAnim(PlayerPedId(), "amb@world_human_seat_wall_tablet@female@base", "base" ,8.0, -8.0, -1, 50, 0, false, false, false)
	end)
end

function attachObject()
	tab = CreateObject(GetHashKey(Config.TabletObject), 0, 0, 0, true, true, true)
	AttachEntityToEntity(tab, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), 57005), 0.17, 0.10, -0.13, 20.0, 180.0, 180.0, true, true, false, true, 1, true)
end

function stopAnim()
	StopAnimTask(PlayerPedId(), "amb@world_human_seat_wall_tablet@female@base", "base" ,8.0, -8.0, -1, 50, 0, false, false, false)
	DeleteEntity(tab)
end

function showInfobar(msg)

	CurrentActionMsg  = msg
	SetTextComponentFormat('STRING')
	AddTextComponentString(CurrentActionMsg)
	DisplayHelpTextFromStringLabel(0, 0, 1, -1)

end

function ShowNotification(text)
	SetNotificationTextEntry('STRING')
    AddTextComponentString(text)
	DrawNotification(false, true)
end
const gatherBotModal = ()=> {
	return {
		"callback_id": "gatherbot_modal",
		"type": "modal",
		"title": {
			"type": "plain_text",
			"text": "GatherBot",
			"emoji": true
		},
		"submit": {
			"type": "plain_text",
			"text": "Post to #general",
			"emoji": true
		},
		"close": {
			"type": "plain_text",
			"text": "Cancel",
			"emoji": true
		},
		"blocks": [
			{
				"type": "header",
				"text": {
					"type": "plain_text",
					"text": "Hey there, and welcome!",
					"emoji": true
				}
			},
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "What would you like to to do today?"
				},
				"accessory": {
					"type": "radio_buttons",
					"initial_option": {
						"text": {
							"type": "plain_text",
							"text": "play a rousing game of Skip-Bo",
							"emoji": true,
						},
						"value": "value-0",
					},
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "play a rousing game of Skip-Bo",
								"emoji": true,
							},
							"value": "value-0",
						},
						{
							"text": {
								"type": "plain_text",
								"text": "meet up in the park",
								"emoji": true
							},
							"value": "value-1"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "have a virtual group chat",
								"emoji": true
							},
							"value": "value-2"
						}
					],
					"action_id": "radio_buttons-action"
				}
			},
			{
				"type": "input",
				"element": {
					"type": "datepicker",
					"initial_date": "2021-08-25",
					"placeholder": {
						"type": "plain_text",
						"text": "Select a date",
						"emoji": true
					},
					"action_id": "datepicker-action"
				},
				"label": {
					"type": "plain_text",
					"text": "Label",
					"emoji": true
				}
			}
		]
	}
}

const gatherBotMessage = (user, radioSelection, date) => {
	return [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Let's get together!",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `<@${user}> wants to *${radioSelection}* on *${date}*. Would you like to join? :white_check_mark:`
			}
		}
	]
}

module.exports = {
	gatherBotModal,
	gatherBotMessage
}
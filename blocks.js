// Slack Block Kit elements 
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
							"emoji": true
						},
						"value": "skipbo"
					},
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "play a rousing game of Skip-Bo",
								"emoji": true
							},
							"value": "skipbo"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "play a board game",
								"emoji": true
							},
							"value": "game"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "watch a movie",
								"emoji": true
							},
							"value": "movie"
						}
					],
					"action_id": "radio_buttons-action"
				}
			},
			{
				"type": "input",
				"element": {
					"type": "static_select",
					"placeholder": {
						"type": "plain_text",
						"text": "Choose a day",
						"emoji": true
					},
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "Monday",
								"emoji": true
							},
							"value": "monday"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Wednesday",
								"emoji": true
							},
							"value": "wednesday"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Friday",
								"emoji": true
							},
							"value": "friday"
						}
					],
					"action_id": "static_select-action"
				},
				"label": {
					"type": "plain_text",
					"text": "What day?",
					"emoji": true
				}
			},
			{
				"type": "input",
				"element": {
					"type": "static_select",
					"placeholder": {
						"type": "plain_text",
						"text": "Choose a time",
						"emoji": true
					},
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "11am",
								"emoji": true
							},
							"value": "time-0"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "1pm",
								"emoji": true
							},
							"value": "time-1"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "2pm",
								"emoji": true
							},
							"value": "time-2"
						}
					],
					"action_id": "static_select-action"
				},
				"label": {
					"type": "plain_text",
					"text": "What time?",
					"emoji": true
				}
			}
		]
	}
}

const gatherBotMessage = (gatherMsg) => {
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
				"text": gatherMsg
			}
		}
	]
}

module.exports = {
	gatherBotModal,
	gatherBotMessage
}
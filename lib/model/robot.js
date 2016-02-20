module.exports = function(data, http) {
	data.http = http;
	data.robot_id=data.robot_id;
	data.state = {
		enabled: function(callback) {
			data.
			http.
			robot_id(data.robot_id).
			update({
				"desired_state": {
					"enabled": true
         		}
			}, callback);
		},
		disabled: function(callback) {
			data.
			http.
			robot_id(data.robot_id).
			update({
				"desired_state": {
					"enabled": false
         		}
			}, callback);
		}
	}
};



/*
{
   "data":{
      "robot_id":"2692128",
      "name":"Auto Close Garage",
      "enabled":true,
      "creating_actor_type":"user",
      "creating_actor_id":"389934",
      "automation_mode":null,
      "fired_limit":0,
      "last_fired":null,
      "desired_state":{
         "enabled":true,
         "fired_limit":0
      },
      "last_reading":{
         "fired_true":"N/A",
         "fired_true_updated_at":null,
         "enabled":true,
         "enabled_updated_at":1455844966.738657,
         "fired_limit":0,
         "fired_limit_updated_at":null,
         "fired_count":0,
         "fired_count_updated_at":null,
         "fired":false,
         "fired_updated_at":null,
         "failure_email_sent":null,
         "failure_email_sent_updated_at":null,
         "desired_enabled_updated_at":1455845101.1988175,
         "desired_fired_limit_updated_at":1455845101.1988175,
         "desired_enabled_changed_at":1455844966.7460861,
         "desired_fired_limit_changed_at":1455845101.1988175
      },
      "effects":[
         {
            "effect_id":"4584987",
            "robot_id":"2692128",
            "notification_type":null,
            "recipient_actor_type":null,
            "recipient_actor_id":null,
            "scene":{
               "scene_id":"2631726",
               "name":"New Shortcut",
               "order":0,
               "members":[
                  {
                     "object_type":"garage_door",
                     "object_id":"40637",
                     "desired_state":{
                        "position":0.0
                     },
                     "local_scene_id":null
                  }
               ],
               "icon_id":224,
               "automation_mode":null
            },
            "note":null,
            "reference_object_type":null,
            "reference_object_id":null
         }
      ],
      "causes":[
         {
            "next_at":null,
            "recurrence":null,
            "condition_id":"3882592",
            "robot_id":"2692128",
            "observed_object_id":"40637",
            "observed_object_type":"garage_door",
            "observed_field":"position",
            "operator":"==",
            "value":"1.0",
            "delay":1800,
            "restricted_object_id":null,
            "restricted_object_type":null,
            "restriction_join":null,
            "restrictions":[

            ]
         }
      ],
      "restrictions":[

      ]
   },
   "errors":[

   ],
   "pagination":{

   }
}
*/

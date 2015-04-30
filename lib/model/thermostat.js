module.exports = function(data, http) {
	data.http = http;
	data.device_group = "thermostats";
	data.device_id = data.thermostat_id;
    data.temperature = function(temperature, temp_min, unit, callback) {
        if ( typeof(temperature) === 'function' ) {
            callback = temperature;
            callback(data.desired_state.max_set_point);
            return;
        } else if ( temperature === undefined ) {
            return data.desired_state.max_set_point;
        } else if ( isNaN(temperature) ) {
            // this is a getter with a temp
            var temp;
            var unit = temperature

            switch(unit) {
                case 'c':
                case 'C':
                    temp = data.desired_state.max_set_point;
                    break;
                case 'f':
                case 'F':
                    temp = Math.round((data.desired_state.max_set_point * (9/5)) + 32);
                    break; 
                default:
                    console.log('invalid temp unit');
                    break;
            }

            if ( typeof(temp_min) === 'function' ) {
                callback = temp_min;
                callback(temp);
            } else {
                return temp;
            }
        }

        if ( typeof(temp_min) === 'function' ) {
            callback = temp_min;
            temp_min = undefined;
        } else if ( temp_min !== undefined && isNaN(temp_min)) {
            callback = unit;
            unit = temp_min;
            temp_min = undefined;
        } 

        if ( typeof(unit) === 'function' ) {
            callback = unit;
            unit = undefined;
        }

        switch(unit) {
            case "f":
            case "F":
                unit = "f";
                break;
            case "c":
            case "C":
                unit = "c";
                break;
            default:
                unit = data.units.temperature;
                break;
        }

        if ( unit === "f" ) {
            // convert to celsius
            temperature = (temperature - 32) * (5/9);
        } 

        if ( temp_min === undefined ) {
            temp_min = temperature - 2;
        }

        data.
        http.
        device_group(data.device_group).
        device_id(data.device_id).
        update({
            "desired_state": {
                "min_set_point": temp_min,
                "max_set_point": temperature
            }
        }, callback);
    }
	//data.quantity = (data.eggs.filter(function(val){ return !!val})).length;
	
	return data;
}

/*
	{
            "thermostat_id": "54114",
            "name": "Home Downstairs Thermostat",
            "locale": "en_us",
            "units": {
                "temperature": "f"
            },
            "created_at": 1430018697,
            "hidden_at": null,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "mode": "cool_only",
                "powered": true,
                "min_set_point": 20,
                "max_set_point": 22,
                "users_away": false,
                "fan_timer_active": false
            },
            "manufacturer_device_model": "nest",
            "manufacturer_device_id": "zcx9ETvEqC3IdY6KyWEhbUxx11Qobba_",
            "device_manufacturer": "nest",
            "model_name": "Learning Thermostat",
            "upc_id": "168",
            "hub_id": null,
            "local_id": null,
            "radio_type": null,
            "linked_service_id": "102939",
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1430080036.6664212,
                "mode": "cool_only",
                "mode_updated_at": 1430080036.6664522,
                "powered": true,
                "powered_updated_at": 1430080036.666473,
                "min_set_point": 20,
                "min_set_point_updated_at": 1430018767.7561078,
                "max_set_point": 22,
                "max_set_point_updated_at": 1430080036.6664915,
                "users_away": false,
                "users_away_updated_at": 1430080036.6665094,
                "fan_timer_active": false,
                "fan_timer_active_updated_at": 1430080036.666485,
                "temperature": 23,
                "temperature_updated_at": 1430080036.666439,
                "external_temperature": null,
                "external_temperature_updated_at": null,
                "deadband": 1.5,
                "deadband_updated_at": 1430080036.6664457,
                "min_min_set_point": null,
                "min_min_set_point_updated_at": null,
                "max_min_set_point": null,
                "max_min_set_point_updated_at": null,
                "min_max_set_point": null,
                "min_max_set_point_updated_at": null,
                "max_max_set_point": null,
                "max_max_set_point_updated_at": null,
                "modes_allowed": [
                    "auto",
                    "heat_only",
                    "cool_only"
                ],
                "modes_allowed_updated_at": 1430080036.6664972,
                "units": "f",
                "units_updated_at": 1430080036.6664321,
                "eco_target": false,
                "eco_target_updated_at": 1430080036.6664586,
                "manufacturer_structure_id": "mNN4pWJ2yWpMfFSjA_drSBU1RSNN0MXjiHypikpG4mwMnXS-pHxfPw",
                "manufacturer_structure_id_updated_at": 1430080036.6664662,
                "has_fan": true,
                "has_fan_updated_at": 1430080036.6664789,
                "fan_duration": 0,
                "fan_duration_updated_at": 1430080036.6665034,
                "last_error": "too_many_requests",
                "last_error_updated_at": 1430019684.2469466,
                "desired_mode": "cool_only",
                "desired_mode_updated_at": 1430018697.5703063,
                "desired_powered": true,
                "desired_powered_updated_at": 1430018801.7444894,
                "desired_min_set_point": 20,
                "desired_min_set_point_updated_at": 1430018765.197387,
                "desired_max_set_point": 22,
                "desired_max_set_point_updated_at": 1430067786.578795,
                "desired_users_away": false,
                "desired_users_away_updated_at": 1430018697.5703213,
                "desired_fan_timer_active": false,
                "desired_fan_timer_active_updated_at": 1430018697.5703301
            },
            "lat_lng": [
                26.266677,
                -80.127683
            ],
            "location": "",
            "smart_schedule_enabled": false
        }
*/

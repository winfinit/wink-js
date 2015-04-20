module.exports = function(data, http) {
	data.http = http;
	data.device_group = "eggtrays";
	data.device_id = data.eggtray_id;
	data.quantity = (data.eggs.filter(function(val){ return !!val})).length;
	
	return data;
}

/*
	{
	    "last_reading": {
	        "connection": null,
	        "connection_updated_at": null,
	        "battery": 0.18,
	        "battery_updated_at": 1429541274.5857081,
	        "inventory": 1,
	        "inventory_updated_at": 1429541274.631489,
	        "age": 1429454667,
	        "age_updated_at": 1429541274.6315,
	        "freshness_remaining": 1727793,
	        "freshness_remaining_updated_at": 1429541274.6315074,
	        "egg_1_timestamp": 0,
	        "egg_1_timestamp_updated_at": 1429541274.5594687,
	        "egg_2_timestamp": 0,
	        "egg_2_timestamp_updated_at": 1429541274.559478,
	        "egg_3_timestamp": 0,
	        "egg_3_timestamp_updated_at": 1429541274.5594845,
	        "egg_4_timestamp": 0,
	        "egg_4_timestamp_updated_at": 1429541274.5594902,
	        "egg_5_timestamp": 0,
	        "egg_5_timestamp_updated_at": 1429541274.5594962,
	        "egg_6_timestamp": 0,
	        "egg_6_timestamp_updated_at": 1429541274.5595021,
	        "egg_7_timestamp": 0,
	        "egg_7_timestamp_updated_at": 1429541274.559508,
	        "egg_8_timestamp": 0,
	        "egg_8_timestamp_updated_at": 1429541274.5595133,
	        "egg_9_timestamp": 0,
	        "egg_9_timestamp_updated_at": 1429541274.559519,
	        "egg_10_timestamp": 0,
	        "egg_10_timestamp_updated_at": 1429541274.5595248,
	        "egg_11_timestamp": 0,
	        "egg_11_timestamp_updated_at": 1429541274.5595305,
	        "egg_12_timestamp": 1429454667,
	        "egg_12_timestamp_updated_at": 1429541274.5595367,
	        "egg_13_timestamp": 0,
	        "egg_13_timestamp_updated_at": 1429541274.559543,
	        "egg_14_timestamp": 0,
	        "egg_14_timestamp_updated_at": 1429541274.5595486
	    },
	    "eggs": [
	        0,
	        0,
	        0,
	        0,
	        0,
	        0,
	        0,
	        0,
	        0,
	        0,
	        0,
	        1429454667,
	        0,
	        0
	    ],
	    "freshness_period": xxx,
	    "eggtray_id": "xxx",
	    "name": "Egg Minder",
	    "locale": "en_us",
	    "units": {},
	    "created_at": xxx,
	    "hidden_at": null,
	    "capabilities": {},
	    "triggers": [],
	    "device_manufacturer": "quirky_ge",
	    "model_name": "Egg Minder",
	    "upc_id": "23",
	    "lat_lng": [
	        26.496337,
	        -80.063654
	    ],
	    "location": "",
	    "mac_address": "xxx",
	    "serial": "xxx"
	}
*/

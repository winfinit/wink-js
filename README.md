# wink-js

**wink-js** is a library that allows one to access wink API resources from a user perspective. Its target is to simplify integrations with wink backend and hopefully allow more people to create fun applications for your wink connected home.

**This is not an official library from wink, please do not contact them for support, however you can always open bugs against this project on github**

official wink api documentaton URI <http://docs.wink.apiary.io/>

## Synopsis

```javascript
var wink = require('wink-js');

wink.init({
    "client_id": "xxx",
    "client_secret": "xxx",
    "username": "xxx@example.com",
    "password": "Xx*.x!"
}, function(auth_return) {
    if ( auth_return === undefined ) {
        // error
    } else {
        // success
        wink.user().device('Kitchen lights', function(device) {
            device.power.off(function(response) {
                if (response === undefined) {
                    // error
                } else {
                    // success
                }
            });
        });
    }
});
```
## Methods
# .init()
Initialize wink framework (performs login)

```javascript
wink.init(obj, callback);
```
* **obj**
    * **conf:** path to configuraiton file with settings below (*optional*)
    * **client_id:** Client id issued by wink support
    * **client_secret:** Client secret issued by wink support
    * **username:** username(email) used to login to wink app
    * **password:** password used to login to wink app

```javascript
wink.init({
    "client_id": "xxx",
    "client_secret": "xxx",
    "username": "xxx@example.com",
    "password": "Xx*.x!"
});

wink.init({
    conf: "/path/to/config.json"
}, callback);

/*
# config.json:
{
    "client_id": "CLIENT_ID_HERE",
    "client_secret": "CLIENT_SECRET_HERE",
    "username": "WINK_EMAIL_HERE",
    "password": "WINK_PASSWORD_HERE"
}
*/
```

response:
```javascript
// callback(data)
{
    "data": {
        "access_token": "xxx",
        "refresh_token": "xxx",
        "token_type": "bearer",
        "token_endpoint": "https://winkapi.quirky.com/oauth2/token"
    },
    "errors": [],
    "pagination": {},
    "access_token": "xxx",
    "refresh_token": "xxx",
    "token_type": "bearer",
    "token_endpoint": "https://winkapi.quirky.com/oauth2/token"
}
```


---
# .user()
Perform operations on behalf of a user

```javasript
wink.user(userId);
```

* **userId:** defaults to "me" (logged in user)

## .get(callback)
Retrieve user information

```javascript
wink.user().get(callback);
```

response:

```javascript
// callback(data)
{
    "data": {
        "user_id": "1234",
        "first_name": "John",
        "last_name": "Doe",
        "email": "myemail@example.com",
        "locale": "en_us",
        "units": {},
        "tos_accepted": true,
        "confirmed": true,
        "last_reading": {
            "units": null,
            "units_updated_at": null,
            "desired_units": null,
            "desired_units_updated_at": null
        }
    },
    "errors": [],
    "pagination": {}
}
```

## .linked_services
Linked wink services namespace

### .get(callback)
Retrieve list of linked services

```javascript
wink.user().linked_services.get(callback);
```

response:
```javascript
// callback(data)
{
    "data": [],
    "errors": [],
    "pagination": {
        "count": 0
    }
}
```

## .devices(device_type?, callback)
Retrieve list of devices associated with account, and inflates each
device into its respective object with availabe actions, for more 
details on available actions, see **Models** section

```javascript
wink.user().devices(callback);
wink.user().devices('light_bulbs', callback);
```

* **device_type (*optional*):** defaulted to "wink_devices"

response:

```javascript
// callback(data)
{
    "data": [
        {
            "hub_id": "xxx",
            "name": "Hub",
            "locale": "en_us",
            "units": {},
            "created_at": 1425689198,
            "hidden_at": null,
            "capabilities": {
                "oauth2_clients": [
                    "wink_hub"
                ]
            },
            "triggers": [],
            "desired_state": {
                "pairing_mode": null
            },
            "manufacturer_device_model": "wink_hub",
            "manufacturer_device_id": null,
            "device_manufacturer": "wink",
            "model_name": "Hub",
            "upc_id": "15",
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429500244.4901872,
                "agent_session_id": "xxx",
                "agent_session_id_updated_at": 1429500216.915741,
                "remote_pairable": true,
                "remote_pairable_updated_at": 1428161420.4011638,
                "updating_firmware": false,
                "updating_firmware_updated_at": 1429500216.2100337,
                "app_rootfs_version": "00.86",
                "app_rootfs_version_updated_at": 1429500217.4185543,
                "firmware_version": "0.86.0",
                "firmware_version_updated_at": 1429500217.4185324,
                "update_needed": false,
                "update_needed_updated_at": 1429500217.4185612,
                "mac_address": "xxx",
                "mac_address_updated_at": 1429500217.41854,
                "ip_address": "10.0.1.7",
                "ip_address_updated_at": 1429500217.4185476,
                "hub_version": "00.01",
                "hub_version_updated_at": 1429500217.418519,
                "pairing_mode": null,
                "pairing_mode_updated_at": 1427841692.0884776,
                "desired_pairing_mode": null,
                "desired_pairing_mode_updated_at": 1427841692.088467
            },
            "lat_lng": [
                26.010181,
                -80.146535
            ],
            "location": "",
            "configuration": {
                "kidde_radio_code": 0
            },
            "update_needed": false,
            "uuid": "xxx"
        },
        {
            "light_bulb_id": "xxx",
            "name": "Office",
            "locale": "en_us",
            "units": {},
            "created_at": 1425698691,
            "hidden_at": null,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "powered": true,
                "brightness": 1
            },
            "manufacturer_device_model": "ge_",
            "manufacturer_device_id": null,
            "device_manufacturer": "ge",
            "model_name": "GE light bulb",
            "upc_id": "xxx",
            "hub_id": "xxx",
            "local_id": "1",
            "radio_type": "zigbee",
            "linked_service_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429500818.8442252,
                "firmware_version": "0.1b03 / 0.4b00",
                "firmware_version_updated_at": 1429500818.8442593,
                "firmware_date_code": "20140812",
                "firmware_date_code_updated_at": 1429500818.8442357,
                "powered": true,
                "powered_updated_at": 1429500818.844245,
                "brightness": 1,
                "brightness_updated_at": 1429500818.844252,
                "desired_powered": true,
                "desired_powered_updated_at": 1428490204.9604716,
                "desired_brightness": 1,
                "desired_brightness_updated_at": 1425698897.9915164
            },
            "lat_lng": [
                null,
                null
            ],
            "location": "",
            "order": 0
        },
        {
            "last_reading": {
                "connection": null,
                "connection_updated_at": null,
                "battery": 0.18,
                "battery_updated_at": 1429497969.3582497,
                "inventory": 1,
                "inventory_updated_at": 1429497969.3756864,
                "age": 1429454667,
                "age_updated_at": 1429497969.3756976,
                "freshness_remaining": 1771098,
                "freshness_remaining_updated_at": 1429497969.375706,
                "egg_1_timestamp": 0,
                "egg_1_timestamp_updated_at": 1429497969.3104246,
                "egg_2_timestamp": 0,
                "egg_2_timestamp_updated_at": 1429497969.310436,
                "egg_3_timestamp": 0,
                "egg_3_timestamp_updated_at": 1429497969.3104434,
                "egg_4_timestamp": 0,
                "egg_4_timestamp_updated_at": 1429497969.310451,
                "egg_5_timestamp": 0,
                "egg_5_timestamp_updated_at": 1429497969.3104584,
                "egg_6_timestamp": 0,
                "egg_6_timestamp_updated_at": 1429497969.310465,
                "egg_7_timestamp": 0,
                "egg_7_timestamp_updated_at": 1429497969.3104732,
                "egg_8_timestamp": 0,
                "egg_8_timestamp_updated_at": 1429497969.3104823,
                "egg_9_timestamp": 0,
                "egg_9_timestamp_updated_at": 1429497969.3104892,
                "egg_10_timestamp": 0,
                "egg_10_timestamp_updated_at": 1429497969.310498,
                "egg_11_timestamp": 0,
                "egg_11_timestamp_updated_at": 1429497969.3105059,
                "egg_12_timestamp": 1429454667,
                "egg_12_timestamp_updated_at": 1429497969.3105128,
                "egg_13_timestamp": 0,
                "egg_13_timestamp_updated_at": 1429497969.3105197,
                "egg_14_timestamp": 0,
                "egg_14_timestamp_updated_at": 1429497969.3105266
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
            "freshness_period": 1814400,
            "eggtray_id": "147424",
            "name": "Egg Minder",
            "locale": "en_us",
            "units": {},
            "created_at": 1425701549,
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
        },
        {
            "light_bulb_id": "xxx",
            "name": "Stairs",
            "locale": "en_us",
            "units": {},
            "created_at": 1426846362,
            "hidden_at": null,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "powered": false,
                "brightness": 1
            },
            "manufacturer_device_model": "lutron_p_pkg1_p_wh_d",
            "manufacturer_device_id": null,
            "device_manufacturer": "lutron",
            "model_name": "Caseta Lamp Dimmer & Pico",
            "upc_id": "xx",
            "hub_id": "xxx",
            "local_id": "2",
            "radio_type": "lutron",
            "linked_service_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429500245.3731902,
                "powered": false,
                "powered_updated_at": 1429500245.3732066,
                "brightness": 1,
                "brightness_updated_at": 1429500245.3731997,
                "desired_powered": false,
                "desired_powered_updated_at": 1429328338.4158955,
                "desired_brightness": 1,
                "desired_brightness_updated_at": 1427330529.0827518
            },
            "lat_lng": [
                null,
                null
            ],
            "location": "",
            "order": 0
        },
        {
            "remote_id": "xxx",
            "name": "Stairs up wallmount",
            "members": [
                {
                    "object_type": "light_bulb",
                    "object_id": "xxx",
                    "desired_state": {
                        "powered": false,
                        "powered_updated_at": 1429328338.4158955,
                        "brightness": 1,
                        "brightness_updated_at": 1427330529.0827518
                    }
                }
            ],
            "locale": "en_us",
            "units": {},
            "created_at": 1426847605,
            "hidden_at": null,
            "capabilities": {},
            "desired_state": {},
            "device_manufacturer": "lutron",
            "model_name": "Pico",
            "upc_id": "xx",
            "hub_id": "xxx",
            "local_id": "3",
            "radio_type": "lutron",
            "last_reading": {
                "connection": null,
                "connection_updated_at": null,
                "remote_pairable": true,
                "remote_pairable_updated_at": 1428161420.4384034
            },
            "lat_lng": [
                26.496324,
                -80.063659
            ],
            "location": ""
        },
        {
            "remote_id": "xxx",
            "name": "Stairs detached",
            "members": [
                {
                    "object_type": "light_bulb",
                    "object_id": "xxx",
                    "desired_state": {
                        "powered": false,
                        "powered_updated_at": 1429328338.4158955,
                        "brightness": 1,
                        "brightness_updated_at": 1427330529.0827518
                    }
                }
            ],
            "locale": "en_us",
            "units": {},
            "created_at": 1426896325,
            "hidden_at": null,
            "capabilities": {},
            "desired_state": {},
            "device_manufacturer": "lutron",
            "model_name": "Pico",
            "upc_id": "xx",
            "hub_id": "xxx",
            "local_id": "4",
            "radio_type": "lutron",
            "last_reading": {
                "connection": null,
                "connection_updated_at": null,
                "remote_pairable": true,
                "remote_pairable_updated_at": 1428161420.4671366
            },
            "lat_lng": [
                26.481714,
                -80.0851
            ],
            "location": ""
        },
        {
            "light_bulb_id": "111",
            "name": "Kitchen",
            "locale": "en_us",
            "units": {},
            "created_at": 1427841678,
            "hidden_at": null,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "powered": false,
                "brightness": 0.76
            },
            "manufacturer_device_model": "lutron_p_pkg1_w_wh_d",
            "manufacturer_device_id": null,
            "device_manufacturer": "lutron",
            "model_name": "Caseta Wireless Dimmer & Pico",
            "upc_id": "3",
            "hub_id": "xxx",
            "local_id": "5",
            "radio_type": "lutron",
            "linked_service_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429500246.530256,
                "powered": false,
                "powered_updated_at": 1429500246.5302837,
                "brightness": 0.76,
                "brightness_updated_at": 1429500246.5302727,
                "desired_powered": false,
                "desired_powered_updated_at": 1429495229.6978345,
                "desired_brightness": 0.76,
                "desired_brightness_updated_at": 1429500246.5847015
            },
            "lat_lng": [
                26.49635,
                -80.063667
            ],
            "location": "",
            "order": 0
        },
        {
            "hub_id": "xxx",
            "name": "Hub",
            "locale": "en_us",
            "units": {},
            "created_at": 1429049123,
            "hidden_at": null,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "pairing_mode": null
            },
            "manufacturer_device_model": "philips",
            "manufacturer_device_id": "xxx",
            "device_manufacturer": null,
            "model_name": null,
            "upc_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429049123.3954115,
                "agent_session_id": null,
                "agent_session_id_updated_at": null,
                "remote_pairable": null,
                "remote_pairable_updated_at": null,
                "updating_firmware": null,
                "updating_firmware_updated_at": null,
                "app_rootfs_version": null,
                "app_rootfs_version_updated_at": null,
                "firmware_version": null,
                "firmware_version_updated_at": null,
                "update_needed": false,
                "update_needed_updated_at": 1429049123.3314805,
                "mac_address": null,
                "mac_address_updated_at": null,
                "ip_address": null,
                "ip_address_updated_at": null,
                "hub_version": null,
                "hub_version_updated_at": null,
                "pairing_mode": null,
                "pairing_mode_updated_at": null,
                "desired_pairing_mode": null,
                "desired_pairing_mode_updated_at": null
            },
            "lat_lng": [
                null,
                null
            ],
            "location": "",
            "configuration": null,
            "update_needed": false,
            "uuid": "xxx"
        },
        {
            "light_bulb_id": "xxx",
            "name": "LightStrips 2",
            "locale": "en_us",
            "units": {},
            "created_at": 1429049124,
            "hidden_at": 1429203619,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "powered": true,
                "brightness": 1
            },
            "manufacturer_device_model": "LST001",
            "manufacturer_device_id": "xxx",
            "device_manufacturer": "philips",
            "model_name": "HUE A19 Lighting Kit",
            "upc_id": "1",
            "hub_id": "137069",
            "local_id": "2",
            "radio_type": null,
            "linked_service_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429049124.3448753,
                "powered": null,
                "powered_updated_at": null,
                "brightness": null,
                "brightness_updated_at": null,
                "desired_powered": true,
                "desired_powered_updated_at": 1429049124.2762687,
                "desired_brightness": 1,
                "desired_brightness_updated_at": 1429049124.2762783
            },
            "lat_lng": [
                null,
                null
            ],
            "location": "",
            "order": 0
        },
        {
            "light_bulb_id": "xxx",
            "name": "LightStrips 1",
            "locale": "en_us",
            "units": {},
            "created_at": 1429049124,
            "hidden_at": 1429321559,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "powered": true,
                "brightness": 1
            },
            "manufacturer_device_model": "LST001",
            "manufacturer_device_id": "xxx",
            "device_manufacturer": "philips",
            "model_name": "HUE A19 Lighting Kit",
            "upc_id": "1",
            "hub_id": "xxx",
            "local_id": "1",
            "radio_type": null,
            "linked_service_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429049124.4880855,
                "powered": null,
                "powered_updated_at": null,
                "brightness": null,
                "brightness_updated_at": null,
                "desired_powered": true,
                "desired_powered_updated_at": 1429049124.393545,
                "desired_brightness": 1,
                "desired_brightness_updated_at": 1429049124.3935578
            },
            "lat_lng": [
                null,
                null
            ],
            "location": "",
            "order": 0
        }
    ],
    "errors": [],
    "pagination": {
        "count": 10
    }
}
```

## .device(device_name, callback)
Retrieve device by its name

```javascript
wink.user().device('Office lights', function(light_obj){
    // do whatever with light object
});
```

---

# Models

### device_group 
*String* device type id: "light_bulbs"

### device_id
*Number* device identifier

===

## Lights (light_bulbs group)

### brightness(level, callback)
Set level of brighntess (0-100);

### *power*

#### on(callback)
turn on lights

#### off(callback)
turn off lights

#### toggle(callback)
toggle lights


```javascript
wink.user().device('Stairs', function(device) {
    device.power.on(callback);
});
wink.user().device('Stairs', function(device) {
    device.power.off(callback);
});
wink.user().device('Stairs', function(device) {
    device.power.toggle(callback);
});
wink.user().device('Stairs', function(device) {
    device.brightness(50, callback);
});
```

raw response from wink:

```javascript
{
            "light_bulb_id": "xxx",
            "name": "Stairs",
            "locale": "en_us",
            "units": {},
            "created_at": 1426846362,
            "hidden_at": null,
            "capabilities": {},
            "triggers": [],
            "desired_state": {
                "powered": false,
                "brightness": 1
            },
            "manufacturer_device_model": "lutron_p_pkg1_p_wh_d",
            "manufacturer_device_id": null,
            "device_manufacturer": "lutron",
            "model_name": "Caseta Lamp Dimmer & Pico",
            "upc_id": "33",
            "hub_id": "114516",
            "local_id": "2",
            "radio_type": "lutron",
            "linked_service_id": null,
            "last_reading": {
                "connection": true,
                "connection_updated_at": 1429500245.3731902,
                "powered": false,
                "powered_updated_at": 1429500245.3732066,
                "brightness": 1,
                "brightness_updated_at": 1429500245.3731997,
                "desired_powered": false,
                "desired_powered_updated_at": 1429328338.4158955,
                "desired_brightness": 1,
                "desired_brightness_updated_at": 1427330529.0827518
            },
            "lat_lng": [
                null,
                null
            ],
            "location": "",
            "order": 0
}
```

## Eggtray

### quantity
*Number* Returns quantity of eggs

raw response:

```javascript
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
        "freshness_period": 1814400,
        "eggtray_id": "xxx",
        "name": "Egg Minder",
        "locale": "en_us",
        "units": {},
        "created_at": 1425701549,
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
```

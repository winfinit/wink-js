FORMAT: 1A

HOST: https://winkapi.quirky.com

# Wink API
The Wink API connects Wink devices to users, apps, each other, and the wider web.


# Group A RESTful Service
The Wink API is a [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) service.

## Authentication
Nearly every request to the Wink API requires an OAuth bearer token.

Exceptions to this rule will be documented.

## Content types
Nearly every request to the Wink API should be expressed as JSON.

Nearly every response from the Wink API will be expressed as JSON.

Exceptions to this rule will be documented.

## HTTP verbs
The Wink API uses HTTP verbs in pretty standard ways:

- GET for retrieving information without side-effects
- PUT for updating existing resources, with partial-update semantics supported
- POST for creating new resources or blind upserts of existing resources
- DELETE for destructive operations on existing resurces

## Identifiers
A resource of type "foo" will typically have a field "foo_id", which is it's identifier.  **Identifiers are strings**, even if they contain only numeric characters.

A foo_id is guaranteed to be unique across all resources of type foo, but **need not be unique** across all resources in the API.  If you are caching by id, make sure to include the resource type as well as the resource id as part of your cache key.

It is possible for the API to re-assign identifiers to resources to rebalance keys; in this case, your resource will still exist but it (and all references to it) will be updated to the new identifier.  Your application should be able to handle this case.

## Creatable vs. permanent
The term "creatable" will describe a resource which may be created and/or destroyed by the user.

The term "permanent" will describe a resource which may not be directly created or deleted by a user.

Note that permanent **does not imply** that the resource will always exist, just that the user may not create or destroy it.  Under no circumstances should you assume that a resource will always exist.

## Mutable vs. immutable
The term "mutable" will describe a resource or attribute which the user may modify at will, assuming the user has the necessary permissions to do so.

The term "immutable" will describe a resouce or attribute which may not be modified directly by the user.

Note that immutable **does not imply** that the resource or attribute will never change, just that the user may not directly change it.  Under no circumstances should you assume that a resource or attribute will always remain the same.

## Error states
The common [HTTP Response Status Codes](https://github.com/for-GET/know-your-http-well/blob/master/status-codes.md) are used.

# Group OAuth
Authentication to the API

## Obtain access token [/oauth2/token]
### Sign in as user, or refresh user's expired access token [POST]

Note that unlike most other calls, this call does not require (and in fact should not use) an OAuth 2.0 bearer token.

+ Request Sign in as user (application/json)

        {
            "client_id": "consumer_key_goes_here",
            "client_secret": "consumer_secret_goes_here",
            "username": "user@example.com",
            "password": "password_goes_here",
            "grant_type": "password"
        }

+ Request Refresh expired access token (application/json)

        {
            "client_id": "consumer_key_goes_here",
            "client_secret": "consumer_secret_goes_here",
            "grant_type": "refresh_token",
            "refresh_token": "crazy_token_like_240qhn16hwrnga05euynaoeiyhw52_goes_here"
        }

+ Response 201 (application/json)

        {
            "data": {
                "access_token": "example_access_token_like_135fhn80w35hynainrsg0q824hyn",
                "refresh_token": "crazy_token_like_240qhn16hwrnga05euynaoeiyhw52_goes_here",
                "token_type": "bearer"
            }
        }

# Group User
Resources for Users

A user has the following specific attributes:

- user_id (string, assigned, immutable)
- email (string, writable, mutable)
- first_name (string, writable, mutable)
- last_name (string, writable, mutable)

## User [/users]

### Create user [POST]
+ Request (application/json)

    + Body

            {
                "client_id": "...",
                "client_secret": "...",
                "email": "user@example.com",
                "first_name": "User",
                "last_name": "McUserson",
                "locale": "en_us",
                "new_password": "********"
            }

+ Response 201 (application/json)

        {
            "user_id": "27412",
            "first_name": "User",
            "last_name": "McUserson",
            "email": "user@example.com",
            "oauth2": {
              "access_token": "example_access_token_like_135fhn80w35hynainrsg0q824hyn",
              "refresh_token": "...",
              "token_type": "bearer",
              "token_endpoint": "https://winkapi.quirky.com/oauth2/token"
            },
            "locale": "en_us",
            "units": {},
            "tos_accepted": false,
            "confirmed": false
        }


## User [/users/{user_id}]

+ Model (application/json)

    JSON representation of an user

    + Body

            {
                "data":{
                    "user_id":"27105",
                    "first_name":"User",
                    "last_name":"McUserson",
                    "email":"user@example.com",
                    "oauth2":{
                        "access_token":"55bb2ce8488d7ff9313be76668a43ea0",
                        "refresh_token":"d30d2dcf5f33411b7a225e9e63952d84",
                        "token_type":"bearer",
                        "token_endpoint":"http://localhost:3000/oauth2/token"
                    },
                    "locale":"en_us",
                    "units":{
                    },
                    "tos_accepted":false
                },
                "errors":[
                ],
                "pagination":{
                }
            }

+ Parameters
    - user_id (required, string, `21212`) ... String `user_id` of the user to perform action on. Has example value.

### Update current user's profile [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "email": "user@example.com",
            }

+ Response 200 (application/json)

        {
            "data": {
                "user_id": "abc123def-an15nag",
                "email": "user@example.com"
            }
        }
        
## User password [/users/{user_id}/update_password]

### update password [POST]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "old_password" : '123456'
                "new_password" : '654321'
            }

+ Response 200 (application/json)

        {}



# Group Linked services

# Linked services [/users/me/linked_services]

## List current user's linked services [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

        [{
            "linked_service_id": "aad234fce-oanqtqi1",
            "service": "facebook",
            "account": "123456789",
        }, {
            "linked_service_id": "bbe345edd-q2it1ahnh",
            "service": "twitter",
            "account": "158159-16-91245263-96246",
        }]

## Create new linked service [POST]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "service": "google",
                "account": "user@example.com"
            }

+ Response 201 (application/json)

        {
            "linked_service_id": "ccf678dec-aing10fm", "title": "Buy cheese and bread for breakfast."
        }



# Group Wink Device

These resources are shared among multiple wink devices

## specific_device [/{device_type}/{device_id}]

Each Wink Device can have the following attributes, but not all attributes will be populate

Prepare to receive null for any one of these. For specific implementations, refer to the device documentation of the given device type.

- name (String, writable)
- locale (String, format LL_CC -- "en_us", "fr_fr")
- units (object, specific to device)
- created_at (long, timestamp, immutable)

- manufacturer_device_model (String, assigned, pretty, printable string of model of device)
- manufatcurer_device_id (String, assigned, udid of third party device in third party system)
- hub_id (String, id of hub associated with device, only for devices with hub)
- local_id (String, local id of device on hub, only for devices with hub)
- radio_type (String, radio type of device, currently only for devices with hub) ["clearconnect", "zwave"]
- device_manufacturer (String, manufacturer of device) ["lutron", "tcp", "schlage", "kwikset", "somfy", "honeywell", "leviton", "hue"]
- lat_lng (tuple of floats, location of device)
- location (String, pretty printable location of device)
- desired_state(object, values of requested state. Depends on object type)
- last_reading (object, values of last reading from device. Depends on object type)

+ Model (application/json)

    JSON representation of a generic device

    + Body

            {
                "name":"My Device",
                "locale": "en_us",
                "units": {},
                "created_at":1234567890,
                "subscription":{},
                "manufacturer_device_model":"Model of device",
                "manufacturer_device_id":"1234",
                "hub_id":"5678",
                "local_id":"7890",
                "radio_type":"zwave",
                "device_manufacturer":"leviton",
                "lat_lng": [12.34567890, 23.445678901],
                "location":"123 Main Street, Anywhere",
                "desired_state":{},
                "last_reading":{}
            }

+ Parameters
    - device_type (required, string, `air_conditioner`) ... String `device_type` of the device_type you want. Has example value
    - device_id (required, string, `sadffaglieuf291089`) ... String `device_id` of the device you want to retrieve. Has example value.

### Retrieve a device [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200

    [specific_device][]

### Update a device [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name":"My Device",
            }

+ Response 200

    [specific_device][]

## refresh device [/{device_type}/{device_id}/refresh]

### Refresh a device [POST]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

+ Parameters
    - device_type (required, string, `air_conditioner`) ... String `device_type` of the device_type you want. Has example value
    - device_id (required, string, `sadffaglieuf291089`) ... String `device_id` of the device you want to retrieve. Has example value.

## all devices of user [/users/me/wink_devices]

### Retrieve all devices [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

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
            "light_bulb_id": "xxx",
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

## all devices of type for user [/users/me/{device_type}]

### Retrieve all devices [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

            [
                {
                    "name":"My Device",
                    "locale": "en_us",
                    "units": {},
                    "created_at":1234567890,
                    "subscription":{},
                    "manufacturer_device_model":"Model of device",
                    "manufacturer_device_id":"1234",
                    "hub_id":"5678",
                    "local_id":"7890",
                    "radio_type":"zwave",
                    "device_manufacturer":"leviton",
                    "lat_lng": [12.34567890, 23.445678901],
                    "location":"123 Main Street, Anywhere"
                }
            ]

+ Parameters
    - device_type (required, string, `air_conditioners`) ... String `device_type` of the device_type you want. Has example value

## sharing device [/{device_type}/{device_id}/users]

+ Model (application/json)

    JSON representation of a Pivot Power Genius sharing relationship

    + Body

            {
                "device_id": "qs1ga9_1234deadbeef", //NOTE: the field name will vary depending on device
                "user_id": "abc123def-an15nag",
                "email": "user@example.com",
                "permissions": ["read_data", "write_data", "read_triggers", "write_triggers"]
            }

+ Parameters
    + device_type (required, string, `air_conditioners`) ... String `device_type` of the device_type you want. Has example value
    + device_id (required, string, `qs1ga9_1234deadbeef`) ... String `air_conditioner_id` of the air_conditioner to perform action on. Has example value.

### List shared device users [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

        [{
            "user_id": "abc123def-an15nag",
            "email": "user@example.com",
            "permissions": ["read_data", "write_data", "read_triggers", "write_triggers", "manage_triggers", "manage_sharing"]
        }, {
            "user_id": "fed876ccc-95hnh3hj",
            "email": "user2@example2.com",
            "permissions": ["read_data", "write_data", "read_triggers", "write_triggers"]
        }]

### Share a device [POST]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "email": "user2@example2.com",
                "permissions": ["read_data", "write_data", "read_triggers", "write_triggers"]
            }

+ Response 202 (application/json)

        {}

## unsharing a device [/{device_type}/{device_id}/users/{email}]

+ Parameters
    + device_type (required, string, `air_conditioners`) ... String `device_type` of the device_type you want. Has example value
    + device_id (required, string, `qs1ga9_1234deadbeef`) ... String `air_conditioner_id` of the air_conditioner to perform action on. Has example value.
    + email (required, string, `user@example.com`) ... String `email` of the user account to unshare from.

### Unshare a device [DELETE]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 204





# Group Channel
Resources for viewing channels, which are used only to set the data source for Nimbus dials and as the outputs of legacy triggers.

## channels [/channels]
Each channel resource has the following attributes:

- channel_id (string, assigned, immutable)
- name (string, assigned, immutable)
- inbound (boolean, assigned, immutable)
- outbound (boolean, assigned, immutable)
- required_parameters (object, assigned, immutable)
- optional_parameters (object, assigned, immutable)

Inbound channels are used for Nimbus dial displays

Outbound channels are user for Triggers, used by multiple devices

When constructing a channel configuration, all required parameters listed in the required_paramaters object for a given channel must be included

See individual device documentation for acceptable values

### List available channels [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

        [{
            "channel_id": "qs1ga9_1234deadbeef",
            "name": "Weather",
            "inbound": true,
            "outbound": false,
            "required_parameters": {
                "lat_lng": true,
                "reading_type": true
            },
            "optional_parameters": {
                "location": true
            }
        }, {
            "channel_id": "qs1ga9_5678deadbeef",
            "name": "Email",
            "inbound": false,
            "outbound":true,
            "required_parameters": {
                "recipient_email": true
            },
            "optional_parameters": {}
        }]



# Group Group
Resources for creating and controlling groups of devices

The Wink API defines certain special groups which you cannot fully control.  These include, but are not limited to:

 - System categories such as .all and .sensors, which will include respectively every product and every product which is contains environment sensors of any kind.  You cannot create, delete, or rename system categories.  You cannot add or remove objects from system categories.  System categories have an automation_mode flag of "system_category".
 - User categories such as @door_sensors and @power.  Some devices will appear in these categories by default, based on our best guess of how these devices will be used by most consumers.  You cannot create, delete, or rename user categories.  You can, however, add and remove objects, if our default classifications are not appropriate.  User categories have an an automation_mode flag of "user_category".

## group [/groups/{group_id}]
The group resource is a representation of a group of wink devices which may be controlled simultaneously

The group resource has the following attributes:

- group_id (string, assigned, immutable)
- name (string, mutable with write_data permission)
- order (integer, mutable with write_data permission )

The group resource has the following objects:

- members (0 to many objects, assignable)

Members have the following attributes

- object_id (string, assignable)
- object_type (string, assignable) [value will be singular types of wink devices and objects. i.e. air_conditioner, propane_tank, outlet, light_bulb, etc.]
- desired_state (object) [current desired_state of object at time of request]

+ Model (application/json)

    JSON representation of an outlet

    + Body

            {
                "group_id": "agh1ity-876f00",
                "name": "Front windows",
                "order": 3,
                "members": [
                    {
                        "object_id": "adsjfhasdof",
                        "object_type": "light_bulb"
                        "desired_state": {
                            "powered":true
                        }
                    },
                    {
                        "object_id": "adsjfhasdof",
                        "object_type": "air_conditioner",
                        "desired_state": {
                            "powered":true
                        }
                    }
                ]
            }

+ Parameters
    + group_id (required, string, `agh1ity-876f00`) ... String `group_id` of the outlet to perform action on. Has example value.

### Retrieve a group [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200

    [group][]

### Update group settings [PUT]

You can use this endpoint to update the members or name of the group

+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name":"Front windows"
            }

+ Response 200

    [group][]

### Delete a group [DELETE]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 204

## group [/groups]

### Create a group [POST]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "Front windows",
                "order": 3,
                "members": [
                    {
                        "object_id": "adsjfhasdof",
                        "object_type": "light_bulb"
                    },
                    {
                        "object_id": "adsjfhasdof",
                        "object_type": "air_conditioner"
                    }
                ]
            }

+ Response 200

    [group][]


## set state of group [/groups/{group_id}/activate]

When you post up a desired state object, the API will then change all the devices in the group to that desired state. Allowed values for desired_state are dependent on the devices in the group and you should refer to individual device documentation.

If you have multiple types of devices in a group and a field in the desired_state object only applies to some of them, such as "color" for "light_bulb" types, the API will update the appropriate devices and ignore that state for devices that do not have a color state, such as air_conditioners

+ Parameters
    + group_id (required, string, `agh1ity-876f00`) ... String `group_id` of the outlet to perform action on. Has example value.

### Activate state of group [POST]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "desired_state": {
                    "powered":true
                }
            }

+ Response 200

    [group][]









# Group Icon

## icon [/icons/{icon_id}]

Icons are permanent and immutable.
Each icon resource has the following attributes:

- icon_id (string, immutable)
- name (string, immutable) which is intended to be a meaningful user-entered label
- object_type (string reference, immutable)
- image.medium (url, immutable)

+ Model (application/json)

    + Body

            {
                "data": {
                    "icon_id": "1r5u9j-8901feed",
                    "name": "A/C",
                    "object_type": "outlet",
                    "image": {
                        "medium": "http://s3.amazonaws.com/wink-production/icons/ac/medium.png"
                    }
                }
            }

## icons [/icons]
### List available icons [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

        {
            "data": [{
                "icon_id": "1r5u9j-8901feed",
                "name": "A/C",
                "object_type": "outlet",
                "image": {
                    "medium": "http://s3.amazonaws.com/wink-production/icons/ac/medium.png"
                }
            }, {
                "icon_id": "116ahi-6719ceda",
                "name": "lamp",
                "object_type": "outlet",
                "image": {
                    "medium": "http://s3.amazonaws.com/wink-production/icons/lamp/medium.png"
                }
            }]
        }

# Group Robot

Resources for creating and updating Robots

## robot [/robots/{robot_id}]
The robot resources is a representation of a single robot

A robot has the following specific attributes:

- robot_id (string, assigned, immutable)
- name (string, writable)
- enabled (boolean, writable)
- fired_limit (integer, writable)
- last_fired (timestamp, immutable)
- creating_actor_type (string, assigned) [type of entity that created the robot]
- creating_actor_id (string, assigned) [id of entity that created the robot]
- automation_mode (string, assigned) [mode of robot if generated for smart features, current possible values -- null (not smart), "smart_schedule", "smart_away_arriving", "smart_away_departing"]

The robot resource embeds the following objects:

- causes (array, 1 to many Conditions, see below for format)
- restrictions (0 to many Conditions, see below for format)
- effects (1 to many, see below for format)

CAUSES & RESTRICTIONS

The causes array is an array of Conditions that can trigger a robot. The restrictions array is an array of Conditions that can prevent a robot from being fired, even if it is triggered by a cause.

A condition has the following format:

- condition_id (string, assigned, immutable) [id of condition]
- observed_field (string, writable) [field in last reading]
- observed_object_id (string, writable) [id of object being observed]
- observed_object_type (string, writable) [type of object being observed, ex. "garage_door"]
- operator (string, writable) [comparison operator]
- value (string, writable) [desired value of observed_field
- recurrence (text, writeable) [iCal string]
- restriction_join (string, writable) ["and" or "or"]
- robot_id (integer, writable) [id of robot]
- restricted_object_id (integer, writable) [if this condition is restricting something, the id of what is being restricted]
- restricted_object_type (string, writable) [if this condition is restricting something, the type of what is being restricted, currently "robot" or "condition"]

A condition can have a recurrence OR an observed object + field + operator + value, but should not have both.

A condition embeds the following objects

- restrictions (0 to many)

For causes and restrictions, their truthiness is evaluated in the following order:

recurrence && observed_field && restrictions.

EVALUATION OF RECURRENCE:

Recurrence should be a string in iCal format and is to be used for a condition dependent on a time. If the recurrence is nil, it's evaluation is true. Thus, to omit a time restriction, set the recurrence string to null.

EVALUATION OF OBSERVED_FIELD

The following fields are all required to properly evaluate observed_field

- observed_field
- operator
- value

observed_field can be any field in a device's last_reading object

operator can be only of the following, as strings

- ==
- !=
- >
- <
- >=
- <=

value is the value that will be used in comparison with the operator.

NOTE: although you can compare multiple types of values, such as boolean, string, int, or float, this value should be put and read as a string. See examples below.

In order to evaluate to true, the observed field's value must be evaluated to true with the given operator

EVALUATION OF RESTRICTIONS

Each condition can have embedded restrictions to create complex logic.

By default, each restriction in the array is joined by "and" so that all the restrictions in the array must evaluate to true in order for restrictions to evaluate to true.

You can join restrictions by "or" by add  a

- restriction_join [allowed values "and" "or"]

NOTE ABOUT COMPLEXITY

Because each restriction is of the same class as the top level Condition, each embedded restriction goes through the same evaluation process for truthiness and can similarly have embedded restrictions of its own.

The restrictions defined in the top level "restrictions" array of the robot object are joined by "and". From there, nested restrictions are joined based on the "restriction_join" field of the parent restriction.

The allowed causes are either objects with an observed reading (such as a garage door opening or a geofence being triggered) or they are a time as defined by an iCal recurrence string.

EXAMPLES:

Note: each example could be in the causes or restrictions array on the robot object, causes are conditions that can trigger a robot and restrictions are conditions that can prevent a robot from being triggered.

Example of a condition: a garage door is opened by at least 50%

    {
        "observed_object_id":"xyzasdfadsfhkj",
        "observed_object_type":"garage_door",
        "observed_field": "position",
        "operator": ">=",
        "value": "0.5"
    }

Example of a condition: geo fence is entered

    {
        "observed_object_id":"defasdfkjha",
        "observed_object_type":"geofence",
        "observed_field": "within",
        "operator": "==",
        "value": "true"
    }

Example of a condition: geo fence is entered

    {
        "observed_object_id":"defasdfkjha",
        "observed_object_type":"geofence",
        "observed_field": "within",
        "operator": "==",
        "value": "false"
    }

Example of a condition: It is 5 pm on a Tuesday

    {
        "recurrence": "DTSTART;TZID=PDT:20140313T170000RRULE:FREQ=DAILY"
    }

Example of a condition: it is between 8pm and 10pm on Tuesdays

    {
        "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
    }

Example of a condition: the garage door is closed and I am within my home geofence

    {
        "restrictions": [
            {
                "observed_object_id":"xyzasdfadsfhkj",
                "observed_object_type":"garage_door",
                "observed_field": "position",
                "operator": "==",
                "value": "0.0"
            },
            {
                "observed_object_id":"defasdfkjha",
                "observed_object_type":"geofence",
                "observed_field": "within",
                "operator": "==",
                "value": "true"
            }
        ]
    }

Example of a condition: (the garage door is closed and I am within my home geofence) or it is between 8pm and 10pm on Tuesdays

    {
        "restriction_join": "or"
        "restrictions": [
            {
                "restrictions": [
                    {
                        "observed_object_id":"xyzasdfadsfhkj",
                        "observed_object_type":"garage_door",
                        "observed_field": "position",
                        "operator": "==",
                        "value": "0.0"
                    },
                    {
                        "observed_object_id":"defasdfkjha",
                        "observed_object_type":"geofence",
                        "observed_field": "within",
                        "operator": "==",
                        "value": "true"
                    }
                ]
            },
            {
                "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
            }
        ]
    }

Example of a restriction: the garage door is closed and (I am within my home geofence or it is between 8pm and 10pm on Tuesdays)

    {
        "restrictions": [
            {
                "observed_object_id":"xyzasdfadsfhkj",
                "observed_object_type":"garage_door",
                "observed_field": "position",
                "operator": "==",
                "value": "0.0"
            },
            {
                "join_type": "or",
                "restrictions": [

                    {
                        "observed_object_id":"defasdfkjha",
                        "observed_object_type":"geofence",
                        "observed_field": "within",
                        "operator": "==",
                        "value": "true"
                    },
                    {
                        "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
                    }
                ]
            },

        ]
    }

Example of a restriction: the garage door is closed and it is between 8pm and 10pm on Tuesdays

Can be written as two embedded restrictions

    {
        "restrictions": [
            {
                "observed_object_id":"xyzasdfadsfhkj",
                "observed_object_type":"garage_door",
                "observed_field": "position",
                "operator": "==",
                "value": "0.0"
            },
            {
                "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
            }

        ]
    }

EFFECT

An effect is what happens if any of the causes occur outside of the optional restriction.

The effect has the following attributes:

- scene (refers to scene that would be activated)
- recipient_actor_id (refers to a user that would get a notification of some type)
- recipient_actor_type (refers to the type of actor, currently just "user")
- notification_type (notification type to send)
- note (refers to an associated custom text)

An effect can have a scene OR a user_id and notification_type, but should not have both.

If an effect has a note, it should also have a notification type and recipient actor.

SCENE IN EFFECT

The scene object is saved within the system and has a scene_id, but will come down as a full object for ease of use

USER and NOTIFICATION_TYPE

recipient_actor_id is the user_id of the user who will be receiving the notification

recipient_actor_type should be "user"

Allowed values for notification_type are "email" and "push"

NOTE

The note object is saved as a custom text with a body attribute containing arbitrary text.

+ Model (application/json)

    JSON representation of a robot

    + Body

            {
                "robot_id": "qs1ga9_1234deadbeef",
                "name": "Data",
                "enabled": true,
                "creating_actor_type": "user",
                "creating_actor_id": "asdfljafd",
                "fired_limit": 2,
                "automation_mode": null,
                "causes" : [
                    {
                        "condition_id": "qweryoiu",
                        "observed_object_id":"xyzasdfadsfhkj",
                        "observed_object_type":"garage_door",
                        "observed_field": "position",
                        "operator": "==",
                        "value": "0.0"
                    }
                ],
                "restrictions" : [
                    {
                        "condition_id": "sadfdsaafsd",
                        "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
                    }
                ],
                "effects": [
                    {
                        "scene": {
                            "scene_id": "asdaioytf",
                            "name":"Data Scene",
                            "members": [
                                "object_id":"asdfoaiye",
                                "object_type":"light_bulb",
                                "desired_state": {
                                    "powered":true,
                                    "brightness": 0.75
                                }
                            ]
                        },
                        "note": {
                          "custom_text_id",
                          "body": "Some text",
                          "subject_id": "abc",
                          "subject_type": "effect"
                        }
                    },
                    {
                        "recipient_actor_id": "adsfhkjasdfy",
                        "recipient_actor_type": "user",
                        "notification_type": "email
                    }

                ]
            }

+ Parameters
    - robot_id (required, string, `qs1ga9_1234deadbeef`) ... String `robot_id` of the robot to perform action on. Has example value.

### Retrieve a robot [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [robot][]

### Update a robot [PUT]

+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "robot_id": "qs1ga9_1234deadbeef",
                "name": "Data",
                "enabled": true,
                "causes" : [
                    {
                        "condition_id": "qweryoiu",
                        "observed_object_id":"xyzasdfadsfhkj",
                        "observed_object_type":"garage_door",
                        "observed_field": "position",
                        "operator": "==",
                        "value": "0.0"
                    }
                ],
                "restrictions" : [
                    {
                        "condition_id": "sadfdsaafsd",
                        "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
                    }
                ],
                "effects": [
                    {
                        "scene": {
                            "scene_id": "asdaioytf",
                            "name":"Data Scene",
                            "members": [
                                "object_id":"asdfoaiye",
                                "object_type":"light_bulb",
                                "desired_state": {
                                    "powered":true,
                                    "brightness": 0.75
                                }
                            ]
                        },
                        "note": {
                          "custom_text_id": "abc",
                          "body": "Some other text"
                        }
                    },
                    {
                        "recipient_actor_id": "adsfhkjasdfy",
                        "recipient_actor_type": "user",
                        "notification_type": "email
                    }

                ]
            }

+ Response 200 (application/json)

    [robot][]

### Delete a robot [DELETE]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 204

## User's Robots [/users/me/robots]

### create a new robot [POST]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "Data",
                "enabled": true,
                "causes" : [
                    {
                        "observed_object_id":"xyzasdfadsfhkj",
                        "observed_object_type":"garage_door",
                        "observed_field": "position",
                        "operator": "==",
                        "value": "0.0"
                    }
                ],
                "restrictions" : [
                    {
                        "recurrence": "DTSTART;TZID=PDT:20140313T200000DTEND;TZID=PDT:20140313T220000RRULE:FREQ=DAILY"
                    }
                ],
                "effects": [
                    {
                        "scene": {
                            "name":"Data Scene",
                            "members": [
                                "object_id":"asdfoaiye",
                                "object_type":"light_bulb",
                                "desired_state": {
                                    "powered":true,
                                    "brightness": 0.75
                                }
                            ]
                        }
                    },
                    {
                        "recipient_actor_id": "adsfhkjasdfy",
                        "recipient_actor_type": "user",
                        "notification_type": "email
                    }

                ]
            }

+ Response 200 (application/json)

    [robot][]

### get all robots belonging to user [GET]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

        {
            "data": [
                {
                    "scene_id": "622328",
                    "name": "Dim kitchen",
                    "order": 0,
                    "members": [
                        {
                            "object_type": "light_bulb",
                            "object_id": "494715",
                            "desired_state": {
                                "brightness": 0.16,
                                "powered": true,
                                "powering_mode": "null",
                                "timer": 0
                            },
                            "local_scene_id": null
                        }
                    ],
                    "icon_id": null
                },
                {
                    "scene_id": "625749",
                    "name": "Lights out",
                    "order": 0,
                    "members": [
                        {
                            "object_type": "light_bulb",
                            "object_id": "466672",
                            "desired_state": {
                                "brightness": 1,
                                "powered": false,
                                "powering_mode": "null",
                                "timer": 0
                            },
                            "local_scene_id": null
                        },
                        {
                            "object_type": "light_bulb",
                            "object_id": "494715",
                            "desired_state": {
                                "brightness": 1,
                                "powered": false,
                                "powering_mode": "null",
                                "timer": 0
                            },
                            "local_scene_id": null
                        }
                    ],
                    "icon_id": null
                },
                {
                    "scene_id": "625752",
                    "name": "Lights on",
                    "order": 0,
                    "members": [
                        {
                            "object_type": "light_bulb",
                            "object_id": "466672",
                            "desired_state": {
                                "brightness": 1,
                                "powered": true,
                                "powering_mode": "null",
                                "timer": 0
                            },
                            "local_scene_id": null
                        },
                        {
                            "object_type": "light_bulb",
                            "object_id": "494715",
                            "desired_state": {
                                "brightness": 1,
                                "powered": true,
                                "powering_mode": "null",
                                "timer": 0
                            },
                            "local_scene_id": null
                        }
                    ],
                    "icon_id": null
                }
            ],
            "errors": [],
            "pagination": {
                "count": 3
            }
        }

# Group Scene
Resources for creating and activating scenes

## scene [/scenes/{scene_id}]
The scene resource is a representation of a specific scene.

A scene is a collection of desired states for any supported Wink device (such as an air conditioner or garage door) or any Wink object (such as the outlet on a powerstrip)

The scene has the following attributes

- scene_id (string, assigned, immutable)
- name (string, writable, mutable)

The scene resource embeds the following arrays:

- members (1 to many objects with desired states, creatable)

Each object in the objects array is required to have the following:

- object_id (string, ex. "abc")
- object_type (string, exs. "light_bulb", "garage_door")
- desired_state (object, mutable) [the values of the desired state are entirely dependent on the allowed desired state of the associated object. Please see the documentation for each object in your scene to see which attributes are allowed]

Example of a light bulb with a desired powered of on

    {
        "object_id":"afdjlafd",
        "object_type:"light_bulb",
        "desired_state": {
            "powered": true
        }
    }

+ Model (application/json)

    JSON representation of an scene

     + Body

            {
                "scene_id": "qs1ga9_1234deadbeef",
                "name": "Coming home",
                "members": [
                    {
                        "object_id":"afdjlafd",
                        "object_type:"light_bulb",
                        "desired_state": {
                            "powered": true
                        }
                    },
                    {
                        "object_id":"yasdfkha",
                        "object_type:"garage_door",
                        "desired_state": {
                            "position": 1.0
                        }
                    }
                ]
            }

            + Parameters
+ Parameters
    - scene_id (required, string, `qs1ga9_1234deadbeef`) ... String `scene_id` of the scene to perform action on. Has example value.

### Retrieve a scene [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [scene][]

### Update scene settings [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "Coming home"
            }

+ Response 200 (application/json)

    [scene][]

### Delete a scene [DELETE]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 204

## User's Scenes [/users/me/scenes]

### New Scene [POST]

+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "Coming home",
                "objects": [
                    {
                        "object_id":"afdjlafd",
                        "object_type:"light_bulb",
                        "desired_state": {
                            "powered": true
                        }
                    },
                    {
                        "object_id":"yasdfkha",
                        "object_type:"garage_door",
                        "desired_state": {
                            "position": 1.0
                        }
                    }
                ]
            }


+ Response 200 (application/json)

    [scene][]

### Retrieve all scenes [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    + Body

            {"data":[{"scene_id":"622328","name":"Dim kitchen","order":0,"members":[{"object_type":"light_bulb","object_id":"494715","desired_state":{"brightness":0.16,"powered":true,"powering_mode":"null","timer":0},"local_scene_id":null}],"icon_id":null},{"scene_id":"625749","name":"Lights out","order":0,"members":[{"object_type":"light_bulb","object_id":"466672","desired_state":{"brightness":1.0,"powered":false,"powering_mode":"null","timer":0},"local_scene_id":null},{"object_type":"light_bulb","object_id":"494715","desired_state":{"brightness":1.0,"powered":false,"powering_mode":"null","timer":0},"local_scene_id":null}],"icon_id":null},{"scene_id":"625752","name":"Lights on","order":0,"members":[{"object_type":"light_bulb","object_id":"466672","desired_state":{"brightness":1.0,"powered":true,"powering_mode":"null","timer":0},"local_scene_id":null},{"object_type":"light_bulb","object_id":"494715","desired_state":{"brightness":1.0,"powered":true,"powering_mode":"null","timer":0},"local_scene_id":null}],"icon_id":null}],"errors":[],"pagination":{"count":3}}

## activate a scene [/scenes/{scene_id}/activate]

### activate [POST]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 204

+ Parameters
    - scene_id (required, string, `qs1ga9_1234deadbeef`) ... String `scene_id` of the scene to perform action on. Has example value.

# Group Air Conditioner
Resources for controlling Air Conditioner devices

## air_conditioner [/air_conditioners/{air_conditioner_id}]
The air_conditioner resource is a representation of a single Air Conditioner.

The air_conditioner resource has the following specific attributes:

- air_conditioner_id (string, assigned, immutable)
- electric_rate (float, assigned) [the price per kwh electric rate for the AC given the location]
- smart_schedule_enabled (boolean, assigned) [whether smart schedule has been enabled for AC]

The air_conditioner resource embeds the following objects

- current_budget (1, readable) [budget object of the current budget that spans the current time. Will be null if no budget is set]
- desired_state (1, writable)
- last_reading (1, readable)
- triggers (0 to many triggers, creatable)

To change the state of an Air Conditioner, write changes in a PUT request to the desired_state object.

To retrieve current state of an Air Conditioner, read values from last_reading object.

Desired State attributes

- fan_speed (float) [0 - 1]
- mode ["cool_only", "fan_only", "auto_eco"]
- powered (boolean)
- max_set_point (float) [in celsius]

        {
            "fan_speed": 0.33,
            "mode": "auto_eco",
            "powered": true,
            "max_set_point": 20.0
        },

Last Reading attributes

- connection (Boolean) [whether or not the device is reachable remotely]
- connection_updated_at (Long)
- consumption (Long) [power consumption]
- consumption_updated_at (Long)
- fan_speed [maps to fan speed last read from device itself]
- fan_speed_updated_at (Long)
- mode [maps to mode last read from device itself]
- mode_updated_at (Long)
- powered [maps to powered last read from device itself]
- powered_updated_at (Long)
- max_set_point [maps to set point last read from device itself]
- max_set_point_updated_at (Long)
- temperature [maps to room temperature last read from device itself]
- temperature_updated_at (Long)

        {
            "connection": true,
            "connection_updated_at": 1393104904,
            "consumption": 1236.891237,
            "consumption_updated_at": 1393104904,
            "fan_speed": 0.33,
            "fan_speed_updated_at": 1393104904,
            "mode": "auto_eco",
            "mode_updated_at": 1393104904,
            "powered": true,
            "powered_updated_at": 1393104904,
            "temperature": 23.0,
            "temperature_updated_at": 1393104904,
            "max_set_point": 22.0,
            "max_set_point_updated_at": 1393104904,
        }

Allowed triggers

- Connection: { "reading_type": "connection",  "edge": "falling"; "threshold": 1.0}

+ Model (application/json)

    JSON representation of an air_conditioner

    + Body

            {
                "air_conditioner_id": "qs1ga9_1234deadbeef",
                "electric_rate": 0.13,
                "smart_schedule_enabled": false,
                "current_budget": {
                    "budget_id": "asdfhoiufd",
                    "air_conditioner_id": "awefoiuandf",
                    "from_time": 1393104904,
                    "until_time": 1395104904,
                    "name": "My budget",
                    "budgetable_reading": "cost",
                    "edge": "rising",
                    "threshold":45.0,
                    "projected_over_budget": false
                },
                "desired_state": {
                    "automation_mode": "away",
                    "fan_speed": 0.33,
                    "mode": "auto_eco",
                    "powered": true,
                    "temperature": 20.0
                },
                "last_reading": {
                    "connection": true,
                    "connection_updated_at": 1393104904,
                    "consumption": 1236.891237,
                    "consumption_updated_at": 1393104904,
                    "fan_speed": 0.33,
                    "fan_speed_updated_at": 1393104904,
                    "mode": "auto_eco",
                    "mode_updated_at": 1393104904,
                    "powered": true,
                    "powered_updated_at": 1393104904,
                    "temperature": 23.0,
                    "temperature_updated_at": 1393104904,
                    "max_set_point": 22.0,
                    "max_set_point_updated_at": 1393104904,
                }
                "triggers": []
            }

+ Parameters
    + air_conditioner_id (required, string, `qs1ga9_1234deadbeef`) ... String `air_conditioner_id` of the air conditioner to perform action on. Has example value.

### Retrieve an air_conditioner [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [air_conditioner][]

### Update air_conditioner settings [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "Living room"
            }

+ Response 200 (application/json)

    [air_conditioner][]

## ac reading [/air_conditioners/{air_conditioner_id}/readings/?since={since}&until={until}&keys={keys}&filter_type={filter_type}&timezone={timezone}]

The ac reading resource has the following attributes:

- created_at (integer, assigned, immutable)
- value (float)
- key (String) ["desired_fan_speed", "fan_speed", "desired_mode", "mode", "desired_temperature", "temperature", "desired_automation_mode", "automation_mode", "cost"]

Example of consumption

    {
          "created_at": 123458000,
          "value": 5.0,
          "key": "consumption"
    }


Example of fan_speed

    {
          "created_at": 123458000,
          "value": 0.33,
          "key": "fan_speed"
    }

Example of mode

    {
          "created_at": 123458000,
          "value": "auto_eco",
          "key": "mode"
    }


Example of automation mode

    {
          "created_at": 123458000,
          "value": "budget",
          "key": "automation_mode"
    }

Example of temperature

    {
          "created_at": 123458000,
          "value": 20.0,
          "key": "temperature"
    }

Example of powered

    {
          "created_at": 123458000,
          "value": false,
          "key": "powered"
    }

Example of cost. Note, this is a reading that is calculated on consumption and is best used with a filter_type

    {
          "created_at": 123458000,
          "value": 10.5,
          "key": "cost"
    }

+ Model
    JSON representation of ac reading

    + Body

            {
                  "created_at": 123458000,
                  "value": 5.0,
                  "key": "consumption"
            }

+ Parameters
    + air_conditioner_id (required, string, `sadjidbbb_201bd`) ... String `air_conditioner_id` of the air_conditioner to perform action on. Has example value.
    + since (optional, integer, `123456789`) ... int Unix `since` of when you want query to start. Has example value.
    + until (optional, integer, `123456789`) ... int Unix `until` of when you want query to end. Has example value.
    + keys (optional, string, `fan_speed,mode`) ... String `keys` of which readings you want to see, Comma separated. Has example value.
    + filter_type (optional, string, `daily`) ... String `filter_type` of aggregation types for readings. Has example value.
    + timezone (optional, string, `America/New_York`) ... String `timezone` of timezone if filter_type is used to make sure aggregation spans expected values

### List readings of an air conditioner [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [ac reading][]

## ac projection [/air_conditioners/{air_conditioner_id}/projections/?since={since}&until={until}&keys={keys}&filter_type={filter_type}&timezone={timezone}]

Projections function very similarly to readings and have the same format in both the query to retrieve them as well as the response object.

They differ in that the responses represent predictions or projections of the future rather than past actual readings.

Like readings, filter_type can be used to aggregate information.

So that a filter_type of "monthly" and keys "cost", will give you the projected monthly cost

Similarly, a filter_type of "daily" and keys "external_temperature", will give you the daily temperature for the given time period

- created_at (integer, assigned, immutable)
- value (float)
- key (String) ["cost", "consumption", "external_temperature"]

+ Model
    JSON representation of ac reading

    + Body

            {
                  "created_at": 123458000,
                  "value": 5.0,
                  "key": "cost"
            }

+ Parameters
    + air_conditioner_id (required, string, `sadjidbbb_201bd`) ... String `air_conditioner_id` of the air_conditioner to perform action on. Has example value.
    + since (optional, integer, `123456789`) ... int Unix `since` of when you want query to start. Has example value.
    + until (optional, integer, `123456789`) ... int Unix `until` of when you want query to end. Has example value.
    + keys (optional, string, `cost`) ... String `keys` of which projections you want to see, Comma separated. Has example value.
    + filter_type (optional, string, `daily`) ... String `filter_type` of aggregation types for readings. Has example value.
    + timezone (optional, string, `America/New_York`) ... String `timezone` of timezone if filter_type is used to make sure aggregation spans expected values

### List projections of an air conditioner [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [ac projection][]

## ac stat [/air_conditioners/{air_conditioner_id}/stats/?since={since}&until={until}]

The deposit resource has the following attributes:

- total_cost (float) [cumulative cost of given period
- target_cost (float) [average set target cost for given period]
- average_daily_cost (float) [average cost for days in the given period]
- average_monthly_cost (float) [average cost by month for lifetime of readings]
- national_average_monthly_cost (float) [average cost by month for nation]

+ Model
    JSON representation of ac stat

    + Body

                {
                    "total_cost": 12825268642.412,
                    "target_cost": 35.0,
                    "average_daily_cost": 11521148148.14255,
                    "average_monthly_cost": 345634444444.2765,
                    "national_average_monthly_cost": 36.26
                }

+ Parameters
    + air_conditioner_id (required, string, `sadjidbbb_201bd`) ... String `air_conditioner_id` of the air_conditioner to perform action on. Has example value.
    + since (optional, integer, `123456789`) ... int Unix `since` of when you want query to start. Has example value.
    + until (optional, integer, `123456789`) ... int Unix `until` of when you want query to end. Has example value.

### List stats of an air conditioner [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [ac stat][]





# Group Cloud Clock

## cloud_clock [/cloud_clocks/{cloud_clock_id}]

The cloud clock resource has the following attributes

- cloud_clock_id (string, assigned, immuatable)
- name (string, mutable with write_data permissions)

The cloud clock resource has the following attributes

- dials (4 dials, assigned, permanent)
- alarms (0 to many, creatable)

+ Model (application/json)

    + Body

            {
                "cloud_clock_id": "fasinfhs_12670s",
                "name": "My Nimbus",
                "dials": [
                    {
                        "dial_id": "456",
                        "dial_index": 0,
                        "name": "Facebook",
                        "label": "FACEBOOK",
                        "labels": ["FACEBOOK", "1 REQUEST"],
                        "position": 90.0,
                        "brightness": 25,
                        "channel_configuration": {
                            "channel_id": "6",
                            "linked_service_ids": ["123"],
                            "linked_service_types": ["facebook.read_messages"],
                            "reading_type":"friend_request_count",
                            "locale": "en_us"
                        },
                        "dial_configuration": {}
                    },
                    {
                        "dial_id": "457",
                        "dial_index": 1,
                        "name": "Twitter",
                        "label": "TWITTER",
                        "labels": ["TWITTER", "1 TWEET"],
                        "position": 270.0,
                        "brightness": 25,
                        "channel_configuration": {
                        "channel_id": "4322",
                            "linked_service_ids": ["124"],
                            "linked_service_types": ["twitter.read_messages"],
                            "reading_type": "latest_retweet_count",
                            "locale": "en_us",
                        },
                        "dial_configuration": {}
                    },
                    {
                        "dial_id": "458",
                        "dial_index": 2,
                        "labels": ["638.2 HRS", "TO DEST"],
                        "name": "Instagram",
                        "label": "INSTAGRAM",
                        "position": 180.0,
                        "brightness": 25,
                        "channel_configuration": {
                            "channel_id": "4323",
                            "linked_service_ids": ["125"],
                            "linked_service_types": ["instagram.read_messages"]
                            "reading_type": "latest_comment_count",
                            "locale": "en_us",
                        },
                        "dial_configuration": {}
                    },
                    {
                        "dial_id": "459",
                        "dial_index": 3,
                        "name": "Weather",
                        "label": "WEATHER",
                        "labels": ["FLURRIES", "TEMP 32"],
                        "position": 0.0,
                        "brightness": 25,
                        "channel_configuration": {
                            "lat_lng": [40.7517836, -74.0050807],
                            "reading_type": "weather_conditions",
                            "locale": "en_us",
                            "channel_id": "4324"
                        },
                        "dial_configuration": {}
                    }
                ],
                "alarms": [
                    {
                        "alarm_id": "555",
                        "name": "Wakie wakie",
                        "recurrence": "DTSTART:20130821T140000ZnRRULE:FREQ=DAILY",
                        "media_id": "666",
                        "enabled": true,
                        "next_at": 123456789.0
                    }
                ]
            }

+ Parameters
    + cloud_clock_id (required, string, `fasinfhs_12670s`) ... String `cloud_clock_id` of the cloud clock to perform action on. Has example value.

### Retrieve a clock [GET]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [cloud_clock][]


### Update a clock [PUT]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "My Nimbus"
            }

+ Response 200 (application/json)

    [cloud_clock][]

## dial_template [/dial_template]

Returns the available channel_configurations and dial_configurations for the dial resource

Explanation of dial_configuration fields and values

- scale_type: log, linear [How the dial should move in response to higher values]
- rotation: cw, ccw [In which direction the dial should rotate]
- min_value: any number [The minimum data value the dial should attempt to display at min_position]
- max_value: any number greater than min_value [The maximum data value the dial should attempt to display at max_position]
- min_position: degree rotation which corresponds to min_value. Generally [0, 360] but not required to be so. [The position of the needle at min_value]
- max_postition: degree rotation which corresponds to max_value. Generally [0, 360] but not required to be so. [The position of the needle at max_value]

Read types available for each dial_template channel configuration:

- Time: n/a
- Weather: temperature, weather_conditions
- Traffic: travel_time, travel_conditions
- Calendar: time_until, time_of [refers to next appointment on calendar, currently only Google Calendar is supported]
- Email: unread_message_count [currently only Gmail is supported]
- Facebook: friend_request_count, latest_comment_count, latest_like_count, unread_message_count, unread_notification_count
- Twitter: latest_retweet_count, recent_mention_count, recent_direct_message_count
- Instagram: latest_like_count, latest_comment_count
- Fitbit: calorie_out_count, heart_rate, sleep_duration, step_count
- Eggminder: inventory
- Porkfolio: balance

Other field values seen in dial_templates

- timezone: any IANA timezone
- locale: A standard locale string of the ll_cc format, where ll is the two letter ISO language code and cc is the two letter ISO country code
- lat_lng: tuple of (lat, lng) for the Weather channel
- location: location string (New York, NY) for display for the Weather channel
- start_lat_lng: tuple of (lat, lng) for the Traffic channel
- start_location: location string (New York, NY) for display for the Traffic channel
- stop_lat_lng: tuple of (lat, lng) for the Traffic channel
- stop_location: location string (New York, NY) for display for the Traffic channel
- transit_mode: one of ["car", "ped", "bike", "transit"] representing desired principal mode of transit for the Traffic channel

### View all dial templates [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn


+ Response 200 (application/json)

        {
            "dial_template_id": "4",
            "dial_configuration": {
                "min_value": 0,
                "max_value": 3600,
                "min_position": 0,
                "max_position": 360,
                "scale_type": "linear",
                "rotation": "cw"
            },
            "channel_configuration": {
                "channel_id": "4",
                "reading_type": "time_until",
            },
            "name": "Calendar"
        }

## dial [/dials/{dial_id}]

Each cloud_clock resources have 4 dial resources. Use dial_template to retrieve possible values for channel_configuration and dial_configuration

The dial resource has the following attributes:

- dial_id (string, assigned, immutable)
- dial_index (integer, assigned, immutable)
- name (string, mutable with write_data permissions)
- label (string, assigned, mutable)
- labels (array, assigned, immutable) [values determined by channel type and value, for display on clock LCD)
- position (float, assigned, immutable) [0.0 - 359.0, position of needle on display]
- brightness (integer, assigned, mutable) [0 - 100, display brightness of LCD, can also be updated on clock by pressing down]

The dial resource has the following resources:

- channel_configuration (see dial_templates for possible values)
- dial_configuration (see dial_templates for possible values)

+ Model (application/json)

    + Body

            {
                "dial_id": "adsfljk_458",
                "dial_index": 2,
                "name": "Instagram",
                "label": "INSTAGRAM",
                "labels": ["INSTAGRAM", "1 LIKE"],
                "position": 180.0,
                "brightness": 25,
                "channel_configuration": {
                    "channel_id": "4323",
                    "linked_service_ids": ["125"],
                    "linked_service_types": ["instagram.read_messages"]
                    "reading_type": "latest_comment_count",
                    "locale": "en_us",
                },
                "dial_configuration": {
                    "scale_type": "linear",
                    "rotation": "cw",
                    "min_position": 0.0,
                    "min_value": 0.0,
                    "max_position": 0.0,
                    "max_value": 0.0,
                    "num_ticks": 0
                }
            }

### updating a dial [PUT]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            "channel_configuration": {
                    "channel_id": "4323",
                    "linked_service_ids": ["125"],
                    "linked_service_types": ["instagram.read_messages"]
                    "reading_type": "latest_comment_count",
                    "locale": "en_us",
            }

+ Response 200 (application/json)

    [dial][]

## alarm [/alarms/{alarm_id}]

The alarm resource has the following attributes:

- alarm_id (string, assigned, immutable)
- cloud_clock_id (string, assigned, immutable) [id of associated cloud_clock]
- name (string, mutable with write_data permissions)
- recurrence (string, mutable with write_data permission) [Recurrence string in iCalendar format]
- enabled (boolean, mutable with write_data)
- next_at (float, assigned, immutable) [time stamp of next alarm]

+ Model

    JSON represenation of an alarm resource

    + Body

            {
                "alarm_id": "fadlkfh_124_hasd",
                "cloud_clock_id": "fasinfhs_12670s",
                "name": "Wakie wakie",
                "recurrence": "DTSTART;TZID=America/New_York:20130826T073000nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
                "enabled": true,
                "next_at": 123456789.0
            }

+ Parameters
    + alarm_id (required, string, `fadlkfh_124_hasd`) ... String `alarm_id` of the alarm to perform action on. Has example value.

### Update an alarm [PUT]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "enabled": true
            }

+ Response 200 (application/json)

    [alarm][]

### Delete an alarm [DELETE]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 204

## alarms of cloud clock [/cloud_clocks/{cloud_clock_id}/alarms]

+ Parameters
    + cloud_clock_id (required, string, `fasinfhs_12670s`) ... String `cloud_clock_id` of the cloud clock to perform action on. Has example value.

### List alarms of clock [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn


+ Response 200 (application/json)


    [alarm][]

### create new alarm [POST]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn


    + Body

            {
                "name": "Wakie wakie",
                "recurrence": "DTSTART;TZID=America/New_York:20130826T073000nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
            }

+ Response 200 (application/json)

    [alarm][]

# Group Eggtray
Resources for controlling Eggminder devices

## eggtray [/eggtrays/{eggtray_id}]
The eggtray resource is a representation of a single Eggminder device

The eggtray resource has the following attributes:

- eggtray_id (string, assigned, immutable)
- name (string, mutable with write_data permission on eggtray device)
- freshness (integer, mutable with write_data permission on eggtray device) [Period during which eggs are defined as fresh in seconds]
- eggs (array of 14 integers, assigned, immutable) [Timestamp in seconds of when each egg was added]

+ Model (application/json)

    JSON representaion of a scheduled outlet states

    + Body

            {
                "eggtray_id": "adsfljk+109288=",
                "name": "Henrietta",
                "eggs": [
                    1377180085,
                    1377180086,
                    1377180087,
                    1377180088,
                    1377180089,
                    1377180090,
                    1377180091,
                    1377180092,
                    1377180093,
                    1377180094,
                    1377180095,
                    1377180096,
                    1377180097,
                    1377180098
                ],
                "freshness_period": 2419200
            }

### Retrieve an eggminder [GET]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [eggtray][]


### Update an eggminder [PUT]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "freshness_period": 2419200
            }

+ Response 200 (application/json)

    [eggtray][]









# Group Piggy Bank

## piggy_bank [/piggy_banks/{piggy_bank_id}]

The piggy_bank resource has the following attributes:

- piggy_bank_id (string, assigned, immutable)
- name (string, mutable with write_data permissions)
- balance (integer, assigned, immutable) [the current balance in cents of the piggy bank, determined from deposits]
- last_deposit_amount (integer, assigned, immutable) [amount in cents of the last deposit]
- nose_color (string, mutable with write_data permissions) [hex color for the color of the nose]
- savings_goal (integer, mutable with write_data) [amount in cents of user-set savings goal]

+ Model

    + Body

            {
                "piggy_bank_id": "sadjidbbb_201bd",
                "name": "Beer money",
                "balance": 19217,
                "last_deposit_amount": 25,
                "nose_color": "00ff00",
                "savings_goal": 5000
            }
+ Parameters
    + piggy_bank_id (required, string, `sadjidbbb_201bd`) ... String `piggy_bank_id` of the piggy bank to perform action on. Has example value.

### Retrieve a piggy_bank [GET]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [piggy_bank][]

### Update a piggy_bank [PUT]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn


    + Body

            {
                "savings_goal": 5000
            }

+ Response 200 (application/json)

    [piggy_bank][]

## deposit [/piggy_banks/{piggy_bank_id}/deposits/?since={timestamp}]

The deposit resource has the following attributes:

- deposit_id (string, assigned, immutable)
- created_at (integer, assigned, immutable)
- amount (integer, mutable with write_data permissions)

+ Model
    JSON representation of deposit

    + Body

            {
                  "deposit_id": "303d_d",
                  "created_at": 123458000,
                  "amount": 5
            }

+ Parameters
    + piggy_bank_id (required, string, `sadjidbbb_201bd`) ... String `piggy_bank_id` of the piggy bank to perform action on. Has example value.
    + timestamp (optional, integer, `123456789`) ... int Unix `timestamp` of when you want query to start. Has example value.

### List deposits of a piggy bank [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [deposit][]

### Create a deposit or withdrawal [POST]

Note: to create a withdrawal, set the amount to a negative integer

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "amount": 5
            }

+ Response 200 (application/json)

    [deposit][]

# Group Powerstrip
Resources for controlling Pivot Power Genius devices

## powerstrip [/powerstrips/{powerstrip_id}]
The powerstrip resource is a representation of a single Pivot Power Genius device.

The powerstrip resource has the following attributes:

- powerstrip_id (string, assigned, immutable)

The powerstrip resource embeds the following resources:

- outlets (2 outlets, assigned, permanent)

+ Model (application/json)

    JSON representation of a Pivot Power Genius

    + Body

            {
                "powerstrip_id": "qs1ga9_1234deadbeef",
                "outlets": [
                    {
                        "outlet_id": "1tq1-654fed_18y5",
                        "outlet_index": 0,
                        "powered": true
                    },
                    {
                        "outlet_id": "u59h-654fee_ih17afg",
                        "outlet_index": 1,
                        "powered": false
                    }
                ]
            }

+ Parameters
    + powerstrip_id (required, string, `qs1ga9_1234deadbeef`) ... String `powerstrip_id` of the powerstrip to perform action on. Has example value.

### Retrieve a powerstrip [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [powerstrip][]

### Update powerstrip settings [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "name": "Living room"
            }

+ Response 200 (application/json)

    [powerstrip][]

## outlet [/outlets/{outlet_id}]
The outlet resource is a representation of a single app-controlled outlet of a Pivot Power Genius device.

The outlet resource has the following attributes:

- outlet_id (string, assigned, immutable)
- outlet_index (numeric, assigned, immutable)
- name (string, mutable with write_data permission for powerstrip)
- icon_id (string reference to an icon, mutable with write_data permission for powerstrip)
- powered (boolean, mutable with write_data permission for powerstrip)

+ Model (application/json)

    JSON representation of an outlet

    + Body

            {
                "outlet_id": "1tq1-654fed_18y5",
                "outlet_index": 0,
                "powered": true
            }

### Retrieve an outlet [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [outlet][]

### Update outlet settings [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "powered": false
            }

+ Response 200 (application/json)

        {
            "outlet_id": "agh1ity-876f00",
            "outlet_index": 0,
            "name": "lamp",
            "icon_id": "w-g9hqng_777ace-lamp",
            "powered": false
        }



# Group Propane Tank

## propane_tank [/propane_tanks/{propane_tank_id}]
The propane_tank resource is a representation of a single Refuel.

The propane_tank resource has the following specific attributes:

- propane_tank_id (string, assigned, immutable)
- tare (float, mutable) [tare weight of current tank]
- created_at (long, assigned, immutable)
- tank_changed_at (long, assigned, immutable) [date last new tank was added]

The propane_tank resource embeds the following objects

- last_reading (1, readable)
- triggers (0 to many triggers, creatable)

Last Reading attributes

- connection (Boolean) [whether or not the device is reachable remotely]
- connection_updated_at (Long)
- battery (Float) [0 - 1 status of battery life]
- battery_updated_at (Long)
- remaining (Float) [0 - 1 percent of tank remaining]
- remaining_updated_at (Long)

Allowed triggers

- Connection: { "reading_type": "connection",  "edge": "falling"; "threshold": 1.0}
- Battery: { "reading_type": "battery",  "edge": "falling"; "threshold": 0.2}
- Low Fuel: { "reading_type": "remaining",  "edge": "falling"; "threshold": 0.25}

+ Model (application/json)

    JSON representation of an air_conditioner

    + Body

            {
                "propane_tank_id": "qs1ga9_1234deadbeef",
                "tare": 17.25,
                "tank_changed_at" : 1393104904,
                "last_reading": {
                    "connection": true,
                    "connection_updated_at": 1393104904,
                    "battery": 0.8,
                    "battery_updated_at": 1393104904,
                    "remaining": 0.6,
                    "remaining_updated_at" :1393104904
                }
                "triggers": []
            }

+ Parameters
    + propane_tank_id (required, string, `qs1ga9_1234deadbeef`) ... String `propane_tank_id` of the air conditioner to perform action on. Has example value.

### Retrieve an propane_tank [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [propane_tank][]

### Update propane_tank settings [PUT]
+ Request (application/json)

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

    + Body

            {
                "tare": 17.25
            }

+ Response 200 (application/json)

    [propane_tank][]

## propane reading [/propane_tanks/{propane_tank_id}/readings/?since={since}&until={until}&filter_type={carryover,daily}&keys={keys}&timezone={timezone}]

The reading resource has the following attributes:

- created_at (integer, assigned, immutable)
- value (float)
- key (String) ["remaining", "tare", "battery"]

+ Model
    JSON representation of reading

    + Body

            {
                  "created_at": 123458000,
                  "value": 0.6,
                  "key": "remaining"
            }

+ Parameters
    + propane_tank_id (required, string, `sadjidbbb_201bd`) ... String `propane_tank_id` of the propane_tank to perform action on. Has example value.
    + since (optional, integer, `123456789`) ... int Unix `since` of when you want query to start. Has example value.
    + until (optional, integer, `123456789`) ... int Unix `until` of when you want query to end. Has example value.
    + filter_type (optional, string, `carryover,daily`) ... String `carryover,daily` filter type to get reading immediately prior to indicated time returned and to filter results by cumulative daily value
    + keys (optional, string, `remaining,tare`) ... String `keys` of which readings you want to see, Comma separated. Has example value.
    + timezone (optional, string, `America/New_York`) ... String `timezone` of timezone if filter_type is used to make sure aggregation spans expected values

### List readings of an air conditioner [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [propane reading][]

## propane stat [/propane_tanks/{propane_tank_id}/stats/?since={since}&until={until}]

The stats resource has the following attributes:

- average_grill_time [Average grill time in seconds in given time period]
- average_tank_life_real [Average tank life in seconds of active grilling in given time period]
- average_tank_life_cumulative: [Average tank life in seconds of days tank was not empty in given time period]
- average_grills_per_tank [Average grills per tank in given time period]
- cumulative_tanks_used [Total tanks used in given time period]
- cumulative_grill_time [Total grill time in seconds in given time period]

+ Model
    JSON representation of ac stat

    + Body

                {
                    "average_grill_time": 4341,
                    "average_tank_life_real": 4007091,
                    "average_tank_life_cumulative": 37111,
                    "average_grills_per_tank": 8.548951854411426,
                    "cumulative_tanks_used": 1.98,
                    "cumulative_grill_time": 60780
                }

+ Parameters
    + propane_tank_id (required, string, `sadjidbbb_201bd`) ... String `propane_tank_id` of the propane_tank to perform action on. Has example value.
    + since (optional, integer, `123456789`) ... int Unix `since` of when you want query to start. Has example value.
    + until (optional, integer, `123456789`) ... int Unix `until` of when you want query to end. Has example value.

### List stats of an propane [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [propane stat][]



# Group Sensor Pod

## sensor_pod [/sensor_pods/{sensor_pods}]

The sensor_pod resource has the following attributes:

- sensor_pod_id (string, assigned, immutable)
- name (string, mutable with write_data permissions)

The sensor_pod resource has the following resouces:
- last_reading (1, see below for fields)
- last_event (1, see below for fields)

Last reading fields

- battery: level of battery as of last reading
- battery_updated_at: timestamp of last battery reading
- brightness: level of brightness as of last reading
- brightness_updated_at: timestamp of last brightness reading
- external_power: boolean of powered or in battery mode
- external_power_updated_at: timestamp of last external power reading
- humidity: float corresponding to percentage of humidity
- humidity_updated_at: timestamp of last humidity reading
- loudness: float value of loudness
- loudness_updated_at: timestamp of last loudness reading
- temperature: float temperature in Celsius
- temperature: timestamp of last temperature reading
- vibration: boolean reading of movement
- vibration_updated_at: timestamp of last movement reading

Last event fields

- brightness_occurred_at: timestamp of last measured change from low brightness to high brightness
- loudness_occurred_at: timstamp of last measured change of low sound to loud sound
- vibration_occurred_at: timestamp of last measured change of no movement to movement

+ Model

    JSON Representation of a sensor_pod

    + Body

            {
                "sensor_pod_id": "1asdf23_snfds",
                "name": "My Spotter",
                "last_reading": {
                    "battery": 0.75,
                    "battery_updated_at": 123456789,
                    "brightness": 12.5,
                    "brightness_updated_at": 123456789,
                    "external_power": false,
                    "external_power_updated_at": 123456789,
                    "humidity": 0.45,
                    "humidity_updated_at": 123456789,
                    "loudness": null,
                    "loudness_updated_at": null,
                    "pressure": 0.25,
                    "pressure_updated_at": 123456789,
                    "temperature": 25.23,
                    "temperature_updated_at": 123456789,
                    "vibration": false,
                    "vibration_updated_at": 123456789
                },
                "last_event": {
                    "brightness_occurred_at": 123456789,
                    "loudness_occurred_at": null,
                    "vibration_occurred_at": 123456789
                }
            }

### Retrieve a sensor pod [GET]
+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn

+ Response 200 (application/json)

    [sensor_pod][]

### Update a piggy_bank [PUT]

+ Request

    + Headers

            Authorization : Bearer example_access_token_like_135fhn80w35hynainrsg0q824hyn


    + Body

            {
                "name": "My spotter"
            }

+ Response 200 (application/json)

    [sensor_pod][]











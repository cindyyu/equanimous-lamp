#!/usr/bin/env bash
curl --header "Content-Type:application/json" \
 --header "Accept: application/json" \
 --request POST \
 --data '
 	{
 		"data": {
 			"type": "spots",
 			"attributes": {
 				"longitude": 35,
 				"latitude": 25,
 				"price": 0,
 				"origin": "user",
 				"availability": {
					"sun" : {
						"beg": null,
						"end": null
					},
					"mon" : {
						"beg": null,
						"end": null
					},
					"tue" : {
						"beg": null,
						"end": null
					},
					"wed" : {
						"beg": null,
						"end": null
					},
					"thu" : {
						"beg": null,
						"end": null
					},
					"fri" : {
						"beg": null,
						"end": null
					},
					"sat" : {
						"beg": null,
						"end": null
					}
 				}
 			}
 		}
 	}
 ' \
 http://127.0.0.1:4000/api/1/spots
#!/usr/bin/env bash
curl --header "Content-Type:application/json" \
 --header "Accept: application/json" \
 --request PATCH \
 --data '
 	{
 		"data": {
 			"type": "spots",
 			"id": "ZO100L4IZ0",
 			"attributes": {
 				"longitude": -96.79698789999998,
 				"latitude": 32.7766642
 			}
 		}
 	}
 ' \
 http://127.0.0.1:5000/api/1/spots/ZO100L4IZ0
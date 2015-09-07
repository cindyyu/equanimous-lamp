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
 				"price": 0
 			}
 		}
 	}
 ' \
 http://127.0.0.1:5000/api/1/spots
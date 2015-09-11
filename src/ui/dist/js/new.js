riot.tag('new', '<logo ></logo> <form class="grid" onsubmit="{ addSpot }"> <div class="grid__col col--1-of-2"> <label for="location">Where is this awesome parking spot?</label> <input type="hidden" name="longitude" value="{ location.longitude }"> <input type="hidden" name="latitude" value="{ location.latitude }"> <div id="map"> <loading ></loading> </div> </div> <div class="grid__col col--1-of-2"> <label for="price">Is it always free?</label> <button data-type="free" class="{ type == \'free\' ? \'selected\' : \'\' }" onclick="{ setType }">Yes</button> <button data-type="paid" class="{ type == \'paid\' ? \'selected\' : \'\' }" onclick="{ setType }">No</button> <paid if="{ type == \'paid\' }"> <label>When do you have to pay?</label> <availability> <day each="{ days }" class="{ selected ? \'selected\' : \'\' }" onclick="{ toggleDay }">{ name }</day> <time> from <beg> <select onchange="{ updateField }" name="beg_hour" value="{ self.beg_hour }"> <option each="{ hours }">{ value }</option> </select>: <select onchange="{ updateField }" name="beg_min" value="{ self.beg_min }"> <option each="{ minutes }">{ value }</option> </select> </beg> to <end> <select onchange="{ updateField }" name="end_hour" value="{ self.end_hour }"> <option each="{ hours }">{ value }</option> </select>: <select onchange="{ updateField }" name="end_min" value="{ self.end_min }"> <option each="{ minutes }">{ value }</option> </select> </end> </time> </availability> <label for="price">How much does it cost per hour?</label> <i class="material-icons">attach_money</i><input type="text" name="price"> </paid> <label for="max_stay">How many hours can you park here?</label> <i class="material-icons">av_timer</i><input type="text" name="max_stay"> <button __disabled="{ added }">{ added ? \'Got it!\' : \'Add Parking Spot\' }</button> <button if="{ added }" onclick="{ clearForm }">Add Another</button> </div> </form>', function(opts) {
		self = this
		self.location = {}
		self.added = false
		self.type = 'free'

		self.beg_hour = '01'
		self.beg_min = '00'
		self.end_hour = '01'
		self.end_min = '00'

		updateField = function(e) {
		 	self[e.target.name] = e.target.value
		 	console.log('hi')
		}

		rangeGen = function(start, end) {
			result = []
			for (var i = start; i < end; i++) {
				value = i < 10 ? '0' + i : i
				result.push({ value: value })
			}
			return result
		}

		self.hours = rangeGen(1, 25)
		self.minutes = rangeGen(0, 60)
		self.days = [
			{ name: 'sun', index: 0, selected: false },
			{ name: 'mon', index: 1, selected: false },
			{ name: 'tue', index: 2, selected: false },
			{ name: 'wed', index: 3, selected: false },
			{ name: 'thu', index: 4, selected: false },
			{ name: 'fri', index: 5, selected: false },
			{ name: 'sat', index: 6, selected: false }
		]

		toggleDay = function(e) {
			e.preventDefault()
			e.item.selected = !e.item.selected
		}

		setType = function(e) {
			e.preventDefault()
			type = e.target.dataset.type
			self.type = type
			self.update()
		}

		clearForm = function(e) {
			e.target.form.price.value = ''
			e.target.form.max_stay.value = ''
			self.added = false
			self.update()
		}

		addSpot = function(e) {
			attributes = {
				longitude: parseFloat(e.target.longitude.value),
				latitude: parseFloat(e.target.latitude.value)
			}
			fieldsToCheck = ['price', 'max_stay']
			for (i in fieldsToCheck) {
				field = fieldsToCheck[i]
				parsedFloat = parseFloat(e.target[field].value)
				attributes[field] = isNaN(parsedFloat) ? null : parsedFloat
			}

			availability = {}
			for (i in self.days) {
				day = self.days[i]
				times = {}
				if (day.selected) {
					times.beg = self.beg_hour + self.beg_min
					times.end = self.end_hour + self.end_min
				} else {
					times.beg = null
					times.end = null
				}
				availability[day.name] = times
			}

			attributes.availability = availability

			$.ajax({
				url: '/api/1/spots',
				method: 'post',
				data: JSON.stringify({
					data: {
						type: 'spots',
						attributes: attributes
					}
				}),
				contentType: "application/json; charset=utf-8",
    		dataType: "json",
    		success: function(response) {
					self.added = true
					self.update()
    		},
    		failure: function(error) {
    		}
			});
		}

		initMap = function() {
			self.currentLocation = [0, 0]
			map = L.mapbox.map('map', 'mapbox.streets')
				.setView(self.currentLocation, 16);
			marker = L.marker(self.currentLocation, {
				icon: L.mapbox.marker.icon({
					'marker-color': '#82B242',
					'marker-symbol': 'car'
				}),
				draggable: true
			}).addTo(map);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(pos) {
					self.location.longitude = pos.coords.longitude
					self.location.latitude = pos.coords.latitude
					self.currentLocation = [self.location.latitude, self.location.longitude]
					map.setView(self.currentLocation, 16)
					marker.setLatLng(L.latLng(self.location.latitude, self.location.longitude))
					self.update()
				})
			}

			ondragend = function() {
				var m = marker.getLatLng()
				self.location.longitude = m.lng
				self.location.latitude = m.lat
				self.update()
			}

			marker.on('dragend', ondragend);

			ondragend();
		};

		this.on('mount', function(){
		if (document.getElementById('map')) initMap()
		})
	
});
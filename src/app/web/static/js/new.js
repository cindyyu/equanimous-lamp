riot.tag('new', '<h1 class="logo"> <a href="/"><span class="yellow-text">Free</span> Parking</a> </h1> <form class="grid" onsubmit="{ addSpot }"> <div class="grid__col col--1-of-2"> <label for="location">Where is this awesome parking spot?</label> <input type="hidden" name="longitude" value="{ location.longitude }"> <input type="hidden" name="latitude" value="{ location.latitude }"> <div id="map"> <loading ></loading> </div> </div> <div class="grid__col col--1-of-2"> <label for="price">How much does it cost an hour?</label> <i class="material-icons">attach_money</i><input type="text" name="price"> <label for="max_stay">How long can you park here?</label> <i class="material-icons">av_timer</i><input type="text" name="max_stay"> <button __disabled="{ added }">{ added ? \'Got it!\' : \'Add Parking Spot\' }</button> <button if="{ added }" onclick="{ clearForm }">Add Another</button> </div> </form>', function(opts) {
		self = this
		self.location = {}
		self.added = false

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
				try {
					attributes[field] = parseFloat(e.target[field].value)
				} catch(err) {
					attributes[field] = null
				}
			}

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
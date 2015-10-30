<results class='grid grid--no-gutter'>

	<div class='grid__col col--3-of-5' id='map'></div><container class='grid__col col--2-of-5'>
		<logo />
		<form onsubmit={ getResults }>
			<input type='text' name='location_query' value={ query } /><button>
				<i class='material-icons'>search</i>
			</button>
		</form>
		<h2>Results</h2>
		<p if={ spots.length == 0 }>
			No parking spots found :( Found one?<br />
			<a href='/#/new' class='new-spot'>
				<i class='material-icons'>
					add_circle
				</i>
				Add Parking Spot
			</a>
		</p>
		<spots each={ spots }>
			<spot class={ selected == properties.id ? 'selected' : '' } onclick={ selectSpot }>
				<score>
					<button data-id={ properties.id } onclick={ increaseScore } disabled={ properties.delta > 0 }>
						<i class='material-icons'>keyboard_arrow_up</i>
					</button>
					{ properties.score }
					<button data-id={ properties.id } onclick={ decreaseScore } disabled={ properties.delta < 0 }>
						<i class='material-icons'>keyboard_arrow_down</i>
					</button>
				</score>
				<cost>
					<paid if={ properties.availability[self.day].beg <= parseInt(self.time) && parseInt(self.time) < properties.availability[self.day].end }>
						<price>${ properties.price }</price>
						<unit>per hour</unit>
					</paid>
					<free if={ properties.availability[self.day].beg > parseInt(self.time) || parseInt(self.time) >= properties.availability[self.day].end }>
						<price>free</price>
						<unit>at this time</unit>
					</free>
				</cost>
				<restrictions>
					<max_stay>{ properties.max_stay ? properties.max_stay : 'n/a' }</max_stay>
					<label>hours max</label>
				</restrictions>
				<view_address onclick={ view_address }>
					<icon>
						<i class='material-icons'>location_on</i>
					</icon>
					<label>get address</label>
				</view_address>
				<address if={ properties.address }>
					{ properties.address }
				</address>
			</spot>
		</spots>
	</container>

  <script>
  	self = this
  	self.query = riot.router.current.params.query

  	params = self.query.split('&')
  	for (i in params) {
  		param = params[i]
  		if (i == 0) {
  			self.query = param
  		} else {
  			k = param.split('=')[0]
  			v = param.split('=')[1]
  			self[k] = v
  		}
  	}

		self.location;
		self.selected;

		var map;
		var featureLayer;
		var geocoder;

		getResults = function(e) {
			e.preventDefault()
			location_query = e.target.location_query.value
			riot.route('/results/' + encodeURI(location_query))
		}

		view_address = function(e) {
			if (e.item.properties.address == null) {
				coordinates = e.item.geometry.coordinates
				geocoder.geocode({location: {
												lng: parseFloat(coordinates[0]),
												lat: parseFloat(coordinates[1])
											}}, function(response) {
												if (response.length > 0) {
													e.item.properties.address = response[0].formatted_address
													self.update()
												}
											})
			}
		}

		selectSpot = function(e) {
			if (e.target.tagName != 'A' && e.target.tagName != 'I') {
				self.selected = e.item.properties.id == self.selected ? null : e.item.properties.id
				featureLayer.eachLayer(function(marker) {
					if (marker.feature.properties.id === self.selected) {
						map.panTo(marker.getLatLng())
						marker.openPopup()
					} else {
						marker.closePopup()
					}
				})
			}
		}

		increaseScore = function(e) {
			e.preventDefault()
			button = e.target
			while (button.tagName != 'BUTTON') {
				button = button.parentElement;
			}
			changeScore(e.item, 1)()
		};
		decreaseScore = function(e) {
			e.preventDefault()
			button = e.target
			while (button.tagName != 'BUTTON') {
				button = button.parentElement;
			}
			changeScore(e.item, -1)()
		};

		changeScore = function(item, delta) {
			return function() {
				item.properties.score += delta
				item.properties.delta += delta
				$.ajax({
					url: '/api/1/spots/' + item.properties.id,
					method: 'patch',
					data: JSON.stringify({
						data: {
							type: 'spots',
							attributes: {
								score: item.properties.score
							}
						}
					}),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function(response) {

					},
					failure: function(error) {
					}
				});
			}
		}

		initMap = function() {
			geocoder = new google.maps.Geocoder();

			geocoder.geocode({'address': self.query}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					self.location = {
						longitude: results[0].geometry.location.lng(),
						latitude: results[0].geometry.location.lat()
					}

					console.log(results[0].geometry.location.lat())

					map = L.mapbox.map('map',
									   'mapbox.streets',
									   {
								  		   center: [self.location.latitude, self.location.longitude],
								  		   zoom: 16
									   }
									  )

					self.spots = []

					url = '/api/1/spots?longitude=' + self.location.longitude + '&latitude=' + self.location.latitude + '&radius=.05'
					if (self.day && self.time) {
						url += '&day=' + self.day + '&time=' + self.time
					}

					$.ajax({
						url: url,
						method: 'get',
						success: function(response) {
							results = response.data
							for (i in results) {
								result = results[i]
								self.spots.push({
									type: 'Feature',
									geometry: {
										type: 'Point',
										coordinates: [result.attributes.longitude, result.attributes.latitude]
									},
									properties: {
										'id': result.id,
										'title': result.id,
										'marker-color': '#82B242',
										'marker-size': 'medium',
      							'marker-symbol': 'car',
      							'delta': 0,
										'score': result.attributes.score,
										'price': result.attributes.price,
										'max_stay': result.attributes.max_stay,
										'availability': result.attributes.availability,
										'address': result.attributes.address
									}
								})
							}
							self.update()

							var features = self.spots.slice();
							features.push({
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: [self.location.longitude, self.location.latitude]
								},
								properties: {
									'marker-color': '#E9AE4A',
									'marker-size': 'medium',
      						"marker-symbol": "star"
								}
							});

							var geojson = {
								type: 'FeatureCollection',
								features: features
							};

							featureLayer = L.mapbox.featureLayer(geojson).addTo(map)
							featureLayer.setGeoJSON(geojson)
							featureLayer.eachLayer(function(layer) {
								props = layer.feature.properties
								var content = '<p>'
								if (props.address) content += '<b>' + props.address + '</b>'
								if (props.max_stay) content += 'Max Stay: ' + props.max_stay + ' hrs<br />'
								if (props.price) content += 'Costs $' + props.price + ' per hour'
								content += '</p>'
								if (props.id) layer.bindPopup(content)
							})
						}
					});

				} else {
					console.log('Geocode unsuccessful!')
				}
			})
		}

		this.on('mount', function() {
			if (typeof google != 'undefined' && typeof L != 'undefined') initMap()
		})
  </script>
</results>
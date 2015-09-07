riot.tag('homepage', '<h1> <span class="yellow-text">Free</span> <span class="white-text">Parking</span> </h1> <modes> <a href="#" onclick="{ switchMode }" class="{ mode == \'find\' ? \'active\' : \'\' }" data-mode="find"> <i class="material-icons"> directions_car </i> Find Parking </a> <a href="/#/new" class="{ mode == \'found\' ? \'active\' : \'\' }" data-mode="found"> <i class="material-icons"> add_circle </i> Add Parking Spot </a> </modes> <find if="{ mode == \'find\' }"> <form onsubmit="{ getResults }"> <input type="text" name="location_query" placeholder="I would like to park near..."><button> <i class="material-icons">search</i> </button> </form> </find> <found if="{ mode == \'found\' }"> i wanna help yay </found>', function(opts) {
		self.mode = 'find'

		switchMode = function(e) {
			e.preventDefault()
			mode = e.target.dataset.mode
			if (e.target.tagName != 'A') {
				parent = e.target.parentElement
				while (parent.tagName != 'A') {
					parent = parent.parentElement
				}
				mode = parent.dataset.mode
			}
			self.mode = mode
		}

		getResults = function(e) {
			e.preventDefault()
			location_query = e.target.location_query.value
			riot.route('/results/' + encodeURI(location_query))
		}
	
});
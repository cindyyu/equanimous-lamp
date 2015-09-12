riot.tag('homepage', '<logo ></logo> <modes> <a href="#" onclick="{ switchMode }" class="{ mode == \'find\' ? \'active\' : \'\' }" data-mode="find"> <i class="material-icons"> directions_car </i> Find Parking </a> <a href="/#/new" class="{ mode == \'found\' ? \'active\' : \'\' }" data-mode="found"> <i class="material-icons"> add_circle </i> Add Parking Spot </a> </modes> <find if="{ mode == \'find\' }"> <form onsubmit="{ getResults }"> <when> <button type="button" onclick="{ toggleWhen }" class="{ when == \'now\' ? \'selected\' : \'\' }" data-when="now">now</button> <button type="button" onclick="{ toggleWhen }" class="{ when == \'some other time\' ? \'selected\' : \'\' }" data-when="some other time">some other time</button> </when> <input type="text" name="location_query" placeholder="I would like to park near..."><button> <i class="material-icons">search</i> </button> <specific_time if="{ when == \'some other time\' }"> <select name="day"> <option selected disabled>Select Day</option> <option each="{ days }" value="{ abbrev }">{ full }</option> </select> at <select name="hour"> <option each="{ hours }">{ value }</option> </select> : <select name="minute"> <option each="{ minutes }">{ value }</option> </select> </specific_time> </form> </find>', function(opts) {
		self.mode = 'find'
		self.when = 'now'

		self.days = [
			{abbrev: 'sun', full: 'Sunday'},
			{abbrev: 'mon', full: 'Monday'},
			{abbrev: 'tue', full: 'Tuesday'},
			{abbrev: 'wed', full: 'Wednesday'},
			{abbrev: 'thu', full: 'Thursday'},
			{abbrev: 'fri', full: 'Friday'},
			{abbrev: 'sat', full: 'Saturday'}
		]

		toggleWhen = function(e) {
			e.preventDefault()
			self.when = self.when == 'now' ? 'some other time' : 'now'
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

			if (location_query == '') {
				addToolTip(e.target.location_query, 'error')
				e.target.location_query.className = 'error'
				return
			} else {
				e.target.location_query.className = ''
			}

			if (self.when == 'some other time') {
				day = e.target.day.value
				hour = e.target.hour.value
				minute = e.target.minute.value
			} else {
			  now = new Date()
				day = self.days[now.getDay()].abbrev
				hour = now.getHours()
				minute = now.getMinutes()
			}
			url = '/results/' + encodeURI(location_query)
			url += '&day=' + encodeURI(day) + '&time=' + hour + minute
			riot.route(url)
		}
	
});
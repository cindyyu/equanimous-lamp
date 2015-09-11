<homepage>
	<logo />
	<modes>
		<a href='#' onclick={ switchMode }
								class={ mode == 'find' ? 'active' : '' }
								data-mode='find'>
			<i class='material-icons'>
				directions_car
			</i>
			Find Parking
		</a>
		<a href='/#/new' class={ mode == 'found' ? 'active' : '' }
								data-mode='found'>
			<i class='material-icons'>
				add_circle
			</i>
			Add Parking Spot
		</a>
	</modes>

	<find if={ mode == 'find' }>
		<form onsubmit={ getResults }>
			<when>
				<button type='button' onclick={ toggleWhen } class={ when == 'now' ? 'selected' : '' } data-when='now'>now</button>
				<button type='button' onclick={ toggleWhen } class={ when == 'some other time' ? 'selected' : '' } data-when='some other time'>some other time</button>
			</when>
			<input type='text' name='location_query' placeholder='I would like to park near...'/><button>
				<i class='material-icons'>search</i>
			</button>
			<specific_time if={ when == 'some other time' }>
				<select name='day'>
					<option selected disabled>Select Day</option>
					<option value='sun'>Sunday</option>
					<option value='mon'>Monday</option>
					<option value='tue'>Tuesday</option>
					<option value='wed'>Wednesday</option>
					<option value='thu'>Thursday</option>
					<option value='fri'>Friday</option>
					<option value='sat'>Saturday</option>
				</select>
				at
				<select name='hour'>
					<option each={ hours }>{ value }</option>
				</select>
				:
				<select name='minute'>
					<option each={ minutes }>{ value }</option>
				</select>
			</specific_time>
		</form>
	</find>

	<script>
		self.mode = 'find'
		self.when = 'now'

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
			}
			url = '/results/' + encodeURI(location_query)
			if (self.when == 'some other time') {
				url += '&day=' + encodeURI(day) + '&time=' + encodeURI(hour + minute)
			}
			riot.route(url)
		}
	</script>
</homepage>
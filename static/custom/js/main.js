// Need to separate it to diferent files

/*
General requests
*/

// Currently logged user name is stored in localStorage
function get_comon_data() {
	const get_comon_data = localStorage.getItem("user_comon_data");
	const comon_data = JSON.parse(get_comon_data);
	// For testing
	console.log(comon_data);
	return comon_data;
}


/*
Alert modal
*/

function alerts_box(message) {
	$("#message-box").html(message);
	$("#alerts").slideDown(500);

	setTimeout(function() {
		$("#alerts").slideUp(1000);
	}, 15000);
}

/*
Valid form
*/
function valid_form() {
	let form_values = $("form input");
	for (var i = 0; i < form_values.length; i++) {
		if (form_values[i].value == null || form_values[i].value == "") {
			message = "Please fill up the form ...";
			alerts_box(message);
			return false;
		}
	}
	return true;
}

/*
Profile (index.hmtl) form requests
*/

function create_profile() {
	if (valid_form()) {
		let user_name = $("[name=username]").val();
		$.post(`${user_name}/data`, function(data, status) {
			if (data == user_name) {
				let message =
					"Profile " +
					`${data}` +
					" already exist Please try to log in instead.";
				alerts_box(message);
			} else if (data[0].status == status) {
				localStorage.setItem(
					"user_comon_data",
					JSON.stringify(`${data[1].profile}`)
				);
				window.location.replace(`/user/${data[1].profile}`);
			} else {
				let message = "Sorry. There seems to be a problem ...";
				alerts_box(message);
			}
		}).fail(function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		});
		return false;
	}
}

function check_login_details() {
	if (valid_form()) {
		let user_name = $("[name=username]").val();
		$.get(`${user_name}/data`, function(data) {
			if (data == "no profile") {
				let message =
					"Profile " +
					`${user_name}` +
					" does not exist. Create new profile instead";
				alerts_box(message);
			} else {
				localStorage.setItem("user_comon_data", JSON.stringify(user_name));
				window.location.replace(`/user/${user_name}`);
			}
		}).fail(function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		});
		return false;
	}
}

/*
Create Game (riddle.hmtl) 
*/

function create_riddle_game(form_data) {
	let user = get_comon_data();
	const riddle_game_data = new Game(
		form_data.categories.value,
		form_data.mods.value,
		form_data.tries.value,
		user
	);

	function Game(categories, mods, tries, user) {
		this.id = user;
		this.categories = categories;
		this.mods = mods;
		this.tries = tries;
	}

	$.post(
		`/postjson/${user}/riddle_g_setting`,
		JSON.stringify({ riddle_game_data: riddle_game_data }),
		function(data, status) {
			console.log(status);
			console.log(data);
			window.location.replace(`/user/${user}/riddle-game`);
		}
	).fail(function (xhr, status, error) {
		console.log(xhr);
		console.log(status);
		console.log(error);
	});

	return false;
}

// Riddle Game

function show_riddle_game() {
	let user = get_comon_data();
	$.get(`/postjson/${user}/riddle_g_setting`, function(data) {
		console.log(data);
		let riddle_game_data = data.game[0];
		$("#question").html("Q: " + riddle_game_data.question);
		$("#right-answers").html(
			"Correct answers: " + riddle_game_data.right_answers
		);
		$("#wrong-answers").html(
			"Wrong answers: " + riddle_game_data.wrong_answers
		);
		$("#skipped-questions").html(
			"Skipped questions: " + riddle_game_data.skipped_questions
		);

		console.log(riddle_game_data);
	}).fail(function (xhr, status, error) {
		console.log(xhr);
		console.log(status);
		console.log(error);
	});
	$("#riddle-game").fadeIn(5000);
}

function riddle_game_answer(form) {
	let user = get_comon_data();
	let answer = form.answer.value;
	console.log(answer);
	$.post(
		`/postjson/${user}/riddle-game`,
		JSON.stringify({ answer: answer }),
		function(data) {
			let riddle_game_data = data.game[0];
			if (riddle_game_data.result == "Correct") {
				$("#result").html(riddle_game_data.result);
			} else {
				$("#result").html(riddle_game_data.result);
			}
			$("#right-answers").html(
				"Correct answers: " + riddle_game_data.right_answers
			);
			$("#wrong-answers").html(
				"Wrong answers: " + riddle_game_data.wrong_answers
			);
			$("#skipped-questions").html(
				"Skipped questions: " + riddle_game_data.skipped_questions
			);
		}
	).fail(function (xhr, status, error) {
		console.log(xhr);
		console.log(status);
		console.log(error);
	});
	return false;
}

function skip_question() {
	return false;
}
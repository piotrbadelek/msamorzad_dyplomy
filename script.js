"use strict";

if (!("content" in document.createElement("template"))) {
	// Extremely outdated browser with no support for HTML templates. Do not proceed.
	// Anything 2015+ should pass.
	alert("Zaaktualizuj przeglądarkę internetową aby skorzystać z generatora.");
}

let rewards = [];
let rewardsIndex = 0;
let commendations = [];
let commendationsIndex = 0;
let congratulations = [];
let congratulationsIndex = 0;

/**
 * Toggle the currently visible tab in the UI
 * @param tab 0 - Start, 1 - Rewards, 2 - congratulations, 3 - commendations
 */
function changeTab(tab) {
	for (let i = 0; i < 4; i++) {
		if (i !== tab) {
			me(`[data-tab="${i}"]`).styles("display: none");
			me(`[data-tab-label="${i}"]`).styles("font-weight: 400");
		} else {
			me(`[data-tab="${i}"]`).styles("display: block");
			me(`[data-tab-label="${i}"]`).styles("font-weight: 700");
		}
	}
}

function cleanState(type) {
	if (type === "reward") {
		rewards = [];
		me("#reward_list").innerHTML = "";
	} else if (type === "commendation") {
		commendations = [];
		me("#commendation_list").innerText = "";
	} else if (type === "congratulations") {
		congratulations = [];
		me("#congratulations_list").innerText = "";
	}
}

function newProject() {
	cleanState("rewards");
	cleanState("congratulations");
	cleanState("commendation");
	changeTab(1);
}

me("#new-project").on("click", newProject);

for (let i = 0; i < 4; i++) {
	me(`[data-tab-label="${i}"`).on("click", () => {
		changeTab(i);
	});
}

function openCreationDialogue(id_fragment) {
	me(`#${id_fragment}-dialog`).show();
	const template = me(`#${id_fragment}-template`);
	const preview = me(`#${id_fragment}-dialog .dialog_preview`);
	const clone = template.content.cloneNode(true);
	preview.append(clone);
	me(`#${id_fragment}_id`).value = "none";
}

me("#new-reward").on("click", () => {
	openCreationDialogue("reward");
});
me("#new-congratulations").on("click", () => {
	openCreationDialogue("congratulations");
});
me("#new-commendation").on("click", () => {
	openCreationDialogue("commendation");
});

function editRewardDialogue(rewardID) {
	let reward = rewards.find(r => r.ID === rewardID);
	openCreationDialogue("reward");
	me("#reward_name").value = reward.name;
	me("#reward_pronoun").value = reward.pronoun;
	me("#reward_class").value = reward.class;
	me("#reward_grade").value = reward.grade;
	me("#reward_behaviour").value = reward.behaviour;
	me("#reward_work").value = reward.work;
	me("#reward_bearer").value = reward.bearer;
	me("#reward_promotion").value = reward.promotion;
	me("#reward_contests").value = reward.contests;
	me("#reward_id").value = reward.ID;
}

function editCongratulationsDialogue(congratulationsID) {
	let congratulation = congratulations.find(c => c.ID === congratulationsID);
	openCreationDialogue("congratulations");
	me("#congratulations_id").value = congratulation.ID;
	me("#congratulations_student_name").value = congratulation.student_name;
	me("#congratulations_student_pronoun").value = congratulation.pronoun_student
	me("#congratulations_parent_name").value = congratulation.parent_name;
	me("#congratulations_parent_pronoun").value = congratulation.pronoun_parent;
	me("#congratulations_behaviour").value = `${congratulation.behaviour}`;
	me("#congratulations_grade").value = `${congratulation.grades}`;
}

function editCommendationDialogue(commendationID) {
	let commendation = commendations.find(c => c.ID === commendationID);
	openCreationDialogue("commendation");
	me("#commendation_id").value = commendation.ID;
	me("#commendation_parent_name").value = commendation.parent_name;
	me("#commendation_parent_pronoun").value = commendation.pronoun_parent;
}

function closeDialogueWithoutSaving(id_fragment) {
	me(`#${id_fragment}-dialog`).close();
	me(`#${id_fragment}-dialog .dialog_preview`).innerHTML = "";
}

function createListEntry(template, list, data) {
	const clone = template.content.cloneNode(true);
	clone.querySelector("[data-template='STUDENT_NAME']").innerText = data.name ?? "";
	clone.querySelector("[data-template='PARENT_NAME']").innerText = data.parent ?? "";
	if (data.type === "reward") {
		clone.querySelector("[data-reward-id]").dataset.rewardId = data.ID;
		clone.querySelector("[data-template='EDIT']").addEventListener("click", () => {
			editRewardDialogue(data.ID);
		});
		clone.querySelector("[data-template='DELETE']").addEventListener("click", () => {
			deleteReward(data.ID);
		});
	} else if (data.type === "congratulation") {
		clone.querySelector("[data-congratulations-id]").dataset.congratulationsId = data.ID;
		clone.querySelector("[data-template='EDIT']").addEventListener("click", () => {
			editCongratulationsDialogue(data.ID);
		});
		clone.querySelector("[data-template='DELETE']").addEventListener("click", () => {
			deleteCongratulations(data.ID);
		});
	} else if (data.type === "commendation") {
		clone.querySelector("[data-commendation-id]").dataset.commendationId = data.ID;
		clone.querySelector("[data-template='EDIT']").addEventListener("click", () => {
			editCommendationDialogue(data.ID);
		});
		clone.querySelector("[data-template='DELETE']").addEventListener("click", () => {
			deleteCommendation(data.ID);
		});
	}
	list.append(clone);
}

function closeRewardDialogueAndSave() {
	const reward_id = me("#reward_id").value;
	let reward = {};
	if (reward_id !== "none") {
		reward = rewards.find(r => r.ID === +reward_id);
		let index = rewards.map(reward => {
			return reward.ID;
		}).indexOf(+reward_id);

		rewards[index] = {
			name: me("#reward_name").value,
			pronoun: me("#reward_pronoun").value,
			class: me("#reward_class").value,
			grade: me("#reward_grade").value,
			behaviour: me("#reward_behaviour").value,
			work: me("#reward_work").value,
			bearer: me("#reward_bearer").value,
			promotion: me("#reward_promotion").value,
			contests: me("#reward_contests").value,
			ID: +reward_id
		};

		me(`[data-reward-id="${reward.ID}"] [data-template='STUDENT_NAME']`).innerText = rewards[index].name;
		me(`[data-reward-id="${reward.ID}"] [data-template='PARENT_NAME']`).innerText = "";
	} else {
		reward = rewards.push({
			name: me("#reward_name").value,
			pronoun: me("#reward_pronoun").value,
			class: me("#reward_class").value,
			grade: me("#reward_grade").value,
			behaviour: me("#reward_behaviour").value,
			work: me("#reward_work").value,
			bearer: me("#reward_bearer").value,
			promotion: me("#reward_promotion").value,
			contests: me("#reward_contests").value,
			ID: rewardsIndex++
		});
		reward = rewards[reward - 1];

		const template = me("#list-item");
		const list = me("#reward_list");
		reward.type = "reward"
		createListEntry(template, list, reward);
	}

	closeDialogueWithoutSaving("reward");
}

me("#reward-dialog-cancel").on("click", () => {
	closeDialogueWithoutSaving("reward");
});
me("#reward-dialog-add").on("click", closeRewardDialogueAndSave);

function closeCongratulationsDialogueAndSave() {
	const congratulations_id = me("#congratulations_id").value;
	let congratulation = {};
	if (congratulations_id !== "none") {
		congratulation = congratulations.find(c => c.ID === +congratulations_id);
		let index = congratulations.map(congrats => {
			return congrats.ID;
		}).indexOf(+congratulations_id);

		congratulations[index] = {
			student_name: me("#congratulations_student_name").value,
			pronoun_student: me("#congratulations_student_pronoun").value,
			parent_name: me("#congratulations_parent_name").value,
			pronoun_parent: me("#congratulations_parent_pronoun").value,
			behaviour: +me("#congratulations_behaviour").value,
			grades: +me("#congratulations_grade").value,
			ID: +congratulations_id
		};

		me(`[data-congratulations-id="${congratulation.ID}"] [data-template='STUDENT_NAME']`).innerText = congratulations[index].student_name;
		me(`[data-congratulations-id="${congratulation.ID}"] [data-template='PARENT_NAME']`).innerText = ` (${congratulations[index].parent_name})`;
	} else {
		congratulation = congratulations.push({
			student_name: me("#congratulations_student_name").value,
			pronoun_student: me("#congratulations_student_pronoun").value,
			parent_name: me("#congratulations_parent_name").value,
			pronoun_parent: me("#congratulations_parent_pronoun").value,
			behaviour: +me("#congratulations_behaviour").value,
			grades: +me("#congratulations_grade").value,
			ID: congratulationsIndex++
		});
		congratulation = congratulations[congratulation - 1];

		const template = me("#list-item");
		const list = me("#congratulations_list");
		createListEntry(template, list, {
			name: congratulation.student_name,
			parent: ` (${congratulation.parent_name})`,
			ID: congratulation.ID,
			type: "congratulation"
		});
	}

	closeDialogueWithoutSaving("congratulations");
}

me("#congratulations-dialog-cancel").on("click", () => {
	closeDialogueWithoutSaving("congratulations");
});
me("#congratulations-dialog-add").on("click", closeCongratulationsDialogueAndSave);

function closeCommendationDialogueAndSave() {
	const commendation_id = me("#commendation_id").value;
	let commendation = {};
	if (commendation_id !== "none") {
		commendation = commendations.find(c => c.ID === +commendation_id);
		let index = commendations.map(commend => {
			return commend.ID;
		}).indexOf(+commendation_id);

		commendations[index] = {
			parent_name: me("#commendation_parent_name").value,
			pronoun_parent: me("#commendation_parent_pronoun").value,
			ID: +commendation_id
		};

		me(`[data-commendation-id="${commendation.ID}"] [data-template='PARENT_NAME']`).innerText = commendations[index].parent_name;
	} else {
		commendation = commendations.push({
			parent_name: me("#commendation_parent_name").value,
			pronoun_parent: me("#commendation_parent_pronoun").value,
			ID: commendationsIndex++
		});
		commendation = commendations[commendation - 1];

		const template = me("#list-item");
		const list = me("#commendation_list");
		createListEntry(template, list, {
			parent: commendation.parent_name,
			ID: commendation.ID,
			type: "commendation"
		});
	}

	closeDialogueWithoutSaving("commendation");
}

me("#commendation-dialog-cancel").on("click", () => {
	closeDialogueWithoutSaving("commendation");
});
me("#commendation-dialog-add").on("click", closeCommendationDialogueAndSave);

function updateRewardTemplate(template, options) {
	template.querySelector(`[data-template="STUDENT_NAME"]`).innerText = options.name;
	template.querySelector(`[data-template="PRONOUN_CLASS"]`).innerText = `${options.pronoun} klasy ${options.class}`;
	let achievementsText = "za ";

	switch (options.grade) {
		case 6:
			achievementsText += "celujące wyniki w nauce,<br>"
			break;
		case 5:
			achievementsText += "bardzo dobre wyniki w nauce,<br>"
			break;
		case 4:
			achievementsText += "dobre wyniki w nauce,<br>"
			break;
	}

	switch (options.behaviour) {
		case 6:
			achievementsText += "wzorowe zachowanie,<br>"
			break;
		case 5:
			achievementsText += "bardzo dobre zachowanie,<br>"
			break;
	}

	switch (options.work) {
		case "both":
			achievementsText += "pracę na rzecz szkoły i klasy,<br>"
			break;
		case "school":
			achievementsText += "pracę na rzecz szkoły,<br>"
			break;
		case "class":
			achievementsText += "pracę na rzecz klasy,<br>"
			break;
	}

	if (options.bearer === "yes") {
		achievementsText += "udział w poczcie sztandarowym,<br>"
	}

	if (options.promotion === "yes") {
		achievementsText += "udział w promocji szkoły,<br>"
	}

	switch (options.contests) {
		case "both":
			achievementsText += "udział w olimpiadach i konkursach,<br>"
			break;
		case "olimpiad":
			achievementsText += "udział w olimpiadach,<br>"
			break;
		case "contests":
			achievementsText += "udział w konkursach,<br>"
			break;
	}

	const replaceLast = (str, pattern, replacement) => {
		const last = str.lastIndexOf(pattern);
		return last !== -1
			? `${str.slice(0, last)}${replacement}${str.slice(last + pattern.length)}`
			: str;
	};

	achievementsText = replaceLast(achievementsText, ",<br>", "");
	achievementsText = replaceLast(achievementsText, ",<br>", "<br>oraz ");

	if (achievementsText === "za ") {
		achievementsText = "";
	}

	template.querySelector(`[data-template="ACHIEVEMENTS"]`).innerHTML = achievementsText;
	template.querySelector("time").innerText = me("#print_date").value;
}

function measureTextWidth(text) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	return Math.floor(ctx.measureText(text).width);
}

function updateCongratulationsTemplate(template, options) {
	template.querySelector(`[data-template="STUDENT_NAME"]`).innerText = options.student_name;
	template.querySelector(`[data-template="PRONOUN_STUDENT"]`).innerText = options.pronoun_student;
	template.querySelector(`[data-template="PARENT_NAME"]`).innerText = options.parent_name;
	template.querySelector(`[data-template="PRONOUN_PARENT"]`).innerText = options.pronoun_parent;

	let behaviour = null;
	switch (options.behaviour) {
		case 6:
			behaviour = "wzorowej";
			break;
		case 5:
			behaviour = "bardzo dobrej";
			break;
	}
	let grades = null;
	switch (options.grades) {
		case 6:
			grades = "celujących";
			break;
		case 5:
			grades = "bardzo dobrych";
			break;
		case 4:
			grades = "dobrych";
			break;
	}

	template.querySelector(`[data-template="BEHAVIOUR"]`).innerText = behaviour ?? "";
	template.querySelector(`[data-template="GRADES"]`).innerText = grades ?? "";
	template.querySelector("time").innerText = me("#print_date").value;
}

function updateCommendationTemplate(template, options) {
	template.querySelector(`[data-template="PARENT_NAME"]`).innerText = options.parent_name;
	template.querySelector(`[data-template="PARENT_PRONOUN"]`).innerText = options.pronoun_parent;
	template.querySelector("time").innerText = me("#print_date").value;
}

function scaleCongratulationsTemplateText(text, print = false) {
	let width = measureTextWidth(text);
	if (print) {
		let fontSize = "3rem";
		if (width > 190) {
			fontSize = "1.67rem";
		} else if (width > 160) {
			fontSize = "2rem";
		} else if (width > 108) {
			fontSize = "2.5rem";
		}
		return fontSize;
	} else {
		let fontSize = "1.5rem";
		if (width > 207) {
			fontSize = ".85rem";
		} else if (width > 173) {
			fontSize = "1rem";
		} else if (width > 148) {
			fontSize = "1.25rem";
		}
		return fontSize;
	}
}

any("#reward-dialog .input-group").on("input", () => {
	const preview = me("#reward-dialog .dialog_preview");
	updateRewardTemplate(preview, {
		name: me("#reward_name").value,
		pronoun: me("#reward_pronoun").value,
		class: me("#reward_class").value,
		grade: +me("#reward_grade").value,
		behaviour: +me("#reward_behaviour").value,
		work: me("#reward_work").value,
		bearer: me("#reward_bearer").value,
		promotion: me("#reward_promotion").value,
		contests: me("#reward_contests").value,
	});
});

any("#congratulations-dialog .input-group").on("input", () => {
	const preview = me("#congratulations-dialog .dialog_preview");
	let parent_name = me("#congratulations_parent_name").value;
	updateCongratulationsTemplate(preview, {
		student_name: me("#congratulations_student_name").value,
		pronoun_student: me("#congratulations_student_pronoun").value,
		parent_name: parent_name,
		pronoun_parent: me("#congratulations_parent_pronoun").value,
		behaviour: +me("#congratulations_behaviour").value,
		grades: +me("#congratulations_grade").value
	});

	me("#congratulations-dialog .dialog_preview h2").styles(`font-size: ${scaleCongratulationsTemplateText(parent_name)}`);
});

any("#commendation-dialog .input-group").on("input", () => {
	const preview = me("#commendation-dialog .dialog_preview");
	updateCommendationTemplate(preview, {
		parent_name: me("#commendation_parent_name").value,
		pronoun_parent: me("#commendation_parent_pronoun").value,
	});

	if (measureTextWidth(me("#commendation_parent_name").value) > 90) {
		me("#commendation-dialog .dialog_preview h2").styles("font-size: 1.75rem");
	} else {
		me("#commendation-dialog .dialog_preview h2").styles("font-size: 2rem");
	}
});

function deleteReward(rewardID) {
	if (confirm("Czy na pewno chcesz usunąć nagrodę?")) {
		rewards = rewards.filter(r => r.ID !== rewardID);
		me(`[data-reward-id="${rewardID}"]`).remove();
	}
}

function deleteCongratulations(congratulationID) {
	if (confirm("Czy na pewno chcesz usunąć list gratulacyjny?")) {
		congratulations = congratulations.filter(c => c.ID !== congratulationID);
		me(`[data-congratulations-id="${congratulationID}"]`).remove();
	}
}

function deleteCommendation(commendationID) {
	if (confirm("Czy na pewno chcesz usunąć list pochwalny?")) {
		commendations = commendations.filter(c => c.ID !== commendationID);
		me(`[data-commendation-id="${commendationID}"]`).remove();
	}
}

function turnIntoCSV(id_fragment) {
	const downloadLink = document.createElement("a");
	let blob = null;
	if (id_fragment === "rewards") {
		blob = new Blob(["\ufeff", Papa.unparse(rewards)]);
	} else if (id_fragment === "congratulations") {
		blob = new Blob(["\ufeff", Papa.unparse(congratulations)]);
	} else if (id_fragment === "commendations") {
		blob = new Blob(["\ufeff", Papa.unparse(commendations)]);
	}
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = `${id_fragment}_export.csv`;

	document.body.appendChild(downloadLink);
	downloadLink.click();
}

me("#download-reward-csv").on("click", () => {
	turnIntoCSV("rewards");
});

me("#download-congratulations-csv").on("click", () => {
	turnIntoCSV("congratulations");
});

me("#download-commendations-csv").on("click", () => {
	turnIntoCSV("commendations");
});

function cleanPrintable() {
	me(".printable__no_content_warning").styles("display: none");
	any(".printable :not(.printable__no_content_warning)")?.forEach(element => {
		element.remove();
	});
}

function createRewardPrintable() {
	const template = me("#reward-template");
	const printable = me(".printable");

	cleanPrintable();

	rewards.forEach(reward => {
		const clone = template.content.cloneNode(true);
		updateRewardTemplate(clone, {
			...reward
		});
		printable.append(clone);
	});

	print();
}

me("#print-rewards").on("click", createRewardPrintable);

function createCongratulationsPrintable() {
	const template = me("#congratulations-template");
	const printable = me(".printable");

	cleanPrintable();

	congratulations.forEach(congratulation => {
		const clone = template.content.cloneNode(true);
		updateCongratulationsTemplate(clone, {
			...congratulation
		});
		clone.querySelector("h2").style.fontSize = `${scaleCongratulationsTemplateText(congratulation.parent_name, true)}`;
		printable.append(clone);
	});

	print();
}

me("#print-congratulations").on("click", createCongratulationsPrintable);

function createCommendationPrintable() {
	const template = me("#commendation-template");
	const printable = me(".printable");

	cleanPrintable();

	commendations.forEach(commendation => {
		const clone = template.content.cloneNode(true);
		updateCommendationTemplate(clone, {
			...commendation
		});
		printable.append(clone);
	});

	print();
}

me("#print-commendations").on("click", createCommendationPrintable);

function loadCSV() {
	let inputElement = document.createElement("input");
	inputElement.type = "file";
	inputElement.accept = ".csv,text/csv";
	inputElement.addEventListener("change", e => {
		e.target.files[0].text().then(data => {
			let csv = Papa.parse(data, {
				header: true
			});
			let keys = Object.keys(csv.data[0]);
			const template = me("#list-item");
			if (keys.includes("bearer")) {
				// Reward
				cleanState("reward");
				const list = me("#reward_list");
				csv.data.forEach(reward => {
					rewards.push(reward);
					createListEntry(template, list, reward);
				});
				changeTab(1);
			} else if (keys.includes("pronoun_parent") && keys.includes("pronoun_student")) {
				// Congratulations
				cleanState("congratulations");
				const list = me("#congratulations_list");
				csv.data.forEach(congratulation => {
					congratulation.ID = +congratulation.ID;
					congratulations.push(congratulation);
					createListEntry(template, list, {
						name: congratulation.student_name,
						parent: ` (${congratulation.parent_name})`,
						ID: congratulation.ID,
						type: "congratulation"
					});
				});
				changeTab(2);
			} else if (keys.includes("pronoun_parent") && !keys.includes("pronoun_student")) {
				// Congratulations
				cleanState("commendations");
				const list = me("#commendation_list");
				csv.data.forEach(commendation => {
					commendation.ID = +commendation.ID;
					commendations.push(commendation);
					createListEntry(template, list, {
						parent: commendation.parent_name,
						ID: commendation.ID,
						type: "commendation"
					});
				});
				changeTab(3);
			}
		}).then(() => {
			inputElement.remove();
		});
	});
	inputElement.dispatchEvent(new MouseEvent("click"));
}

me("#load-csv").on("click", loadCSV);
"use strict";

const form = document.querySelector("form");
const modal = document.querySelector(".modal");

function showModal() {
	modal.classList.add("show");
	setTimeout(() => {
		hideModal();
	}, 5000);
}
function hideModal() {
	modal.classList.remove("show");
	modal.classList.add("hide");
	modal.addEventListener(
		"animationend",
		() => {
			modal.classList.remove("show", "hide");
		},
		{ once: true },
	);
}

function showError(input, errorMessage) {
	if (input != null) {
		input.classList.add("error-state");
	}
	errorMessage.classList.remove("hidden");
}
function removeError(input, errorMessage) {
	if (input != null) {
		input.classList.remove("error-state");
	}
	errorMessage.classList.add("hidden");
}

form.addEventListener("submit", (e) => {
	// to stop the refresh of the form
	let isFormValid = true;
	e.preventDefault();

	const textInputs = document.querySelectorAll(`input[type="text"][required],
		input[type="email"][required],textarea[required]`);

	// Validation for required text input and email and textarea
	textInputs.forEach((input) => {
		//NOTE this selects the closest parent has this class Name
		const parent = input.closest(".text-field");
		const errorMessage = parent.querySelector(".error-message");

		if (input.value.trim() === "") {
			showError(input, errorMessage);
			isFormValid = false;
		} else {
			// NOTE we can check type by dot directly element.type ==="email"
			if (input.type === "email") {
				//NOTE here is how we can define a regex in javascript
				const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				//NOTE here is how we can text the value if follow the regex or not
				if (emailPattern.test(input.value)) {
					removeError(input, errorMessage);
				} else {
					showError(input, errorMessage);
					isFormValid = false;
				}
			} else {
				removeError(input, errorMessage);
			}
		}
	});

	// validation for required radio option
	const requiredRadioFields = document.querySelectorAll(`.radio-field:has(input[type="radio"][required]`);
	requiredRadioFields.forEach((radioField) => {
		const errorMsg = radioField.querySelector(".error-message");

		const selectedOption = radioField.querySelector(`input[type="radio"]:checked`);
		if (selectedOption) {
			removeError(null, errorMsg);
		} else {
			isFormValid = false;
			showError(null, errorMsg);
		}
	});

	// validation for required checkboxes option
	const requiredCheckboxFields = document.querySelectorAll(`.checkbox-field:has(input[type="checkbox"][required])`);

	requiredCheckboxFields.forEach((field) => {
		const errorMsg = field.querySelector(".error-message");
		const requiredCheckboxs = field.querySelectorAll(`input[type="checkbox"][required]`);
		const checkedRequiredChk = field.querySelectorAll(`input[type="checkbox"][required]:checked`);
		if (requiredCheckboxs.length !== checkedRequiredChk.length) {
			showError(null, errorMsg);
			isFormValid = false;
		} else {
			removeError(null, errorMsg);
		}
	});

	if (isFormValid) {
		const data = new FormData(form);
		const params = new URLSearchParams(data).toString();

		// 2. Log it so you can see the "URI" format in the console
		console.log("Data that would be in URI: ?" + params);
		showModal();
		form.reset();
	}
});
// modal.addEventListener("click", hideModal);

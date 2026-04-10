// ---------- CONFIG ----------
const BASE_WIDTH = 1080;
const BASE_HEIGHT = 1920;

// ---------- DATA ----------
const minerales = [
	{ nombre: "Quantinium", firma: 3170 },
	{ nombre: "Stileron", firma: 3185 },
	{ nombre: "Savrilium", firma: 3200 },
	{ nombre: "Ouratite", firma: 3370 },
	{ nombre: "Riccite", firma: 3385 },
	{ nombre: "Lindinium", firma: 3400 },
	{ nombre: "Beryl", firma: 3540 },
	{ nombre: "Taranite", firma: 3555 },
	{ nombre: "Borase", firma: 3570 },
	{ nombre: "Gold", firma: 3585 },
	{ nombre: "Bexalite", firma: 3600 },
	{ nombre: "Laranite", firma: 3825 },
	{ nombre: "Aslarite", firma: 3840 },
	{ nombre: "Titanium", firma: 3855 },
	{ nombre: "Tunsteno", firma: 3870 },
	{ nombre: "Agricium", firma: 3885 },
	{ nombre: "Torite", firma: 3900 },
	{ nombre: "Haphestanite", firma: 4180 },
	{ nombre: "Tin", firma: 4195 },
	{ nombre: "Quartz", firma: 4210 },
	{ nombre: "Corundum", firma: 4225 },
	{ nombre: "Copper", firma: 4240 },
	{ nombre: "Silicon", firma: 4255 },
	{ nombre: "Iron", firma: 4270 },
	{ nombre: "Aluminium", firma: 4285 },
	{ nombre: "Ice", firma: 4300 }
];

// ---------- STATE ----------
const state = {
	baseFirma: 0,
	currentValue: 0
};

// ---------- DOM ----------
const UI = {
	app: document.querySelector('.app'),
	display: document.getElementById('display-number'),
	slider: document.getElementById('multiplier-slider'),
	multiplierText: document.getElementById('multiplier-text'),
	status: document.getElementById('dynamic-msg'),
	keypad: document.querySelector('.keypad'),
	tabs: document.querySelectorAll('.tabs__button'),
	tableBody: document.getElementById('mining-body')
};

// ---------- UTILS ----------
function formatMiles(num) {
	return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ---------- SCALE ----------
function fitToScreen() {
	const scale = Math.min(
		window.innerWidth / BASE_WIDTH,
		window.innerHeight / BASE_HEIGHT
	);
	UI.app.style.transform = `scale(${scale})`;
}

// ---------- LOGIC ----------
function scanSignal() {
	const value = state.currentValue;
	let found = null;
	let clusters = 0;

	if (value > 0) {
		for (const mineral of minerales) {
			for (let c = 1; c <= 12; c++) {
				if (mineral.firma * c === value) {
					found = mineral;
					clusters = c;
					break;
				}
			}
			if (found) break;
		}
	}

	if (found) {
		state.baseFirma = found.firma;
		UI.status.innerHTML = `<span style="color:#00ffcc">${found.nombre.toUpperCase()}!</span>`;
		UI.slider.value = clusters;
		updateDisplay();
	} else {
		state.baseFirma = 0;
		UI.status.innerText = "WAITING FOR ENTRY...";
	}
}

function updateDisplay() {
	const multiplier = Number(UI.slider.value);
	UI.multiplierText.innerText = `CLUSTER: ${multiplier}`;

	if (state.baseFirma > 0) {
		state.currentValue = state.baseFirma * multiplier;
		UI.display.innerText = formatMiles(state.currentValue);
	}
}

// ---------- INPUT ----------
function handleKeypad(e) {
	const btn = e.target.closest('.key');
	if (!btn) return;

	// Número
	if (btn.dataset.val !== undefined) {
		const digit = btn.dataset.val;
		let raw = String(state.currentValue || 0).replace(/\./g, '');
        if (raw.length >=9) return;
		raw = raw === "0" ? digit : raw + digit;

		state.currentValue = Number(raw);
		UI.display.innerText = formatMiles(state.currentValue);
		scanSignal();
	}

	// Delete
	if (btn.classList.contains('key--delete')) {
		let raw = String(state.currentValue || 0).replace(/\./g, '');
		raw = raw.length > 1 ? raw.slice(0, -1) : "0";

		state.currentValue = Number(raw);
		UI.display.innerText = formatMiles(state.currentValue);
		scanSignal();
	}

	// Clear
	if (btn.classList.contains('key--clear')) {
		state.currentValue = 0;
		state.baseFirma = 0;
		UI.display.innerText = "0";
		scanSignal();
	}
}

// ---------- TABLE ----------
function populateTable() {
	UI.tableBody.innerHTML = '';
	minerales.forEach(mineral => {
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${mineral.nombre.toUpperCase()}</td>
			<td>${formatMiles(mineral.firma)}</td>
		`;
		UI.tableBody.appendChild(row);
	});
}

// ---------- TABS ----------
function handleTabs() {
	UI.tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			UI.tabs.forEach(t => t.classList.remove('tabs__button--active'));
			tab.classList.add('tabs__button--active');

			UI.app.classList.toggle('app--show-table', index === 0);
		});
	});
}

// ---------- INIT ----------
function init() {
	fitToScreen();
	populateTable();
	updateDisplay();

	UI.keypad.addEventListener('click', handleKeypad);
	UI.slider.addEventListener('input', updateDisplay);
	UI.app.classList.add('app--show-table');

	handleTabs();
	window.addEventListener('resize', fitToScreen);
}

document.addEventListener('DOMContentLoaded', init);

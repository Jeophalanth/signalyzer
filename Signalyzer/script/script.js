function fitToScreen() {
    const scaler = document.getElementById('scaler');
    if (!scaler) return;
    const canvasWidth = 1080;
    const canvasHeight = 1920;
    const scaleX = window.innerWidth / canvasWidth;
    const scaleY = window.innerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);
    scaler.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', fitToScreen);
window.addEventListener('load', fitToScreen);

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display-number');
    const slider = document.getElementById('multiplier-slider');
    const multiplierText = document.getElementById('multiplier-text');
    const infoBox = document.getElementById('dynamic-msg');
    
    let firmaBaseDetectada = 0;

    const minerales = [
        { nombre: "Quantinium", firma: 3170 }, { nombre: "Stileron", firma: 3185 },
        { nombre: "Savrilium", firma: 3200 }, { nombre: "Ouratite", firma: 3370 },
        { nombre: "Riccite", firma: 3385 }, { nombre: "Gold Lindinium", firma: 3400 },
        { nombre: "Beryl", firma: 3540 }, { nombre: "Taranite", firma: 3555 },
        { nombre: "Borase", firma: 3570 }, { nombre: "Gold", firma: 3585 },
        { nombre: "Bexalite", firma: 3600 }, { nombre: "Laranite", firma: 3825 },
        { nombre: "Aslarite", firma: 3840 }, { nombre: "Titanium", firma: 3855 },
        { nombre: "Tunsteno", firma: 3870 }, { nombre: "Agricium", firma: 3885 },
        { nombre: "Torite", firma: 3900 }, { nombre: "Haphestanite", firma: 4180 },
        { nombre: "Tin", firma: 4195 }, { nombre: "Quartz", firma: 4210 },
        { nombre: "Corundum", firma: 4225 }, { nombre: "Copper", firma: 4240 },
        { nombre: "Silicon", firma: 4255 }, { nombre: "Iron", firma: 4270 },
        { nombre: "Aluminium", firma: 4285 }, { nombre: "Ice", firma: 4300 }
    ];

    function scanSignal() {
        const n = parseInt(display.innerText);
        let encontrado = null;
        let clustersDetectados = 0;

        if (n > 0) {
            for (let m of minerales) {
                for (let c = 1; c <= 12; c++) {
                    if (m.firma * c === n) {
                        encontrado = m;
                        clustersDetectados = c;
                        break;
                    }
                }
                if (encontrado) break;
            }
        }

        if (encontrado) {
            firmaBaseDetectada = encontrado.firma;
            infoBox.innerHTML = `<span style="color: #00ffcc; font-size: 70px; font-weight: bold;">${encontrado.nombre.toUpperCase()}!</span>`;
            
           slider.value = clustersDetectados;
            updateFormula();
        } else {
            firmaBaseDetectada = 0;
            infoBox.innerText = "ESPERANDO ENTRADA...";
        }
    }

    function updateFormula() {
        const x = parseInt(slider.value);
        multiplierText.innerText = `n * ${x}`;

        if (firmaBaseDetectada > 0) {
            display.innerText = firmaBaseDetectada * x;
        }
    }

    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            if (val === null) return;

            if (display.innerText === "0") display.innerText = val;
            else if (display.innerText.length < 10) display.innerText += val;
            
            scanSignal(); 
        });
    });

    slider.addEventListener('input', () => {
        updateFormula();
    });

    document.getElementById('backspace').addEventListener('click', () => {
        let current = display.innerText;
        display.innerText = (current.length > 1) ? current.slice(0, -1) : "0";
        scanSignal();
    });

    document.getElementById('clear-all').addEventListener('click', () => {
        display.innerText = "0";
        firmaBaseDetectada = 0;
        scanSignal();
    });

    updateFormula();
});

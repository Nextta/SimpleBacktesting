var btnWin = document.getElementById("win");
var btnLoss = document.getElementById("loss");
var rr = document.getElementById("rrData");
var capital = document.getElementById("capital");
var winTotal = document.getElementById("winsTotal");
var lossTotal = document.getElementById("lossTotal");
var opTotal = document.getElementById("opTotal");
var activo = document.getElementById("actData");
var table = document.getElementById("tableData");
var bs = document.getElementById("bs");
var btnSave = document.getElementById("save");
var jsonData = { tableData: [] };

function buildJSON(id, activo, rr, buy_sell, result, estado, cPrevio) {
    jsonData.tableData.push({
        id_Data: id,
        par: activo,
        ratio: rr,
        bs: buy_sell,
        resultado: result,
        status: estado,
        capital_previo: cPrevio
    })
}

function deleteDataJson(id) {
    let json = jsonData.tableData;
    let encontado = false;
    let arrayUpdate = [];

    for (let i = 0; i < json.length; i++) {
        if (encontado == false) {
            if (json[i].id_Data == id) {
                encontado = true;
                capital.innerHTML = json[i].capital_previo;
                jsonData.tableData = arrayUpdate;
            } else {
                arrayUpdate.push(json[i]);
            }
        } else {
            let operaciones = parseInt(opTotal.innerHTML);
            let fila = document.getElementById(json[i].id_Data);
            fila.remove();
            if (json[i].status == "Ganada") {
                let winT = parseInt(winTotal.innerHTML);
                winT -= 1;
                winTotal.innerHTML = " " + winT;

                operaciones -= 1;
                opTotal.innerHTML = " " + operaciones;
                addDataWin(json[i].par, json[i].ratio, json[i].bs);
            } else {
                let lossT = parseInt(lossTotal.innerHTML);
                lossT -= 1;
                lossTotal.innerHTML = " " + lossT;

                operaciones -= 1;
                opTotal.innerHTML = " " + operaciones;
                addDataLoss(json[i].par, json[i].ratio, json[i].bs)
            }
        }
    }
}

function removeRow(id, estado) {
    let operaciones = parseInt(opTotal.innerHTML);
    let fila = document.getElementById(id);
    fila.remove();

    if (estado == "win") {
        let winT = parseInt(winTotal.innerHTML);
        winT -= 1;
        winTotal.innerHTML = " " + winT;
    } else if (estado == "loss") {
        let lossT = parseInt(lossTotal.innerHTML);
        lossT -= 1;
        lossTotal.innerHTML = " " + lossT;
    }

    operaciones -= 1;
    opTotal.innerHTML = " " + operaciones;
    deleteDataJson(id);

}

function generateIDrow(activo) {
    let letras = "asdfghjklpoiuytrewqzxcvbnm";
    let id = activo;

    for (let i = 0; i < 10; i++) {
        id += letras.charAt(Math.floor(Math.random() * 25));
    }

    return id
}

btnSave.addEventListener("click", () => {
    let element = document.body;
    html2pdf().set({
        margin: 1,
        filename: 'Backtest.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3,
            letterRendering: true
        },
        jsPDF: {
            unit: 'in',
            format: 'a3',
            orientation: 'portrait'
        }
    }).from(element).save().catch(err => console.log(err));
})

function addDataWin(activo, ratio, byse) {
    let winT = parseInt(winTotal.innerHTML);
    let dinerito = parseInt(capital.innerHTML);
    let operaciones = parseInt(opTotal.innerHTML);
    let template = "";
    let resultado = dinerito + ((dinerito * ratio) / 100);
    let identificador = generateIDrow(activo.value);

    //Add to Json
    buildJSON(identificador, activo.toUpperCase(), ratio, byse, (dinerito * ratio) / 100, "Ganada", capital.innerHTML);

    //Update data
    capital.innerHTML = resultado;
    winT += 1;
    operaciones += 1;
    winTotal.innerHTML = " " + winT;
    opTotal.innerHTML = " " + operaciones;


    //Add to table
    template = `<tr><td>${activo.toUpperCase()}</td> <td>1:${ratio}</td> <td>${byse}</td> <td>${(dinerito * ratio) / 100}\$</td><td>Ganada</td><td><a class='ui red label'><i class='trash alternate icon'></i></a></td> </tr>`;
    table.insertRow(0).innerHTML = template;

    document.getElementsByTagName("tr")[1].setAttribute('id', identificador);
    document.getElementById(identificador).getElementsByTagName("a")[0].addEventListener("click", () => removeRow(identificador, "win"));
}

function addDataLoss(activo, ratio, byse) {
    let lossT = parseInt(lossTotal.innerHTML);
    let dinerito = parseInt(capital.innerHTML);
    let operaciones = parseInt(opTotal.innerHTML);
    let resultado = dinerito - (dinerito / 100);
    let identificador = generateIDrow(activo.value);

    //Add to Json
    buildJSON(identificador, activo.toUpperCase(), ratio, byse, dinerito / 100, "Perdida", capital.innerHTML);

    //Update data
    capital.innerHTML = resultado;
    lossT += 1;
    operaciones += 1;
    lossTotal.innerHTML = " " + lossT;
    opTotal.innerHTML = " " + operaciones;

    //Add to table
    template = `<tr> <td>${activo.toUpperCase()}</td> <td>1:${ratio}</td> <td>${byse}</td> <td>-${dinerito / 100}\$</td><td>Perdida</td><td><a class='ui red label'><i class='trash alternate icon'></i></a></td> </tr>`;
    table.insertRow(0).innerHTML = template;

    document.getElementsByTagName("tr")[1].setAttribute('id', identificador);
    document.getElementById(identificador).getElementsByTagName("a")[0].addEventListener("click", () => removeRow(identificador, "loss"));
}

btnWin.addEventListener("click", function () {
    let ratio = parseFloat(rr.value);
    let byse = bs.value;

    if (ratio > 0 && activo.value != "") {
        addDataWin(activo.value, ratio, byse);
    } else {
        //Errors
        if (ratio <= 0) {
            alert("Introduzca un valor mayor a 0 en RR");
        }

        if (activo.value == "") {
            alert("Introduzca un activo");
        }
    }
});

btnLoss.addEventListener("click", function () {
    let ratio = parseFloat(rr.value);
    let byse = bs.value;
    if (activo.value != "") {
        addDataLoss(activo.value, ratio, byse);
    } else {
        //Errors
        if (activo.value == "") {
            alert("Introduzca un activo");
        }
    }
});

console.log("Alexis es joto!!")
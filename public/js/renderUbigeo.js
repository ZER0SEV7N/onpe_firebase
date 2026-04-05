import { onpeController } from "./connection.js";

document.addEventListener('DOMContentLoaded', async () =>{
    const selAmbito = document.getElementById('cdgoAmbito');
    const selDep = document.getElementById('cdgoDep');
    const selProv = document.getElementById('cdgoProv');
    const selDist = document.getElementById('cdgoDist');
    const divLocal = document.getElementById('divLocal');
    const divActas = document.getElementById('divDetalle');

    selAmbito.addEventListener('change', async() => {
        const ambito = selAmbito.value === "P" ? "Peru" : "Extranjero";

        //Limpiar selects y divs
        resetSelect(selDep, "--SELECCIONE--");
        resetSelect(selProv, "--SELECCIONE--");
        resetSelect(selDist, "--SELECCIONE--");

        const departmanetos = await onpeController("ACTAS", "DEP", {ambito});
        llenarSelect(selDep, departmanetos, "Departamento");
    });

    selDep.addEventListener('change', async() => {
        const ambito = selAmbito.value === "P" ? "Peru" : "Extranjero";
        const dep = selDep.value;

        //Limpiar selects y divs
        resetSelect(selProv, "--SELECCIONE--");
        resetSelect(selDist, "--SELECCIONE--");
        const provincias = await onpeController("ACTAS", "PROV", {ambito, dep});
        llenarSelect(selProv, provincias, "Provincia");
    });

    selProv.addEventListener('change', async() => {
        const ambito = selAmbito.value === "P" ? "Peru" : "Extranjero";
        const dep = selDep.value;
        const prov = selProv.value;

        resetSelect(selDist, "--SELECCIONE--");
        const distritos = await onpeController("ACTAS", "DIST", {ambito, dep, prov});
        llenarSelect(selDist, distritos, "Distrito");
    });

    selDist.addEventListener('change', async() => {
        const ambito = selAmbito.value === "P" ? "Peru" : "Extranjero";
        const params = { 
            ambito, 
            dep: selDep.value, 
            prov: selProv.value, 
            dist: selDist.value 
        };
        const locales = await onpeController("ACTAS", "LOCAL", params);
        renderSelectLocales(locales);
    });

    //Funcion para reiniciar un select
    function resetSelect(elemento, textoDefault) {
        elemento.innerHTML = `<option value="">${textoDefault}</option>`;
    }

    //Funcion para llenar un select con datos
    function llenarSelect(elemento, datos, campo){
        datos.forEach(item => {
            const option = document.createElement('option');
            option.value = item[campo];
            option.textContent = item[campo];
            elemento.appendChild(option);
        });
    }

    //Funcion para renderizar los locales de votacion
    function renderSelectLocales(locales) {
        let html = `<select id="selLocal" class="form-control">
                        <option value="">--SELECCIONE--</option>`;
        locales.forEach(loc => {
            html += `<option value="${loc.idLocalVotacion}">${loc.RazonSocial}</option>`;
        });
        html += `</select>`;
        divLocal.innerHTML = html;

        document.getElementById('selLocal').addEventListener('change', async (e) => {
            const idLocal = e.target.value;
            const mesas = await onpeController("ACTAS", "MESA", {local: idLocal});
            renderListaMesas(mesas);
        });
    }

    //Funcion para renderizar las mesas de votacion
    function renderListaMesas(mesas){
        let html = `<div class="col-xs-12 pbot30">
                    <p class="subtitle">LISTADO DE MESAS</p>
                    <div id="page-wrap">
                        <table class="table17" cellspacing="0">
                            <tbody><tr>`;
        
        mesas.forEach((mesa, index) => {
            if (index > 0 && index % 10 === 0) html += `</tr><tr>`;
            html += `<td style="cursor:pointer" onclick="verActa('${mesa.idGrupoVotacion}')">
                        <a href="#posicion">${mesa.idGrupoVotacion}</a>
                    </td>`;
        });

        html += `</tr></tbody></table></div></div>`;
        divActas.innerHTML = html;
    }

});

function renderDetalle(acta) {
    const divDetalle = document.getElementById('divDetalle');
    divDetalle.innerHTML = `
        <div class="contenido-resultados">
            <p>&nbsp;</p>
            <div class="row">
                <div class="tab-info">
                    <div class="tab-content">
                        <div class="tab-info-desc">
                            <button class="btn btn-primary pull-right" onclick="location.reload()" type="button">
                                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> REGRESAR
                            </button>
                            <div class="row">
                                <div class="col-xs-12">
                                    <p class="subtitle1">ACTA ELECTORAL: Mesa N° ${acta.idGrupoVotacion}</p>
                                    <p class="subtitle1">INFORMACIÓN UBIGEO</p>
                                    <div id="page-wrap">
                                        <table class="table14" cellspacing="0">
                                            <tbody>
                                                <tr class="titulo_tabla">
                                                    <td>Departamento</td>
                                                    <td>Provincia</td>
                                                    <td>Distrito</td>
                                                    <td>Local de votación</td>
                                                </tr>
                                                <tr>
                                                    <td>${acta.Departamento}</td>
                                                    <td>${acta.Provincia}</td>
                                                    <td>${acta.Distrito}</td>
                                                    <td>${acta.RazonSocial}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="col-xs-12">
                                    <p class="subtitle1">INFORMACIÓN MESA</p>
                                    <div id="page-wrap">
                                        <table class="table15" cellspacing="0">
                                            <tbody>
                                                <tr class="titulo_tabla">
                                                    <td>Electores hábiles</td>
                                                    <td>Total votantes</td>
                                                    <td>Estado del acta</td>
                                                </tr>
                                                <tr>
                                                    <td>${acta.ElectoresHabiles}</td>
                                                    <td>${acta.TotalVotantes}</td>
                                                    <td>ACTA ELECTORAL NORMAL</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="col-xs-12">
                                    <p class="subtitle1">INFORMACIÓN DEL ACTA ELECTORAL</p>
                                    <div id="page-wrap" class="cont-tabla1">
                                        <table class="table06">
                                            <tbody>
                                                <tr class="titulo_tabla">
                                                    <td colspan="2">Organización política</td>
                                                    <td>Total de Votos</td>
                                                </tr>
                                                <tr>
                                                    <td>PERUANOS POR EL KAMBIO</td>
                                                    <td><img width="40px" height="40px" src="images/simbolo_pkk.jpg"></td>
                                                    <td>${acta.P1}</td>
                                                </tr>
                                                <tr>
                                                    <td>FUERZA POPULAR</td>
                                                    <td><img width="40px" height="40px" src="images/simbolo_keyko.jpg"></td>
                                                    <td>${acta.P2}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">VOTOS EN BLANCO</td>
                                                    <td>${acta.VotosBlancos}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">VOTOS NULOS</td>
                                                    <td>${acta.VotosNulos || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">VOTOS IMPUGNADOS</td>
                                                    <td>${acta.VotosImpugnados || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">TOTAL DE VOTOS EMITIDOS</td>
                                                    <td>${acta.TotalVotantes}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

//Función global para ver el detalle del acta al hacer click en una mesa
window.verActa = async (idMesa) => {
    const resultados = await onpeController("ACTAS", "DETALLE", { mesa: idMesa });
    
    if (resultados.length > 0) {
        renderDetalle(resultados[0]);
        document.getElementById('divDetalle').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("No se encontraron datos para la mesa " + idMesa);
    }
};
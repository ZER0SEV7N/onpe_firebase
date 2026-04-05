import { onpeController } from "./connection.js";

document.addEventListener('DOMContentLoaded', async () =>{
    const btnBuscar = document.querySelector('.btn-primary');
    const inputMesa = document.getElementById('nroMesa');
    const divActas = document.getElementById('divDetalle');

    btnBuscar.addEventListener('click', async () =>{
        const nroMesa = inputMesa.value.trim();

        if(nroMesa === "") {
            alert("Por favor, ingrese un número de mesa.");
            return;
        }

        const resultados = await onpeController("ACTAS", "DETALLE", { mesa: nroMesa });

        if (resultados.length > 0) {
            renderDetalleActa(resultados[0]);
        } else {
            divActas.innerHTML = `
                <div class="contenido-resultados">
                    <div class="row">
                        <div class="tab-info">EL NÚMERO DE MESA QUE HA INGRESADO NO EXISTE</div>
                    </div>
                </div>`;
        }
    });
});

function renderDetalleActa(acta) {
    const divDetalle = document.getElementById('divDetalle');
    divDetalle.innerHTML = `
        <div class="contenido-resultados">
            <p>&nbsp;</p>
            <div class="row">
                <div class="tab-info">
                    <div class="tab-content">
                        <div class="tab-info-desc">
                            <div class="row">
                                <div class="col-xs-12">
                                    <p class="subtitle1">ACTA ELECTORAL: Mesa N° ${acta.idGrupoVotacion}</p>
                                    <p class="subtitle1">INFORMACIÓN UBIGEO</p>
                                    <div id="page-wrap">
                                        <table class="table14" cellspacing="0">
                                            <tr class="titulo_tabla">
                                                <td>Departamento</td><td>Provincia</td><td>Distrito</td><td>Local</td>
                                            </tr>
                                            <tr>
                                                <td>${acta.Departamento}</td><td>${acta.Provincia}</td>
                                                <td>${acta.Distrito}</td><td>${acta.RazonSocial}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <div class="col-xs-12">
                                    <p class="subtitle1">INFORMACIÓN MESA</p>
                                    <div id="page-wrap">
                                        <table class="table15" cellspacing="0">
                                            <tr class="titulo_tabla">
                                                <td>Electores hábiles</td><td>Total votantes</td><td>Estado del acta</td>
                                            </tr>
                                            <tr>
                                                <td>${acta.ElectoresHabiles}</td><td>${acta.TotalVotantes}</td>
                                                <td>ACTA ELECTORAL NORMAL</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <div class="col-xs-12">
                                    <p class="subtitle1">INFORMACIÓN DEL ACTA ELECTORAL</p>
                                    <div id="page-wrap" class="cont-tabla1">
                                        <table class="table06">
                                            <tr class="titulo_tabla">
                                                <td colspan="2">Organización política</td><td>Total de Votos</td>
                                            </tr>
                                            <tr>
                                                <td>PERUANOS POR EL KAMBIO</td>
                                                <td><img width="40px" src="images/simbolo_pkk.jpg"></td>
                                                <td>${acta.P1}</td>
                                            </tr>
                                            <tr>
                                                <td>FUERZA POPULAR</td>
                                                <td><img width="40px" src="images/simbolo_keyko.jpg"></td>
                                                <td>${acta.P2}</td>
                                            </tr>
                                            <tr><td colspan="2">VOTOS EN BLANCO</td><td>${acta.VotosBlancos}</td></tr>
                                            <tr><td colspan="2">VOTOS NULOS</td><td>${acta.VotosNulos || 0}</td></tr>
                                            <tr><td colspan="2">TOTAL DE VOTOS EMITIDOS</td><td>${acta.TotalVotantes}</td></tr>
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
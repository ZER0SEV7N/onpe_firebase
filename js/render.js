import { getParticipacionNA, getParticipacionEX } from "./connection.js";

//DOM
document.addEventListener('DOMContentLoaded', async () =>{
    const contenido = document.getElementById('resultados')

    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");

    renderParticipacion(contenido, id)

    //Renderizar participacion:
    async function renderParticipacion(contenido, id) {
        let participaciones;
        let titulo;
        if (id === "1"){
            participaciones = await getParticipacionNA();
            titulo = "DEPARTAMENTO"
        }else if (id === "2"){
            participaciones = await getParticipacionEX();
            titulo = "CONTINENTE"
        }

        //Verificar que estoy recibiendo los datos
        console.log(participaciones)

        let html = `<tr class="titulo_tabla">
                    <td>${titulo}</td>
                          <td>TOTAL ASISTENTES</td>
                          <td>% TOTAL ASISTENTES</td>
                          <td>TOTAL AUSENTES</td>
                          <td>% TOTAL AUSENTES</td>
                          <td>ELECTORES HÁBILES</td>
                        </tr>
                        `;

        participaciones.forEach(participacion => {
            html += `<tr onclick="location.href='./participacion_total.html?id=${id}?distrito?='" onmouseover="this.style.cursor ='pointer'; this.style.color = 'grey';" onmouseout="this.style.color = 'black'" style="cursor: pointer; color: black;">
                          <td>${participacion.DPD}</td>
                          <td>${participacion.PTV}</td>
                          <td>${participacion.TV}</td>
                          <td>${participacion.PTA}</td>
                          <td>${participacion.TA}</td>
                          <td>${participacion.EH}</td>
                        </tr>`
        });

        html += `<tr>
                <td>TOTALES</td>
                <td>00</td>
                <td>81.543%</td>
                <td></td>
                <td>18.457%</td>
                <td></td>
            </tr>
            `;
        contenido.innerHTML = html;
        
    }

});




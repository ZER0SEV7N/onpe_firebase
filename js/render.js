import { onpeController } from "./connection.js";

//DOM
document.addEventListener('DOMContentLoaded', async () =>{
    const contenido = document.getElementById('resultados')
    //url para obtener el id del ámbito (Nacional o Extranjero)
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    const dep = url.get("dep");
    const prov = url.get("prov");

    //Renderizar participación según lo que se vaya solicitando
    renderParticipacion(contenido, id, dep, prov);

    //Renderizar participacion:
    async function renderParticipacion(contenido, id, dep, prov) {
        let participaciones;
        let titulo;

        //Obtener los datos de participación según el ámbito y nivel solicitado
        let nivel = "DEP";
        if (dep && prov ) nivel = "DIST";
        else if (dep ) nivel = "PROV";
        //Determinar el nivel de participacion
        switch(nivel) {
            case "DEP":
                titulo = id === "1" ? "DEPARTAMENTO" : "CONTINENTE";
                participaciones = await onpeController(nivel, id);
                break;
            case "PROV":
                titulo = id === "1" ? "PROVINCIA" : "PAÍS";
                participaciones = await onpeController(nivel, id, dep);
                break;
            case "DIST":
                titulo = id === "1" ? "DISTRITO" : "CIUDAD";
                participaciones = await onpeController(nivel, id, dep, prov);
                break;
        }

        //Verificar que estoy recibiendo los datos
        console.log(`Renderizando nivel: ${nivel}`, participaciones);

        let html = `<tr class="titulo_tabla">
                    <td>${titulo}</td>
                          <td>TOTAL ASISTENTES</td>
                          <td>% TOTAL ASISTENTES</td>
                          <td>TOTAL AUSENTES</td>
                          <td>% TOTAL AUSENTES</td>
                          <td>ELECTORES HÁBILES</td>
                        </tr>
                        `;

        //Elementos para sumar los totales
        let sumaAsistentes = 0;
        let sumaAusentes = 0;
        let sumaHabiles = 0;

        participaciones.forEach(participacion => {
            //Limpiar los números de comas para sumarlos correctamente
            sumaAsistentes += Number(participacion.TV.replace(/,/g, '')) || 0;
            sumaAusentes += Number(participacion.TA.replace(/,/g, '')) || 0;
            sumaHabiles += Number(participacion.EH.replace(/,/g, '')) || 0;

            //Construir la url de destino y el estilo del cursor según el nivel actual
            let nextUrl = "";
            let pointerStyle = "";
           if (nivel === "DEP") {
                // Hago clic en Dep -> Voy a Prov
                nextUrl = `location.href='./participacion_total.html?id=${id}&dep=${encodeURIComponent(participacion.DPD)}'`;
                pointerStyle = `cursor: pointer;`;
            } else if (nivel === "PROV") {
                // Hago clic en Prov -> Voy a Dist
                nextUrl = `location.href='./participacion_total.html?id=${id}&dep=${encodeURIComponent(dep)}&prov=${encodeURIComponent(participacion.DPD)}'`;
                pointerStyle = `cursor: pointer;`;
            }
            let filaInteractiva = nextUrl 
                ? `onclick="${nextUrl}" onmouseover="this.style.color = 'grey';" onmouseout="this.style.color = 'black'" style="${pointerStyle} color: black;"` 
                : `style="color: black;"`;
            html += `<tr ${filaInteractiva}>
                          <td>${participacion.DPD}</td>
                          <td>${participacion.TV}</td>
                          <td>${participacion.PTV}</td>
                          <td>${participacion.TA}</td>
                          <td>${participacion.PTA}</td>
                          <td>${participacion.EH}</td>
                        </tr>
            `;
        });
        //Calcular los porcentajes totales, evitando división por cero
        let porcentajeAsistentes = sumaHabiles > 0 ? ((sumaAsistentes / sumaHabiles) * 100).toFixed(3) + "%" : "0.000%";
        let porcentajeAusentes = sumaHabiles > 0 ? ((sumaAusentes / sumaHabiles) * 100).toFixed(3) + "%" : "0.000%";

        html += `<tr>
                <td>TOTALES</td>
                <td>${sumaAsistentes.toLocaleString('en-US')}</td>
                <td>${porcentajeAsistentes}%</td>
                <td>${sumaAusentes.toLocaleString('en-US')}</td>
                <td>${porcentajeAusentes}%</td>
                <td>${sumaHabiles.toLocaleString('en-US')}</td>
            </tr>
            `;
        contenido.innerHTML = html;
        
    }

});




import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, where,query } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDrJXY1IdfSYPTBQa8uffHh_7kyqBW9tiw",
authDomain: "daniel-onpe.firebaseapp.com",
projectId: "daniel-onpe",
storageBucket: "daniel-onpe.firebasestorage.app",
messagingSenderId: "572748032570",
appId: "1:572748032570:web:72fd6769ba14a341bd6303"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Funciones para obtener datos de participación
const getParticipacionNA = async () => getDocs(query(collection(db, "participacionNA"), where("DPD", "!=", "TOTAL"), orderBy("DPD")));
const getParticipacionEX = async () => getDocs(query(collection(db, "participacionEX"), where("DPD", "!=", "TOTAL"), orderBy("DPD")));
const getParticipacionPROV = async (departamento) => getDocs(query(collection(db, `participacionPROV`), where("Departamento", "==", departamento), orderBy("DPD")));
const getParticipacionDIST = async (departamento, provincia) => getDocs(query(collection(db, `participacionDIST`), where("Departamento", "==", departamento), where("Provincia", "==", provincia), orderBy("DPD")));

//Funciones para obtener datos de actas
const getDepartamentosActas = async (ambito) => {
    const collname = ambito === "Peru" ? "localesVotacionNA" : "localesVotacionEX";
    return getDocs(query(collection(db, collname), where("Ambito", "==", ambito), orderBy("Departamento")));
} 
const getProvinciasActas = async (ambito, departamento) => {
    const collname = ambito === "Peru" ? "localesVotacionNA" : "localesVotacionEX";
    return getDocs(query(collection(db, collname), where("Ambito", "==", ambito), where("Departamento", "==", departamento), orderBy("Provincia")));
}
const getDistritosActas = async (ambito, departamento, provincia) => {
    const collname = ambito === "Peru" ? "localesVotacionNA" : "localesVotacionEX";
    return getDocs(query(collection(db, collname), where("Ambito", "==", ambito), where("Departamento", "==", departamento), where("Provincia", "==", provincia), orderBy("Distrito")));
}

const getLocalesActas = async (ambito, departamento, provincia, distrito) => {
    const collname = ambito === "Peru" ? "localesVotacionNA" : "localesVotacionEX";
    return getDocs(query(collection(db, collname), where("Ambito", "==", ambito), where("Departamento", "==", departamento), where("Provincia", "==", provincia), where("Distrito", "==", distrito), orderBy("RazonSocial")));
}

const getMesas = async (idLocal) => getDocs(query(collection(db, "mesas"), where("idLocalVotacion", "==", idLocal), orderBy("idGrupoVotacion")));

const getActas = async (nroMesa) => getDocs(query(collection(db, "actas"), where("idGrupoVotacion", "==", nroMesa)));


//Controladora para obtener los datos de participacion en especifico
export const onpeController = async (seccion, nivel, params = {}) => {
    try{
        let result = null;
        const { ambito, dep, prov, dist, local, mesa, id } = params;
        //Participación
        if(seccion === "PARTICIPACION"){
            if(nivel === "DEP")
                result = id === "1" ? await getParticipacionNA() : await getParticipacionEX();
            else if(nivel === "PROV")
                result = await getParticipacionPROV(dep);
            else if(nivel === "DIST")
                result = await getParticipacionDIST(dep, prov);
        //Actas
        } else if(seccion === "ACTAS"){
            switch(nivel) {
                case "DEP":   result = await getDepartamentosActas(ambito); break;
                case "PROV":  result = await getProvinciasActas(ambito, dep); break;
                case "DIST":  result = await getDistritosActas(ambito, dep, prov); break;
                case "LOCAL": result = await getLocalesActas(ambito, dep, prov, dist); break;
                case "MESA":  result = await getMesas(local); break;
                case "DETALLE": result = await getActas(mesa); break;
            }
        }
        //Verificar que estoy recibiendo los datos
        if(!result) return [];  
        const data = result.docs.map(doc => doc.data());

        //Si es participación, eliminar duplicados y ordenar alfabéticamente
        if (seccion === "ACTAS" && ["DEP", "PROV", "DIST"].includes(nivel)) {
            const campo = nivel === "DEP" ? "Departamento" : (nivel === "PROV" ? "Provincia" : "Distrito");
            return [...new Map(data.map(item => [item[campo], item])).values()]
                   .sort((a, b) => a[campo].localeCompare(b[campo]));
        }

        return data;
    }catch(error){
        console.error("Error en onpeController:", error);
        return [];
    }
}


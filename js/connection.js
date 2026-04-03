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

//Controladora para obtener los datos de participacion en especifico
export const onpeController = async (nivel, id, departamento, provincia) => {
    try{
        let data = null;
        if(nivel === "DEP")
            data = id === "1" ? await getParticipacionNA() : await getParticipacionEX();
        else if(nivel === "PROV")
            data = await getParticipacionPROV(departamento);
        else if(nivel === "DIST")
            data = await getParticipacionDIST(departamento, provincia);
        return data ? data.docs.map(doc => doc.data()) : [];
    }catch(error){
        console.error("Error en onpeController:", error);
        return [];
    }
}


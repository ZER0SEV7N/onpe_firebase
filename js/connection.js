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

export async function getParticipacionNA() {
    const partRef = query(collection(db, "participacionNA"), where("DPD", "!=", "TOTAL"), orderBy("DPD"));
    const snapshot = await getDocs(partRef);
    return snapshot.docs.map(doc => ({
        idFirebase: doc.id,
        ...doc.data()
    }));
}

export async function getParticipacionEX() {
    const partRef = query(collection(db, "participacionEX"), where("DPD", "!=", "TOTAL"), orderBy("DPD"));
    const snapshot = await getDocs(partRef);
    return snapshot.docs.map(doc => ({
        idFirebase: doc.id,
        ...doc.data()
    }));
}


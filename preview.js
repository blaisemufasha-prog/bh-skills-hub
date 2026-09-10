import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB589OXINetS1PMr2i8SSU6YRZ-khF3nj8",
    authDomain: "bh-skills-hub.firebaseapp.com",
    projectId: "bh-skills-hub",
    storageBucket: "bh-skills-hub.firebasestorage.app",
    messagingSenderId: "503359590632",
    appId: "1:503359590632:web:5b81f57e402addaf2bb95d6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let project = null;


/* =========================
   LOAD PROJECT
========================= */

function getSavedProject(){

    const preview =
        localStorage.getItem("bhPreviewProject");

    if(preview){

        try{
            return JSON.parse(preview);
        }
        catch(e){}
    }

    const builder =
        localStorage.getItem("bhAcademicProject");

    if(builder){

        try{
            return JSON.parse(builder);
        }
        catch(e){}
    }

    return null;
}


async function loadProject(user){

    const message =
        document.getElementById("message");

    project = getSavedProject();

    if(!project){

        message.innerHTML =
            "No project found.";

        return;
    }


    if(user && project.id){

        try{

            const projectRef = doc(
                db,
                "users",
                user.uid,
                "projects",
                project.id
            );

            const snap =
                await getDoc(projectRef);

            if(snap.exists()){

                project = {
                    ...project,
                    ...snap.data()
                };

                localStorage.setItem(
                    "bhPreviewProject",
                    JSON.stringify(project)
                );
            }

        }
        catch(error){

            console.log(
                "Firebase:",
                error
            );
        }
    }


    message.innerHTML =
        escapeHTML(
            project.title ||
            "Academic Project"
        );

    renderProject();
}


/* =========================
   RENDER
========================= */

function renderProject(){

    const container =
        document.getElementById("document");

    container.innerHTML = "";


    container.appendChild(
        createCover()
    );


    const sections =
        project.sections || {};


    Object.keys(sections).forEach(
        key => {

            const content =
                sections[key];

            const paper =
                document.createElement("div");

            paper.className =
                "paper section";

            paper.innerHTML = `
                <h1>
                    ${escapeHTML(
                        cleanTitle(key)
                    )}
                </h1>

                <div class="content">
                    ${
                        content ||
                        `<p class="empty">
                            No content added yet.
                         </p>`
                    }
                </div>
            `;

            container.appendChild(
                paper
            );
        }
    );


    renderReferences(container);
}


/* =========================
   COVER
========================= */

function createCover(){

    const paper =
        document.createElement("div");

    paper.className =
        "paper";

    paper.innerHTML = `

        <div class="cover">

            <h2>
                ${escapeHTML(
                    project.university ||
                    "UNIVERSITY"
                )}
            </h2>

            <p>
                ${escapeHTML(
                    project.faculty || ""
                )}
            </p>

            <p>
                ${escapeHTML(
                    project.department || ""
                )}
            </p>

            <h1>
                ${escapeHTML(
                    project.title ||
                    "ACADEMIC PROJECT"
                )}
            </h1>

            <p>
                <strong>Author:</strong>
                ${escapeHTML(
                    project.author || ""
                )}
            </p>

            <p>
                <strong>Supervisor:</strong>
                ${escapeHTML(
                    project.supervisor || ""
                )}
            </p>

            <p>
                ${escapeHTML(
                    project.year ||
                    new Date().getFullYear()
                )}
            </p>

        </div>
    `;

    return paper;
}


/* =========================
   REFERENCES
========================= */

function renderReferences(container){

    if(
        !Array.isArray(
            project.references
        )
    ){
        return;
    }


    if(
        project.references.length === 0
    ){
        return;
    }


    const paper =
        document.createElement("div");

    paper.className =
        "paper section";


    let html =
        "<h1>References</h1>";


    project.references.forEach(
        (ref,index) => {

            html += `
                <p>
                    ${index + 1}.
                    ${formatReference(ref)}
                </p>
            `;
        }
    );


    paper.innerHTML = `
        ${html}
    `;


    container.appendChild(
        paper
    );
}


/* =========================
   WORD
========================= */

window.exportWord = function(){

    if(!project){

        alert(
            "Project is still loading."
        );

        return;
    }


    const content =
        document.getElementById(
            "document"
        ).innerHTML;


    const wordHTML = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
${escapeHTML(
    project.title ||
    "Academic Project"
)}
</title>

<style>

body{
    font-family:Arial,sans-serif;
    margin:50px;
    line-height:1.7;
}

.paper{
    page-break-after:always;
    margin-bottom:50px;
}

.cover{
    text-align:center;
    min-height:900px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
}

h1{
    text-align:center;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,td{
    border:1px solid #000;
    padding:8px;
}

img{
    max-width:100%;
}

</style>

</head>

<body>

${content}

</body>

</html>
`;


    const blob =
        new Blob(
            [wordHTML],
            {
                type:
                "application/msword"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");


    a.href = url;


    a.download =
        safeFileName(
            project.title ||
            "BH_Skills_Hub_Project"
        ) + ".doc";


    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);


    setTimeout(
        () => URL.revokeObjectURL(url),
        1000
    );

};


/* =========================
   PDF
========================= */

window.exportPDF = function(){

    if(!project){

        alert(
            "Project is still loading."
        );

        return;
    }


    /*
      PDF uses the phone/browser
      Print → Save as PDF.
    */

    window.print();

};


/* =========================
   PRINT
========================= */

window.printProject = function(){

    if(!project){

        alert(
            "Project is still loading."
        );

        return;
    }


    window.print();

};


/* =========================
   EDIT
========================= */

window.goEdit = function(){

    window.location.href =
        "chapter-builder.html";

};


/* =========================
   REVIEW
========================= */

window.goReview = function(){

    window.location.href =
        "review.html";

};


/* =========================
   HELPERS
========================= */

function cleanTitle(title){

    return String(title)
        .replace(
            /^[📄📜✅❤️🙏📑🖼📊🔤📋📖📅💰📚📎]\s*/,
            ""
        )
        .trim();
}


function formatReference(ref){

    if(typeof ref === "string"){

        return escapeHTML(ref);
    }


    const author =
        ref.author || "";

    const year =
        ref.year || "";

    const title =
        ref.title ||
        ref.bookTitle ||
        ref.bookArticleTitle ||
        "";

    const publisher =
        ref.publisher ||
        ref.journal ||
        "";

    const url =
        ref.url ||
        ref.doi ||
        "";


    return `
        ${escapeHTML(author)}
        ${
            year
            ? `(${escapeHTML(year)}).`
            : ""
        }
        ${escapeHTML(title)}.
        ${escapeHTML(publisher)}
        ${
            url
            ? ` ${escapeHTML(url)}`
            : ""
        }
    `;
}


function escapeHTML(value){

    return String(value ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}


function safeFileName(name){

    return String(name)
        .replace(/[\\/:*?"<>|]/g,"")
        .replace(/\s+/g,"_")
        .substring(0,100);
}


/* =========================
   AUTH
========================= */

onAuthStateChanged(
    auth,
    user => {

        loadProject(user);

    }
);
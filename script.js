
console.log("JavaScript est bien chargé !");

const formulaire = document.getElementById("formulaire-simulation");
console.log("Formulaire détecté :", formulaire);

formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    const capital = Number(document.getElementById("capital").value);
    const duree = Number(document.getElementById("duree").value);
    const versement = Number(document.getElementById("versement").value);
    const frequence = Number(document.getElementById("frequence").value);
    const taux = Number(document.getElementById("taux").value);

    
    // Vérifier les données saisies
    if (
        !Number.isFinite(capital) ||
        !Number.isFinite(duree) ||
        !Number.isFinite(versement) ||
        !Number.isFinite(frequence) ||
        !Number.isFinite(taux)
    ) {
        alert("Veuillez saisir des valeurs numériques valides.");
        return;
    }

    if (capital < 0) {
        alert("Le capital initial ne peut pas être négatif.");
        return;
    }

    if (duree <= 0) {
        alert("La durée doit être supérieure à zéro.");
        return;
    }

    if (versement < 0) {
        alert("Le versement périodique ne peut pas être négatif.");
        return;
    }

    if (taux <= -100) {
        alert("Le taux annuel doit être supérieur à -100 %.");
        return;
    }

    if (![1, 2, 4, 12].includes(frequence)) {
        alert("Veuillez choisir une fréquence de versement valide.");
        return;
    }

    if (!Number.isInteger(duree * 12)) {
        alert("Choisissez une durée correspondant à un nombre entier de mois.");
        return;
    }


    // Convertir le taux annuel en taux mensuel équivalent
    const tauxAnnuel = taux / 100;
    const tauxMensuel = Math.pow(1 + tauxAnnuel, 1 / 12) - 1;

    console.log("Taux mensuel équivalent :", tauxMensuel * 100, "%");


    // Initialiser le capital et les compteurs
    let solde = capital;
    let totalVersements = capital;
    const nombreMois = duree * 12;
    const intervalleVersement = 12 / frequence;
    
    // Préparer les données du tableau annuel
    const donneesAnnuelles = [];

    // Faire évoluer le capital mois après mois
    for (let mois = 1; mois <= nombreMois; mois++) {

        // Ajouter les intérêts du mois
        solde = solde * (1 + tauxMensuel);

        // Ajouter un versement à la fin de la période prévue
        if (mois % intervalleVersement === 0) {
            solde = solde + versement;
            totalVersements = totalVersements + versement;
        }
        // Enregistrer les données à chaque fin d'année
        if (mois % 12 === 0) {
            
            const annee = mois / 12;

            const interetsCumules = solde - totalVersements;

            const interetsCumulesPrecedents =
                donneesAnnuelles.length > 0
                    ? donneesAnnuelles[donneesAnnuelles.length - 1].interetsCumules
                    : 0;

            donneesAnnuelles.push({
                annee: annee,

                capitalDebut: annee === 1
                    ? capital
                    : donneesAnnuelles[donneesAnnuelles.length - 1].capitalFinal,

                versementsCumules: totalVersements - capital,

                interetsAnnee:
                    interetsCumules - interetsCumulesPrecedents,

                interetsCumules: interetsCumules,

                capitalFinal: solde
            });

        
        }

    }

    // Calculer les intérêts cumulés
    const interets = solde - totalVersements;

    // Afficher les résultats
    
    // Préparer le format d'affichage en FCFA
    const formatFCFA = new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0
    });

    // Afficher les résultats dans la page
    document.getElementById("capital-final").textContent =
        formatFCFA.format(solde) + " FCFA";

    document.getElementById("total-investi").textContent =
        formatFCFA.format(totalVersements) + " FCFA";

    document.getElementById("interets-generes").textContent =
        formatFCFA.format(interets) + " FCFA";

        
    // Générer le tableau annuel
    const corpsTableau = document.getElementById("corps-tableau");

    corpsTableau.innerHTML = "";

    donneesAnnuelles.forEach(function (donnee) {
        const ligne = document.createElement("tr");

        
        ligne.innerHTML = `
            <td>${donnee.annee}</td>
            <td>${formatFCFA.format(donnee.capitalDebut)} FCFA</td>
            <td>${formatFCFA.format(donnee.versementsCumules)} FCFA</td>
            <td>${formatFCFA.format(donnee.interetsAnnee)} FCFA</td>
            <td>${formatFCFA.format(donnee.interetsCumules)} FCFA</td>
            <td>${formatFCFA.format(donnee.capitalFinal)} FCFA</td>
        `;


        corpsTableau.appendChild(ligne);
    });

    
    // Préparer les données du graphique
    const labelsGraphique = ["Départ"];
    const donneesCapital = [capital];
    const donneesInvesties = [capital];

    donneesAnnuelles.forEach(function (donnee) {
        labelsGraphique.push("Année " + donnee.annee);
        donneesCapital.push(donnee.capitalFinal);
        donneesInvesties.push(
            capital + donnee.versementsCumules
        );
    });

    // Créer le graphique
    const canvas = document.getElementById("graphique-capital");

    if (window.graphiqueCapital) {
        window.graphiqueCapital.destroy();
    }

    window.graphiqueCapital = new Chart(canvas, {
        type: "line",

        data: {
            labels: labelsGraphique,

            datasets: [
                {
                    label: "Capital final",
                    data: donneesCapital,
                    borderColor: "#167d55",
                    backgroundColor: "rgba(22, 125, 85, 0.12)",
                    fill: true,
                    tension: 0.3
                },
                {
                    label: "Total investi",
                    data: donneesInvesties,
                    borderColor: "#3478c0",
                    backgroundColor: "rgba(52, 120, 192, 0.08)",
                    fill: false,
                    tension: 0.3
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (valeur) {
                            return new Intl.NumberFormat("fr-FR")
                                .format(valeur) + " FCFA";
                        }
                    }
                }
            }
        }
    });


const formulaire = document.getElementById("formulaire-simulation");

formulaire.addEventListener("reset", function () {
    setTimeout(function () {
        // Réinitialiser les résultats
        document.getElementById("capital-final").textContent = "0 FCFA";
        document.getElementById("total-investi").textContent = "0 FCFA";
        document.getElementById("interets-generes").textContent = "0 FCFA";

        // Vider le tableau annuel
        document.getElementById("corps-tableau").innerHTML = "";

        // Supprimer les données annuelles
    donneesAnnuelles.length = 0;

        // Supprimer le graphique
        if (window.graphiqueCapital) {
            window.graphiqueCapital.destroy();
            window.graphiqueCapital = null;
        }
    }, 0);
});

document.getElementById("exporter-pdf").addEventListener("click", async function () {

    // Vérifier que la bibliothèque PDF est disponible
    if (!window.jspdf) {
        alert("La bibliothèque PDF n'est pas chargée. Vérifie ta connexion Internet.");
        return;
    }

    // Récupérer les paramètres de la simulation
    const capitalInitial = Number(document.getElementById("capital").value);
    const duree = Number(document.getElementById("duree").value);
    const versement = Number(document.getElementById("versement").value);
    const frequence = Number(document.getElementById("frequence").value);
    const taux = Number(document.getElementById("taux").value);

    // Récupérer les résultats affichés
    const capitalFinalTexte = document.getElementById("capital-final").textContent;
    const totalInvestiTexte = document.getElementById("total-investi").textContent;
    const interetsTexte = document.getElementById("interets-generes").textContent;

    // Vérifier qu'une simulation a été réalisée
    if (donneesAnnuelles.length === 0) {
        alert("Effectue d'abord une simulation avant d'exporter les résultats.");
        return;
    }

    // Créer le document PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Préparer l'emplacement du logo dans le PDF
   // Ajouter le logo au PDF si le fichier est disponible

function ajouterLogoPDF() {
    return new Promise(function (resolve) {
        const imageLogo = new Image();

        imageLogo.onload = function () {
            const canvasLogo = document.createElement("canvas");
            canvasLogo.width = imageLogo.naturalWidth;
            canvasLogo.height = imageLogo.naturalHeight;

            const contexte = canvasLogo.getContext("2d");
            contexte.drawImage(imageLogo, 0, 0);

            const logoEnBase64 = canvasLogo.toDataURL("image/jpeg", 0.95);

            // Mémoriser la page actuellement active
            const pageActuelle = pdf.internal.getCurrentPageInfo().pageNumber;

            // Ajouter le logo sur la première page
            pdf.setPage(1);
            pdf.addImage(logoEnBase64, "JPEG", 165, 10, 30, 18);

            // Revenir à la page précédemment active
            pdf.setPage(pageActuelle);

            resolve();
        };

        imageLogo.onerror = function () {
            alert("Le logo n'a pas pu être chargé dans le PDF. Vérifie le dossier images.");
            resolve();
        };

        imageLogo.src = "logo.jpg";
    });
}


    // Préparer le format des montants
    
const formatPDF = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    useGrouping: true
});

function formaterMontantPDF(valeur) {
    return formatPDF.format(valeur).replace(/[\u202F\u00A0]/g, " ");
}


    // Titre du document
    // En-tête du document PDF
pdf.setFontSize(18);
pdf.text("Rapport de simulation", 15, 20);

pdf.setFontSize(11);
pdf.text("Interets composes - CLIENT BABOI", 15, 27);
ajouterLogoPDF();


    // Paramètres de la simulation
    pdf.setFontSize(12);
    pdf.text("PARAMETRES DE LA SIMULATION", 15, 40);

    pdf.setFontSize(10);
    pdf.text("Capital initial : " + formaterMontantPDF(capitalInitial) + " FCFA", 15, 47);
    pdf.text("Duree : " + duree + " an(s)", 15, 53);
    pdf.text("Versement periodique : " + formaterMontantPDF(versement) + " FCFA", 15, 61);
    pdf.text("Frequence : " + frequence + " versement(s) par an", 15, 69);
    pdf.text("Taux annuel : " + taux + " %", 15, 77);

    // Résultats de la simulation
    pdf.setFontSize(12);
    pdf.text("RESULTATS", 15, 92);

    pdf.setFontSize(10);
    
pdf.text(
    "Capital final : " +
    formaterMontantPDF(Number(capitalFinalTexte.replace(/[^\d]/g, ""))) +
    " FCFA",
    15, 102
);

pdf.text(
    "Total investi : " +
    formaterMontantPDF(Number(totalInvestiTexte.replace(/[^\d]/g, ""))) +
    " FCFA",
    15, 110
);

pdf.text(
    "Interets generes : " +
    formaterMontantPDF(Number(interetsTexte.replace(/[^\d]/g, ""))) +
    " FCFA",
    15, 118
);

   
    // Tableau annuel
    pdf.setFontSize(12);
    pdf.setTextColor(30, 50, 80);
    pdf.text("EVOLUTION ANNUELLE", 15, 135);

    const colonnes = [
        { titre: "Annee", x: 15, largeur: 20 },
        { titre: "Versements", x: 35, largeur: 35 },
        { titre: "Interets annuels", x: 70, largeur: 35 },
        { titre: "Interets cumules", x: 105, largeur: 40 },
        { titre: "Capital final", x: 145, largeur: 50 }
    ];

    let y = 145;
    const hauteurLigne = 9;
    const debutX = 15;
    const largeurTableau = 180;

    // En-tête bleu marine
    pdf.setFillColor(30, 50, 80);
    pdf.rect(debutX, y - 6, largeurTableau, hauteurLigne, "F");

    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");

    colonnes.forEach(function (colonne) {
        pdf.text(colonne.titre, colonne.x + 2, y);
    });

    y += hauteurLigne;
    pdf.setFont("helvetica", "normal");

    donneesAnnuelles.forEach(function (donnee, index) {

        // Créer une nouvelle page si nécessaire
        if (y > 275) {
            pdf.addPage();
            y = 20;

            // Répéter l'en-tête sur la nouvelle page
            pdf.setFillColor(30, 50, 80);
            pdf.rect(debutX, y - 6, largeurTableau, hauteurLigne, "F");

            pdf.setFontSize(8);
            pdf.setTextColor(255, 255, 255);
            pdf.setFont("helvetica", "bold");

            colonnes.forEach(function (colonne) {
                pdf.text(colonne.titre, colonne.x + 2, y);
            });

            y += hauteurLigne;
            pdf.setFont("helvetica", "normal");
        }

        // Alterner les couleurs des lignes
        if (index % 2 === 0) {
            pdf.setFillColor(240, 244, 248);
            pdf.rect(debutX, y - 6, largeurTableau, hauteurLigne, "F");
        }

        // Bordures de la ligne
        pdf.setDrawColor(190, 200, 210);
        pdf.setLineWidth(0.2);
        pdf.rect(debutX, y - 6, largeurTableau, hauteurLigne, "S");

        // Séparateurs verticaux
        [35, 70, 105, 145].forEach(function (x) {
            pdf.line(x, y - 6, x, y + 3);
        });

        pdf.setFontSize(8);
        pdf.setTextColor(40, 40, 40);

        pdf.text(String(donnee.annee), 17, y);
        pdf.text(formaterMontantPDF(donnee.versementsCumules), 37, y);
        pdf.text(formaterMontantPDF(donnee.interetsAnnee), 72, y);
        pdf.text(formaterMontantPDF(donnee.interetsCumules), 107, y);
        pdf.text(formaterMontantPDF(donnee.capitalFinal), 147, y);

        y += hauteurLigne;
    });

    // Bordure extérieure du tableau
    pdf.setDrawColor(30, 50, 80);
    pdf.setLineWidth(0.5);
    pdf.rect(debutX, 139, largeurTableau, y - 139, "S");

    // Ajouter le graphique au PDF
    if (window.graphiqueCapital) {
        const imageGraphique = window.graphiqueCapital.toBase64Image();

        // Ajouter une nouvelle page pour le graphique
        pdf.addPage();

        pdf.setFontSize(14);
        pdf.text("Evolution du capital investi", 15, 20);

        pdf.addImage(
            imageGraphique,
            "jpg",
            15,
            30,
            180,
            100
        );
    }

    // Télécharger le fichier
// Ajouter le logo puis télécharger le fichier terminé
await ajouterLogoPDF();
pdf.save("simulation_interets_composes.pdf");
});



    console.log("Capital initial :", capital);
    console.log("Durée en années :", duree);
    console.log("Versement périodique :", versement);
    console.log("Fréquence des versements :", frequence);
    console.log("Taux annuel (%) :", taux);
});

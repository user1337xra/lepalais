import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // 1. On récupère le nom du script depuis l'URL (?script=lepalais.js)
  const { script } = req.query;

  // 2. CONFIGURATION DE TA CLÉ SECRÈTE
  // Tu peux changer 'CHEZDIDI_SECRET' par ce que tu veux (ex: 'LEPALAIS_SECRET_99')
  const MY_SECRET = 'LEPALAISONTOP'; 

  // 3. On récupère le code secret envoyé dans les headers
  const clientSecret = req.headers['x-script-access'];

  // 4. Vérification de la sécurité
  if (!clientSecret || clientSecret !== MY_SECRET) {
    return res.status(403).json({ error: "Accès refusé. Clé secrète invalide ou manquante." });
  }

  if (!script) {
    return res.status(400).json({ error: "Le paramètre 'script' est requis." });
  }

  try {
    // 5. Sécurité sur le nom du fichier
    const safeScriptFilename = path.basename(script);
    const filePath = path.join(process.cwd(), 'scripts', safeScriptFilename);

    // 6. Vérification de l'existence du fichier
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Le script '${safeScriptFilename}' n'existe pas.` });
    }

    // 7. Lecture et envoi du fichier
    const fileContent = fs.readFileSync(filePath, 'utf8');

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    // On autorise explicitement le header personnalisé pour éviter les blocages CORS
    res.setHeader('Access-Control-Allow-Headers', 'x-script-access'); 

    return res.status(200).send(fileContent);

  } catch (error) {
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}
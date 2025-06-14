import emailExistence from 'email-existence';
import validator from 'validator';

export const checkValidEmail = async (req, res, next) => {
    const { mail } = req.body;

    if (!validator.isEmail(mail)) {
        return res.status(400).json({ message: 'Adresse e-mail invalide (format)' });
    }

    emailExistence.check(mail, (err, exists) => {
        if (err) {
            console.error("Erreur vérification email :", err);
            return res.status(500).json({ message: "Erreur serveur lors de la vérification d'email." });
        }

        if (!exists) {
            return res.status(400).json({ message: "Cette adresse email ne semble pas exister." });
        }

        next();
    });
};

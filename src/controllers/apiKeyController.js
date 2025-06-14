import { generateApiKey, sendApiKey, createApiKeyEntry,deleteApiKeyEntry } from '../services/apiKeyService.js';

export const createApiKey = async (req, res) => {
  const { phone, mail, role, nomorganisme } = req.body;
  const apiKey = generateApiKey(phone, mail);

  const newApiKeyEntry = {
    key_id: apiKey,
    phone,
    mail,
    role,
    nomorganisme,
  };

  try {
    await createApiKeyEntry(newApiKeyEntry);

    try {
      await sendApiKey(phone, mail, apiKey);
      return res.status(201).json({ message: 'API Key created and sent!', apiKey });
    } catch (emailError) {
      console.error('Erreur lors de l’envoi de l’e-mail :', emailError);
      await deleteApiKeyEntry(apiKey); // ⚠️ implémente cette fonction dans ton repo
      return res.status(500).json({ message: 'API Key créée mais échec de l’envoi par mail. Annulée.' });
    }

  } catch (dbError) {
    return res.status(500).json({ message: 'Erreur lors de la création de la clé API.', error: dbError });
  }
};


import { useSeo } from '../lib/seo';

export default function CGU() {
  useSeo({
    title: 'Conditions générales d\'utilisation',
    description: 'Conditions générales d\'utilisation du site Hervé Nanfang.',
    path: '/cgu',
  });

  return (
    <section className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Conditions générales d'utilisation</h1>
      <p className="mb-4">
        {/* Placez ici le texte complet des CGU. */}
        Les présentes conditions générales d’utilisation (CGU) régissent l’accès et l’utilisation du site
        https://hervenanfang.art ainsi que les services proposés. Elles sont applicables à tout utilisateur du
        site, qu’il soit visiteur ou client.
      </p>
      {/* Ajoutez d’autres sections selon le contenu réel des CGU. */}
    </section>
  );
}

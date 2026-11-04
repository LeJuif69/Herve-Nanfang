import { Btn, Container, Section } from '../components/ui';

export default function Booking() {
  return (
    <Section tone="dark" className="py-16">
      <Container>
        <h1 className="text-4xl font-display text-ivary">Demande de réservation</h1>
        <p className="mt-4 text-ivory/80">
          Sélectionnez le type d’intervention (Live, Conférence, Formation, Conseil) et remplissez le formulaire.
        </p>
        {/* Formulaire placeholder */}
        <Btn to="/contact#booking" variant="gold" className="mt-6">
          Accéder au formulaire de contact
        </Btn>
      </Container>
    </Section>
  );
}


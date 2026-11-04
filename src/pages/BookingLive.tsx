import { Btn, Container, Eyebrow, Section } from '../components/ui';

export default function BookingLive() {
  return (
    <Section tone="dark" className="py-16">
      <Container>
        <Eyebrow className="text-gold">Réservation Live</Eyebrow>
        <h1 className="text-4xl font-display text-ivory">Réservez votre prestation live</h1>
        <p className="mt-4 text-ivory/80">
          Choisissez la date, le lieu et le format de votre événement. Un formulaire détaillé vous guidera.
        </p>
        <Btn to="/contact#booking" variant="gold" className="mt-6">
          Accéder au formulaire de contact
        </Btn>
      </Container>
    </Section>
  );
}


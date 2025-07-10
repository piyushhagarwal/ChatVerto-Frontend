import { SiteHeader } from '@/components/site-header';
import WhatsAppSignupButton from '@/components/WhatsAppSignup';

export default function HomePage() {
  return (
    <>
      <SiteHeader title="Home" />
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome to the Home Page
      </h1>
      {/* <WhatsAppSignup /> */}
      <WhatsAppSignupButton />
    </>
  );
}

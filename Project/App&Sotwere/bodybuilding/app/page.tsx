import { PosingCallerApp } from "@/components/PosingCallerApp";

export default function HomePage() {
  return (
    <>
      <PosingCallerApp />
      <footer className="legal-footer px-4 pb-8">
        <div className="mx-auto w-full max-w-7xl legal-footer__inner">
          <a href="../index.html">KarimSaoud</a>
          <div className="legal-footer__links">
            <a href="../privacy.html">Privacy Policy</a>
            <a href="../cookie.html">Cookie Policy</a>
            <a href="../note-legali.html">Note legali</a>
            <a href="../accessibilita.html">Accessibilita</a>
          </div>
        </div>
      </footer>
    </>
  );
}

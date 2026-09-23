export default function SiteFooter() {
    const year = new Date().getFullYear();
  
    return (
      <footer className="site-footer">
        <div className="section-shell">
          <div className="footer-top">
            {/* Marque */}
            <div className="footer-brand-col">
              <a href="/" className="footer-brand" aria-label="Schoolify — accueil">
                schoolify
              </a>
              <p className="footer-tagline">
                Les talents de demain commencent ici.
              </p>
              <ul className="footer-socials">
                <li>
                  <a href="#" aria-label="LinkedIn" rel="noopener">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3s-2.3 1.57-2.3 3.2V21h-4z"/>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Instagram" rel="noopener">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.73.07-.9.04-1.39.19-1.71.32-.43.17-.74.36-1.06.68-.32.32-.51.63-.68 1.06-.13.32-.28.81-.32 1.71-.06 1.23-.07 1.6-.07 4.73s.01 3.5.07 4.73c.04.9.19 1.39.32 1.71.17.43.36.74.68 1.06.32.32.63.51 1.06.68.32.13.81.28 1.71.32 1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.36 1.06-.68.32-.32.51-.63.68-1.06.13-.32.28-.81.32-1.71.06-1.23.07-1.6.07-4.73s-.01-3.5-.07-4.73c-.04-.9-.19-1.39-.32-1.71a2.9 2.9 0 0 0-.68-1.06 2.9 2.9 0 0 0-1.06-.68c-.32-.13-.81-.28-1.71-.32C15.5 4.01 15.13 4 12 4zm0 3.07a4.93 4.93 0 1 1 0 9.86 4.93 4.93 0 0 1 0-9.86zm0 1.8a3.13 3.13 0 1 0 0 6.26 3.13 3.13 0 0 0 0-6.26zm5.12-2.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="X (Twitter)" rel="noopener">
                    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
                      <path fill="currentColor" d="M17.53 3h3.2l-6.99 7.99L22 21h-6.36l-4.28-5.6L6.4 21H3.2l7.28-8.32L2.4 3h6.46l4.02 5.31L17.53 3zm-1.12 16h1.42L7.7 4.9H6.18L16.41 19z"/>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
  
            <nav className="footer-col" aria-labelledby="footer-explore">
              <h4 id="footer-explore">Explorer</h4>
              <ul>
                <li><a href="#formations">Formations</a></li>
                <li><a href="#parcours">Parcours</a></li>
                <li><a href="#carrieres">Carrières</a></li>
                <li><a href="#how-it-works">Comment ça marche</a></li>
              </ul>
            </nav>
  
            <nav className="footer-col" aria-labelledby="footer-schoolify">
              <h4 id="footer-schoolify">Schoolify</h4>
              <ul>
                <li><a href="#about">À propos</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Nous contacter</a></li>
                <li><a href="/signup">Créer un compte</a></li>
              </ul>
            </nav>
  
            <nav className="footer-col" aria-labelledby="footer-contact">
              <h4 id="footer-contact">Contact</h4>
              <ul>
                <li><a href="mailto:hello@schoolify.ma">hello@schoolify.ma</a></li>
                <li><span>Casablanca, Maroc</span></li>
              </ul>
            </nav>
          </div>
  
          <div className="footer-bottom">
              <nav className="footer-legal" aria-label="Liens légaux">
                <a href="/privacy">Confidentialité</a>
                <a href="/terms">Conditions</a>
              </nav>
              <span>© {year} Schoolify EdTech. Tous droits réservés.</span>
          </div>

        </div>
      </footer>
    );
  }
  
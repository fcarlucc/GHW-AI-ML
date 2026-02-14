// Simple footer component for the agenda app
export function AppFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          Built with 💜 and GitHub Copilot
        </p>
        <p className="footer-copy">
          © {currentYear} Agenda App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

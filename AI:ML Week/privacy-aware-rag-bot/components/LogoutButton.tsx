'use client';

export default function LogoutButton() {
  return (
    <a
      href="/api/auth/logout"
      className="btn-secondary"
    >
      Logout
    </a>
  );
}

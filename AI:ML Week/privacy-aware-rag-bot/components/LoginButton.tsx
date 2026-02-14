'use client';

export default function LoginButton() {
  return (
    <a
      href="/api/auth/login"
      className="btn-primary"
    >
      Try Now
    </a>
  );
}

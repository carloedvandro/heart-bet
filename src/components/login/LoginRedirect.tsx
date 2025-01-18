import { useEffect } from "react";

export function LoginRedirect() {
  useEffect(() => {
    window.location.href = "https://ebook-heart.lovable.app/login";
  }, []);

  return null;
}
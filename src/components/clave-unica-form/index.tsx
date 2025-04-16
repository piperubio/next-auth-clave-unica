"use client";

import { signInClaveUnica } from "./action";
import { ClaveUnicaButton } from "@/components/clave-unica-button";

export function ClaveUnicaForm() {
  const onSubmit = async () => {
    await signInClaveUnica();
  };
  return (
    <form action={onSubmit}>
      <ClaveUnicaButton type="submit" border="rounded" />
    </form>
  );
}

"use client";

import React from "react";
import { SignupForm } from "@/components/SignupForm"; // Ensure this file exists

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <SignupForm />
    </div>
  );
}

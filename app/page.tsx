"use client";
import UploadField from "@components/upload";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadField value={files} onChange={(vals) => setFiles(vals)} />
    </main>
  );
}

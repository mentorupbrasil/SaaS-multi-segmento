"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomerRecord, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface RecordFormProps {
  customers: { id: string; name: string }[];
  customerLabel: string;
}

export function RecordForm({ customers, customerLabel }: RecordFormProps) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createCustomerRecord, initial);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setAttachmentUrl("");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setAttachmentUrl(data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        <Icon name="Plus" className="h-4 w-4" />
        Novo registro
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo registro</h2>
      <form ref={formRef} action={action} className="grid gap-4">
        <div>
          <label className="label">{customerLabel}</label>
          <select name="customerId" className="input" required>
            <option value="">Selecione...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Título</label>
          <input name="title" className="input" required />
        </div>
        <div>
          <label className="label">Conteúdo</label>
          <textarea name="content" className="input min-h-[100px]" rows={4} />
        </div>
        <div>
          <label className="label">Anexo (opcional)</label>
          <input type="file" className="input" accept="image/*,.pdf" onChange={handleFileChange} />
          <input type="hidden" name="attachmentUrl" value={attachmentUrl} />
          {uploading && <p className="mt-1 text-xs text-slate-500">Enviando...</p>}
          {attachmentUrl && (
            <p className="mt-1 text-xs text-green-600">Arquivo enviado: {attachmentUrl}</p>
          )}
        </div>
        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        <div className="flex gap-2">
          <SubmitButton>Salvar</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

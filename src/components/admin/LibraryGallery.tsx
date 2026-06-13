"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { LibraryRenderer } from "@/components/library/LibraryRenderer";
import type { Palette, Template } from "@/types";

export function LibraryGallery({ templates, palettes }: { templates: Template[]; palettes: Palette[] }) {
  const [paletteId, setPaletteId] = useState(palettes[0]?.id ?? "");
  const activePalette = palettes.find((palette) => palette.id === paletteId) ?? palettes[0];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium text-text-primary">Template Library</h1>
          <p className="mt-1 text-text-secondary">Reusable sections from the registry — preview them under any palette.</p>
        </div>
        {palettes.length > 0 && (
          <div className="w-64">
            <Select
              label="Preview palette"
              value={paletteId}
              onChange={(event) => setPaletteId(event.target.value)}
              options={palettes.map((palette) => ({ label: `${palette.name} · ${palette.owner}`, value: palette.id }))}
            />
          </div>
        )}
      </div>

      {!activePalette ? (
        <p className="text-sm text-text-secondary">
          No palettes found. Run <code className="rounded bg-accent/30 px-1.5 py-0.5">npm run seed:library</code> to seed the
          Leviora reference palette.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
                <div>
                  <p className="font-medium text-text-primary">{template.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-[#3f6f87] capitalize">
                      {template.category}
                    </span>
                    {template.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-secondary/30 px-2.5 py-0.5 text-xs text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-xs text-text-secondary">{template.slug}</span>
              </div>

              <div className="h-72 overflow-hidden bg-background">
                <div className="origin-top-left" style={{ transform: "scale(0.5)", width: "200%" }}>
                  <LibraryRenderer slug={template.slug} tokens={activePalette.tokens} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

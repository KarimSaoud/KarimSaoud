"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, LoaderCircle } from "lucide-react";

import { createBarcodeScanner } from "@/services/barcode-scanner";
import { foodLookupService } from "@/services/food-lookup-service";
import { FoodProduct } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BarcodeScannerDialog({
  open,
  onOpenChange,
  onProductFound
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductFound: (product: FoodProduct) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const lookupInFlightRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !videoRef.current) {
      return;
    }

    const scanner = createBarcodeScanner();
    let cancelled = false;

    scanner
      .scanFromVideo(videoRef.current, async (text) => {
        if (cancelled || lookupInFlightRef.current) {
          return;
        }

        lookupInFlightRef.current = true;
        setLoading(true);
        setError(null);

        try {
          const product = await foodLookupService.lookupByBarcode(text);

          if (!product) {
            setError("Prodotto non trovato. Puoi inserirlo manualmente.");
          } else {
            onProductFound(product);
            onOpenChange(false);
          }
        } catch {
          setError("Errore durante il recupero dei dati nutrizionali.");
        } finally {
          lookupInFlightRef.current = false;
          setLoading(false);
        }
      })
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch(() => {
        setError("Impossibile accedere alla fotocamera del browser.");
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [onOpenChange, onProductFound, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scansiona barcode o QR</DialogTitle>
          <DialogDescription>Usa la fotocamera del browser. Dopo il riconoscimento apriremo la conferma alimento.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[24px] bg-secondary">
            <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
            <div className="pointer-events-none absolute inset-6 rounded-[28px] border-2 border-dashed border-white/80" />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 rounded-[20px] bg-secondary/70 p-4 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Recupero dati nutrizionali...
            </div>
          ) : null}

          {error ? <div className="rounded-[20px] bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            <Camera className="mr-2 h-4 w-4" />
            Chiudi scanner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { ReactNode, useState } from "react";
import { ScanBarcode } from "lucide-react";

import { BarcodeScannerDialog } from "@/components/barcode-scanner-dialog";
import { ManualEntryForm } from "@/components/manual-entry-form";
import { ScanConfirmationDialog } from "@/components/scan-confirmation-dialog";
import { SearchFoodForm } from "@/components/search-food-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFoodLogStore } from "@/store/use-food-log-store";
import { FoodProduct, MealType } from "@/types";

export function AddEntrySheet({
  mealType,
  children
}: {
  mealType: MealType;
  children: ReactNode;
}) {
  const addMealEntry = useFoodLogStore((state) => state.addMealEntry);
  const [open, setOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);

  function handleConfirm(product: FoodProduct, quantity: number, source: "manual" | "search" | "barcode") {
    addMealEntry({
      mealType,
      name: product.name,
      brand: product.brand,
      quantity,
      unit: product.baseUnit,
      baseUnit: product.baseUnit,
      nutrientsPer100: product.nutrientsPer100,
      source,
      barcode: product.barcode,
      imageUrl: product.imageUrl,
      ingredients: product.ingredients,
      productId: product.id
    });

    setOpen(false);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Aggiungi alimento</SheetTitle>
            <SheetDescription>Ricerca manuale, inserimento personalizzato o scansione barcode.</SheetDescription>
          </SheetHeader>

          <div className="mt-5 space-y-4">
            <Button variant="outline" className="w-full" onClick={() => setScannerOpen(true)}>
              <ScanBarcode className="mr-2 h-4 w-4" />
              Apri scanner barcode / QR
            </Button>

            <Tabs defaultValue="search">
              <TabsList>
                <TabsTrigger value="search">Ricerca</TabsTrigger>
                <TabsTrigger value="manual">Manuale</TabsTrigger>
              </TabsList>

              <TabsContent value="search">
                <SearchFoodForm
                  onSelect={(product) => {
                    setSelectedProduct(product);
                    setConfirmationOpen(true);
                  }}
                />
              </TabsContent>

              <TabsContent value="manual">
                <ManualEntryForm
                  mealType={mealType}
                  onSubmit={(product, quantity) => handleConfirm(product, quantity, "manual")}
                />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <BarcodeScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onProductFound={(product) => {
          setSelectedProduct(product);
          setConfirmationOpen(true);
        }}
      />

      <ScanConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        product={selectedProduct}
        mealType={mealType}
        onConfirm={(product, quantity) => handleConfirm(product, quantity, product.dataSource === "manual" ? "manual" : product.barcode ? "barcode" : "search")}
      />
    </>
  );
}

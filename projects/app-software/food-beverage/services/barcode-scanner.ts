import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

export function createBarcodeScanner() {
  const reader = new BrowserMultiFormatReader();

  return {
    async scanFromVideo(video: HTMLVideoElement, onResult: (value: string) => void) {
      const controls = await reader.decodeFromVideoDevice(undefined, video, (result, error) => {
        if (result) {
          onResult(result.getText());
        }

        if (error && !(error instanceof NotFoundException)) {
          console.error(error);
        }
      });

      return controls;
    }
  };
}

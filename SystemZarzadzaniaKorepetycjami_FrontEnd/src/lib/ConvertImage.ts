async function convertImageToJpeg(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Konwersja na JPEG i zwrócenie Data URL
                const jpegDataUrl = canvas.toDataURL('image/jpeg');
                resolve(jpegDataUrl);
            };

            img.onerror = (error) => {
                reject(error);
            };

            img.src = event.target?.result as string;
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

function dataURLToByteArray(dataURL: string): Uint8Array {
    const base64 = dataURL.split(',')[1];
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
}

async function imageToByteArray(file: File): Promise<Uint8Array> {
    const jpegDataUrl = await convertImageToJpeg(file);
    return dataURLToByteArray(jpegDataUrl);
}

async function encodeFileToBase64(file: File): Promise<string> {
    const jpegDataUrl = await convertImageToJpeg(file);
    const base64String = jpegDataUrl.toString(); // TODO
    return `data:image/jpeg;base64,${base64String}`;
  }

export {convertImageToJpeg, imageToByteArray, encodeFileToBase64}
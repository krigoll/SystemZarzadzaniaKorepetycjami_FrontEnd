async function convertImageToJPEG(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(
                new Error('Nieprawidłowy typ pliku. Wymagany plik obrazu.')
            );
        }

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(
                        new Error('Nie udało się uzyskać kontekstu 2D canvas.')
                    );
                }

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                const jpegDataUrl = canvas.toDataURL('image/jpeg', 1.0);
                const base64String = jpegDataUrl.split(',')[1];

                const jpegBytes = atob(base64String);
                const byteNumbers = new Array(jpegBytes.length);
                for (let i = 0; i < jpegBytes.length; i++) {
                    byteNumbers[i] = jpegBytes.charCodeAt(i);
                }
                const jpegArray = new Uint8Array(byteNumbers);

                const jpegBlob = new Blob([jpegArray], { type: 'image/jpeg' });

                const jpegFile = new File(
                    [jpegBlob],
                    file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                    { type: 'image/jpeg' }
                );
                resolve(jpegFile);
            };
            img.onerror = (error) => reject(error);
            img.src = reader.result as string;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(
                new Error('Nieprawidłowy typ pliku. Wymagany plik obrazu.')
            );
        }

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const base64String = (event.target?.result as string).split(',')[1];
            resolve(base64String);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

function base64ToFile(base64String: string, fileName: string): File {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'image/jpeg' });

    return new File([blob], fileName, { type: 'image/jpeg' });
}

function resizeImageTo400x400(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    return reject(
                        new Error('Nie udało się uzyskać kontekstu 2D dla canvas.')
                    );
                }

                canvas.width = 400;
                canvas.height = 400;

                ctx.drawImage(img, 0, 0, 400, 400);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], 'resizedImage.jpg', {
                                type: 'image/jpeg',
                            });
                            resolve(resizedFile);
                        } else {
                            reject(
                                new Error('Nie udało się przekonwertować canvas na blob.')
                            );
                        }
                    },
                    'image/jpeg',
                    1.0
                );
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

function isImageFile(file: File): boolean {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validImageTypes.includes(file.type);
}

export {
    convertImageToJPEG,
    convertImageToBase64,
    base64ToFile,
    resizeImageTo400x400,
    isImageFile,
};

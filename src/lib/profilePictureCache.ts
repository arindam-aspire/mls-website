const DB_NAME = "mls-profile-picture-cache";
const STORE_NAME = "pictures";
const DB_VERSION = 1;

const objectUrls = new Map<string, string>();

function canUseIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function waitForTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function revokeCachedObjectUrl(userId: string) {
  const current = objectUrls.get(userId);
  if (!current) return;
  URL.revokeObjectURL(current);
  objectUrls.delete(userId);
}

export async function cacheProfilePictureFile(
  userId: string,
  file: Blob,
): Promise<string | null> {
  const id = userId.trim();
  if (!id || !canUseIndexedDb()) return null;

  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(file, id);
  await waitForTransaction(tx);
  db.close();

  revokeCachedObjectUrl(id);
  const objectUrl = URL.createObjectURL(file);
  objectUrls.set(id, objectUrl);
  return objectUrl;
}

export async function getCachedProfilePictureSrc(
  userId: string,
): Promise<string | null> {
  const id = userId.trim();
  if (!id || !canUseIndexedDb()) return null;

  const existing = objectUrls.get(id);
  if (existing) return existing;

  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const request = tx.objectStore(STORE_NAME).get(id);
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error);
  });
  await waitForTransaction(tx);
  db.close();

  if (!blob) return null;

  const objectUrl = URL.createObjectURL(blob);
  objectUrls.set(id, objectUrl);
  return objectUrl;
}

export async function clearCachedProfilePicture(userId: string): Promise<void> {
  const id = userId.trim();
  if (!id || !canUseIndexedDb()) return;

  revokeCachedObjectUrl(id);

  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(id);
  await waitForTransaction(tx);
  db.close();
}

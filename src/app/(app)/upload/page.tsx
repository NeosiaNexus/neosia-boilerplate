'use client';

import { useState } from 'react';

import {
  downloadFileAction,
  listFilesAction,
  removeFilesAction,
  uploadFileAction,
} from '@/actions/cloud-storage-file';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function UploadPage() {
  const [files, setFiles] = useState<Array<{ path: string; publicUrl: string }>>([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload(formData: FormData) {
    try {
      setLoading(true);
      const bucket = formData.get('bucket') as string;
      const file = formData.get('file') as File;
      const path = formData.get('path') as string;

      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        arrayBuffer: await file.arrayBuffer(),
      };

      await uploadFileAction({
        bucket,
        path,
        fileData,
      });

      const result = await listFilesAction({ bucket });
      if (result?.data?.success) {
        setFiles(result.data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleList(bucket: string) {
    try {
      setLoading(true);
      const result = await listFilesAction({ bucket });
      if (result?.data?.success) {
        setFiles(result.data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(bucket: string, path: string) {
    const result = await downloadFileAction({ bucket, path });
    if (result?.data?.success && result.data.url) {
      window.open(result.data.url, '_blank');
    }
  }

  async function handleDelete(bucket: string, path: string) {
    try {
      setLoading(true);
      await removeFilesAction({
        bucket,
        paths: [path],
      });
      const result = await listFilesAction({ bucket });
      if (result?.data?.success) {
        setFiles(result.data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center gap-8 w-screen h-screen">
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Téléverser un fichier</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input type="file" name="file" id="file" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bucket">Bucket</Label>
              <Input type="text" name="bucket" id="bucket" placeholder="Exemple: test" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="path">Chemin de destination</Label>
              <Input
                type="text"
                name="path"
                id="path"
                placeholder="Exemple: documents/2024"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Téléversement...' : 'Téléverser le fichier'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Liste des fichiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nom du bucket"
                onChange={e => handleList(e.target.value)}
              />
              <Button onClick={() => handleList('')} disabled={loading}>
                Rafraîchir
              </Button>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <div className="space-y-2">
                {files.map(file => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span className="truncate flex-1">{file.path}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload('test', file.path)}
                      >
                        Télécharger
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete('test', file.path)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

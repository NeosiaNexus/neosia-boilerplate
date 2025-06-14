'use client';

import { useState } from 'react';

import { Download, File, FileSearch2, Loader2, Trash } from 'lucide-react';
import { toast } from 'sonner';

import {
  downloadFileAction,
  listFilesAction,
  removeFilesAction,
  uploadFileAction,
} from '@/actions/cloud-storage-file';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storageFileType } from '@/schemas';

export default function UploadPage(): React.JSX.Element {
  const [files, setFiles] = useState<storageFileType[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const handleUpload = async (formData: FormData): Promise<void> => {
    setCreateLoading(true);

    try {
      const bucket = formData.get('bucket') as string;
      const path = formData.get('path') as string;
      const file = formData.get('file') as File;

      const res = await uploadFileAction({
        bucket,
        path,
        fileData: {
          name: file.name,
          size: file.size,
          type: file.type,
          arrayBuffer: await file.arrayBuffer(),
        },
      });

      if (!res?.data?.success) {
        toast.error(res?.data?.message);
        return;
      }

      toast.success(res?.data?.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSearch = async (formData: FormData): Promise<void> => {
    setSearchLoading(true);

    try {
      const bucket = formData.get('bucket') as string;

      const res = await listFilesAction({
        bucket,
      });

      if (!res?.data?.success) {
        toast.error(res?.data?.message);
        return;
      }

      if (res?.data?.data.length === 0) {
        toast.error('Aucun fichier trouvé');
        return;
      }

      setFiles(res?.data?.data);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDownload = async (formData: FormData): Promise<void> => {
    setSearchLoading(true);

    try {
      const bucket = formData.get('bucket') as string;
      const path = formData.get('path') as string;

      const res = await downloadFileAction({
        bucket,
        path,
      });

      if (!res?.data?.success) {
        toast.error(res?.data?.message);
        return;
      }

      toast.success(res?.data?.message);
      window.open(res?.data?.url as string, '_blank');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = async (formData: FormData): Promise<void> => {
    setSearchLoading(true);

    try {
      const bucket = formData.get('bucket') as string;
      const path = formData.get('path') as string;

      const res = await removeFilesAction({
        bucket,
        paths: [path],
      });

      if (!res?.data?.success) {
        toast.error(res?.data?.message);
        return;
      }

      toast.success(res?.data?.message);

      setFiles(files.filter(file => file.path !== path));
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center gap-8 w-screen h-screen">
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Stockage</CardTitle>
          <CardDescription>Envoyer des fichiers vers le cloud</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" action={handleUpload}>
            <div className="flex flex-col gap-2">
              <Label>File</Label>
              <Input type="file" name="file" required disabled={createLoading} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bucket</Label>
              <Input
                type="text"
                name="bucket"
                required
                placeholder="ex: bucket-name"
                disabled={createLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Chemin</Label>
              <Input
                type="text"
                name="path"
                required
                placeholder="ex: path/to/file"
                disabled={createLoading}
              />
            </div>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? <Loader2 className="animate-spin" /> : 'Envoyer'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Fichiers</CardTitle>
          <CardDescription>Liste des fichiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <form className="flex gap-2" action={handleSearch}>
              <Input type="text" name="bucket" required placeholder="ex: bucket-name" />
              <Button variant="outline" size="icon" type="submit" disabled={searchLoading}>
                {searchLoading ? <Loader2 className="animate-spin" /> : <FileSearch2 />}
              </Button>
            </form>
            <div className="flex flex-col gap-2">
              {searchLoading ? (
                <Loader2 className="animate-spin self-center" />
              ) : files.length > 0 ? (
                files.map(file => (
                  <Card key={file.path}>
                    <CardContent className="flex justify-between">
                      <Label>{file.path}</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const formData = new FormData();

                            formData.append('bucket', file.bucket);
                            formData.append('path', file.path);

                            return handleDownload(formData);
                          }}
                        >
                          <Download />{' '}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const formData = new FormData();

                            formData.append('bucket', file.bucket);
                            formData.append('path', file.path);

                            return handleDelete(formData);
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert>
                  <File className="h-4 w-4" />
                  <AlertTitle>Oops...</AlertTitle>
                  <AlertDescription>Aucun fichier trouvé</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

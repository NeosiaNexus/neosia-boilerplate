import { removeFilesAction, uploadFileAction } from '@/actions/cloud-storage-file';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function UploadTestPage() {
  return (
    <div className="container py-10">
      <form
        action={async () => {
          'use server';

          await removeFilesAction({
            bucket: 'test',
            paths: ['charlene/salutoi/ninho.jpeg'],
          });
        }}
      >
        <Button type="submit">Supprimer</Button>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Page d&apos;upload</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async formData => {
              'use server';

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
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input type="file" name="file" id="file" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bucket">Bucket</Label>
              <Input type="text" name="bucket" id="bucket" placeholder="Exemple: test" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="path">Chemin de destination</Label>
              <Input type="text" name="path" id="path" placeholder="Exemple: documents/2024" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileName">
                Nom du fichier<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="fileName"
                id="fileName"
                placeholder="Exemple: document.pdf"
              />
            </div>

            <Button type="submit" className="w-full">
              Téléverser le fichier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { uploadFileAction } from '@/actions/cloud-storage-file';

export default async function UploadTestPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Page d&apos;upload</h2>
      <form
        action={async formData => {
          'use server';

          const file = formData.get('file') as File;

          await uploadFileAction({
            bucket: 'test',
            fileData: {
              name: file.name,
              size: file.size,
              type: file.type,
              arrayBuffer: await file.arrayBuffer(),
            },
            path: 'test',
            upsert: true,
          });
        }}
      >
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

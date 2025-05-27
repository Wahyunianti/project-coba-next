import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads');

  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error membuat folder upload:', err);
    return res.status(500).json({ message: 'Failed to create upload directory', error: (err as Error).message });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
  });

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // file.filepath adalah path sementara file yang diupload
    // file.originalFilename adalah nama file asli
    // Karena kita sudah set uploadDir dan keepExtensions, file sudah otomatis tersimpan di folder uploadDir, jadi kita bisa langsung pakai filepath

    // Jika ingin rename, bisa dipindahkan pakai fs.rename, tapi optional
    // Untuk sekarang, kita langsung pakai file.filepath sebagai lokasi file

    // Dapatkan nama file dan buat URL nya:
    const fileName = file.originalFilename || 'uploaded-file';
    const fileUrl = `/uploads/${fileName}`;

    // Pastikan file sudah ada di uploadDir (formidable sudah otomatis simpan di situ)
    // Kalau mau rename sesuai nama asli, bisa pakai fs.rename dulu

    // Contoh rename supaya nama file sesuai originalFilename (optional)
    const newPath = path.join(uploadDir, fileName);
    if (file.filepath !== newPath) {
      await fs.rename(file.filepath, newPath);
    }

    return res.status(200).json({ fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload gagal', error: (error as Error).message });
  }
}

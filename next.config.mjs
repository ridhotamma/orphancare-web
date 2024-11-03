/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'picsum.photos',
      'randomuser.me',
      'file-upload-bucket.nos.jkt-1.neo.id',
      'akagami-documents.nos.wjv-1.neo.id',
      'staging-file-upload.nos.jkt-1.neo.id'
    ],
  },
};

export default nextConfig;

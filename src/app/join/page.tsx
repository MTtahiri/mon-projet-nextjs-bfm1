import CVUploadForm from '@/components/CVUploadForm';

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Rejoindre notre réseau de consultants
          </h1>
          <CVUploadForm />
        </div>
      </div>
    </div>
  );
}
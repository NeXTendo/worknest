export default function AboutPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About WorkNest</h1>
      
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-worknest-teal mb-4">Developed by TechOhns</h2>
          <p className="text-gray-600 mb-4">
            WorkNest is a comprehensive Employee Management System designed and developed by TechOhns,
            a technology company based in Lusaka, Zambia.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Company Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Company</dt>
              <dd className="font-medium">TechOhns</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Location</dt>
              <dd className="font-medium">Lusaka, Zambia 🇿🇲</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Established</dt>
              <dd className="font-medium">2024</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Industry</dt>
              <dd className="font-medium">Technology</dd>
            </div>
          </dl>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Development Team</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-worknest-teal flex items-center justify-center text-white font-bold">
                PM
              </div>
              <div>
                <p className="font-semibold">Pumulo Mubiana</p>
                <p className="text-sm text-gray-600">Developer</p>
                <p className="text-sm text-worknest-teal">+260975271902</p>
                <a href="https://www.linkedin.com/in/pumulo-mubiana" className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-worknest-emerald flex items-center justify-center text-white font-bold">
                SW
              </div>
              <div>
                <p className="font-semibold">Samuel Wakumelo</p>
                <p className="text-sm text-gray-600">Developer</p>
                <p className="text-sm text-worknest-teal">+260971632781</p>
                <a href="https://www.linkedin.com/in/samuel-wakumelo" className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Copyright & License</h3>
          <p className="text-gray-600">
            © 2024 TechOhns. All rights reserved.
            <br />
            This software is proprietary and confidential.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Product Information</h3>
          <p className="text-gray-600">
            <strong>Version:</strong> 1.0.0<br />
            <strong>Build:</strong> Production<br />
            <strong>Stack:</strong> Next.js 14, Supabase, TypeScript
          </p>
        </div>
      </div>
    </div>
  )
}
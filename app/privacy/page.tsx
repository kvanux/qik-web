export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Information We Collect
          </h2>
          <p className="text-gray-700">
            When you use Google Sign-In, we receive your email address and basic
            profile information from Google.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            How We Use Your Information
          </h2>
          <p className="text-gray-700">
            We use this information only for authentication purposes and to
            provide you with our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Data Storage and Protection
          </h2>
          <p className="text-gray-700">
            We implement reasonable security measures to protect your personal
            information. Your data is stored securely and accessed only when
            necessary to provide our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
          <p className="text-gray-700">
            We use Google OAuth for authentication. Please refer to
            Google&apos;s Privacy Policy to understand how they handle your
            data.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <p className="text-gray-700">
            You have the right to access, correct, or delete your personal
            information. You can also request information about how your data is
            being used.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us
            at: <span className="text-blue-600">nkhanhvan293@gmail.com</span>
          </p>
        </div>
      </section>
    </main>
  );
}

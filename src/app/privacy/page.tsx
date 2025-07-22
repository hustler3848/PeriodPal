import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader title="Privacy Notice" backButton={true} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Our Commitment to Your Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              Welcome to PeriodPal. We are deeply committed to protecting your privacy and handling your personal data with care and respect. This notice explains how we collect, use, and protect your information.
            </p>
            <h3 className="font-semibold text-lg font-headline pt-2">Information We Collect</h3>
            <p>
              When you use our AI Chatbot, your questions are processed to provide you with relevant information. We use state-of-the-art models to answer your questions. Conversations are not permanently stored with any personal identifiers. We cache frequently asked questions anonymously to improve our service.
            </p>
            <h3 className="font-semibold text-lg font-headline pt-2">How We Use Your Information</h3>
            <p>
              The information from your chats is used solely to provide and improve the chatbot service. We do not use it for advertising or sell it to third parties. Location data used in the "Find Free Products" feature is used only to show you nearby locations and is not stored.
            </p>
            <h3 className="font-semibold text-lg font-headline pt-2">Data Security</h3>
            <p>
              We implement strong security measures to protect your data. Since this is a sensitive topic, we've designed PeriodPal to be as anonymous as possible. You are not required to create an account or provide any personal information to use our core features.
            </p>
            <h3 className="font-semibold text-lg font-headline pt-2">Your Consent</h3>
            <p>
              By using PeriodPal, you consent to our privacy policy. If you have any questions, please feel free to reach out. Your trust is important to us.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

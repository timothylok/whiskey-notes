import { WhiskeyForm } from "@/components/whiskey-form";

export const metadata = { title: "Add a whiskey" };

export default function NewWhiskeyPage() {
  return (
    <div className="grid max-w-md gap-6">
      <h1 className="text-2xl font-semibold">Add a whiskey</h1>
      <WhiskeyForm />
    </div>
  );
}

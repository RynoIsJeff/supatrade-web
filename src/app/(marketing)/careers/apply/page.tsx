import ApplicationForm from "@/components/ApplicationForm"

export const metadata = { title: "General Application – SupaTrade" }

export default function GeneralApplyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">General Application</h1>
      <p className="mb-6 text-slate-600">
        Submit your CV and details for future opportunities within the SupaTrade Group.
      </p>
      <ApplicationForm />
    </div>
  )
}

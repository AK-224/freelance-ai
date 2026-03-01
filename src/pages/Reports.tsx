export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Reports</h2>
        <button className="px-4 py-2 bg-bg-card border border-border-color text-text-primary rounded-lg text-sm font-semibold hover:bg-bg-primary transition-colors">
          Download PDF
        </button>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-color p-8 text-center text-text-secondary">
        <p>Reporting and analytics features coming soon.</p>
      </div>
    </div>
  );
}

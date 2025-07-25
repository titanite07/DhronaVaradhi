import KanbanBoard from "@/components/KanbanBoard";

export default function TrackerPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
          My Job Application Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Organize your job search. Drag and drop jobs to track your progress from &ldquo;Saved&rdquo; to &ldquo;Hired&rdquo;.
        </p>
      </div>
      <KanbanBoard />
    </main>
  );
}

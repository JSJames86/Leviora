import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/icons";
import { LibraryGallery } from "@/components/admin/LibraryGallery";
import { getTemplateLibrary } from "@/lib/data/library";

export default async function AdminLibraryPage() {
  const { templates, palettes } = await getTemplateLibrary();

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={<SparkleIcon className="size-6" />}
        title="No templates yet"
        description="Run npm run seed:library to index the component registry into the catalog."
      />
    );
  }

  return <LibraryGallery templates={templates} palettes={palettes} />;
}

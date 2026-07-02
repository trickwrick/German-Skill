import AdminCoursesContent from "../../_components/AdminCoursesContent";
import { getGermanCoursesForDisplay } from "../../../../lib/courseContentStore";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getGermanCoursesForDisplay({ fresh: true });

  return <AdminCoursesContent courses={courses} />;
}

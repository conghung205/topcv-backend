import { useParams } from "react-router-dom";
import SearchJobsPage from "../../pages/SearchJobsPage";
import CVBuilderPage from "../../pages/CVBuilderPage";

export default function DynamicSlugRoute() {
    const { slug } = useParams();

    if (slug?.startsWith("tim-viec-lam-")) {
        return <SearchJobsPage />;
    }

    if (slug?.startsWith("mau-cv-")) {
        return <CVBuilderPage />;
    }

    return <SearchJobsPage />;
}

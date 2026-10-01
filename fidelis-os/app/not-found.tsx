import SiteLayout from "./(site)/layout";
import { Intro } from "@/components/Intro";

// Unmatched URLs land here, outside the (site) group, so it brings the site shell itself.
export default function NotFound() {
  return (
    <SiteLayout>
      <Intro title="Not found." lead="Fidelis holds no record of this." />
    </SiteLayout>
  );
}

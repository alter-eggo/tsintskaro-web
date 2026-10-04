import { aboutData } from "@/lib/mock-data/about";
import MissionSection from "@/components/about/MissionSection";
import ActivitiesSection from "@/components/about/ActivitiesSection";
import LeadershipSection from "@/components/about/LeadershipSection";
import StatisticsSection from "@/components/about/StatisticsSection";
import JoinSection from "@/components/about/JoinSection";

export default function SocietyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Hero */}
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Общество цинцкаройских греков «Цинцкаро» — общественная организация,
            объединяющая представителей греческой диаспоры из села Цинцкаро
          </p>
        </div>

        {/* Mission & Values */}
        <MissionSection mission={aboutData.mission} values={aboutData.values} />

        {/* Statistics */}
        <StatisticsSection statistics={aboutData.statistics} />

        {/* Activities */}
        <ActivitiesSection activities={aboutData.activities} />

        {/* Leadership */}
        <LeadershipSection leadership={aboutData.leadership} />

        {/* How to Join */}
        <JoinSection
          joinInfo={aboutData.joinInfo}
          contact={aboutData.contact}
        />
      </div>
    </div>
  );
}

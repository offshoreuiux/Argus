import Card from "../components/common/Card";
import BlueDocumentIcon from "../assets/images/svg/blue-document.svg";
import YellowArticleIcon from "../assets/images/svg/yellow-article.svg";
import GreenCheckIcon from "../assets/images/svg/green-check.svg";
import StatCard from "../components/obligation/StatCard";
import ObligationsList from "../components/obligation/ObligationsList";

const statsArr = [
  {
    id: "regulation",
    value: "GDPR",
    title: "Regulation",
    icon: BlueDocumentIcon,
    bgColor: "#EAF5FF",
    borderColor: "#CAE5F7",
    iconBoxBg: "#CFE7FF",
  },
  {
    id: "article",
    value: "Art. 5-39",
    title: "Article Reference",
    icon: YellowArticleIcon,
    bgColor: "#FFF9E8",
    borderColor: "#FBEBBE",
    iconBoxBg: "#FFE7B8",
  },
  {
    id: "total",
    value: "24",
    title: "Total Obligations",
    description: "Extracted from regulation",
    bgColor: "#EAF5FF",
    borderColor: "#C5DFFA",
    circleBg: "#DCEEFF",
    circleBorder: "#C8E2FF",
    circleText: "#1D78D6",
  },
  {
    id: "timestamp",
    value: "20-01-2024 14:32",
    title: "Extraction Timestamp",
    icon: GreenCheckIcon,
    bgColor: "#E8FFF2",
    borderColor: "#BAEED1",
    iconBoxBg: "#D6F7E3",
  },
  {
    id: "pending",
    value: "20",
    title: "Pending Review",
    description: "Awaiting Approval",
    bgColor: "#FFEAEA",
    borderColor: "#F9D0D0",
    circleBg: "#FFDCDC",
    circleBorder: "#FFC9C9",
    circleText: "#E53935",
  },
];

function ObligationReview() {
  const topRow = statsArr.slice(0, 4);
  const pending = statsArr[4];

  return (
    <div className="h-screen p-[24px] flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[24px] font-bold text-[#242424]">
          Obligation Review
        </p>
        <p className="text-[16px] text-[#7E7E7E] mt-1">
          Review and approve regulatory obligations with confidence scoring
        </p>
      </div>

      {/* Stats Container */}
      <Card className="p-0">
        <div className="grid grid-cols-4 gap-6">
          {topRow.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
          <StatCard item={pending} />
        </div>
      </Card>

      <ObligationsList />
    </div>
  );
}

export default ObligationReview;

import { useTranslation } from "react-i18next";
import CareIcon from "../../../../CAREUI/icons/CareIcon";
import ButtonV2 from "../../../Common/components/ButtonV2";
import { DailyRoundsModel } from "../../../Patient/models";
import LogUpdateCardAttribute from "./LogUpdateCardAttribute";
import { ConsultationModel } from "../../models";

interface Props {
  round: DailyRoundsModel;
  consultationData: ConsultationModel;
  onViewDetails: () => void;
  onUpdateLog?: () => void;
}
const DefaultLogUpdateCard = ({ round, ...props }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-gray-400 p-4 @container">
      <LogUpdateCardAttribute
        attributeKey={"Round Type" as any}
        attributeValue={t(round.rounds_type)}
      />
      <LogUpdateCardAttribute
        attributeKey="patient_category"
        attributeValue={round.patient_category}
      />
      <LogUpdateCardAttribute
        attributeKey="physical_examination_info"
        attributeValue={round.physical_examination_info}
      />
      <LogUpdateCardAttribute
        attributeKey="other_details"
        attributeValue={round.other_details}
      />
      <div className="mt-2 flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
        <ButtonV2
          variant="secondary"
          border
          ghost
          size="small"
          className="w-full"
          onClick={props.onViewDetails}
        >
          <CareIcon className="care-l-eye text-lg" />
          <span>{t("view_details")}</span>
        </ButtonV2>
        <ButtonV2
          variant="secondary"
          border
          ghost
          size="small"
          className="w-full"
          onClick={props.onUpdateLog}
        >
          <CareIcon className="care-l-pen text-lg" />
          <span>{t("update_log")}</span>
        </ButtonV2>
      </div>
    </div>
  );
};

export default DefaultLogUpdateCard;

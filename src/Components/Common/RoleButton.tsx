import React from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { ButtonProps } from "@material-ui/core/Button";
import ButtonV2, { ButtonProps as ButtonV2Props } from "./components/ButtonV2";

export type roleType = "readOnly";
export type buttonType = "html" | "materialUI" | "buttonV2";

const getDisableButton: (userType: string, disableFor: roleType) => boolean = (
  userType,
  disableFor
) => {
  switch (disableFor) {
    case "readOnly":
      if (
        userType === "StaffReadOnly" ||
        userType === "StateReadOnlyAdmin" ||
        userType === "DistrictReadOnlyAdmin"
      )
        return true;
      else return false;
    default:
      return false;
  }
};

export function RoleButton(props: {
  id?: string;
  className?: string;
  handleClickCB: () => void;
  children: React.ReactNode;
  disableFor: roleType;
  disabled?: boolean;
  materialButtonProps?: ButtonProps;
  buttonV2Props?: ButtonV2Props;
  buttonType: buttonType;
}) {
  const state: any = useSelector((state) => state);
  const { currentUser } = state;
  const type = currentUser.data.user_type;

  const renderHtmlButton = () => {
    return (
      <button
        id={props.id}
        className={props.className}
        onClick={props.handleClickCB}
        disabled={getDisableButton(type, props.disableFor) || props.disabled}
      >
        {props.children}
      </button>
    );
  };

  const renderMaterialUIButton = () => {
    return (
      <Button
        id={props.id}
        className={props.className}
        {...props.materialButtonProps}
        onClick={props.handleClickCB}
        disabled={getDisableButton(type, props.disableFor) || props.disabled}
      >
        {props.children}
      </Button>
    );
  };

  const renderButtonV2 = () => {
    return (
      <ButtonV2
        id={props.id}
        className={props.className}
        {...props.buttonV2Props}
        onClick={props.handleClickCB}
        disabled={getDisableButton(type, props.disableFor) || props.disabled}
      >
        {props.children}
      </ButtonV2>
    );
  };

  switch (props.buttonType) {
    case "html":
      return renderHtmlButton();
    case "materialUI":
      return renderMaterialUIButton();
    case "buttonV2":
      return renderButtonV2();
  }
}

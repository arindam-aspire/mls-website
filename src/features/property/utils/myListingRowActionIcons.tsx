import type { PropertyTableRowAction } from "@abdoun/abdoun-library";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  MessageSquareText,
  Pencil,
  Trash2,
  UserCog,
  UserMinus,
  UserPlus,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

const iconClassName = "size-4 shrink-0";

const MY_LISTING_ROW_ACTION_ICONS: Record<string, ReactNode> = {
  view: <Eye className={iconClassName} aria-hidden />,
  continue: <ArrowRight className={iconClassName} aria-hidden />,
  edit: <Pencil className={iconClassName} aria-hidden />,
  rejected_reason: <MessageSquareText className={iconClassName} aria-hidden />,
  delete: <Trash2 className={iconClassName} aria-hidden />,
  assign: <UserPlus className={iconClassName} aria-hidden />,
  approve: <CheckCircle2 className={iconClassName} aria-hidden />,
  reject: <XCircle className={iconClassName} aria-hidden />,
  reassign: <UserCog className={iconClassName} aria-hidden />,
  unassign: <UserMinus className={iconClassName} aria-hidden />,
};

export function withMyListingRowActionIcons(
  actions: PropertyTableRowAction[],
): PropertyTableRowAction[] {
  return actions.map((action) => ({
    ...action,
    icon: action.icon ?? MY_LISTING_ROW_ACTION_ICONS[action.id],
  }));
}

import { ComponentType } from "react";
import EVENT_TYPE_TO_LABELS from "../constants/eventTypeToLabels";
import { EventTypeCategories } from "../types";
import Page from "../components/shared/Page";
import RedirectHome from "../components/shared/RedirectHome";
import { Route } from "react-router";
import { capitalizeFirstLetter } from "../utils";

interface Props {
  AddComponent: ComponentType;
  EditComponent: ComponentType;
  eventType: EventTypeCategories;
  LogComponent: ComponentType;
}

export default function trackedCategoryRoutes({
  AddComponent,
  EditComponent,
  eventType,
  LogComponent,
}: Props) {
  const eventTypeLabel = EVENT_TYPE_TO_LABELS[eventType].default;

  return (
    <Route path={`/${eventType}`} key={eventType}>
      <Route element={<RedirectHome />} path="" />
      <Route
        element={
          <Page Component={AddComponent} title={`Add ${eventTypeLabel}`} />
        }
        path="add"
      />
      <Route
        element={
          <Page Component={EditComponent} title={`Edit ${eventTypeLabel}`} />
        }
        path="edit/:id"
      />
      <Route
        element={
          <Page
            Component={LogComponent}
            title={`${capitalizeFirstLetter(eventTypeLabel)} log`}
          />
        }
        path="log"
      />
    </Route>
  );
}

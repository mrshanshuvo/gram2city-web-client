import { Suspense, ComponentType } from "react";
import PageLoader from "../components/Shared/PageLoader";

/**
 * A helper to wrap lazy components with a Suspense fallback
 */
export const Loadable =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
